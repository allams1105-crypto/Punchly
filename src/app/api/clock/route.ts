import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const dLat = (lat2-lat1)*Math.PI/180;
  const dLon = (lon2-lon1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function getScheduleForDay(schedule: any, dayIdx: number) {
  const dayMap: Record<number, { active: string; start: string; end: string }> = {
    0: { active:"sunday",    start:"sunStart", end:"sunEnd" },
    1: { active:"monday",    start:"monStart", end:"monEnd" },
    2: { active:"tuesday",   start:"tueStart", end:"tueEnd" },
    3: { active:"wednesday", start:"wedStart", end:"wedEnd" },
    4: { active:"thursday",  start:"thuStart", end:"thuEnd" },
    5: { active:"friday",    start:"friStart", end:"friEnd" },
    6: { active:"saturday",  start:"satStart", end:"satEnd" },
  };
  const d = dayMap[dayIdx];
  return {
    isWorkDay: schedule[d.active],
    startTime: schedule[d.start] || schedule.startTime || "08:00",
    endTime: schedule[d.end] || schedule.endTime || "17:00",
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const userId = (session.user as any).id;
    const orgId = (session.user as any).organizationId;
    const { action, lat, lng } = await req.json();

    const [user, org] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, include: { schedule: true } }),
      prisma.organization.findUnique({ where: { id: orgId }, include: { users: { where: { role: "OWNER" } } } }),
    ]);

    if (!user || !org) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    // Geofencing check
    const orgLat = (org as any).lat;
    const orgLng = (org as any).lng;
    const geoRadius = (org as any).geoRadius || 100;
    if (orgLat && orgLng && lat && lng) {
      const distance = haversine(lat, lng, orgLat, orgLng);
      if (distance > geoRadius) {
        return NextResponse.json({
          error: `Estás muy lejos (${Math.round(distance)}m). Debes estar a menos de ${geoRadius}m.`,
          distance: Math.round(distance), required: geoRadius
        }, { status: 403 });
      }
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString("es", { hour:"2-digit", minute:"2-digit" });
    const dateStr = now.toLocaleDateString("es", { weekday:"long", day:"numeric", month:"long" });
    const ownerEmail = org.users?.[0]?.email;
    const alertEmail = (org as any)?.alertEmail;
    const recipients = [ownerEmail, alertEmail].filter(Boolean) as string[];

    if (action === "in") {
      const existing = await prisma.timeEntry.findFirst({ where: { userId, organizationId: orgId, clockOut: null } });
      if (existing) return NextResponse.json({ error: "Ya estás en turno" }, { status: 400 });

      const entry = await prisma.timeEntry.create({
        data: { userId, organizationId: orgId, clockIn: now, source: "mobile" },
      });

      await prisma.activityLog.create({
        data: { organizationId: orgId, userId, userName: user.name, action: "CLOCK_IN", details: "Entrada desde móvil" },
      });

      // Check late with per-day schedule
      let isLate = false;
      let lateMin = 0;
      let scheduleStart = "";
      const schedule = user.schedule;
      if (schedule) {
        const { isWorkDay, startTime } = getScheduleForDay(schedule, now.getDay());
        if (isWorkDay) {
          const [h, m] = startTime.split(":").map(Number);
          const start = new Date(now); start.setHours(h, m, 0, 0);
          lateMin = Math.floor((now.getTime() - start.getTime()) / 60000) - schedule.toleranceMin;
          scheduleStart = startTime;
          if (lateMin > 0) {
            isLate = true;
            await prisma.activityLog.create({
              data: { organizationId: orgId, userId, userName: user.name, action: "LATE",
                details: `Tardanza de ${lateMin} min desde móvil` },
            });
          }
        }
      }

      if (recipients.length > 0) {
        try {
          await resend.emails.send({
            from: "Punchly.Clock <onboarding@resend.dev>",
            to: recipients,
            subject: isLate ? `⚠️ Tardanza — ${user.name}` : `✓ Entrada — ${user.name}`,
            html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
              <h2 style="color:${isLate?"#F87171":"#34D399"}">${isLate?"⚠️ Tardanza":"✓ Entrada registrada"}</h2>
              <p><strong>${user.name}</strong> entró a las <strong style="color:#C9A84C">${timeStr}</strong></p>
              <p style="color:#666">${dateStr}</p>
              ${isLate ? `<p style="color:#F87171">Tardanza: <strong>${lateMin} min</strong> (horario: ${scheduleStart})</p>` : ""}
            </div>`,
          });
        } catch(e) {}
      }

      return NextResponse.json({ success: true, action: "in", entryId: entry.id });

    } else {
      const entry = await prisma.timeEntry.findFirst({ where: { userId, organizationId: orgId, clockOut: null }, orderBy: { clockIn: "desc" } });
      if (!entry) return NextResponse.json({ error: "No estás en turno" }, { status: 400 });
      const durationMin = Math.floor((now.getTime() - entry.clockIn.getTime()) / 60000);
      const h = Math.floor(durationMin/60); const m = durationMin%60;
      await prisma.timeEntry.update({ where: { id: entry.id }, data: { clockOut: now, durationMin } });
      await prisma.activityLog.create({
        data: { organizationId: orgId, userId, userName: user.name, action: "CLOCK_OUT",
          details: `Salida — ${h}h ${m}m trabajados` },
      });

      if (recipients.length > 0) {
        try {
          await resend.emails.send({
            from: "Punchly.Clock <onboarding@resend.dev>",
            to: recipients,
            subject: `✓ Salida — ${user.name}`,
            html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
              <h2 style="color:#60A5FA">✓ Salida registrada</h2>
              <p><strong>${user.name}</strong> salió a las <strong style="color:#C9A84C">${timeStr}</strong></p>
              <p style="color:#666">${dateStr}</p>
              <p style="color:#34D399">Trabajó: <strong>${h}h ${m}m</strong></p>
            </div>`,
          });
        } catch(e) {}
      }

      return NextResponse.json({ success: true, action: "out" });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}