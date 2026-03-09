import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const role = (session.user as any).role;
  if (role !== "OWNER" && role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { action, password, entryId, userId, clockIn, clockOut } = await req.json();

  // Buscar al usuario administrador
  const adminUser = await prisma.user.findUnique({ 
    where: { id: (session.user as any).id } 
  });

  if (!adminUser) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  // Verificación de seguridad usando el campo 'pin' (ya que 'password' no existe en el esquema)
  if (!adminUser.pin) {
    return NextResponse.json({ error: "Administrador sin PIN configurado" }, { status: 400 });
  }

  const validPassword = await bcrypt.compare(password, adminUser.pin);
  if (!validPassword) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const orgId = (session.user as any).organizationId;

  // --- ACCIÓN: CREATE ---
  if (action === "create") {
    const clockInDate = new Date(clockIn);
    const clockOutDate = clockOut ? new Date(clockOut) : null;
    const durationMin = clockOutDate 
      ? Math.round((clockOutDate.getTime() - clockInDate.getTime()) / 60000) 
      : null;

    const entry = await prisma.timeEntry.create({
      data: {
        userId,
        organizationId: orgId,
        clockIn: clockInDate,
        clockOut: clockOutDate,
        durationMin,
        status: clockOutDate ? "CLOCKED_OUT" : "CLOCKED_IN",
      },
    });

    await prisma.activityLog.create({
      data: {
        organizationId: orgId,
        userId,
        action: "ENTRY_EDITED",
        userName: adminUser.name,
        details: `Registro manual creado por admin`,
      },
    });
    return NextResponse.json({ entry });
  }

  // --- ACCIÓN: UPDATE ---
  if (action === "update") {
    const existing = await prisma.timeEntry.findUnique({ where: { id: entryId } });
    if (!existing) return NextResponse.json({ error: "Registro no encontrado" }, { status: 404 });

    const clockInDate = new Date(clockIn);
    const clockOutDate = clockOut ? new Date(clockOut) : null;
    const durationMin = clockOutDate 
      ? Math.round((clockOutDate.getTime() - clockInDate.getTime()) / 60000) 
      : null;

    const entry = await prisma.timeEntry.update({
      where: { id: entryId },
      data: { 
        clockIn: clockInDate, 
        clockOut: clockOutDate, 
        durationMin, 
        status: clockOutDate ? "CLOCKED_OUT" : "CLOCKED_IN" 
      },
    });

    await prisma.activityLog.create({
      data: {
        organizationId: orgId,
        userId: existing.userId,
        action: "ENTRY_EDITED",
        userName: adminUser.name,
        details: `Registro editado por admin`,
      },
    });
    return NextResponse.json({ entry });
  }

  // --- ACCIÓN: DELETE ---
  if (action === "delete") {
    const existing = await prisma.timeEntry.findUnique({ where: { id: entryId } });
    if (!existing) return NextResponse.json({ error: "Registro no encontrado" }, { status: 404 });

    await prisma.timeEntry.delete({ where: { id: entryId } });

    await prisma.activityLog.create({
      data: {
        organizationId: orgId,
        userId: existing.userId,
        action: "ENTRY_EDITED",
        userName: adminUser.name,
        details: `Registro eliminado por admin`,
      },
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
}