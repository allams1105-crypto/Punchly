"use client";
import { useState } from "react";
import Link from "next/link";

type Employee = {
  id: string;
  name: string;
  hourlyRate: number | null;
  totalHours: number;
  overtimeHours: number;
  isActive: boolean;
  clockInTime?: string;
  minutesWorked?: number;
};

export default function EmployeeTable({ employees, payrollData, activeUserIds, activeEntryMap, now }: {
  employees: any[];
  payrollData: any[];
  activeUserIds: string[];
  activeEntryMap: Record<string, any>;
  now: string;
}) {
  const [search, setSearch] = useState("");
  const nowDate = new Date(now);

  const filtered = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeSet = new Set(activeUserIds);

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">Estado de Empleados</h2>
          <span className="text-xs bg-[var(--border)] text-[var(--text-muted)] px-2 py-0.5 rounded-full font-medium">{employees.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <svg className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar empleado..."
              className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition w-40 md:w-48"
            />
          </div>
          <Link href="/en/admin/employees/new" className="text-xs text-[#E8B84B] font-semibold hover:underline whitespace-nowrap">+ Agregar</Link>
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
            <th className="text-left px-5 py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Nombre</th>
            <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Estado</th>
            <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden sm:table-cell">Entrada</th>
            <th className="text-right px-5 py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Horas</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {filtered.length === 0 ? (
            <tr><td colSpan={5} className="px-5 py-10 text-center">
              {search ? (
                <p className="text-sm text-[var(--text-muted)]">Sin resultados para "<span className="text-[var(--text-primary)]">{search}</span>"</p>
              ) : (
                <>
                  <p className="text-sm text-[var(--text-muted)] mb-3">No hay empleados aún</p>
                  <Link href="/en/admin/employees/new" className="text-xs bg-[#E8B84B] text-black px-4 py-2 rounded-lg font-black hover:bg-[#d4a43a] transition">+ Agregar primer empleado</Link>
                </>
              )}
            </td></tr>
          ) : filtered.map((emp) => {
            const isActive = activeSet.has(emp.id);
            const activeEntry = activeEntryMap[emp.id];
            const pData = payrollData.find((p: any) => p.id === emp.id);
            const minutesWorked = activeEntry ? Math.floor((nowDate.getTime() - new Date(activeEntry.clockIn).getTime()) / 60000) : 0;
            return (
              <tr key={emp.id} className="hover:bg-[var(--border)]/20 transition group">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[#E8B84B]/10 border border-[#E8B84B]/20 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-[#E8B84B] text-xs font-black">{emp.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{emp.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">${emp.hourlyRate}/h</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  {isActive ? (
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shrink-0"></span>
                      <span className="text-xs font-semibold text-green-400">
                        {Math.floor(minutesWorked/60)}h {minutesWorked%60}m
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">Fuera</span>
                  )}
                </td>
                <td className="px-3 py-3 hidden sm:table-cell">
                  <p className="text-xs text-[var(--text-primary)]">
                    {activeEntry ? new Date(activeEntry.clockIn).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }) : "—"}
                  </p>
                </td>
                <td className="px-5 py-3 text-right">
                  <p className="text-sm font-bold text-[var(--text-primary)]">{pData?.totalHours || 0}h</p>
                  {pData && pData.overtimeHours > 0 && (
                    <p className="text-xs text-orange-400">+{pData.overtimeHours}h extra</p>
                  )}
                </td>
                <td className="px-3 py-3">
                  <Link href={`/en/admin/employees/${emp.id}`}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border)] px-2 py-1 rounded-lg transition opacity-0 group-hover:opacity-100">
                    Editar
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {filtered.length > 0 && (
        <div className="px-5 py-2.5 border-t border-[var(--border)] flex items-center justify-between">
          <p className="text-xs text-[var(--text-muted)]">{activeSet.size} trabajando · {employees.length - activeSet.size} fuera</p>
          {search && <p className="text-xs text-[var(--text-muted)]">{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</p>}
        </div>
      )}
    </div>
  );
}