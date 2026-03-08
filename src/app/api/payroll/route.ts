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
  const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());
  const month = parseInt(searchParams.get("month") || (new Date().getMonth() + 1).toString());
  const half = searchParams.get("half") || "1";

  const periodStart = half === "1"
    ? new Date(Date.UTC(year, month - 1, 1))
    : new Date(Date.UTC(year, month - 1, 16));

  const periodEnd = half === "1"
    ? new Date(Date.UTC(year, month - 1, 15, 23, 59, 59))
    : new Date(Date.UTC(year, month, 0, 23, 59, 59));

  const periodDays = half === "1" ? 15 : new Date(Date.UTC(year, month, 0)).getUTCDate() - 15;
  const maxRegularHours = 8 * periodDays;

  const employees = await prisma.user.findMany({
    where: { organizationId: orgId, isActive: true },
    include: {
      timeEntries: {
        where: { status: "CLOCKED_OUT", clockIn: { gte: periodStart, lte: periodEnd } },
      },
    },
  });

  const data = employees.map((emp) => {
    const totalMinutes = emp.timeEntries.reduce((acc, e) => acc + (e.durationMin || 0), 0);
    const totalHours = totalMinutes / 60;
    const regularHours = Math.min(totalHours, maxRegularHours);
    const overtimeHours = Math.max(0, totalHours - maxRegularHours);
    const totalPay = regularHours * (emp.hourlyRate || 0) + overtimeHours * (emp.overtimeRate || 0);
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
    };
  });

  return NextResponse.json({ data, periodStart, periodEnd });
}