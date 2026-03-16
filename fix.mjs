import { writeFileSync, readFileSync, mkdirSync } from "fs";

// 1. LOGOUT — employee dashboard
let empDash = readFileSync("src/components/employee/EmployeeDashboardClient.tsx", "utf8");
if (!empDash.includes("signOut")) {
  empDash = empDash.replace(
    `"use client";`,
    `"use client";
import { signOut } from "next-auth/react";`
  );
  empDash = empDash.replace(
    `<h1 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:"#FAFAFA"}}>Mi Panel</h1>`,
    `<h1 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:"#FAFAFA"}}>Mi Panel</h1>
        <button onClick={()=>signOut({callbackUrl:"/en"})}
          style={{background:"transparent",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",padding:"6px 14px",color:"rgba(255,255,255,0.35)",fontSize:"12px",fontFamily:"var(--font-dm-sans)",cursor:"pointer",transition:"all 0.15s"}}
          onMouseEnter={e=>(e.currentTarget.style.color="#F87171")} onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.35)")}>
          Cerrar sesión
        </button>`
  );
  writeFileSync("src/components/employee/EmployeeDashboardClient.tsx", empDash);
}

// 2. Employee password — add password field to create and edit
// Update create API to accept password
writeFileSync("src/app/api/employees/create/route.ts", `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const orgId = (session.user as any).organizationId;
    const { name, email, hourlyRate, kioskPin, password } = await req.json();

    const pin = await bcrypt.hash(password || "0000", 10);
    const data: any = { name, email, hourlyRate, organizationId: orgId, pin };
    if (kioskPin && kioskPin.length === 4) {
      data.kioskPin = await bcrypt.hash(kioskPin, 10);
    }

    const user = await prisma.user.create({ data });
    await prisma.activityLog.create({
      data: { organizationId: orgId, userId: user.id, userName: user.name, action: "EMPLOYEE_CREATED", details: "Empleado creado" }
    });
    return NextResponse.json({ user });
  } catch (e: any) {
    if (e.code === "P2002") return NextResponse.json({ error: "Ya existe un empleado con ese email" }, { status: 400 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}`);

// Update new employee page with password field
writeFileSync("src/app/[locale]/admin/employees/new/page.tsx", `"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEmployeePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [password, setPassword] = useState("");
  const [kioskPin, setKioskPin] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    if (!name || !email) { setError("Nombre y email son requeridos"); return; }
    if (!password) { setError("La contraseña es requerida"); return; }
    if (kioskPin && kioskPin.length !== 4) { setError("El PIN debe tener 4 dígitos"); return; }
    setSaving(true); setError("");
    const res = await fetch("/api/employees/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, hourlyRate: Number(hourlyRate)||0, password, kioskPin }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || "Error al crear empleado"); return; }
    router.push("/en/admin/employees");
  }

  const inputS: React.CSSProperties = {
    width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
    borderRadius:"12px", padding:"10px 14px", color:"#FAFAFA", fontSize:"13px",
    fontFamily:"var(--font-dm-sans)", outline:"none", transition:"border 0.2s", boxSizing:"border-box"
  };
  const labelS: React.CSSProperties = {
    display:"block", fontSize:"11px", fontWeight:600, color:"rgba(255,255,255,0.3)",
    textTransform:"uppercase", letterSpacing:"1px", marginBottom:"8px", fontFamily:"var(--font-dm-sans)"
  };

  return (
    <div style={{flex:1,overflowY:"auto",background:"#0A0A0A"}}>
      <style>{\`input:focus{border-color:rgba(201,168,76,0.4)!important}\`}</style>
      <div style={{height:"56px",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <h1 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:"#FAFAFA"}}>Nuevo Empleado</h1>
      </div>
      <div style={{maxWidth:"520px",margin:"0 auto",padding:"24px"}}>
        <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"20px",overflow:"hidden"}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
            <h2 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:"#FAFAFA"}}>Datos del empleado</h2>
          </div>
          <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:"14px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              <div>
                <label style={labelS}>Nombre completo</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Juan Pérez" style={inputS} />
              </div>
              <div>
                <label style={labelS}>Email</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="juan@empresa.com" style={inputS} />
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              <div>
                <label style={labelS}>Contraseña (para login)</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••" style={inputS} />
                <p style={{fontSize:"10px",color:"rgba(255,255,255,0.2)",marginTop:"4px",fontFamily:"var(--font-dm-sans)"}}>El empleado usará esto para iniciar sesión</p>
              </div>
              <div>
                <label style={labelS}>PIN del Kiosk (4 dígitos)</label>
                <input type="password" value={kioskPin} onChange={e=>setKioskPin(e.target.value.replace(/\D/g,"").substring(0,4))} placeholder="1234" maxLength={4} style={inputS} />
                <p style={{fontSize:"10px",color:"rgba(255,255,255,0.2)",marginTop:"4px",fontFamily:"var(--font-dm-sans)"}}>PIN para fichar en el kiosk</p>
              </div>
            </div>
            <div>
              <label style={labelS}>Tarifa por hora ($)</label>
              <input type="number" value={hourlyRate} onChange={e=>setHourlyRate(e.target.value)} placeholder="15.00" style={{...inputS,width:"50%"}} />
            </div>
            {error && <p style={{color:"#F87171",fontSize:"13px",fontFamily:"var(--font-dm-sans)"}}>{error}</p>}
            <div style={{display:"flex",gap:"10px",paddingTop:"8px"}}>
              <button onClick={()=>router.back()} style={{flex:1,padding:"12px",borderRadius:"12px",border:"1px solid rgba(255,255,255,0.08)",background:"transparent",color:"rgba(255,255,255,0.4)",fontSize:"13px",fontFamily:"var(--font-dm-sans)",cursor:"pointer"}}>
                Cancelar
              </button>
              <button onClick={save} disabled={saving}
                style={{flex:1,padding:"12px",borderRadius:"12px",background:"linear-gradient(135deg,#C9A84C,#F0D080)",color:"#000",fontSize:"13px",fontFamily:"var(--font-syne)",fontWeight:700,border:"none",cursor:"pointer",opacity:saving?0.6:1}}>
                {saving?"Guardando...":"Crear empleado"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`);

// 3. EMAIL ON EVERY CLOCK IN — update kiosk clock API
writeFileSync("src/app/api/kiosk/clock/route.ts", `import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { userId, organizationId, action, pin } = await req.json();
  if (!userId || !organizationId || !action) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: userId }, include: { schedule: true } });
  if (!user) return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });

  const kioskPin = (user as any).kioskPin;
  if (kioskPin) {
    if (!pin) return NextResponse.json({ error: "PIN requerido" }, { status: 401 });
    const valid = await bcrypt.compare(pin, kioskPin);
    if (!valid) return NextResponse.json({ error: "PIN incorrecto" }, { status: 401 });
  }

  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: { users: { where: { role: "OWNER" } } }
  });
  const ownerEmail = org?.users?.[0]?.email;
  const alertEmail = (org as any)?.alertEmail;
  const recipients = [ownerEmail, alertEmail].filter(Boolean) as string[];

  const now = new Date();
  const timeStr = now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" });

  if (action === "in") {
    const existing = await prisma.timeEntry.findFirst({ where: { userId, organizationId, clockOut: null } });
    if (existing) return NextResponse.json({ error: "Ya está en turno" }, { status: 400 });

    const entry = await prisma.timeEntry.create({ data: { userId, organizationId, clockIn: now } });

    await prisma.activityLog.create({
      data: { organizationId, userId, userName: user.name, action: "CLOCK_IN", details: \`Entrada registrada a las \${timeStr}\` },
    });

    // Check if late
    let isLate = false;
    let lateMin = 0;
    const schedule = user.schedule;
    if (schedule) {
      const dayMap: Record<number, keyof typeof schedule> = { 0:"sunday",1:"monday",2:"tuesday",3:"wednesday",4:"thursday",5:"friday",6:"saturday" };
      const dayKey = dayMap[now.getDay()];
      if (schedule[dayKey]) {
        const [h, m] = schedule.startTime.split(":").map(Number);
        const start = new Date(now); start.setHours(h, m, 0, 0);
        lateMin = Math.floor((now.getTime() - start.getTime()) / 60000) - schedule.toleranceMin;
        if (lateMin > 0) {
          isLate = true;
          await prisma.activityLog.create({
            data: { organizationId, userId, userName: user.name, action: "LATE",
              details: \`Tardanza de \${lateMin} minutos\` },
          });
        }
      }
    }

    // Send email for every clock in
    if (recipients.length > 0) {
      try {
        await resend.emails.send({
          from: "Punchly.Clock <onboarding@resend.dev>",
          to: recipients,
          subject: isLate ? \`⚠️ Tardanza — \${user.name}\` : \`✓ Entrada — \${user.name}\`,
          html: \`<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0A0A0A;color:white;border-radius:16px;">
            <div style="background:linear-gradient(135deg,#C9A84C,#F0D080);padding:2px;border-radius:12px;margin-bottom:24px;display:inline-block">
              <div style="background:#0A0A0A;padding:8px 16px;border-radius:10px;">
                <span style="color:#C9A84C;font-weight:900;font-size:14px;">Punchly.Clock</span>
              </div>
            </div>
            <h2 style="color:${isLate ? "#F87171" : "#34D399"};margin-bottom:8px;">${isLate ? "⚠️ Tardanza detectada" : "✓ Entrada registrada"}</h2>
            <p style="color:rgba(255,255,255,0.7);font-size:16px;"><strong style="color:white">\${user.name}</strong> fichó su <strong>entrada</strong> a las <strong style="color:#C9A84C">\${timeStr}</strong></p>
            <p style="color:rgba(255,255,255,0.4);font-size:13px;">\${dateStr}</p>
            \${isLate ? \`<p style="color:#F87171;margin-top:16px;">Llegó <strong>\${lateMin} minutos tarde</strong> (horario: \${schedule?.startTime})</p>\` : ""}
            <a href="https://punchlyclock.vercel.app/en/admin/attendance" style="display:inline-block;background:linear-gradient(135deg,#C9A84C,#F0D080);color:black;padding:12px 24px;border-radius:12px;font-weight:700;text-decoration:none;margin-top:20px;">Ver asistencia →</a>
          </div>\`,
        });
      } catch(e) { console.error("Email error:", e); }
    }

    return NextResponse.json({ success: true, action: "in", entryId: entry.id });

  } else if (action === "out") {
    const entry = await prisma.timeEntry.findFirst({ where: { userId, organizationId, clockOut: null }, orderBy: { clockIn: "desc" } });
    if (!entry) return NextResponse.json({ error: "No está en turno" }, { status: 400 });

    const durationMin = Math.floor((now.getTime() - entry.clockIn.getTime()) / 60000);
    const h = Math.floor(durationMin / 60);
    const m = durationMin % 60;

    await prisma.timeEntry.update({ where: { id: entry.id }, data: { clockOut: now, durationMin } });
    await prisma.activityLog.create({
      data: { organizationId, userId, userName: user.name, action: "CLOCK_OUT",
        details: \`Salida registrada — \${h}h \${m}m trabajados\` },
    });

    // Send email for clock out too
    if (recipients.length > 0) {
      try {
        await resend.emails.send({
          from: "Punchly.Clock <onboarding@resend.dev>",
          to: recipients,
          subject: \`✓ Salida — \${user.name}\`,
          html: \`<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0A0A0A;color:white;border-radius:16px;">
            <div style="background:linear-gradient(135deg,#C9A84C,#F0D080);padding:2px;border-radius:12px;margin-bottom:24px;display:inline-block">
              <div style="background:#0A0A0A;padding:8px 16px;border-radius:10px;">
                <span style="color:#C9A84C;font-weight:900;font-size:14px;">Punchly.Clock</span>
              </div>
            </div>
            <h2 style="color:#60A5FA;margin-bottom:8px;">✓ Salida registrada</h2>
            <p style="color:rgba(255,255,255,0.7);font-size:16px;"><strong style="color:white">\${user.name}</strong> fichó su <strong>salida</strong> a las <strong style="color:#C9A84C">\${timeStr}</strong></p>
            <p style="color:rgba(255,255,255,0.4);font-size:13px;">\${dateStr}</p>
            <p style="color:#34D399;margin-top:16px;font-size:15px;">Tiempo trabajado: <strong>\${h}h \${m}m</strong></p>
            <a href="https://punchlyclock.vercel.app/en/admin/attendance" style="display:inline-block;background:linear-gradient(135deg,#C9A84C,#F0D080);color:black;padding:12px 24px;border-radius:12px;font-weight:700;text-decoration:none;margin-top:20px;">Ver asistencia →</a>
          </div>\`,
        });
      } catch(e) { console.error("Email error:", e); }
    }

    return NextResponse.json({ success: true, action: "out" });
  }

  return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
}`);

// 4. KIOSK PWA — update manifest and add standalone meta
writeFileSync("public/manifest.json", JSON.stringify({
  name: "Punchly.Clock Kiosk",
  short_name: "Punchly",
  description: "Sistema de control de asistencia",
  start_url: "/en/kiosk",
  display: "standalone",
  background_color: "#0A0A0A",
  theme_color: "#C9A84C",
  orientation: "landscape",
  icons: [
    { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" },
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" }
  ]
}, null, 2));

// 5. FIX GEOFENCING — update settings API to handle the save properly
mkdirSync("src/app/api/settings/geo", { recursive: true });
writeFileSync("src/app/api/settings/geo/route.ts", `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const orgId = (session.user as any).organizationId;
    const body = await req.json();
    const { lat, lng, geoRadius } = body;

    if (!lat || !lng) return NextResponse.json({ error: "Latitud y longitud requeridas" }, { status: 400 });

    await prisma.organization.update({
      where: { id: orgId },
      data: { lat: parseFloat(String(lat)), lng: parseFloat(String(lng)), geoRadius: parseInt(String(geoRadius||100)) } as any,
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Geo settings error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const orgId = (session.user as any).organizationId;
    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    return NextResponse.json({ lat: (org as any)?.lat, lng: (org as any)?.lng, geoRadius: (org as any)?.geoRadius || 100 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}`);

// Update settings page to load existing geo data
const settingsPage = readFileSync("src/app/[locale]/admin/settings/page.tsx", "utf8");
if (!settingsPage.includes("geoData")) {
  writeFileSync("src/app/[locale]/admin/settings/page.tsx", `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/admin/SettingsClient";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/en/login");
  const orgId = (session.user as any).organizationId;
  const userId = (session.user as any).id;

  const [org, user] = await Promise.all([
    prisma.organization.findUnique({ where: { id: orgId } }),
    prisma.user.findUnique({ where: { id: userId } }),
  ]);

  return (
    <div style={{flex:1,overflowY:"auto",background:"#0A0A0A"}}>
      <div style={{height:"56px",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"0 24px",display:"flex",alignItems:"center"}}>
        <h1 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:"#FAFAFA"}}>Configuración</h1>
      </div>
      <div style={{padding:"24px",maxWidth:"640px"}}>
        <SettingsClient org={org} user={user} />
      </div>
    </div>
  );
}`);
}

// Update SettingsClient GeofencingTab to load existing data
let settingsClient = readFileSync("src/components/admin/SettingsClient.tsx", "utf8");
settingsClient = settingsClient.replace(
  `  const [lat, setLat] = useState(org?.lat?.toString()||"");
  const [lng, setLng] = useState(org?.lng?.toString()||"");
  const [radius, setRadius] = useState(org?.geoRadius?.toString()||"100");`,
  `  const [lat, setLat] = useState((org as any)?.lat?.toString()||"");
  const [lng, setLng] = useState((org as any)?.lng?.toString()||"");
  const [radius, setRadius] = useState((org as any)?.geoRadius?.toString()||"100");`
);
writeFileSync("src/components/admin/SettingsClient.tsx", settingsClient);

console.log("Listo!");

