import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const role = (session.user as any).role;
  if (role !== "OWNER" && role !== "ADMIN") return NextResponse.json({ error: "Sin permisos" }, { status: 403 });

  const orgId = (session.user as any).organizationId;

  const { searchParams } = new URL(req.url);
  const periodParam = searchParams.get("period"); // "current" | "previous"
  
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  let half = new Date().getDate() <= 15 ? "1" : "2";

  if (periodParam === "previous") {
    if (half === "1") {
      half = "2";
      month = month - 1;
      if (month === 0) {
        month = 12;
        year = year - 1;
      }
    } else {
      half = "1";
    }
  }

  const periodString = `${year}-${month}-${half}`;

  const periodStart = half === "1"
    ? new Date(Date.UTC(year, month - 1, 1))
    : new Date(Date.UTC(year, month - 1, 16));

  const periodEnd = half === "1"
    ? new Date(Date.UTC(year, month - 1, 15, 23, 59, 59))
    : new Date(Date.UTC(year, month, 0, 23, 59, 59));

  const [org, employees, overrides] = await Promise.all([
    prisma.organization.findUnique({ where: { id: orgId } }),
    prisma.user.findMany({
      where: { organizationId: orgId, isActive: true },
      include: {
        schedule: true,
        timeEntries: {
          where: { status: "CLOCKED_OUT", clockIn: { gte: periodStart, lte: periodEnd } },
        },
      },
    }),
    prisma.payrollOverride.findMany({
      where: { organizationId: orgId, period: periodString },
    }),
  ]);

  const overtimeThreshold = org?.overtimeThreshold || 0;
  const overrideMap = new Map(overrides.map(o => [o.userId, o]));

  function getScheduledHoursForPeriod(schedule: any, start: Date, end: Date) {
    if (!schedule) {
      const periodDays = half === "1" ? 15 : new Date(Date.UTC(year, month, 0)).getUTCDate() - 15;
      return 8 * periodDays;
    }
    
    let hours = 0;
    let current = new Date(start);
    
    const getDiff = (s: string, e: string) => {
      if(!s || !e) return 0;
      const [sh,sm] = s.split(':').map(Number);
      const [eh,em] = e.split(':').map(Number);
      const diff = (eh * 60 + em) - (sh * 60 + sm);
      return diff > 0 ? diff / 60 : 0;
    };
    
    const dayMap = [
      { on: schedule.sunday, diff: getDiff(schedule.sunStart, schedule.sunEnd) },
      { on: schedule.monday, diff: getDiff(schedule.monStart, schedule.monEnd) },
      { on: schedule.tuesday, diff: getDiff(schedule.tueStart, schedule.tueEnd) },
      { on: schedule.wednesday, diff: getDiff(schedule.wedStart, schedule.wedEnd) },
      { on: schedule.thursday, diff: getDiff(schedule.thuStart, schedule.thuEnd) },
      { on: schedule.friday, diff: getDiff(schedule.friStart, schedule.friEnd) },
      { on: schedule.saturday, diff: getDiff(schedule.satStart, schedule.satEnd) },
    ];

    while (current <= end) {
      const d = current.getUTCDay();
      if (dayMap[d].on) {
        const diff = dayMap[d].diff || getDiff(schedule.startTime, schedule.endTime);
        hours += diff;
      }
      current.setUTCDate(current.getUTCDate() + 1);
    }
    return hours;
  }

  const data = employees.map((emp) => {
    const scheduledHours = getScheduledHoursForPeriod(emp.schedule, periodStart, periodEnd);
    const overtimeStartsAt = scheduledHours + overtimeThreshold;

    const totalMinutes = emp.timeEntries.reduce((acc, e) => acc + (e.durationMin || 0), 0);
    const calcTotalHours = totalMinutes / 60;
    const calcRegularHours = Math.min(calcTotalHours, overtimeStartsAt);
    const calcOvertimeHours = Math.max(0, calcTotalHours - overtimeStartsAt);
    const calcTotalPay = calcRegularHours * (emp.hourlyRate || 0) + calcOvertimeHours * (emp.overtimeRate || 0);

    const override = overrideMap.get(emp.id);
    const totalHours = override?.totalHours ?? calcTotalHours;
    const regularHours = Math.min(totalHours, overtimeStartsAt);
    const overtimeHours = Math.max(0, totalHours - overtimeStartsAt);
    const totalPay = override?.totalPay ?? (regularHours * (emp.hourlyRate || 0) + overtimeHours * (emp.overtimeRate || 0));

    return {
      id: emp.id,
      name: emp.name,
      role: emp.role,
      hourlyRate: emp.hourlyRate,
      overtimeRate: emp.overtimeRate,
      totalHours: Math.round(totalHours * 10) / 10,
      regularHours: Math.round(regularHours * 10) / 10,
      overtimeHours: Math.round(overtimeHours * 10) / 10,
      totalPay: Math.round(totalPay * 100) / 100,
      isOverridden: !!override,
      period: periodString,
      avatarUrl: emp.avatarUrl,
      avatarColor: (emp as any).avatarColor || null,
    };
  });

  return NextResponse.json({ data, periodStart, periodEnd });
}
