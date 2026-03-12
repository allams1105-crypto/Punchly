import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import EmployeeDashboardClient from "@/components/employee/EmployeeDashboardClient";

export default async function EmployeeDashboardPage() {
  const session = await auth();
  if (!session) redirect("/en/login");
  const userId = (session.user as any).id;
  const orgId = (session.user as any).organizationId;

  const today = new Date(); today.setHours(0,0,0,0);
  const weekStart = new Date(today); weekStart.setDate(today.getDate() - today.getDay());

  const [user, org, todayEntry, weekEntries, lateLogs, recentEntries] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, include: { schedule: true } }),
    prisma.organization.findUnique({ where: { id: orgId } }),
    prisma.timeEntry.findFirst({ where: { userId, organizationId: orgId, clockIn: { gte: today } }, orderBy: { clockIn: "desc" } }),
    prisma.timeEntry.findMany({ where: { userId, organizationId: orgId, clockIn: { gte: weekStart } } }),
    prisma.activityLog.findMany({ where: { userId, organizationId: orgId, action: "LATE", createdAt: { gte: weekStart } } }),
    prisma.timeEntry.findMany({ where: { userId, organizationId: orgId }, orderBy: { clockIn: "desc" }, take: 10 }),
  ]);

  if (!user) redirect("/en/login");

  const onShift = !!todayEntry && !todayEntry.clockOut;
  const totalMin = weekEntries.reduce((acc, e) => acc + (e.durationMin || 0), 0);
  const daysWorked = new Set(weekEntries.map(e => new Date(e.clockIn).toDateString())).size;

  return (
    <EmployeeDashboardClient
      user={{ id: user.id, name: user.name, email: user.email, avatarColor: (user as any).avatarColor }}
      onShift={onShift}
      todayEntry={todayEntry ? { clockIn: todayEntry.clockIn.toISOString(), clockOut: todayEntry.clockOut?.toISOString() || null } : null}
      weekStats={{ totalMin, daysWorked, lateCount: lateLogs.length }}
      schedule={user.schedule}
      recentEntries={recentEntries.map(e => ({ id: e.id, clockIn: e.clockIn.toISOString(), clockOut: e.clockOut?.toISOString() || null, durationMin: e.durationMin }))}
      geoEnabled={!!((org as any)?.lat && (org as any)?.lng)}
      geoRadius={(org as any)?.geoRadius || 100}
    />
  );
}