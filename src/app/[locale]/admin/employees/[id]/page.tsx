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
    if (!res.ok) {
      setError(data.error || "Error al actualizar");
      setLoading(false);
      return;
    }
    router.push("/en/admin/dashboard");
  }

  if (fetching) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400">Cargando...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900">Punchly</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500 text-sm">Editar Empleado</span>
        </div>
        <a href="/en/admin/dashboard" className="text-sm text-gray-500 hover:text-gray-900">Volver</a>
      </div>
      <div className="max-w-lg mx-auto p-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Editar Empleado</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contrasena (dejar vacio para no cambiar)</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black">
                <option value="EMPLOYEE">Empleado</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pago por hora normal</label>
                <input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" placeholder="0.00" step="0.01" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pago por hora extra</label>
                <input type="number" value={overtimeRate} onChange={(e) => setOvertimeRate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" placeholder="0.00" step="0.01" />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50">
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}