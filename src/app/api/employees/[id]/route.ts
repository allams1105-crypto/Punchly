import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest, { params }: { params: any }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const orgId = (session.user as any).organizationId;
  const { id } = params;
  const body = await req.json();
  const { name, email, hourlyRate, isActive, kioskPin } = body;

  const updateData: any = { name, email, hourlyRate, isActive };
  if (kioskPin && kioskPin.length === 4) {
    updateData.kioskPin = await bcrypt.hash(kioskPin, 10);
  }

  const user = await prisma.user.update({
    where: { id, organizationId: orgId },
    data: updateData,
  });

  return NextResponse.json({ user });
}

export async function DELETE(req: NextRequest, { params }: { params: any }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const orgId = (session.user as any).organizationId;
  const { id } = params;

  await prisma.timeEntry.deleteMany({ where: { userId: id, organizationId: orgId } });
  await prisma.activityLog.deleteMany({ where: { userId: id, organizationId: orgId } });
  await prisma.schedule.deleteMany({ where: { userId: id, organizationId: orgId } });
  await prisma.user.delete({ where: { id, organizationId: orgId } });

  return NextResponse.json({ success: true });
}