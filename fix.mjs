import { writeFileSync, readFileSync } from "fs";

// Add Empleados link to Sidebar
let sidebar = readFileSync("src/components/admin/Sidebar.tsx", "utf8");
sidebar = sidebar.replace(
  `{ href: "/en/admin/employees/new", label: t("sidebar.new.employee"), icon: <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> },`,
  `{ href: "/en/admin/employees", label: "Empleados", icon: <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { href: "/en/admin/employees/new", label: t("sidebar.new.employee"), icon: <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> },`
);
writeFileSync("src/components/admin/Sidebar.tsx", sidebar);

// ==================== WEEKLY ATTENDANCE CHART API ====================
const attendanceChartApi = `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const orgId = (session.user as any).organizationId;

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const end = new Date(d); end.setHours(23, 59, 59, 999);
    const entries = await prisma.timeEntry.findMany({
      where: { organizationId: orgId, clockIn: { gte: d, lte: end } },
      include: { user: { include: { schedule: true } } },
    });

    let onTime = 0, late = 0, absent = 0;

    // Count scheduled employees
    const scheduled = await prisma.schedule.findMany({ where: { organizationId: orgId } });
    const dayMap: Record<number, string> = { 0: "sunday", 1: "monday", 2: "tuesday", 3: "wednesday", 4: "thursday", 5: "friday", 6: "saturday" };
    const dayKey = dayMap[d.getDay()];

    for (const sched of scheduled) {
      const isWorkDay = (sched as any)[dayKey] as boolean;
      if (!isWorkDay) continue;
      const entry = entries.find(e => e.userId === sched.userId);
      if (!entry) { absent++; continue; }

      const clockIn = new Date(entry.clockIn);
      const [startH, startM] = sched.startTime.split(":").map(Number);
      const scheduledStart = new Date(clockIn); scheduledStart.setHours(startH, startM, 0, 0);
      const lateMin = Math.floor((clockIn.getTime() - scheduledStart.getTime()) / 60000) - sched.toleranceMin;
      if (lateMin > 0) late++; else onTime++;
    }

    days.push({
      day: d.toLocaleDateString("es", { weekday: "short" }),
      date: d.toLocaleDateString("es", { day: "numeric", month: "short" }),
      onTime, late, absent,
      total: onTime + late,
    });
  }

  return NextResponse.json({ days });
}`;

// ==================== ATTENDANCE CHART COMPONENT ====================
const attendanceChart = `"use client";
import { useEffect, useState } from "react";

type DayData = { day: string; date: string; onTime: number; late: number; absent: number; total: number };

export default function AttendanceChart() {
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/attendance/chart")
      .then(r => r.json())
      .then(d => { setData(d.days || []); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 h-48 flex items-center justify-center">
      <p className="text-xs text-[var(--text-muted)]">Cargando...</p>
    </div>
  );

  const max = Math.max(...data.map(d => d.onTime + d.late + d.absent), 1);

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Asistencia semanal</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Últimos 7 días</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-400 rounded-full"></span><span className="text-xs text-[var(--text-muted)]">A tiempo</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-orange-400 rounded-full"></span><span className="text-xs text-[var(--text-muted)]">Tardanza</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-red-400 rounded-full"></span><span className="text-xs text-[var(--text-muted)]">Ausencia</span></div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-end gap-2 h-32">
          {data.map((d, i) => {
            const onTimeH = (d.onTime / max) * 100;
            const lateH = (d.late / max) * 100;
            const absentH = (d.absent / max) * 100;
            const isToday = i === data.length - 1;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: "100px" }}>
                  {d.absent > 0 && (
                    <div className="w-full bg-red-400/70 rounded-sm transition-all" style={{ height: \`\${absentH}%\`, minHeight: d.absent > 0 ? "4px" : "0" }}></div>
                  )}
                  {d.late > 0 && (
                    <div className="w-full bg-orange-400/70 rounded-sm transition-all" style={{ height: \`\${lateH}%\`, minHeight: d.late > 0 ? "4px" : "0" }}></div>
                  )}
                  {d.onTime > 0 && (
                    <div className="w-full bg-green-400/70 rounded-sm transition-all" style={{ height: \`\${onTimeH}%\`, minHeight: d.onTime > 0 ? "4px" : "0" }}></div>
                  )}
                  {d.total === 0 && d.absent === 0 && (
                    <div className="w-full bg-[var(--border)] rounded-sm" style={{ height: "4px" }}></div>
                  )}
                </div>
                <p className={\`text-xs font-semibold capitalize \${isToday ? "text-[#E8B84B]" : "text-[var(--text-muted)]"}\`}>{d.day}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}`;

// ==================== UPDATE DASHBOARD PAGE to include chart ====================
const dashboardPage = `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import EmployeeTable from "@/components/admin/EmployeeTable";
import NotificationBell from "@/components/admin/NotificationBell";
import AttendanceChart from "@/components/admin/AttendanceChart";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/en/login");
  const orgId = (session.user as any).organizationId;

  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() <= 15 ? 1 : 16);

  const [employees, activeEntries, periodEntries, org] = await Promise.all([
    prisma.user.findMany({ where: { organizationId: orgId, isActive: true, role: { not: "OWNER" } }, orderBy: { name: "asc" } }),
    prisma.timeEntry.findMany({ where: { organizationId: orgId, clockOut: null } }),
    prisma.timeEntry.findMany({ where: { organizationId: orgId, clockIn: { gte: periodStart } } }),
    prisma.organization.findUnique({ where: { id: orgId }, include: { users: { where: { role: "OWNER" } } } }),
  ]);

  const activeIds = new Set(activeEntries.map(e => e.userId));
  const totalHours = Math.floor(periodEntries.reduce((acc, e) => acc + (e.durationMin || 0), 0) / 60);

  const employeesWithRates = await prisma.user.findMany({
    where: { organizationId: orgId, isActive: true, role: { not: "OWNER" } },
  });
  const estimatedPayroll = periodEntries.reduce((acc, e) => {
    const emp = employeesWithRates.find(u => u.id === e.userId);
    const rate = (emp as any)?.hourlyRate || 0;
    return acc + ((e.durationMin || 0) / 60) * rate;
  }, 0);

  const kpis = [
    { label: "Total empleados", value: employees.length.toString(), sub: "activos", color: "text-[var(--text-primary)]" },
    { label: "En turno ahora", value: activeEntries.length.toString(), sub: "trabajando", color: "text-green-400" },
    { label: "Horas quincena", value: totalHours + "h", sub: "período actual", color: "text-[#E8B84B]" },
    { label: "Nómina estimada", value: "$" + estimatedPayroll.toLocaleString("en", { maximumFractionDigits: 0 }), sub: "este período", color: "text-[#E8B84B]" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center justify-between bg-[var(--bg-primary)]">
        <div>
          <h1 className="text-sm font-black text-[var(--text-primary)]">Dashboard</h1>
          <p className="text-xs text-[var(--text-muted)]">{org?.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <Link href="/en/admin/employees/new"
            className="bg-[#E8B84B] text-black px-3 py-1.5 rounded-xl text-xs font-black hover:bg-[#d4a43a] transition">
            + Empleado
          </Link>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpis.map(k => (
            <div key={k.label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
              <p className="text-xs text-[var(--text-muted)] mb-2">{k.label}</p>
              <p className={\`text-2xl font-black \${k.color}\`}>{k.value}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{k.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            {/* Attendance Chart */}
            <AttendanceChart />
            {/* Employee Table */}
            <EmployeeTable employees={employees.map(e => ({
              id: e.id,
              name: e.name,
              email: e.email,
              isActive: e.isActive,
              onShift: activeIds.has(e.id),
              clockInTime: activeEntries.find(a => a.userId === e.id)?.clockIn?.toISOString() || null,
            }))} />
          </div>

          {/* Quick actions */}
          <div className="space-y-3">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[var(--border)]">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Acciones rápidas</h3>
              </div>
              <div className="p-3 space-y-1">
                {[
                  { href: "/en/admin/employees/new", label: "Nuevo empleado", icon: "👤" },
                  { href: "/en/admin/employees", label: "Ver empleados", icon: "👥" },
                  { href: "/en/admin/kiosk", label: "Abrir Kiosk", icon: "📱" },
                  { href: "/en/admin/payroll", label: "Ver nómina", icon: "💰" },
                  { href: "/en/admin/attendance", label: "Asistencia", icon: "📋" },
                  { href: "/en/admin/activity", label: "Actividad", icon: "⚡" },
                ].map(a => (
                  <Link key={a.href} href={a.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition">
                    <span>{a.icon}</span>
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;

writeFileSync("src/app/api/attendance/chart/route.ts", attendanceChartApi);
writeFileSync("src/components/admin/AttendanceChart.tsx", attendanceChart);
writeFileSync("src/app/[locale]/admin/dashboard/page.tsx", dashboardPage);
console.log("Listo!");

