import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId requerido" }, { status: 400 });
    const schedule = await prisma.schedule.findUnique({ where: { userId } });
    return NextResponse.json({ schedule });
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
    const { userId, monday, tuesday, wednesday, thursday, friday, saturday, sunday,
      monStart, monEnd, tueStart, tueEnd, wedStart, wedEnd, thuStart, thuEnd,
      friStart, friEnd, satStart, satEnd, sunStart, sunEnd, toleranceMin } = body;

    const data: any = {
      organizationId: orgId, userId,
      monday, tuesday, wednesday, thursday, friday, saturday, sunday,
      monStart, monEnd, tueStart, tueEnd, wedStart, wedEnd, thuStart, thuEnd,
      friStart, friEnd, satStart, satEnd, sunStart, sunEnd,
      toleranceMin: toleranceMin || 10,
      // Keep legacy fields for compatibility
      startTime: monStart || "08:00",
      endTime: monEnd || "17:00",
    };

    const schedule = await prisma.schedule.upsert({
      where: { userId },
      update: data,
      create: data,
    });

    return NextResponse.json({ schedule });
  } catch (e: any) {
    console.error("Schedule error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}