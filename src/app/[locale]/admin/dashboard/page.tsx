import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import UpgradeButton from "@/components/admin/UpgradeButton";
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

  const employees = await prisma.user.findMany({
    where: { organizationId: orgId, role: { in: ["EMPLOYEE", "ADMIN"] }, isActive: true },
    include: {
      timeEntries: {
        where: { status: "CLOCKED_OUT", clockIn: { gte: periodStart, lte: periodEnd } },
      },
    },
  });

  const activeEntries = await prisma.timeEntry.findMany({
    where: { user: { organizationId: orgId }, status: "CLOCKED_IN" },
    include: { user: true },
  });

  const activeUserIds = new Set(activeEntries.map((e) => e.userId));

  const payrollData = employees.map((emp) => {
    const totalMinutes = emp.timeEntries.reduce((acc, e) => acc + (e.durationMin || 0), 0);
    const totalHours = totalMinutes / 60;
    const regularHours = Math.min(totalHours, maxRegularHours);
    const overtimeHours = Math.max(0, totalHours - maxRegularHours);
    const totalPay = regularHours * (emp.hourlyRate || 0) + overtimeHours * (emp.overtimeRate || 0);
    return {
      id: emp.id, name: emp.name, email: emp.email, role: emp.role,
      hourlyRate: emp.hourlyRate, overtimeRate: emp.overtimeRate,
      totalHours: Math.round(totalHours * 10) / 10,
      regularHours: Math.round(regularHours * 10) / 10,
      overtimeHours: Math.round(overtimeHours * 10) / 10,
      totalPay: Math.round(totalPay * 100) / 100,
    };
  });

  const totalPayroll = payrollData.reduce((acc, e) => acc + e.totalPay, 0);
  const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const periodLabel = isFirstHalf
    ? `1 — 15 ${MONTHS[now.getUTCMonth()]}`
    : `16 — ${new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate()} ${MONTHS[now.getUTCMonth()]}`;

  const chartData = payrollData.map((emp) => ({
    name: emp.name.split(" ")[0], hours: emp.totalHours, pay: emp.totalPay,
  }));

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-primary)]">
        {/* Topbar */}
        <div className="h-14 border-b border-[var(--border)] px-6 flex items-center justify-between shrink-0 bg-[var(--bg-primary)]">
          <div>
            <h1 className="text-sm font-black text-[var(--text-primary)]">Dashboard</h1>
            <p className="text-xs text-[var(--text-muted)]">{periodLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UpgradeButton />
            <Link
              href="/en/admin/employees/new"
              className="bg-[#E8B84B] text-black text-xs px-4 py-2 rounded-xl font-black hover:bg-[#d4a43a] transition flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Empleado
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#E8B84B]/5 rounded-full -translate-y-4 translate-x-4" />
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-3">Total Empleados</p>
              <p className="text-4xl font-black text-[var(--text-primary)]">{employees.length}</p>
              <p className="text-xs text-[var(--text-muted)] mt-2">activos en sistema</p>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/5 rounded-full -translate-y-4 translate-x-4" />
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-3">Trabajando Ahora</p>
              <p className="text-4xl font-black text-green-500">{activeEntries.length}</p>
              <p className="text-xs text-[var(--text-muted)] mt-2">en este momento</p>
            </div>
            <div className="bg-[#E8B84B]/10 border border-[#E8B84B]/25 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#E8B84B]/10 rounded-full -translate-y-4 translate-x-4" />
              <p className="text-xs text-[#E8B84B]/70 uppercase tracking-wider mb-3">Nomina Estimada</p>
              <p className="text-4xl font-black text-[#E8B84B]">${totalPayroll.toLocaleString()}</p>
              <p className="text-xs text-[#E8B84B]/50 mt-2">{periodLabel}</p>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full -translate-y-4 translate-x-4" />
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-3">Horas Esta Quincena</p>
              <p className="text-4xl font-black text-[var(--text-primary)]">
                {Math.round(payrollData.reduce((acc, e) => acc + e.totalHours, 0))}h
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-2">horas registradas</p>
            </div>
          </div>

          {/* Chart + Active */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <HoursChart data={chartData} />
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <h2 className="text-sm font-bold text-[var(--text-primary)]">En Turno</h2>
                <span className="ml-auto text-xs bg-green-500/15 text-green-500 px-2 py-0.5 rounded-full font-semibold">{activeEntries.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-[var(--border)]">
                {activeEntries.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[var(--text-muted)]">Nadie trabajando ahora</div>
                ) : activeEntries.map((entry) => {
                  const minutesWorked = Math.floor((now.getTime() - new Date(entry.clockIn).getTime()) / 60000);
                  return (
                    <div key={entry.id} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-[var(--text-primary)]">{entry.user.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{new Date(entry.clockIn).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                      <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-medium">
                        {Math.floor(minutesWorked / 60)}h {minutesWorked % 60}m
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Payroll + Employees */}
          <div className="grid grid-cols-2 gap-4">
            {/* Payroll */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[var(--text-primary)]">Nomina Quincenal</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{periodLabel}</p>
                </div>
                <span className="text-sm font-black text-[#E8B84B]">${totalPayroll.toLocaleString()}</span>
              </div>
              <div className="divide-y divide-[var(--border)] max-h-64 overflow-y-auto">
                {payrollData.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[var(--text-muted)]">
                    <Link href="/en/admin/employees/new" className="text-[#E8B84B]">Agrega empleados</Link>
                  </div>
                ) : payrollData.map((emp) => (
                  <div key={emp.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-primary)]">{emp.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{emp.totalHours}h · {emp.overtimeHours > 0 ? <span className="text-orange-400">{emp.overtimeHours}h extra</span> : "sin horas extra"}</p>
                    </div>
                    <p className="text-sm font-black text-[#E8B84B]">${emp.totalPay.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Employees */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
                <h2 className="text-sm font-bold text-[var(--text-primary)]">Empleados</h2>
                <Link href="/en/admin/employees/new" className="text-xs text-[#E8B84B] hover:underline font-semibold">+ Agregar</Link>
              </div>
              <div className="divide-y divide-[var(--border)] max-h-64 overflow-y-auto">
                {employees.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[var(--text-muted)]">
                    <Link href="/en/admin/employees/new" className="text-[#E8B84B]">Agrega el primero</Link>
                  </div>
                ) : employees.map((emp) => {
                  const isActive = activeUserIds.has(emp.id);
                  return (
                    <div key={emp.id} className="px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? "bg-green-500" : "bg-[var(--border)]"}`} />
                        <div>
                          <p className="text-xs font-semibold text-[var(--text-primary)]">{emp.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">${emp.hourlyRate}/h</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${emp.role === "ADMIN" ? "bg-[#E8B84B]/15 text-[#E8B84B]" : "bg-[var(--border)] text-[var(--text-muted)]"}`}>
                          {emp.role === "ADMIN" ? "Admin" : "Empleado"}
                        </span>
                        <Link href={`/en/admin/employees/${emp.id}`} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border)] px-2.5 py-1 rounded-lg transition">
                          Editar
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
    </div>
  );
}