"use client";
import { useState, useEffect } from "react";

const GOLD = "#C9A84C";
const COLORS = [GOLD,"#60A5FA","#34D399","#F87171","#A78BFA","#FB923C","#38BDF8","#4ADE80"];

function Avatar({ name, color, size = "md" }: { name: string; color?: string | null; size?: "sm"|"md"|"lg" }) {
  const bg = color || COLORS[(name?.charCodeAt(0)||0) % COLORS.length];
  const sz = size==="lg" ? "w-20 h-20 text-3xl" : size==="md" ? "w-14 h-14 text-xl" : "w-10 h-10 text-sm";
  return (
    <div className={`${sz} rounded-2xl flex items-center justify-center font-extrabold shrink-0`}
      style={{background:`${bg}15`, border:`1.5px solid ${bg}30`, color:bg, fontFamily:"var(--font-syne)"}}>
      {(name||"?").charAt(0).toUpperCase()}
    </div>
  );
}

type Employee = { id:string; name:string; avatarColor?:string|null; onShift:boolean; clockInTime?:string|null };
type Step = "list"|"pin"|"success";

export default function KioskClient({ employees, token }: { employees: Employee[]; token: string }) {
  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Employee|null>(null);
  const [step, setStep] = useState<Step>("list");
  const [pin, setPin] = useState("");
  const [action, setAction] = useState<"in"|"out">("in");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const t = setInterval(()=>setTime(new Date()),1000);
    return ()=>clearInterval(t);
  },[]);

  const filtered = employees.filter(e=>(e.name||"").toLowerCase().includes(search.toLowerCase()));
  const onShiftNow = employees.filter(e=>e.onShift);

  function selectEmployee(emp: Employee) {
    setSelected(emp); setAction(emp.onShift?"out":"in");
    setPin(""); setError(""); setStep("pin");
  }

  function addDigit(d: string) { if(pin.length<4) setPin(p=>p+d); }
  function removeDigit() { setPin(p=>p.slice(0,-1)); }

  async function confirmPin() {
    if(pin.length!==4){setError("Ingresa tu PIN de 4 dígitos");return;}
    setLoading(true); setError("");
    const res = await fetch("/api/kiosk/clock",{
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({userId:selected!.id, organizationId:token, action, pin}),
    });
    const data = await res.json();
    setLoading(false);
    if(!res.ok){setError(data.error||"Error al registrar");return;}
    setSuccessMsg(action==="in"?"Entrada registrada":"Salida registrada");
    setStep("success");
    setTimeout(()=>{setStep("list");setSelected(null);setPin("");setSearch("");setSuccessMsg("");},3000);
  }

  const timeStr = time.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const dateStr = time.toLocaleDateString("es",{weekday:"long",day:"numeric",month:"long"});

  const glassStyle = {
    background:"rgba(255,255,255,0.04)",
    backdropFilter:"blur(20px)",
    WebkitBackdropFilter:"blur(20px)",
    border:"1px solid rgba(255,255,255,0.08)"
  };
  const glassGoldStyle = {
    background:"rgba(201,168,76,0.08)",
    backdropFilter:"blur(20px)",
    WebkitBackdropFilter:"blur(20px)",
    border:"1px solid rgba(201,168,76,0.2)"
  };

  if(step==="success") return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{background:"#0A0A0A", backgroundImage:"radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 70%)"}}>
      
      <div className="text-center" style={{animation:"scale-in 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards"}}>
        
      <button onClick={()=>setStep("list")}
        className="absolute top-6 left-6 flex items-center gap-2 transition"
        style={{color:"rgba(255,255,255,0.3)", fontFamily:"var(--font-dm-sans)", fontSize:"13px"}}
        onMouseEnter={e=>(e.currentTarget.style.color="rgba(255,255,255,0.7)")}
        onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.3)")}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
        </svg>
        Volver
      </button>

      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Avatar name={selected!.name} color={selected?.avatarColor} size="lg" />
          <p className="text-2xl font-extrabold text-white mt-4" style={{fontFamily:"var(--font-syne)"}}>{selected!.name}</p>
          <div className="mt-3 px-5 py-1.5 rounded-full text-sm font-semibold"
            style={action==="in"
              ? {background:"rgba(52,211,153,0.1)", color:"#34D399", border:"1px solid rgba(52,211,153,0.2)"}
              : {background:"rgba(248,113,113,0.1)", color:"#F87171", border:"1px solid rgba(248,113,113,0.2)"}}>
            {action==="in"?"Registrar Entrada":"Registrar Salida"}
          </div>
        </div>

        {/* PIN dots */}
        <div className="flex justify-center gap-5 mb-8">
          {[0,1,2,3].map(i=>(
            <div key={i} className="w-4 h-4 rounded-full transition-all duration-200"
              style={{background: i<pin.length ? GOLD : "rgba(255,255,255,0.15)",
                transform: i<pin.length ? "scale(1.2)" : "scale(1)",
                boxShadow: i<pin.length ? `0 0 12px ${GOLD}60` : "none"}} />
          ))}
        </div>

        {error && <p className="text-center text-sm mb-4" style={{color:"#F87171", fontFamily:"var(--font-dm-sans)"}}>{error}</p>}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {["1","2","3","4","5","6","7","8","9","","0","del"].map((d,i)=>(
            <button key={i}
              onClick={()=>d==="del"?removeDigit():d?addDigit(d):null}
              disabled={!d && d!=="0"}
              className="h-16 rounded-2xl text-lg font-semibold transition-all duration-150 active:scale-95"
              style={d==="del"
                ? {background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.4)", border:"1px solid rgba(255,255,255,0.08)", fontFamily:"var(--font-dm-sans)"}
                : d
                ? {background:"rgba(255,255,255,0.06)", color:"white", border:"1px solid rgba(255,255,255,0.08)", fontFamily:"var(--font-syne)", fontWeight:700}
                : {opacity:0, pointerEvents:"none"}}>
              {d==="del"
                ? <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>
                : d}
            </button>
          ))}
        </div>

        <button onClick={confirmPin} disabled={loading||pin.length!==4}
          className="w-full py-4 rounded-2xl font-extrabold text-base transition-all duration-200 disabled:opacity-30"
          style={{background:`linear-gradient(135deg,${GOLD},#F0D080)`, color:"#000", fontFamily:"var(--font-syne)",
            boxShadow:pin.length===4 ? `0 0 40px ${GOLD}40` : "none"}}>
          {loading?"Verificando...":"Confirmar"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-white" style={{
      background:"#0A0A0A",
      backgroundImage:"radial-gradient(ellipse at 20% 0%, rgba(201,168,76,0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(255,255,255,0.02) 0%, transparent 40%)"
    }}>
      

      {/* Header */}
      <div className="px-8 pt-8 pb-5 flex items-start justify-between">
        <div>
          <p className="text-6xl font-extrabold text-white leading-none" style={{fontFamily:"var(--font-syne)"}}>{timeStr}</p>
          <p className="text-white/30 text-sm mt-2 capitalize" style={{fontFamily:"var(--font-dm-sans)"}}>{dateStr}</p>
        </div>
        <div className="flex items-center gap-2.5 mt-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{background:"linear-gradient(135deg,#C9A84C,#8B6914)"}}>
            <span className="text-black font-extrabold text-xs" style={{fontFamily:"var(--font-syne)"}}>P</span>
          </div>
          <span className="font-bold text-white/70 text-sm" style={{fontFamily:"var(--font-syne)"}}>Punchly.Clock</span>
        </div>
      </div>

      {/* On shift strip */}
      {onShiftNow.length>0 && (
        <div className="px-8 py-3 flex items-center gap-3 overflow-x-auto" style={{borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
          <span className="text-xs text-white/25 shrink-0" style={{fontFamily:"var(--font-dm-sans)"}}>En turno</span>
          {onShiftNow.map(e=>(
            <div key={e.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0"
              style={{background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.15)"}}>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" style={{animation:"pulse 2s infinite"}} />
              <span className="text-xs text-green-400 font-medium" style={{fontFamily:"var(--font-dm-sans)"}}>{e.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="px-8 py-5">
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Busca tu nombre..."
          className="w-full text-white text-lg focus:outline-none"
          style={{...glassStyle, borderRadius:"16px", padding:"16px 20px",
            fontFamily:"var(--font-dm-sans)", background:"rgba(255,255,255,0.04)"}}
          onFocus={e=>{e.currentTarget.style.border="1px solid rgba(201,168,76,0.3)"; e.currentTarget.style.boxShadow="0 0 0 4px rgba(201,168,76,0.06)"}}
          onBlur={e=>{e.currentTarget.style.border="1px solid rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow="none"}} />
      </div>

      {/* Grid */}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(emp=>(
            <button key={emp.id} onClick={()=>selectEmployee(emp)}
              className="emp-card p-5 rounded-2xl text-left"
              style={emp.onShift
                ? {background:"rgba(52,211,153,0.06)", border:"1px solid rgba(52,211,153,0.15)"}
                : {...glassStyle}}>
              <Avatar name={emp.name} color={emp.avatarColor} size="md" />
              <p className="text-sm font-bold text-white mt-3 leading-tight" style={{fontFamily:"var(--font-syne)"}}>{emp.name}</p>
              {emp.onShift
                ? <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" style={{animation:"pulse 2s infinite"}} />
                    <span className="text-xs text-green-400" style={{fontFamily:"var(--font-dm-sans)"}}>En turno</span>
                  </div>
                : <span className="text-xs text-white/25 mt-1.5 block" style={{fontFamily:"var(--font-dm-sans)"}}>Toca para fichar</span>}
            </button>
          ))}
        </div>
        {filtered.length===0 && (
          <div className="text-center py-20">
            <p className="text-white/20 text-sm" style={{fontFamily:"var(--font-dm-sans)"}}>No se encontraron empleados</p>
          </div>
        )}
      </div>
    </div>
  );
}