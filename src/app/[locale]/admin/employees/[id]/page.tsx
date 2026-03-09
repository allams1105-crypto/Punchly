import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ScheduleEditor from "@/components/admin/ScheduleEditor";
import EmployeeEditClient from "@/components/admin/EmployeeEditClient";

export default async function EmployeeEditPage({ params }: { params: any }) {
  const session = await auth();
  if (!session) redirect("/en/login");
  const orgId = (session.user as any).organizationId;
  const { id } = params;

  const employee = await prisma.user.findFirst({
    where: { id, organizationId: orgId },
  });

  if (!employee) redirect("/en/admin/dashboard");

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center bg-[var(--bg-primary)]">
        <div>
          <h1 className="text-sm font-black text-[var(--text-primary)]">Editar empleado</h1>
          <p className="text-xs text-[var(--text-muted)]">{employee.name}</p>
        </div>
      </div>
      <div className="p-6 space-y-4 max-w-2xl">
        <EmployeeEditClient employee={{
          id: employee.id,
          name: employee.name,
          email: employee.email,
          role: employee.role,
          hourlyRate: (employee as any).hourlyRate || 0,
          isActive: employee.isActive,
          avatarUrl: (employee as any).avatarUrl || null,
          avatarColor: (employee as any).avatarColor || null,
        }} />
        <ScheduleEditor userId={employee.id} employeeName={employee.name} />
      </div>
    </div>
  );
}