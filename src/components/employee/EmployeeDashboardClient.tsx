"use client";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";

const GOLD = "#C9A84C";
const COLORS = [GOLD,"#60A5FA","#34D399","#F87171","#A78BFA","#FB923C"];

function Avatar({ name, color }: { name: string; color?: string | null }) {
  const bg = color || COLORS[(name?.charCodeAt(0)||0) % COLORS.length];
  return (
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold"
      style={{background:`${bg}15`, border:`2px solid ${bg}25`, color:bg, fontFamily:"var(--font-syne)"}}>
      {(name||"?").charAt(0).toUpperCase()}
    </div>
  );
}

type Props = {
  user: { id:string; name:string; email:string; avatarColor?:string|null };
  onShift: boolean;
  todayEntry: { clockIn:string; clockOut?:string|null } | null;
  weekStats: { totalMin:number; daysWorked:number; lateCount:number };
  schedule: { startTime:string; endTime:string; monday:boolean; tuesday:boolean; wednesday:boolean; thursday:boolean; friday:boolean; saturday:boolean; sunday:boolean } | null;
  recentEntries: { id:string; clockIn:string; clockOut:string|null; durationMin:number|null }[];
  geoEnabled: boolean;
  geoRadius: number;
};

export default function EmployeeDashboardClient({ user, onShift:initialOnShift, todayEntry, weekStats, schedule, recentEntries, geoEnabled, geoRadius }: Props) {
  const [onShift, setOnShift] = useState(initialOnShift);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [locating, setLocating] = useState(false);
  const [distance, setDistance] = useState<number|null>(null);
  const [time, setTime] = useState(new Date());

  useEffect(()=>{
    const t = setInterval(()=>setTime(new Date()),1000);
    return ()=>clearInterval(t);
  },[]);

  const days = ["D","L","M","X","J","V","S"];
  const dayKeys = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"] as const;
  const todayIdx = new Date().getDay();

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

  const glassStyle = {background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.08)"};

  return (
    <div className="flex-1 overflow-y-auto" style={{background:"#0A0A0A", backgroundImage:"radial-gradient(ellipse at 30% 0%, rgba(201,168,76,0.05) 0%, transparent 50%)"}}>
      

      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between" style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <p className="font-extrabold text-white text-sm" style={{fontFamily:"var(--font-syne)"}}>Mi Panel</p>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <p className="text-white/30 text-xs" style={{fontFamily:"var(--font-dm-sans)"}}>
            {time.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}
          </p>
          <button onClick={async()=>{ await signOut({callbackUrl:"/en",redirect:true}); }}
            style={{background:"transparent",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",padding:"5px 14px",color:"rgba(255,255,255,0.3)",fontSize:"11px",fontFamily:"var(--font-dm-sans)",cursor:"pointer",transition:"all 0.15s"}}
            onMouseEnter={e=>(e.currentTarget.style.color="#F87171")}
            onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.3)")}>
            Salir
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4 max-w-xl mx-auto">
        {/* Profile + Clock card */}
        <div className="rounded-2xl p-6" style={glassStyle}>
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={user.name} color={user.avatarColor} />
            <div className="flex-1">
              <p className="text-lg font-extrabold text-white" style={{fontFamily:"var(--font-syne)"}}>{user.name}</p>
              <p className="text-xs text-white/30 mt-0.5" style={{fontFamily:"var(--font-dm-sans)"}}>{user.email}</p>
              <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium"
                style={onShift
                  ? {background:"rgba(52,211,153,0.1)", color:"#34D399", border:"1px solid rgba(52,211,153,0.2)"}
                  : {background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.3)", border:"1px solid rgba(255,255,255,0.08)"}}>
                {onShift && <span className="w-1.5 h-1.5 bg-green-400 rounded-full" style={{animation:"pulse 2s infinite"}} />}
                <span style={{fontFamily:"var(--font-dm-sans)"}}>{onShift?"En turno":"Fuera de turno"}</span>
              </div>
            </div>
          </div>

          {todayEntry && (
            <div className="rounded-xl p-3 mb-4 flex items-center gap-3"
              style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)"}}>
              <div className="w-1 h-8 rounded-full" style={{background:GOLD}} />
              <div>
                <p className="text-xs text-white/30" style={{fontFamily:"var(--font-dm-sans)"}}>Hoy</p>
                <p className="text-sm font-semibold text-white" style={{fontFamily:"var(--font-dm-sans)"}}>
                  {new Date(todayEntry.clockIn).toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}
                  {todayEntry.clockOut && ` — ${new Date(todayEntry.clockOut).toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}`}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl p-3 mb-4" style={{background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.15)"}}>
              <p className="text-sm" style={{color:"#F87171", fontFamily:"var(--font-dm-sans)"}}>{error}</p>
              {distance && <p className="text-xs mt-1" style={{color:"rgba(248,113,113,0.6)", fontFamily:"var(--font-dm-sans)"}}>Distancia: {distance}m · Máximo: {geoRadius}m</p>}
            </div>
          )}
          {success && (
            <div className="rounded-xl p-3 mb-4" style={{background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.15)"}}>
              <p className="text-sm font-semibold" style={{color:"#34D399", fontFamily:"var(--font-dm-sans)"}}>{success}</p>
            </div>
          )}

          <button onClick={clock} disabled={loading||locating}
            className="w-full py-4 rounded-2xl font-extrabold text-base transition-all duration-300 disabled:opacity-40"
            style={onShift
              ? {background:"rgba(248,113,113,0.1)", color:"#F87171", border:"1px solid rgba(248,113,113,0.2)", fontFamily:"var(--font-syne)"}
              : {background:`linear-gradient(135deg,${GOLD},#F0D080)`, color:"#000", fontFamily:"var(--font-syne)",
                 boxShadow:`0 0 40px ${GOLD}30`}}>
            {locating?"Obteniendo ubicación...":loading?"Registrando...":onShift?"Registrar Salida":"Registrar Entrada"}
          </button>

          {geoEnabled && (
            <p className="text-xs text-center mt-3" style={{color:"rgba(255,255,255,0.2)", fontFamily:"var(--font-dm-sans)"}}>
              Geofencing activo · radio {geoRadius}m
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {value:`${totalH}h${totalM>0?` ${totalM}m`:""}`, label:"Esta semana", color:GOLD},
            {value:weekStats.daysWorked, label:"Días trabajados", color:"rgba(255,255,255,0.9)"},
            {value:weekStats.lateCount, label:"Tardanzas", color:weekStats.lateCount>0?"#F87171":"#34D399"},
          ].map(s=>(
            <div key={s.label} className="rounded-2xl p-4 text-center" style={glassStyle}>
              <p className="text-2xl font-extrabold" style={{color:s.color, fontFamily:"var(--font-syne)"}}>{s.value}</p>
              <p className="text-xs mt-1" style={{color:"rgba(255,255,255,0.25)", fontFamily:"var(--font-dm-sans)"}}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Schedule */}
        {schedule && (
          <div className="rounded-2xl p-5" style={glassStyle}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{color:"rgba(255,255,255,0.25)", fontFamily:"var(--font-dm-sans)"}}>Mi Horario</p>
            <div className="flex gap-1.5 mb-4">
              {days.map((d,i)=>{
                const active = schedule[dayKeys[i]];
                const isToday = i===todayIdx;
                return (
                  <div key={d} className="flex-1 py-2.5 rounded-xl text-center text-xs font-bold"
                    style={isToday&&active
                      ? {background:`linear-gradient(135deg,${GOLD},#F0D080)`, color:"#000", fontFamily:"var(--font-syne)"}
                      : active
                      ? {background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.7)", fontFamily:"var(--font-syne)"}
                      : {background:"rgba(255,255,255,0.02)", color:"rgba(255,255,255,0.15)", fontFamily:"var(--font-syne)"}}>
                    {d}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-center" style={{color:"rgba(255,255,255,0.3)", fontFamily:"var(--font-dm-sans)"}}>
              {schedule.startTime} — {schedule.endTime}
            </p>
          </div>
        )}

        {/* Recent entries */}
        {recentEntries.length>0 && (
          <div className="rounded-2xl overflow-hidden" style={glassStyle}>
            <div className="px-5 py-3.5" style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{color:"rgba(255,255,255,0.25)", fontFamily:"var(--font-dm-sans)"}}>Registros recientes</p>
            </div>
            {recentEntries.slice(0,6).map(e=>{
              const ci = new Date(e.clockIn);
              const h = Math.floor((e.durationMin||0)/60);
              const m = (e.durationMin||0)%60;
              return (
                <div key={e.id} className="flex items-center justify-between px-5 py-3.5" style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  <div>
                    <p className="text-sm font-semibold text-white" style={{fontFamily:"var(--font-dm-sans)"}}>{ci.toLocaleDateString("es",{weekday:"short",day:"numeric",month:"short"})}</p>
                    <p className="text-xs mt-0.5" style={{color:"rgba(255,255,255,0.25)", fontFamily:"var(--font-dm-sans)"}}>
                      {ci.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}
                      {e.clockOut && ` — ${new Date(e.clockOut).toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}`}
                    </p>
                  </div>
                  <p className="text-sm font-bold" style={{color:e.durationMin?GOLD:"rgba(255,255,255,0.3)", fontFamily:"var(--font-syne)"}}>
                    {e.durationMin?`${h}h ${m}m`:"—"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}