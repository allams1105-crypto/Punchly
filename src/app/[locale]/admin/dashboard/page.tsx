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

  return (
    <div className="flex-1 overflow-y-auto" style={{background:"#0A0A0A",backgroundImage:"radial-gradient(ellipse at 20% 0%, rgba(201,168,76,0.05) 0%, transparent 50%)"}}>
      <style>{`
        .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)}
        .glass-gold{background:rgba(201,168,76,0.08);backdrop-filter:blur(20px);border:1px solid rgba(201,168,76,0.2)}
        .gold-text{background:linear-gradient(135deg,#C9A84C,#F0D080);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .kpi-card{transition:all 0.3s cubic-bezier(0.34,1.2,0.64,1)}
        .kpi-card:hover{transform:translateY(-3px);border-color:rgba(201,168,76,0.2)!important}
        .emp-row{transition:all 0.2s ease}
        .emp-row:hover{background:rgba(255,255,255,0.05)!important}
        .action-link{transition:all 0.2s ease;display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;text-decoration:none;color:rgba(255,255,255,0.4);font-size:13px}
        .action-link:hover{background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.9)}
      `}</style>

      {/* Header */}
      <div style={{height:"56px",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <h1 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:"white"}}>Dashboard</h1>
          <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:"rgba(255,255,255,0.25)",marginTop:"1px"}}>{(org as any)?.name}</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <NotificationBell orgId={orgId} />
          <Link href="/en/admin/employees/new" style={{background:"linear-gradient(135deg,#C9A84C,#F0D080)",color:"#000",padding:"7px 16px",borderRadius:"12px",fontSize:"12px",fontFamily:"var(--font-syne)",fontWeight:700,textDecoration:"none"}}>
            + Empleado
          </Link>
        </div>
      </div>

      <div style={{padding:"24px",display:"flex",flexDirection:"column",gap:"20px"}}>
        {/* KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px"}}>
          {[
            {label:"Empleados activos", value:employees.length, sub:"en nómina", color:"rgba(255,255,255,0.9)"},
            {label:"En turno ahora", value:activeEntries.length, sub:"trabajando", color:"#34D399"},
            {label:"Horas quincena", value:totalHours+"h", sub:"período actual", color:"#C9A84C"},
            {label:"Nómina estimada", value:"$"+estimatedPayroll.toLocaleString("en",{maximumFractionDigits:0}), sub:"este período", color:"#C9A84C"},
          ].map(k=>(
            <div key={k.label} className="glass kpi-card" style={{borderRadius:"20px",padding:"20px"}}>
              <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:"rgba(255,255,255,0.25)",marginBottom:"10px",textTransform:"uppercase",letterSpacing:"1px"}}>{k.label}</p>
              <p style={{fontFamily:"var(--font-syne)",fontSize:"28px",fontWeight:800,color:k.color,lineHeight:1}}>{k.value}</p>
              <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:"rgba(255,255,255,0.2)",marginTop:"6px"}}>{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:"20px"}}>
          <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
            {/* Chart */}
            <div className="glass" style={{borderRadius:"20px",overflow:"hidden"}}>
              <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <p style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"13px",color:"white"}}>Asistencia — últimos 7 días</p>
              </div>
              <div style={{padding:"16px"}}>
                <AttendanceChart />
              </div>
            </div>

            {/* On shift */}
            <div className="glass" style={{borderRadius:"20px",overflow:"hidden"}}>
              <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <p style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"13px",color:"white"}}>En turno ahora</p>
                <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                  <div style={{width:"6px",height:"6px",background:"#34D399",borderRadius:"50%",animation:"pulse 2s infinite"}} />
                  <span style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:"#34D399"}}>{onShiftEmps.length} activos</span>
                </div>
              </div>
              {onShiftEmps.length === 0 ? (
                <div style={{padding:"32px",textAlign:"center"}}>
                  <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"13px",color:"rgba(255,255,255,0.2)"}}>Nadie en turno ahora</p>
                </div>
              ) : onShiftEmps.map(emp => {
                const entry = activeEntries.find(e => e.userId === emp.id);
                const mins = entry ? Math.floor((now.getTime() - entry.clockIn.getTime())/60000) : 0;
                const h = Math.floor(mins/60), m = mins%60;
                return (
                  <div key={emp.id} className="emp-row" style={{padding:"12px 20px",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                      <div style={{width:"36px",height:"36px",borderRadius:"10px",background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-syne)",fontWeight:700,color:"#34D399",fontSize:"13px"}}>
                        {(emp.name||"?").charAt(0)}
                      </div>
                      <div>
                        <p style={{fontFamily:"var(--font-syne)",fontWeight:600,fontSize:"13px",color:"white"}}>{emp.name}</p>
                        <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:"rgba(255,255,255,0.25)",marginTop:"2px"}}>
                          Entrada: {entry?.clockIn.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}
                        </p>
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <p style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:"#C9A84C"}}>{h}h {m}m</p>
                      <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"10px",color:"rgba(255,255,255,0.2)"}}>trabajando</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
            {/* Quick actions */}
            <div className="glass" style={{borderRadius:"20px",overflow:"hidden"}}>
              <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <p style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"13px",color:"white"}}>Acciones</p>
              </div>
              <div style={{padding:"8px"}}>
                {[
                  {href:"/en/admin/employees/new",label:"Nuevo empleado"},
                  {href:"/en/admin/employees",label:"Ver empleados"},
                  {href:"/en/admin/kiosk",label:"Abrir Kiosk"},
                  {href:"/en/admin/payroll",label:"Nómina"},
                  {href:"/en/admin/attendance",label:"Asistencia"},
                  {href:"/en/admin/activity",label:"Actividad"},
                  {href:"/en/admin/settings",label:"Configuración"},
                ].map(a=>(
                  <Link key={a.href} href={a.href} className="action-link" style={{fontFamily:"var(--font-dm-sans)"}}>
                    <div style={{width:"6px",height:"6px",background:"rgba(201,168,76,0.4)",borderRadius:"50%",flexShrink:0}} />
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Off shift employees */}
            {offShiftEmps.length > 0 && (
              <div className="glass" style={{borderRadius:"20px",overflow:"hidden"}}>
                <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                  <p style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"13px",color:"white"}}>Fuera de turno</p>
                </div>
                {offShiftEmps.map(emp=>(
                  <div key={emp.id} style={{padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,0.03)",display:"flex",alignItems:"center",gap:"10px"}}>
                    <div style={{width:"28px",height:"28px",borderRadius:"8px",background:"rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-syne)",fontWeight:700,color:"rgba(255,255,255,0.3)",fontSize:"11px"}}>
                      {(emp.name||"?").charAt(0)}
                    </div>
                    <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"12px",color:"rgba(255,255,255,0.35)"}}>{emp.name}</p>
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