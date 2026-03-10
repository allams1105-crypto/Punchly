import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { userId, organizationId, action, pin } = await req.json();
  if (!userId || !organizationId || !action) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: userId }, include: { schedule: true } });
  if (!user) return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });

  // Verify PIN
  const kioskPin = (user as any).kioskPin;
  if (kioskPin) {
    if (!pin) return NextResponse.json({ error: "PIN requerido" }, { status: 401 });
    const valid = await bcrypt.compare(pin, kioskPin);
    if (!valid) return NextResponse.json({ error: "PIN incorrecto" }, { status: 401 });
  }

  if (action === "in") {
    const existing = await prisma.timeEntry.findFirst({ where: { userId, organizationId, clockOut: null } });
    if (existing) return NextResponse.json({ error: "Ya está en turno" }, { status: 400 });

    const entry = await prisma.timeEntry.create({ data: { userId, organizationId, clockIn: new Date() } });

    await prisma.activityLog.create({
      data: { organizationId, userId, userName: user.name, action: "CLOCK_IN", details: "Entrada registrada" },
    });

    // Check if late
    const schedule = user.schedule;
    if (schedule) {
      const now = new Date();
      const dayMap: Record<number, keyof typeof schedule> = { 0: "sunday", 1: "monday", 2: "tuesday", 3: "wednesday", 4: "thursday", 5: "friday", 6: "saturday" };
      const dayKey = dayMap[now.getDay()];
      const isWorkDay = schedule[dayKey] as boolean;
      if (isWorkDay) {
        const [startH, startM] = schedule.startTime.split(":").map(Number);
        const scheduledStart = new Date(now); scheduledStart.setHours(startH, startM, 0, 0);
        const lateMin = Math.floor((now.getTime() - scheduledStart.getTime()) / 60000) - schedule.toleranceMin;
        if (lateMin > 0) {
          await prisma.activityLog.create({
            data: { organizationId, userId, userName: user.name, action: "LATE",
              details: `Tardanza de ${lateMin} minutos (entró a las ${now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}, horario ${schedule.startTime})` },
          });
          const org = await prisma.organization.findUnique({ where: { id: organizationId }, include: { users: { where: { role: "OWNER" } } } });
          const ownerEmail = org?.users?.[0]?.email;
          const alertEmail = (org as any)?.alertEmail;
          const recipients = [ownerEmail, alertEmail].filter(Boolean) as string[];
          if (recipients.length > 0) {
            try {
              await resend.emails.send({
                from: "Punchly.Clock <onboarding@resend.dev>",
                to: recipients,
                subject: `⚠️ Tardanza — ${user.name}`,
                html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
                  <h2>⚠️ Tardanza detectada</h2>
                  <p><strong>${user.name}</strong> llegó <strong>${lateMin} minutos tarde</strong>.</p>
                  <p>Hora de entrada: ${now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })} · Horario: ${schedule.startTime}</p>
                  <a href="https://punchlyclock.vercel.app/en/admin/attendance" style="display:inline-block;background:#E8B84B;color:black;padding:12px 24px;border-radius:12px;font-weight:900;text-decoration:none;margin-top:16px;">Ver asistencia →</a>
                </div>`,
              });
            } catch(e) { console.error(e); }
          }
        }
      }
    }
    return NextResponse.json({ success: true, action: "in", entryId: entry.id });

  } else if (action === "out") {
    const entry = await prisma.timeEntry.findFirst({ where: { userId, organizationId, clockOut: null }, orderBy: { clockIn: "desc" } });
    if (!entry) return NextResponse.json({ error: "No está en turno" }, { status: 400 });
    const now = new Date();
    const durationMin = Math.floor((now.getTime() - entry.clockIn.getTime()) / 60000);
    await prisma.timeEntry.update({ where: { id: entry.id }, data: { clockOut: now, durationMin } });
    await prisma.activityLog.create({
      data: { organizationId, userId, userName: user.name, action: "CLOCK_OUT", details: `Salida registrada — ${durationMin} minutos trabajados` },
    });
    return NextResponse.json({ success: true, action: "out" });
  }

  return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
}