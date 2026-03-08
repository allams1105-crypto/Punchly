"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditEmployeePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [hourlyRate, setHourlyRate] = useState("");
  const [overtimeRate, setOvertimeRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/employees/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setName(data.name || "");
        setEmail(data.email || "");
        setRole(data.role || "EMPLOYEE");
        setHourlyRate(data.hourlyRate?.toString() || "");
        setOvertimeRate(data.overtimeRate?.toString() || "");
        setFetching(false);
      });
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const body: any = { name, email, role, hourlyRate: parseFloat(hourlyRate), overtimeRate: parseFloat(overtimeRate) };
    if (password) body.password = password;
    const res = await fetch(`/api/employees/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Error al actualizar"); setLoading(false); return; }
    router.push("/en/admin/dashboard");
  }

  async function handleDelete() {
    if (!confirm("¿Eliminar este empleado permanentemente? Esta accion no se puede deshacer.")) return;
    setDeleting(true);
    const res = await fetch(`/api/employees/${params.id}`, { method: "DELETE" });
    if (res.ok) {
      window.location.href = "/en/admin/dashboard";
    } else {
      alert("Error al eliminar");
      setDeleting(false);
    }
  }

  if (fetching) return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-[var(--text-muted)] text-sm">Cargando...</p>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center justify-between shrink-0 bg-[var(--bg-primary)]">
        <h1 className="text-sm font-black text-[var(--text-primary)]">Editar Empleado</h1>
      </div>
      <div className="max-w-lg mx-auto p-8">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Nombre completo</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Nueva contraseña (dejar vacío para no cambiar)</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Rol</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition">
                <option value="EMPLOYEE">Empleado</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Pago hora normal</label>
                <input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" placeholder="0.00" step="0.01" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Pago hora extra</label>
                <input type="number" value={overtimeRate} onChange={(e) => setOvertimeRate(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" placeholder="0.00" step="0.01" />
              </div>
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-[#E8B84B] text-black py-3 rounded-xl text-sm font-black hover:bg-[#d4a43a] transition disabled:opacity-50">
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
            <button type="button" onClick={handleDelete} disabled={deleting}
              className="w-full border border-red-500/30 text-red-400 py-3 rounded-xl text-sm font-semibold hover:bg-red-500/10 transition disabled:opacity-50">
              {deleting ? "Eliminando..." : "Eliminar empleado permanentemente"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}