import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import AttendanceChart from "@/components/admin/AttendanceChart";
import NotificationBell from "@/components/admin/NotificationBell";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/es/login");
  
  const orgId = (session.user as any).organizationId as string;

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
  const primary = "var(--accent)";

  const AmbientBackground = () => (
    <div style={{position:"absolute",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"-20%",left:"10%",width:"60vw",height:"60vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(59,130,246,0.06) 0%,transparent 70%)",filter:"blur(80px)",animation:"floatBg 20s ease-in-out infinite"}} />
      <div style={{position:"absolute",bottom:"-20%",right:"-10%",width:"70vw",height:"70vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(167,139,250,0.05) 0%,transparent 70%)",filter:"blur(100px)",animation:"floatBg 25s ease-in-out infinite reverse"}} />
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto" style={{background:"var(--bg-primary)", color: "var(--text-primary)", position:"relative"}}>
      <AmbientBackground />
      <style>{`
        @keyframes floatBg{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-30px) scale(1.05)}}
        @keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.2)}}
        
        .glass-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); position:relative; overflow:hidden; }
        .glass-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.05); }
        
        .stat-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; font-family: var(--font-inter); }
        
        .btn-glass { background: rgba(59,130,246,0.1); color: var(--accent); padding: 12px 20px; border-radius: 100px; font-size: 13px; font-weight: 600; font-family: var(--font-inter); text-decoration: none; border: 1px solid rgba(59,130,246,0.2); transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; }
        .btn-glass:hover { background: rgba(59,130,246,0.15); transform: scale(1.02); }
        .btn-primary { background: var(--accent); color: white; padding: 12px 20px; border-radius: 100px; font-size: 13px; font-weight: 700; font-family: var(--font-inter); text-decoration: none; border: none; transition: all 0.2s; box-shadow: 0 4px 15px rgba(30,58,138,0.2); display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-primary:hover { transform: scale(1.02) translateY(-1px); box-shadow: 0 8px 25px rgba(30,58,138,0.3); background: var(--accent-dark); }
        
        .action-link { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-radius: 16px; text-decoration: none; color: var(--text-primary); font-size: 14px; font-weight: 600; font-family: var(--font-inter); background: var(--bg-card); border: 1px solid var(--border); transition: all 0.2s; }
        .action-link:hover { background: var(--bg-primary); border-color: var(--accent); transform: translateX(4px); }

        /* Responsive */
        .dash-header { position: relative; z-index: 10; padding: 32px 40px 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .dash-content { padding: 24px 40px 60px; display: flex; flex-direction: column; gap: 24px; max-width: 1600px; margin: 0 auto; position: relative; z-index: 10; }
        .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .main-grid { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }
        
        @media(max-width: 1024px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr); }
          .main-grid { grid-template-columns: 1fr; }
        }
        
        @media(max-width: 768px) {
          .dash-header { padding: 24px 16px 16px; flex-direction: column; align-items: stretch; gap: 16px; }
          .dash-header-actions { justify-content: space-between; width: 100%; }
          .dash-header-actions .btn-primary { flex: 1; }
          .dash-content { padding: 16px 16px 100px; gap: 16px; }
          .kpi-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          
          .glass-card { padding: 16px !important; border-radius: 20px; }
          
          /* KPI Widget adjustments for mobile */
          .kpi-card-header { margin-bottom: 12px !important; }
          .kpi-value { font-size: 22px !important; letter-spacing: -0.5px !important; }
          .kpi-icon-wrap { width: 26px !important; height: 26px !important; border-radius: 8px !important; }
          .kpi-icon-wrap svg { width: 14px !important; height: 14px !important; }
          .stat-label { font-size: 9px !important; letter-spacing: 1px !important; }
          .kpi-sub { font-size: 10px !important; margin-top: 6px !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          
          .kiosk-card { flex-direction: column !important; align-items: stretch !important; gap: 16px; text-align: center; }
          .kiosk-card .btn-glass { justify-content: center; }
        }
      `}</style>

      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 style={{fontFamily:"var(--font-inter)", fontWeight:800, fontSize:"32px", letterSpacing:"-1px", lineHeight:1.2}}>Dashboard</h1>
          <p style={{fontSize:"14px", color:"var(--text-muted)", fontFamily:"var(--font-inter)", fontWeight:500, marginTop:"4px"}}>
            {org?.name || "Cargando..."}
          </p>
        </div>
        <div className="dash-header-actions" style={{display:"flex", alignItems:"center", gap:"12px"}}>
          <div style={{background:"var(--bg-card)", padding:"8px", borderRadius:"100px", border:"1px solid var(--border)"}}>
            <NotificationBell orgId={orgId} />
          </div>
          <Link href="/es/admin/employees/new" className="btn-primary">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            Nuevo Empleado
          </Link>
        </div>
      </div>

      <div className="dash-content">
        
        {/* KPI Cards */}
        <div className="kpi-grid">
          {[
            {label:"Empleados", value:employees.length, sub:"Activos en la empresa", color:"var(--text-primary)", icon:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"},
            {label:"En Turno", value:activeEntries.length, sub:"Trabajando ahora", color:"#34D399", icon:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"},
            {label:"Horas Quincena", value:totalHours+"h", sub:"Período actual", color:primary, icon:"M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"},
            {label:"Nómina", value:"$"+estimatedPayroll.toLocaleString("en-US", {minimumFractionDigits:2, maximumFractionDigits:2}), sub:"Estimado de horas", color:primary, icon:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"},
          ].map(k=>(
            <div key={k.label} className="glass-card" style={{padding:"28px 24px"}}>
              <div className="kpi-card-header" style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"16px"}}>
                <p className="stat-label">{k.label}</p>
                <div className="kpi-icon-wrap" style={{width:"32px",height:"32px",borderRadius:"10px",background:k.color+"15",color:k.color,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={k.icon}/></svg>
                </div>
              </div>
              <p className="kpi-value" style={{fontFamily:"var(--font-inter)", fontSize:"36px", fontWeight:800, color:k.color, lineHeight:1, letterSpacing:"-1px"}}>{k.value}</p>
              <p className="kpi-sub" style={{fontSize:"12px", color:"var(--text-muted)", marginTop:"12px", fontFamily:"var(--font-inter)", fontWeight:500}}>{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="main-grid">
          <div style={{display:"flex", flexDirection:"column", gap:"24px"}}>
            <div className="glass-card" style={{padding:"28px", paddingBottom:"10px"}}>
              <p className="stat-label" style={{marginBottom:"20px"}}>Tendencia de Asistencia</p>
              <AttendanceChart />
            </div>
            
            <div className="glass-card kiosk-card" style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between",padding:"24px 32px"}}>
              <div>
                <p style={{fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"18px",color:"var(--text-primary)"}}>Kiosko de Fichaje</p>
                <p style={{fontFamily:"var(--font-inter)",color:"var(--text-muted)",fontSize:"13px",marginTop:"6px"}}>Abre el reloj checador en este dispositivo para que el personal fiche.</p>
              </div>
              <Link href="/es/admin/kiosk" className="btn-glass" style={{padding:"14px 28px",fontSize:"14px",background:"rgba(59,130,246,0.1)",borderColor:"rgba(59,130,246,0.2)",color:"var(--accent)"}}>
                Abrir Kiosko
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </Link>
            </div>
          </div>

          <div style={{display:"flex", flexDirection:"column", gap:"24px"}}>
            
            <div className="glass-card">
               <div style={{padding:"20px 24px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                 <p className="stat-label" style={{marginBottom:0}}>En turno ahora</p>
                 <span style={{fontSize:"11px", color:"#34D399", fontWeight:800, background:"rgba(52,211,153,0.1)", padding:"4px 10px", borderRadius:"100px", fontFamily:"var(--font-inter)"}}>{onShiftEmps.length} ONLINE</span>
               </div>
               <div style={{maxHeight:"300px",overflowY:"auto"}}>
                 {onShiftEmps.length === 0 ? (
                   <div style={{padding:"40px 20px", textAlign:"center"}}>
                     <div style={{width:"40px",height:"40px",borderRadius:"50%",background:"var(--bg-primary)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
                       <svg width="20" height="20" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/></svg>
                     </div>
                     <p style={{color:"var(--text-muted)", fontSize:"13px", fontFamily:"var(--font-inter)", fontWeight:500}}>Nadie trabajando ahora</p>
                   </div>
                 ) : onShiftEmps.map(emp => (
                   <div key={emp.id} style={{padding:"16px 24px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                     <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                       {emp.avatarUrl ? (
                         <img src={emp.avatarUrl} alt={emp.name} style={{width:"32px",height:"32px",borderRadius:"50%",objectFit:"cover",flexShrink:0,border:"1px solid var(--border)"}} />
                       ) : (
                         <div style={{width:"32px",height:"32px",borderRadius:"50%",background:((emp as any).avatarColor||"var(--accent)")+"15",color:(emp as any).avatarColor||"var(--accent)",border:"1px solid "+((emp as any).avatarColor||"var(--accent)")+"25",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"12px",flexShrink:0}}>
                           {emp.name.charAt(0)}
                         </div>
                       )}
                       <span style={{fontSize:"14px", fontWeight:600, fontFamily:"var(--font-inter)", color:"var(--text-primary)"}}>{emp.name}</span>
                     </div>
                     <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                       <div style={{width:"6px",height:"6px",background:"#34D399",borderRadius:"50%",animation:"pulse-dot 2s infinite"}} />
                       <span style={{fontSize:"12px", fontWeight:600, color:"#34D399", fontFamily:"var(--font-inter)"}}>Activo</span>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="glass-card" style={{padding:"24px"}}>
              <p className="stat-label" style={{marginBottom:"16px"}}>Accesos Rápidos</p>
              <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                <Link href="/es/admin/employees" className="action-link">
                  <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                    Directorio del Personal
                  </div>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </Link>
                <Link href="/es/admin/payroll" className="action-link">
                  <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    Exportar Nómina
                  </div>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </Link>
                <Link href="/es/admin/geofencing" className="action-link">
                  <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    Ajustar Geofencing
                  </div>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}