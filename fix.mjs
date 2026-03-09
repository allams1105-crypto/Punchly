import { writeFileSync, mkdirSync } from "fs";
import { readFileSync } from "fs";

// ==================== UPDATE KIOSK CLOCK API — detect late + notify ====================
const kioskClock = `import { prisma } from "@/lib/db";
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
      data: { organizationId, userId, userName: user.name, action: "CLOCK_IN", details: \`Entrada registrada\` },
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
              details: \`Tardanza de \${lateMin} minutos (entró a las \${now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}, horario \${schedule.startTime})\`,
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
                subject: \`⚠️ Tardanza — \${user.name}\`,
                html: \`<!DOCTYPE html>
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
        <p style="color:#EA580C;font-size:12px;margin:0;">\${lateMin} minutos de retraso</p>
      </div>
      <h2 style="font-size:18px;font-weight:900;color:#111;margin:0 0 16px;">\${user.name} llegó tarde</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;">Empleado</td><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:700;color:#111;text-align:right;">\${user.name}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;">Hora de entrada</td><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:700;color:#111;text-align:right;">\${now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;">Horario</td><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:700;color:#111;text-align:right;">\${schedule.startTime}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Tardanza</td><td style="padding:8px 0;font-size:13px;font-weight:900;color:#EA580C;text-align:right;">+\${lateMin} min</td></tr>
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
</html>\`,
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
      data: { organizationId, userId, userName: user.name, action: "CLOCK_OUT", details: \`Salida registrada — \${durationMin} minutos trabajados\` },
    });

    return NextResponse.json({ success: true, action: "out" });
  }

  return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
}`;

// ==================== CRON: detect absences every morning ====================
const absenceCron = `import { prisma } from "@/lib/db";
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
          details: \`Ausencia detectada — no fichó hoy (\${now.toLocaleDateString("es")})\`,
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
            subject: \`🔴 Ausencia — \${schedule.user.name}\`,
            html: \`<div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
              <h2 style="color:#111;">🔴 Ausencia detectada</h2>
              <p style="color:#6b7280;"><strong style="color:#111;">\${schedule.user.name}</strong> no fichó hoy (\${now.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}).</p>
              <a href="https://punchlyclock.vercel.app/en/admin/attendance" style="display:inline-block;background:#E8B84B;color:black;padding:12px 24px;border-radius:12px;font-weight:900;text-decoration:none;margin-top:16px;">Ver asistencia →</a>
            </div>\`,
          });
        } catch(e) { console.error("Email error:", e); }
      }
      absenceCount++;
    }
  }

  return NextResponse.json({ success: true, absencesDetected: absenceCount });
}`;

// ==================== UPDATE SETTINGS to include alertEmail ====================
const settingsClient = `"use client";
import { useState } from "react";
import UpgradeButton from "./UpgradeButton";

export default function SettingsClient({ org, isPro, daysLeft }: { org: any; isPro: boolean; daysLeft: number }) {
  const [orgName, setOrgName] = useState(org.name);
  const [alertEmail, setAlertEmail] = useState(org.alertEmail || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msgOrg, setMsgOrg] = useState("");
  const [msgAlert, setMsgAlert] = useState("");
  const [msgPwd, setMsgPwd] = useState("");

  async function saveOrg() {
    const res = await fetch("/api/settings/org", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: orgName }),
    });
    setMsgOrg(res.ok ? "✓ Guardado" : "Error");
    setTimeout(() => setMsgOrg(""), 3000);
  }

  async function saveAlertEmail() {
    const res = await fetch("/api/settings/alert-email", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alertEmail }),
    });
    setMsgAlert(res.ok ? "✓ Guardado" : "Error");
    setTimeout(() => setMsgAlert(""), 3000);
  }

  async function savePassword() {
    const res = await fetch("/api/settings/password", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    const d = await res.json();
    setMsgPwd(res.ok ? "✓ Contraseña actualizada" : d.error || "Error");
    setTimeout(() => setMsgPwd(""), 3000);
    if (res.ok) { setOldPassword(""); setNewPassword(""); }
  }

  return (
    <div className="p-6 space-y-4 max-w-xl">

      {/* Org name */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[var(--border)]">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Empresa</h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Nombre de la empresa</label>
            <input value={orgName} onChange={e => setOrgName(e.target.value)}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" />
          </div>
          <div className="flex items-center justify-between">
            {msgOrg && <p className={\`text-xs \${msgOrg.startsWith("✓") ? "text-green-400" : "text-red-400"}\`}>{msgOrg}</p>}
            <button onClick={saveOrg} className="ml-auto bg-[#E8B84B] text-black px-4 py-2 rounded-xl text-xs font-black hover:bg-[#d4a43a] transition">Guardar</button>
          </div>
        </div>
      </div>

      {/* Alert email */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[var(--border)]">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Email de alertas</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Recibe notificaciones de tardanzas y ausencias aquí</p>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Email adicional (opcional)</label>
            <input type="email" value={alertEmail} onChange={e => setAlertEmail(e.target.value)}
              placeholder="supervisor@empresa.com"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" />
            <p className="text-xs text-[var(--text-muted)] mt-1.5">Las alertas siempre llegan al email del owner. Agrega uno extra aquí.</p>
          </div>
          <div className="flex items-center justify-between">
            {msgAlert && <p className={\`text-xs \${msgAlert.startsWith("✓") ? "text-green-400" : "text-red-400"}\`}>{msgAlert}</p>}
            <button onClick={saveAlertEmail} className="ml-auto bg-[#E8B84B] text-black px-4 py-2 rounded-xl text-xs font-black hover:bg-[#d4a43a] transition">Guardar</button>
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[var(--border)]">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Contraseña</h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Contraseña actual</label>
            <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Nueva contraseña</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" />
          </div>
          <div className="flex items-center justify-between">
            {msgPwd && <p className={\`text-xs \${msgPwd.startsWith("✓") ? "text-green-400" : "text-red-400"}\`}>{msgPwd}</p>}
            <button onClick={savePassword} className="ml-auto bg-[#E8B84B] text-black px-4 py-2 rounded-xl text-xs font-black hover:bg-[#d4a43a] transition">Cambiar</button>
          </div>
        </div>
      </div>

      {/* Plan */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[var(--border)]">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Plan</h3>
        </div>
        <div className="p-5">
          {isPro ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#E8B84B]/10 border border-[#E8B84B]/30 rounded-lg flex items-center justify-center">
                <span className="text-[#E8B84B] text-sm">✓</span>
              </div>
              <div>
                <p className="text-sm font-black text-[var(--text-primary)]">Licencia activa</p>
                <p className="text-xs text-[var(--text-muted)]">Acceso completo de por vida</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Período de prueba</p>
                  <p className="text-xs text-[var(--text-muted)]">{daysLeft} días restantes</p>
                </div>
                <UpgradeButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}`;

// ==================== API: save alert email ====================
const alertEmailApi = `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const orgId = (session.user as any).organizationId;
  const { alertEmail } = await req.json();
  await prisma.organization.update({ where: { id: orgId }, data: { alertEmail } });
  return NextResponse.json({ success: true });
}`;

// ==================== UPDATE vercel.json with absence cron ====================
const vercelJson = {
  crons: [
    { path: "/api/cron/payroll-report", schedule: "0 8 15 * *" },
    { path: "/api/cron/payroll-report", schedule: "0 8 1 * *" },
    { path: "/api/cron/absences", schedule: "0 10 * * 1-6" },
  ]
};

mkdirSync("src/app/api/cron/absences", { recursive: true });
mkdirSync("src/app/api/settings/alert-email", { recursive: true });

writeFileSync("src/app/api/kiosk/clock/route.ts", kioskClock);
writeFileSync("src/app/api/cron/absences/route.ts", absenceCron);
writeFileSync("src/app/api/settings/alert-email/route.ts", alertEmailApi);
writeFileSync("src/components/admin/SettingsClient.tsx", settingsClient);
writeFileSync("vercel.json", JSON.stringify(vercelJson, null, 2));
console.log("Listo!");

