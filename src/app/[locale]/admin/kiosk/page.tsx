"use client";
import { useState } from "react";

export default function KioskSetupPage() {
  const [name, setName] = useState("");
  const [exitPin, setExitPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [kioskUrl, setKioskUrl] = useState("");
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/kiosk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, exitPin }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Error al crear kiosk"); setLoading(false); return; }
    setKioskUrl(`${window.location.origin}/en/kiosk/${data.token}`);
    setLoading(false);
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center bg-[var(--bg-primary)]">
        <div>
          <h1 className="text-sm font-black text-[var(--text-primary)]">Kiosk</h1>
          <p className="text-xs text-[var(--text-muted)]">Configura un punto de fichaje para tus empleados</p>
        </div>
      </div>
      <div className="max-w-lg mx-auto p-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[var(--border)] bg-[#E8B84B]/5">
            <div className="w-10 h-10 bg-[#E8B84B]/15 border border-[#E8B84B]/20 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            </div>
            <h2 className="text-base font-black text-[var(--text-primary)]">Nuevo Kiosk</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">Instala esta URL en una tablet para que tus empleados fichen con un toque.</p>
          </div>
          <div className="p-6">
            {!kioskUrl ? (
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Nombre del Kiosk</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition"
                    placeholder="Ej: Recepción, Entrada Principal" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">PIN de salida</label>
                  <input type="password" value={exitPin} onChange={e => setExitPin(e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition"
                    placeholder="PIN para salir del kiosk" required />
                  <p className="text-xs text-[var(--text-muted)] mt-1.5">Solo tú sabrás este PIN para cerrar el kiosk</p>
                </div>
                {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"><p className="text-red-400 text-sm">{error}</p></div>}
                <button type="submit" disabled={loading}
                  className="w-full bg-[#E8B84B] text-black py-3 rounded-xl text-sm font-black hover:bg-[#d4a43a] transition disabled:opacity-50">
                  {loading ? "Creando..." : "Crear Kiosk"}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  <div>
                    <p className="text-sm font-semibold text-green-400">Kiosk creado</p>
                    <p className="text-xs text-green-400/60">Abre esta URL en tu tablet</p>
                  </div>
                </div>
                <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4">
                  <p className="text-xs text-[var(--text-muted)] mb-2 font-semibold uppercase tracking-wider">URL del Kiosk</p>
                  <p className="text-sm font-mono text-[var(--text-primary)] break-all">{kioskUrl}</p>
                </div>
                <button onClick={() => navigator.clipboard.writeText(kioskUrl)}
                  className="w-full border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] py-3 rounded-xl text-sm font-semibold transition">
                  Copiar URL
                </button>
                <a href={kioskUrl} target="_blank"
                  className="block w-full bg-[#E8B84B] text-black py-3 rounded-xl text-sm font-black hover:bg-[#d4a43a] transition text-center">
                  Abrir Kiosk →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}