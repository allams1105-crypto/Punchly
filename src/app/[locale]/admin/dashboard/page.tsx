import { auth } from "@/lib/auth";
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

  // 1. Cargamos todos los datos necesarios
  const [employees, activeEntries, periodEntries, org] = await Promise.all([
    prisma.user.findMany({ 
      where: { organizationId: orgId, isActive: true, role: { not: "OWNER" } }, 
      orderBy: { name: "asc" } 
    }),
    prisma.timeEntry.findMany({ 
      where: { organizationId: orgId, clockOut: null } 
    }),
    prisma.timeEntry.findMany({ 
      where: { organizationId: orgId, clockIn: { gte: periodStart } } 
    }),
    prisma.organization.findUnique({ where: { id: orgId } }),
  ]);

  // 2. Preparamos las propiedades faltantes para EmployeeTable
  const activeUserIds = activeEntries.map(e => e.userId);

  const activeEntryMap = activeEntries.reduce((acc, entry) => {
    acc[entry.userId] = entry;
    return acc;
  }, {} as Record<string, any>);

  const payrollData = employees.map(emp => {
    const empEntries = periodEntries.filter(e => e.userId === emp.id);
    const hours = empEntries.reduce((acc, e) => acc + (e.durationMin || 0), 0) / 60;
    const rate = emp.hourlyRate || 0;
    return {
      userId: emp.id,
      hours,
      total: hours * rate
    };
  });

  const totalHours = Math.floor(periodEntries.reduce((acc, e) => acc + (e.durationMin || 0), 0) / 60);
  const estimatedPayroll = payrollData.reduce((acc, p) => acc + p.total, 0);

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
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
            <p className="text-xs text-[var(--text-muted)] mb-2">Total empleados</p>
            <p className="text-2xl font-black text-[var(--text-primary)]">{employees.length}</p>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
            <p className="text-xs text-[var(--text-muted)] mb-2">En turno</p>
            <p className="text-2xl font-black text-green-400">{activeEntries.length}</p>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
            <p className="text-xs text-[var(--text-muted)] mb-2">Horas quincena</p>
            <p className="text-2xl font-black text-[#E8B84B]">{totalHours}h</p>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
            <p className="text-xs text-[var(--text-muted)] mb-2">Nómina estimada</p>
            <p className="text-2xl font-black text-[#E8B84B]">${estimatedPayroll.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <AttendanceChart />
            
            {/* CORRECCIÓN FINAL: Pasamos todos los datos que la tabla requiere */}
            <EmployeeTable 
              employees={employees} 
              payrollData={payrollData}
              activeUserIds={activeUserIds}
              activeEntryMap={activeEntryMap}
              now={now.toISOString()}
            />
          </div>

          <div className="space-y-3">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4">
              <h3 className="text-sm font-bold mb-3 text-[var(--text-primary)]">Acciones rápidas</h3>
              <div className="flex flex-col gap-2">
                <Link href="/en/admin/kiosk" className="text-xs text-[var(--text-muted)] hover:text-white transition">📱 Abrir Kiosk</Link>
                <Link href="/en/admin/employees" className="text-xs text-[var(--text-muted)] hover:text-white transition">👥 Gestionar Empleados</Link>
                <Link href="/en/admin/payroll" className="text-xs text-[var(--text-muted)] hover:text-white transition">💰 Reporte Nómina</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}