"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditEmployeePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [hourlyRate, setHourlyRate] = useState("");
  const [overtimeRate, setOvertimeRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/employees/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setName(data.name || ""); setEmail(data.email || "");
        setRole(data.role || "EMPLOYEE");
        setHourlyRate(data.hourlyRate?.toString() || "");
        setOvertimeRate(data.overtimeRate?.toString() || "");
        setFetching(false);
      });
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    const body: any = { name, email, role, hourlyRate: parseFloat(hourlyRate), overtimeRate: parseFloat(overtimeRate) };
    if (password) body.password = password;
    const res = await fetch(`/api/employees/${params.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Error al actualizar"); setLoading(false); return; }
    router.push("/en/admin/dashboard");
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
          <span className="text-white/40 text-sm">Editar Empleado</span>
        </div>
        <Link href="/en/admin/dashboard" className="text-xs text-white/40 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition">← Volver</Link>
      </div>
      <div className="max-w-lg mx-auto p-8">
        <div className="bg-white/5 border border-white/8 rounded-2xl p-8">
          <h1 className="text-xl font-black text-white mb-6">Editar Empleado</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Nombre completo</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E8B84B] transition" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E8B84B] transition" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Nueva contrasena (dejar vacio para no cambiar)</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E8B84B] transition" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Rol</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E8B84B] transition">
                <option value="EMPLOYEE" className="bg-black">Empleado</option>
                <option value="ADMIN" className="bg-black">Admin</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Pago hora normal</label>
                <input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E8B84B] transition" placeholder="0.00" step="0.01" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Pago hora extra</label>
                <input type="number" value={overtimeRate} onChange={(e) => setOvertimeRate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E8B84B] transition" placeholder="0.00" step="0.01" />
              </div>
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"><p className="text-red-400 text-sm">{error}</p></div>}
            <button type="submit" disabled={loading}
              className="w-full bg-[#E8B84B] text-black py-3 rounded-xl text-sm font-black hover:bg-[#d4a43a] transition disabled:opacity-50">
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
            <button type="button"
              onClick={async () => {
                if (!confirm("Seguro que quieres desactivar este empleado?")) return;
                await fetch(`/api/employees/${params.id}`, { method: "DELETE" });
                router.push("/en/admin/dashboard");
              }}
              className="w-full border border-red-500/20 text-red-400 py-3 rounded-xl text-sm font-semibold hover:bg-red-500/10 transition">
              Desactivar empleado
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}