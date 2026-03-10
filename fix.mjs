import { writeFileSync, mkdirSync } from "fs";

// 1. Create employees page
const employeesPage = `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import EmployeesClient from "@/components/admin/EmployeesClient";

export default async function EmployeesPage() {
  const session = await auth();
  if (!session) redirect("/en/login");
  const orgId = (session.user as any).organizationId;

  const employees = await prisma.user.findMany({
    where: { organizationId: orgId, role: { not: "OWNER" } },
    include: { schedule: true },
    orderBy: { name: "asc" },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeEntries = await prisma.timeEntry.findMany({
    where: { organizationId: orgId, clockOut: null, clockIn: { gte: today } },
  });
  const activeIds = new Set(activeEntries.map(e => e.userId));

  return (
    <EmployeesClient employees={employees.map(e => ({
      id: e.id,
      name: e.name || "",
      email: e.email || "",
      role: e.role,
      isActive: e.isActive,
      hourlyRate: (e as any).hourlyRate || 0,
      avatarColor: (e as any).avatarColor || null,
      hasSchedule: !!e.schedule,
      onShift: activeIds.has(e.id),
    }))} />
  );
}`;

// 2. Fix dashboard - remove emojis
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
    { label: "Nómina estimada", value: "\$" + estimatedPayroll.toLocaleString("en", { maximumFractionDigits: 0 }), sub: "este período", color: "text-[#E8B84B]" },
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
                  { href: "/en/admin/employees/new", label: "Nuevo empleado" },
                  { href: "/en/admin/employees", label: "Ver empleados" },
                  { href: "/en/admin/kiosk", label: "Abrir Kiosk" },
                  { href: "/en/admin/payroll", label: "Ver nómina" },
                  { href: "/en/admin/attendance", label: "Asistencia" },
                  { href: "/en/admin/activity", label: "Actividad" },
                ].map(a => (
                  <Link key={a.href} href={a.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition">
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

// 3. Fix landing - remove "Más popular" badge
const { readFileSync } = await import("fs");
let landing = readFileSync("src/app/[locale]/page.tsx", "utf8");
landing = landing.replace(
  `<span className="absolute top-4 right-4 bg-black/20 text-black text-xs font-black px-2.5 py-1 rounded-full">
              {t("landing.pro.badge")}
            </span>`,
  ``
);
writeFileSync("src/app/[locale]/page.tsx", landing);

mkdirSync("src/app/[locale]/admin/employees", { recursive: true });
writeFileSync("src/app/[locale]/admin/employees/page.tsx", employeesPage);
writeFileSync("src/app/[locale]/admin/dashboard/page.tsx", dashboard);
console.log("Listo!");

