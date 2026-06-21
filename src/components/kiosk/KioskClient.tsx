"use client";
import { useState, useEffect } from "react";

const PRIMARY = "var(--accent)";
const COLORS = [PRIMARY,"#60A5FA","#34D399","#F87171","#A78BFA","#FB923C","#38BDF8","#4ADE80"];

function Avatar({ name, color, photoUrl, size="md" }: { name:string; color?:string|null; photoUrl?:string|null; size?:"sm"|"md"|"lg" }) {
  const bg = color||COLORS[(name?.charCodeAt(0)||0)%COLORS.length];
  const sz = size==="lg"?{width:"96px",height:"96px",fontSize:"36px"}:size==="md"?{width:"64px",height:"64px",fontSize:"24px"}:{width:"36px",height:"36px",fontSize:"13px"};
  
  if (photoUrl) {
    return <img src={photoUrl} alt={name} style={{...sz,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:"2px solid var(--border)"}} />;
  }

  return (
    <div style={{...sz,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-inter)",fontWeight:800,flexShrink:0,background:bg+"25",border:"2px solid "+bg+"40",color:bg}}>
      {(name||"?").charAt(0).toUpperCase()}
    </div>
  );
}

type Employee = { id:string; name:string; avatarColor?:string|null; avatarUrl?:string|null; onShift:boolean; clockInTime?:string|null };
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
  const [emps, setEmps] = useState<Employee[]>(employees);

  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t);},[]);

  const filtered = emps.filter(e=>(e.name||"").toLowerCase().includes((search||"").toLowerCase()));
  const onShiftNow = emps.filter(e=>e.onShift);

  function selectEmployee(emp:Employee){setSelected(emp);setAction(emp.onShift?"out":"in");setPin("");setError("");setStep("pin");}
  function addDigit(d:string){if(pin.length<4)setPin(p=>p+d);}
  function removeDigit(){setPin(p=>p.slice(0,-1));}

  async function refreshEmployees() {
    try {
      const res = await fetch(`/api/kiosk/employees?orgId=${token}`);
      const data = await res.json();
      if (data.employees) setEmps(data.employees);
    } catch(e) {}
  }

  async function confirmPin(){
    if(pin.length!==4){setError("Ingresa tu PIN de 4 dígitos");return;}
    setLoading(true);setError("");
    const res=await fetch("/api/kiosk/clock",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:selected!.id,organizationId:token,action,pin})});
    const data=await res.json();
    setLoading(false);
    if(!res.ok){setError(data.error||"PIN incorrecto");setPin("");return;}
    setSuccessMsg(action==="in"?"¡Bienvenido/a!":"¡Hasta luego!");
    setStep("success");
    await refreshEmployees();
    setTimeout(()=>{setStep("list");setSelected(null);setPin("");setSearch("");setSuccessMsg("");},3000);
  }

  const timeStr = time.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"});
  const dateStr = time.toLocaleDateString("es",{weekday:"long",day:"numeric",month:"long"});

  if(step==="success") return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px",position:"relative"}}>
      <style>{`@keyframes pop-in{0%{opacity:0;transform:scale(0.8)}70%{transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}.success-anim{animation:pop-in 0.6s cubic-bezier(0.34,1.56,0.64,1)}`}</style>
      <div className="success-anim" style={{textAlign:"center",position:"relative",zIndex:10,background:"var(--bg-card)",padding:"60px",borderRadius:"40px",border:"1px solid var(--border)",boxShadow:"0 20px 60px rgba(0,0,0,0.05)"}}>
        <div style={{width:"120px",height:"120px",borderRadius:"50%",margin:"0 auto 32px",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(52, 211, 153, 0.15)",border:"3px solid rgba(52, 211, 153, 0.4)",boxShadow:"0 0 80px rgba(52, 211, 153, 0.3)"}}>
          <svg width="60" height="60" fill="none" stroke="#34D399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <p style={{fontFamily:"var(--font-inter)",fontWeight:800,fontSize:"42px",color:"var(--text-primary)",marginBottom:"12px"}}>{successMsg}</p>
        <p style={{fontFamily:"var(--font-inter)",fontWeight:600,fontSize:"28px",color:PRIMARY}}>{selected?.name}</p>
        <div style={{marginTop:"24px",display:"inline-block",background:"var(--bg-primary)",padding:"12px 24px",borderRadius:"100px", border:"1px solid var(--border)"}}>
          <p style={{fontFamily:"var(--font-inter)",color:"var(--text-muted)",fontSize:"16px",fontWeight:500}}>{action==="in"?"Entrada registrada a las ":"Salida registrada a las "}<strong style={{color:"var(--text-primary)"}}>{timeStr}</strong></p>
        </div>
      </div>
    </div>
  );

  if(step==="pin") return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",position:"relative"}}>
      <style>{`
        .ios-btn{background:var(--bg-primary);border:1px solid var(--border);color:var(--text-primary);font-family:var(--font-inter);font-size:28px;font-weight:400;width:80px;height:80px;border-radius:50%;cursor:pointer;transition:all 0.1s;display:flex;flex-direction:column;align-items:center;justifyContent:center}
        .ios-btn:active{background:var(--bg-card);transform:scale(0.92)}
        .ios-btn-sub{font-size:11px;font-weight:700;letter-spacing:2px;color:var(--text-muted);margin-top:-2px}
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-8px)}80%{transform:translateX(8px)}}
        .shake{animation:shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both}
      `}</style>

      <button onClick={()=>setStep("list")} style={{position:"absolute",top:"32px",left:"32px",zIndex:20,background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:"100px",padding:"12px 24px",cursor:"pointer",color:"var(--text-primary)",display:"flex",alignItems:"center",gap:"8px",fontSize:"16px",fontWeight:500,fontFamily:"var(--font-inter)",transition:"all 0.2s"}}
        onMouseEnter={e=>(e.currentTarget.style.background="var(--bg-primary)")} onMouseLeave={e=>(e.currentTarget.style.background="var(--bg-card)")}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        Cancelar
      </button>

      <div style={{width:"100%",maxWidth:"400px",position:"relative",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{textAlign:"center",marginBottom:"40px"}}>
          <Avatar name={selected!.name} color={selected?.avatarColor} photoUrl={selected?.avatarUrl} size="lg" />
          <p style={{fontFamily:"var(--font-inter)",fontWeight:800,fontSize:"32px",color:"var(--text-primary)",marginTop:"20px",lineHeight:1.1}}>{selected!.name}</p>
          <div style={{display:"inline-flex",alignItems:"center",gap:"6px",marginTop:"12px",padding:"8px 20px",borderRadius:"100px",fontSize:"14px",fontFamily:"var(--font-inter)",fontWeight:700,
            background:action==="in"?"rgba(52,211,153,0.1)":"rgba(248,113,113,0.1)",
            border:action==="in"?"1px solid rgba(52,211,153,0.2)":"1px solid rgba(248,113,113,0.2)",
            color:action==="in"?"#34D399":"#F87171"}}>
            <div style={{width:"8px",height:"8px",borderRadius:"50%",background:action==="in"?"#34D399":"#F87171"}} />
            {action==="in"?"Marcando Entrada":"Marcando Salida"}
          </div>
        </div>

        {/* PIN dots */}
        <p style={{fontFamily:"var(--font-inter)",color:"var(--text-muted)",fontSize:"15px",fontWeight:500,marginBottom:"16px",marginTop:error?"0":"35px"}}>{error||"Ingresa tu PIN"}</p>
        <div className={error?"shake":""} style={{display:"flex",justifyContent:"center",gap:"24px",marginBottom:"48px",height:"20px",alignItems:"center"}}>
          {[0,1,2,3].map(i=>(
            <div key={i} style={{width:"16px",height:"16px",borderRadius:"50%",transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
              background:i<pin.length?PRIMARY:error?"#F87171":"var(--border)",
              transform:i<pin.length?"scale(1.2)":"scale(1)",
              boxShadow:i<pin.length?"0 0 20px "+PRIMARY+"80":error?"0 0 20px rgba(248,113,113,0.6)":"none"}} />
          ))}
        </div>

        {/* Numpad */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"24px 32px",placeItems:"center"}}>
          {[{d:"1",s:""},{d:"2",s:"ABC"},{d:"3",s:"DEF"},{d:"4",s:"GHI"},{d:"5",s:"JKL"},{d:"6",s:"MNO"},{d:"7",s:"PQRS"},{d:"8",s:"TUV"},{d:"9",s:"WXYZ"},{d:"",s:""},{d:"0",s:""},{d:"del",s:""}].map((btn,i)=>(
            <div key={i} style={{width:"80px",height:"80px"}}>
              {btn.d==="del" ? (
                <button onClick={removeDigit} disabled={pin.length===0} className="ios-btn" style={{background:"transparent",border:"none",opacity:pin.length===0?0:1}}>
                  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"/></svg>
                </button>
              ) : btn.d ? (
                <button onClick={()=>addDigit(btn.d)} className="ios-btn" style={{justifyContent:"center"}}>
                  <span>{btn.d}</span>
                  {btn.s && <span className="ios-btn-sub">{btn.s}</span>}
                </button>
              ) : null}
            </div>
          ))}
        </div>

        <button onClick={confirmPin} disabled={loading||pin.length!==4}
          style={{marginTop:"48px",padding:"20px 48px",borderRadius:"100px",fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"18px",border:"none",cursor:"pointer",transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            background:PRIMARY,color:"white",
            opacity:pin.length!==4||loading?0:1,
            transform:pin.length!==4||loading?"translateY(20px) scale(0.9)":"translateY(0) scale(1)",
            boxShadow:pin.length===4?"0 12px 40px rgba(59, 130, 246,0.4)":"none"}}>
          {loading?"Verificando...":"Entrar"}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",color:"var(--text-primary)",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column"}}>
      <style>{`
        @keyframes floatBg{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-50px) scale(1.1)}}
        .emp-card{transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);cursor:pointer;background:var(--bg-card);border:1px solid var(--border);}
        .emp-card:hover{transform:translateY(-6px) scale(1.02);background:var(--bg-primary);border-color:var(--accent);box-shadow:0 20px 40px rgba(0,0,0,0.05), 0 0 30px rgba(59, 130, 246,0.1)}
        .emp-card:active{transform:scale(0.96);transition:all 0.1s}
        .emp-card-active{background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.3)}
        .emp-card-active:hover{background:rgba(52,211,153,0.12);border-color:rgba(52,211,153,0.4);box-shadow:0 20px 40px rgba(0,0,0,0.05), 0 0 30px rgba(52,211,153,0.15)}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.2)}}
        .glass-search{background:var(--bg-card);border:1px solid var(--border);color:var(--text-primary);font-family:var(--font-inter);font-size:18px;transition:all 0.3s}
        .glass-search:focus{background:var(--bg-primary);border-color:var(--accent);box-shadow:0 0 0 4px rgba(59,130,246,0.15)}
        @media(max-width:768px){.kiosk-grid{grid-template-columns:repeat(2,1fr)!important}}
      `}</style>

      {/* Header */}
      <div style={{padding:"40px 40px 20px",position:"relative",zIndex:10,display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:"12px"}}>
        <div>
          <p style={{fontFamily:"var(--font-inter)",fontSize:"clamp(48px,8vw,72px)",fontWeight:800,color:"var(--text-primary)",lineHeight:1,letterSpacing:"-2px"}}>{timeStr}</p>
          <p style={{fontFamily:"var(--font-inter)",color:"var(--text-muted)",fontSize:"18px",marginTop:"12px",textTransform:"capitalize",fontWeight:500}}>{dateStr}</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginTop:"8px",background:"var(--bg-card)",padding:"12px 20px",borderRadius:"100px",border:"1px solid var(--border)"}}>
          <img src="/logo.png" alt="Punchly" style={{width:"44px",height:"44px",borderRadius:"14px",margin:"0 auto 24px",objectFit:"contain"}} />
          <span style={{fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"16px",color:"var(--text-primary)"}}>Punchly.Clock</span>
        </div>
      </div>

      {/* Search */}
      <div style={{padding:"20px 40px",position:"relative",zIndex:10}}>
        <div style={{position:"relative",maxWidth:"600px"}}>
          <svg width="24" height="24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{position:"absolute",left:"20px",top:"50%",transform:"translateY(-50%)"}}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Toca aquí para buscar tu nombre..."
            className="glass-search"
            style={{width:"100%",borderRadius:"20px",padding:"20px 20px 20px 56px",outline:"none"}} />
        </div>
      </div>

      {/* Grid */}
      <div style={{padding:"20px 40px 60px",flex:1,overflowY:"auto",position:"relative",zIndex:10}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"24px"}} className="kiosk-grid">
          {filtered.map(emp=>(
            <div key={emp.id} className={`emp-card ${emp.onShift?"emp-card-active":""}`} onClick={()=>selectEmployee(emp)}
              style={{padding:"32px 24px",borderRadius:"28px",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center"}}>
              <Avatar name={emp.name} color={emp.avatarColor} photoUrl={emp.avatarUrl} size="md" />
              <p style={{fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"18px",color:"var(--text-primary)",marginTop:"20px",lineHeight:1.2}}>{emp.name}</p>
              {emp.onShift
                ? <div style={{display:"flex",alignItems:"center",gap:"6px",marginTop:"12px",background:"rgba(52,211,153,0.15)",padding:"6px 12px",borderRadius:"100px"}}>
                    <div style={{width:"6px",height:"6px",background:"#34D399",borderRadius:"50%",animation:"pulse 2s infinite"}} />
                    <span style={{fontFamily:"var(--font-inter)",fontSize:"13px",fontWeight:600,color:"#34D399"}}>En turno</span>
                  </div>
                : <span style={{fontFamily:"var(--font-inter)",fontSize:"13px",fontWeight:500,color:"var(--text-muted)",marginTop:"12px",display:"block"}}>Sin marcar</span>}
            </div>
          ))}
        </div>
        {filtered.length===0 && (
          <div style={{textAlign:"center",padding:"100px 20px"}}>
            <p style={{color:"var(--text-muted)",fontSize:"20px",fontWeight:600,fontFamily:"var(--font-inter)"}}>No se encontraron empleados</p>
          </div>
        )}
      </div>
    </div>
  );
}
