// v2
"use client";
import { useState } from "react";
import Link from "next/link";

const COLORS = ["#E8B84B","#60A5FA","#34D399","#F87171","#A78BFA","#FB923C","#38BDF8","#4ADE80"];

function Avatar({ name, color }: { name: string; color?: string | null }) {
  const bg = color || COLORS[(name?.charCodeAt(0) || 0) % COLORS.length];
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-black shrink-0"
      style={{ backgroundColor: bg + "20", border: `1px solid ${bg}40`, color: bg }}>
      {(name || "?").charAt(0).toUpperCase()}
    </div>
  );
}

export default function EmployeesClient({ employees }: { employees: any[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = (employees || []).filter(e => {
    const name = (e.name || "").toLowerCase();
    const email = (e.email || "").toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = name.includes(q) || email.includes(q);
    const matchFilter =
      filter === "all" ? true :
      filter === "active" ? e.isActive :
      filter === "inactive" ? !e.isActive :
      filter === "onshift" ? e.onShift :
      filter === "noschedule" ? !e.hasSchedule : true;
    return matchSearch && matchFilter;
  });

  const onShiftCount = (employees || []).filter(e => e.onShift).length;
  const noScheduleCount = (employees || []).filter(e => !e.hasSchedule).length;

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center justify-between bg-[var(--bg-primary)]">
        <div>
          <h1 className="text-sm font-black text-[var(--text-primary)]">Empleados</h1>
          <p className="text-xs text-[var(--text-muted)]">{(employees||[]).length} en total · {onShiftCount} en turno ahora</p>
        </div>
        <Link href="/en/admin/employees/new"
          className="bg-[#E8B84B] text-black px-4 py-2 rounded-xl text-xs font-black hover:bg-[#d4a43a] transition">
          + Nuevo empleado
        </Link>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-xs text-[var(--text-muted)] mb-1">Total</p>
            <p className="text-2xl font-black text-[var(--text-primary)]">{(employees||[]).length}</p>
          </div>
          <div className="bg-[var(--bg-card)] border border-green-500/20 rounded-xl p-4">
            <p className="text-xs text-[var(--text-muted)] mb-1">En turno</p>
            <p className="text-2xl font-black text-green-400">{onShiftCount}</p>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-xs text-[var(--text-muted)] mb-1">Activos</p>
            <p className="text-2xl font-black text-[var(--text-primary)]">{(employees||[]).filter(e => e.isActive).length}</p>
          </div>
          <div className="bg-[var(--bg-card)] border border-orange-500/20 rounded-xl p-4">
            <p className="text-xs text-[var(--text-muted)] mb-1">Sin horario</p>
            <p className="text-2xl font-black text-orange-400">{noScheduleCount}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar empleado..."
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition w-48" />
          <div className="flex bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            {[["all","Todos"],["active","Activos"],["inactive","Inactivos"],["onshift","En turno"],["noschedule","Sin horario"]].map(([key,label]) => (
              <button key={key} onClick={() => setFilter(key)}
                className={`px-3 py-2 text-xs font-semibold transition ${filter === key ? "bg-[#E8B84B] text-black" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-12 text-center">
            <p className="text-sm text-[var(--text-muted)]">No hay empleados</p>
            <Link href="/en/admin/employees/new" className="inline-block mt-4 bg-[#E8B84B] text-black px-4 py-2 rounded-xl text-xs font-black">+ Agregar primero</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(emp => (
              <Link key={emp.id} href={`/en/admin/employees/${emp.id}`}
                className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 hover:border-[#E8B84B]/40 transition group block">
                <div className="flex items-start justify-between mb-4">
                  <Avatar name={emp.name || "?"} color={emp.avatarColor} />
                  <div className="flex flex-col items-end gap-1.5">
                    {emp.onShift && (
                      <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                        En turno
                      </span>
                    )}
                    {!emp.isActive && (
                      <span className="text-xs text-[var(--text-muted)] bg-[var(--border)] px-2 py-0.5 rounded-full">Inactivo</span>
                    )}
                    {!emp.hasSchedule && (
                      <span className="text-xs text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">Sin horario</span>
                    )}
                  </div>
                </div>
                <p className="text-sm font-black text-[var(--text-primary)] group-hover:text-[#E8B84B] transition">{emp.name}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{emp.email}</p>
                <p className="text-xs text-[var(--text-muted)] mt-2">${emp.hourlyRate || 0}/h · {emp.role}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}