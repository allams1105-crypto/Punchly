import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function logActivity(orgId: string, userId: string, userName: string, action: string, details?: string) {
  await prisma.activityLog.create({
    data: { organizationId: orgId, userId, userName, action, details },
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  // Validamos sesión y datos del usuario
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as any).id;
  const orgId = (session.user as any).organizationId;
  const { action, entryId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { organization: true },
  });

  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  // Nombre de la organización seguro para evitar errores de TS
  const orgName = user.organization?.name || "Punchly";

  if (action === "in") {
    const existing = await prisma.timeEntry.findFirst({
      where: { userId, status: "CLOCKED_IN" },
    });

    if (existing) return NextResponse.json({ error: "Ya tienes una entrada activa" }, { status: 400 });

    const entry = await prisma.timeEntry.create({
      data: { organizationId: orgId, userId, clockIn: new Date(), source: "web" },
    });

    const clockInTime = new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
    const dateStr = new Date().toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" });

    await logActivity(orgId, userId, user.name || "Usuario", "CLOCK_IN", `Entró a las ${clockInTime}`);

    const admins = await prisma.user.findMany({
      where: { organizationId: orgId, role: { in: ["OWNER", "ADMIN"] } },
    });

    // Envío de correos en paralelo para no bloquear la respuesta
    const emailPromises = admins.map(admin => {
      if (!admin.email) return Promise.resolve();
      return resend.emails.send({
        from: "Punchly <onboarding@resend.dev>",
        to: admin.email,
        subject: `${user.name} entró al trabajo`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #111; margin-bottom: 4px;">Punchly</h2>
            <p style="color: #666; font-size: 14px; margin-bottom: 24px;">${orgName}</p>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <p style="margin: 0; font-size: 16px; font-weight: 600; color: #15803d;">Entrada registrada</p>
              <p style="margin: 8px 0 0; color: #166534; font-size: 14px;">${user.name} entró a las ${clockInTime}</p>
            </div>
            <p style="color: #999; font-size: 12px;">${dateStr}</p>
          </div>
        `,
      });
    });

    // No esperamos a los correos para responder al cliente (más rápido)
    Promise.all(emailPromises).catch(err => console.error("Error enviando correos:", err));

    return NextResponse.json({ success: true, entry });
  }

  if (action === "out") {
    if (!entryId) return NextResponse.json({ error: "EntryId requerido" }, { status: 400 });

    const entry = await prisma.timeEntry.findFirst({
      where: { id: entryId, userId, status: "CLOCKED_IN" },
    });

    if (!entry) return NextResponse.json({ error: "Entrada no encontrada" }, { status: 404 });

    const clockOut = new Date();
    const durationMin = Math.floor((clockOut.getTime() - entry.clockIn.getTime()) / 60000);

    const updated = await prisma.timeEntry.update({
      where: { id: entryId },
      data: { clockOut, status: "CLOCKED_OUT", durationMin },
    });

    const hours = Math.floor(durationMin / 60);
    const minutes = durationMin % 60;
    const clockOutTime = clockOut.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });

    await logActivity(orgId, userId, user.name || "Usuario", "CLOCK_OUT", `Salió a las ${clockOutTime} — ${hours}h ${minutes}m`);

    const admins = await prisma.user.findMany({
      where: { organizationId: orgId, role: { in: ["OWNER", "ADMIN"] } },
    });

    const emailPromises = admins.map(admin => {
      if (!admin.email) return Promise.resolve();
      return resend.emails.send({
        from: "Punchly <onboarding@resend.dev>",
        to: admin.email,
        subject: `${user.name} salió del trabajo`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #111; margin-bottom: 4px;">Punchly</h2>
            <p style="color: #666; font-size: 14px; margin-bottom: 24px;">${orgName}</p>
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1d4ed8;">Salida registrada</p>
              <p style="margin: 8px 0 0; color: #1e40af; font-size: 14px;">${user.name} salió a las ${clockOutTime}</p>
              <p style="margin: 4px 0 0; color: #1e40af; font-size: 14px;">Total trabajado: ${hours}h ${minutes}m</p>
            </div>
          </div>
        `,
      });
    });

    Promise.all(emailPromises).catch(err => console.error("Error enviando correos:", err));

    return NextResponse.json({ success: true, entry: updated });
  }

  return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
}