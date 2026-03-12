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
      backgroundImage:"radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 60%)"}}>
      <style>{`
        .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)}
        .gold-text{background:linear-gradient(135deg,#C9A84C,#F0D080);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .btn-gold{background:linear-gradient(135deg,#C9A84C,#F0D080);color:#000;font-family:var(--font-syne);font-weight:700;transition:all 0.3s ease}
        .btn-gold:hover{transform:translateY(-2px);box-shadow:0 20px 40px rgba(201,168,76,0.3)}
      `}</style>
      <div style={{width:"100%",maxWidth:"440px",textAlign:"center"}}>
        <div style={{width:"44px",height:"44px",borderRadius:"14px",background:"linear-gradient(135deg,#C9A84C,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",boxShadow:"0 0 30px rgba(201,168,76,0.3)"}}>
          <span style={{color:"#000",fontWeight:900,fontSize:"18px",fontFamily:"var(--font-syne)"}}>P</span>
        </div>
        <h1 style={{fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"32px",color:"#FAFAFA",marginBottom:"8px"}}>Tu prueba ha terminado</h1>
        <p style={{color:"rgba(255,255,255,0.3)",fontSize:"14px",marginBottom:"32px",fontFamily:"var(--font-dm-sans)"}}>Activa tu licencia para seguir usando Punchly.Clock</p>

        <div className="glass" style={{borderRadius:"24px",padding:"36px",marginBottom:"20px"}}>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:"8px",marginBottom:"6px"}}>
            <span className="gold-text" style={{fontFamily:"var(--font-syne)",fontSize:"72px",fontWeight:800,lineHeight:1}}>$49</span>
            <span style={{color:"rgba(255,255,255,0.2)",marginBottom:"10px",fontSize:"14px",fontFamily:"var(--font-dm-sans)"}}>pago único</span>
          </div>
          <p style={{color:"rgba(255,255,255,0.2)",fontSize:"12px",marginBottom:"24px",fontFamily:"var(--font-dm-sans)"}}>Sin mensualidades. Sin sorpresas.</p>
          <ul style={{listStyle:"none",padding:0,marginBottom:"28px",textAlign:"left"}}>
            {["Empleados ilimitados","Kiosk con PIN","Geofencing móvil","Alertas por email","Nómina automática","Soporte incluido"].map(f=>(
              <li key={f} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.5)",fontSize:"13px",fontFamily:"var(--font-dm-sans)"}}>
                <div style={{width:"5px",height:"5px",background:"#C9A84C",borderRadius:"50%",flexShrink:0}} />
                {f}
              </li>
            ))}
          </ul>
          <button onClick={handleCheckout} disabled={loading} className="btn-gold"
            style={{width:"100%",padding:"16px",borderRadius:"14px",fontSize:"15px",border:"none",cursor:"pointer",opacity:loading?0.7:1}}>
            {loading?"Redirigiendo...":"Activar licencia — $49"}
          </button>
        </div>
      </div>
    </div>
  );
}