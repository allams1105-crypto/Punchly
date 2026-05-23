import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const adminRole = (session.user as any).role;
  if (adminRole !== "OWNER" && adminRole !== "ADMIN") {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const orgId = (session.user as any).organizationId;
  const adminId = (session.user as any).id;

  const body = await req.json();
  const { userId, period, totalHours, totalPay, password } = body;

  if (!userId || !period || !password) {
    return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
  }

  const adminUser = await prisma.user.findUnique({ where: { id: adminId } });
  if (!adminUser || !adminUser.pin) {
    return NextResponse.json({ error: "El administrador no tiene contraseña configurada" }, { status: 400 });
  }

  const isValid = await bcrypt.compare(password, adminUser.pin);
  if (!isValid) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const override = await prisma.payrollOverride.upsert({
    where: {
      userId_period: {
        userId: userId,
        period: period
      }
    },
    update: {
      totalHours: totalHours !== null && totalHours !== "" ? parseFloat(totalHours) : null,
      totalPay: totalPay !== null && totalPay !== "" ? parseFloat(totalPay) : null,
    },
    create: {
      organizationId: orgId,
      userId: userId,
      period: period,
      totalHours: totalHours !== null && totalHours !== "" ? parseFloat(totalHours) : null,
      totalPay: totalPay !== null && totalPay !== "" ? parseFloat(totalPay) : null,
    }
  });

  return NextResponse.json({ success: true, override });
}
