"use client";
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
            {msgOrg && <p className={`text-xs ${msgOrg.startsWith("✓") ? "text-green-400" : "text-red-400"}`}>{msgOrg}</p>}
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
            {msgAlert && <p className={`text-xs ${msgAlert.startsWith("✓") ? "text-green-400" : "text-red-400"}`}>{msgAlert}</p>}
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
            {msgPwd && <p className={`text-xs ${msgPwd.startsWith("✓") ? "text-green-400" : "text-red-400"}`}>{msgPwd}</p>}
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
}