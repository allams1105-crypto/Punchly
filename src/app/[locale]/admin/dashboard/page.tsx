import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import UpgradeButton from "@/components/admin/UpgradeButton";
import UpgradeButton from "@/components/admin/UpgradeButton";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect("/en/login");

  const role = (session.user as any).role;
  if (role !== "OWNER" && role !== "ADMIN") redirect("/en/employee/dashboard");

  const orgId = (session.user as any).organizationId;

  const org = await prisma.organization.findUnique({ where: { id: orgId } });

  const now = new Date();
  const isFirstHalf = now.getDate() <= 15;
  const periodStart = isFirstHalf
    ? new Date(now.getFullYear(), now.getMonth(), 1)
    : new Date(now.getFullYear(), now.getMonth(), 16);
  const periodEnd = isFirstHalf
    ? new Date(now.getFullYear(), now.getMonth(), 15, 23, 59, 59)
    : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const employees = await prisma.user.findMany({
    where: { organizationId: orgId, role: "EMPLOYEE", isActive: true },
    include: {
      timeEntries: {
        where: {
          status: "CLOCKED_OUT",
          clockIn: { gte: periodStart, lte: periodEnd },
        },
      },
    },
  });

  const activeEntries = await prisma.timeEntry.findMany({
    where: { user: { organizationId: orgId }, status: "CLOCKED_IN" },
    include: { user: true },
  });

  const payrollData = employees.map((emp) => {
    const totalMinutes = emp.timeEntries.reduce((acc, e) => acc + (e.durationMin || 0), 0);
    const totalHours = totalMinutes / 60;
    const regularHours = Math.min(totalHours, 8 * 15);
    const overtimeHours = Math.max(0, totalHours - 8 * 15);
    const totalPay = regularHours * (emp.hourlyRate || 0) + overtimeHours * (emp.overtimeRate || 0);
    return {
      id: emp.id,
      name: emp.name,
      email: emp.email,
      hourlyRate: emp.hourlyRate,
      overtimeRate: emp.overtimeRate,
      totalHours: Math.round(totalHours * 10) / 10,
      regularHours: Math.round(regularHours * 10) / 10,
      overtimeHours: Math.round(overtimeHours * 10) / 10,
      totalPay: Math.round(totalPay * 100) / 100,
    };
  });

  const totalPayroll = payrollData.reduce((acc, e) => acc + e.totalPay, 0);
  const periodLabel = isFirstHalf
    ? `1 — 15 ${now.toLocaleDateString("es", { month: "long" })}`
    : `16 — ${new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()} ${now.toLocaleDateString("es", { month: "long" })}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900">Punchly</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500 text-sm">{org?.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/en/admin/employees/new" className="bg-black text-white text-xs px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            + Empleado
          </Link>
          <Link href="/en/admin/kiosk" className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
            Kiosk
          </Link>
          <UpgradeButton />
          <UpgradeButton />
          <a href="/api/auth/signout" className="text-xs text-gray-400 hover:text-gray-700">
            Salir
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs text-gray-400 mb-1">Empleados activos</p>
            <p className="text-3xl font-bold text-gray-900">{employees.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs text-gray-400 mb-1">Trabajando ahora</p>
            <p className="text-3xl font-bold text-green-600">{activeEntries.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs text-gray-400 mb-1">Nomina estimada</p>
            <p className="text-3xl font-bold text-gray-900">${totalPayroll.toLocaleString()}</p>
          </div>
        </div>

        {activeEntries.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="p-5 border-b border-gray-100 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <h2 className="text-sm font-semibold text-gray-900">Trabajando ahora</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {activeEntries.map((entry) => {
                const minutesWorked = Math.floor((now.getTime() - new Date(entry.clockIn).getTime()) / 60000);
                return (
                  <div key={entry.id} className="px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{entry.user.name}</p>
                      <p className="text-xs text-gray-400">Desde {new Date(entry.clockIn).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      {Math.floor(minutesWorked / 60)}h {minutesWorked % 60}m
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Nomina quincenal</h2>
              <p className="text-xs text-gray-400 mt-0.5">Periodo: {periodLabel}</p>
            </div>
            <span className="text-sm font-bold text-gray-900">${totalPayroll.toLocaleString()} total</span>
          </div>
          {payrollData.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">
              No hay empleados. <Link href="/en/admin/employees/new" className="text-black font-medium">Agrega uno</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {payrollData.map((emp) => (
                <div key={emp.id} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                    <p className="text-sm font-bold text-gray-900">${emp.totalPay.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>{emp.totalHours}h totales</span>
                    <span>{emp.regularHours}h normales x ${emp.hourlyRate}/h</span>
                    {emp.overtimeHours > 0 && (
                      <span className="text-orange-500">{emp.overtimeHours}h extra x ${emp.overtimeRate}/h</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Empleados</h2>
            <Link href="/en/admin/employees/new" className="text-xs text-gray-500 hover:text-black">+ Agregar</Link>
          </div>
          {employees.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">
              No hay empleados. <Link href="/en/admin/employees/new" className="text-black font-medium">Agrega el primero</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {employees.map((emp) => {
                const isActive = activeEntries.some((e) => e.userId === emp.id);
                return (
                  <div key={emp.id} className="px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500" : "bg-gray-300"}`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                        <p className="text-xs text-gray-400">{emp.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">${emp.hourlyRate}/h</p>
                      <p className="text-xs text-gray-300">extra: ${emp.overtimeRate}/h</p>
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