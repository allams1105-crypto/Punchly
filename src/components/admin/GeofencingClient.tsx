"use client";
import { LocationMap } from "@/components/ui/expand-map";
import { useState } from "react";

const primary = "var(--accent)";

const inputS: React.CSSProperties = {
  width:"100%", background:"var(--bg-primary)", border:"1px solid var(--border)",
  padding:"16px", borderRadius:"14px", color:"var(--text-primary)", fontSize:"14px",
  outline:"none", fontFamily:"var(--font-inter)", transition:"border 0.2s", boxSizing:"border-box"
};
const labelS: React.CSSProperties = {
  fontSize:"11px", fontWeight:700, color:"var(--text-muted)",
  textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:"10px", display:"block",
  fontFamily:"var(--font-inter)"
};

export default function GeofencingClient({ org }: { org: any }) {
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
    setMsg(res.ok?"Ubicación guardada exitosamente":"Error al guardar"); setSaving(false);
    setTimeout(()=>setMsg(""),4000);
  }

  return (
    <div style={{background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:"24px",padding:"32px",display:"flex",flexDirection:"column",gap:"24px",boxShadow:"0 10px 40px rgba(0,0,0,0.05)"}}>
      <div style={{background:"var(--bg-primary)",border:"1px solid var(--border)",borderRadius:"16px",padding:"20px"}}>
        <p style={{fontSize:"14px",color:"var(--accent)",fontFamily:"var(--font-inter)",lineHeight:1.6,fontWeight:500}}>
          Los empleados solo podrán registrar asistencia desde su móvil si están físicamente dentro del radio que configures aquí.
          {org?.lat && <span style={{display:"block",marginTop:"8px",color:"#34D399",fontWeight:700}}>Geofencing ACTIVO — Radio: {radius}m</span>}
          {!org?.lat && <span style={{display:"block",marginTop:"8px",color:"var(--text-muted)"}}>Sin configurar — Pueden fichar desde cualquier lugar.</span>}
        </p>
      </div>

      <div style={{borderRadius:"16px",overflow:"hidden",border:"1px solid var(--border)"}}>
        <LocationMap
          location={lat && lng ? "Centro de Trabajo" : "Sin ubicación"}
          coordinates={lat && lng ? `${lat}, ${lng}` : "Detecta o ingresa coordenadas"}
        />
      </div>

      <button onClick={detect} disabled={detecting}
        style={{background:"var(--bg-primary)",border:"1px solid var(--border)",borderRadius:"14px",padding:"16px",color:"var(--text-primary)",fontSize:"14px",fontFamily:"var(--font-inter)",fontWeight:600,cursor:"pointer",transition:"all 0.2s",opacity:detecting?0.6:1,display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        {detecting?"Detectando...":"Detectar mi ubicación actual"}
      </button>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"}}>
        <div>
          <label style={labelS}>Latitud</label>
          <input style={inputS} value={lat} onChange={e=>setLat(e.target.value)} placeholder="18.4861"
            onFocus={e=>e.currentTarget.style.borderColor=primary} onBlur={e=>e.currentTarget.style.borderColor="var(--border)"} />
        </div>
        <div>
          <label style={labelS}>Longitud</label>
          <input style={inputS} value={lng} onChange={e=>setLng(e.target.value)} placeholder="-69.9312"
            onFocus={e=>e.currentTarget.style.borderColor=primary} onBlur={e=>e.currentTarget.style.borderColor="var(--border)"} />
        </div>
      </div>

      <div>
        <label style={labelS}>Radio permitido: <span style={{color:primary}}>{radius} metros</span></label>
        <input type="range" min="50" max="1000" step="50" value={radius} onChange={e=>setRadius(e.target.value)}
          style={{width:"100%",accentColor:primary,height:"6px",background:"var(--border)",borderRadius:"10px",outline:"none"}} />
        <div style={{display:"flex",justifyContent:"space-between",fontSize:"12px",color:"var(--text-muted)",marginTop:"8px",fontFamily:"var(--font-inter)",fontWeight:500}}>
          <span>50m</span><span>1000m</span>
        </div>
      </div>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"12px",borderTop:"1px solid var(--border)",paddingTop:"24px"}}>
        {msg ? <p style={{fontSize:"14px",fontWeight:600,color:msg.includes("Error")||msg.includes("pudo")||msg.includes("prime")?"#F87171":"#34D399",fontFamily:"var(--font-inter)"}}>{msg}</p> : <span/>}
        <button onClick={save} disabled={saving}
          style={{background:`linear-gradient(135deg,${primary},var(--accent-dark))`,color:"white",padding:"16px 32px",borderRadius:"14px",fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"14px",border:"none",cursor:"pointer",opacity:saving?0.6:1,transition:"all 0.2s",boxShadow:"0 10px 30px rgba(59, 130, 246,0.3)"}}>
          {saving?"Guardando...":"Guardar Ubicación"}
        </button>
      </div>
    </div>
  );
}
