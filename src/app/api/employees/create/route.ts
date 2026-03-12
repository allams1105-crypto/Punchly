import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const orgId = (session.user as any).organizationId;
    const { name, email, hourlyRate, kioskPin } = await req.json();
    
    const pin = await bcrypt.hash("0000", 10); // default login pin
    const data: any = { name, email, hourlyRate, organizationId: orgId, pin };
    if (kioskPin && kioskPin.length === 4) {
      data.kioskPin = await bcrypt.hash(kioskPin, 10);
    }

    const user = await prisma.user.create({ data });
    await prisma.activityLog.create({
      data: { organizationId: orgId, userId: user.id, userName: user.name, action: "EMPLOYEE_CREATED", details: "Empleado creado" }
    });
    return NextResponse.json({ user });
  } catch (e: any) {
    if (e.code === "P2002") return NextResponse.json({ error: "Ya existe un empleado con ese email" }, { status: 400 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}