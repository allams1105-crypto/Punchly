import { writeFileSync, readFileSync, mkdirSync } from "fs";

// 1. New employee page with PIN field
const newEmployeePage = `"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";

export default function NewEmployeePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [kioskPin, setKioskPin] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    if (!name || !email) { setError("Nombre y email son requeridos"); return; }
    if (kioskPin && kioskPin.length !== 4) { setError("El PIN debe tener 4 dígitos"); return; }
    setSaving(true); setError("");
    const res = await fetch("/api/employees/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, hourlyRate: Number(hourlyRate) || 0, kioskPin }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || "Error al crear empleado"); return; }
    router.push("/en/admin/employees");
  }

  return (
    <div className="flex-1 overflow-y-auto" style={{background:"#0A0A0A"}}>
      <div className="h-14 flex items-center justify-between px-6" style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <h1 className="text-sm font-bold text-white" style={{fontFamily:"var(--font-syne)"}}>Nuevo Empleado</h1>
      </div>
      <div className="max-w-md mx-auto p-6">
        <div className="rounded-2xl overflow-hidden" style={{background:"rgba(255,255,255,0.04)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.08)"}}>
          <div className="px-6 py-4" style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
            <h2 className="text-sm font-bold text-white" style={{fontFamily:"var(--font-syne)"}}>Datos del empleado</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              {label:"Nombre completo", value:name, set:setName, placeholder:"Juan Pérez", type:"text"},
              {label:"Email", value:email, set:setEmail, placeholder:"juan@empresa.com", type:"email"},
              {label:"Tarifa por hora ($)", value:hourlyRate, set:setHourlyRate, placeholder:"15.00", type:"number"},
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{color:"rgba(255,255,255,0.3)", fontFamily:"var(--font-dm-sans)"}}>{f.label}</label>
                <input type={f.type} value={f.value} onChange={e=>f.set(e.target.value)} placeholder={f.placeholder}
                  className="w-full text-white text-sm focus:outline-none transition"
                  style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", padding:"10px 14px", fontFamily:"var(--font-dm-sans)"}}
                  onFocus={e=>{e.currentTarget.style.border="1px solid rgba(201,168,76,0.4)"}}
                  onBlur={e=>{e.currentTarget.style.border="1px solid rgba(255,255,255,0.08)"}} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{color:"rgba(255,255,255,0.3)", fontFamily:"var(--font-dm-sans)"}}>PIN del Kiosk (4 dígitos)</label>
              <input type="password" value={kioskPin} onChange={e=>setKioskPin(e.target.value.replace(/\\D/g,"").substring(0,4))}
                placeholder="1234" maxLength={4}
                className="w-full text-white text-sm focus:outline-none transition"
                style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", padding:"10px 14px", fontFamily:"var(--font-dm-sans)"}}
                onFocus={e=>{e.currentTarget.style.border="1px solid rgba(201,168,76,0.4)"}}
                onBlur={e=>{e.currentTarget.style.border="1px solid rgba(255,255,255,0.08)"}} />
              <p className="text-xs mt-1.5" style={{color:"rgba(255,255,255,0.2)", fontFamily:"var(--font-dm-sans)"}}>El empleado usará este PIN para fichar en el kiosk</p>
            </div>

            {error && <p className="text-sm" style={{color:"#F87171", fontFamily:"var(--font-dm-sans)"}}>{error}</p>}

            <div className="flex gap-3 pt-2">
              <button onClick={()=>router.back()}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition"
                style={{border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.4)", fontFamily:"var(--font-dm-sans)"}}>
                Cancelar
              </button>
              <button onClick={save} disabled={saving}
                className="flex-1 py-3 rounded-xl text-sm font-bold transition disabled:opacity-40"
                style={{background:"linear-gradient(135deg,#C9A84C,#F0D080)", color:"#000", fontFamily:"var(--font-syne)"}}>
                {saving ? "Guardando..." : "Crear empleado"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;

// 2. Create employee API
mkdirSync("src/app/api/employees/create", { recursive: true });
writeFileSync("src/app/api/employees/create/route.ts", `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const orgId = (session.user as any).organizationId;
    const { name, email, hourlyRate, kioskPin } = await req.json();
    
    const pin = await bcrypt.hash("0000", 10); // default login pin
    const data: any = { name, email, hourlyRate, organizationId: orgId, pin };
    if (kioskPin && kioskPin.length === 4) {
      data.kioskPin = await bcrypt.hash(kioskPin, 10);
    }

    const user = await prisma.user.create({ data });
    await prisma.activityLog.create({
      data: { organizationId: orgId, userId: user.id, userName: user.name, action: "EMPLOYEE_CREATED", details: "Empleado creado" }
    });
    return NextResponse.json({ user });
  } catch (e: any) {
    if (e.code === "P2002") return NextResponse.json({ error: "Ya existe un empleado con ese email" }, { status: 400 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}`);

// 3. Verify trial block in admin layout
let adminLayout = readFileSync("src/app/[locale]/admin/layout.tsx", "utf8");
if (!adminLayout.includes("trialEnded") && !adminLayout.includes("paywall")) {
  console.log("WARNING: Admin layout may not have trial block - checking...");
  console.log(adminLayout.substring(0, 500));
} else {
  console.log("Trial block OK");
}

writeFileSync("src/app/[locale]/admin/employees/new/page.tsx", newEmployeePage);
console.log("Listo!");

