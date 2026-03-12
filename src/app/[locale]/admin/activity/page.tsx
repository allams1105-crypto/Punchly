"use client";
import { useLang } from "@/lib/LangContext";
import { useEffect, useState } from "react";

type Entry = {
  id: string;
  userId: string;
  clockIn: string;
  clockOut: string | null;
  durationMin: number | null;
  status: string;
  user: { name: string };
};

type Employee = { id: string; name: string };

type Log = {
  id: string;
  action: string;
  userName: string;
  details: string;
  createdAt: string;
};

export default function ActivityPage() {
  const { lang } = useLang();
  const t = lang === "es" ? { title: "Actividad", noData: "Sin actividad reciente", clockIn: "Entrada", clockOut: "Salida", late: "Tardanza", absent: "Ausencia" } : { title: "Activity", noData: "No recent activity", clockIn: "Clock In", clockOut: "Clock Out", late: "Late", absent: "Absent" };
  const [tab, setTab] = useState<"logs" | "entries">("entries");
  const [logs, setLogs] = useState<Log[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState("");

  // Modal state
  const [modal, setModal] = useState<"edit" | "create" | "delete" | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [saving, setSaving] = useState(false);

  // Form fields
  const [formUserId, setFormUserId] = useState("");
  const [formClockIn, setFormClockIn] = useState("");
  const [formClockOut, setFormClockOut] = useState("");

  useEffect(() => {
    fetch("/api/employees").then(r => r.json()).then(d => setEmployees(d.employees || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    if (tab === "logs") {
      fetch("/api/activity").then(r => r.json()).then(d => { setLogs(d.logs || []); setLoading(false); });
    } else {
      const url = selectedUser ? `/api/time-entries?userId=${selectedUser}` : "/api/time-entries";
      fetch(url).then(r => r.json()).then(d => { setEntries(d.entries || []); setLoading(false); });
    }
  }, [tab, selectedUser]);

  function toLocalInput(iso: string) {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function openEdit(entry: Entry) {
    setSelectedEntry(entry);
    setFormClockIn(toLocalInput(entry.clockIn));
    setFormClockOut(entry.clockOut ? toLocalInput(entry.clockOut) : "");
    setPassword(""); setPassError("");
    setModal("edit");
  }

  function openCreate() {
    setFormUserId(selectedUser || (employees[0]?.id || ""));
    const now = new Date();
    setFormClockIn(toLocalInput(now.toISOString()));
    setFormClockOut("");
    setPassword(""); setPassError("");
    setModal("create");
  }

  function openDelete(entry: Entry) {
    setSelectedEntry(entry);
    setPassword(""); setPassError("");
    setModal("delete");
  }

  async function handleSave() {
    setSaving(true);
    setPassError("");
    const body: any = { password };
    if (modal === "edit") {
      body.action = "update";
      body.entryId = selectedEntry?.id;
      body.clockIn = new Date(formClockIn).toISOString();
      body.clockOut = formClockOut ? new Date(formClockOut).toISOString() : null;
    } else if (modal === "create") {
      body.action = "create";
      body.userId = formUserId;
      body.clockIn = new Date(formClockIn).toISOString();
      body.clockOut = formClockOut ? new Date(formClockOut).toISOString() : null;
    } else if (modal === "delete") {
      body.action = "delete";
      body.entryId = selectedEntry?.id;
    }

    const res = await fetch("/api/time-entries/edit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) {
      setPassError(data.error || "Error");
      setSaving(false);
      return;
    }

    // Refresh entries
    const url = selectedUser ? `/api/time-entries?userId=${selectedUser}` : "/api/time-entries";
    fetch(url).then(r => r.json()).then(d => setEntries(d.entries || []));
    setModal(null);
    setSaving(false);
  }

  const actionLabel: Record<string, { label: string; color: string; bg: string }> = {
    CLOCK_IN: { label: "Entrada", color: "text-green-400", bg: "bg-green-500/10" },
    CLOCK_OUT: { label: "Salida", color: "text-blue-400", bg: "bg-blue-500/10" },
    EMPLOYEE_CREATED: { label: "Creado", color: "text-[#E8B84B]", bg: "bg-[#E8B84B]/10" },
    EMPLOYEE_UPDATED: { label: "Editado", color: "text-purple-400", bg: "bg-purple-500/10" },
    EMPLOYEE_DEACTIVATED: { label: "Desactivado", color: "text-red-400", bg: "bg-red-500/10" },
    ENTRY_EDITED: { label: "Hora editada", color: "text-orange-400", bg: "bg-orange-500/10" },
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center justify-between bg-[var(--bg-primary)]">
        <div>
          <h1 className="text-sm font-black text-[var(--text-primary)]">Actividad</h1>
          <p className="text-xs text-[var(--text-muted)]">Registros y edición de horas</p>
        </div>
        {tab === "entries" && (
          <button onClick={openCreate}
            className="bg-[#E8B84B] text-black text-xs px-3 py-2 rounded-lg font-black hover:bg-[#d4a43a] transition flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Agregar registro
          </button>
        )}
      </div>

      <div className="p-6 space-y-4">
        {/* Tabs */}
        <div className="flex gap-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-1 w-fit">
          {([["entries", "Registros de horas"], ["logs", "Log de eventos"]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${tab === key ? "bg-[#E8B84B] text-black" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === "entries" && (
          <div className="flex items-center gap-3">
            <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition">
              <option value="">Todos los empleados</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
        )}

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-sm text-[var(--text-muted)]">Cargando...</div>
          ) : tab === "logs" ? (
            logs.length === 0 ? (
              <div className="p-8 text-center text-sm text-[var(--text-muted)]">Sin actividad registrada</div>
            ) : logs.map((log) => {
              const action = actionLabel[log.action] || { label: log.action, color: "text-[var(--text-muted)]", bg: "bg-[var(--border)]" };
              const date = new Date(log.createdAt);
              return (
                <div key={log.id} className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] last:border-0 hover:bg-[var(--border)]/30 transition">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${action.bg} ${action.color}`}>{action.label}</span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{log.userName}</p>
                      {log.details && <p className="text-xs text-[var(--text-muted)]">{log.details}</p>}
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] shrink-0 ml-4">
                    {date.toLocaleDateString("es", { day: "numeric", month: "short" })} · {date.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              );
            })
          ) : (
            entries.length === 0 ? (
              <div className="p-8 text-center text-sm text-[var(--text-muted)]">Sin registros</div>
            ) : entries.map((entry) => {
              const clockIn = new Date(entry.clockIn);
              const clockOut = entry.clockOut ? new Date(entry.clockOut) : null;
              const h = Math.floor((entry.durationMin || 0) / 60);
              const m = (entry.durationMin || 0) % 60;
              return (
                <div key={entry.id} className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] last:border-0 hover:bg-[var(--border)]/30 transition group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#E8B84B]/10 border border-[#E8B84B]/20 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-[#E8B84B] text-xs font-black">{entry.user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{entry.user.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {clockIn.toLocaleDateString("es", { day: "numeric", month: "short" })} · {clockIn.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                        {clockOut && ` — ${clockOut.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-[var(--text-primary)]">{entry.durationMin ? `${h}h ${m}m` : "—"}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${entry.status === "CLOCKED_IN" ? "bg-green-500/10 text-green-400" : "bg-[var(--border)] text-[var(--text-muted)]"}`}>
                        {entry.status === "CLOCKED_IN" ? "Activo" : "Completado"}
                      </span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => openEdit(entry)}
                        className="p-1.5 rounded-lg hover:bg-[#E8B84B]/10 text-[var(--text-muted)] hover:text-[#E8B84B] transition">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button onClick={() => openDelete(entry)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-base font-black text-[var(--text-primary)] mb-1">
              {modal === "edit" ? "Editar registro" : modal === "create" ? "Agregar registro manual" : "Eliminar registro"}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mb-5">
              {modal === "delete" ? "Esta acción no se puede deshacer." : "Los cambios quedarán registrados en el log de actividad."}
            </p>

            {modal !== "delete" && (
              <div className="space-y-3 mb-4">
                {modal === "create" && (
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Empleado</label>
                    <select value={formUserId} onChange={e => setFormUserId(e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition">
                      {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Hora de entrada</label>
                  <input type="datetime-local" value={formClockIn} onChange={e => setFormClockIn(e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Hora de salida <span className="text-[var(--text-muted)] normal-case font-normal">(opcional)</span></label>
                  <input type="datetime-local" value={formClockOut} onChange={e => setFormClockOut(e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" />
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Contraseña de administrador
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" />
              {passError && <p className="text-red-400 text-xs mt-1.5">{passError}</p>}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition disabled:opacity-50 ${modal === "delete" ? "bg-red-500 text-white hover:bg-red-600" : "bg-[#E8B84B] text-black hover:bg-[#d4a43a]"}`}>
                {saving ? "Guardando..." : modal === "delete" ? "Eliminar" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}