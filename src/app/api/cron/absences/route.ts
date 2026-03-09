import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret") || new URL(req.url).searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const dayMap: Record<number, string> = { 0: "sunday", 1: "monday", 2: "tuesday", 3: "wednesday", 4: "thursday", 5: "friday", 6: "saturday" };
  const todayKey = dayMap[now.getDay()];

  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);

  const schedules = await prisma.schedule.findMany({
    include: {
      user: true,
      organization: { include: { users: { where: { role: "OWNER" } } } },
    },
  });

  let absenceCount = 0;

  for (const schedule of schedules) {
    const isWorkDay = (schedule as any)[todayKey] as boolean;
    if (!isWorkDay) continue;

    const entry = await prisma.timeEntry.findFirst({
      where: { userId: schedule.userId, organizationId: schedule.organizationId, clockIn: { gte: todayStart, lte: todayEnd } },
    });

    if (!entry) {
      await prisma.activityLog.create({
        data: {
          organizationId: schedule.organizationId,
          userId: schedule.userId,
          userName: schedule.user.name,
          action: "ABSENCE",
          details: `Ausencia detectada — no fichó hoy (${now.toLocaleDateString("es")})`,
        },
      });

      const org = schedule.organization;
      const ownerEmail = org.users?.[0]?.email;
      const alertEmail = (org as any)?.alertEmail;
      const recipients = [ownerEmail, alertEmail].filter(Boolean) as string[];

      if (recipients.length > 0) {
        try {
          await resend.emails.send({
            from: "Punchly.Clock <onboarding@resend.dev>",
            to: recipients,
            subject: `🔴 Ausencia — ${schedule.user.name}`,
            html: `<div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
              <h2 style="color:#111;">🔴 Ausencia detectada</h2>
              <p style="color:#6b7280;"><strong style="color:#111;">${schedule.user.name}</strong> no fichó hoy (${now.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}).</p>
              <a href="https://punchlyclock.vercel.app/en/admin/attendance" style="display:inline-block;background:#E8B84B;color:black;padding:12px 24px;border-radius:12px;font-weight:900;text-decoration:none;margin-top:16px;">Ver asistencia →</a>
            </div>`,
          });
        } catch(e) { console.error("Email error:", e); }
      }
      absenceCount++;
    }
  }

  return NextResponse.json({ success: true, absencesDetected: absenceCount });
}