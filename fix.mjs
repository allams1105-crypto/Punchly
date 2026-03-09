import { writeFileSync, mkdirSync } from "fs";

// ==================== EXPORT PDF API ====================
const exportApi = `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const orgId = (session.user as any).organizationId;
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") || "html";

  const now = new Date();
  const isFirstHalf = now.getUTCDate() <= 15;
  const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const periodStart = isFirstHalf
    ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 16));
  const periodEnd = isFirstHalf
    ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 15, 23, 59, 59))
    : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59));
  const periodDays = isFirstHalf ? 15 : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate() - 15;
  const maxRegularHours = 8 * periodDays;
  const periodLabel = isFirstHalf
    ? \`1 — 15 \${MONTHS[now.getUTCMonth()]} \${now.getUTCFullYear()}\`
    : \`16 — \${new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate()} \${MONTHS[now.getUTCMonth()]} \${now.getUTCFullYear()}\`;

  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  const employees = await prisma.user.findMany({
    where: { organizationId: orgId, isActive: true },
    include: {
      timeEntries: {
        where: { status: "CLOCKED_OUT", clockIn: { gte: periodStart, lte: periodEnd } },
      },
    },
  });

  const payrollData = employees.map((emp) => {
    const totalMinutes = emp.timeEntries.reduce((acc, e) => acc + (e.durationMin || 0), 0);
    const totalHours = totalMinutes / 60;
    const regularHours = Math.min(totalHours, maxRegularHours);
    const overtimeHours = Math.max(0, totalHours - maxRegularHours);
    const totalPay = regularHours * (emp.hourlyRate || 0) + overtimeHours * (emp.overtimeRate || 0);
    return {
      name: emp.name,
      totalHours: Math.round(totalHours * 10) / 10,
      regularHours: Math.round(regularHours * 10) / 10,
      overtimeHours: Math.round(overtimeHours * 10) / 10,
      totalPay: Math.round(totalPay * 100) / 100,
      hourlyRate: emp.hourlyRate || 0,
    };
  });

  const totalPayroll = payrollData.reduce((acc, e) => acc + e.totalPay, 0);

  if (format === "csv") {
    const csv = [
      "Empleado,Horas Totales,Horas Regulares,Horas Extra,Tarifa/h,Total",
      ...payrollData.map(e => \`\${e.name},\${e.totalHours},\${e.regularHours},\${e.overtimeHours},\$\${e.hourlyRate},\$\${e.totalPay}\`),
      \`TOTAL,,,,,$\${totalPayroll.toLocaleString()}\`,
    ].join("\\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": \`attachment; filename="nomina-\${periodLabel.replace(/\\s/g,"-")}.csv"\`,
      },
    });
  }

  const rows = payrollData.map(emp => \`
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">\${emp.name}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center;">\${emp.totalHours}h</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center;">\${emp.regularHours}h</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center;color:\${emp.overtimeHours > 0 ? "#ea580c" : "#6b7280"};">\${emp.overtimeHours}h</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center;">\$\${emp.hourlyRate}/h</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:right;font-weight:700;color:#E8B84B;">\$\${emp.totalPay.toLocaleString()}</td>
    </tr>
  \`).join("");

  const html = \`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nómina \${periodLabel}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, sans-serif; background: #f9fafb; padding: 40px; color: #111; }
    .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { background: #000; padding: 32px; display: flex; justify-content: space-between; align-items: center; }
    .logo { display: flex; align-items: center; gap: 10px; }
    .logo-icon { width: 36px; height: 36px; background: #E8B84B; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px; color: black; }
    .logo-text { color: white; font-weight: 900; font-size: 18px; }
    .period { color: rgba(255,255,255,0.5); font-size: 13px; text-align: right; }
    .period strong { color: #E8B84B; display: block; font-size: 15px; }
    .summary { background: #E8B84B; padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; }
    .summary h2 { font-size: 13px; color: rgba(0,0,0,0.5); margin-bottom: 4px; }
    .summary .amount { font-size: 36px; font-weight: 900; color: black; }
    .summary .meta { font-size: 13px; color: rgba(0,0,0,0.5); }
    .body { padding: 32px; }
    table { width: 100%; border-collapse: collapse; }
    thead th { padding: 8px 12px; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; text-align: left; border-bottom: 2px solid #e5e7eb; }
    thead th:not(:first-child) { text-align: center; }
    thead th:last-child { text-align: right; }
    .footer { padding: 20px 32px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; }
    .footer p { font-size: 11px; color: #9ca3af; }
    .total-row td { padding: 12px; font-weight: 900; font-size: 14px; background: #f9fafb; }
    @media print { body { padding: 0; background: white; } .container { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <div class="logo-icon">P</div>
        <span class="logo-text">Punchly.Clock</span>
      </div>
      <div class="period">
        <span>Período</span>
        <strong>\${periodLabel}</strong>
      </div>
    </div>
    <div class="summary">
      <div>
        <h2>Nómina total estimada</h2>
        <div class="amount">\$\${totalPayroll.toLocaleString()}</div>
        <div class="meta">\${org?.name} · \${employees.length} empleados</div>
      </div>
      <div style="text-align:right;">
        <div class="meta">Generado el</div>
        <strong style="font-size:14px;">\${now.toLocaleDateString("es",{day:"numeric",month:"long",year:"numeric"})}</strong>
      </div>
    </div>
    <div class="body">
      <table>
        <thead>
          <tr>
            <th>Empleado</th>
            <th>Horas totales</th>
            <th>Regulares</th>
            <th>Extra</th>
            <th>Tarifa</th>
            <th style="text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>
          \${rows}
          <tr class="total-row">
            <td colspan="5">Total nómina</td>
            <td style="text-align:right;color:#E8B84B;">\$\${totalPayroll.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="footer">
      <p>Punchly.Clock · Reporte automático</p>
      <p>\${periodLabel}</p>
    </div>
  </div>
  <script>window.onload = () => window.print();</script>
</body>
</html>\`;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}`;

// ==================== SETTINGS PAGE ====================
const settingsPage = `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/admin/SettingsClient";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/en/login");

  const orgId = (session.user as any).organizationId;
  const userId = (session.user as any).id;
  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  const user = await prisma.user.findUnique({ where: { id: userId } });

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center bg-[var(--bg-primary)]">
        <div>
          <h1 className="text-sm font-black text-[var(--text-primary)]">Settings</h1>
          <p className="text-xs text-[var(--text-muted)]">Configura tu empresa y cuenta</p>
        </div>
      </div>
      <div className="p-6 max-w-2xl space-y-4">
        <SettingsClient
          orgId={orgId}
          orgName={org?.name || ""}
          userName={user?.name || ""}
          userEmail={user?.email || ""}
          isPro={!!(org as any)?.isPro}
        />
      </div>
    </div>
  );
}`;

// ==================== SETTINGS CLIENT ====================
const settingsClient = `"use client";
import { useState } from "react";
import UpgradeButton from "./UpgradeButton";

export default function SettingsClient({ orgId, orgName, userName, userEmail, isPro }: {
  orgId: string; orgName: string; userName: string; userEmail: string; isPro: boolean;
}) {
  const [org, setOrg] = useState(orgName);
  const [name, setName] = useState(userName);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [savingOrg, setSavingOrg] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [msgOrg, setMsgOrg] = useState("");
  const [msgPass, setMsgPass] = useState("");

  async function saveOrg() {
    setSavingOrg(true); setMsgOrg("");
    const res = await fetch("/api/settings/org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: org }),
    });
    setMsgOrg(res.ok ? "✓ Guardado" : "Error al guardar");
    setSavingOrg(false);
    setTimeout(() => setMsgOrg(""), 3000);
  }

  async function savePassword() {
    if (!currentPass || !newPass) { setMsgPass("Completa ambos campos"); return; }
    setSavingPass(true); setMsgPass("");
    const res = await fetch("/api/settings/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass }),
    });
    const data = await res.json();
    setMsgPass(res.ok ? "✓ Contraseña actualizada" : data.error || "Error");
    setSavingPass(false);
    if (res.ok) { setCurrentPass(""); setNewPass(""); }
    setTimeout(() => setMsgPass(""), 3000);
  }

  return (
    <>
      {/* Org settings */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">Empresa</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Información de tu organización</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Nombre de la empresa</label>
            <input value={org} onChange={e => setOrg(e.target.value)}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Tu nombre</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" />
          </div>
          <div className="flex items-center justify-between">
            <button onClick={saveOrg} disabled={savingOrg}
              className="bg-[#E8B84B] text-black px-5 py-2.5 rounded-xl text-sm font-black hover:bg-[#d4a43a] transition disabled:opacity-50">
              {savingOrg ? "Guardando..." : "Guardar cambios"}
            </button>
            {msgOrg && <p className={\`text-xs \${msgOrg.startsWith("✓") ? "text-green-400" : "text-red-400"}\`}>{msgOrg}</p>}
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">Seguridad</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Cambia tu contraseña</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Contraseña actual</label>
            <input type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition"
              placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Nueva contraseña</label>
            <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition"
              placeholder="••••••••" />
          </div>
          <div className="flex items-center justify-between">
            <button onClick={savePassword} disabled={savingPass}
              className="bg-[#E8B84B] text-black px-5 py-2.5 rounded-xl text-sm font-black hover:bg-[#d4a43a] transition disabled:opacity-50">
              {savingPass ? "Guardando..." : "Cambiar contraseña"}
            </button>
            {msgPass && <p className={\`text-xs \${msgPass.startsWith("✓") ? "text-green-400" : "text-red-400"}\`}>{msgPass}</p>}
          </div>
        </div>
      </div>

      {/* Plan */}
      <div className={\`border rounded-2xl overflow-hidden \${isPro ? "bg-[#E8B84B]/5 border-[#E8B84B]/20" : "bg-[var(--bg-card)] border-[var(--border)]"}\`}>
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Plan actual</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{isPro ? "Licencia activa de por vida" : "Período de prueba"}</p>
            </div>
            <span className={\`text-xs font-black px-3 py-1.5 rounded-xl \${isPro ? "bg-[#E8B84B] text-black" : "bg-[var(--border)] text-[var(--text-muted)]"}\`}>
              {isPro ? "PRO" : "TRIAL"}
            </span>
          </div>
        </div>
        <div className="p-6">
          {isPro ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E8B84B]/15 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Licencia activa</p>
                <p className="text-xs text-[var(--text-muted)]">Acceso de por vida · Sin mensualidades</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-[var(--text-muted)]">Activa tu licencia por <span className="text-[#E8B84B] font-black">$49</span> pago único y accede de por vida.</p>
              <UpgradeButton variant="full" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}`;

// ==================== SETTINGS APIs ====================
const settingsOrgApi = `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const orgId = (session.user as any).organizationId;
  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  await prisma.organization.update({ where: { id: orgId }, data: { name } });
  return NextResponse.json({ ok: true });
}`;

const settingsPassApi = `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const userId = (session.user as any).id;
  const { currentPassword, newPassword } = await req.json();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.pin) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  const valid = await bcrypt.compare(currentPassword, user.pin);
  if (!valid) return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 401 });
  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { pin: hash } });
  return NextResponse.json({ ok: true });
}`;

// ==================== UPDATED PAYROLL PAGE WITH EXPORT ====================
const payrollExportBtn = `"use client";
export default function ExportButtons() {
  return (
    <div className="flex items-center gap-2">
      <a href="/api/payroll/export?format=csv" download
        className="flex items-center gap-1.5 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-3 py-2 rounded-lg text-xs font-semibold transition">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        CSV
      </a>
      <a href="/api/payroll/export?format=html" target="_blank"
        className="flex items-center gap-1.5 bg-[#E8B84B] text-black px-3 py-2 rounded-lg text-xs font-black hover:bg-[#d4a43a] transition">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        Imprimir PDF
      </a>
    </div>
  );
}`;

mkdirSync("src/app/api/payroll", { recursive: true });
mkdirSync("src/app/api/payroll/export", { recursive: true });
mkdirSync("src/app/api/settings/org", { recursive: true });
mkdirSync("src/app/api/settings/password", { recursive: true });

writeFileSync("src/app/api/payroll/export/route.ts", exportApi);
writeFileSync("src/app/[locale]/admin/settings/page.tsx", settingsPage);
writeFileSync("src/components/admin/SettingsClient.tsx", settingsClient);
writeFileSync("src/components/admin/ExportButtons.tsx", payrollExportBtn);
writeFileSync("src/app/api/settings/org/route.ts", settingsOrgApi);
writeFileSync("src/app/api/settings/password/route.ts", settingsPassApi);
console.log("Listo!");

