import Link from "next/link";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export default function LandingPage() {
  return (
    <>
      <style>{`
        .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)}
        .glass-gold{background:rgba(201,168,76,0.08);backdrop-filter:blur(20px);border:1px solid rgba(201,168,76,0.2)}
        .btn-3d{transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1)}
        .btn-3d:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 20px 40px rgba(212,175,55,0.3)}
      `}</style>

      <div style={{minHeight:"100vh", background:"#030303", color:"white", overflowX:"hidden", fontFamily:"var(--font-dm-sans)"}}>
        
        <nav style={{position:"absolute", top:0, left:0, right:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"24px 40px", maxWidth:"1200px", margin:"0 auto"}}>
          <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
            <div style={{width:"32px", height:"32px", borderRadius:"10px", background:"linear-gradient(135deg,#D4AF37,#8B6914)", display:"flex", alignItems:"center", justifyContent:"center"}}>
              <span style={{color:"#000", fontWeight:900, fontSize:"14px", fontFamily:"var(--font-syne)"}}>P</span>
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

        {/* Sección de los Cards 3D que tenías antes */}
        <section style={{position:"relative", zIndex:10, marginTop:"-10vh", padding:"0 40px 100px", textAlign:"center"}}>
             <p style={{color: "rgba(255,255,255,0.3)"}}>Tu landing page original vuelve a estar aquí.</p>
        </section>
      </div>
    </>
  );
}