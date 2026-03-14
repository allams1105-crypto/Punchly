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
        .apple-card:hover { border-color: rgba(255,255,255,0.08); background: #0D0D0D; }
        .stat-label { font-family: var(--font-dm-sans); font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: 1.5px; }
        .stat-value { font-family: var(--font-syne); font-size: 32px; font-weight: 800; letter-spacing: -1.5px; color: #FAFAFA; }
        .btn-white { background: #FAFAFA; color: #000; padding: 8px 18px; border-radius: 12px; font-size: 12px; font-weight: 700; transition: 0.2s; text-decoration: none; display: inline-flex; align-items: center; }
        .btn-white:hover { opacity: 0.9; transform: scale(1.02); }
        .nav-link { transition: all 0.2s ease; display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-radius: 14px; text-decoration: none; color: rgba(255,255,255,0.3); font-size: 13px; font-weight: 600; background: #0A0A0A; border: 1px solid rgba(255,255,255,0.03); }
        .nav-link:hover { color: #FAFAFA; border-color: rgba(255,255,255,0.1); background: #111; }
        .active-dot { width: 6px; height: 6px; background: #34D399; border-radius: 50%; box-shadow: 0 0 10px #34D399; }
      `}</style>

      {/* Top Header */}
      <header style={{height:"80px", borderBottom:"1px solid rgba(255,255,255,0.04)", padding:"0 40px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <div>
          <h1 style={{fontFamily:"var(--font-syne)", fontWeight:800, fontSize:"20px", color:"#FAFAFA", letterSpacing:"-1px"}}>Dashboard</h1>
          <p style={{fontFamily:"var(--font-dm-sans)", fontSize:"11px", color:"rgba(255,255,255,0.2)", fontWeight:600}}>{(org as any)?.name} · Hub</p>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:"16px"}}>
          <NotificationBell orgId={orgId} />
          <Link href="/en/admin/employees/new" className="btn-white font-syne">+ Empleado</Link>
        </div>
      </header>

      <div style={{padding:"40px", display:"flex", flexDirection:"column", gap:"32px", maxWidth:"1400px", margin:"0 auto"}}>
        
        {/* KPI Row */}
        <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px"}}>
          {[
            {label:"Staff Activo", value:employees.length, detail:"En nómina"},
            {label:"En Turno", value:activeEntries.length, detail:"Trabajando ahora", isLive: true},
            {label:"Horas Totales", value:totalHours+"h", detail:"Período actual", isGold: true},
            {label:"Nómina", value:"$"+estimatedPayroll.toLocaleString("en",{maximumFractionDigits:0}), detail:"Estimado quincena", isGold: true},
          ].map(k=>(
            <div key={k.label} className="apple-card" style={{padding:"24px", position:"relative"}}>
              {k.isLive && <div className="active-dot" style={{position:"absolute", top:"24px", right:"24px"}} />}
              <p className="stat-label" style={{marginBottom:"12px"}}>{k.label}</p>
              <p className="stat-value" style={{color: k.isGold ? gold : "#FAFAFA"}}>{k.value}</p>
              <p style={{fontSize:"10px", color:"rgba(255,255,255,0.1)", fontWeight:700, marginTop:"6px"}}>{k.detail}</p>
            </div>
          ))}
        </div>

        {/* Main Section */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 300px", gap:"32px"}}>
          
          <div style={{display:"flex", flexDirection:"column", gap:"32px"}}>
            {/* Chart */}
            <div className="apple-card" style={{padding:"32px"}}>
              <p className="stat-label" style={{marginBottom:"24px"}}>Asistencia Semanal</p>
              <div style={{height:"300px"}}>
                <AttendanceChart />
              </div>
            </div>

            {/* List On Shift */}
            <div className="apple-card" style={{overflow:"hidden"}}>
              <div style={{padding:"20px 24px", borderBottom:"1px solid rgba(255,255,255,0.03)", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                <p className="stat-label">En turno ahora</p>
                <span style={{fontSize:"10px", color:"#34D399", fontWeight:800}}>{onShiftEmps.length} ONLINE</span>
              </div>
              {onShiftEmps.length === 0 ? (
                <div style={{padding:"40px", textAlign:"center"}}>
                  <p style={{fontSize:"12px", color:"rgba(255,255,255,0.15)", fontWeight:600}}>Silencio en la oficina</p>
                </div>
              ) : (
                <div style={{display:"flex", flexDirection:"column"}}>
                  {onShiftEmps.map(emp => {
                    const entry = activeEntries.find(e => e.userId === emp.id);
                    const mins = entry ? Math.floor((now.getTime() - entry.clockIn.getTime())/60000) : 0;
                    return (
                      <div key={emp.id} style={{padding:"16px 24px", borderBottom:"1px solid rgba(255,255,255,0.02)", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                        <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
                          <div style={{width:"32px", height:"32px", borderRadius:"10px", background:"#111", border:"1px solid rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"center", color:"#FAFAFA", fontSize:"12px", fontWeight:800}}>
                            {(emp.name||"?").charAt(0)}
                          </div>
                          <div>
                            <p style={{fontSize:"13px", fontWeight:700, color:"#FAFAFA"}}>{emp.name}</p>
                            <p style={{fontSize:"10px", color:"rgba(255,255,255,0.2)"}}>In: {entry?.clockIn.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}</p>
                          </div>
                        </div>
                        <p style={{fontFamily:"var(--font-syne)", fontWeight:800, fontSize:"14px", color:gold}}>
                          {Math.floor(mins/60)}h {mins%60}m
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div style={{display:"flex", flexDirection:"column", gap:"32px"}}>
            <div>
              <p className="stat-label" style={{marginBottom:"16px", paddingLeft:"8px"}}>Navegación</p>
              <nav style={{display:"flex", flexDirection:"column", gap:"8px"}}>
                {[
                  {href:"/en/admin/employees",label:"Personal"},
                  {href:"/en/admin/kiosk",label:"Kiosk PIN"},
                  {href:"/en/admin/payroll",label:"Nómina"},
                  {href:"/en/admin/attendance",label:"Reportes"},
                  {href:"/en/admin/activity",label:"Bitácora"},
                  {href:"/en/admin/settings",label:"Ajustes"},
                ].map(a=>(
                  <Link key={a.href} href={a.href} className="nav-link group">
                    {a.label}
                    <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Off shift */}
            {offShiftEmps.length > 0 && (
              <div>
                <p className="stat-label" style={{marginBottom:"16px", paddingLeft:"8px"}}>Fuera de turno</p>
                <div className="apple-card" style={{padding:"8px"}}>
                  {offShiftEmps.map(emp=>(
                    <div key={emp.id} style={{padding:"10px 12px", display:"flex", alignItems:"center", gap:"10px"}}>
                      <div style={{width:"24px", height:"24px", borderRadius:"6px", background:"#111", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(255,255,255,0.2)", fontSize:"10px", fontWeight:800}}>
                        {(emp.name||"?").charAt(0)}
                      </div>
                      <p style={{fontSize:"12px", color:"rgba(255,255,255,0.3)", fontWeight:600}}>{emp.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}