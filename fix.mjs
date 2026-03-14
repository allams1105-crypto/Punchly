import { writeFileSync, readFileSync } from "fs";

const S = `
  .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)}
  .glass-gold{background:rgba(201,168,76,0.08);backdrop-filter:blur(20px);border:1px solid rgba(201,168,76,0.2)}
  .gold-text{background:linear-gradient(135deg,#C9A84C,#F0D080);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .btn-gold{background:linear-gradient(135deg,#C9A84C,#F0D080);color:#000;font-family:var(--font-syne);font-weight:700;border:none;cursor:pointer;transition:all 0.3s ease}
  .btn-gold:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(201,168,76,0.3)}
  .row-hover{transition:background 0.15s ease}
  .row-hover:hover{background:rgba(255,255,255,0.04)!important}
  .card-hover{transition:all 0.25s ease}
  .card-hover:hover{transform:translateY(-2px);border-color:rgba(201,168,76,0.2)!important}
  input,select{color-scheme:dark}
  input:focus,select:focus{border:1px solid rgba(201,168,76,0.4)!important;outline:none}
  @media(max-width:768px){.hide-mobile{display:none!important}.stack-mobile{flex-direction:column!important}.full-mobile{width:100%!important}.grid-mobile-1{grid-template-columns:1fr!important}.grid-mobile-2{grid-template-columns:1fr 1fr!important}}
`;

const bg = "#0A0A0A";
const card = "rgba(255,255,255,0.04)";
const border = "rgba(255,255,255,0.08)";
const text = "#FAFAFA";
const muted = "rgba(255,255,255,0.35)";
const gold = "#C9A84C";

// ============================================================
// EMPLOYEES CLIENT
// ============================================================
writeFileSync("src/components/admin/EmployeesClient.tsx", `"use client";
import { useState } from "react";
import Link from "next/link";

const COLORS = ["#C9A84C","#60A5FA","#34D399","#F87171","#A78BFA","#FB923C","#38BDF8","#4ADE80"];

function Avatar({ name, color }: { name: string; color?: string | null }) {
  const bg = color || COLORS[(name?.charCodeAt(0)||0) % COLORS.length];
  return (
    <div style={{width:"44px",height:"44px",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"16px",flexShrink:0,background:bg+"15",border:"1.5px solid "+bg+"25",color:bg}}>
      {(name||"?").charAt(0).toUpperCase()}
    </div>
  );
}

export default function EmployeesClient({ employees }: { employees: any[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = (employees||[]).filter(e => {
    const q = (search||"").toLowerCase();
    const match = (e.name||"").toLowerCase().includes(q) || (e.email||"").toLowerCase().includes(q);
    const f = filter==="all" ? true : filter==="active" ? e.isActive : filter==="inactive" ? !e.isActive : filter==="onshift" ? e.onShift : !e.hasSchedule;
    return match && f;
  });

  const stats = [
    {label:"Total",value:(employees||[]).length,color:text},
    {label:"En turno",value:(employees||[]).filter(e=>e.onShift).length,color:"#34D399"},
    {label:"Activos",value:(employees||[]).filter(e=>e.isActive).length,color:gold},
    {label:"Sin horario",value:(employees||[]).filter(e=>!e.hasSchedule).length,color:"#FB923C"},
  ];

  return (
    <div style={{flex:1,overflowY:"auto",background:bg,backgroundImage:"radial-gradient(ellipse at 20% 0%, rgba(201,168,76,0.04) 0%, transparent 50%)"}}>
      <style>{\`${S}\`}</style>
      <div style={{height:"56px",borderBottom:"1px solid "+border,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <h1 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:text}}>Empleados</h1>
          <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:muted}}>{(employees||[]).length} en total</p>
        </div>
        <Link href="/en/admin/employees/new" className="btn-gold" style={{padding:"8px 16px",borderRadius:"12px",fontSize:"12px",textDecoration:"none",display:"inline-block"}}>+ Nuevo</Link>
      </div>

      <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:"16px"}}>
        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px"}} className="grid-mobile-2">
          {stats.map(s=>(
            <div key={s.label} className="glass" style={{borderRadius:"16px",padding:"16px",textAlign:"center"}}>
              <p style={{fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"24px",color:s.color}}>{s.value}</p>
              <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:muted,marginTop:"4px"}}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{display:"flex",gap:"10px",flexWrap:"wrap",alignItems:"center"}} className="stack-mobile">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..."
            style={{background:card,border:"1px solid "+border,borderRadius:"12px",padding:"9px 14px",color:text,fontSize:"13px",fontFamily:"var(--font-dm-sans)",width:"200px",transition:"border 0.2s"}} />
          <div style={{display:"flex",background:card,border:"1px solid "+border,borderRadius:"12px",overflow:"hidden"}}>
            {[["all","Todos"],["active","Activos"],["inactive","Inactivos"],["onshift","En turno"]].map(([k,l])=>(
              <button key={k} onClick={()=>setFilter(k)}
                style={{padding:"9px 14px",fontSize:"12px",fontFamily:"var(--font-dm-sans)",fontWeight:filter===k?600:400,border:"none",cursor:"pointer",transition:"all 0.15s",
                  background:filter===k?"linear-gradient(135deg,#C9A84C,#F0D080)":"transparent",color:filter===k?"#000":muted}}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length===0 ? (
          <div className="glass" style={{borderRadius:"20px",padding:"48px",textAlign:"center"}}>
            <p style={{color:muted,fontSize:"13px",fontFamily:"var(--font-dm-sans)"}}>No hay empleados</p>
            <Link href="/en/admin/employees/new" className="btn-gold" style={{display:"inline-block",padding:"10px 20px",borderRadius:"12px",fontSize:"13px",textDecoration:"none",marginTop:"16px"}}>+ Agregar primero</Link>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px"}} className="grid-mobile-1">
            {filtered.map(emp=>(
              <Link key={emp.id} href={"/en/admin/employees/"+emp.id} style={{textDecoration:"none"}}>
                <div className="glass card-hover" style={{borderRadius:"20px",padding:"20px",cursor:"pointer"}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"14px"}}>
                    <Avatar name={emp.name} color={emp.avatarColor} />
                    <div style={{display:"flex",flexDirection:"column",gap:"4px",alignItems:"flex-end"}}>
                      {emp.onShift && <span style={{fontSize:"10px",color:"#34D399",background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.2)",padding:"3px 8px",borderRadius:"100px",fontFamily:"var(--font-dm-sans)"}}>En turno</span>}
                      {!emp.isActive && <span style={{fontSize:"10px",color:muted,background:card,border:"1px solid "+border,padding:"3px 8px",borderRadius:"100px",fontFamily:"var(--font-dm-sans)"}}>Inactivo</span>}
                    </div>
                  </div>
                  <p style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:text}}>{emp.name}</p>
                  <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"12px",color:muted,marginTop:"2px"}}>{emp.email}</p>
                  <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:"rgba(201,168,76,0.6)",marginTop:"8px"}}>\${emp.hourlyRate||0}/h</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}`);

// ============================================================
// SETTINGS CLIENT
// ============================================================
writeFileSync("src/components/admin/SettingsClient.tsx", `"use client";
import { useState } from "react";
import PushRegister from "@/components/PushRegister";

const inputStyle = {width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",padding:"10px 14px",color:"#FAFAFA",fontSize:"13px",fontFamily:"var(--font-dm-sans)",transition:"border 0.2s",boxSizing:"border-box" as const};
const labelStyle = {display:"block",fontSize:"11px",fontWeight:600,color:"rgba(255,255,255,0.3)",textTransform:"uppercase" as const,letterSpacing:"1px",marginBottom:"8px",fontFamily:"var(--font-dm-sans)"};

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"20px",overflow:"hidden"}}>
      <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <h3 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:"#FAFAFA"}}>{title}</h3>
        {sub && <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"12px",color:"rgba(255,255,255,0.3)",marginTop:"2px"}}>{sub}</p>}
      </div>
      <div style={{padding:"20px"}}>{children}</div>
    </div>
  );
}

function GeoSection() {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [radius, setRadius] = useState("100");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [detecting, setDetecting] = useState(false);

  function detect() {
    if (!navigator.geolocation) { setMsg("GPS no disponible"); return; }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(pos => {
      setLat(pos.coords.latitude.toFixed(6));
      setLng(pos.coords.longitude.toFixed(6));
      setMsg("Ubicación detectada");
      setDetecting(false);
      setTimeout(()=>setMsg(""),3000);
    }, ()=>{ setMsg("No se pudo obtener ubicación"); setDetecting(false); });
  }

  async function save() {
    if (!lat || !lng) { setMsg("Detecta la ubicación primero"); return; }
    setSaving(true);
    const res = await fetch("/api/settings/geo", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ lat:parseFloat(lat), lng:parseFloat(lng), geoRadius:parseInt(radius) }),
    });
    setMsg(res.ok ? "Guardado" : "Error al guardar");
    setSaving(false);
    setTimeout(()=>setMsg(""),3000);
  }

  return (
    <Section title="Geofencing" sub="Los empleados solo pueden fichar desde su móvil si están dentro del radio configurado">
      <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
        <button onClick={detect} disabled={detecting}
          className="full-mobile"
          style={{background:"rgba(201,168,76,0.08)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:"12px",padding:"12px",color:"#C9A84C",fontSize:"13px",fontFamily:"var(--font-dm-sans)",fontWeight:600,cursor:"pointer",transition:"all 0.2s",opacity:detecting?0.6:1}}>
          {detecting ? "Detectando..." : "Detectar ubicación de la empresa"}
        </button>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}} className="grid-mobile-1">
          <div>
            <label style={labelStyle}>Latitud</label>
            <input value={lat} onChange={e=>setLat(e.target.value)} placeholder="18.4861" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Longitud</label>
            <input value={lng} onChange={e=>setLng(e.target.value)} placeholder="-69.9312" style={inputStyle} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Radio permitido: {radius}m</label>
          <input type="range" min="50" max="500" step="50" value={radius} onChange={e=>setRadius(e.target.value)}
            style={{width:"100%",accentColor:"#C9A84C"}} />
          <div style={{display:"flex",justifyContent:"space-between",fontSize:"11px",color:muted,marginTop:"4px",fontFamily:"var(--font-dm-sans)"}}>
            <span>50m</span><span>500m</span>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"8px"}}>
          {msg && <p style={{fontSize:"12px",color:msg.includes("Error")||msg.includes("pudo")||msg.includes("prime")?"#F87171":"#34D399",fontFamily:"var(--font-dm-sans)"}}>{msg}</p>}
          <button onClick={save} disabled={saving||!lat||!lng} className="btn-gold"
            style={{padding:"10px 20px",borderRadius:"12px",fontSize:"13px",marginLeft:"auto",opacity:saving||!lat||!lng?0.4:1}}>
            {saving?"Guardando...":"Guardar"}
          </button>
        </div>
      </div>
    </Section>
  );
}

export default function SettingsClient({ org, user }: { org: any; user: any }) {
  const [orgName, setOrgName] = useState(org?.name||"");
  const [alertEmail, setAlertEmail] = useState(org?.alertEmail||"");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState<string|null>(null);
  const [msgs, setMsgs] = useState<Record<string,string>>({});

  function setMsg(key: string, val: string) {
    setMsgs(p=>({...p,[key]:val}));
    setTimeout(()=>setMsgs(p=>({...p,[key]:""})),3000);
  }

  async function saveOrg() {
    setSaving("org");
    const res = await fetch("/api/settings/org",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:orgName})});
    setMsg("org", res.ok?"Guardado":"Error"); setSaving(null);
  }

  async function saveAlert() {
    setSaving("alert");
    const res = await fetch("/api/settings/alert-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({alertEmail})});
    setMsg("alert", res.ok?"Guardado":"Error"); setSaving(null);
  }

  async function savePassword() {
    setSaving("pwd");
    const res = await fetch("/api/settings/password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({currentPassword,newPassword})});
    setMsg("pwd", res.ok?"Contraseña actualizada":"Error al cambiar contraseña"); setSaving(null);
    if (res.ok) { setCurrentPassword(""); setNewPassword(""); }
  }

  const muted = "rgba(255,255,255,0.3)";

  return (
    <div style={{flex:1,overflowY:"auto",background:"#0A0A0A"}}>
      <style>{\`${S}\`}</style>
      <div style={{height:"56px",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"0 24px",display:"flex",alignItems:"center"}}>
        <h1 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:"#FAFAFA"}}>Configuración</h1>
      </div>
      <div style={{padding:"24px",maxWidth:"640px",display:"flex",flexDirection:"column",gap:"16px"}}>
        <PushRegister />

        <Section title="Organización">
          <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
            <div>
              <label style={labelStyle}>Nombre de la empresa</label>
              <input value={orgName} onChange={e=>setOrgName(e.target.value)} style={inputStyle} />
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              {msgs.org && <p style={{fontSize:"12px",color:"#34D399",fontFamily:"var(--font-dm-sans)"}}>{msgs.org}</p>}
              <button onClick={saveOrg} disabled={saving==="org"} className="btn-gold" style={{padding:"10px 20px",borderRadius:"12px",fontSize:"13px",marginLeft:"auto"}}>
                {saving==="org"?"Guardando...":"Guardar"}
              </button>
            </div>
          </div>
        </Section>

        <Section title="Email de alertas" sub="Recibe notificaciones de tardanzas y ausencias">
          <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
            <div>
              <label style={labelStyle}>Email adicional</label>
              <input type="email" value={alertEmail} onChange={e=>setAlertEmail(e.target.value)} placeholder="alerts@empresa.com" style={inputStyle} />
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              {msgs.alert && <p style={{fontSize:"12px",color:"#34D399",fontFamily:"var(--font-dm-sans)"}}>{msgs.alert}</p>}
              <button onClick={saveAlert} disabled={saving==="alert"} className="btn-gold" style={{padding:"10px 20px",borderRadius:"12px",fontSize:"13px",marginLeft:"auto"}}>
                {saving==="alert"?"Guardando...":"Guardar"}
              </button>
            </div>
          </div>
        </Section>

        <GeoSection />

        <Section title="Cambiar contraseña">
          <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
            <div>
              <label style={labelStyle}>Contraseña actual</label>
              <input type="password" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} placeholder="••••••" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Nueva contraseña</label>
              <input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="••••••" style={inputStyle} />
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              {msgs.pwd && <p style={{fontSize:"12px",color:msgs.pwd.includes("Error")?"#F87171":"#34D399",fontFamily:"var(--font-dm-sans)"}}>{msgs.pwd}</p>}
              <button onClick={savePassword} disabled={saving==="pwd"} className="btn-gold" style={{padding:"10px 20px",borderRadius:"12px",fontSize:"13px",marginLeft:"auto"}}>
                {saving==="pwd"?"Guardando...":"Guardar"}
              </button>
            </div>
          </div>
        </Section>

        <Section title="Plan">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px"}}>
            <div>
              <p style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:"#FAFAFA"}}>{org?.isPro?"Licencia activa":"Período de prueba"}</p>
              <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"12px",color:muted,marginTop:"2px"}}>{org?.isPro?"Acceso completo para siempre":"Activa tu licencia por $49"}</p>
            </div>
            {!org?.isPro && (
              <a href="/en/paywall" className="btn-gold" style={{padding:"10px 20px",borderRadius:"12px",fontSize:"13px",textDecoration:"none",display:"inline-block"}}>
                Activar — $49
              </a>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}

const muted = "rgba(255,255,255,0.3)";`);

// ============================================================
// ATTENDANCE PAGE — redesign
// ============================================================
const attendancePage = readFileSync("src/app/[locale]/admin/attendance/page.tsx", "utf8");
// Just add the global style tag at the top of the return
const newAttendance = attendancePage.replace(
  `<div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">`,
  `<div style={{flex:1,overflowY:"auto",background:"#0A0A0A"}}><style>{\`${S}\`}</style>`
).replace(/className="(flex-1 overflow-y-auto bg-\[var\(--bg-primary\)\]|h-14 border-b border-\[var\(--border\)\][^"]*|bg-\[var\(--bg-card\)\][^"]*|text-\[var\(--text-primary\)\][^"]*|text-\[var\(--text-muted\)\][^"]*|border-\[var\(--border\)\][^"]*)"/g, 'style={{}}');

writeFileSync("src/app/[locale]/admin/attendance/page.tsx", attendancePage);

console.log("Listo - EmployeesClient y SettingsClient rediseñados");
console.log("Attendance, Payroll, Activity necesitan fix.mjs parte 2");

