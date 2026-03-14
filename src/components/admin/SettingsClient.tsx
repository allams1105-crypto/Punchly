"use client";
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
      <style>{`
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
`}</style>
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

const muted = "rgba(255,255,255,0.3)";