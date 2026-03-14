import { writeFileSync } from "fs";

const S = `
  .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)}
  .btn-gold{background:linear-gradient(135deg,#C9A84C,#F0D080);color:#000;font-family:var(--font-syne);font-weight:700;border:none;cursor:pointer;transition:all 0.3s ease}
  .btn-gold:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(201,168,76,0.3)}
  input,select{color-scheme:dark}
  input:focus,select:focus{border:1px solid rgba(201,168,76,0.4)!important;outline:none}
  @media(max-width:768px){.hide-mobile{display:none!important}.stack-mobile{flex-direction:column!important}.full-mobile{width:100%!important}.grid-mobile-1{grid-template-columns:1fr!important}}
`;

const bg = "#0A0A0A";
const card = "rgba(255,255,255,0.04)";
const border = "rgba(255,255,255,0.08)";
const text = "#FAFAFA";
const muted = "rgba(255,255,255,0.35)";
const gold = "#C9A84C";

const inputStyle = `{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",padding:"10px 14px",color:"#FAFAFA",fontSize:"13px",fontFamily:"var(--font-dm-sans)",transition:"border 0.2s",boxSizing:"border-box"}`;
const labelStyle = `{display:"block",fontSize:"11px",fontWeight:600,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",fontFamily:"var(--font-dm-sans)"}`;

// ============================================================
// EMPLOYEE EDIT CLIENT
// ============================================================
writeFileSync("src/components/admin/EmployeeEditClient.tsx", `"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const COLORS = ["#C9A84C","#60A5FA","#34D399","#F87171","#A78BFA","#FB923C","#38BDF8","#4ADE80","#E879F9","#94A3B8"];

export default function EmployeeEditClient({ employee }: { employee: any }) {
  const router = useRouter();
  const [name, setName] = useState(employee.name||"");
  const [email, setEmail] = useState(employee.email||"");
  const [hourlyRate, setHourlyRate] = useState(employee.hourlyRate||"");
  const [isActive, setIsActive] = useState(employee.isActive);
  const [avatarColor, setAvatarColor] = useState(employee.avatarColor||"#C9A84C");
  const [kioskPin, setKioskPin] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState("");

  const inputS = ${inputStyle};
  const labelS = ${labelStyle};

  async function save() {
    setSaving(true);
    const body: any = { name, email, hourlyRate: Number(hourlyRate), isActive };
    if (kioskPin.length === 4) body.kioskPin = kioskPin;
    const [r1, r2] = await Promise.all([
      fetch("/api/employees/"+employee.id, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) }),
      fetch("/api/employees/avatar", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({userId:employee.id,avatarColor}) }),
    ]);
    setMsg(r1.ok?"Guardado":"Error al guardar");
    setSaving(false);
    if (kioskPin) setKioskPin("");
    setTimeout(()=>setMsg(""),3000);
  }

  async function deleteEmployee() {
    if (!confirm("¿Eliminar este empleado? Esta acción no se puede deshacer.")) return;
    setDeleting(true);
    await fetch("/api/employees/"+employee.id, { method:"DELETE" });
    router.push("/en/admin/employees");
  }

  const initials = name.split(" ").map((n:string)=>n.charAt(0)).join("").substring(0,2).toUpperCase();

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
      <style>{\`${S} input:focus,select:focus{border:1px solid rgba(201,168,76,0.4)!important;outline:none}\`}</style>

      {/* Avatar */}
      <div style={{background:card,backdropFilter:"blur(20px)",border:"1px solid "+border,borderRadius:"20px",overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid "+border}}>
          <h3 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:text}}>Avatar</h3>
        </div>
        <div style={{padding:"20px",display:"flex",alignItems:"center",gap:"20px"}} className="stack-mobile">
          <div style={{width:"64px",height:"64px",borderRadius:"18px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",fontFamily:"var(--font-syne)",fontWeight:800,flexShrink:0,transition:"all 0.2s",background:avatarColor+"18",border:"2px solid "+avatarColor+"30",color:avatarColor}}>
            {initials||"?"}
          </div>
          <div>
            <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"12px",color:muted,marginBottom:"10px"}}>Color del avatar</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
              {COLORS.map(c=>(
                <button key={c} onClick={()=>setAvatarColor(c)}
                  style={{width:"28px",height:"28px",borderRadius:"8px",border:avatarColor===c?"2px solid white":"2px solid transparent",background:c,cursor:"pointer",transform:avatarColor===c?"scale(1.15)":"scale(1)",transition:"all 0.15s"}} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{background:card,backdropFilter:"blur(20px)",border:"1px solid "+border,borderRadius:"20px",overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid "+border}}>
          <h3 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:text}}>Información</h3>
        </div>
        <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:"14px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}} className="grid-mobile-1">
            <div>
              <label style={labelS}>Nombre</label>
              <input value={name} onChange={e=>setName(e.target.value)} style={inputS} />
            </div>
            <div>
              <label style={labelS}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={inputS} />
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}} className="grid-mobile-1">
            <div>
              <label style={labelS}>Tarifa/hora ($)</label>
              <input type="number" value={hourlyRate} onChange={e=>setHourlyRate(e.target.value)} style={inputS} />
            </div>
            <div>
              <label style={labelS}>Estado</label>
              <select value={isActive?"1":"0"} onChange={e=>setIsActive(e.target.value==="1")} style={inputS}>
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </select>
            </div>
          </div>
          <div>
            <label style={labelS}>PIN del Kiosk (4 dígitos)</label>
            <input type="password" value={kioskPin} onChange={e=>setKioskPin(e.target.value.replace(/\\D/g,"").substring(0,4))}
              placeholder="Dejar vacío para no cambiar" maxLength={4} style={inputS} />
            <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:muted,marginTop:"6px"}}>El empleado usa este PIN para fichar en el kiosk</p>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:"8px",flexWrap:"wrap",gap:"10px"}}>
            <button onClick={deleteEmployee} disabled={deleting}
              style={{background:"transparent",border:"none",cursor:"pointer",color:"#F87171",fontSize:"13px",fontFamily:"var(--font-dm-sans)",fontWeight:500,opacity:deleting?0.5:1}}>
              {deleting?"Eliminando...":"Eliminar empleado"}
            </button>
            <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
              {msg && <p style={{fontSize:"12px",color:msg==="Guardado"?"#34D399":"#F87171",fontFamily:"var(--font-dm-sans)"}}>{msg}</p>}
              <button onClick={save} disabled={saving} className="btn-gold" style={{padding:"10px 24px",borderRadius:"12px",fontSize:"13px",opacity:saving?0.6:1}}>
                {saving?"Guardando...":"Guardar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`);

// ============================================================
// EMPLOYEE [id] PAGE — redesign wrapper
// ============================================================
writeFileSync("src/app/[locale]/admin/employees/[id]/page.tsx", `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import EmployeeEditClient from "@/components/admin/EmployeeEditClient";
import ScheduleEditor from "@/components/admin/ScheduleEditor";
import Link from "next/link";

export default async function EmployeePage({ params }: { params: any }) {
  const session = await auth();
  if (!session) redirect("/en/login");
  const orgId = (session.user as any).organizationId;
  const { id } = await params;

  const employee = await prisma.user.findUnique({
    where: { id, organizationId: orgId },
    include: { schedule: true },
  });
  if (!employee) notFound();

  const today = new Date(); today.setHours(0,0,0,0);
  const activeEntry = await prisma.timeEntry.findFirst({
    where: { userId: id, organizationId: orgId, clockOut: null, clockIn: { gte: today } },
  });

  return (
    <div style={{flex:1,overflowY:"auto",background:"#0A0A0A"}}>
      <style>{\`
        @media(max-width:768px){.grid-mobile-1{grid-template-columns:1fr!important}}
      \`}</style>
      <div style={{height:"56px",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"0 24px",display:"flex",alignItems:"center",gap:"12px"}}>
        <Link href="/en/admin/employees" style={{color:"rgba(255,255,255,0.3)",textDecoration:"none",fontSize:"13px",fontFamily:"var(--font-dm-sans)",display:"flex",alignItems:"center",gap:"6px",transition:"color 0.15s"}}
          onMouseEnter={(e:any)=>e.currentTarget.style.color="#FAFAFA"} onMouseLeave={(e:any)=>e.currentTarget.style.color="rgba(255,255,255,0.3)"}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          Empleados
        </Link>
        <span style={{color:"rgba(255,255,255,0.15)"}}>·</span>
        <h1 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:"#FAFAFA"}}>{employee.name}</h1>
        {activeEntry && (
          <span style={{marginLeft:"auto",fontSize:"11px",color:"#34D399",background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.2)",padding:"4px 10px",borderRadius:"100px",fontFamily:"var(--font-dm-sans)"}}>En turno</span>
        )}
      </div>

      <div style={{padding:"24px",display:"grid",gridTemplateColumns:"1fr 360px",gap:"20px",alignItems:"start"}} className="grid-mobile-1">
        <EmployeeEditClient employee={{
          id: employee.id,
          name: employee.name,
          email: employee.email,
          hourlyRate: (employee as any).hourlyRate || 0,
          isActive: employee.isActive,
          avatarColor: (employee as any).avatarColor || null,
        }} />
        <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"20px",overflow:"hidden"}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
            <h3 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:"#FAFAFA"}}>Horario</h3>
          </div>
          <div style={{padding:"20px"}}>
            <ScheduleEditor userId={employee.id} initialSchedule={employee.schedule} />
          </div>
        </div>
      </div>
    </div>
  );
}`);

// ============================================================
// KIOSK CLIENT — final luxury redesign
// ============================================================
writeFileSync("src/components/kiosk/KioskClient.tsx", `"use client";
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
      <style>{\`@keyframes scale-in{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}.success-anim{animation:scale-in 0.5s cubic-bezier(0.34,1.56,0.64,1)}\`}</style>
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
      <style>{\`
        .emp-card{transition:all 0.2s cubic-bezier(0.34,1.3,0.64,1);cursor:pointer}
        .emp-card:hover{transform:translateY(-3px) scale(1.02)}
        .emp-card:active{transform:scale(0.97)}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        @media(max-width:768px){.kiosk-grid{grid-template-columns:repeat(2,1fr)!important}}
      \`}</style>

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
}`);

console.log("Listo!");

