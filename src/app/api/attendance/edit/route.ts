import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const role = (session.user as any).role;
  if (role !== "OWNER" && role !== "ADMIN") return NextResponse.json({ error: "Sin permisos" }, { status: 403 });

  const orgId = (session.user as any).organizationId;
  const adminId = (session.user as any).id;

  try {
    const { timeEntryId, newClockIn, newClockOut, adminPassword } = await req.json();

    if (!timeEntryId || !newClockIn || !adminPassword) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    // Verificar contraseña del admin (usamos el PIN de admin, o la contraseña real si usamos credenciales)
    // En el proyecto actual el admin usa su PIN de kiosko o tenemos su password?
    // En payroll override validamos contra el campo `kioskPin` si es un pin, o `password` si es un auth normal.
    // Wait, let's look at what payroll override uses.
    
    // First, let's fetch the admin user
    const adminUser = await prisma.user.findUnique({
      where: { id: adminId }
    });

    if (!adminUser || !adminUser.kioskPin) {
      return NextResponse.json({ error: "Administrador no tiene PIN configurado" }, { status: 400 });
    }

    const isValidPassword = await bcrypt.compare(adminPassword, adminUser.kioskPin);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }

    const entry = await prisma.timeEntry.findUnique({
      where: { id: timeEntryId }
    });

    if (!entry || entry.organizationId !== orgId) {
      return NextResponse.json({ error: "Registro no encontrado" }, { status: 404 });
    }

    const clockInDate = new Date(newClockIn);
    let clockOutDate = newClockOut ? new Date(newClockOut) : null;
    let durationMin = null;

    if (clockOutDate) {
      if (clockOutDate < clockInDate) {
         return NextResponse.json({ error: "La salida no puede ser antes de la entrada" }, { status: 400 });
      }
      durationMin = Math.floor((clockOutDate.getTime() - clockInDate.getTime()) / 60000);
    }

    await prisma.timeEntry.update({
      where: { id: timeEntryId },
      data: {
        clockIn: clockInDate,
        clockOut: clockOutDate,
        durationMin: durationMin
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Attendance Edit Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
