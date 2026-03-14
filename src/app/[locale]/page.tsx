import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import AttendanceChart from "@/components/admin/AttendanceChart";
import NotificationBell from "@/components/admin/NotificationBell";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/en/login");
  const orgId = (session.user as any).organizationId as string;

  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() <= 15 ? 1 : 16);
  const todayStart = new Date(now); todayStart.setHours(0,0,0,0);

  const [employees, activeEntries, periodEntries, org] = await Promise.all([
    prisma.user.findMany({ where: { organizationId: orgId, isActive: true, role: { not: "OWNER" } }, orderBy: { name: "asc" } }),
    prisma.timeEntry.findMany({ where: { organizationId: orgId, clockOut: null } }),
    prisma.timeEntry.findMany({ where: { organizationId: orgId, clockIn: { gte: periodStart } } }),
    prisma.organization.findUnique({ where: { id: orgId } }),
  ]);

  const activeIds = new Set(activeEntries.map(e => e.userId));
  const totalHours = Math.floor(periodEntries.reduce((a,e) => a + (e.durationMin||0), 0) / 60);
  const estimatedPayroll = periodEntries.reduce((a,e) => {
    const emp = employees.find(u => u.id === e.userId);
    return a + ((e.durationMin||0)/60) * ((emp as any)?.hourlyRate||0);
  }, 0);

  const onShiftEmps = employees.filter(e => activeIds.has(e.id));
  const offShiftEmps = employees.filter(e => !activeIds.has(e.id)).slice(0, 6);

  const gold = "#D4AF37";

  return (
    <div className="flex-1 overflow-y-auto" style={{background:"#030303"}}>
      <style>{`
        .apple-card { background: #0A0A0A; border: 1px solid rgba(255,255,255,0.03); border-radius: 20px; transition: all 0.2s ease; }
        .stat-label { font-family: var(--font-dm-sans); font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: 1.5px; }
        .stat-value { font-family: var(--font-syne); font-size: 28px; font-weight: 800; color: #FAFAFA; line-height: 1; }
        .btn-white { background: #FAFAFA; color: #000; padding: 8px 18px; border-radius: 12px; font-size: 12px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; }
        .action-link { transition: all 0.2s ease; display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 14px; text-decoration: none; color: rgba(255,255,255,0.3); font-size: 13px; font-weight: 600; background: #0A0A0A; border: 1px solid rgba(255,255,255,0.03); }
        .action-link:hover { background: rgba(255,255,255,0.05); color: #FAFAFA; }
      `}</style>

      {/* Header Original */}
      <div style={{height:"64px", borderBottom:"1px solid rgba(255,255,255,0.04)", padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <div>
          <h1 style={{fontFamily:"var(--font-syne)", fontWeight:700, fontSize:"14px", color:"white"}}>Dashboard</h1>
          <p style={{fontFamily:"var(--font-dm-sans)", fontSize:"11px", color:"rgba(255,255,255,0.25)", marginTop:"1px"}}>{(org as any)?.name}</p>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
          <NotificationBell orgId={orgId} />
          <Link href="/en/admin/employees/new" className="btn-white font-syne">
            + Empleado
          </Link>
        </div>
      </div>

      <div style={{padding:"24px", display:"flex", flexDirection:"column", gap:"20px", maxWidth:"1400px", margin:"0 auto"}}>
        {/* KPIs con tus nombres originales */}
        <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px"}}>
          {[
            {label:"Empleados activos", value:employees.length, sub:"en nómina", color:"rgba(255,255,255,0.9)"},
            {label:"En turno ahora", value:activeEntries.length, sub:"trabajando", color:"#34D399", isLive: true},
            {label:"Horas quincena", value:totalHours+"h", sub:"período actual", color:gold},
            {label:"Nómina estimada", value:"$"+estimatedPayroll.toLocaleString("en",{maximumFractionDigits:0}), sub:"este período", color:gold},
          ].map(k=>(
            <div key={k.label} className="apple-card" style={{padding:"20px", position:"relative"}}>
              {k.isLive && <div style={{position:"absolute", top:"20px", right:"20px", width:"6px", height:"6px", background:"#34D399", borderRadius:"50%", boxShadow:"0 0 10px #34D399"}} />}
              <p className="stat-label" style={{marginBottom:"10px"}}>{k.label}</p>
              <p className="stat-value" style={{color:k.color}}>{k.value}</p>
              <p style={{fontFamily:"var(--font-dm-sans)", fontSize:"11px", color:"rgba(255,255,255,0.15)", marginTop:"6px"}}>{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 280px", gap:"20px"}}>
          <div style={{display:"flex", flexDirection:"column", gap:"16px"}}>
            {/* Chart */}
            <div className="apple-card" style={{overflow:"hidden"}}>
              <div style={{padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                <p className="stat-label" style={{color:"white"}}>Asistencia — últimos 7 días</p>
              </div>
              <div style={{padding:"24px"}}>
                <AttendanceChart />
              </div>
            </div>

            {/* On shift - Texto Original */}
            <div className="apple-card" style={{overflow:"hidden"}}>
              <div style={{padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                <p className="stat-label" style={{color:"white"}}>En turno ahora</p>
                <span style={{fontFamily:"var(--font-dm-sans)", fontSize:"11px", color:"#34D399", fontWeight:700}}>{onShiftEmps.length} activos</span>
              </div>
              {onShiftEmps.length === 0 ? (
                <div style={{padding:"32px", textAlign:"center"}}>
                  <p style={{fontFamily:"var(--font-dm-sans)", fontSize:"13px", color:"rgba(255,255,255,0.15)"}}>Nadie en turno ahora</p>
                </div>
              ) : (
                onShiftEmps.map(emp => {
                  const entry = activeEntries.find(e => e.userId === emp.id);
                  const mins = entry ? Math.floor((now.getTime() - entry.clockIn.getTime())/60000) : 0;
                  return (
                    <div key={emp.id} style={{padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.02)", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                      <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
                        <div style={{width:"32px", height:"32px", borderRadius:"8px", background:"#111", border:"1px solid rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"center", color:gold, fontWeight:800, fontSize:"12px"}}>
                          {(emp.name||"?").charAt(0)}
                        </div>
                        <div>
                          <p style={{fontWeight:600, fontSize:"13px", color:"white"}}>{emp.name}</p>
                          <p style={{fontSize:"10px", color:"rgba(255,255,255,0.2)"}}>Entrada: {entry?.clockIn.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}</p>
                        </div>
                      </div>
                      <p style={{fontFamily:"var(--font-syne)", fontWeight:700, fontSize:"14px", color:gold}}>{Math.floor(mins/60)}h {mins%60}m</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Sidebar Original */}
          <div style={{display:"flex", flexDirection:"column", gap:"16px"}}>
            <div className="apple-card" style={{padding:"8px"}}>
              <p className="stat-label" style={{padding:"12px 8px 8px", color:"white"}}>Acciones</p>
              {[
                {href:"/en/admin/employees/new",label:"Nuevo empleado"},
                {href:"/en/admin/employees",label:"Ver empleados"},
                {href:"/en/admin/kiosk",label:"Abrir Kiosk"},
                {href:"/en/admin/payroll",label:"Nómina"},
                {href:"/en/admin/attendance",label:"Asistencia"},
                {href:"/en/admin/activity",label:"Actividad"},
                {href:"/en/admin/settings",label:"Configuración"},
              ].map(a=>(
                <Link key={a.href} href={a.href} className="action-link">
                  <div style={{width:"6px", height:"6px", background:gold, borderRadius:"50%", opacity:0.4}} />
                  {a.label}
                </Link>
              ))}
            </div>

            {/* Fuera de turno - Texto Original */}
            {offShiftEmps.length > 0 && (
              <div className="apple-card" style={{padding:"8px"}}>
                <p className="stat-label" style={{padding:"12px 8px 8px", color:"white"}}>Fuera de turno</p>
                {offShiftEmps.map(emp=>(
                  <div key={emp.id} style={{padding:"8px 12px", display:"flex", alignItems:"center", gap:"10px"}}>
                    <div style={{width:"24px", height:"24px", borderRadius:"6px", background:"#111", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(255,255,255,0.2)", fontSize:"10px", fontWeight:800}}>
                      {(emp.name||"?").charAt(0)}
                    </div>
                    <p style={{fontSize:"12px", color:"rgba(255,255,255,0.35)"}}>{emp.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}