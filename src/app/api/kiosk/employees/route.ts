import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("orgId");
    if (!orgId) return NextResponse.json({ error: "Missing orgId" }, { status: 400 });

    const today = new Date(); today.setHours(0,0,0,0);

    const [employees, activeEntries] = await Promise.all([
      prisma.user.findMany({
        where: { organizationId: orgId, isActive: true, role: { not: "OWNER" } },
        orderBy: { name: "asc" },
      }),
      prisma.timeEntry.findMany({
        where: { organizationId: orgId, clockOut: null, clockIn: { gte: today } },
      }),
    ]);

    const activeIds = new Set(activeEntries.map(e => e.userId));

    return NextResponse.json({
      employees: employees.map(e => ({
        id: e.id,
        name: e.name || "",
        avatarColor: (e as any).avatarColor || null,
        onShift: activeIds.has(e.id),
        clockInTime: activeEntries.find(a => a.userId === e.id)?.clockIn?.toISOString() || null,
      }))
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}