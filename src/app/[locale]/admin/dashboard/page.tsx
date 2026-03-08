import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import HoursChart from "@/components/admin/HoursChart";
import ThemeToggle from "@/components/ThemeToggle";
import EmployeeTable from "@/components/admin/EmployeeTable";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect("/en/login");

  const role = (session.user as any).role;
  if (role !== "OWNER" && role !== "ADMIN") redirect("/en/employee/dashboard");

  const orgId = (session.user as any).organizationId;
  const org = await prisma.organization.findUnique({ where: { id: orgId } });

  const now = new Date();
  const isFirstHalf = now.getUTCDate() <= 15;
  const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

  const periodStart = isFirstHalf
    ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 16));

  const periodEnd = isFirstHalf
    ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 15, 23, 59, 59))
    : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59));

  const periodDays = isFirstHalf ? 15 : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate() - 15;
  const maxRegularHours = 8 * periodDays;

  const periodLabel = isFirstHalf
    ? `1 — 15 ${MONTHS[now.getUTCMonth()]} ${now.getUTCFullYear()}`
    : `16 — ${new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate()} ${MONTHS[now.getUTCMonth()]} ${now.getUTCFullYear()}`;

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

  const activeUserIds = activeEntries.map((e) => e.userId);
  const activeEntryMap = Object.fromEntries(activeEntries.map((e) => [e.userId, {
    clockIn: e.clockIn.toISOString(),
  }]));

  const payrollData = employees.map((emp) => {
    const completed = emp.timeEntries.filter(e => e.status === "CLOCKED_OUT");
    const totalMinutes = completed.reduce((acc, e) => acc + (e.durationMin || 0), 0);
    const totalHours = totalMinutes / 60;
    const regularHours = Math.min(totalHours, maxRegularHours);
    const overtimeHours = Math.max(0, totalHours - maxRegularHours);
    const totalPay = regularHours * (emp.hourlyRate || 0) + overtimeHours * (emp.overtimeRate || 0);
    return {
      id: emp.id, name: emp.name, hourlyRate: emp.hourlyRate,
      totalHours: Math.round(totalHours * 10) / 10,
      overtimeHours: Math.round(overtimeHours * 10) / 10,
      totalPay: Math.round(totalPay * 100) / 100,
    };
  });

  const totalPayroll = payrollData.reduce((acc, e) => acc + e.totalPay, 0);
  const totalHoursAll = Math.round(payrollData.reduce((acc, e) => acc + e.totalHours, 0));
  const overtimeCount = payrollData.filter(e => e.overtimeHours > 0).length;
  const chartData = payrollData.map(emp => ({ name: emp.name.split(" ")[0], hours: emp.totalHours, pay: emp.totalPay }));
  const dateStr = now.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" });

  const employeesPlain = employees.map(e => ({
    id: e.id, name: e.name, email: e.email, hourlyRate: e.hourlyRate,
  }));

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-primary)]">
      {/* Topbar */}
      <div className="h-14 border-b border-[var(--border)] px-4 md:px-6 flex items-center justify-between shrink-0 bg-[var(--bg-card)]">
        <div>
          <h1 className="text-sm font-black text-[var(--text-primary)] capitalize">{dateStr}</h1>
          <p className="text-xs text-[var(--text-muted)]">{periodLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/en/admin/employees/new"
            className="bg-[#E8B84B] text-black text-xs px-3 py-2 rounded-lg font-black hover:bg-[#d4a43a] transition flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span className="hidden sm:inline">Nuevo Empleado</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[var(--border)]">
          <div className="p-5 border-r border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)] font-medium mb-2">Total empleados</p>
            <p className="text-3xl font-black text-[var(--text-primary)]">{employees.length}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
              {activeEntries.length} trabajando ahora
            </p>
          </div>
          <div className="p-5 border-r border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)] font-medium mb-2">En turno ahora</p>
            <p className="text-3xl font-black text-green-500">{activeEntries.length}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{employees.length - activeEntries.length} fuera</p>
          </div>
          <div className="p-5 border-r border-[var(--border)] bg-[#E8B84B]/5">
            <p className="text-xs text-[#E8B84B]/70 font-medium mb-2">Nómina estimada</p>
            <p className="text-3xl font-black text-[#E8B84B]">${totalPayroll.toLocaleString()}</p>
            <p className="text-xs text-[#E8B84B]/50 mt-1">{periodLabel}</p>
          </div>
          <div className="p-5">
            <p className="text-xs text-[var(--text-muted)] font-medium mb-2">Horas quincena</p>
            <p className="text-3xl font-black text-[var(--text-primary)]">{totalHoursAll}h</p>
            <p className="text-xs mt-1">
              {overtimeCount > 0
                ? <span className="text-orange-400">{overtimeCount} con horas extra</span>
                : <span className="text-[var(--text-muted)]">sin horas extra</span>}
            </p>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3">
              <EmployeeTable
                employees={employeesPlain}
                payrollData={payrollData}
                activeUserIds={activeUserIds}
                activeEntryMap={activeEntryMap}
                now={now.toISOString()}
              />
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[var(--text-primary)]">Nómina</h2>
                  <Link href="/en/admin/payroll" className="text-xs text-[#E8B84B] font-semibold hover:underline">Ver detalle →</Link>
                </div>
                <div className="divide-y divide-[var(--border)] max-h-48 overflow-y-auto">
                  {payrollData.length === 0 ? (
                    <p className="px-5 py-6 text-xs text-[var(--text-muted)] text-center">Sin datos este período</p>
                  ) : payrollData.map((emp) => (
                    <div key={emp.id} className="px-5 py-2.5 flex items-center justify-between hover:bg-[var(--border)]/20 transition">
                      <div>
                        <p className="text-xs font-semibold text-[var(--text-primary)]">{emp.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{emp.totalHours}h {emp.overtimeHours > 0 && <span className="text-orange-400">· +{emp.overtimeHours}h extra</span>}</p>
                      </div>
                      <p className="text-sm font-black text-[#E8B84B]">${emp.totalPay.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 border-t border-[#E8B84B]/20 bg-[#E8B84B]/5 flex items-center justify-between">
                  <p className="text-xs font-bold text-[var(--text-primary)]">Total estimado</p>
                  <p className="text-base font-black text-[#E8B84B]">${totalPayroll.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Acciones rápidas</p>
                <div className="space-y-1.5">
                  {[
                    { href: "/en/admin/employees/new", label: "Nuevo empleado", icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> },
                    { href: "/en/admin/kiosk", label: "Abrir Kiosk", icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> },
                    { href: "/en/admin/payroll", label: "Ver nómina completa", icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
                    { href: "/en/admin/activity", label: "Registro de actividad", icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
                  ].map(a => (
                    <Link key={a.href} href={a.href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition">
                      <span className="text-[#E8B84B]">{a.icon}</span>
                      {a.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {chartData.length > 0 && <HoursChart data={chartData} />}
        </div>
      </div>
    </div>
  );
}