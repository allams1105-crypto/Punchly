import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation"; // Agregado
import Link from "next/link";
import AttendanceChart from "@/components/admin/AttendanceChart";
import NotificationBell from "@/components/admin/NotificationBell";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/en/login");
  
  const orgId = (session.user as any).organizationId as string;

  // Fetch de datos con protección
  const [employees, activeEntries, periodEntries, org] = await Promise.all([
    prisma.user.findMany({ where: { organizationId: orgId, isActive: true, role: { not: "OWNER" } }, orderBy: { name: "asc" } }),
    prisma.timeEntry.findMany({ where: { organizationId: orgId, clockOut: null } }),
    prisma.timeEntry.findMany({ 
      where: { 
        organizationId: orgId, 
        clockIn: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() <= 15 ? 1 : 16) } 
      } 
    }),
    prisma.organization.findUnique({ where: { id: orgId } }),
  ]);

  // Si no hay organización, evitamos que la página se quede en blanco o dé error 500
  if (!org) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#030303] text-white/20 font-syne text-xs tracking-widest uppercase">
        Organización no encontrada
      </div>
    );
  }

  const activeIds = new Set(activeEntries.map(e => e.userId));
  const totalHours = Math.floor(periodEntries.reduce((a,e) => a + (e.durationMin||0), 0) / 60);
  const estimatedPayroll = periodEntries.reduce((a,e) => {
    const emp = employees.find(u => u.id === e.userId);
    return a + ((e.durationMin||0)/60) * ((emp as any)?.hourlyRate||0);
  }, 0);

  const onShiftEmps = employees.filter(e => activeIds.has(e.id));
  const gold = "#D4AF37";

  return (
    <div className="flex-1 overflow-y-auto" style={{background:"#030303", color: "white"}}>
      <style>{`
        .apple-card { background: #0A0A0A; border: 1px solid rgba(255,255,255,0.03); border-radius: 20px; }
        .stat-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: 1.5px; }
        .btn-white { background: #FAFAFA; color: #000; padding: 8px 18px; border-radius: 12px; font-size: 12px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; }
        .action-link { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 14px; text-decoration: none; color: rgba(255,255,255,0.4); font-size: 13px; font-weight: 600; }
        .action-link:hover { background: rgba(255,255,255,0.05); color: #FFF; }
      `}</style>

      {/* Header */}
      <div style={{height:"64px", borderBottom:"1px solid rgba(255,255,255,0.04)", padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <div>
          <h1 style={{fontFamily:"var(--font-syne)", fontWeight:700, fontSize:"14px"}}>Dashboard</h1>
          <p style={{fontSize:"11px", color:"rgba(255,255,255,0.25)"}}>
            {org?.name || "Cargando..."}
          </p>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
          <NotificationBell orgId={orgId} />
          <Link href="/en/admin/employees/new" className="btn-white">+ Empleado</Link>
        </div>
      </div>

      <div style={{padding:"24px", display:"flex", flexDirection:"column", gap:"20px", maxWidth:"1400px", margin:"0 auto"}}>
        <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px"}}>
          {[
            {label:"Empleados activos", value:employees.length, sub:"en nómina", color:"#FFF"},
            {label:"En turno ahora", value:activeEntries.length, sub:"trabajando", color:"#34D399"},
            {label:"Horas quincena", value:totalHours+"h", sub:"período actual", color:gold},
            {label:"Nómina estimada", value:"$"+estimatedPayroll.toLocaleString(), sub:"este período", color:gold},
          ].map(k=>(
            <div key={k.label} className="apple-card" style={{padding:"20px"}}>
              <p className="stat-label" style={{marginBottom:"8px"}}>{k.label}</p>
              <p style={{fontFamily:"var(--font-syne)", fontSize:"28px", fontWeight:800, color:k.color}}>{k.value}</p>
              <p style={{fontSize:"11px", color:"rgba(255,255,255,0.15)", marginTop:"6px"}}>{k.sub}</p>
            </div>
          ))}
        </div>

        <div style={{display:"grid", gridTemplateColumns:"1fr 280px", gap:"20px"}}>
          <div className="flex flex-col gap-5">
            <div className="apple-card p-6">
              <AttendanceChart />
            </div>
            
            <div className="apple-card overflow-hidden">
               <div className="p-4 border-b border-white/5 flex justify-between">
                 <p className="stat-label">En turno ahora</p>
                 <span className="text-[10px] text-[#34D399] font-bold">{onShiftEmps.length} ONLINE</span>
               </div>
               {onShiftEmps.length === 0 ? (
                 <p className="p-10 text-center text-white/10 text-xs">Nadie en turno ahora</p>
               ) : onShiftEmps.map(emp => (
                 <div key={emp.id} className="p-4 border-b border-white/5 flex justify-between items-center">
                   <span className="text-sm font-semibold">{emp.name}</span>
                   <span className="text-xs font-bold" style={{color:gold}}>Activo</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="apple-card p-2">
              <p className="stat-label p-3">Acciones</p>
              <Link href="/en/admin/employees" className="action-link">Personal</Link>
              <Link href="/en/admin/kiosk" className="action-link">Abrir Kiosk</Link>
              <Link href="/en/admin/payroll" className="action-link">Nómina</Link>
              <Link href="/en/admin/settings" className="action-link">Configuración</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}