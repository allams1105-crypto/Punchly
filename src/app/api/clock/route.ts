import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const orgId = (session.user as any).organizationId;
  const { action, entryId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { organization: true },
  });

  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  if (action === "in") {
    const existing = await prisma.timeEntry.findFirst({
      where: { userId, status: "CLOCKED_IN" },
    });

    if (existing) {
      return NextResponse.json({ error: "Ya tienes una entrada activa" }, { status: 400 });
    }

    const entry = await prisma.timeEntry.create({
      data: {
        organizationId: orgId,
        userId,
        clockIn: new Date(),
        source: "web",
      },
    });

    // Email al admin
    const admins = await prisma.user.findMany({
      where: { organizationId: orgId, role: { in: ["OWNER", "ADMIN"] } },
    });

    const clockInTime = new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
    const date = new Date().toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" });

    for (const admin of admins) {
      if (admin.email) {
        await resend.emails.send({
          from: "Punchly <onboarding@resend.dev>",
          to: admin.email,
          subject: `${user.name} entro al trabajo`,
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
              <h2 style="color: #111; margin-bottom: 4px;">Punchly</h2>
              <p style="color: #666; font-size: 14px; margin-bottom: 24px;">${user.organization.name}</p>
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 16px; font-weight: 600; color: #15803d;">Entrada registrada</p>
                <p style="margin: 8px 0 0; color: #166534; font-size: 14px;">${user.name} entro a las ${clockInTime}</p>
              </div>
              <p style="color: #999; font-size: 12px;">${date}</p>
            </div>
          `,
        });
      }
    }

    return NextResponse.json({ success: true, entry });
  }

  if (action === "out") {
    if (!entryId) {
      return NextResponse.json({ error: "EntryId requerido" }, { status: 400 });
    }

    const entry = await prisma.timeEntry.findFirst({
      where: { id: entryId, userId, status: "CLOCKED_IN" },
    });

    if (!entry) {
      return NextResponse.json({ error: "Entrada no encontrada" }, { status: 404 });
    }

    const clockOut = new Date();
    const durationMin = Math.floor((clockOut.getTime() - entry.clockIn.getTime()) / 60000);

    const updated = await prisma.timeEntry.update({
      where: { id: entryId },
      data: { clockOut, status: "CLOCKED_OUT", durationMin },
    });

    // Email al admin
    const admins = await prisma.user.findMany({
      where: { organizationId: orgId, role: { in: ["OWNER", "ADMIN"] } },
    });

    const clockOutTime = clockOut.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
    const date = clockOut.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" });
    const hours = Math.floor(durationMin / 60);
    const minutes = durationMin % 60;

    for (const admin of admins) {
      if (admin.email) {
        await resend.emails.send({
          from: "Punchly <onboarding@resend.dev>",
          to: admin.email,
          subject: `${user.name} salio del trabajo`,
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
              <h2 style="color: #111; margin-bottom: 4px;">Punchly</h2>
              <p style="color: #666; font-size: 14px; margin-bottom: 24px;">${user.organization.name}</p>
              <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1d4ed8;">Salida registrada</p>
                <p style="margin: 8px 0 0; color: #1e40af; font-size: 14px;">${user.name} salio a las ${clockOutTime}</p>
                <p style="margin: 4px 0 0; color: #1e40af; font-size: 14px;">Total trabajado: ${hours}h ${minutes}m</p>
              </div>
              <p style="color: #999; font-size: 12px;">${date}</p>
            </div>
          `,
        });
      }
    }

    return NextResponse.json({ success: true, entry: updated });
  }

  return NextResponse.json({ error: "Accion invalida" }, { status: 400 });
}
