import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// --- MANEJAR OBTENCIÓN DE EMPLEADOS (Soluciona el Error 405 GET) ---
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const orgId = (session.user as any).organizationId;

  try {
    const employees = await prisma.user.findMany({
      where: { 
        organizationId: orgId,
        role: { not: "OWNER" } // Excluimos al dueño de la lista de empleados si prefieres
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener empleados" }, { status: 500 });
  }
}

// --- MANEJAR CREACIÓN (Tu código original con mejoras de seguridad) ---
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
  const { name, email, password, role: employeeRole, hourlyRate, overtimeRate } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({
    where: { organizationId: orgId, email },
  });

  if (existing) {
    return NextResponse.json({ error: "Este email ya esta registrado" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        organizationId: orgId,
        name,
        email,
        pin: hashedPassword, // Usamos pin para guardar la contraseña hasheada según tu schema
        role: employeeRole || "EMPLOYEE",
        isActive: true,
        hourlyRate: hourlyRate || null,
        overtimeRate: overtimeRate || null,
      },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear el usuario" }, { status: 500 });
  }
}