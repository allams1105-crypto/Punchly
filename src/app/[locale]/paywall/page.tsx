"use client";
import { useState } from "react";

export default function PaywallPage() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", { method:"POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }

  return (
    <div style={{minHeight:"100vh",background:"#0A0A0A",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",
      backgroundImage:"radial-gradient(ellipse at 50% 0%, rgba(59, 130, 246,0.07) 0%, transparent 60%)"}}>
      <style>{`
        .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)}
        .primary-text{background:var(--accent);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .btn-primary{background:var(--accent);color:#fff;font-family:var(--font-inter);font-weight:600;transition:all 0.2s ease;text-decoration:none;display:inline-block;border:1px solid var(--accent-dark);border-radius:12px}
        .btn-primary:hover{background:var(--accent-dark);transform:translateY(-1px);box-shadow:0 4px 12px rgba(59, 130, 246, 0.25)}
      `}</style>
      <div style={{width:"100%",maxWidth:"440px",textAlign:"center"}}>
        <div style={{width:"44px",height:"44px",borderRadius:"14px",background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",boxShadow:"0 0 30px rgba(59, 130, 246,0.3)"}}>
          <span style={{color:"#000",fontWeight:900,fontSize:"18px",fontFamily:"var(--font-inter)"}}>P</span>
        </div>
        <h1 style={{fontFamily:"var(--font-inter)",fontWeight:800,fontSize:"32px",color:"#FAFAFA",marginBottom:"8px"}}>Tu prueba ha terminado</h1>
        <p style={{color:"rgba(255,255,255,0.3)",fontSize:"14px",marginBottom:"32px",fontFamily:"var(--font-inter)"}}>Activa tu licencia para seguir usando Punchly.Clock</p>

        <div className="glass" style={{borderRadius:"24px",padding:"36px",marginBottom:"20px"}}>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:"8px",marginBottom:"6px"}}>
            <span className="primary-text" style={{fontFamily:"var(--font-inter)",fontSize:"72px",fontWeight:800,lineHeight:1}}>$49</span>
            <span style={{color:"rgba(255,255,255,0.2)",marginBottom:"10px",fontSize:"14px",fontFamily:"var(--font-inter)"}}>pago único</span>
          </div>
          <p style={{color:"rgba(255,255,255,0.2)",fontSize:"12px",marginBottom:"24px",fontFamily:"var(--font-inter)"}}>Sin mensualidades. Sin sorpresas.</p>
          <ul style={{listStyle:"none",padding:0,marginBottom:"28px",textAlign:"left"}}>
            {["Empleados ilimitados","Kiosk con PIN","Geofencing móvil","Alertas por email","Nómina automática","Soporte incluido"].map(f=>(
              <li key={f} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.5)",fontSize:"13px",fontFamily:"var(--font-inter)"}}>
                <div style={{width:"5px",height:"5px",background:"var(--accent)",borderRadius:"50%",flexShrink:0}} />
                {f}
              </li>
            ))}
          </ul>
          <button onClick={handleCheckout} disabled={loading} className="btn-primary"
            style={{width:"100%",padding:"16px",borderRadius:"14px",fontSize:"15px",border:"none",cursor:"pointer",opacity:loading?0.7:1}}>
            {loading?"Redirigiendo...":"Activar licencia — $49"}
          </button>
        </div>
      </div>
    </div>
  );
}