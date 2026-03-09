"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function RegisterPage() {
  const [orgName, setOrgName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgName, name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Error al registrar"); setLoading(false); return; }
    
    // Auto login after register
    const result = await signIn("credentials", {
      email, password, redirect: false,
    });
    if (result?.ok) {
      window.location.href = "/en/admin/dashboard";
    } else {
      window.location.href = "/en/login";
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      <div className="hidden lg:flex w-1/2 bg-[#E8B84B] flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
            <span className="text-[#E8B84B] font-black text-base">P</span>
          </div>
          <span className="text-black font-black text-xl">Punchly.Clock</span>
        </div>
        <div>
          <h2 className="text-4xl font-black text-black leading-tight mb-4">Empieza a gestionar tu equipo hoy</h2>
          <p className="text-black/60 text-lg">Crea tu cuenta gratis y comienza en minutos.</p>
        </div>
        <div className="flex gap-6">
          <div><p className="text-3xl font-black text-black">Gratis</p><p className="text-black/60 text-sm">Para empezar</p></div>
          <div><p className="text-3xl font-black text-black">5min</p><p className="text-black/60 text-sm">Para configurar</p></div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-[var(--text-primary)] mb-1">Crear cuenta</h1>
            <p className="text-[var(--text-muted)] text-sm">Registra tu empresa en Punchly.Clock</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Nombre de la empresa</label>
              <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" placeholder="Mi Empresa S.A." required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Tu nombre</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" placeholder="Juan Pérez" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" placeholder="tu@empresa.com" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" placeholder="••••••••" required />
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"><p className="text-red-400 text-sm">{error}</p></div>}
            <button type="submit" disabled={loading}
              className="w-full bg-[#E8B84B] text-black py-3 rounded-xl text-sm font-black hover:bg-[#d4a43a] transition disabled:opacity-50">
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>
          <p className="text-center text-xs text-[var(--text-muted)] mt-6">
            ¿Ya tienes cuenta? <Link href="/en/login" className="text-[#E8B84B] font-semibold hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}