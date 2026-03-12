import { writeFileSync, mkdirSync } from "fs";

// 1. Fix /api/employees GET endpoint
mkdirSync("src/app/api/employees", { recursive: true });
writeFileSync("src/app/api/employees/route.ts", `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const orgId = (session.user as any).organizationId;
    const employees = await prisma.user.findMany({
      where: { organizationId: orgId, role: { not: "OWNER" }, isActive: true },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ employees });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}`);

// 2. Geofencing API
mkdirSync("src/app/api/clock", { recursive: true });
writeFileSync("src/app/api/clock/route.ts", `import { auth } from "@/lib/auth";
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
          error: \`Estás muy lejos de la empresa (\${Math.round(distance)}m). Debes estar a menos de \${geoRadius}m.\`,
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
                details: \`Tardanza de \${lateMin} minutos (móvil)\` },
            });
            const owner = await prisma.user.findFirst({ where: { organizationId: orgId, role: "OWNER" } });
            if (owner?.email) {
              try {
                await resend.emails.send({
                  from: "Punchly.Clock <onboarding@resend.dev>",
                  to: [owner.email],
                  subject: \`⚠️ Tardanza — \${user.name}\`,
                  html: \`<p><strong>\${user.name}</strong> llegó <strong>\${lateMin} min tarde</strong> desde su móvil.</p>\`,
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
        data: { organizationId: orgId, userId, userName: user.name, action: "CLOCK_OUT", details: \`Salida desde móvil — \${durationMin} min\` },
      });
      return NextResponse.json({ success: true, action: "out" });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}`);

// 3. Employee dashboard - geofencing clock
writeFileSync("src/components/employee/EmployeeDashboardClient.tsx", `"use client";
import { useState, useEffect } from "react";

const COLORS = ["#E8B84B","#60A5FA","#34D399","#F87171","#A78BFA","#FB923C"];

function Avatar({ name, color }: { name: string; color?: string | null }) {
  const bg = color || COLORS[(name?.charCodeAt(0) || 0) % COLORS.length];
  return (
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black"
      style={{ backgroundColor: bg + "20", border: \`2px solid \${bg}40\`, color: bg }}>
      {(name || "?").charAt(0).toUpperCase()}
    </div>
  );
}

type Props = {
  user: { id: string; name: string; email: string; avatarColor?: string | null };
  onShift: boolean;
  todayEntry: { clockIn: string; clockOut?: string | null } | null;
  weekStats: { totalMin: number; daysWorked: number; lateCount: number };
  schedule: { startTime: string; endTime: string; monday: boolean; tuesday: boolean; wednesday: boolean; thursday: boolean; friday: boolean; saturday: boolean; sunday: boolean } | null;
  recentEntries: { id: string; clockIn: string; clockOut: string | null; durationMin: number | null }[];
  geoEnabled: boolean;
  geoRadius: number;
};

export default function EmployeeDashboardClient({ user, onShift: initialOnShift, todayEntry, weekStats, schedule, recentEntries, geoEnabled, geoRadius }: Props) {
  const [onShift, setOnShift] = useState(initialOnShift);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [locating, setLocating] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);

  const days = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  const dayKeys = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"] as const;
  const todayIdx = new Date().getDay();

  async function clock() {
    setLoading(true);
    setError("");
    setSuccess("");

    const action = onShift ? "out" : "in";

    if (geoEnabled) {
      setLocating(true);
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
        );
        setLocating(false);
        const { latitude: lat, longitude: lng } = pos.coords;

        const res = await fetch("/api/clock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, lat, lng }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Error");
          if (data.distance) setDistance(data.distance);
          setLoading(false);
          return;
        }
        setOnShift(action === "in");
        setSuccess(action === "in" ? "Entrada registrada" : "Salida registrada");
      } catch (e: any) {
        setLocating(false);
        setError("No se pudo obtener tu ubicación. Activa el GPS.");
        setLoading(false);
        return;
      }
    } else {
      const res = await fetch("/api/clock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error"); setLoading(false); return; }
      setOnShift(action === "in");
      setSuccess(action === "in" ? "Entrada registrada" : "Salida registrada");
    }

    setLoading(false);
    setTimeout(() => setSuccess(""), 3000);
  }

  const totalH = Math.floor(weekStats.totalMin / 60);
  const totalM = weekStats.totalMin % 60;

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center bg-[var(--bg-primary)]">
        <h1 className="text-sm font-black text-[var(--text-primary)]">Mi Panel</h1>
      </div>

      <div className="p-6 space-y-4 max-w-2xl mx-auto">
        {/* Profile + Clock */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={user.name} color={user.avatarColor} />
            <div>
              <p className="text-lg font-black text-[var(--text-primary)]">{user.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
              <div className={\`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-full text-xs font-semibold \${onShift ? "bg-green-500/15 text-green-400 border border-green-500/25" : "bg-[var(--border)] text-[var(--text-muted)]"}\`}>
                {onShift && <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />}
                {onShift ? "En turno" : "Fuera de turno"}
              </div>
            </div>
          </div>

          {todayEntry && (
            <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-3 mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--text-muted)]">Hoy</p>
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  Entrada: {new Date(todayEntry.clockIn).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                  {todayEntry.clockOut && \` · Salida: \${new Date(todayEntry.clockOut).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}\`}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
              {distance && <p className="text-red-400/70 text-xs mt-1">Distancia actual: {distance}m · Requerido: menos de {geoRadius}m</p>}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-4">
              <p className="text-green-400 text-sm font-semibold">{success}</p>
            </div>
          )}

          <button onClick={clock} disabled={loading || locating}
            className={\`w-full py-4 rounded-2xl font-black text-base transition disabled:opacity-50 \${onShift ? "bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25" : "bg-[#E8B84B] text-black hover:bg-[#d4a43a]"}\`}>
            {locating ? "Obteniendo ubicación..." : loading ? "Registrando..." : onShift ? "Registrar Salida" : "Registrar Entrada"}
          </button>

          {geoEnabled && (
            <p className="text-xs text-[var(--text-muted)] text-center mt-2">
              Geofencing activo · debes estar a menos de {geoRadius}m de la empresa
            </p>
          )}
        </div>

        {/* Week stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-[#E8B84B]">{totalH}h {totalM}m</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Esta semana</p>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-[var(--text-primary)]">{weekStats.daysWorked}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Días trabajados</p>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 text-center">
            <p className={\`text-2xl font-black \${weekStats.lateCount > 0 ? "text-red-400" : "text-green-400"}\`}>{weekStats.lateCount}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Tardanzas</p>
          </div>
        </div>

        {/* Schedule */}
        {schedule && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
            <p className="text-xs font-black text-[var(--text-muted)] uppercase tracking-wider mb-3">Mi Horario</p>
            <div className="flex gap-2 mb-3">
              {days.map((d, i) => {
                const active = schedule[dayKeys[i]];
                const isToday = i === todayIdx;
                return (
                  <div key={d} className={\`flex-1 py-2 rounded-xl text-center text-xs font-bold transition \${
                    isToday && active ? "bg-[#E8B84B] text-black" :
                    active ? "bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)]" :
                    "bg-[var(--bg-primary)] text-[var(--text-muted)] opacity-40"
                  }\`}>{d}</div>
                );
              })}
            </div>
            <p className="text-xs text-[var(--text-muted)] text-center">{schedule.startTime} — {schedule.endTime}</p>
          </div>
        )}

        {/* Recent entries */}
        {recentEntries.length > 0 && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[var(--border)]">
              <p className="text-xs font-black text-[var(--text-muted)] uppercase tracking-wider">Últimos registros</p>
            </div>
            {recentEntries.slice(0, 7).map(e => {
              const ci = new Date(e.clockIn);
              const h = Math.floor((e.durationMin || 0) / 60);
              const m = (e.durationMin || 0) % 60;
              return (
                <div key={e.id} className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{ci.toLocaleDateString("es", { weekday: "short", day: "numeric", month: "short" })}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {ci.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                      {e.clockOut && \` — \${new Date(e.clockOut).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}\`}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">{e.durationMin ? \`\${h}h \${m}m\` : "—"}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}`);

// 4. Employee dashboard page - pass geo data
writeFileSync("src/app/[locale]/employee/dashboard/page.tsx", `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import EmployeeDashboardClient from "@/components/employee/EmployeeDashboardClient";

export default async function EmployeeDashboardPage() {
  const session = await auth();
  if (!session) redirect("/en/login");
  const userId = (session.user as any).id;
  const orgId = (session.user as any).organizationId;

  const today = new Date(); today.setHours(0,0,0,0);
  const weekStart = new Date(today); weekStart.setDate(today.getDate() - today.getDay());

  const [user, org, todayEntry, weekEntries, lateLogs, recentEntries] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, include: { schedule: true } }),
    prisma.organization.findUnique({ where: { id: orgId } }),
    prisma.timeEntry.findFirst({ where: { userId, organizationId: orgId, clockIn: { gte: today } }, orderBy: { clockIn: "desc" } }),
    prisma.timeEntry.findMany({ where: { userId, organizationId: orgId, clockIn: { gte: weekStart } } }),
    prisma.activityLog.findMany({ where: { userId, organizationId: orgId, action: "LATE", createdAt: { gte: weekStart } } }),
    prisma.timeEntry.findMany({ where: { userId, organizationId: orgId }, orderBy: { clockIn: "desc" }, take: 10 }),
  ]);

  if (!user) redirect("/en/login");

  const onShift = !!todayEntry && !todayEntry.clockOut;
  const totalMin = weekEntries.reduce((acc, e) => acc + (e.durationMin || 0), 0);
  const daysWorked = new Set(weekEntries.map(e => new Date(e.clockIn).toDateString())).size;

  return (
    <EmployeeDashboardClient
      user={{ id: user.id, name: user.name, email: user.email, avatarColor: (user as any).avatarColor }}
      onShift={onShift}
      todayEntry={todayEntry ? { clockIn: todayEntry.clockIn.toISOString(), clockOut: todayEntry.clockOut?.toISOString() || null } : null}
      weekStats={{ totalMin, daysWorked, lateCount: lateLogs.length }}
      schedule={user.schedule}
      recentEntries={recentEntries.map(e => ({ id: e.id, clockIn: e.clockIn.toISOString(), clockOut: e.clockOut?.toISOString() || null, durationMin: e.durationMin }))}
      geoEnabled={!!((org as any)?.lat && (org as any)?.lng)}
      geoRadius={(org as any)?.geoRadius || 100}
    />
  );
}`);

// 5. Settings - add geofencing config
writeFileSync("src/app/api/settings/geo/route.ts", `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const orgId = (session.user as any).organizationId;
    const { lat, lng, geoRadius } = await req.json();
    await prisma.organization.update({
      where: { id: orgId },
      data: { lat, lng, geoRadius } as any,
    });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}`);

console.log("Listo!");
