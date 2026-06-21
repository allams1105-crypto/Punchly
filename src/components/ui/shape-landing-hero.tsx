"use client";
import { useState, useEffect } from "react";

export function HeroGeometric({ locale }: { locale: string }) {
  // Ignoramos el locale, forzamos español
  const lang = locale || "es"; 
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showLoader && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999, background: "var(--bg-primary)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "fadeOutOverlay 0.4s ease 2.2s forwards"
        }}>
          <style>{`
            @keyframes fadeOutOverlay { 
              0% { opacity: 1; }
              100% { opacity: 0; visibility: hidden; } 
            }
            @keyframes clockSpin { 
              0% { transform: rotate(0deg); } 
              100% { transform: rotate(360deg); } 
            }
            @keyframes morphToLogo {
              0%, 30% { border-radius: 50%; background: transparent; border: 3px solid var(--accent); }
              50%, 100% { border-radius: 16px; background: var(--accent); border: 3px solid var(--accent); }
            }
            @keyframes hideHand {
              0%, 30% { opacity: 1; }
              40%, 100% { opacity: 0; }
            }
            @keyframes showP {
              0%, 40% { opacity: 0; transform: scale(0.5); }
              60%, 100% { opacity: 1; transform: scale(1); }
            }
            
            .loader-container {
              width: 70px; height: 70px;
              position: relative;
              display: flex; align-items: center; justify-content: center;
              animation: morphToLogo 2.2s ease forwards;
            }
            .loader-hand {
              position: absolute; top: 10px; left: 32px;
              width: 3px; height: 25px; background: var(--accent);
              transform-origin: bottom center; border-radius: 2px;
              animation: clockSpin 1s linear infinite, hideHand 2.2s ease forwards;
            }
            .loader-p {
              color: white; font-weight: 800; font-size: 38px; font-family: var(--font-inter);
              opacity: 0;
              animation: showP 2.2s ease forwards;
            }
          `}</style>
          <div className="loader-container">
            <div className="loader-hand" />
            <img src="/logo.png" alt="Punchly" style={{width:"40px",height:"40px",objectFit:"contain",borderRadius:"50%"}} />
          </div>
        </div>
      )}

      <div style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",
        background:"radial-gradient(ellipse at 50% -20%, rgba(59, 130, 246, 0.15), transparent 60%), var(--bg-primary)"}}>

        <div style={{position:"relative",zIndex:10,textAlign:"center",padding:"120px 24px 80px",maxWidth:"1000px",margin:"0 auto",width:"100%"}}>
          <style>{`
            @keyframes hero-fade{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
            .hf1{animation:hero-fade 0.8s ease 2.2s both}
            .hf2{animation:hero-fade 0.8s ease 2.4s both}
            .hero-btn-primary{background:var(--accent);color:#fff;font-family:var(--font-inter);font-weight:600;transition:all 0.2s ease;text-decoration:none;display:inline-block;border-radius:12px;padding:16px 36px;font-size:15px;border:1px solid var(--accent-dark)}
            .hero-btn-primary:hover{background:var(--accent-dark);transform:translateY(-2px);box-shadow:0 8px 24px rgba(59, 130, 246, 0.25)}
            .hero-btn-ghost{background:rgba(255,255,255,0.03);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.8);transition:all 0.2s ease;text-decoration:none;display:inline-block;border-radius:12px;padding:16px 36px;font-size:15px}
            .hero-btn-ghost:hover{background:rgba(255,255,255,0.08);color:white;border-color:rgba(255,255,255,0.2)}
          `}</style>
          
          <h1 className="hf1" style={{fontFamily:"var(--font-inter)",fontSize:"clamp(42px,8vw,80px)",fontWeight:800,lineHeight:1.1,letterSpacing:"-2px",marginBottom:"24px",color:"var(--text-primary)",display:"flex",flexDirection:"column",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
            <img src="/logo.png" alt="Punchly" style={{width:"1em",height:"1em",borderRadius:"50%",marginRight:"4px",objectFit:"contain"}} />
            <span style={{marginLeft:"-2px"}}>unchly.Clock</span>
          </div>
          <span style={{display:"block", color:"var(--text-muted)", fontSize:"clamp(24px, 5vw, 48px)", marginTop:"16px", fontWeight:600, letterSpacing:"-1px"}}>El fin de las tardanzas y el caos en tu nómina</span>
        </h1>

          <p className="hf1" style={{color:"var(--text-muted)",fontSize:"clamp(16px,2vw,20px)",maxWidth:"700px",margin:"0 auto 40px",lineHeight:1.6}}>
            El sistema de asistencia diseñado para pequeños negocios. 
            <strong style={{color:"var(--text-primary)",fontWeight:600}}> Controla a tu personal </strong> 
            y recibe alertas instantáneas cuando alguien llega tarde.
          </p>
          
          <div className="hf2" style={{display:"flex",gap:"16px",justifyContent:"center",flexWrap:"wrap"}}>
            <a href={`/${lang}/register`} className="hero-btn-primary">
              Comenzar prueba gratis
            </a>
            <a href={`/${lang}/login`} className="hero-btn-ghost" style={{fontFamily:"var(--font-inter)",fontWeight:500}}>
              Ver demostración
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
