import { writeFileSync, mkdirSync } from "fs";

// ==================== ADD PushRegister to Settings page ====================
const settingsPage = `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/admin/SettingsClient";
import PushRegister from "@/components/PushRegister";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/en/login");
  const orgId = (session.user as any).organizationId;

  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  const createdAt = org?.createdAt ? new Date(org.createdAt) : new Date();
  const daysSince = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, 7 - daysSince);
  const isPro = !!(org as any)?.isPro;

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center bg-[var(--bg-primary)]">
        <div>
          <h1 className="text-sm font-black text-[var(--text-primary)]">Settings</h1>
          <p className="text-xs text-[var(--text-muted)]">Configuración de tu cuenta y empresa</p>
        </div>
      </div>
      <div className="p-6 max-w-xl space-y-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[var(--border)]">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Notificaciones push</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Recibe alertas de tardanzas y ausencias en tu dispositivo</p>
          </div>
          <div className="p-5">
            <PushRegister />
          </div>
        </div>
        <SettingsClient org={{ name: org?.name, alertEmail: (org as any)?.alertEmail }} isPro={isPro} daysLeft={daysLeft} />
      </div>
    </div>
  );
}`;

// ==================== AVATAR UPLOAD API ====================
const avatarApi = `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const orgId = (session.user as any).organizationId;

  const { userId, avatarUrl, avatarColor } = await req.json();

  const user = await prisma.user.findFirst({ where: { id: userId, organizationId: orgId } });
  if (!user) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl, avatarColor } as any,
  });

  return NextResponse.json({ success: true });
}`;

// ==================== UPDATE EMPLOYEE EDIT PAGE with avatar ====================
const employeeEdit = `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ScheduleEditor from "@/components/admin/ScheduleEditor";
import EmployeeEditClient from "@/components/admin/EmployeeEditClient";

export default async function EmployeeEditPage({ params }: { params: any }) {
  const session = await auth();
  if (!session) redirect("/en/login");
  const orgId = (session.user as any).organizationId;
  const { id } = params;

  const employee = await prisma.user.findFirst({
    where: { id, organizationId: orgId },
  });

  if (!employee) redirect("/en/admin/dashboard");

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center bg-[var(--bg-primary)]">
        <div>
          <h1 className="text-sm font-black text-[var(--text-primary)]">Editar empleado</h1>
          <p className="text-xs text-[var(--text-muted)]">{employee.name}</p>
        </div>
      </div>
      <div className="p-6 space-y-4 max-w-2xl">
        <EmployeeEditClient employee={{
          id: employee.id,
          name: employee.name,
          email: employee.email,
          role: employee.role,
          hourlyRate: (employee as any).hourlyRate || 0,
          isActive: employee.isActive,
          avatarUrl: (employee as any).avatarUrl || null,
          avatarColor: (employee as any).avatarColor || null,
        }} />
        <ScheduleEditor userId={employee.id} employeeName={employee.name} />
      </div>
    </div>
  );
}`;

// ==================== EMPLOYEE EDIT CLIENT with avatar ====================
const employeeEditClient = `"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const COLORS = ["#E8B84B","#60A5FA","#34D399","#F87171","#A78BFA","#FB923C","#38BDF8","#4ADE80","#E879F9","#94A3B8"];

export default function EmployeeEditClient({ employee }: { employee: any }) {
  const router = useRouter();
  const [name, setName] = useState(employee.name);
  const [email, setEmail] = useState(employee.email);
  const [hourlyRate, setHourlyRate] = useState(employee.hourlyRate);
  const [isActive, setIsActive] = useState(employee.isActive);
  const [avatarColor, setAvatarColor] = useState(employee.avatarColor || "#E8B84B");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    setSaving(true);
    const res = await fetch(\`/api/employees/\${employee.id}\`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, hourlyRate: Number(hourlyRate), isActive }),
    });
    // Save avatar color
    await fetch("/api/employees/avatar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: employee.id, avatarColor }),
    });
    setMsg(res.ok ? "✓ Guardado" : "Error al guardar");
    setSaving(false);
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

mkdirSync("src/app/api/employees/avatar", { recursive: true });

writeFileSync("src/app/[locale]/admin/settings/page.tsx", settingsPage);
writeFileSync("src/app/api/employees/avatar/route.ts", avatarApi);
writeFileSync("src/app/[locale]/admin/employees/[id]/page.tsx", employeeEdit);
writeFileSync("src/components/admin/EmployeeEditClient.tsx", employeeEditClient);
console.log("Listo!");

