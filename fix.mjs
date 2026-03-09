import { writeFileSync } from "fs";

// Fix manifest.json 401 — move to public folder (already there but needs middleware bypass)
// Fix EmployeeTable to accept simpler props
const employeeTable = `"use client";
import { useState } from "react";
import Link from "next/link";

type Employee = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  onShift: boolean;
  clockInTime: string | null;
};

export default function EmployeeTable({ employees }: { employees: Employee[] }) {
  const [search, setSearch] = useState("");

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  function elapsed(clockIn: string) {
    const diff = Math.floor((Date.now() - new Date(clockIn).getTime()) / 60000);
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return h > 0 ? \`\${h}h \${m}m\` : \`\${m}m\`;
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Estado de empleados</h3>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition w-36" />
      </div>
      {filtered.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-[var(--text-muted)]">No hay empleados</p>
          <Link href="/en/admin/employees/new" className="inline-block mt-3 bg-[#E8B84B] text-black px-4 py-2 rounded-xl text-xs font-black">+ Agregar primero</Link>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Empleado</th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Estado</th>
              <th className="text-right px-5 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Tiempo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filtered.map(emp => (
              <tr key={emp.id} className="hover:bg-[var(--border)]/20 transition">
                <td className="px-5 py-3">
                  <Link href={\`/en/admin/employees/\${emp.id}\`} className="flex items-center gap-2.5 group">
                    <div className="w-7 h-7 bg-[#E8B84B]/10 border border-[#E8B84B]/20 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-[#E8B84B] text-xs font-black">{emp.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[#E8B84B] transition">{emp.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{emp.email}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-3 py-3">
                  {emp.onShift ? (
                    <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-2.5 py-1 rounded-lg w-fit">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                      Trabajando
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)] bg-[var(--border)] px-2.5 py-1 rounded-lg">Fuera</span>
                  )}
                </td>
                <td className="px-5 py-3 text-right">
                  {emp.onShift && emp.clockInTime ? (
                    <p className="text-xs font-semibold text-[#E8B84B]">{elapsed(emp.clockInTime)}</p>
                  ) : (
                    <p className="text-xs text-[var(--text-muted)]">—</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}`;

// Fix manifest 401 — add to middleware bypass
const middleware = `import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public files
  if (
    pathname.startsWith("/manifest.json") ||
    pathname.startsWith("/sw.js") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};`;

// Fix dashboard to pass correct props to EmployeeTable
const dashboard = `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import EmployeeTable from "@/components/admin/EmployeeTable";
import NotificationBell from "@/components/admin/NotificationBell";
import AttendanceChart from "@/components/admin/AttendanceChart";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session || !session.user) redirect("/en/login");
  const orgId = (session.user as any).organizationId as string;

  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() <= 15 ? 1 : 16);

  const [employees, activeEntries, periodEntries, org] = await Promise.all([
    prisma.user.findMany({ where: { organizationId: orgId, isActive: true, role: { not: "OWNER" } }, orderBy: { name: "asc" } }),
    prisma.timeEntry.findMany({ where: { organizationId: orgId, clockOut: null } }),
    prisma.timeEntry.findMany({ where: { organizationId: orgId, clockIn: { gte: periodStart } } }),
    prisma.organization.findUnique({ where: { id: orgId } }),
  ]);

  const activeIds = new Set(activeEntries.map(e => e.userId));
  const totalHours = Math.floor(periodEntries.reduce((acc, e) => acc + (e.durationMin || 0), 0) / 60);
  const estimatedPayroll = periodEntries.reduce((acc, e) => {
    const emp = employees.find(u => u.id === e.userId);
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
          <NotificationBell orgId={orgId} />
          <Link href="/en/admin/employees/new"
            className="bg-[#E8B84B] text-black px-3 py-1.5 rounded-xl text-xs font-black hover:bg-[#d4a43a] transition">
            + Empleado
          </Link>
        </div>
      </div>

      <div className="p-6 space-y-4">
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
            <AttendanceChart />
            <EmployeeTable employees={employees.map(e => ({
              id: e.id,
              name: e.name,
              email: e.email,
              isActive: e.isActive,
              onShift: activeIds.has(e.id),
              clockInTime: activeEntries.find(a => a.userId === e.id)?.clockIn?.toISOString() || null,
            }))} />
          </div>
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
                    <span>{a.icon}</span>{a.label}
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

writeFileSync("src/components/admin/EmployeeTable.tsx", employeeTable);
writeFileSync("src/middleware.ts", middleware);
writeFileSync("src/app/[locale]/admin/dashboard/page.tsx", dashboard);
console.log("Listo!");

