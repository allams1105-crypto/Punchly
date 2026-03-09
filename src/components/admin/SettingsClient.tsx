"use client";
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
            {msgOrg && <p className={`text-xs ${msgOrg.startsWith("✓") ? "text-green-400" : "text-red-400"}`}>{msgOrg}</p>}
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
            {msgPass && <p className={`text-xs ${msgPass.startsWith("✓") ? "text-green-400" : "text-red-400"}`}>{msgPass}</p>}
          </div>
        </div>
      </div>

      {/* Plan */}
      <div className={`border rounded-2xl overflow-hidden ${isPro ? "bg-[#E8B84B]/5 border-[#E8B84B]/20" : "bg-[var(--bg-card)] border-[var(--border)]"}`}>
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Plan actual</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{isPro ? "Licencia activa de por vida" : "Período de prueba"}</p>
            </div>
            <span className={`text-xs font-black px-3 py-1.5 rounded-xl ${isPro ? "bg-[#E8B84B] text-black" : "bg-[var(--border)] text-[var(--text-muted)]"}`}>
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
}