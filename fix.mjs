import { writeFileSync } from "fs";

writeFileSync("src/components/admin/SettingsClient.tsx", `"use client";
import { useState } from "react";
import PushRegister from "@/components/PushRegister";

const gold = "#C9A84C";

const inputS: React.CSSProperties = {
  width:"100%", background:"#050505", border:"1px solid rgba(255,255,255,0.06)",
  padding:"12px 14px", borderRadius:"12px", color:"white", fontSize:"14px",
  outline:"none", fontFamily:"var(--font-dm-sans)", transition:"border 0.2s", boxSizing:"border-box"
};
const labelS: React.CSSProperties = {
  fontSize:"10px", fontWeight:700, color:"rgba(255,255,255,0.25)",
  textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:"8px", display:"block",
  fontFamily:"var(--font-dm-sans)"
};

function SaveBtn({ onClick, loading }: { onClick: ()=>void; loading: boolean }) {
  return (
    <button onClick={onClick} disabled={loading}
      style={{background:\`linear-gradient(135deg,\${gold},#F0D080)\`,color:"#000",padding:"12px 24px",borderRadius:"12px",fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"13px",border:"none",cursor:"pointer",opacity:loading?0.6:1,transition:"all 0.2s"}}>
      {loading?"Guardando...":"Guardar cambios"}
    </button>
  );
}

function GeneralTab({ org }: { org: any }) {
  const [name, setName] = useState(org?.name||"");
  const [alertEmail, setAlertEmail] = useState(org?.alertEmail||"");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    setSaving(true);
    await Promise.all([
      fetch("/api/settings/org",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name})}),
      fetch("/api/settings/alert-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({alertEmail})}),
    ]);
    setMsg("Guardado"); setSaving(false);
    setTimeout(()=>setMsg(""),3000);
  }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
      <div>
        <label style={labelS}>Nombre de la empresa</label>
        <input style={inputS} value={name} onChange={e=>setName(e.target.value)}
          onFocus={e=>e.currentTarget.style.borderColor=gold} onBlur={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"} />
      </div>
      <div>
        <label style={labelS}>Email de alertas</label>
        <input type="email" style={inputS} value={alertEmail} onChange={e=>setAlertEmail(e.target.value)} placeholder="alerts@empresa.com"
          onFocus={e=>e.currentTarget.style.borderColor=gold} onBlur={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"} />
        <p style={{fontSize:"11px",color:"rgba(255,255,255,0.2)",marginTop:"6px",fontFamily:"var(--font-dm-sans)"}}>Recibe notificaciones de tardanzas y ausencias</p>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"8px"}}>
        {msg && <p style={{fontSize:"12px",color:"#34D399",fontFamily:"var(--font-dm-sans)"}}>{msg}</p>}
        <div style={{marginLeft:"auto"}}><SaveBtn onClick={save} loading={saving} /></div>
      </div>
      <div style={{paddingTop:"16px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
        <PushRegister />
      </div>
    </div>
  );
}

function GeofencingTab({ org }: { org: any }) {
  const [lat, setLat] = useState(org?.lat?.toString()||"");
  const [lng, setLng] = useState(org?.lng?.toString()||"");
  const [radius, setRadius] = useState(org?.geoRadius?.toString()||"100");
  const [detecting, setDetecting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  function detect() {
    if (!navigator.geolocation) { setMsg("GPS no disponible"); return; }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(pos=>{
      setLat(pos.coords.latitude.toFixed(6));
      setLng(pos.coords.longitude.toFixed(6));
      setMsg("Ubicación detectada");
      setDetecting(false);
      setTimeout(()=>setMsg(""),3000);
    }, ()=>{ setMsg("No se pudo obtener ubicación"); setDetecting(false); });
  }

  async function save() {
    if (!lat||!lng) { setMsg("Detecta la ubicación primero"); return; }
    setSaving(true);
    const res = await fetch("/api/settings/geo",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lat:parseFloat(lat),lng:parseFloat(lng),geoRadius:parseInt(radius)})});
    setMsg(res.ok?"Guardado":"Error"); setSaving(false);
    setTimeout(()=>setMsg(""),3000);
  }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
      <div style={{background:"rgba(201,168,76,0.06)",border:"1px solid rgba(201,168,76,0.15)",borderRadius:"14px",padding:"14px 16px"}}>
        <p style={{fontSize:"12px",color:"rgba(201,168,76,0.8)",fontFamily:"var(--font-dm-sans)",lineHeight:1.6}}>
          Los empleados solo pueden fichar desde su móvil si están dentro del radio configurado aquí.
          {org?.lat && <span style={{display:"block",marginTop:"4px",color:"#34D399"}}>Geofencing activo — radio: {radius}m</span>}
          {!org?.lat && <span style={{display:"block",marginTop:"4px",color:"rgba(255,255,255,0.3)"}}>Sin configurar — empleados pueden fichar desde cualquier lugar.</span>}
        </p>
      </div>
      <button onClick={detect} disabled={detecting}
        style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",padding:"12px",color:"rgba(255,255,255,0.7)",fontSize:"13px",fontFamily:"var(--font-dm-sans)",fontWeight:600,cursor:"pointer",transition:"all 0.2s",opacity:detecting?0.6:1}}>
        {detecting?"Detectando...":"Detectar ubicación actual de la empresa"}
      </button>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
        <div>
          <label style={labelS}>Latitud</label>
          <input style={inputS} value={lat} onChange={e=>setLat(e.target.value)} placeholder="18.4861"
            onFocus={e=>e.currentTarget.style.borderColor=gold} onBlur={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"} />
        </div>
        <div>
          <label style={labelS}>Longitud</label>
          <input style={inputS} value={lng} onChange={e=>setLng(e.target.value)} placeholder="-69.9312"
            onFocus={e=>e.currentTarget.style.borderColor=gold} onBlur={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"} />
        </div>
      </div>
      <div>
        <label style={labelS}>Radio permitido: {radius}m</label>
        <input type="range" min="50" max="500" step="50" value={radius} onChange={e=>setRadius(e.target.value)}
          style={{width:"100%",accentColor:gold}} />
        <div style={{display:"flex",justifyContent:"space-between",fontSize:"11px",color:"rgba(255,255,255,0.2)",marginTop:"4px",fontFamily:"var(--font-dm-sans)"}}>
          <span>50m</span><span>500m</span>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"8px"}}>
        {msg && <p style={{fontSize:"12px",color:msg.includes("Error")||msg.includes("pudo")||msg.includes("prime")?"#F87171":"#34D399",fontFamily:"var(--font-dm-sans)"}}>{msg}</p>}
        <div style={{marginLeft:"auto"}}><SaveBtn onClick={save} loading={saving} /></div>
      </div>
    </div>
  );
}

function SecurityTab() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    if (!current||!next) { setMsg("Completa ambos campos"); return; }
    setSaving(true);
    const res = await fetch("/api/settings/password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({currentPassword:current,newPassword:next})});
    const d = await res.json();
    setMsg(res.ok?"Contraseña actualizada":d.error||"Error");
    setSaving(false);
    if (res.ok) { setCurrent(""); setNext(""); }
    setTimeout(()=>setMsg(""),4000);
  }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
      <div>
        <label style={labelS}>Contraseña actual</label>
        <input type="password" style={inputS} value={current} onChange={e=>setCurrent(e.target.value)} placeholder="••••••"
          onFocus={e=>e.currentTarget.style.borderColor=gold} onBlur={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"} />
      </div>
      <div>
        <label style={labelS}>Nueva contraseña</label>
        <input type="password" style={inputS} value={next} onChange={e=>setNext(e.target.value)} placeholder="••••••"
          onFocus={e=>e.currentTarget.style.borderColor=gold} onBlur={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"} />
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"8px"}}>
        {msg && <p style={{fontSize:"12px",color:msg.includes("Error")||msg.includes("ncorr")?"#F87171":"#34D399",fontFamily:"var(--font-dm-sans)"}}>{msg}</p>}
        <div style={{marginLeft:"auto"}}><SaveBtn onClick={save} loading={saving} /></div>
      </div>
    </div>
  );
}

function PlanTab({ org }: { org: any }) {
  const [loading, setLoading] = useState(false);

  async function checkout() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout",{method:"POST"});
    const d = await res.json();
    if (d.url) window.location.href = d.url;
    else setLoading(false);
  }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
      {org?.isPro ? (
        <div style={{background:"rgba(52,211,153,0.06)",border:"1px solid rgba(52,211,153,0.15)",borderRadius:"16px",padding:"24px",textAlign:"center"}}>
          <p style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"16px",color:"#34D399",marginBottom:"6px"}}>Licencia activa</p>
          <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"13px",color:"rgba(255,255,255,0.3)"}}>Acceso completo para siempre. Sin cobros adicionales.</p>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
          <div style={{background:"rgba(201,168,76,0.06)",border:"1px solid rgba(201,168,76,0.15)",borderRadius:"16px",padding:"24px",textAlign:"center"}}>
            <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"12px",color:"rgba(255,255,255,0.3)",marginBottom:"8px"}}>Precio único</p>
            <p style={{fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"48px",color:gold,lineHeight:1}}>$49</p>
            <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:"rgba(255,255,255,0.2)",marginTop:"6px"}}>Un solo pago · Sin suscripciones · Para siempre</p>
          </div>
          <ul style={{listStyle:"none",padding:0}}>
            {["Empleados ilimitados","Kiosk con PIN","Geofencing móvil","Alertas por email","Nómina automática"].map(f=>(
              <li key={f} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",fontSize:"13px",color:"rgba(255,255,255,0.5)",fontFamily:"var(--font-dm-sans)"}}>
                <div style={{width:"5px",height:"5px",background:gold,borderRadius:"50%",flexShrink:0}} />{f}
              </li>
            ))}
          </ul>
          <button onClick={checkout} disabled={loading}
            style={{background:\`linear-gradient(135deg,\${gold},#F0D080)\`,color:"#000",padding:"16px",borderRadius:"14px",fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",border:"none",cursor:"pointer",opacity:loading?0.6:1,transition:"all 0.2s"}}>
            {loading?"Redirigiendo...":"Activar licencia — $49"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function SettingsClient({ org, user }: { org: any; user: any }) {
  const [tab, setTab] = useState("general");

  const tabs = [
    {id:"general",label:"General"},
    {id:"geo",label:"Geofencing"},
    {id:"security",label:"Seguridad"},
    {id:"plan",label:"Plan"},
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
      <style>{\`input:focus,select:focus{outline:none}\`}</style>

      {/* Tab bar */}
      <div style={{display:"flex",gap:"4px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"14px",padding:"4px",width:"fit-content"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{padding:"8px 18px",borderRadius:"11px",fontSize:"12px",fontFamily:"var(--font-dm-sans)",fontWeight:tab===t.id?700:400,border:"none",cursor:"pointer",transition:"all 0.15s",
              background:tab===t.id?"linear-gradient(135deg,#C9A84C,#F0D080)":"transparent",
              color:tab===t.id?"#000":"rgba(255,255,255,0.4)"}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"20px",padding:"28px"}}>
        {tab==="general" && <GeneralTab org={org} />}
        {tab==="geo" && <GeofencingTab org={org} />}
        {tab==="security" && <SecurityTab />}
        {tab==="plan" && <PlanTab org={org} />}
      </div>
    </div>
  );
}`);

console.log("Listo!");

