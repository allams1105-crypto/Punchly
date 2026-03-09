import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const orgId = (session.user as any).organizationId;

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const end = new Date(d); end.setHours(23, 59, 59, 999);
    const entries = await prisma.timeEntry.findMany({
      where: { organizationId: orgId, clockIn: { gte: d, lte: end } },
      include: { user: { include: { schedule: true } } },
    });

    let onTime = 0, late = 0, absent = 0;

    // Count scheduled employees
    const scheduled = await prisma.schedule.findMany({ where: { organizationId: orgId } });
    const dayMap: Record<number, string> = { 0: "sunday", 1: "monday", 2: "tuesday", 3: "wednesday", 4: "thursday", 5: "friday", 6: "saturday" };
    const dayKey = dayMap[d.getDay()];

    for (const sched of scheduled) {
      const isWorkDay = (sched as any)[dayKey] as boolean;
      if (!isWorkDay) continue;
      const entry = entries.find(e => e.userId === sched.userId);
      if (!entry) { absent++; continue; }

      const clockIn = new Date(entry.clockIn);
      const [startH, startM] = sched.startTime.split(":").map(Number);
      const scheduledStart = new Date(clockIn); scheduledStart.setHours(startH, startM, 0, 0);
      const lateMin = Math.floor((clockIn.getTime() - scheduledStart.getTime()) / 60000) - sched.toleranceMin;
      if (lateMin > 0) late++; else onTime++;
    }

    days.push({
      day: d.toLocaleDateString("es", { weekday: "short" }),
      date: d.toLocaleDateString("es", { day: "numeric", month: "short" }),
      onTime, late, absent,
      total: onTime + late,
    });
  }

  return NextResponse.json({ days });
}