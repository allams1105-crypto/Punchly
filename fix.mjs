import { writeFileSync, mkdirSync } from "fs";

// ============================================================
// LANDING PAGE — Luxury glassmorphism, Syne font, no emojis
// ============================================================
const landing = `import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .font-syne { font-family: 'Syne', sans-serif; }
        .glass { background: rgba(255,255,255,0.04); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        .glass-gold { background: rgba(201,168,76,0.08); backdrop-filter: blur(20px); border: 1px solid rgba(201,168,76,0.2); }
        .gold-text { background: linear-gradient(135deg, #C9A84C, #F0D080, #C9A84C); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .grid-bg { background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 80px 80px; }
        .glow { box-shadow: 0 0 60px rgba(201,168,76,0.15), 0 0 120px rgba(201,168,76,0.05); }
        .card-3d { transition: transform 0.4s ease, box-shadow 0.4s ease; transform-style: preserve-3d; }
        .card-3d:hover { transform: translateY(-4px) rotateX(2deg); box-shadow: 0 24px 60px rgba(0,0,0,0.4), 0 0 40px rgba(201,168,76,0.1); }
        @keyframes float { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-12px) rotate(1deg); } }
        @keyframes fade-up { from { opacity:0; transform: translateY(24px); } to { opacity:1; transform: translateY(0); } }
        .float { animation: float 6s ease-in-out infinite; }
        .fade-up { animation: fade-up 0.8s ease forwards; }
        .fade-up-2 { animation: fade-up 0.8s ease 0.15s forwards; opacity: 0; }
        .fade-up-3 { animation: fade-up 0.8s ease 0.3s forwards; opacity: 0; }
        .fade-up-4 { animation: fade-up 0.8s ease 0.45s forwards; opacity: 0; }
        .orb { border-radius: 50%; filter: blur(80px); position: absolute; pointer-events: none; }
      \`}</style>

      <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
        {/* Background orbs */}
        <div className="orb w-96 h-96 bg-[#C9A84C]/10 top-0 left-1/4 -translate-x-1/2" style={{position:'fixed'}} />
        <div className="orb w-64 h-64 bg-white/5 bottom-1/4 right-1/4" style={{position:'fixed'}} />
        
        {/* Grid bg */}
        <div className="grid-bg fixed inset-0 pointer-events-none" />

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center glow" style={{background:'linear-gradient(135deg,#C9A84C,#8B6914)'}}>
              <span className="font-syne font-800 text-black text-sm font-extrabold">P</span>
            </div>
            <span className="font-syne font-bold text-white tracking-tight">Punchly.Clock</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/en/login" className="text-sm text-white/50 hover:text-white transition font-medium">Iniciar sesión</Link>
            <Link href="/en/register" className="glass-gold text-[#C9A84C] px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#C9A84C]/15 transition">
              Comenzar gratis
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative z-10 max-w-5xl mx-auto px-8 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs text-white/50 mb-8 fade-up">
            <div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
            7 días gratis — sin tarjeta de crédito
          </div>
          
          <h1 className="font-syne text-6xl md:text-8xl font-extrabold leading-none tracking-tight mb-6 fade-up-2">
            Control de<br />
            <span className="gold-text">asistencia</span><br />
            sin excusas
          </h1>
          
          <p className="text-white/40 text-lg md:text-xl max-w-xl mx-auto mb-10 font-light leading-relaxed fade-up-3">
            Kiosk inteligente con PIN, geofencing desde el móvil y reportes automáticos. Todo por un pago único.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center fade-up-4">
            <Link href="/en/register"
              className="glow font-syne font-bold px-8 py-4 rounded-2xl text-black text-base transition hover:scale-105"
              style={{background:'linear-gradient(135deg,#C9A84C,#F0D080)'}}>
              Empezar 7 días gratis
            </Link>
            <Link href="/en/login"
              className="glass px-8 py-4 rounded-2xl text-white/70 text-base font-medium hover:text-white hover:bg-white/8 transition">
              Ya tengo cuenta
            </Link>
          </div>
        </section>

        {/* Floating kiosk mockup */}
        <section className="relative z-10 max-w-4xl mx-auto px-8 mb-32">
          <div className="float">
            <div className="glass rounded-3xl p-1 glow">
              <div className="bg-[#111] rounded-[20px] overflow-hidden">
                {/* Fake kiosk UI */}
                <div className="bg-[#0D0D0D] px-8 py-6 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-syne text-4xl font-bold text-white">09:41</p>
                      <p className="text-white/30 text-sm mt-1">Jueves, 12 de marzo</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse" />
                      <span className="text-xs text-[#C9A84C] font-medium">3 en turno</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-3 gap-3">
                  {["Ana G.", "Luis M.", "Sofia R.", "Carlos P.", "María J.", "Pedro L."].map((name, i) => (
                    <div key={name} className="glass rounded-2xl p-4 card-3d cursor-pointer">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-syne font-bold text-sm mb-3"
                        style={{background: ['#C9A84C','#60A5FA','#34D399','#F87171','#A78BFA','#FB923C'][i]+'20', color: ['#C9A84C','#60A5FA','#34D399','#F87171','#A78BFA','#FB923C'][i]}}>
                        {name.charAt(0)}
                      </div>
                      <p className="text-xs font-semibold text-white">{name}</p>
                      {i < 3 && <div className="flex items-center gap-1 mt-1"><div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"/><span className="text-xs text-green-400">Activo</span></div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="relative z-10 max-w-5xl mx-auto px-8 mb-32">
          <h2 className="font-syne text-4xl font-bold text-center mb-3">Todo lo que necesitas</h2>
          <p className="text-white/30 text-center mb-12 text-sm">Sin suscripciones. Sin límites artificiales.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Kiosk con PIN", desc: "Tablet en la entrada. Cada empleado tiene su PIN único. Nadie puede fichar por otro." },
              { title: "Geofencing", desc: "Desde el móvil. El empleado solo puede fichar si está dentro del radio configurado." },
              { title: "Alertas de tardanza", desc: "Email automático al admin cuando alguien llega tarde. En tiempo real." },
              { title: "Nómina automática", desc: "Cálculo quincenal con horas normales y extras. Exporta a CSV o PDF." },
              { title: "Multi-empresa", desc: "Cada cliente tiene su propio espacio aislado con sus empleados y datos." },
              { title: "Pago único $49", desc: "Sin mensualidades. Paga una vez, usa para siempre. Actualizaciones incluidas." },
            ].map((f, i) => (
              <div key={f.title} className="glass rounded-2xl p-6 card-3d" style={{animationDelay: i*0.1+'s'}}>
                <div className="w-8 h-8 glass-gold rounded-xl mb-4" />
                <h3 className="font-syne font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="relative z-10 max-w-md mx-auto px-8 mb-32 text-center">
          <div className="glass rounded-3xl p-8 glow">
            <p className="text-white/40 text-sm mb-2 font-syne uppercase tracking-widest">Precio único</p>
            <div className="flex items-end justify-center gap-2 mb-4">
              <span className="font-syne text-7xl font-extrabold gold-text">$49</span>
              <span className="text-white/30 mb-3">para siempre</span>
            </div>
            <ul className="text-sm text-white/50 space-y-2 mb-8 text-left">
              {["Empleados ilimitados","Kiosk con PIN","Geofencing móvil","Alertas por email","Nómina automática","Soporte incluido"].map(f => (
                <li key={f} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/en/register"
              className="block w-full py-4 rounded-2xl font-syne font-bold text-black transition hover:scale-105 glow"
              style={{background:'linear-gradient(135deg,#C9A84C,#F0D080)'}}>
              Comenzar 7 días gratis
            </Link>
            <p className="text-xs text-white/20 mt-3">Sin tarjeta requerida durante el trial</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/5 py-8 text-center">
          <p className="text-white/20 text-xs">Punchly.Clock — Control de asistencia profesional</p>
        </footer>
      </div>
    </>
  );
}`;

// ============================================================
// KIOSK CLIENT — Luxury glassmorphism redesign
// ============================================================
const kioskClient = `"use client";
import { useState, useEffect } from "react";

const GOLD = "#C9A84C";
const COLORS = [GOLD,"#60A5FA","#34D399","#F87171","#A78BFA","#FB923C","#38BDF8","#4ADE80"];

function Avatar({ name, color, size = "md" }: { name: string; color?: string | null; size?: "sm"|"md"|"lg" }) {
  const bg = color || COLORS[(name?.charCodeAt(0)||0) % COLORS.length];
  const sz = size==="lg" ? "w-20 h-20 text-3xl" : size==="md" ? "w-14 h-14 text-xl" : "w-10 h-10 text-sm";
  return (
    <div className={\`\${sz} rounded-2xl flex items-center justify-center font-extrabold shrink-0\`}
      style={{background:\`\${bg}15\`, border:\`1.5px solid \${bg}30\`, color:bg, fontFamily:"'Syne',sans-serif"}}>
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
      <style>{\`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');\`}</style>
      <div className="text-center" style={{animation:"scale-in 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards"}}>
        <style>{\`@keyframes scale-in{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}}\`}</style>
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{...glassGoldStyle, boxShadow:"0 0 60px rgba(201,168,76,0.3)"}}>
          <svg className="w-10 h-10" style={{color:GOLD}} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <p className="text-4xl font-extrabold text-white mb-2" style={{fontFamily:"'Syne',sans-serif"}}>{successMsg}</p>
        <p className="text-lg font-medium" style={{color:GOLD, fontFamily:"'Syne',sans-serif"}}>{selected?.name}</p>
        <p className="text-white/30 text-sm mt-2" style={{fontFamily:"'DM Sans',sans-serif"}}>{timeStr}</p>
      </div>
    </div>
  );

  if(step==="pin") return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{background:"#0A0A0A", backgroundImage:"radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 60%)"}}>
      <style>{\`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');\`}</style>
      <button onClick={()=>setStep("list")}
        className="absolute top-6 left-6 flex items-center gap-2 transition"
        style={{color:"rgba(255,255,255,0.3)", fontFamily:"'DM Sans',sans-serif", fontSize:"13px"}}
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
          <p className="text-2xl font-extrabold text-white mt-4" style={{fontFamily:"'Syne',sans-serif"}}>{selected!.name}</p>
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
                boxShadow: i<pin.length ? \`0 0 12px \${GOLD}60\` : "none"}} />
          ))}
        </div>

        {error && <p className="text-center text-sm mb-4" style={{color:"#F87171", fontFamily:"'DM Sans',sans-serif"}}>{error}</p>}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {["1","2","3","4","5","6","7","8","9","","0","del"].map((d,i)=>(
            <button key={i}
              onClick={()=>d==="del"?removeDigit():d?addDigit(d):null}
              disabled={!d && d!=="0"}
              className="h-16 rounded-2xl text-lg font-semibold transition-all duration-150 active:scale-95"
              style={d==="del"
                ? {background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.4)", border:"1px solid rgba(255,255,255,0.08)", fontFamily:"'DM Sans',sans-serif"}
                : d
                ? {background:"rgba(255,255,255,0.06)", color:"white", border:"1px solid rgba(255,255,255,0.08)", fontFamily:"'Syne',sans-serif", fontWeight:700}
                : {opacity:0, pointerEvents:"none"}}>
              {d==="del"
                ? <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>
                : d}
            </button>
          ))}
        </div>

        <button onClick={confirmPin} disabled={loading||pin.length!==4}
          className="w-full py-4 rounded-2xl font-extrabold text-base transition-all duration-200 disabled:opacity-30"
          style={{background:\`linear-gradient(135deg,\${GOLD},#F0D080)\`, color:"#000", fontFamily:"'Syne',sans-serif",
            boxShadow:pin.length===4 ? \`0 0 40px \${GOLD}40\` : "none"}}>
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
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .emp-card { transition: all 0.2s cubic-bezier(0.34,1.3,0.64,1); }
        .emp-card:hover { transform: translateY(-2px) scale(1.02); }
        .emp-card:active { transform: scale(0.97); }
      \`}</style>

      {/* Header */}
      <div className="px-8 pt-8 pb-5 flex items-start justify-between">
        <div>
          <p className="text-6xl font-extrabold text-white leading-none" style={{fontFamily:"'Syne',sans-serif"}}>{timeStr}</p>
          <p className="text-white/30 text-sm mt-2 capitalize" style={{fontFamily:"'DM Sans',sans-serif"}}>{dateStr}</p>
        </div>
        <div className="flex items-center gap-2.5 mt-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{background:"linear-gradient(135deg,#C9A84C,#8B6914)"}}>
            <span className="text-black font-extrabold text-xs" style={{fontFamily:"'Syne',sans-serif"}}>P</span>
          </div>
          <span className="font-bold text-white/70 text-sm" style={{fontFamily:"'Syne',sans-serif"}}>Punchly.Clock</span>
        </div>
      </div>

      {/* On shift strip */}
      {onShiftNow.length>0 && (
        <div className="px-8 py-3 flex items-center gap-3 overflow-x-auto" style={{borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
          <span className="text-xs text-white/25 shrink-0" style={{fontFamily:"'DM Sans',sans-serif"}}>En turno</span>
          {onShiftNow.map(e=>(
            <div key={e.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0"
              style={{background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.15)"}}>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" style={{animation:"pulse 2s infinite"}} />
              <span className="text-xs text-green-400 font-medium" style={{fontFamily:"'DM Sans',sans-serif"}}>{e.name}</span>
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
            fontFamily:"'DM Sans',sans-serif", background:"rgba(255,255,255,0.04)"}}
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
              <p className="text-sm font-bold text-white mt-3 leading-tight" style={{fontFamily:"'Syne',sans-serif"}}>{emp.name}</p>
              {emp.onShift
                ? <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" style={{animation:"pulse 2s infinite"}} />
                    <span className="text-xs text-green-400" style={{fontFamily:"'DM Sans',sans-serif"}}>En turno</span>
                  </div>
                : <span className="text-xs text-white/25 mt-1.5 block" style={{fontFamily:"'DM Sans',sans-serif"}}>Toca para fichar</span>}
            </button>
          ))}
        </div>
        {filtered.length===0 && (
          <div className="text-center py-20">
            <p className="text-white/20 text-sm" style={{fontFamily:"'DM Sans',sans-serif"}}>No se encontraron empleados</p>
          </div>
        )}
      </div>
    </div>
  );
}`;

// ============================================================
// EMPLOYEE DASHBOARD CLIENT — luxury glass redesign
// ============================================================
const employeeClient = `"use client";
import { useState, useEffect } from "react";

const GOLD = "#C9A84C";
const COLORS = [GOLD,"#60A5FA","#34D399","#F87171","#A78BFA","#FB923C"];

function Avatar({ name, color }: { name: string; color?: string | null }) {
  const bg = color || COLORS[(name?.charCodeAt(0)||0) % COLORS.length];
  return (
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold"
      style={{background:\`\${bg}15\`, border:\`2px solid \${bg}25\`, color:bg, fontFamily:"'Syne',sans-serif"}}>
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
      <style>{\`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');\`}</style>

      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between" style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <p className="font-extrabold text-white text-sm" style={{fontFamily:"'Syne',sans-serif"}}>Mi Panel</p>
        <p className="text-white/30 text-xs" style={{fontFamily:"'DM Sans',sans-serif"}}>
          {time.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}
        </p>
      </div>

      <div className="p-6 space-y-4 max-w-xl mx-auto">
        {/* Profile + Clock card */}
        <div className="rounded-2xl p-6" style={glassStyle}>
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={user.name} color={user.avatarColor} />
            <div className="flex-1">
              <p className="text-lg font-extrabold text-white" style={{fontFamily:"'Syne',sans-serif"}}>{user.name}</p>
              <p className="text-xs text-white/30 mt-0.5" style={{fontFamily:"'DM Sans',sans-serif"}}>{user.email}</p>
              <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium"
                style={onShift
                  ? {background:"rgba(52,211,153,0.1)", color:"#34D399", border:"1px solid rgba(52,211,153,0.2)"}
                  : {background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.3)", border:"1px solid rgba(255,255,255,0.08)"}}>
                {onShift && <span className="w-1.5 h-1.5 bg-green-400 rounded-full" style={{animation:"pulse 2s infinite"}} />}
                <span style={{fontFamily:"'DM Sans',sans-serif"}}>{onShift?"En turno":"Fuera de turno"}</span>
              </div>
            </div>
          </div>

          {todayEntry && (
            <div className="rounded-xl p-3 mb-4 flex items-center gap-3"
              style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)"}}>
              <div className="w-1 h-8 rounded-full" style={{background:GOLD}} />
              <div>
                <p className="text-xs text-white/30" style={{fontFamily:"'DM Sans',sans-serif"}}>Hoy</p>
                <p className="text-sm font-semibold text-white" style={{fontFamily:"'DM Sans',sans-serif"}}>
                  {new Date(todayEntry.clockIn).toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}
                  {todayEntry.clockOut && \` — \${new Date(todayEntry.clockOut).toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}\`}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl p-3 mb-4" style={{background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.15)"}}>
              <p className="text-sm" style={{color:"#F87171", fontFamily:"'DM Sans',sans-serif"}}>{error}</p>
              {distance && <p className="text-xs mt-1" style={{color:"rgba(248,113,113,0.6)", fontFamily:"'DM Sans',sans-serif"}}>Distancia: {distance}m · Máximo: {geoRadius}m</p>}
            </div>
          )}
          {success && (
            <div className="rounded-xl p-3 mb-4" style={{background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.15)"}}>
              <p className="text-sm font-semibold" style={{color:"#34D399", fontFamily:"'DM Sans',sans-serif"}}>{success}</p>
            </div>
          )}

          <button onClick={clock} disabled={loading||locating}
            className="w-full py-4 rounded-2xl font-extrabold text-base transition-all duration-300 disabled:opacity-40"
            style={onShift
              ? {background:"rgba(248,113,113,0.1)", color:"#F87171", border:"1px solid rgba(248,113,113,0.2)", fontFamily:"'Syne',sans-serif"}
              : {background:\`linear-gradient(135deg,\${GOLD},#F0D080)\`, color:"#000", fontFamily:"'Syne',sans-serif",
                 boxShadow:\`0 0 40px \${GOLD}30\`}}>
            {locating?"Obteniendo ubicación...":loading?"Registrando...":onShift?"Registrar Salida":"Registrar Entrada"}
          </button>

          {geoEnabled && (
            <p className="text-xs text-center mt-3" style={{color:"rgba(255,255,255,0.2)", fontFamily:"'DM Sans',sans-serif"}}>
              Geofencing activo · radio {geoRadius}m
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {value:\`\${totalH}h\${totalM>0?\` \${totalM}m\`:""}\`, label:"Esta semana", color:GOLD},
            {value:weekStats.daysWorked, label:"Días trabajados", color:"rgba(255,255,255,0.9)"},
            {value:weekStats.lateCount, label:"Tardanzas", color:weekStats.lateCount>0?"#F87171":"#34D399"},
          ].map(s=>(
            <div key={s.label} className="rounded-2xl p-4 text-center" style={glassStyle}>
              <p className="text-2xl font-extrabold" style={{color:s.color, fontFamily:"'Syne',sans-serif"}}>{s.value}</p>
              <p className="text-xs mt-1" style={{color:"rgba(255,255,255,0.25)", fontFamily:"'DM Sans',sans-serif"}}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Schedule */}
        {schedule && (
          <div className="rounded-2xl p-5" style={glassStyle}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{color:"rgba(255,255,255,0.25)", fontFamily:"'DM Sans',sans-serif"}}>Mi Horario</p>
            <div className="flex gap-1.5 mb-4">
              {days.map((d,i)=>{
                const active = schedule[dayKeys[i]];
                const isToday = i===todayIdx;
                return (
                  <div key={d} className="flex-1 py-2.5 rounded-xl text-center text-xs font-bold"
                    style={isToday&&active
                      ? {background:\`linear-gradient(135deg,\${GOLD},#F0D080)\`, color:"#000", fontFamily:"'Syne',sans-serif"}
                      : active
                      ? {background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.7)", fontFamily:"'Syne',sans-serif"}
                      : {background:"rgba(255,255,255,0.02)", color:"rgba(255,255,255,0.15)", fontFamily:"'Syne',sans-serif"}}>
                    {d}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-center" style={{color:"rgba(255,255,255,0.3)", fontFamily:"'DM Sans',sans-serif"}}>
              {schedule.startTime} — {schedule.endTime}
            </p>
          </div>
        )}

        {/* Recent entries */}
        {recentEntries.length>0 && (
          <div className="rounded-2xl overflow-hidden" style={glassStyle}>
            <div className="px-5 py-3.5" style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{color:"rgba(255,255,255,0.25)", fontFamily:"'DM Sans',sans-serif"}}>Registros recientes</p>
            </div>
            {recentEntries.slice(0,6).map(e=>{
              const ci = new Date(e.clockIn);
              const h = Math.floor((e.durationMin||0)/60);
              const m = (e.durationMin||0)%60;
              return (
                <div key={e.id} className="flex items-center justify-between px-5 py-3.5" style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  <div>
                    <p className="text-sm font-semibold text-white" style={{fontFamily:"'DM Sans',sans-serif"}}>{ci.toLocaleDateString("es",{weekday:"short",day:"numeric",month:"short"})}</p>
                    <p className="text-xs mt-0.5" style={{color:"rgba(255,255,255,0.25)", fontFamily:"'DM Sans',sans-serif"}}>
                      {ci.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}
                      {e.clockOut && \` — \${new Date(e.clockOut).toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}\`}
                    </p>
                  </div>
                  <p className="text-sm font-bold" style={{color:e.durationMin?GOLD:"rgba(255,255,255,0.3)", fontFamily:"'Syne',sans-serif"}}>
                    {e.durationMin?\`\${h}h \${m}m\`:"—"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}`;

writeFileSync("src/app/[locale]/page.tsx", landing);
writeFileSync("src/components/kiosk/KioskClient.tsx", kioskClient);
writeFileSync("src/components/employee/EmployeeDashboardClient.tsx", employeeClient);
console.log("Listo!");

