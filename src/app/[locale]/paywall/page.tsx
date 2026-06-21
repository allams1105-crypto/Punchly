"use client";
import { useState } from "react";

export default function PaywallPage() {
  const [loading, setLoading] = useState(false);

  function handleCheckout() {
    window.location.href = "https://wa.me/18098686257?text=Hola,%20mi%20prueba%20ha%20terminado%20y%20quiero%20activar%20mi%20licencia";
  }

  return (
    <div style={{minHeight:"100vh",background:"var(--bg-primary)",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",
      backgroundImage:"radial-gradient(ellipse at 50% 0%, rgba(59, 130, 246,0.07) 0%, transparent 60%)"}}>
      <style>{`
        .glass{background:var(--bg-card);border:1px solid var(--border);box-shadow:0 10px 40px rgba(0,0,0,0.05)}
        .primary-text{color:var(--text-primary)}
        .btn-primary{background:var(--accent);color:#fff;font-family:var(--font-inter);font-weight:600;transition:all 0.2s ease;text-decoration:none;display:inline-block;border:1px solid var(--accent-dark);border-radius:12px}
        .btn-primary:hover{background:var(--accent-dark);transform:translateY(-1px);box-shadow:0 4px 12px rgba(59, 130, 246, 0.25)}
      `}</style>
      <div style={{width:"100%",maxWidth:"440px",textAlign:"center"}}>
        <img src="/logo.png" alt="Punchly" style={{width:"56px",height:"56px",borderRadius:"50%",margin:"0 auto 24px",objectFit:"contain"}} />
        <h1 style={{fontFamily:"var(--font-inter)",fontWeight:800,fontSize:"32px",color:"var(--text-primary)",marginBottom:"12px"}}>Tu prueba ha terminado</h1>
        <p style={{color:"var(--text-muted)",fontSize:"15px",marginBottom:"32px",fontFamily:"var(--font-inter)",lineHeight:1.6}}>Tu periodo de prueba de 14 días ha finalizado. Por favor contacta a un asesor para activar tu plan y continuar utilizando la plataforma sin interrupciones.</p>

        <div className="glass" style={{borderRadius:"24px",padding:"36px",marginBottom:"20px"}}>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:"8px",marginBottom:"6px"}}>
            <span className="primary-text" style={{fontFamily:"var(--font-inter)",fontSize:"48px",fontWeight:800,lineHeight:1}}>Planes desde RD$500</span>
            <span style={{color:"var(--text-muted)",marginBottom:"10px",fontSize:"14px",fontFamily:"var(--font-inter)"}}>/mes</span>
          </div>
          <p style={{color:"var(--text-muted)",fontSize:"13px",marginBottom:"24px",fontFamily:"var(--font-inter)"}}>Renovación mensual. Facturación local.</p>
          <ul style={{listStyle:"none",padding:0,marginBottom:"28px",textAlign:"left"}}>
            {["Kiosko web inteligente","Alertas de tardanza","Reporte por WhatsApp","Exportación a Excel","Soporte por WhatsApp"].map(f=>(
              <li key={f} style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 0",borderBottom:"1px solid var(--border)",color:"var(--text-muted)",fontSize:"14px",fontFamily:"var(--font-inter)"}}>
                <svg width="16" height="16" fill="none" stroke="var(--accent)" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                {f}
              </li>
            ))}
          </ul>
          <button onClick={handleCheckout} className="btn-primary"
            style={{width:"100%",padding:"16px",borderRadius:"14px",fontSize:"15px",border:"none",cursor:"pointer"}}>
            Contactar a un agente
          </button>
        </div>
      </div>
    </div>
  );
}