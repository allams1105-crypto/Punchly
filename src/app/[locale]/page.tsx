import Link from "next/link";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export default function LandingPage() {
  return (
    <>
      <style>{`
        .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)}
        .glass-gold{background:rgba(201,168,76,0.08);backdrop-filter:blur(20px);border:1px solid rgba(201,168,76,0.2)}
        .gold-text{background:linear-gradient(135deg,#D4AF37,#F1D27B,#D4AF37);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .card-3d{transition:transform 0.4s ease,box-shadow 0.4s ease;transform-style:preserve-3d}
        .card-3d:hover{transform:translateY(-6px) rotateX(3deg) rotateY(-1deg);box-shadow:0 30px 80px rgba(0,0,0,0.5),0 0 40px rgba(212,175,55,0.12)}
        .btn-3d{transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1)}
        .btn-3d:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 20px 40px rgba(212,175,55,0.3)}
        .btn-3d:active{transform:translateY(0) scale(0.98)}
        @keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-16px) rotate(1.5deg)}}
        .float{animation:float 7s ease-in-out infinite}
        .feature-card{transition:all 0.35s cubic-bezier(0.34,1.2,0.64,1)}
        .feature-card:hover{transform:translateY(-4px) scale(1.02);background:rgba(255,255,255,0.07)!important;border-color:rgba(212,175,55,0.25)!important}
      `}</style>

      <div style={{minHeight:"100vh", background:"#030303", color:"white", overflowX:"hidden", fontFamily:"var(--font-dm-sans)"}}>
        
        <nav style={{position:"absolute", top:0, left:0, right:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"24px 40px", maxWidth:"1200px", margin:"0 auto"}}>
          <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
            <div style={{width:"32px", height:"32px", borderRadius:"10px", background:"linear-gradient(135deg,#D4AF37,#8B6914)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 20px rgba(212,175,55,0.3)"}}>
              <span style={{color:"#000", fontWeight:900, fontSize:"14px", fontFamily:"var(--font-syne)", display:"block", textAlign:"center", width:"100%"}}>P</span>
            </div>
            <span style={{fontFamily:"var(--font-syne)", fontWeight:700, fontSize:"15px"}}>Punchly.Clock</span>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:"16px"}}>
            <Link href="/en/login" style={{fontSize:"13px", color:"rgba(255,255,255,0.4)", textDecoration:"none", fontWeight:500}}>Iniciar sesión</Link>
            <Link href="/en/register" className="glass-gold btn-3d" style={{color:"#D4AF37", padding:"8px 20px", borderRadius:"12px", fontSize:"13px", fontWeight:600, textDecoration:"none"}}>Comenzar gratis</Link>
          </div>
        </nav>

        <HeroGeometric 
          badge="Punchly.Clock v2.0"
          title1="Control de asistencia"
          title2="sin excusas"
        />

        <div style={{position:"relative", zIndex:10, background:"linear-gradient(to bottom, #030303, #0A0A0A)", marginTop:"-10vh"}}>
          
          <section style={{maxWidth:"800px", margin:"0 auto", padding:"0 40px 100px"}}>
            <div className="float">
              <div className="glass" style={{borderRadius:"24px", padding:"4px", boxShadow:"0 0 80px rgba(0,0,0,0.5)"}}>
                <div style={{background:"#0D0D0D", borderRadius:"20px", overflow:"hidden"}}>
                  <div style={{padding:"24px 32px", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                    <div>
                      <p style={{fontFamily:"var(--font-syne)", fontSize:"40px", fontWeight:800, color:"white", lineHeight:1}}>09:41</p>
                      <p style={{color:"rgba(255,255,255,0.25)", fontSize:"12px", marginTop:"4px"}}>Jueves, 12 de marzo</p>
                    </div>
                    <div style={{display:"flex", alignItems:"center", gap:"8px", background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.2)", padding:"8px 14px", borderRadius:"100px"}}>
                      <div style={{width:"6px", height:"6px", background:"#34D399", borderRadius:"50%"}} />
                      <span style={{color:"#34D399", fontSize:"12px", fontWeight:500}}>3 en turno</span>
                    </div>
                  </div>
                  <div style={{padding:"20px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px"}}>
                    {[["A","Ana G.","#D4AF37",true],["L","Luis M.","#60A5FA",true],["S","Sofia R.","#34D399",true],["C","Carlos P.","#F87171",false],["M","María J.","#A78BFA",false],["P","Pedro L.","#FB923C",false]].map(([init,name,color,active])=>(
                      <div key={String(name)} className="card-3d" style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"16px", padding:"16px", cursor:"pointer"}}>
                        <div style={{width:"36px", height:"36px", borderRadius:"10px", background:color+"20", border:`1px solid ${color}30`, display:"flex", alignItems:"center", justifyContent:"center", color:String(color), fontFamily:"var(--font-syne)", fontWeight:700, fontSize:"13px", marginBottom:"10px", textAlign:"center", lineHeight:"34px"}}>{init}</div>
                        <p style={{fontSize:"12px", fontWeight:700, color:"white", fontFamily:"var(--font-syne)"}}>{name}</p>
                        {active && <div style={{display:"flex", alignItems:"center", gap:"4px", marginTop:"4px"}}><div style={{width:"5px", height:"5px", background:"#34D399", borderRadius:"50%"}} /><span style={{color:"#34D399", fontSize:"10px"}}>Activo</span></div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={{maxWidth:"1100px", margin:"0 auto", padding:"0 40px 100px"}}>
            <h2 style={{fontFamily:"var(--font-syne)", fontSize:"clamp(32px,5vw,48px)", fontWeight:700, textAlign:"center", marginBottom:"16px", letterSpacing:"-1px"}}>Todo lo que necesitas</h2>
            <p style={{color:"rgba(255,255,255,0.3)", textAlign:"center", marginBottom:"60px", fontSize:"16px"}}>Sin suscripciones mensuales. Un solo pago, control total.</p>
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"20px"}}>
              {[
                {title:"Kiosk con PIN", desc:"Tablet en la entrada. Cada empleado tiene su PIN único. Seguridad garantizada."},
                {title:"Geofencing móvil", desc:"Fichaje solo permitido dentro del radio GPS de tu empresa."},
                {title:"Alertas en tiempo real", desc:"Notificaciones automáticas de tardanzas directamente a tu panel."},
                {title:"Nómina en un clic", desc:"Cálculo automático de horas normales y extras listas para exportar."},
                {title:"Multi-empresa", desc:"Gestiona múltiples sucursales o clientes desde una sola cuenta."},
                {title:"Propiedad de por vida", desc:"Paga $49 una vez. Es tuyo para siempre con todas las actualizaciones."},
              ].map(f=>(
                <div key={f.title} className="glass feature-card" style={{borderRadius:"24px", padding:"32px"}}>
                  <div style={{width:"40px", height:"40px", background:"rgba(212,175,55,0.1)", border:"1px solid rgba(212,175,55,0.2)", borderRadius:"12px", marginBottom:"20px"}} />
                  <h3 style={{fontFamily:"var(--font-syne)", fontWeight:700, fontSize:"18px", marginBottom:"10px"}}>{f.title}</h3>
                  <p style={{color:"rgba(255,255,255,0.4)", fontSize:"14px", lineHeight:1.7}}>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={{maxWidth:"450px", margin:"0 auto", padding:"0 40px 120px", textAlign:"center"}}>
            <div className="glass" style={{borderRadius:"32px", padding:"48px", border:"1px solid rgba(212,175,55,0.2)"}}>
              <p style={{color:"#D4AF37", fontSize:"12px", letterSpacing:"3px", textTransform:"uppercase", marginBottom:"16px", fontWeight:700}}>Oferta de Lanzamiento</p>
              <div style={{display:"flex", alignItems:"flex-end", justifyContent:"center", gap:"8px", marginBottom:"8px", width:"100%"}}>
                <span className="gold-text" style={{fontFamily:"var(--font-syne)", fontSize:"88px", fontWeight:800, lineHeight:1}}>$49</span>
                <span style={{color:"rgba(255,255,255,0.2)", marginBottom:"16px", fontSize:"16px"}}>USD</span>
              </div>
              <p style={{color:"rgba(255,255,255,0.4)", fontSize:"14px", marginBottom:"32px"}}>Pago único. Acceso de por vida.</p>
              <ul style={{listStyle:"none", padding:0, marginBottom:"40px", textAlign:"left"}}>
                {["Empleados ilimitados", "Soporte técnico 24/7", "Actualizaciones gratuitas", "Sin cuotas mensuales"].map(f=>(
                  <li key={f} style={{display:"flex", alignItems:"center", gap:"12px", padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.6)", fontSize:"14px"}}>
                    <div style={{width:"6px", height:"6px", background:"#D4AF37", borderRadius:"50%"}} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/en/register" className="btn-3d" style={{display:"block", background:"linear-gradient(135deg,#D4AF37,#F1D27B)", color:"#000", padding:"20px", borderRadius:"16px", fontFamily:"var(--font-syne)", fontWeight:700, fontSize:"16px", textDecoration:"none", boxShadow:"0 10px 40px rgba(212,175,55,0.3)"}}>
                Empezar ahora
              </Link>
            </div>
          </section>

          <footer style={{borderTop:"1px solid rgba(255,255,255,0.05)", padding:"40px", textAlign:"center", background:"#030303"}}>
            <p style={{color:"rgba(255,255,255,0.2)", fontSize:"13px"}}>© 2026 Punchly.Clock — El estándar en control de asistencia.</p>
          </footer>
        </div>
      </div>
    </>
  );
}