"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((data) => {
      setOrgName(data.name || ""); setFetching(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const res = await fetch("/api/settings", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: orgName }),
    });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    setLoading(false);
  }

  if (fetching) return <div className="min-h-screen bg-black flex items-center justify-center"><p className="text-white/30">Cargando...</p></div>;

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-black border-b border-white/8 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[#E8B84B] rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-xs">P</span>
          </div>
          <span className="text-white font-black text-lg">Punchly.Clock</span>
          <span className="text-white/20 mx-1">|</span>
          <span className="text-white/40 text-sm">Configuracion</span>
        </div>
        <Link href="/en/admin/dashboard" className="text-xs text-white/40 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition">← Volver</Link>
      </div>
      <div className="max-w-lg mx-auto p-8">
        <div className="bg-white/5 border border-white/8 rounded-2xl p-8">
          <h1 className="text-lg font-black text-white mb-6">Configuracion de la empresa</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Nombre de la empresa</label>
              <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E8B84B] transition" required />
            </div>
            {saved && <p className="text-green-400 text-sm">Guardado correctamente</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-[#E8B84B] text-black py-3 rounded-xl text-sm font-black hover:bg-[#d4a43a] transition disabled:opacity-50">
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}