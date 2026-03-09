import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const orgId = (session.user as any).organizationId;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const where: any = { organizationId: orgId, clockIn: { gte: weekStart } };
  if (userId) where.userId = userId;

  const entries = await prisma.timeEntry.findMany({
    where,
    include: { user: { include: { schedule: true } } },
    orderBy: { clockIn: "desc" },
  });

  const results = entries.map(entry => {
    const schedule = entry.user.schedule;
    if (!schedule) return { ...entry, status: "NO_SCHEDULE", lateMin: 0, earlyMin: 0, overtimeMin: 0 };

    const clockIn = new Date(entry.clockIn);
    const dayOfWeek = clockIn.getDay();
    const dayMap: Record<number, keyof typeof schedule> = { 0: "sunday", 1: "monday", 2: "tuesday", 3: "wednesday", 4: "thursday", 5: "friday", 6: "saturday" };
    const dayKey = dayMap[dayOfWeek];
    const isWorkDay = schedule[dayKey] as boolean;

    if (!isWorkDay) return { ...entry, status: "DAY_OFF", lateMin: 0, earlyMin: 0, overtimeMin: 0 };

    const [startH, startM] = schedule.startTime.split(":").map(Number);
    const [endH, endM] = schedule.endTime.split(":").map(Number);

    const scheduledStart = new Date(clockIn);
    scheduledStart.setHours(startH, startM, 0, 0);

    const scheduledEnd = new Date(clockIn);
    scheduledEnd.setHours(endH, endM, 0, 0);

    const lateMin = Math.max(0, Math.floor((clockIn.getTime() - scheduledStart.getTime()) / 60000) - schedule.toleranceMin);

    let earlyMin = 0;
    let overtimeMin = 0;

    if (entry.clockOut) {
      const clockOut = new Date(entry.clockOut);
      earlyMin = Math.max(0, Math.floor((scheduledEnd.getTime() - clockOut.getTime()) / 60000));
      overtimeMin = Math.max(0, Math.floor((clockOut.getTime() - scheduledEnd.getTime()) / 60000));
    }

    const status = lateMin > 0 ? "LATE" : "ON_TIME";

    return {
      id: entry.id,
      userId: entry.userId,
      userName: entry.user.name,
      clockIn: entry.clockIn,
      clockOut: entry.clockOut,
      durationMin: entry.durationMin,
      status,
      lateMin,
      earlyMin,
      overtimeMin,
      scheduledStart: schedule.startTime,
      scheduledEnd: schedule.endTime,
    };
  });

  return NextResponse.json({ entries: results });
}