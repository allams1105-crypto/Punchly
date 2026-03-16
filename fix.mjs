import { writeFileSync } from "fs";

writeFileSync("src/components/admin/ScheduleEditor.tsx", `"use client";
import { useState } from "react";

const DAYS = [
  { key: "monday",    label: "Lun", startKey: "monStart", endKey: "monEnd" },
  { key: "tuesday",   label: "Mar", startKey: "tueStart", endKey: "tueEnd" },
  { key: "wednesday", label: "Mié", startKey: "wedStart", endKey: "wedEnd" },
  { key: "thursday",  label: "Jue", startKey: "thuStart", endKey: "thuEnd" },
  { key: "friday",    label: "Vie", startKey: "friStart", endKey: "friEnd" },
  { key: "saturday",  label: "Sáb", startKey: "satStart", endKey: "satEnd" },
  { key: "sunday",    label: "Dom", startKey: "sunStart", endKey: "sunEnd" },
];

export default function ScheduleEditor({ userId, initialSchedule }: { userId: string; initialSchedule: any }) {
  const [days, setDays] = useState<Record<string,boolean>>({
    monday:    initialSchedule?.monday    ?? true,
    tuesday:   initialSchedule?.tuesday   ?? true,
    wednesday: initialSchedule?.wednesday ?? true,
    thursday:  initialSchedule?.thursday  ?? true,
    friday:    initialSchedule?.friday    ?? true,
    saturday:  initialSchedule?.saturday  ?? false,
    sunday:    initialSchedule?.sunday    ?? false,
  });

  const [times, setTimes] = useState<Record<string,string>>({
    monStart: initialSchedule?.monStart || initialSchedule?.startTime || "08:00",
    monEnd:   initialSchedule?.monEnd   || initialSchedule?.endTime   || "17:00",
    tueStart: initialSchedule?.tueStart || initialSchedule?.startTime || "08:00",
    tueEnd:   initialSchedule?.tueEnd   || initialSchedule?.endTime   || "17:00",
    wedStart: initialSchedule?.wedStart || initialSchedule?.startTime || "08:00",
    wedEnd:   initialSchedule?.wedEnd   || initialSchedule?.endTime   || "17:00",
    thuStart: initialSchedule?.thuStart || initialSchedule?.startTime || "08:00",
    thuEnd:   initialSchedule?.thuEnd   || initialSchedule?.endTime   || "17:00",
    friStart: initialSchedule?.friStart || initialSchedule?.startTime || "08:00",
    friEnd:   initialSchedule?.friEnd   || initialSchedule?.endTime   || "17:00",
    satStart: initialSchedule?.satStart || initialSchedule?.startTime || "08:00",
    satEnd:   initialSchedule?.satEnd   || initialSchedule?.endTime   || "17:00",
    sunStart: initialSchedule?.sunStart || initialSchedule?.startTime || "08:00",
    sunEnd:   initialSchedule?.sunEnd   || initialSchedule?.endTime   || "17:00",
  });

  const [tolerance, setTolerance] = useState(initialSchedule?.toleranceMin ?? 10);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    setSaving(true);
    const res = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...days, ...times, toleranceMin: tolerance }),
    });
    setMsg(res.ok ? "Guardado" : "Error");
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  }

  const inputS: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px",
    padding: "6px 8px",
    color: "#FAFAFA",
    fontSize: "12px",
    fontFamily: "var(--font-dm-sans)",
    outline: "none",
    width: "80px",
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
      <style>{\`input[type=time]:focus,input[type=range]:focus{outline:none}\`}</style>

      {/* Days with individual times */}
      <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
        {DAYS.map(d => (
          <div key={d.key} style={{
            display:"flex",alignItems:"center",gap:"10px",padding:"10px 12px",borderRadius:"12px",
            background:days[d.key]?"rgba(201,168,76,0.06)":"rgba(255,255,255,0.02)",
            border:days[d.key]?"1px solid rgba(201,168,76,0.15)":"1px solid rgba(255,255,255,0.05)",
            transition:"all 0.15s"
          }}>
            {/* Day toggle */}
            <button onClick={()=>setDays(p=>({...p,[d.key]:!p[d.key]}))}
              style={{
                width:"36px",height:"20px",borderRadius:"100px",border:"none",cursor:"pointer",
                flexShrink:0,transition:"all 0.2s",position:"relative",
                background:days[d.key]?"linear-gradient(135deg,#C9A84C,#F0D080)":"rgba(255,255,255,0.1)",
              }}>
              <div style={{
                position:"absolute",top:"2px",width:"16px",height:"16px",borderRadius:"50%",background:"white",
                transition:"all 0.2s",left:days[d.key]?"18px":"2px",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"
              }} />
            </button>

            <span style={{
              fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"12px",width:"28px",flexShrink:0,
              color:days[d.key]?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.3)"
            }}>{d.label}</span>

            {days[d.key] ? (
              <div style={{display:"flex",alignItems:"center",gap:"6px",flex:1}}>
                <input type="time" value={times[d.startKey]} onChange={e=>setTimes(p=>({...p,[d.startKey]:e.target.value}))}
                  style={inputS} />
                <span style={{color:"rgba(255,255,255,0.2)",fontSize:"11px"}}>—</span>
                <input type="time" value={times[d.endKey]} onChange={e=>setTimes(p=>({...p,[d.endKey]:e.target.value}))}
                  style={inputS} />
                <span style={{fontSize:"11px",color:"rgba(255,255,255,0.25)",fontFamily:"var(--font-dm-sans)",marginLeft:"4px"}}>
                  {(() => {
                    const [sh,sm] = times[d.startKey].split(":").map(Number);
                    const [eh,em] = times[d.endKey].split(":").map(Number);
                    const diff = (eh*60+em) - (sh*60+sm);
                    if (diff <= 0) return "";
                    return diff >= 60 ? Math.floor(diff/60)+"h"+(diff%60>0?" "+diff%60+"m":"") : diff+"m";
                  })()}
                </span>
              </div>
            ) : (
              <span style={{fontSize:"11px",color:"rgba(255,255,255,0.2)",fontFamily:"var(--font-dm-sans)"}}>Día libre</span>
            )}
          </div>
        ))}
      </div>

      {/* Tolerance */}
      <div style={{padding:"12px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}>
          <span style={{fontSize:"11px",fontWeight:600,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"1px",fontFamily:"var(--font-dm-sans)"}}>Tolerancia de llegada</span>
          <span style={{fontSize:"12px",fontWeight:700,color:"#C9A84C",fontFamily:"var(--font-syne)"}}>{tolerance} min</span>
        </div>
        <input type="range" min="0" max="60" step="5" value={tolerance}
          onChange={e=>setTolerance(Number(e.target.value))}
          style={{width:"100%",accentColor:"#C9A84C"}} />
        <div style={{display:"flex",justifyContent:"space-between",fontSize:"10px",color:"rgba(255,255,255,0.2)",marginTop:"4px",fontFamily:"var(--font-dm-sans)"}}>
          <span>0 min</span><span>60 min</span>
        </div>
      </div>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        {msg && <p style={{fontSize:"12px",color:msg==="Guardado"?"#34D399":"#F87171",fontFamily:"var(--font-dm-sans)"}}>{msg}</p>}
        <button onClick={save} disabled={saving}
          style={{marginLeft:"auto",background:"linear-gradient(135deg,#C9A84C,#F0D080)",color:"#000",padding:"10px 20px",borderRadius:"12px",fontSize:"13px",fontFamily:"var(--font-syne)",fontWeight:700,border:"none",cursor:"pointer",opacity:saving?0.6:1}}>
          {saving?"Guardando...":"Guardar horario"}
        </button>
      </div>
    </div>
  );
}`);

// Update schedule API to save per-day times
writeFileSync("src/app/api/schedule/route.ts", `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId requerido" }, { status: 400 });
    const schedule = await prisma.schedule.findUnique({ where: { userId } });
    return NextResponse.json({ schedule });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const orgId = (session.user as any).organizationId;
    const body = await req.json();
    const { userId, monday, tuesday, wednesday, thursday, friday, saturday, sunday,
      monStart, monEnd, tueStart, tueEnd, wedStart, wedEnd, thuStart, thuEnd,
      friStart, friEnd, satStart, satEnd, sunStart, sunEnd, toleranceMin } = body;

    const data: any = {
      organizationId: orgId, userId,
      monday, tuesday, wednesday, thursday, friday, saturday, sunday,
      monStart, monEnd, tueStart, tueEnd, wedStart, wedEnd, thuStart, thuEnd,
      friStart, friEnd, satStart, satEnd, sunStart, sunEnd,
      toleranceMin: toleranceMin || 10,
      // Keep legacy fields for compatibility
      startTime: monStart || "08:00",
      endTime: monEnd || "17:00",
    };

    const schedule = await prisma.schedule.upsert({
      where: { userId },
      update: data,
      create: data,
    });

    return NextResponse.json({ schedule });
  } catch (e: any) {
    console.error("Schedule error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}`);

// Update kiosk clock to use per-day schedule
writeFileSync("src/app/api/clock/route.ts", `import { auth } from "@/lib/auth";
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
          error: \`Estás muy lejos (\${Math.round(distance)}m). Debes estar a menos de \${geoRadius}m.\`,
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
                details: \`Tardanza de \${lateMin} min desde móvil\` },
            });
          }
        }
      }

      if (recipients.length > 0) {
        try {
          await resend.emails.send({
            from: "Punchly.Clock <onboarding@resend.dev>",
            to: recipients,
            subject: isLate ? \`⚠️ Tardanza — \${user.name}\` : \`✓ Entrada — \${user.name}\`,
            html: \`<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
              <h2 style="color:\${isLate?"#F87171":"#34D399"}">\${isLate?"⚠️ Tardanza":"✓ Entrada registrada"}</h2>
              <p><strong>\${user.name}</strong> entró a las <strong style="color:#C9A84C">\${timeStr}</strong></p>
              <p style="color:#666">\${dateStr}</p>
              \${isLate ? \`<p style="color:#F87171">Tardanza: <strong>\${lateMin} min</strong> (horario: \${scheduleStart})</p>\` : ""}
            </div>\`,
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
          details: \`Salida — \${h}h \${m}m trabajados\` },
      });

      if (recipients.length > 0) {
        try {
          await resend.emails.send({
            from: "Punchly.Clock <onboarding@resend.dev>",
            to: recipients,
            subject: \`✓ Salida — \${user.name}\`,
            html: \`<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
              <h2 style="color:#60A5FA">✓ Salida registrada</h2>
              <p><strong>\${user.name}</strong> salió a las <strong style="color:#C9A84C">\${timeStr}</strong></p>
              <p style="color:#666">\${dateStr}</p>
              <p style="color:#34D399">Trabajó: <strong>\${h}h \${m}m</strong></p>
            </div>\`,
          });
        } catch(e) {}
      }

      return NextResponse.json({ success: true, action: "out" });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}`);

console.log("Listo!");

