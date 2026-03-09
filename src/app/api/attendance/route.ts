import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const orgId = (session.user as any).organizationId;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const days = Number(searchParams.get("days") || 7);

  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const where: any = { organizationId: orgId, clockIn: { gte: since } };
  if (userId) where.userId = userId;

  const entries = await prisma.timeEntry.findMany({
    where,
    include: { user: { include: { schedule: true } } },
    orderBy: { clockIn: "desc" },
  });

  const results = entries.map(entry => {
    const schedule = entry.user.schedule;
    if (!schedule) return { ...entry, clockIn: entry.clockIn.toISOString(), clockOut: entry.clockOut?.toISOString() || null, status: "NO_SCHEDULE", lateMin: 0, earlyMin: 0, overtimeMin: 0, scheduledStart: "", scheduledEnd: "" };

    const clockIn = new Date(entry.clockIn);
    const dayOfWeek = clockIn.getDay();
    const dayMap: Record<number, keyof typeof schedule> = { 0: "sunday", 1: "monday", 2: "tuesday", 3: "wednesday", 4: "thursday", 5: "friday", 6: "saturday" };
    const dayKey = dayMap[dayOfWeek];
    const isWorkDay = schedule[dayKey] as boolean;

    if (!isWorkDay) return { ...entry, clockIn: entry.clockIn.toISOString(), clockOut: entry.clockOut?.toISOString() || null, status: "DAY_OFF", lateMin: 0, earlyMin: 0, overtimeMin: 0, scheduledStart: schedule.startTime, scheduledEnd: schedule.endTime };

    const [startH, startM] = schedule.startTime.split(":").map(Number);
    const [endH, endM] = schedule.endTime.split(":").map(Number);
    const scheduledStart = new Date(clockIn); scheduledStart.setHours(startH, startM, 0, 0);
    const scheduledEnd = new Date(clockIn); scheduledEnd.setHours(endH, endM, 0, 0);
    const lateMin = Math.max(0, Math.floor((clockIn.getTime() - scheduledStart.getTime()) / 60000) - schedule.toleranceMin);

    let earlyMin = 0, overtimeMin = 0;
    if (entry.clockOut) {
      const clockOut = new Date(entry.clockOut);
      earlyMin = Math.max(0, Math.floor((scheduledEnd.getTime() - clockOut.getTime()) / 60000));
      overtimeMin = Math.max(0, Math.floor((clockOut.getTime() - scheduledEnd.getTime()) / 60000));
    }

    return {
      id: entry.id,
      userId: entry.userId,
      userName: entry.user.name,
      clockIn: entry.clockIn.toISOString(),
      clockOut: entry.clockOut?.toISOString() || null,
      durationMin: entry.durationMin,
      status: lateMin > 0 ? "LATE" : "ON_TIME",
      lateMin, earlyMin, overtimeMin,
      scheduledStart: schedule.startTime,
      scheduledEnd: schedule.endTime,
    };
  });

  return NextResponse.json({ entries: results });
}