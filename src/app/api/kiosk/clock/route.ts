import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token, userId, action } = await req.json();

  if (!token || !userId || !action) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  // Verificar kiosk válido
  const kiosk = await prisma.kioskSession.findUnique({
    where: { token, isActive: true },
  });

  if (!kiosk) {
    return NextResponse.json({ error: "Kiosk inválido" }, { status: 401 });
  }

  // Verificar que el empleado pertenece a la organización
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      organizationId: kiosk.organizationId,
      isActive: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });
  }

  if (action === "in") {
    const existing = await prisma.timeEntry.findFirst({
      where: { userId, status: "CLOCKED_IN" },
    });

    if (existing) {
      return NextResponse.json({ error: "Ya tiene entrada activa" }, { status: 400 });
    }

    await prisma.timeEntry.create({
      data: {
        organizationId: kiosk.organizationId,
        userId,
        clockIn: new Date(),
        source: "kiosk",
      },
    });

    await prisma.kioskSession.update({
      where: { token },
      data: { lastActivityAt: new Date() },
    });

    return NextResponse.json({ success: true });
  }

  if (action === "out") {
    const entry = await prisma.timeEntry.findFirst({
      where: { userId, status: "CLOCKED_IN" },
    });

    if (!entry) {
      return NextResponse.json({ error: "No hay entrada activa" }, { status: 404 });
    }

    const clockOut = new Date();
    const durationMin = Math.floor(
      (clockOut.getTime() - entry.clockIn.getTime()) / 60000
    );

    await prisma.timeEntry.update({
      where: { id: entry.id },
      data: {
        clockOut,
        status: "CLOCKED_OUT",
        durationMin,
      },
    });

    await prisma.kioskSession.update({
      where: { token },
      data: { lastActivityAt: new Date() },
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
}