import { writeFileSync } from "fs";

const employeesApi = `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest, { params }: { params: any }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const orgId = (session.user as any).organizationId;
    const { id } = await params;
    const body = await req.json();
    const { name, email, hourlyRate, isActive, kioskPin } = body;

    const updateData: any = {
      name,
      email,
      isActive,
      hourlyRate: hourlyRate !== undefined ? parseFloat(hourlyRate) : undefined,
    };

    if (kioskPin && String(kioskPin).length === 4) {
      updateData.kioskPin = await bcrypt.hash(String(kioskPin), 10);
    }

    // Remove undefined fields
    Object.keys(updateData).forEach(k => updateData[k] === undefined && delete updateData[k]);

    const user = await prisma.user.update({
      where: { id, organizationId: orgId },
      data: updateData,
    });

    return NextResponse.json({ user });
  } catch (e: any) {
    console.error("PATCH employee error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: any }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const orgId = (session.user as any).organizationId;
    const { id } = await params;

    await prisma.timeEntry.deleteMany({ where: { userId: id, organizationId: orgId } });
    await prisma.activityLog.deleteMany({ where: { userId: id, organizationId: orgId } });
    await prisma.schedule.deleteMany({ where: { userId: id, organizationId: orgId } });
    await prisma.user.delete({ where: { id, organizationId: orgId } });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("DELETE employee error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}`;

const avatarApi = `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const orgId = (session.user as any).organizationId;
    const { userId, avatarColor } = await req.json();

    const user = await prisma.user.update({
      where: { id: userId, organizationId: orgId },
      data: { avatarColor } as any,
    });

    return NextResponse.json({ user });
  } catch (e: any) {
    console.error("Avatar error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}`;

// Fix time-entries manual registration - employees dropdown
const timeEntriesApi = `import { auth } from "@/lib/auth";
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
}`;

writeFileSync("src/app/api/employees/[id]/route.ts", employeesApi);
writeFileSync("src/app/api/employees/avatar/route.ts", avatarApi);
writeFileSync("src/app/api/time-entries/route.ts", timeEntriesApi);
console.log("Listo!");
