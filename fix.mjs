import { writeFileSync, mkdirSync } from "fs";

// ==================== NOMINA ====================
const payroll = `"use client";
import { useEffect, useState } from "react";

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export default function PayrollPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [half, setHalf] = useState(now.getDate() <= 15 ? 1 : 2);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(\`/api/payroll?month=\${month}&year=\${year}&half=\${half}\`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); });
  }, [month, year, half]);

  const total = data?.employees?.reduce((acc: number, e: any) => acc + e.totalPay, 0) || 0;

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center justify-between bg-[var(--bg-primary)]">
        <div>
          <h1 className="text-sm font-black text-[var(--text-primary)]">Nómina</h1>
          <p className="text-xs text-[var(--text-muted)]">Historial de pagos quincenales</p>
        </div>
        <span className="text-sm font-black text-[#E8B84B]">\${total.toLocaleString()}</span>
      </div>
      <div className="p-6 space-y-4">
        {/* Filters */}
        <div className="flex gap-2">
          <select value={month} onChange={e => setMonth(Number(e.target.value))}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B]">
            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select value={year} onChange={e => setYear(Number(e.target.value))}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B]">
            {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <div className="flex bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <button onClick={() => setHalf(1)}
              className={\`px-4 py-2 text-sm font-medium transition \${half === 1 ? "bg-[#E8B84B] text-black" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}\`}>
              1 — 15
            </button>
            <button onClick={() => setHalf(2)}
              className={\`px-4 py-2 text-sm font-medium transition \${half === 2 ? "bg-[#E8B84B] text-black" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}\`}>
              16 — fin
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-5 gap-4 px-5 py-3 border-b border-[var(--border)]">
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider col-span-2">Empleado</p>
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider text-right">Horas</p>
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider text-right">Extras</p>
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider text-right">Total</p>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-[var(--text-muted)]">Cargando...</div>
          ) : data?.employees?.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--text-muted)]">Sin registros para este período</div>
          ) : data?.employees?.map((emp: any) => (
            <div key={emp.id} className="grid grid-cols-5 gap-4 px-5 py-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--border)]/30 transition">
              <div className="col-span-2">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{emp.name}</p>
                <p className="text-xs text-[var(--text-muted)]">\${emp.hourlyRate}/h</p>
              </div>
              <p className="text-sm text-[var(--text-primary)] text-right self-center">{emp.totalHours}h</p>
              <p className="text-sm text-right self-center">
                {emp.overtimeHours > 0 ? <span className="text-orange-400">{emp.overtimeHours}h</span> : <span className="text-[var(--text-muted)]">—</span>}
              </p>
              <p className="text-sm font-black text-[#E8B84B] text-right self-center">\${emp.totalPay.toLocaleString()}</p>
            </div>
          ))}
          {data?.employees?.length > 0 && (
            <div className="grid grid-cols-5 gap-4 px-5 py-4 bg-[#E8B84B]/5 border-t border-[#E8B84B]/20">
              <p className="text-sm font-black text-[var(--text-primary)] col-span-4">Total nómina</p>
              <p className="text-sm font-black text-[#E8B84B] text-right">\${total.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}`;

// ==================== ACTIVIDAD ====================
const activity = `"use client";
import { useEffect, useState } from "react";

export default function ActivityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activity")
      .then(r => r.json())
      .then(d => { setLogs(d.logs || []); setLoading(false); });
  }, []);

  const actionLabel: Record<string, { label: string; color: string; bg: string }> = {
    CLOCK_IN: { label: "Entrada", color: "text-green-400", bg: "bg-green-500/10" },
    CLOCK_OUT: { label: "Salida", color: "text-blue-400", bg: "bg-blue-500/10" },
    EMPLOYEE_CREATED: { label: "Creado", color: "text-[#E8B84B]", bg: "bg-[#E8B84B]/10" },
    EMPLOYEE_UPDATED: { label: "Editado", color: "text-purple-400", bg: "bg-purple-500/10" },
    EMPLOYEE_DEACTIVATED: { label: "Desactivado", color: "text-red-400", bg: "bg-red-500/10" },
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center bg-[var(--bg-primary)]">
        <div>
          <h1 className="text-sm font-black text-[var(--text-primary)]">Actividad</h1>
          <p className="text-xs text-[var(--text-muted)]">Registro de eventos del sistema</p>
        </div>
      </div>
      <div className="p-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-sm text-[var(--text-muted)]">Cargando...</div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--text-muted)]">Sin actividad registrada</div>
          ) : logs.map((log: any) => {
            const action = actionLabel[log.action] || { label: log.action, color: "text-[var(--text-muted)]", bg: "bg-[var(--border)]" };
            const date = new Date(log.createdAt);
            return (
              <div key={log.id} className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] last:border-0 hover:bg-[var(--border)]/30 transition">
                <div className="flex items-center gap-3">
                  <span className={\`text-xs px-2.5 py-1 rounded-lg font-semibold \${action.bg} \${action.color}\`}>
                    {action.label}
                  </span>
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
          })}
        </div>
      </div>
    </div>
  );
}`;

// ==================== SETTINGS ====================
const settings = `"use client";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => setOrgName(d.name || ""));
  }, []);

  async function handleSave() {
    setLoading(true);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: orgName }),
    });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center bg-[var(--bg-primary)]">
        <div>
          <h1 className="text-sm font-black text-[var(--text-primary)]">Settings</h1>
          <p className="text-xs text-[var(--text-muted)]">Configuración de la organización</p>
        </div>
      </div>
      <div className="p-6 max-w-lg space-y-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">Organización</h2>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Nombre de la empresa</label>
            <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" />
          </div>
          <button onClick={handleSave} disabled={loading}
            className="bg-[#E8B84B] text-black px-6 py-2.5 rounded-xl text-sm font-black hover:bg-[#d4a43a] transition disabled:opacity-50">
            {saved ? "✓ Guardado" : loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}`;

// ==================== NUEVO EMPLEADO ====================
const newEmployee = `"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEmployeePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [hourlyRate, setHourlyRate] = useState("");
  const [overtimeRate, setOvertimeRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, hourlyRate: parseFloat(hourlyRate) || 0, overtimeRate: parseFloat(overtimeRate) || 0 }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Error al crear"); setLoading(false); return; }
    window.location.href = "/en/admin/dashboard";
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center bg-[var(--bg-primary)]">
        <h1 className="text-sm font-black text-[var(--text-primary)]">Nuevo Empleado</h1>
      </div>
      <div className="max-w-lg mx-auto p-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Nombre completo</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Rol</label>
              <select value={role} onChange={e => setRole(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition">
                <option value="EMPLOYEE">Empleado</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Pago/hora</label>
                <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" placeholder="0.00" step="0.01" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Hora extra</label>
                <input type="number" value={overtimeRate} onChange={e => setOvertimeRate(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" placeholder="0.00" step="0.01" />
              </div>
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"><p className="text-red-400 text-sm">{error}</p></div>}
            <button type="submit" disabled={loading}
              className="w-full bg-[#E8B84B] text-black py-3 rounded-xl text-sm font-black hover:bg-[#d4a43a] transition disabled:opacity-50">
              {loading ? "Creando..." : "Crear empleado"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}`;

// ==================== LOGIN ====================
const login = `"use client";
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
}`;

// ==================== REGISTER ====================
const register = `"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
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
      body: JSON.stringify({ orgName, name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Error al registrar"); setLoading(false); return; }
    router.push("/en/login");
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
          <h2 className="text-4xl font-black text-black leading-tight mb-4">Empieza a gestionar tu equipo hoy</h2>
          <p className="text-black/60 text-lg">Crea tu cuenta gratis y comienza en minutos.</p>
        </div>
        <div className="flex gap-6">
          <div><p className="text-3xl font-black text-black">Gratis</p><p className="text-black/60 text-sm">Para empezar</p></div>
          <div><p className="text-3xl font-black text-black">5min</p><p className="text-black/60 text-sm">Para configurar</p></div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-[var(--text-primary)] mb-1">Crear cuenta</h1>
            <p className="text-[var(--text-muted)] text-sm">Registra tu empresa en Punchly.Clock</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Nombre de la empresa</label>
              <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" placeholder="Mi Empresa S.A." required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Tu nombre</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" placeholder="Juan Pérez" required />
            </div>
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
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>
          <p className="text-center text-xs text-[var(--text-muted)] mt-6">
            ¿Ya tienes cuenta? <Link href="/en/login" className="text-[#E8B84B] font-semibold hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}`;

// ==================== WRITE FILES ====================
writeFileSync("src/app/[locale]/admin/payroll/page.tsx", payroll);
writeFileSync("src/app/[locale]/admin/activity/page.tsx", activity);
writeFileSync("src/app/[locale]/admin/settings/page.tsx", settings);
writeFileSync("src/app/[locale]/admin/employees/new/page.tsx", newEmployee);
writeFileSync("src/app/[locale]/login/page.tsx", login);
writeFileSync("src/app/[locale]/register/page.tsx", register);

console.log("Todas las páginas actualizadas!");

