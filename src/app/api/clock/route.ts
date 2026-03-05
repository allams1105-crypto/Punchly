import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const orgId = (session.user as any).organizationId;
  const { action, entryId } = await req.json();

  if (action === "in") {
    // Verificar que no esté ya clocked in
    const existing = await prisma.timeEntry.findFirst({
      where: { userId, status: "CLOCKED_IN" },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ya tienes una entrada activa" },
        { status: 400 }
      );
    }

    const entry = await prisma.timeEntry.create({
      data: {
        organizationId: orgId,
        userId,
        clockIn: new Date(),
        source: "web",
      },
    });

    return NextResponse.json({ success: true, entry });
  }

  if (action === "out") {
    if (!entryId) {
      return NextResponse.json(
        { error: "EntryId requerido" },
        { status: 400 }
      );
    }

    const entry = await prisma.timeEntry.findFirst({
      where: { id: entryId, userId, status: "CLOCKED_IN" },
    });

    if (!entry) {
      return NextResponse.json(
        { error: "Entrada no encontrada" },
        { status: 404 }
      );
    }

    const clockOut = new Date();
    const durationMin = Math.floor(
      (clockOut.getTime() - entry.clockIn.getTime()) / 60000
    );

    const updated = await prisma.timeEntry.update({
      where: { id: entryId },
      data: {
        clockOut,
        status: "CLOCKED_OUT",
        durationMin,
      },
    });

    return NextResponse.json({ success: true, entry: updated });
  }

  return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
}