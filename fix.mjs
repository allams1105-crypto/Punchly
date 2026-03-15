import { writeFileSync, readFileSync } from "fs";

let kiosk = readFileSync("src/components/kiosk/KioskClient.tsx", "utf8");

// Add auto-refresh after successful clock in/out
kiosk = kiosk.replace(
  `  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Employee|null>(null);
  const [step, setStep] = useState<Step>("list");
  const [pin, setPin] = useState("");
  const [action, setAction] = useState<"in"|"out">("in");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");`,
  `  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Employee|null>(null);
  const [step, setStep] = useState<Step>("list");
  const [pin, setPin] = useState("");
  const [action, setAction] = useState<"in"|"out">("in");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [emps, setEmps] = useState<Employee[]>(employees);`
);

// Update filtered and onShiftNow to use emps
kiosk = kiosk.replace(
  `  const filtered = employees.filter(e=>(e.name||"").toLowerCase().includes((search||"").toLowerCase()));
  const onShiftNow = employees.filter(e=>e.onShift);`,
  `  const filtered = emps.filter(e=>(e.name||"").toLowerCase().includes((search||"").toLowerCase()));
  const onShiftNow = emps.filter(e=>e.onShift);`
);

// Add refresh function and update after clock
kiosk = kiosk.replace(
  `  async function confirmPin(){`,
  `  async function refreshEmployees() {
    try {
      const res = await fetch(\`/api/kiosk/employees?orgId=\${token}\`);
      const data = await res.json();
      if (data.employees) setEmps(data.employees);
    } catch(e) {}
  }

  async function confirmPin(){`
);

// Call refresh after success
kiosk = kiosk.replace(
  `    setSuccessMsg(action==="in"?"Entrada registrada":"Salida registrada");
    setStep("success");
    setTimeout(()=>{setStep("list");setSelected(null);setPin("");setSearch("");setSuccessMsg("");},3000);`,
  `    setSuccessMsg(action==="in"?"Entrada registrada":"Salida registrada");
    setStep("success");
    await refreshEmployees();
    setTimeout(()=>{setStep("list");setSelected(null);setPin("");setSearch("");setSuccessMsg("");},3000);`
);

writeFileSync("src/components/kiosk/KioskClient.tsx", kiosk);

// Create kiosk employees API
const { mkdirSync } = await import("fs");
mkdirSync("src/app/api/kiosk/employees", { recursive: true });
writeFileSync("src/app/api/kiosk/employees/route.ts", `import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("orgId");
    if (!orgId) return NextResponse.json({ error: "Missing orgId" }, { status: 400 });

    const today = new Date(); today.setHours(0,0,0,0);

    const [employees, activeEntries] = await Promise.all([
      prisma.user.findMany({
        where: { organizationId: orgId, isActive: true, role: { not: "OWNER" } },
        orderBy: { name: "asc" },
      }),
      prisma.timeEntry.findMany({
        where: { organizationId: orgId, clockOut: null, clockIn: { gte: today } },
      }),
    ]);

    const activeIds = new Set(activeEntries.map(e => e.userId));

    return NextResponse.json({
      employees: employees.map(e => ({
        id: e.id,
        name: e.name || "",
        avatarColor: (e as any).avatarColor || null,
        onShift: activeIds.has(e.id),
        clockInTime: activeEntries.find(a => a.userId === e.id)?.clockIn?.toISOString() || null,
      }))
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}`);

console.log("Listo!");

