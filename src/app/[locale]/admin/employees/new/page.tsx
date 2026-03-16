"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEmployeePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [password, setPassword] = useState("");
  const [kioskPin, setKioskPin] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    if (!name || !email) { setError("Nombre y email son requeridos"); return; }
    if (!password) { setError("La contraseña es requerida"); return; }
    if (kioskPin && kioskPin.length !== 4) { setError("El PIN debe tener 4 dígitos"); return; }
    setSaving(true); setError("");
    const res = await fetch("/api/employees/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, hourlyRate: Number(hourlyRate)||0, password, kioskPin }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || "Error al crear empleado"); return; }
    router.push("/en/admin/employees");
  }

  const inputS: React.CSSProperties = {
    width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
    borderRadius:"12px", padding:"10px 14px", color:"#FAFAFA", fontSize:"13px",
    fontFamily:"var(--font-dm-sans)", outline:"none", transition:"border 0.2s", boxSizing:"border-box"
  };
  const labelS: React.CSSProperties = {
    display:"block", fontSize:"11px", fontWeight:600, color:"rgba(255,255,255,0.3)",
    textTransform:"uppercase", letterSpacing:"1px", marginBottom:"8px", fontFamily:"var(--font-dm-sans)"
  };

  return (
    <div style={{flex:1,overflowY:"auto",background:"#0A0A0A"}}>
      <style>{`input:focus{border-color:rgba(201,168,76,0.4)!important}`}</style>
      <div style={{height:"56px",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <h1 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:"#FAFAFA"}}>Nuevo Empleado</h1>
      </div>
      <div style={{maxWidth:"520px",margin:"0 auto",padding:"24px"}}>
        <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"20px",overflow:"hidden"}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
            <h2 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:"#FAFAFA"}}>Datos del empleado</h2>
          </div>
          <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:"14px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              <div>
                <label style={labelS}>Nombre completo</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Juan Pérez" style={inputS} />
              </div>
              <div>
                <label style={labelS}>Email</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="juan@empresa.com" style={inputS} />
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              <div>
                <label style={labelS}>Contraseña (para login)</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••" style={inputS} />
                <p style={{fontSize:"10px",color:"rgba(255,255,255,0.2)",marginTop:"4px",fontFamily:"var(--font-dm-sans)"}}>El empleado usará esto para iniciar sesión</p>
              </div>
              <div>
                <label style={labelS}>PIN del Kiosk (4 dígitos)</label>
                <input type="password" value={kioskPin} onChange={e=>setKioskPin(e.target.value.replace(/D/g,"").substring(0,4))} placeholder="1234" maxLength={4} style={inputS} />
                <p style={{fontSize:"10px",color:"rgba(255,255,255,0.2)",marginTop:"4px",fontFamily:"var(--font-dm-sans)"}}>PIN para fichar en el kiosk</p>
              </div>
            </div>
            <div>
              <label style={labelS}>Tarifa por hora ($)</label>
              <input type="number" value={hourlyRate} onChange={e=>setHourlyRate(e.target.value)} placeholder="15.00" style={{...inputS,width:"50%"}} />
            </div>
            {error && <p style={{color:"#F87171",fontSize:"13px",fontFamily:"var(--font-dm-sans)"}}>{error}</p>}
            <div style={{display:"flex",gap:"10px",paddingTop:"8px"}}>
              <button onClick={()=>router.back()} style={{flex:1,padding:"12px",borderRadius:"12px",border:"1px solid rgba(255,255,255,0.08)",background:"transparent",color:"rgba(255,255,255,0.4)",fontSize:"13px",fontFamily:"var(--font-dm-sans)",cursor:"pointer"}}>
                Cancelar
              </button>
              <button onClick={save} disabled={saving}
                style={{flex:1,padding:"12px",borderRadius:"12px",background:"linear-gradient(135deg,#C9A84C,#F0D080)",color:"#000",fontSize:"13px",fontFamily:"var(--font-syne)",fontWeight:700,border:"none",cursor:"pointer",opacity:saving?0.6:1}}>
                {saving?"Guardando...":"Crear empleado"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}