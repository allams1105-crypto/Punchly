import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY);

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
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
      prisma.organization.findUnique({ where: { id: orgId } }),
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
          error: `Estás muy lejos de la empresa (${Math.round(distance)}m). Debes estar a menos de ${geoRadius}m.`,
          distance: Math.round(distance),
          required: geoRadius
        }, { status: 403 });
      }
    }

    if (action === "in") {
      const existing = await prisma.timeEntry.findFirst({ where: { userId, organizationId: orgId, clockOut: null } });
      if (existing) return NextResponse.json({ error: "Ya estás en turno" }, { status: 400 });

      const entry = await prisma.timeEntry.create({
        data: { userId, organizationId: orgId, clockIn: new Date(), source: "mobile" },
      });

      await prisma.activityLog.create({
        data: { organizationId: orgId, userId, userName: user.name, action: "CLOCK_IN", details: "Entrada desde móvil" },
      });

      // Check late
      const schedule = user.schedule;
      if (schedule) {
        const now = new Date();
        const dayMap: Record<number, keyof typeof schedule> = { 0:"sunday",1:"monday",2:"tuesday",3:"wednesday",4:"thursday",5:"friday",6:"saturday" };
        const dayKey = dayMap[now.getDay()];
        if (schedule[dayKey]) {
          const [h, m] = schedule.startTime.split(":").map(Number);
          const start = new Date(now); start.setHours(h, m, 0, 0);
          const lateMin = Math.floor((now.getTime() - start.getTime()) / 60000) - schedule.toleranceMin;
          if (lateMin > 0) {
            await prisma.activityLog.create({
              data: { organizationId: orgId, userId, userName: user.name, action: "LATE",
                details: `Tardanza de ${lateMin} minutos (móvil)` },
            });
            const owner = await prisma.user.findFirst({ where: { organizationId: orgId, role: "OWNER" } });
            if (owner?.email) {
              try {
                await resend.emails.send({
                  from: "Punchly.Clock <onboarding@resend.dev>",
                  to: [owner.email],
                  subject: `⚠️ Tardanza — ${user.name}`,
                  html: `<p><strong>${user.name}</strong> llegó <strong>${lateMin} min tarde</strong> desde su móvil.</p>`,
                });
              } catch(e) {}
            }
          }
        }
      }

      return NextResponse.json({ success: true, action: "in", entryId: entry.id });

    } else {
      const entry = await prisma.timeEntry.findFirst({ where: { userId, organizationId: orgId, clockOut: null }, orderBy: { clockIn: "desc" } });
      if (!entry) return NextResponse.json({ error: "No estás en turno" }, { status: 400 });
      const now = new Date();
      const durationMin = Math.floor((now.getTime() - entry.clockIn.getTime()) / 60000);
      await prisma.timeEntry.update({ where: { id: entry.id }, data: { clockOut: now, durationMin } });
      await prisma.activityLog.create({
        data: { organizationId: orgId, userId, userName: user.name, action: "CLOCK_OUT", details: `Salida desde móvil — ${durationMin} min` },
      });
      return NextResponse.json({ success: true, action: "out" });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}