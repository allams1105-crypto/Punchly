import { auth } from "@/lib/auth";
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
}