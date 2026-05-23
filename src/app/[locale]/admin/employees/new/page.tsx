"use client";
import { useState, useRef } from "react";
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
  // Photo state
  const [photo, setPhoto] = useState<string|null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen no debe pesar más de 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;
        
        canvas.width = 150;
        canvas.height = 150;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, startX, startY, size, size, 0, 0, 150, 150);
          const base64 = canvas.toDataURL("image/jpeg", 0.7);
          setPhoto(base64);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
  async function save() {
    if (!name || !email) { setError("Nombre y email son requeridos"); return; }
    if (!password) { setError("La contraseña es requerida"); return; }
    if (kioskPin && kioskPin.length !== 4) { setError("El PIN debe tener 4 dígitos"); return; }
    setSaving(true); setError("");
    const res = await fetch("/api/employees/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, hourlyRate: Number(hourlyRate)||0, password, kioskPin, avatarUrl: photo }),
    });
    let data;
    try {
      if (res.headers.get("content-type")?.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Server response:", text);
        throw new Error("Respuesta no válida del servidor");
      }
    } catch (e) {
      setSaving(false);
      setError("Error en el servidor (payload muy grande o error interno).");
      return;
    }

    setSaving(false);
    if (!res.ok) { setError(data?.error || "Error al crear empleado"); return; }
    router.push("/en/admin/employees");
  }

  const inputS: React.CSSProperties = {
    width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
    borderRadius:"12px", padding:"10px 14px", color:"#FAFAFA", fontSize:"13px",
    fontFamily:"var(--font-inter)", outline:"none", transition:"border 0.2s", boxSizing:"border-box"
  };
  const labelS: React.CSSProperties = {
    display:"block", fontSize:"11px", fontWeight:600, color:"rgba(255,255,255,0.3)",
    textTransform:"uppercase", letterSpacing:"1px", marginBottom:"8px", fontFamily:"var(--font-inter)"
  };

  return (
    <div style={{flex:1,overflowY:"auto",background:"#0A0A0A"}}>
      <style>{`input:focus{border-color:rgba(59, 130, 246,0.4)!important}`}</style>
      <div style={{height:"56px",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <h1 style={{fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"14px",color:"#FAFAFA"}}>Nuevo Empleado</h1>
      </div>
      <div style={{maxWidth:"520px",margin:"0 auto",padding:"24px"}}>
        <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"20px",overflow:"hidden"}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
            <h2 style={{fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"14px",color:"#FAFAFA"}}>Datos del empleado</h2>
          </div>
          <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:"14px"}}>
            
            {/* Foto de Perfil */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"12px",marginBottom:"8px"}}>
              <div style={{position:"relative",width:"100px",height:"100px",borderRadius:"50%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
                {photo ? (
                  <img src={photo} alt="Empleado" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                ) : (
                  <svg width="32" height="32" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                )}
              </div>
              
              <div style={{display:"flex",gap:"8px"}}>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} style={{display:"none"}} />
                <button onClick={() => fileInputRef.current?.click()} style={{background:"rgba(255,255,255,0.05)",color:"#FFF",border:"1px solid rgba(255,255,255,0.1)",padding:"6px 16px",borderRadius:"100px",fontSize:"12px",fontWeight:600,fontFamily:"var(--font-inter)",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"}}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                  {photo ? "Cambiar foto" : "Subir foto"}
                </button>
              </div>
            </div>
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
                <p style={{fontSize:"10px",color:"rgba(255,255,255,0.2)",marginTop:"4px",fontFamily:"var(--font-inter)"}}>El empleado usará esto para iniciar sesión</p>
              </div>
              <div>
                <label style={labelS}>PIN del Kiosk (4 dígitos)</label>
                <input type="password" value={kioskPin} onChange={e=>setKioskPin(e.target.value.replace(/D/g,"").substring(0,4))} placeholder="1234" maxLength={4} style={inputS} />
                <p style={{fontSize:"10px",color:"rgba(255,255,255,0.2)",marginTop:"4px",fontFamily:"var(--font-inter)"}}>PIN para fichar en el kiosk</p>
              </div>
            </div>
            <div>
              <label style={labelS}>Tarifa por hora ($)</label>
              <input type="number" value={hourlyRate} onChange={e=>setHourlyRate(e.target.value)} placeholder="15.00" style={{...inputS,width:"50%"}} />
            </div>
            {error && <p style={{color:"#F87171",fontSize:"13px",fontFamily:"var(--font-inter)"}}>{error}</p>}
            <div style={{display:"flex",gap:"10px",paddingTop:"8px"}}>
              <button onClick={()=>router.back()} style={{flex:1,padding:"12px",borderRadius:"12px",border:"1px solid rgba(255,255,255,0.08)",background:"transparent",color:"rgba(255,255,255,0.4)",fontSize:"13px",fontFamily:"var(--font-inter)",cursor:"pointer"}}>
                Cancelar
              </button>
              <button onClick={save} disabled={saving}
                style={{flex:1,padding:"12px",borderRadius:"12px",background:"var(--accent)",color:"#000",fontSize:"13px",fontFamily:"var(--font-inter)",fontWeight:700,border:"none",cursor:"pointer",opacity:saving?0.6:1}}>
                {saving?"Guardando...":"Crear empleado"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}