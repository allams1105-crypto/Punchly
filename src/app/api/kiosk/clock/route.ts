import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { userId, organizationId, pin } = await req.json(); // Quitamos "action", la API decidirá
  if (!userId || !organizationId) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });

  const user = await prisma.user.findUnique({ 
    where: { id: userId }, 
    include: { schedule: true } 
  });
  
  if (!user) return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });

  // 1. Verificar PIN
  const kioskPin = (user as any).kioskPin;
  if (kioskPin) {
    if (!pin) return NextResponse.json({ error: "PIN requerido" }, { status: 401 });
    const valid = await bcrypt.compare(pin, kioskPin);
    if (!valid) return NextResponse.json({ error: "PIN incorrecto" }, { status: 401 });
  }

  // 2. BUSCAR TURNO ACTIVO
  const existing = await prisma.timeEntry.findFirst({ 
    where: { userId, organizationId, clockOut: null },
    orderBy: { clockIn: "desc" }
  });

  const now = new Date();

  // --- LÓGICA DE SALIDA (Si ya existe un turno abierto) ---
  if (existing) {
    const durationMin = Math.floor((now.getTime() - existing.clockIn.getTime()) / 60000);
    await prisma.timeEntry.update({ 
      where: { id: existing.id }, 
      data: { clockOut: now, durationMin } 
    });

    await prisma.activityLog.create({
      data: { 
        organizationId, 
        userId, 
        userName: user.name, 
        action: "CLOCK_OUT", 
        details: `Salida registrada — ${durationMin} min trabajados` 
      },
    });

    return NextResponse.json({ success: true, action: "out", message: `¡Adiós ${user.name}!` });
  }

  // --- LÓGICA DE ENTRADA (Si NO hay turno abierto) ---
  const entry = await prisma.timeEntry.create({ 
    data: { userId, organizationId, clockIn: now } 
  });

  await prisma.activityLog.create({
    data: { 
      organizationId, 
      userId, 
      userName: user.name, 
      action: "CLOCK_IN", 
      details: "Entrada registrada" 
    },
  });

  // Verificación de tardanza (Tu lógica original intacta)
  const schedule = user.schedule;
  if (schedule) {
    const dayMap: Record<number, keyof typeof schedule> = { 0: "sunday", 1: "monday", 2: "tuesday", 3: "wednesday", 4: "thursday", 5: "friday", 6: "saturday" };
    const dayKey = dayMap[now.getDay()];
    const isWorkDay = schedule[dayKey] as boolean;
    if (isWorkDay) {
      const [startH, startM] = schedule.startTime.split(":").map(Number);
      const scheduledStart = new Date(now); scheduledStart.setHours(startH, startM, 0, 0);
      const lateMin = Math.floor((now.getTime() - scheduledStart.getTime()) / 60000) - schedule.toleranceMin;
      
      if (lateMin > 0) {
        await prisma.activityLog.create({
          data: { 
            organizationId, userId, userName: user.name, action: "LATE",
            details: `Tardanza de ${lateMin} min (Entrada: ${now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })})` 
          },
        });
        
        // Envío de correo... (Tu lógica de Resend se queda igual)
        try {
          const org = await prisma.organization.findUnique({ where: { id: organizationId }, include: { users: { where: { role: "OWNER" } } } });
          const ownerEmail = org?.users?.[0]?.email;
          const recipients = [ownerEmail].filter(Boolean) as string[];
          if (recipients.length > 0) {
            await resend.emails.send({
              from: "Punchly.Clock <onboarding@resend.dev>",
              to: recipients,
              subject: `⚠️ Tardanza — ${user.name}`,
              html: `<b>${user.name}</b> llegó ${lateMin} min tarde.`
            });
          }
        } catch(e) { console.error("Email error:", e); }
      }
    }
  }

  return NextResponse.json({ success: true, action: "in", message: `¡Hola ${user.name}!` });
}