"use client";
import { useState, useEffect } from "react";

const GOLD = "#C9A84C";
const COLORS = [GOLD,"#60A5FA","#34D399","#F87171","#A78BFA","#FB923C","#38BDF8","#4ADE80"];

function Avatar({ name, color, size="md" }: { name:string; color?:string|null; size?:"sm"|"md"|"lg" }) {
  const bg = color||COLORS[(name?.charCodeAt(0)||0)%COLORS.length];
  const sz = size==="lg"?{width:"80px",height:"80px",fontSize:"28px",borderRadius:"22px"}:size==="md"?{width:"52px",height:"52px",fontSize:"18px",borderRadius:"14px"}:{width:"36px",height:"36px",fontSize:"13px",borderRadius:"10px"};
  return (
    <div style={{...sz,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-syne)",fontWeight:800,flexShrink:0,background:bg+"18",border:"1.5px solid "+bg+"30",color:bg}}>
      {(name||"?").charAt(0).toUpperCase()}
    </div>
  );
}

type Employee = { id:string; name:string; avatarColor?:string|null; onShift:boolean; clockInTime?:string|null };
type Step = "list"|"pin"|"success";

export default function KioskClient({ employees, token }: { employees:Employee[]; token:string }) {
  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Employee|null>(null);
  const [step, setStep] = useState<Step>("list");
  const [pin, setPin] = useState("");
  const [action, setAction] = useState<"in"|"out">("in");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t);},[]);

  const filtered = employees.filter(e=>(e.name||"").toLowerCase().includes((search||"").toLowerCase()));
  const onShiftNow = employees.filter(e=>e.onShift);

  function selectEmployee(emp:Employee){setSelected(emp);setAction(emp.onShift?"out":"in");setPin("");setError("");setStep("pin");}
  function addDigit(d:string){if(pin.length<4)setPin(p=>p+d);}
  function removeDigit(){setPin(p=>p.slice(0,-1));}

  async function confirmPin(){
    if(pin.length!==4){setError("Ingresa tu PIN de 4 dígitos");return;}
    setLoading(true);setError("");
    const res=await fetch("/api/kiosk/clock",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:selected!.id,organizationId:token,action,pin})});
    const data=await res.json();
    setLoading(false);
    if(!res.ok){setError(data.error||"Error al registrar");return;}
    setSuccessMsg(action==="in"?"Entrada registrada":"Salida registrada");
    setStep("success");
    setTimeout(()=>{setStep("list");setSelected(null);setPin("");setSearch("");setSuccessMsg("");},3000);
  }

  const timeStr = time.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const dateStr = time.toLocaleDateString("es",{weekday:"long",day:"numeric",month:"long"});

  const glassS = {background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.08)"};

  if(step==="success") return (
    <div style={{minHeight:"100vh",background:"#0A0A0A",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px",backgroundImage:"radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 70%)"}}>
      <style>{`@keyframes scale-in{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}.success-anim{animation:scale-in 0.5s cubic-bezier(0.34,1.56,0.64,1)}`}</style>
      <div className="success-anim" style={{textAlign:"center"}}>
        <div style={{width:"96px",height:"96px",borderRadius:"50%",margin:"0 auto 24px",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(201,168,76,0.1)",border:"2px solid rgba(201,168,76,0.3)",boxShadow:"0 0 60px rgba(201,168,76,0.25)"}}>
          <svg width="40" height="40" fill="none" stroke={GOLD} strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <p style={{fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"36px",color:"#FAFAFA",marginBottom:"8px"}}>{successMsg}</p>
        <p style={{fontFamily:"var(--font-syne)",fontWeight:600,fontSize:"20px",color:GOLD}}>{selected?.name}</p>
        <p style={{fontFamily:"var(--font-dm-sans)",color:"rgba(255,255,255,0.3)",marginTop:"8px",fontSize:"14px"}}>{timeStr}</p>
      </div>
    </div>
  );

  if(step==="pin") return (
    <div style={{minHeight:"100vh",background:"#0A0A0A",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",backgroundImage:"radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 60%)"}}>
      <button onClick={()=>setStep("list")} style={{position:"absolute",top:"24px",left:"24px",background:"transparent",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.3)",display:"flex",alignItems:"center",gap:"6px",fontSize:"13px",fontFamily:"var(--font-dm-sans)",transition:"color 0.15s"}}
        onMouseEnter={e=>(e.currentTarget.style.color="rgba(255,255,255,0.8)")} onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.3)")}>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        Volver
      </button>

      <div style={{width:"100%",maxWidth:"340px"}}>
        <div style={{textAlign:"center",marginBottom:"32px"}}>
          <Avatar name={selected!.name} color={selected?.avatarColor} size="lg" />
          <p style={{fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"22px",color:"#FAFAFA",marginTop:"16px"}}>{selected!.name}</p>
          <div style={{display:"inline-block",marginTop:"10px",padding:"6px 16px",borderRadius:"100px",fontSize:"13px",fontFamily:"var(--font-dm-sans)",fontWeight:600,
            background:action==="in"?"rgba(52,211,153,0.1)":"rgba(248,113,113,0.1)",
            border:action==="in"?"1px solid rgba(52,211,153,0.2)":"1px solid rgba(248,113,113,0.2)",
            color:action==="in"?"#34D399":"#F87171"}}>
            {action==="in"?"Registrar Entrada":"Registrar Salida"}
          </div>
        </div>

        {/* PIN dots */}
        <div style={{display:"flex",justifyContent:"center",gap:"16px",marginBottom:"28px"}}>
          {[0,1,2,3].map(i=>(
            <div key={i} style={{width:"14px",height:"14px",borderRadius:"50%",transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
              background:i<pin.length?GOLD:"rgba(255,255,255,0.15)",
              transform:i<pin.length?"scale(1.3)":"scale(1)",
              boxShadow:i<pin.length?"0 0 12px "+GOLD+"80":"none"}} />
          ))}
        </div>

        {error && <p style={{textAlign:"center",color:"#F87171",fontSize:"13px",marginBottom:"16px",fontFamily:"var(--font-dm-sans)"}}>{error}</p>}

        {/* Numpad */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",marginBottom:"12px"}}>
          {["1","2","3","4","5","6","7","8","9","","0","del"].map((d,i)=>(
            <button key={i} onClick={()=>d==="del"?removeDigit():d?addDigit(d):null}
              disabled={!d&&d!=="0"}
              style={{height:"60px",borderRadius:"16px",fontSize:"20px",fontFamily:"var(--font-syne)",fontWeight:700,border:"none",cursor:d||d==="0"?"pointer":"default",transition:"all 0.15s",
                background:d||d==="0"?"rgba(255,255,255,0.06)":"transparent",
                color:"#FAFAFA",opacity:!d&&d!=="0"?0:1}}
              onMouseEnter={e=>{if(d||d==="0")e.currentTarget.style.background="rgba(255,255,255,0.1)"}}
              onMouseLeave={e=>{e.currentTarget.style.background=d||d==="0"?"rgba(255,255,255,0.06)":"transparent"}}>
              {d==="del"
                ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{margin:"0 auto"}}><path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>
                : d}
            </button>
          ))}
        </div>

        <button onClick={confirmPin} disabled={loading||pin.length!==4}
          style={{width:"100%",padding:"16px",borderRadius:"16px",fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"15px",border:"none",cursor:"pointer",transition:"all 0.3s ease",
            background:"linear-gradient(135deg,#C9A84C,#F0D080)",color:"#000",
            opacity:pin.length!==4||loading?0.35:1,
            boxShadow:pin.length===4?"0 0 40px rgba(201,168,76,0.35)":"none"}}>
          {loading?"Verificando...":"Confirmar"}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#0A0A0A",color:"#FAFAFA",backgroundImage:"radial-gradient(ellipse at 20% 0%, rgba(201,168,76,0.05) 0%, transparent 50%)"}}>
      <style>{`
        .emp-card{transition:all 0.2s cubic-bezier(0.34,1.3,0.64,1);cursor:pointer}
        .emp-card:hover{transform:translateY(-3px) scale(1.02)}
        .emp-card:active{transform:scale(0.97)}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        @media(max-width:768px){.kiosk-grid{grid-template-columns:repeat(2,1fr)!important}}
      `}</style>

      {/* Header */}
      <div style={{padding:"28px 28px 20px",display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:"12px"}}>
        <div>
          <p style={{fontFamily:"var(--font-syne)",fontSize:"clamp(36px,8vw,56px)",fontWeight:800,color:"#FAFAFA",lineHeight:1}}>{timeStr}</p>
          <p style={{fontFamily:"var(--font-dm-sans)",color:"rgba(255,255,255,0.25)",fontSize:"13px",marginTop:"6px",textTransform:"capitalize"}}>{dateStr}</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"8px",marginTop:"4px"}}>
          <div style={{width:"28px",height:"28px",borderRadius:"9px",background:"linear-gradient(135deg,#C9A84C,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:"#000",fontWeight:900,fontSize:"12px",fontFamily:"var(--font-syne)"}}>P</span>
          </div>
          <span style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"13px",color:"rgba(255,255,255,0.6)"}}>Punchly.Clock</span>
        </div>
      </div>

      {/* On shift */}
      {onShiftNow.length>0 && (
        <div style={{padding:"10px 28px",borderTop:"1px solid rgba(255,255,255,0.05)",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",gap:"10px",overflowX:"auto"}}>
          <span style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:"rgba(255,255,255,0.25)",flexShrink:0}}>En turno</span>
          {onShiftNow.map(e=>(
            <div key={e.id} style={{display:"flex",alignItems:"center",gap:"6px",padding:"5px 12px",borderRadius:"100px",flexShrink:0,background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.15)"}}>
              <div style={{width:"6px",height:"6px",background:"#34D399",borderRadius:"50%",animation:"pulse 2s infinite"}} />
              <span style={{fontFamily:"var(--font-dm-sans)",fontSize:"12px",color:"#34D399",fontWeight:500}}>{e.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div style={{padding:"16px 28px"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Busca tu nombre..."
          style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"14px 20px",color:"#FAFAFA",fontSize:"15px",fontFamily:"var(--font-dm-sans)",outline:"none",transition:"border 0.2s",boxSizing:"border-box"}}
          onFocus={e=>{e.currentTarget.style.border="1px solid rgba(201,168,76,0.35)";e.currentTarget.style.boxShadow="0 0 0 4px rgba(201,168,76,0.06)"}}
          onBlur={e=>{e.currentTarget.style.border="1px solid rgba(255,255,255,0.08)";e.currentTarget.style.boxShadow="none"}} />
      </div>

      {/* Grid */}
      <div style={{padding:"0 28px 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px"}} className="kiosk-grid">
          {filtered.map(emp=>(
            <div key={emp.id} className="emp-card" onClick={()=>selectEmployee(emp)}
              style={{padding:"20px",borderRadius:"20px",
                background:emp.onShift?"rgba(52,211,153,0.06)":"rgba(255,255,255,0.04)",
                border:emp.onShift?"1px solid rgba(52,211,153,0.15)":"1px solid rgba(255,255,255,0.08)"}}>
              <Avatar name={emp.name} color={emp.avatarColor} size="md" />
              <p style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"13px",color:"#FAFAFA",marginTop:"12px",lineHeight:1.3}}>{emp.name}</p>
              {emp.onShift
                ? <div style={{display:"flex",alignItems:"center",gap:"5px",marginTop:"6px"}}>
                    <div style={{width:"5px",height:"5px",background:"#34D399",borderRadius:"50%",animation:"pulse 2s infinite"}} />
                    <span style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:"#34D399"}}>En turno — toca para salir</span>
                  </div>
                : <span style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:"rgba(255,255,255,0.25)",marginTop:"6px",display:"block"}}>Toca para fichar</span>}
            </div>
          ))}
        </div>
        {filtered.length===0 && (
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <p style={{color:"rgba(255,255,255,0.2)",fontSize:"14px",fontFamily:"var(--font-dm-sans)"}}>No se encontraron empleados</p>
          </div>
        )}
      </div>
    </div>
  );
}