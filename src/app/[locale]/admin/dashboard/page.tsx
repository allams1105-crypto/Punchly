import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import HoursChart from "@/components/admin/HoursChart";
import ThemeToggle from "@/components/ThemeToggle";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect("/en/login");

  const role = (session.user as any).role;
  if (role !== "OWNER" && role !== "ADMIN") redirect("/en/employee/dashboard");

  const orgId = (session.user as any).organizationId;
  const org = await prisma.organization.findUnique({ where: { id: orgId } });

  const now = new Date();
  const isFirstHalf = now.getUTCDate() <= 15;

  const periodStart = isFirstHalf
    ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 16));

  const periodEnd = isFirstHalf
    ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 15, 23, 59, 59))
    : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59));

  const periodDays = isFirstHalf ? 15 : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate() - 15;
  const maxRegularHours = 8 * periodDays;

  const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const periodLabel = isFirstHalf
    ? `1 — 15 ${MONTHS[now.getUTCMonth()]}`
    : `16 — ${new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate()} ${MONTHS[now.getUTCMonth()]}`;

  const employees = await prisma.user.findMany({
    where: { organizationId: orgId, role: { in: ["EMPLOYEE", "ADMIN"] }, isActive: true },
    include: {
      timeEntries: {
        where: { clockIn: { gte: periodStart, lte: periodEnd } },
        orderBy: { clockIn: "desc" },
      },
    },
  });

  const activeEntries = await prisma.timeEntry.findMany({
    where: { user: { organizationId: orgId }, status: "CLOCKED_IN" },
    include: { user: true },
  });

  const activeUserIds = new Set(activeEntries.map((e) => e.userId));
  const activeEntryMap = new Map(activeEntries.map((e) => [e.userId, e]));

  const payrollData = employees.map((emp) => {
    const completedEntries = emp.timeEntries.filter(e => e.status === "CLOCKED_OUT");
    const totalMinutes = completedEntries.reduce((acc, e) => acc + (e.durationMin || 0), 0);
    const totalHours = totalMinutes / 60;
    const regularHours = Math.min(totalHours, maxRegularHours);
    const overtimeHours = Math.max(0, totalHours - maxRegularHours);
    const totalPay = regularHours * (emp.hourlyRate || 0) + overtimeHours * (emp.overtimeRate || 0);
    return {
      id: emp.id, name: emp.name, email: emp.email, role: emp.role,
      hourlyRate: emp.hourlyRate,
      totalHours: Math.round(totalHours * 10) / 10,
      overtimeHours: Math.round(overtimeHours * 10) / 10,
      totalPay: Math.round(totalPay * 100) / 100,
    };
  });

  const totalPayroll = payrollData.reduce((acc, e) => acc + e.totalPay, 0);
  const totalHoursAll = Math.round(payrollData.reduce((acc, e) => acc + e.totalHours, 0));
  const overtimeCount = payrollData.filter(e => e.overtimeHours > 0).length;

  const chartData = payrollData.map((emp) => ({
    name: emp.name.split(" ")[0], hours: emp.totalHours, pay: emp.totalPay,
  }));

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-primary)]">
      {/* Topbar */}
      <div className="h-14 border-b border-[var(--border)] px-4 md:px-6 flex items-center justify-between shrink-0 bg-[var(--bg-card)]">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-sm font-black text-[var(--text-primary)]">Dashboard</h1>
            <p className="text-xs text-[var(--text-muted)]">{periodLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/en/admin/employees/new"
            className="bg-[#E8B84B] text-black text-xs px-3 py-2 rounded-xl font-black hover:bg-[#d4a43a] transition flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span className="hidden sm:inline">Nuevo Empleado</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Empleados</p>
              <div className="w-7 h-7 bg-[var(--border)] rounded-lg flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            </div>
            <p className="text-3xl font-black text-[var(--text-primary)]">{employees.length}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">activos en sistema</p>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Trabajando</p>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <p className="text-3xl font-black text-green-500">{activeEntries.length}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">en este momento</p>
          </div>

          <div className="bg-[#E8B84B]/10 border border-[#E8B84B]/25 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[#E8B84B]/70 uppercase tracking-wider font-semibold">Nómina</p>
              <div className="w-7 h-7 bg-[#E8B84B]/15 rounded-lg flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              </div>
            </div>
            <p className="text-3xl font-black text-[#E8B84B]">${totalPayroll.toLocaleString()}</p>
            <p className="text-xs text-[#E8B84B]/50 mt-1">{periodLabel}</p>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Horas</p>
              <div className="w-7 h-7 bg-[var(--border)] rounded-lg flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
            </div>
            <p className="text-3xl font-black text-[var(--text-primary)]">{totalHoursAll}h</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{overtimeCount > 0 ? <span className="text-orange-400">{overtimeCount} con horas extra</span> : "sin horas extra"}</p>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Employee status table */}
          <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Estado de Empleados</h2>
              <span className="text-xs bg-[var(--border)] text-[var(--text-muted)] px-2 py-0.5 rounded-full">{employees.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left px-5 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Nombre</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Estado</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Hora entrada</th>
                    <th className="text-right px-5 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Horas/quincena</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {employees.length === 0 ? (
                    <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-[var(--text-muted)]">
                      <Link href="/en/admin/employees/new" className="text-[#E8B84B] hover:underline">+ Agregar primer empleado</Link>
                    </td></tr>
                  ) : employees.map((emp) => {
                    const isActive = activeUserIds.has(emp.id);
                    const activeEntry = activeEntryMap.get(emp.id);
                    const pData = payrollData.find(p => p.id === emp.id);
                    return (
                      <tr key={emp.id} className="hover:bg-[var(--border)]/30 transition">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-[#E8B84B]/15 rounded-lg flex items-center justify-center shrink-0">
                              <span className="text-[#E8B84B] text-xs font-black">{emp.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[var(--text-primary)]">{emp.name}</p>
                              <p className="text-xs text-[var(--text-muted)]">${emp.hourlyRate}/h</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${isActive ? "bg-green-500/15 text-green-400" : "bg-[var(--border)] text-[var(--text-muted)]"}`}>
                            {isActive ? "Trabajando" : "Fuera"}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <p className="text-sm text-[var(--text-primary)]">
                            {activeEntry ? new Date(activeEntry.clockIn).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }) : "—"}
                          </p>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <p className="text-sm font-bold text-[var(--text-primary)]">{pData?.totalHours || 0}h</p>
                          {pData && pData.overtimeHours > 0 && <p className="text-xs text-orange-400">{pData.overtimeHours}h extra</p>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {employees.length > 0 && (
              <div className="px-5 py-2.5 border-t border-[var(--border)] flex items-center justify-between">
                <p className="text-xs text-[var(--text-muted)]">{activeEntries.length} trabajando · {employees.length - activeEntries.length} fuera</p>
                <Link href="/en/admin/employees/new" className="text-xs text-[#E8B84B] hover:underline font-semibold">+ Agregar</Link>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Payroll summary */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between">
                <h2 className="text-sm font-bold text-[var(--text-primary)]">Nómina Quincenal</h2>
                <Link href="/en/admin/payroll" className="text-xs text-[#E8B84B] hover:underline">Ver todo</Link>
              </div>
              <div className="divide-y divide-[var(--border)] max-h-52 overflow-y-auto">
                {payrollData.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[var(--text-muted)]">Sin datos aún</div>
                ) : payrollData.map((emp) => (
                  <div key={emp.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-primary)]">{emp.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{emp.totalHours}h</p>
                    </div>
                    <p className="text-sm font-black text-[#E8B84B]">${emp.totalPay.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              {payrollData.length > 0 && (
                <div className="px-5 py-3 border-t border-[#E8B84B]/20 bg-[#E8B84B]/5 flex items-center justify-between">
                  <p className="text-xs font-bold text-[var(--text-primary)]">Total</p>
                  <p className="text-sm font-black text-[#E8B84B]">${totalPayroll.toLocaleString()}</p>
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 space-y-2">
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Acciones rápidas</p>
              <Link href="/en/admin/employees/new"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[var(--border)] hover:border-[#E8B84B]/40 hover:bg-[#E8B84B]/5 transition text-sm text-[var(--text-primary)] font-medium">
                <svg className="w-4 h-4 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                Nuevo empleado
              </Link>
              <Link href="/en/admin/kiosk"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[var(--border)] hover:border-[#E8B84B]/40 hover:bg-[#E8B84B]/5 transition text-sm text-[var(--text-primary)] font-medium">
                <svg className="w-4 h-4 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                Abrir Kiosk
              </Link>
              <Link href="/en/admin/payroll"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[var(--border)] hover:border-[#E8B84B]/40 hover:bg-[#E8B84B]/5 transition text-sm text-[var(--text-primary)] font-medium">
                <svg className="w-4 h-4 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                Ver nómina
              </Link>
              <Link href="/en/admin/activity"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[var(--border)] hover:border-[#E8B84B]/40 hover:bg-[#E8B84B]/5 transition text-sm text-[var(--text-primary)] font-medium">
                <svg className="w-4 h-4 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                Ver actividad
              </Link>
            </div>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div>
            <HoursChart data={chartData} />
          </div>
        )}

      </div>
    </div>
  );
}