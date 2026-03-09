import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import EmployeeDashboardClient from "@/components/employee/EmployeeDashboardClient";

export default async function EmployeeDashboardPage() {
  const session = await auth();
  if (!session) redirect("/en/login");

  const userId = (session.user as any).id;
  const orgId = (session.user as any).organizationId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { schedule: true },
  });

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const todayStart = new Date(now); todayStart.setHours(0,0,0,0);

  const [todayEntries, weekEntries, monthEntries] = await Promise.all([
    prisma.timeEntry.findMany({ where: { userId, organizationId: orgId, clockIn: { gte: todayStart } }, orderBy: { clockIn: "desc" } }),
    prisma.timeEntry.findMany({ where: { userId, organizationId: orgId, clockIn: { gte: weekStart } }, orderBy: { clockIn: "desc" } }),
    prisma.timeEntry.findMany({ where: { userId, organizationId: orgId, clockIn: { gte: monthStart } }, orderBy: { clockIn: "desc" } }),
  ]);

  const sumMin = (entries: any[]) => entries.reduce((acc, e) => acc + (e.durationMin || 0), 0);
  const todayMin = sumMin(todayEntries);
  const weekMin = sumMin(weekEntries);
  const monthMin = sumMin(monthEntries);

  const onShift = weekEntries.find(e => !e.clockOut);

  // Attendance for last 7 days with schedule check
  const schedule = user?.schedule;
  const DAYS: Record<number, string> = { 0: "sunday", 1: "monday", 2: "tuesday", 3: "wednesday", 4: "thursday", 5: "friday", 6: "saturday" };

  const attendanceHistory = weekEntries.map(entry => {
    const clockIn = new Date(entry.clockIn);
    let status = "NO_SCHEDULE";
    let lateMin = 0;
    let overtimeMin = 0;

    if (schedule) {
      const dayKey = DAYS[clockIn.getDay()];
      const isWorkDay = (schedule as any)[dayKey] as boolean;
      if (isWorkDay) {
        const [startH, startM] = schedule.startTime.split(":").map(Number);
        const [endH, endM] = schedule.endTime.split(":").map(Number);
        const scheduledStart = new Date(clockIn); scheduledStart.setHours(startH, startM, 0, 0);
        const scheduledEnd = new Date(clockIn); scheduledEnd.setHours(endH, endM, 0, 0);
        lateMin = Math.max(0, Math.floor((clockIn.getTime() - scheduledStart.getTime()) / 60000) - schedule.toleranceMin);
        if (entry.clockOut) {
          const clockOut = new Date(entry.clockOut);
          overtimeMin = Math.max(0, Math.floor((clockOut.getTime() - scheduledEnd.getTime()) / 60000));
        }
        status = lateMin > 0 ? "LATE" : "ON_TIME";
      } else {
        status = "DAY_OFF";
      }
    }

    return {
      id: entry.id,
      clockIn: entry.clockIn.toISOString(),
      clockOut: entry.clockOut?.toISOString() || null,
      durationMin: entry.durationMin,
      status,
      lateMin,
      overtimeMin,
    };
  });

  return (
    <EmployeeDashboardClient
      user={{ name: user?.name || "Empleado", email: user?.email || "" }}
      schedule={schedule ? {
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        toleranceMin: schedule.toleranceMin,
        monday: schedule.monday, tuesday: schedule.tuesday, wednesday: schedule.wednesday,
        thursday: schedule.thursday, friday: schedule.friday, saturday: schedule.saturday, sunday: schedule.sunday,
      } : null}
      stats={{ todayMin, weekMin, monthMin }}
      onShift={!!onShift}
      attendanceHistory={attendanceHistory}
    />
  );
}