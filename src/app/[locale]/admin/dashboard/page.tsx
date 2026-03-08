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
      id: emp.id,
      name: emp.name,
      email: emp.email,
      role: emp.role,
      hourlyRate: emp.hourlyRate,
      overtimeRate: emp.overtimeRate,
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
    name: emp.name.split(" ")[0],
    hours: emp.totalHours,
    pay: emp.totalPay,
  }));

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <div className="bg-black border-b border-white/8 px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[#E8B84B] rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-xs">P</span>
          </div>
          <span className="text-white font-black text-lg tracking-tight">Punchly.Clock</span>
          <span className="text-white/20 mx-1">|</span>
          <span className="text-white/40 text-sm">{org?.name || "Sin Organizacion"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/en/admin/payroll" className="text-xs text-white/50 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition">Nomina</Link>
          <Link href="/en/admin/activity" className="text-xs text-white/50 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition">Actividad</Link>
          <Link href="/en/admin/settings" className="text-xs text-white/50 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition">Settings</Link>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <UpgradeButton />
          <Link href="/en/admin/employees/new" className="bg-[#E8B84B] text-black text-xs px-4 py-2 rounded-lg font-black hover:bg-[#d4a43a] transition">
            + Empleado
          </Link>
          <Link href="/en/admin/kiosk" className="text-xs text-white/50 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition">Kiosk</Link>
          <ThemeToggle />
          <a href="/api/auth/signout" className="text-xs text-white/30 hover:text-white/70 transition">Salir</a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Empleados activos</p>
            <p className="text-4xl font-black text-white">{employees.length}</p>
          </div>
          <div className="bg-white/5 border border-white/8 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-6 translate-x-6" />
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Trabajando ahora</p>
            <p className="text-4xl font-black text-green-400">{activeEntries.length}</p>
          </div>
          <div className="bg-[#E8B84B]/10 border border-[#E8B84B]/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#E8B84B]/10 rounded-full -translate-y-8 translate-x-8" />
            <p className="text-xs text-[#E8B84B]/60 uppercase tracking-wider mb-3">Nomina estimada</p>
            <p className="text-4xl font-black text-[#E8B84B]">${totalPayroll.toLocaleString()}</p>
            <p className="text-xs text-[#E8B84B]/40 mt-2">{periodLabel}</p>
          </div>
        </div>

        {/* Active employees */}
        {activeEntries.length > 0 && (
          <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/8 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <h2 className="text-sm font-bold text-white">Trabajando ahora</h2>
            </div>
            <div className="divide-y divide-white/5">
              {activeEntries.map((entry) => {
                const minutesWorked = Math.floor((now.getTime() - new Date(entry.clockIn).getTime()) / 60000);
                return (
                  <div key={entry.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{entry.user.name}</p>
                      <p className="text-xs text-white/40 mt-0.5">Desde {new Date(entry.clockIn).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-full font-semibold">
                      {Math.floor(minutesWorked / 60)}h {minutesWorked % 60}m
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Chart */}
        <HoursChart data={chartData} />

        {/* Payroll */}
        <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Nomina quincenal</h2>
              <p className="text-xs text-white/40 mt-0.5">{periodLabel}</p>
            </div>
            <span className="text-sm font-black text-[#E8B84B]">${totalPayroll.toLocaleString()}</span>
          </div>
          {payrollData.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-white/30">No hay empleados. <Link href="/en/admin/employees/new" className="text-[#E8B84B]">Agrega uno</Link></p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {payrollData.map((emp) => (
                <div key={emp.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-white">{emp.name}</p>
                    <p className="text-sm font-black text-[#E8B84B]">${emp.totalPay.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-4 text-xs text-white/30">
                    <span>{emp.totalHours}h totales</span>
                    <span>{emp.regularHours}h normales x ${emp.hourlyRate}/h</span>
                    {emp.overtimeHours > 0 && <span className="text-orange-400">{emp.overtimeHours}h extra x ${emp.overtimeRate}/h</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Employees */}
        <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Empleados</h2>
            <Link href="/en/admin/employees/new" className="text-xs text-[#E8B84B] hover:underline">+ Agregar</Link>
          </div>
          {employees.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-white/30">No hay empleados. <Link href="/en/admin/employees/new" className="text-[#E8B84B]">Agrega el primero</Link></p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {employees.map((emp) => {
                const isActive = activeUserIds.has(emp.id);
                return (
                  <div key={emp.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isActive ? "bg-green-400" : "bg-white/15"}`} />
                      <div>
                        <p className="text-sm font-semibold text-white">{emp.name}</p>
                        <p className="text-xs text-white/30">{emp.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-white/40">${emp.hourlyRate}/h</p>
                        <p className="text-xs text-white/20">extra: ${emp.overtimeRate}/h</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${emp.role === "ADMIN" ? "bg-[#E8B84B]/15 text-[#E8B84B]" : "bg-white/8 text-white/40"}`}>
                        {emp.role === "ADMIN" ? "Admin" : "Empleado"}
                      </span>
                      <Link href={`/en/admin/employees/${emp.id}`} className="text-xs text-white/30 hover:text-white border border-white/10 px-3 py-1 rounded-lg transition">
                        Editar
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}