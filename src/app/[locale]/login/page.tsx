"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) { setError("Email o contraseña incorrectos"); setLoading(false); return; }
    router.push("/en/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-[#E8B84B] flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
            <span className="text-[#E8B84B] font-black text-base">P</span>
          </div>
          <span className="text-black font-black text-xl">Punchly.Clock</span>
        </div>
        <div>
          <h2 className="text-4xl font-black text-black leading-tight mb-4">Control de asistencia simple y eficiente</h2>
          <p className="text-black/60 text-lg">Gestiona tu equipo, horas y nómina en un solo lugar.</p>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-3xl font-black text-black">100%</p>
            <p className="text-black/60 text-sm">En la nube</p>
          </div>
          <div>
            <p className="text-3xl font-black text-black">24/7</p>
            <p className="text-black/60 text-sm">Disponible</p>
          </div>
          <div>
            <p className="text-3xl font-black text-black">∞</p>
            <p className="text-black/60 text-sm">Empleados</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-[var(--text-primary)] mb-1">Bienvenido</h1>
            <p className="text-[var(--text-muted)] text-sm">Inicia sesión en tu cuenta</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              {loading ? "Entrando..." : "Iniciar sesión"}
            </button>
          </form>
          <p className="text-center text-xs text-[var(--text-muted)] mt-6">
            ¿No tienes cuenta? <Link href="/en/register" className="text-[#E8B84B] font-semibold hover:underline">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}