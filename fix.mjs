import { writeFileSync } from "fs";

const content = `"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email o contrasena incorrectos");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/session");
    const session = await res.json();
    const role = session?.user?.role;

    if (role === "OWNER" || role === "ADMIN") {
      window.location.href = "/en/admin/dashboard";
    } else {
      window.location.href = "/en/employee/dashboard";
    }
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#E8B84B]" />
        <div className="absolute inset-0" style={{backgroundImage: "radial-gradient(circle at 20% 50%, rgba(0,0,0,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)"}} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px"}} />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-[#E8B84B] font-black text-sm">P</span>
            </div>
            <span className="text-black font-black text-xl tracking-tight">Punchly.Clock</span>
          </div>
          <div>
            <p className="text-black/60 text-sm font-medium uppercase tracking-widest mb-4">Control de asistencia</p>
            <h2 className="text-5xl font-black text-black leading-tight mb-6">
              Tu equipo,<br />
              siempre<br />
              en punto.
            </h2>
            <div className="flex gap-6">
              <div>
                <p className="text-3xl font-black text-black">100%</p>
                <p className="text-black/60 text-xs mt-1">Automatizado</p>
              </div>
              <div>
                <p className="text-3xl font-black text-black">0</p>
                <p className="text-black/60 text-xs mt-1">Errores manuales</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 relative">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        <div className="max-w-sm w-full mx-auto">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-7 h-7 bg-[#E8B84B] rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-xs">P</span>
            </div>
            <span className="text-white font-black text-lg">Punchly.Clock</span>
          </div>

          <h1 className="text-3xl font-black text-white mb-2">Bienvenido</h1>
          <p className="text-gray-500 text-sm mb-8">Ingresa a tu cuenta para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#E8B84B] focus:bg-white/8 transition"
                placeholder="tu@empresa.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Contrasena</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#E8B84B] focus:bg-white/8 transition"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E8B84B] text-black py-3 rounded-xl text-sm font-black hover:bg-[#d4a43a] transition disabled:opacity-50 mt-2"
            >
              {loading ? "Entrando..." : "Iniciar Sesion →"}
            </button>

            <p className="text-center text-sm text-gray-600">
              No tienes cuenta?{" "}
              <a href="/en/register" className="text-[#E8B84B] font-semibold hover:underline">
                Registrate gratis
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}`;

writeFileSync("src/app/[locale]/login/page.tsx", content);
console.log("Listo!");

