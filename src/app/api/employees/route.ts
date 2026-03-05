import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const role = (session.user as any).role;
  if (role !== "OWNER" && role !== "ADMIN") {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const orgId = (session.user as any).organizationId;
  const { name, email, password, role: employeeRole } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Todos los campos son requeridos" },
      { status: 400 }
    );
  }

  // Verificar si el email ya existe en la organización
  const existing = await prisma.user.findFirst({
    where: { organizationId: orgId, email },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Este email ya está registrado" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      organizationId: orgId,
      name,
      email,
      pin: hashedPassword,
      role: employeeRole || "EMPLOYEE",
      isActive: true,
    },
  });

  return NextResponse.json({ success: true, userId: user.id });
}