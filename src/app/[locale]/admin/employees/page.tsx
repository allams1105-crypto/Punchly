import { auth } from "@/lib/auth";
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
}