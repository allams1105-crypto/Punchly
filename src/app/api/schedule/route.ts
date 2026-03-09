import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId requerido" }, { status: 400 });
  const schedule = await prisma.schedule.findUnique({ where: { userId } });
  return NextResponse.json({ schedule });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const orgId = (session.user as any).organizationId;
  const body = await req.json();
  const { userId, monday, tuesday, wednesday, thursday, friday, saturday, sunday, startTime, endTime, toleranceMin } = body;

  const schedule = await prisma.schedule.upsert({
    where: { userId },
    create: { userId, organizationId: orgId, monday, tuesday, wednesday, thursday, friday, saturday, sunday, startTime, endTime, toleranceMin },
    update: { monday, tuesday, wednesday, thursday, friday, saturday, sunday, startTime, endTime, toleranceMin },
  });

  return NextResponse.json({ schedule });
}