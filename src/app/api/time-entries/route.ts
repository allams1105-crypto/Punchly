import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const orgId = (session.user as any).organizationId;

    const employees = await prisma.user.findMany({
      where: { organizationId: orgId, role: { not: "OWNER" }, isActive: true },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    });

    const entries = await prisma.timeEntry.findMany({
      where: { organizationId: orgId },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { clockIn: "desc" },
      take: 100,
    });

    return NextResponse.json({ employees, entries });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const orgId = (session.user as any).organizationId;
    const body = await req.json();
    const { userId, clockIn, clockOut, note } = body;

    if (!userId || !clockIn) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });

    const clockInDate = new Date(clockIn);
    const clockOutDate = clockOut ? new Date(clockOut) : null;
    const durationMin = clockOutDate
      ? Math.floor((clockOutDate.getTime() - clockInDate.getTime()) / 60000)
      : null;

    const entry = await prisma.timeEntry.create({
      data: {
        organizationId: orgId,
        userId,
        clockIn: clockInDate,
        clockOut: clockOutDate,
        durationMin,
        note,
        source: "manual",
        status: clockOutDate ? "CLOCKED_OUT" : "CLOCKED_IN",
      },
    });

    return NextResponse.json({ entry });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}