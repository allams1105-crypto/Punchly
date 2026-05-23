"use client";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

const PRIMARY = "var(--accent)";
const COLORS = [PRIMARY,"#60A5FA","#34D399","#F87171","#A78BFA","#FB923C"];

function Avatar({ name, color, photoUrl }: { name: string; color?: string | null; photoUrl?: string | null }) {
  const bg = color || COLORS[(name?.charCodeAt(0)||0) % COLORS.length];
  
  if (photoUrl) {
    return <img src={photoUrl} alt={name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex-shrink-0 object-cover" style={{border:`2px solid rgba(255,255,255,0.1)`}} />;
  }

  return (
    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-extrabold flex-shrink-0"
      style={{background:`${bg}15`, border:`2px solid ${bg}25`, color:bg, fontFamily:"var(--font-inter)"}}>
      {(name||"?").charAt(0).toUpperCase()}
    </div>
  );
}

type Props = {
  user: { id:string; name:string; email:string; avatarColor?:string|null; avatarUrl?:string|null };
  onShift: boolean;
  todayEntry: { clockIn:string; clockOut?:string|null } | null;
  weekStats: { totalMin:number; daysWorked:number; lateCount:number };
  schedule: { startTime:string; endTime:string; monday:boolean; tuesday:boolean; wednesday:boolean; thursday:boolean; friday:boolean; saturday:boolean; sunday:boolean } | null;
  recentEntries: { id:string; clockIn:string; clockOut:string|null; durationMin:number|null }[];
  vouchers?: { id:string; period:string; totalHours:number; overtimeHours:number; hourlyRate:number; totalPay:number; createdAt:any }[];
  geoEnabled: boolean;
  geoRadius: number;
};

export default function EmployeeDashboardClient({ user, onShift:initialOnShift, todayEntry, weekStats, schedule, recentEntries, vouchers, geoEnabled, geoRadius }: Props) {
  const [onShift, setOnShift] = useState(initialOnShift);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [locating, setLocating] = useState(false);
  const [distance, setDistance] = useState<number|null>(null);
  const [time, setTime] = useState(new Date());
  const [scheduleWeek, setScheduleWeek] = useState<"current"|"next">("current");
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);

  useEffect(()=>{
    const t = setInterval(()=>setTime(new Date()),1000);
    return ()=>clearInterval(t);
  },[]);

  const days = ["D","L","M","X","J","V","S"];
  const dayKeys = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"] as const;
  const todayIdx = new Date().getDay();
  const isWorkingToday = schedule ? schedule[dayKeys[todayIdx]] : false;

  async function clock() {
    setLoading(true); setError(""); setSuccess("");
    const action = onShift?"out":"in";
    let body: any = { action };

    if(geoEnabled) {
      setLocating(true);
      try {
        const pos = await new Promise<GeolocationPosition>((res,rej)=>
          navigator.geolocation.getCurrentPosition(res,rej,{timeout:10000})
        );
        setLocating(false);
        body.lat = pos.coords.latitude;
        body.lng = pos.coords.longitude;
      } catch {
        setLocating(false);
        setError("Activa el GPS para poder fichar.");
        setLoading(false); return;
      }
    }

    const res = await fetch("/api/clock",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    const data = await res.json();
    setLoading(false);
    if(!res.ok){
      setError(data.error||"Error");
      if(data.distance) setDistance(data.distance);
      return;
    }
    setOnShift(action==="in");
    setSuccess(action==="in"?"Entrada registrada":"Salida registrada");
    setTimeout(()=>setSuccess(""),4000);
  }

  const totalH = Math.floor(weekStats.totalMin/60);
  const totalM = weekStats.totalMin%60;

  const glassStyle = {background:"rgba(255,255,255,0.03)",backdropFilter:"blur(30px)",WebkitBackdropFilter:"blur(30px)",border:"1px solid rgba(255,255,255,0.06)"};

  return (
    <div className="flex-1 overflow-y-auto relative" style={{background:"transparent"}}>
      <style>{`
        @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.3); opacity: 0; } }
        .clock-btn { position: relative; overflow: hidden; transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1); }
        .clock-btn:active { transform: scale(0.96); }
        .clock-btn::after { content: ""; position: absolute; inset: -20px; border-radius: inherit; border: 2px solid var(--accent); opacity: 0; }
        .clock-btn.is-active::after { animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; }
        .mobile-card { border-radius: 24px; padding: 24px; }
        @media(max-width: 640px) {
          .mobile-card { padding: 20px; border-radius: 20px; }
          .mobile-grid { grid-template-columns: 1fr; gap: 12px; }
          .stat-box { padding: 16px !important; }
        }
      `}</style>

      {/* Header */}
      <div className="px-5 sm:px-8 py-5 flex items-center justify-between relative z-10">
        <p className="font-extrabold text-white text-lg tracking-tight" style={{fontFamily:"var(--font-inter)"}}>Panel de Empleado</p>
        <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
          <div className="text-right">
            <p className="text-white font-bold text-sm" style={{fontFamily:"var(--font-inter)"}}>
              {time.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}
            </p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold" style={{fontFamily:"var(--font-inter)"}}>Hora Actual</p>
          </div>
          <button onClick={async () => {
            try {
              await signOut({ callbackUrl: "/en" });
            } catch (e) {
              window.location.href = "/api/auth/signout?callbackUrl=/en";
            }
          }}
            style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",padding:"8px 12px",color:"rgba(255,255,255,0.6)",fontSize:"12px",fontWeight:600,fontFamily:"var(--font-inter)",cursor:"pointer",transition:"all 0.2s",position:"relative",zIndex:50}}
            onMouseEnter={e=>(e.currentTarget.style.color="#F87171")}
            onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.6)")}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-2xl mx-auto relative z-10 pb-24">
        
        {/* Profile + Clock card */}
        <div className="mobile-card" style={glassStyle}>
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={user.name} color={user.avatarColor} photoUrl={user.avatarUrl} />
            <div className="flex-1">
              <p className="text-xl sm:text-2xl font-extrabold text-white leading-tight" style={{fontFamily:"var(--font-inter)",letterSpacing:"-0.5px"}}>{user.name}</p>
              <p className="text-sm text-white/40 mt-0.5 font-medium" style={{fontFamily:"var(--font-inter)"}}>{user.email}</p>
              <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-[11px] uppercase tracking-widest font-bold"
                style={onShift
                  ? {background:"rgba(52,211,153,0.1)", color:"#34D399", border:"1px solid rgba(52,211,153,0.2)"}
                  : {background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.4)", border:"1px solid rgba(255,255,255,0.08)"}}>
                {onShift && <span className="w-2 h-2 bg-green-400 rounded-full" style={{animation:"pulse 2s infinite"}} />}
                <span style={{fontFamily:"var(--font-inter)"}}>{onShift?"Turno Activo":"Fuera de turno"}</span>
              </div>
            </div>
          </div>

          {todayEntry && (
            <div className="rounded-2xl p-4 mb-5 flex items-center gap-4"
              style={{background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.04)"}}>
              <div className="w-1.5 h-10 rounded-full" style={{background:PRIMARY}} />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-1" style={{fontFamily:"var(--font-inter)"}}>Registro de hoy</p>
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-white" style={{fontFamily:"var(--font-inter)"}}>
                    {new Date(todayEntry.clockIn).toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}
                  </p>
                  {todayEntry.clockOut && (
                    <>
                      <span className="text-white/20">—</span>
                      <p className="text-base font-bold text-white" style={{fontFamily:"var(--font-inter)"}}>
                        {new Date(todayEntry.clockOut).toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-2xl p-4 mb-5" style={{background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.15)"}}>
              <p className="text-sm font-semibold" style={{color:"#F87171", fontFamily:"var(--font-inter)"}}>{error}</p>
              {distance && <p className="text-[11px] mt-1.5 font-bold uppercase tracking-widest" style={{color:"rgba(248,113,113,0.6)", fontFamily:"var(--font-inter)"}}>Distancia: {distance}m (Máx: {geoRadius}m)</p>}
            </div>
          )}
          {success && (
            <div className="rounded-2xl p-4 mb-5 text-center" style={{background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.15)"}}>
              <p className="text-sm font-bold" style={{color:"#34D399", fontFamily:"var(--font-inter)"}}>{success}</p>
            </div>
          )}

          <button onClick={clock} disabled={loading||locating}
            className={`w-full py-5 rounded-[20px] font-extrabold text-lg sm:text-xl transition-all duration-300 disabled:opacity-40 clock-btn flex items-center justify-center gap-3 ${!onShift ? 'is-active' : ''}`}
            style={onShift
              ? {background:"rgba(248,113,113,0.1)", color:"#F87171", border:"1px solid rgba(248,113,113,0.2)", fontFamily:"var(--font-inter)"}
              : {background:`linear-gradient(135deg,${PRIMARY},var(--accent-dark))`, color:"#000", fontFamily:"var(--font-inter)",
                 boxShadow:`0 8px 30px ${PRIMARY}40`}}>
            {locating?"Localizando...":loading?"Procesando...":onShift?"Terminar Turno":"Iniciar Turno"}
            {!locating && !loading && (
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={onShift?"M5 12h14":"M14 5l7 7m0 0l-7 7m7-7H3"}/></svg>
            )}
          </button>

          {geoEnabled && (
            <div className="flex items-center justify-center gap-2 mt-4 text-[11px] font-bold uppercase tracking-widest text-white/20" style={{fontFamily:"var(--font-inter)"}}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Verificación GPS activa ({geoRadius}m)
            </div>
          )}
        </div>

        {/* Schedule Detail */}
        {schedule && (
          <div className="mobile-card" style={glassStyle}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-[11px] font-extrabold uppercase tracking-widest" style={{color:PRIMARY, fontFamily:"var(--font-inter)"}}>Mi Horario Asignado</p>
              
              <div className="flex gap-2">
                <button onClick={() => setScheduleWeek("current")} className="px-2 py-1 rounded text-[10px] font-bold uppercase transition-all" style={{background:scheduleWeek==="current"?"rgba(255,255,255,0.1)":"transparent", color:scheduleWeek==="current"?"#FFF":"rgba(255,255,255,0.3)", border:"none"}}>Actual</button>
                <button onClick={() => setScheduleWeek("next")} className="px-2 py-1 rounded text-[10px] font-bold uppercase transition-all" style={{background:scheduleWeek==="next"?"rgba(255,255,255,0.1)":"transparent", color:scheduleWeek==="next"?"#FFF":"rgba(255,255,255,0.3)", border:"none"}}>Próxima</button>
              </div>
            </div>
            
            <div className="mb-4">
              {isWorkingToday && scheduleWeek === "current" ? (
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase" style={{background:"rgba(52,211,153,0.1)", color:"#34D399", fontFamily:"var(--font-inter)"}}>Hoy te toca</span>
              ) : !isWorkingToday && scheduleWeek === "current" ? (
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase" style={{background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.4)", fontFamily:"var(--font-inter)"}}>Hoy es libre</span>
              ) : null}
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{background:`${PRIMARY}20`, color:PRIMARY}}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white" style={{fontFamily:"var(--font-inter)", letterSpacing:"-0.5px"}}>
                  {schedule.startTime} <span className="text-white/20 text-lg font-medium mx-1">a</span> {schedule.endTime}
                </p>
                <p className="text-xs text-white/40 font-medium mt-0.5" style={{fontFamily:"var(--font-inter)"}}>Rango de horas laborales</p>
              </div>
            </div>

            <div className="flex gap-2">
              {days.map((d,i)=>{
                const active = schedule[dayKeys[i]];
                const isToday = i===todayIdx;
                return (
                  <div key={d} className="flex-1 flex flex-col items-center justify-center py-3 rounded-[14px] transition-all"
                    style={isToday&&active
                      ? {background:`linear-gradient(135deg,${PRIMARY},var(--accent-dark))`, color:"#000", fontFamily:"var(--font-inter)", transform:"scale(1.05)", boxShadow:`0 4px 15px ${PRIMARY}40`}
                      : active
                      ? {background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.8)", fontFamily:"var(--font-inter)"}
                      : {background:"rgba(255,255,255,0.02)", color:"rgba(255,255,255,0.2)", fontFamily:"var(--font-inter)"}}>
                    <span className="text-[10px] uppercase font-bold mb-1 opacity-60">{d}</span>
                    <div className="w-1.5 h-1.5 rounded-full" style={{background:active?(isToday?"#000":PRIMARY):"transparent"}} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mobile-grid">
          {[
            {value:`${totalH}h${totalM>0?` ${totalM}m`:""}`, label:"Trabajado en semana", color:PRIMARY, icon:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"},
            {value:weekStats.daysWorked, label:"Días de asistencia", color:"#FFF", icon:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"},
            {value:weekStats.lateCount, label:"Llegadas Tarde", color:weekStats.lateCount>0?"#F87171":"#34D399", icon:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"},
          ].map(s=>(
            <div key={s.label} className="stat-box rounded-2xl p-5" style={glassStyle}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:`${s.color}15`, color:s.color}}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={s.icon}/></svg>
                </div>
                <p className="text-2xl font-extrabold" style={{color:s.color, fontFamily:"var(--font-inter)", letterSpacing:"-0.5px"}}>{s.value}</p>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-widest" style={{color:"rgba(255,255,255,0.3)", fontFamily:"var(--font-inter)"}}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Recent entries */}
        {recentEntries.length>0 && (
          <div className="mobile-card !p-0 overflow-hidden" style={glassStyle}>
            <div className="px-6 py-5 flex items-center justify-between" style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-white/40" style={{fontFamily:"var(--font-inter)"}}>Historial de Entradas</p>
              <div className="px-2 py-1 rounded bg-white/5 text-white/40 text-[10px] font-bold">Últimos {Math.min(10, recentEntries.length)}</div>
            </div>
            <div className="flex flex-col">
              {recentEntries.slice(0,10).map((e, idx)=>{
                const ci = new Date(e.clockIn);
                const h = Math.floor((e.durationMin||0)/60);
                const m = (e.durationMin||0)%60;
                const isLast = idx === recentEntries.length - 1 || idx === 9;
                return (
                  <div key={e.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-3 transition-colors hover:bg-white/5" style={{borderBottom:isLast?"none":"1px solid rgba(255,255,255,0.04)"}}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                        <span className="text-[10px] text-white/40 font-bold uppercase" style={{fontFamily:"var(--font-inter)"}}>{ci.toLocaleDateString("es",{month:"short"})}</span>
                        <span className="text-sm font-extrabold text-white" style={{fontFamily:"var(--font-inter)", lineHeight:1}}>{ci.getDate()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white mb-0.5" style={{fontFamily:"var(--font-inter)"}}>
                          {ci.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}
                          {e.clockOut && (
                            <>
                              <span className="text-white/20 mx-2">→</span>
                              {new Date(e.clockOut).toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}
                            </>
                          )}
                        </p>
                        <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider" style={{fontFamily:"var(--font-inter)"}}>
                          {ci.toLocaleDateString("es",{weekday:"long"})}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center sm:justify-end gap-2 pl-14 sm:pl-0">
                      {e.durationMin ? (
                        <div className="px-3 py-1.5 rounded-lg font-bold text-xs" style={{background:`${PRIMARY}15`, color:PRIMARY, fontFamily:"var(--font-inter)"}}>
                          {h}h {m}m
                        </div>
                      ) : (
                        <div className="px-3 py-1.5 rounded-lg font-bold text-xs bg-white/5 text-white/30" style={{fontFamily:"var(--font-inter)"}}>
                          En progreso
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* Vouchers / Bauchers */}
        {vouchers && vouchers.length > 0 && (
          <div className="mobile-card !p-0 overflow-hidden mt-6" style={glassStyle}>
            <div className="px-6 py-5 flex items-center justify-between" style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-white/40" style={{fontFamily:"var(--font-inter)"}}>Mis Bauchers de Pago</p>
            </div>
            <div className="flex flex-col">
              {vouchers.map((v, idx) => {
                const isLast = idx === vouchers.length - 1;
                return (
                  <div key={v.id} onClick={() => setSelectedVoucher(v)} className="flex items-center justify-between px-6 py-4 gap-3 cursor-pointer transition-colors hover:bg-white/5" style={{borderBottom:isLast?"none":"1px solid rgba(255,255,255,0.04)"}}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex flex-col items-center justify-center text-white" style={{color:PRIMARY}}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white mb-0.5" style={{fontFamily:"var(--font-inter)"}}>
                          Período: {v.period === "current" ? "Actual" : v.period}
                        </p>
                        <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider" style={{fontFamily:"var(--font-inter)"}}>
                          {new Date(v.createdAt).toLocaleDateString("es")}
                        </p>
                      </div>
                    </div>
                    <div className="font-extrabold text-base" style={{color:PRIMARY, fontFamily:"var(--font-inter)"}}>
                      ${v.totalPay.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Voucher Detail Modal */}
      {selectedVoucher && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(10px)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",animation:"fadeIn 0.2s ease-out"}}>
          <div className="mobile-card w-full max-w-sm" style={{background:"#111",border:"1px solid rgba(255,255,255,0.1)",position:"relative"}}>
            <button onClick={()=>setSelectedVoucher(null)} style={{position:"absolute",top:"20px",right:"20px",color:"rgba(255,255,255,0.4)"}}><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
            <h3 className="text-xl font-extrabold mb-1" style={{fontFamily:"var(--font-inter)",color:"white"}}>Baucher de Pago</h3>
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-6" style={{fontFamily:"var(--font-inter)"}}>Período: {selectedVoucher.period}</p>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center" style={{fontFamily:"var(--font-inter)",fontSize:"14px",color:"white"}}>
                <span className="text-white/60">Horas Trabajadas</span>
                <span className="font-bold">{selectedVoucher.totalHours.toFixed(1)}h</span>
              </div>
              <div className="flex justify-between items-center" style={{fontFamily:"var(--font-inter)",fontSize:"14px",color:"white"}}>
                <span className="text-white/60">Horas Extra</span>
                <span className="font-bold text-orange-400">{selectedVoucher.overtimeHours.toFixed(1)}h</span>
              </div>
              <div className="flex justify-between items-center" style={{fontFamily:"var(--font-inter)",fontSize:"14px",color:"white"}}>
                <span className="text-white/60">Tarifa por Hora</span>
                <span className="font-bold">${selectedVoucher.hourlyRate}/h</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-sm font-extrabold uppercase tracking-widest text-white/40" style={{fontFamily:"var(--font-inter)"}}>Total Pagado</span>
              <span className="text-3xl font-extrabold" style={{fontFamily:"var(--font-inter)",color:PRIMARY}}>${selectedVoucher.totalPay.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}