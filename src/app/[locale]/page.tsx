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
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
        .float{animation:float 6s ease-in-out infinite}
        .feature-card{transition:all 0.3s ease; border: 1px solid rgba(255,255,255,0.05)}
        .feature-card:hover{background:rgba(255,255,255,0.06)!important; border-color:rgba(212,175,55,0.3)!important}
      `}</style>

      <div style={{minHeight:"100vh", background:"#030303", color:"white", overflowX:"hidden", fontFamily:"var(--font-dm-sans)"}}>
        
        {/* Navbar */}
        <nav style={{position:"absolute", top:0, left:0, right:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"24px 40px", maxWidth:"1200px", margin:"0 auto"}}>
          <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
            <div style={{width:"32px", height:"32px", borderRadius:"10px", background:"linear-gradient(135deg,#D4AF37,#8B6914)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 20px rgba(212,175,55,0.3)"}}>
              <span style={{color:"#000", fontWeight:900, fontSize:"14px", fontFamily:"var(--font-syne)"}}>P</span>
            </div>
            <span style={{fontFamily:"var(--font-syne)", fontWeight:700, fontSize:"15px"}}>Punchly.Clock</span>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:"16px"}}>
            <Link href="/en/login" style={{fontSize:"13px", color:"rgba(255,255,255,0.4)", textDecoration:"none", fontWeight:500}}>Login</Link>
            <Link href="/en/register" className="glass-gold btn-3d" style={{color:"#D4AF37", padding:"8px 24px", borderRadius:"12px", fontSize:"13px", fontWeight:600, textDecoration:"none"}}>Empezar</Link>
          </div>
        </nav>

        <HeroGeometric 
          badge="Punchly.Clock v2.0"
          title1="Control de asistencia"
          title2="inteligente y simple"
        />

        {/* Mockup Flotante */}
        <section style={{position:"relative", zIndex:10, background:"linear-gradient(to bottom, #030303, #0A0A0A)", marginTop:"-12vh", paddingBottom: "100px"}}>
          <div className="float" style={{maxWidth:"900px", margin:"0 auto", padding:"0 20px"}}>
            <div className="glass" style={{borderRadius:"24px", padding:"6px", boxShadow:"0 50px 100px rgba(0,0,0,0.8)"}}>
              <div style={{background:"#0D0D0D", borderRadius:"18px", overflow:"hidden", border:"1px solid rgba(255,255,255,0.05)"}}>
                <div style={{padding:"20px 30px", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                   <div style={{width:"12px", height:"12px", borderRadius:"50%", background:"rgba(255,255,255,0.1)"}} />
                   <div style={{height:"6px", width:"100px", background:"rgba(255,255,255,0.05)", borderRadius:"10px"}} />
                </div>
                <div style={{padding:"30px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"15px"}}>
                   {[1,2,3,4,5,6].map(i => (
                     <div key={i} className="card-3d" style={{height:"100px", background:"rgba(255,255,255,0.02)", borderRadius:"15px", border:"1px solid rgba(255,255,255,0.05)"}} />
                   ))}
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div style={{maxWidth:"1100px", margin:"100px auto 0", padding:"0 40px"}}>
            <h2 style={{fontFamily:"var(--font-syne)", fontSize:"42px", fontWeight:800, textAlign:"center", marginBottom:"50px"}}>Potencia tu equipo</h2>
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:"20px"}}>
              {[
                {t:"Kiosk con PIN", d:"Tablet en la entrada para fichajes rápidos."},
                {t:"Reportes PDF", d:"Nóminas listas para pagar en segundos."},
                {t:"Geofencing", d:"Asegura que fichen solo en el lugar de trabajo."},
                {t:"Alertas Live", d:"Notificaciones de tardanzas al instante."},
                {t:"Soporte 24/7", d:"Estamos contigo en cada paso."},
                {t:"Pago Único", d:"Olvídate de las mensualidades para siempre."}
              ].map(f => (
                <div key={f.t} className="glass feature-card" style={{padding:"30px", borderRadius:"20px"}}>
                  <h3 style={{fontFamily:"var(--font-syne)", fontWeight:700, fontSize:"18px", marginBottom:"10px"}}>{f.t}</h3>
                  <p style={{color:"rgba(255,255,255,0.4)", fontSize:"14px", lineHeight:"1.6"}}>{f.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div style={{maxWidth:"400px", margin:"120px auto 0", padding:"0 20px", textAlign:"center"}}>
            <div className="glass" style={{padding:"50px", borderRadius:"30px", border:"1px solid rgba(212,175,55,0.3)"}}>
              <p style={{color:"#D4AF37", fontSize:"11px", fontWeight:800, letterSpacing:"3px", marginBottom:"20px"}}>ACCESO DE POR VIDA</p>
              <h3 className="gold-text" style={{fontSize:"80px", fontWeight:800, fontFamily:"var(--font-syne)", lineHeight:1}}>$49</h3>
              <p style={{color:"rgba(255,255,255,0.4)", marginTop:"20px", fontSize:"14px"}}>Paga una vez, úsalo siempre.</p>
              <Link href="/en/register" className="btn-3d" style={{display:"block", background:"#FAFAFA", color:"#000", padding:"18px", borderRadius:"15px", marginTop:"40px", fontWeight:700, textDecoration:"none", fontSize:"15px"}}>
                Comenzar ahora
              </Link>
            </div>
          </div>

        </section>

        <footer style={{padding:"60px", textAlign:"center", borderTop:"1px solid rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.2)", fontSize:"12px"}}>
          © 2026 Punchly.Clock. codesite.
        </footer>
      </div>
    </>
  );
}