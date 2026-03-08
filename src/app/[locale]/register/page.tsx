"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [company, setCompany] = useState("");
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
      body: JSON.stringify({ company, name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error al crear cuenta");
      setLoading(false);
      return;
    }

    router.push("/en/login");
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#E8B84B]" />
        <div className="absolute inset-0" style={{backgroundImage: "radial-gradient(circle at 20% 50%, rgba(0,0,0,0.2) 0%, transparent 60%)", }} />
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px"}} />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-[#E8B84B] font-black text-sm">P</span>
            </div>
            <span className="text-black font-black text-xl tracking-tight">Punchly.Clock</span>
          </div>
          <div>
            <p className="text-black/50 text-xs font-bold uppercase tracking-widest mb-5">Empieza gratis</p>
            <h2 className="text-5xl font-black text-black leading-[1.1] mb-8">
              Registra<br />
              tu empresa<br />
              hoy.
            </h2>
            <div className="h-px bg-black/15 mb-8" />
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-black font-black text-sm">01</span>
                </div>
                <div>
                  <p className="text-black font-bold text-sm">Crea tu cuenta</p>
                  <p className="text-black/50 text-xs">Solo toma 30 segundos</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-black font-black text-sm">02</span>
                </div>
                <div>
                  <p className="text-black font-bold text-sm">Agrega tus empleados</p>
                  <p className="text-black/50 text-xs">Con sus tarifas y horarios</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-black font-black text-sm">03</span>
                </div>
                <div>
                  <p className="text-black font-bold text-sm">Controla la asistencia</p>
                  <p className="text-black/50 text-xs">En tiempo real desde cualquier lugar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16">
        <div className="max-w-sm w-full mx-auto">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-7 h-7 bg-[#E8B84B] rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-xs">P</span>
            </div>
            <span className="text-white font-black text-lg">Punchly.Clock</span>
          </div>

          <h1 className="text-3xl font-black text-white mb-2">Crear cuenta</h1>
          <p className="text-gray-500 text-sm mb-8">14 dias gratis, sin tarjeta de credito</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Nombre de la empresa</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#E8B84B] transition"
                placeholder="Mi Empresa S.A."
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tu nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#E8B84B] transition"
                placeholder="Juan Perez"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#E8B84B] transition"
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
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#E8B84B] transition"
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
              className="w-full bg-[#E8B84B] text-black py-3 rounded-xl text-sm font-black hover:bg-[#d4a43a] transition disabled:opacity-50"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta gratis →"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Ya tienes cuenta?{" "}
              <a href="/en/login" className="text-[#E8B84B] font-semibold hover:underline">
                Inicia sesion
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}