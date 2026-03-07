import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { company, name, email, password } = await req.json();

  if (!company || !name || !email || !password) {
    return NextResponse.json(
      { error: "Todos los campos son requeridos" },
      { status: 400 }
    );
  }

  // Verificar si el email ya existe
  const existing = await prisma.user.findFirst({
    where: { email },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Este email ya está registrado" },
      { status: 400 }
    );
  }

  // Crear slug de la organización
  const slug = company
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    + "-" + Date.now();

  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear organización y usuario en una transacción
  const org = await prisma.organization.create({
    data: {
      name: company,
      slug,
      users: {
        create: {
          name,
          email,
          pin: hashedPassword,
          role: "OWNER",
          isActive: true,
        },
      },
    },
  });

  return NextResponse.json({ success: true, organizationId: org.id });
}