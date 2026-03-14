import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import AttendanceChart from "@/components/admin/AttendanceChart";
import NotificationBell from "@/components/admin/NotificationBell";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/en/login");
  
  const orgId = (session.user as any).organizationId;
  if (!orgId) redirect("/en/login");

  // Fetch con protección
  const [employees, activeEntries, periodEntries, org] = await Promise.all([
    prisma.user.findMany({ where: { organizationId: orgId, isActive: true, role: { not: "OWNER" } }, orderBy: { name: "asc" } }),
    prisma.timeEntry.findMany({ where: { organizationId: orgId, clockOut: null } }),
    prisma.timeEntry.findMany({ where: { organizationId: orgId, clockIn: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() <= 15 ? 1 : 16) } } }),
    prisma.organization.findUnique({ where: { id: orgId } }),
  ]);

  // Si no hay organización, evitamos el crash de "reading name"
  if (!org) {
    return <div className="p-10 text-white">Error: No se encontró la organización.</div>;
  }

  const activeIds = new Set(activeEntries.map(e => e.userId));
  const totalHours = Math.floor(periodEntries.reduce((a,e) => a + (e.durationMin||0), 0) / 60);
  const estimatedPayroll = periodEntries.reduce((a,e) => {
    const emp = employees.find(u => u.id === e.userId);
    return a + ((e.durationMin||0)/60) * ((emp as any)?.hourlyRate||0);
  }, 0);

  const onShiftEmps = employees.filter(e => activeIds.has(e.id));
  const offShiftEmps = employees.filter(e => !activeIds.has(e.id)).slice(0, 6);

  return (
    <div className="flex-1 overflow-y-auto" style={{background:"#030303"}}>
      <style>{`
        .apple-card { background: #0A0A0A; border: 1px solid rgba(255,255,255,0.03); border-radius: 20px; }
        .stat-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: 1.5px; }
        .btn-white { background: #FAFAFA; color: #000; padding: 8px 18px; border-radius: 12px; font-size: 12px; font-weight: 700; text-decoration: none; }
      `}</style>

      {/* Header Blindado */}
      <div style={{height:"64px", borderBottom:"1px solid rgba(255,255,255,0.04)", padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <div>
          <h1 style={{fontFamily:"var(--font-syne)", fontWeight:700, fontSize:"14px", color:"white"}}>Dashboard</h1>
          <p style={{fontSize:"11px", color:"rgba(255,255,255,0.25)"}}>{org.name || "Cargando..."}</p>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
          <NotificationBell orgId={orgId} />
          <Link href="/en/admin/employees/new" className="btn-white">+ Empleado</Link>
        </div>
      </div>

      <div style={{padding:"24px", display:"flex", flexDirection:"column", gap:"20px"}}>
        <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px"}}>
          <div className="apple-card p-5">
            <p className="stat-label">Empleados activos</p>
            <p className="text-2xl font-bold">{employees.length}</p>
          </div>
          <div className="apple-card p-5">
            <p className="stat-label">En turno ahora</p>
            <p className="text-2xl font-bold text-[#34D399]">{activeEntries.length}</p>
          </div>
          <div className="apple-card p-5">
            <p className="stat-label">Horas quincena</p>
            <p className="text-2xl font-bold text-[#D4AF37]">{totalHours}h</p>
          </div>
          <div className="apple-card p-5">
            <p className="stat-label">Nómina estimada</p>
            <p className="text-2xl font-bold text-[#D4AF37]">${estimatedPayroll.toLocaleString()}</p>
          </div>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"1fr 280px", gap:"20px"}}>
           <div className="apple-card p-6">
             <AttendanceChart />
           </div>
           <div className="apple-card p-4">
              <p className="stat-label mb-4">Acciones</p>
              <div className="flex flex-col gap-2">
                <Link href="/en/admin/kiosk" className="text-sm text-white/40 hover:text-white">Abrir Kiosk</Link>
                <Link href="/en/admin/settings" className="text-sm text-white/40 hover:text-white">Configuración</Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}