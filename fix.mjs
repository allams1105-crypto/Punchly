import { writeFileSync } from "fs";

const kioskClient = `"use client";
import { useState, useEffect } from "react";

const COLORS = ["#E8B84B","#60A5FA","#34D399","#F87171","#A78BFA","#FB923C","#38BDF8","#4ADE80"];

function Avatar({ name, color, size = "md" }: { name: string; color?: string | null; size?: "sm" | "md" | "lg" }) {
  const bg = color || COLORS[(name?.charCodeAt(0) || 0) % COLORS.length];
  const sz = size === "lg" ? "w-20 h-20 text-3xl" : size === "md" ? "w-14 h-14 text-xl" : "w-10 h-10 text-sm";
  return (
    <div className={\`\${sz} rounded-2xl flex items-center justify-center font-black shrink-0\`}
      style={{ backgroundColor: bg + "25", border: \`2px solid \${bg}50\`, color: bg }}>
      {(name || "?").charAt(0).toUpperCase()}
    </div>
  );
}

type Employee = {
  id: string;
  name: string;
  avatarColor?: string | null;
  onShift: boolean;
  clockInTime?: string | null;
};

type Step = "list" | "pin" | "success";

export default function KioskClient({ employees, token }: { employees: Employee[]; token: string }) {
  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Employee | null>(null);
  const [step, setStep] = useState<Step>("list");
  const [pin, setPin] = useState("");
  const [action, setAction] = useState<"in"|"out">("in");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const filtered = employees.filter(e =>
    (e.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const onShiftNow = employees.filter(e => e.onShift);

  function selectEmployee(emp: Employee) {
    setSelected(emp);
    setAction(emp.onShift ? "out" : "in");
    setPin("");
    setError("");
    setStep("pin");
  }

  function addDigit(d: string) {
    if (pin.length < 4) setPin(prev => prev + d);
  }

  function removeDigit() {
    setPin(prev => prev.slice(0, -1));
  }

  async function confirmPin() {
    if (pin.length !== 4) { setError("Ingresa tu PIN de 4 dígitos"); return; }
    setLoading(true);
    setError("");
    const res = await fetch(\`/api/kiosk/clock\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selected!.id, organizationId: token, action, pin }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Error al registrar"); return; }
    setSuccessMsg(action === "in" ? "Entrada registrada" : "Salida registrada");
    setStep("success");
    setTimeout(() => {
      setStep("list");
      setSelected(null);
      setPin("");
      setSearch("");
      setSuccessMsg("");
    }, 3000);
  }

  const timeStr = time.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = time.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" });

  // SUCCESS SCREEN
  if (step === "success") return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <div className="text-center animate-pulse">
        <div className="w-24 h-24 bg-[#E8B84B]/20 border-2 border-[#E8B84B] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <p className="text-4xl font-black text-white mb-2">{successMsg}</p>
        <p className="text-xl text-[#E8B84B] font-bold">{selected?.name}</p>
        <p className="text-white/40 mt-2">{timeStr}</p>
      </div>
    </div>
  );

  // PIN SCREEN
  if (step === "pin") return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <button onClick={() => setStep("list")} className="absolute top-6 left-6 text-white/40 hover:text-white transition text-sm flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        Volver
      </button>

      <div className="w-full max-w-sm">
        {/* Employee info */}
        <div className="flex flex-col items-center mb-8">
          <Avatar name={selected!.name} color={selected?.avatarColor} size="lg" />
          <p className="text-2xl font-black text-white mt-4">{selected!.name}</p>
          <div className={\`mt-2 px-4 py-1.5 rounded-full text-sm font-bold \${action === "in" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}\`}>
            {action === "in" ? "Registrar Entrada" : "Registrar Salida"}
          </div>
        </div>

        {/* PIN dots */}
        <div className="flex justify-center gap-4 mb-8">
          {[0,1,2,3].map(i => (
            <div key={i} className={\`w-5 h-5 rounded-full transition-all \${i < pin.length ? "bg-[#E8B84B] scale-110" : "bg-white/20"}\`} />
          ))}
        </div>

        {error && <p className="text-center text-red-400 text-sm mb-4">{error}</p>}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3">
          {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((d, i) => (
            <button key={i} onClick={() => d === "⌫" ? removeDigit() : d ? addDigit(d) : null}
              disabled={!d && d !== "0"}
              className={\`h-16 rounded-2xl text-xl font-black transition \${
                d === "⌫" ? "bg-white/10 text-white/60 hover:bg-white/20" :
                d ? "bg-white/10 text-white hover:bg-white/20 active:bg-[#E8B84B]/30 active:text-[#E8B84B]" :
                "opacity-0 pointer-events-none"
              }\`}>
              {d}
            </button>
          ))}
        </div>

        <button onClick={confirmPin} disabled={loading || pin.length !== 4}
          className="w-full mt-4 bg-[#E8B84B] text-black py-4 rounded-2xl font-black text-lg hover:bg-[#d4a43a] transition disabled:opacity-40">
          {loading ? "Verificando..." : "Confirmar"}
        </button>
      </div>
    </div>
  );

  // MAIN LIST SCREEN
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="px-8 pt-8 pb-4 flex items-start justify-between">
        <div>
          <p className="text-5xl font-black text-white tracking-tight">{timeStr}</p>
          <p className="text-white/40 text-sm mt-1 capitalize">{dateStr}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#E8B84B] rounded-xl flex items-center justify-center">
            <span className="text-black font-black text-sm">P</span>
          </div>
          <span className="text-white font-black">Punchly.Clock</span>
        </div>
      </div>

      {/* On shift strip */}
      {onShiftNow.length > 0 && (
        <div className="px-8 py-3 border-y border-white/8 flex items-center gap-3 overflow-x-auto">
          <span className="text-xs text-white/40 shrink-0">En turno:</span>
          {onShiftNow.map(e => (
            <div key={e.id} className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full shrink-0">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs text-green-400 font-semibold">{e.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="px-8 py-4">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Busca tu nombre..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-lg placeholder-white/20 focus:outline-none focus:border-[#E8B84B]/50 transition" />
      </div>

      {/* Employee grid */}
      <div className="flex-1 px-8 pb-8 overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(emp => (
            <button key={emp.id} onClick={() => selectEmployee(emp)}
              className={\`p-5 rounded-2xl border text-left transition active:scale-95 \${
                emp.onShift
                  ? "bg-green-500/10 border-green-500/30 hover:bg-green-500/20"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#E8B84B]/30"
              }\`}>
              <Avatar name={emp.name} color={emp.avatarColor} size="md" />
              <p className="text-sm font-black text-white mt-3 leading-tight">{emp.name}</p>
              {emp.onShift ? (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-xs text-green-400">En turno</span>
                </div>
              ) : (
                <span className="text-xs text-white/30 mt-1.5 block">Fuera</span>
              )}
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/30 text-sm">No se encontraron empleados</p>
          </div>
        )}
      </div>
    </div>
  );
}`;

// Update kiosk clock API to verify PIN
const kioskClock = `import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { userId, organizationId, action, pin } = await req.json();
  if (!userId || !organizationId || !action) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: userId }, include: { schedule: true } });
  if (!user) return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });

  // Verify PIN
  const kioskPin = (user as any).kioskPin;
  if (kioskPin) {
    if (!pin) return NextResponse.json({ error: "PIN requerido" }, { status: 401 });
    const valid = await bcrypt.compare(pin, kioskPin);
    if (!valid) return NextResponse.json({ error: "PIN incorrecto" }, { status: 401 });
  }

  if (action === "in") {
    const existing = await prisma.timeEntry.findFirst({ where: { userId, organizationId, clockOut: null } });
    if (existing) return NextResponse.json({ error: "Ya está en turno" }, { status: 400 });

    const entry = await prisma.timeEntry.create({ data: { userId, organizationId, clockIn: new Date() } });

    await prisma.activityLog.create({
      data: { organizationId, userId, userName: user.name, action: "CLOCK_IN", details: "Entrada registrada" },
    });

    // Check if late
    const schedule = user.schedule;
    if (schedule) {
      const now = new Date();
      const dayMap: Record<number, keyof typeof schedule> = { 0: "sunday", 1: "monday", 2: "tuesday", 3: "wednesday", 4: "thursday", 5: "friday", 6: "saturday" };
      const dayKey = dayMap[now.getDay()];
      const isWorkDay = schedule[dayKey] as boolean;
      if (isWorkDay) {
        const [startH, startM] = schedule.startTime.split(":").map(Number);
        const scheduledStart = new Date(now); scheduledStart.setHours(startH, startM, 0, 0);
        const lateMin = Math.floor((now.getTime() - scheduledStart.getTime()) / 60000) - schedule.toleranceMin;
        if (lateMin > 0) {
          await prisma.activityLog.create({
            data: { organizationId, userId, userName: user.name, action: "LATE",
              details: \`Tardanza de \${lateMin} minutos (entró a las \${now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}, horario \${schedule.startTime})\` },
          });
          const org = await prisma.organization.findUnique({ where: { id: organizationId }, include: { users: { where: { role: "OWNER" } } } });
          const ownerEmail = org?.users?.[0]?.email;
          const alertEmail = (org as any)?.alertEmail;
          const recipients = [ownerEmail, alertEmail].filter(Boolean) as string[];
          if (recipients.length > 0) {
            try {
              await resend.emails.send({
                from: "Punchly.Clock <onboarding@resend.dev>",
                to: recipients,
                subject: \`⚠️ Tardanza — \${user.name}\`,
                html: \`<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
                  <h2>⚠️ Tardanza detectada</h2>
                  <p><strong>\${user.name}</strong> llegó <strong>\${lateMin} minutos tarde</strong>.</p>
                  <p>Hora de entrada: \${now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })} · Horario: \${schedule.startTime}</p>
                  <a href="https://punchlyclock.vercel.app/en/admin/attendance" style="display:inline-block;background:#E8B84B;color:black;padding:12px 24px;border-radius:12px;font-weight:900;text-decoration:none;margin-top:16px;">Ver asistencia →</a>
                </div>\`,
              });
            } catch(e) { console.error(e); }
          }
        }
      }
    }
    return NextResponse.json({ success: true, action: "in", entryId: entry.id });

  } else if (action === "out") {
    const entry = await prisma.timeEntry.findFirst({ where: { userId, organizationId, clockOut: null }, orderBy: { clockIn: "desc" } });
    if (!entry) return NextResponse.json({ error: "No está en turno" }, { status: 400 });
    const now = new Date();
    const durationMin = Math.floor((now.getTime() - entry.clockIn.getTime()) / 60000);
    await prisma.timeEntry.update({ where: { id: entry.id }, data: { clockOut: now, durationMin } });
    await prisma.activityLog.create({
      data: { organizationId, userId, userName: user.name, action: "CLOCK_OUT", details: \`Salida registrada — \${durationMin} minutos trabajados\` },
    });
    return NextResponse.json({ success: true, action: "out" });
  }

  return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
}`;

// Add PIN field to EmployeeEditClient
const employeeEditClient = `"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const COLORS = ["#E8B84B","#60A5FA","#34D399","#F87171","#A78BFA","#FB923C","#38BDF8","#4ADE80","#E879F9","#94A3B8"];

export default function EmployeeEditClient({ employee }: { employee: any }) {
  const router = useRouter();
  const [name, setName] = useState(employee.name);
  const [email, setEmail] = useState(employee.email);
  const [hourlyRate, setHourlyRate] = useState(employee.hourlyRate);
  const [isActive, setIsActive] = useState(employee.isActive);
  const [avatarColor, setAvatarColor] = useState(employee.avatarColor || "#E8B84B");
  const [kioskPin, setKioskPin] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    setSaving(true);
    const body: any = { name, email, hourlyRate: Number(hourlyRate), isActive };
    if (kioskPin.length === 4) body.kioskPin = kioskPin;
    const res = await fetch(\`/api/employees/\${employee.id}\`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await fetch("/api/employees/avatar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: employee.id, avatarColor }),
    });
    setMsg(res.ok ? "✓ Guardado" : "Error al guardar");
    setSaving(false);
    if (kioskPin) setKioskPin("");
    setTimeout(() => setMsg(""), 3000);
  }

  async function deleteEmployee() {
    if (!confirm("¿Eliminar este empleado? Esta acción no se puede deshacer.")) return;
    setDeleting(true);
    await fetch(\`/api/employees/\${employee.id}\`, { method: "DELETE" });
    router.push("/en/admin/dashboard");
  }

  const initials = name.split(" ").map((n: string) => n.charAt(0)).join("").substring(0, 2).toUpperCase();

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[var(--border)]">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Información del empleado</h3>
      </div>
      <div className="p-5 space-y-5">
        {/* Avatar */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Avatar</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black shrink-0 transition-all"
              style={{ backgroundColor: avatarColor + "20", border: \`2px solid \${avatarColor}40\`, color: avatarColor }}>
              {initials}
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-2">Color del avatar</p>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setAvatarColor(c)}
                    className={\`w-6 h-6 rounded-lg transition-all \${avatarColor === c ? "ring-2 ring-white ring-offset-2 ring-offset-[var(--bg-card)] scale-110" : "hover:scale-110"}\`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Nombre</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Tarifa por hora ($)</label>
            <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Estado</label>
            <select value={isActive ? "1" : "0"} onChange={e => setIsActive(e.target.value === "1")}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition">
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
          </div>
        </div>

        {/* Kiosk PIN */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">PIN del Kiosk (4 dígitos)</label>
          <input type="password" value={kioskPin} onChange={e => setKioskPin(e.target.value.replace(/\D/g,"").substring(0,4))}
            placeholder="Dejar vacío para no cambiar"
            maxLength={4}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" />
          <p className="text-xs text-[var(--text-muted)] mt-1">El empleado usará este PIN para fichar en el kiosk</p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button onClick={deleteEmployee} disabled={deleting}
            className="text-xs text-red-400 hover:text-red-300 font-semibold transition disabled:opacity-50">
            {deleting ? "Eliminando..." : "Eliminar empleado"}
          </button>
          <div className="flex items-center gap-3">
            {msg && <p className={\`text-xs \${msg.startsWith("✓") ? "text-green-400" : "text-red-400"}\`}>{msg}</p>}
            <button onClick={save} disabled={saving}
              className="bg-[#E8B84B] text-black px-5 py-2.5 rounded-xl text-sm font-black hover:bg-[#d4a43a] transition disabled:opacity-50">
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`;

// Update employees PATCH API to handle kioskPin
const employeesApi = `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest, { params }: { params: any }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const orgId = (session.user as any).organizationId;
  const { id } = params;
  const body = await req.json();
  const { name, email, hourlyRate, isActive, kioskPin } = body;

  const updateData: any = { name, email, hourlyRate, isActive };
  if (kioskPin && kioskPin.length === 4) {
    updateData.kioskPin = await bcrypt.hash(kioskPin, 10);
  }

  const user = await prisma.user.update({
    where: { id, organizationId: orgId },
    data: updateData,
  });

  return NextResponse.json({ user });
}

export async function DELETE(req: NextRequest, { params }: { params: any }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const orgId = (session.user as any).organizationId;
  const { id } = params;

  await prisma.timeEntry.deleteMany({ where: { userId: id, organizationId: orgId } });
  await prisma.activityLog.deleteMany({ where: { userId: id, organizationId: orgId } });
  await prisma.schedule.deleteMany({ where: { userId: id, organizationId: orgId } });
  await prisma.user.delete({ where: { id, organizationId: orgId } });

  return NextResponse.json({ success: true });
}`;

// Update kiosk page to pass employees with avatarColor
const kioskTokenPage = `import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import KioskClient from "@/components/kiosk/KioskClient";

export default async function KioskPage({ params }: { params: any }) {
  const { token } = params;

  const org = await prisma.organization.findUnique({ where: { id: token } });
  if (!org) notFound();

  const today = new Date(); today.setHours(0,0,0,0);

  const employees = await prisma.user.findMany({
    where: { organizationId: token, isActive: true, role: { not: "OWNER" } },
    orderBy: { name: "asc" },
  });

  const activeEntries = await prisma.timeEntry.findMany({
    where: { organizationId: token, clockOut: null, clockIn: { gte: today } },
  });
  const activeIds = new Set(activeEntries.map(e => e.userId));

  return (
    <KioskClient
      token={token}
      employees={employees.map(e => ({
        id: e.id,
        name: e.name,
        avatarColor: (e as any).avatarColor || null,
        onShift: activeIds.has(e.id),
        clockInTime: activeEntries.find(a => a.userId === e.id)?.clockIn?.toISOString() || null,
      }))}
    />
  );
}`;

writeFileSync("src/components/kiosk/KioskClient.tsx", kioskClient);
writeFileSync("src/app/api/kiosk/clock/route.ts", kioskClock);
writeFileSync("src/components/admin/EmployeeEditClient.tsx", employeeEditClient);
writeFileSync("src/app/api/employees/[id]/route.ts", employeesApi);
writeFileSync("src/app/[locale]/kiosk/[token]/page.tsx", kioskTokenPage);
console.log("Listo!");

