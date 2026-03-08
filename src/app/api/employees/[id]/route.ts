import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const role = (session.user as any).role;
  if (role !== "OWNER" && role !== "ADMIN") return NextResponse.json({ error: "Sin permisos" }, { status: 403 });

  const orgId = (session.user as any).organizationId;

  const user = await prisma.user.findFirst({
    where: { id: params.id, organizationId: orgId },
    select: { id: true, name: true, email: true, role: true, hourlyRate: true, overtimeRate: true },
  });

  if (!user) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const role = (session.user as any).role;
  if (role !== "OWNER" && role !== "ADMIN") return NextResponse.json({ error: "Sin permisos" }, { status: 403 });

  const orgId = (session.user as any).organizationId;
  const { name, email, password, role: newRole, hourlyRate, overtimeRate } = await req.json();

  const updateData: any = { name, email, role: newRole, hourlyRate, overtimeRate };
  if (password) updateData.pin = await bcrypt.hash(password, 10);

  const user = await prisma.user.updateMany({
    where: { id: params.id, organizationId: orgId },
    data: updateData,
  });

  return NextResponse.json({ success: true });
}