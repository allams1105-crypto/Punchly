import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { userId, organizationId, action } = await req.json();
  if (!userId || !organizationId || !action) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: userId }, include: { schedule: true } });
  if (!user) return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });

  if (action === "in") {
    const existing = await prisma.timeEntry.findFirst({
      where: { userId, organizationId, clockOut: null },
    });
    if (existing) return NextResponse.json({ error: "Ya está en turno" }, { status: 400 });

    const entry = await prisma.timeEntry.create({
      data: { userId, organizationId, clockIn: new Date() },
    });

    await prisma.activityLog.create({
      data: { organizationId, userId, userName: user.name, action: "CLOCK_IN", details: `Entrada registrada` },
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
        const scheduledStart = new Date(now);
        scheduledStart.setHours(startH, startM, 0, 0);
        const lateMin = Math.floor((now.getTime() - scheduledStart.getTime()) / 60000) - schedule.toleranceMin;

        if (lateMin > 0) {
          // Add to notification bell
          await prisma.activityLog.create({
            data: {
              organizationId,
              userId,
              userName: user.name,
              action: "LATE",
              details: `Tardanza de ${lateMin} minutos (entró a las ${now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}, horario ${schedule.startTime})`,
            },
          });

          // Send alert email to owner + alertEmail
          const org = await prisma.organization.findUnique({
            where: { id: organizationId },
            include: { users: { where: { role: "OWNER" } } },
          });

          const ownerEmail = org?.users?.[0]?.email;
          const alertEmail = (org as any)?.alertEmail;
          const recipients = [ownerEmail, alertEmail].filter(Boolean) as string[];

          if (recipients.length > 0) {
            try {
              await resend.emails.send({
                from: "Punchly.Clock <onboarding@resend.dev>",
                to: recipients,
                subject: `⚠️ Tardanza — ${user.name}`,
                html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,sans-serif;background:#f9fafb;padding:40px 20px;margin:0;">
  <div style="max-width:480px;margin:0 auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#000;padding:24px 32px;display:flex;align-items:center;gap:12px;">
      <div style="width:40px;height:40px;background:#E8B84B;border-radius:12px;display:flex;align-items:center;justify-content:center;">
        <span style="color:black;font-weight:900;font-size:18px;line-height:40px;display:block;text-align:center;">P</span>
      </div>
      <span style="color:white;font-weight:900;font-size:16px;">Punchly.Clock</span>
    </div>
    <div style="padding:32px;">
      <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:12px;padding:16px;margin-bottom:24px;">
        <p style="color:#C2410C;font-size:13px;font-weight:700;margin:0 0 4px;">⚠️ Alerta de tardanza</p>
        <p style="color:#EA580C;font-size:12px;margin:0;">${lateMin} minutos de retraso</p>
      </div>
      <h2 style="font-size:18px;font-weight:900;color:#111;margin:0 0 16px;">${user.name} llegó tarde</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;">Empleado</td><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:700;color:#111;text-align:right;">${user.name}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;">Hora de entrada</td><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:700;color:#111;text-align:right;">${now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;">Horario</td><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:700;color:#111;text-align:right;">${schedule.startTime}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Tardanza</td><td style="padding:8px 0;font-size:13px;font-weight:900;color:#EA580C;text-align:right;">+${lateMin} min</td></tr>
      </table>
      <a href="https://punchlyclock.vercel.app/en/admin/attendance"
        style="display:block;background:#E8B84B;color:black;text-align:center;padding:14px;border-radius:14px;font-weight:900;font-size:14px;text-decoration:none;margin-top:24px;">
        Ver reporte de asistencia →
      </a>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="font-size:11px;color:#9ca3af;margin:0;">Punchly.Clock · Alerta automática de asistencia</p>
    </div>
  </div>
</body>
</html>`,
              });
            } catch(e) { console.error("Email error:", e); }
          }
        }
      }
    }

    return NextResponse.json({ success: true, action: "in", entryId: entry.id });

  } else if (action === "out") {
    const entry = await prisma.timeEntry.findFirst({
      where: { userId, organizationId, clockOut: null },
      orderBy: { clockIn: "desc" },
    });
    if (!entry) return NextResponse.json({ error: "No está en turno" }, { status: 400 });

    const now = new Date();
    const durationMin = Math.floor((now.getTime() - entry.clockIn.getTime()) / 60000);

    await prisma.timeEntry.update({
      where: { id: entry.id },
      data: { clockOut: now, durationMin },
    });

    await prisma.activityLog.create({
      data: { organizationId, userId, userName: user.name, action: "CLOCK_OUT", details: `Salida registrada — ${durationMin} minutos trabajados` },
    });

    return NextResponse.json({ success: true, action: "out" });
  }

  return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
}