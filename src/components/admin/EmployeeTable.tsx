"use client";
import { useState } from "react";
import Link from "next/link";

type Employee = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  onShift: boolean;
  clockInTime: string | null;
};

export default function EmployeeTable({ employees }: { employees: Employee[] }) {
  const [search, setSearch] = useState("");

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  function elapsed(clockIn: string) {
    const diff = Math.floor((Date.now() - new Date(clockIn).getTime()) / 60000);
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Estado de empleados</h3>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition w-36" />
      </div>
      {filtered.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-[var(--text-muted)]">No hay empleados</p>
          <Link href="/en/admin/employees/new" className="inline-block mt-3 bg-[#E8B84B] text-black px-4 py-2 rounded-xl text-xs font-black">+ Agregar primero</Link>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Empleado</th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Estado</th>
              <th className="text-right px-5 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Tiempo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filtered.map(emp => (
              <tr key={emp.id} className="hover:bg-[var(--border)]/20 transition">
                <td className="px-5 py-3">
                  <Link href={`/en/admin/employees/${emp.id}`} className="flex items-center gap-2.5 group">
                    <div className="w-7 h-7 bg-[#E8B84B]/10 border border-[#E8B84B]/20 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-[#E8B84B] text-xs font-black">{emp.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[#E8B84B] transition">{emp.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{emp.email}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-3 py-3">
                  {emp.onShift ? (
                    <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-2.5 py-1 rounded-lg w-fit">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                      Trabajando
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)] bg-[var(--border)] px-2.5 py-1 rounded-lg">Fuera</span>
                  )}
                </td>
                <td className="px-5 py-3 text-right">
                  {emp.onShift && emp.clockInTime ? (
                    <p className="text-xs font-semibold text-[#E8B84B]">{elapsed(emp.clockInTime)}</p>
                  ) : (
                    <p className="text-xs text-[var(--text-muted)]">—</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}