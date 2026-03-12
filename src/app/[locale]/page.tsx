import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <style>{`
        .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)}
        .glass-gold{background:rgba(201,168,76,0.08);backdrop-filter:blur(20px);border:1px solid rgba(201,168,76,0.2)}
        .gold-text{background:linear-gradient(135deg,#C9A84C,#F0D080,#C9A84C);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .grid-bg{background-image:linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px);background-size:80px 80px}
        .glow{box-shadow:0 0 60px rgba(201,168,76,0.2),0 0 120px rgba(201,168,76,0.05)}
        .card-3d{transition:transform 0.4s ease,box-shadow 0.4s ease;transform-style:preserve-3d}
        .card-3d:hover{transform:translateY(-6px) rotateX(3deg) rotateY(-1deg);box-shadow:0 30px 80px rgba(0,0,0,0.5),0 0 40px rgba(201,168,76,0.12)}
        .btn-3d{transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1)}
        .btn-3d:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 20px 40px rgba(201,168,76,0.3)}
        .btn-3d:active{transform:translateY(0) scale(0.98)}
        @keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-16px) rotate(1.5deg)}}
        @keyframes fade-up{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes orb-pulse{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.1);opacity:1}}
        .float{animation:float 7s ease-in-out infinite}
        .fade-up-1{animation:fade-up 0.9s ease 0.1s both}
        .fade-up-2{animation:fade-up 0.9s ease 0.25s both}
        .fade-up-3{animation:fade-up 0.9s ease 0.4s both}
        .fade-up-4{animation:fade-up 0.9s ease 0.55s both}
        .orb{border-radius:50%;filter:blur(100px);position:fixed;pointer-events:none;animation:orb-pulse 8s ease-in-out infinite}
        .feature-card{transition:all 0.35s cubic-bezier(0.34,1.2,0.64,1)}
        .feature-card:hover{transform:translateY(-4px) scale(1.02);background:rgba(255,255,255,0.07)!important;border-color:rgba(201,168,76,0.25)!important}
      `}</style>

      <div style={{minHeight:"100vh",background:"#0A0A0A",color:"white",overflow:"hidden",fontFamily:"var(--font-dm-sans)"}}>
        <div className="orb" style={{width:"500px",height:"500px",background:"rgba(201,168,76,0.07)",top:"-100px",left:"20%"}} />
        <div className="orb" style={{width:"300px",height:"300px",background:"rgba(255,255,255,0.03)",bottom:"20%",right:"10%",animationDelay:"3s"}} />
        <div className="grid-bg" style={{position:"fixed",inset:0,pointerEvents:"none"}} />

        {/* Nav */}
        <nav style={{position:"relative",zIndex:10,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"24px 40px",maxWidth:"1200px",margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{width:"32px",height:"32px",borderRadius:"10px",background:"linear-gradient(135deg,#C9A84C,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 20px rgba(201,168,76,0.3)"}}>
              <span style={{color:"#000",fontWeight:900,fontSize:"14px",fontFamily:"var(--font-syne)"}}>P</span>
            </div>
            <span style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"15px"}}>Punchly.Clock</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
            <Link href="/en/login" style={{fontSize:"13px",color:"rgba(255,255,255,0.4)",textDecoration:"none",fontWeight:500,transition:"color 0.2s"}}>Iniciar sesión</Link>
            <Link href="/en/register" className="glass-gold btn-3d" style={{color:"#C9A84C",padding:"8px 20px",borderRadius:"12px",fontSize:"13px",fontWeight:600,textDecoration:"none",display:"inline-block"}}>Comenzar gratis</Link>
          </div>
        </nav>

        {/* Hero */}
        <section style={{position:"relative",zIndex:10,maxWidth:"900px",margin:"0 auto",padding:"80px 40px 60px",textAlign:"center"}}>
          <div className="fade-up-1 glass" style={{display:"inline-flex",alignItems:"center",gap:"8px",padding:"6px 16px",borderRadius:"100px",fontSize:"12px",color:"rgba(255,255,255,0.4)",marginBottom:"32px"}}>
            <div style={{width:"6px",height:"6px",background:"#C9A84C",borderRadius:"50%"}} />
            7 días gratis — sin tarjeta de crédito
          </div>
          <h1 className="fade-up-2" style={{fontFamily:"var(--font-syne)",fontSize:"clamp(48px,8vw,88px)",fontWeight:800,lineHeight:1,letterSpacing:"-2px",marginBottom:"24px"}}>
            Control de<br/><span className="gold-text">asistencia</span><br/>sin excusas
          </h1>
          <p className="fade-up-3" style={{color:"rgba(255,255,255,0.35)",fontSize:"18px",maxWidth:"480px",margin:"0 auto 40px",lineHeight:1.7,fontWeight:300}}>
            Kiosk con PIN, geofencing móvil y reportes automáticos. Todo por un pago único de $49.
          </p>
          <div className="fade-up-4" style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
            <Link href="/en/register" className="btn-3d glow" style={{background:"linear-gradient(135deg,#C9A84C,#F0D080)",color:"#000",padding:"16px 32px",borderRadius:"16px",fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"15px",textDecoration:"none",display:"inline-block"}}>
              Empezar 7 días gratis
            </Link>
            <Link href="/en/login" className="glass btn-3d" style={{color:"rgba(255,255,255,0.6)",padding:"16px 32px",borderRadius:"16px",fontSize:"15px",fontWeight:500,textDecoration:"none",display:"inline-block"}}>
              Ya tengo cuenta
            </Link>
          </div>
        </section>

        {/* Floating mockup */}
        <section style={{position:"relative",zIndex:10,maxWidth:"800px",margin:"0 auto",padding:"0 40px 80px"}}>
          <div className="float">
            <div className="glass glow" style={{borderRadius:"24px",padding:"4px"}}>
              <div style={{background:"#0D0D0D",borderRadius:"20px",overflow:"hidden"}}>
                <div style={{padding:"24px 32px",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div>
                    <p style={{fontFamily:"var(--font-syne)",fontSize:"40px",fontWeight:800,color:"white",lineHeight:1}}>09:41</p>
                    <p style={{color:"rgba(255,255,255,0.25)",fontSize:"12px",marginTop:"4px"}}>Jueves, 12 de marzo</p>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:"8px",background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.2)",padding:"8px 14px",borderRadius:"100px"}}>
                    <div style={{width:"6px",height:"6px",background:"#34D399",borderRadius:"50%",animation:"pulse 2s infinite"}} />
                    <span style={{color:"#34D399",fontSize:"12px",fontWeight:500}}>3 en turno</span>
                  </div>
                </div>
                <div style={{padding:"20px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px"}}>
                  {[["A","Ana G.","#C9A84C",true],["L","Luis M.","#60A5FA",true],["S","Sofia R.","#34D399",true],["C","Carlos P.","#F87171",false],["M","María J.","#A78BFA",false],["P","Pedro L.","#FB923C",false]].map(([init,name,color,active])=>(
                    <div key={String(name)} className="card-3d" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"16px",padding:"16px",cursor:"pointer"}}>
                      <div style={{width:"36px",height:"36px",borderRadius:"10px",background:color+"20",border:`1px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center",color:String(color),fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"13px",marginBottom:"10px"}}>{init}</div>
                      <p style={{fontSize:"12px",fontWeight:700,color:"white",fontFamily:"var(--font-syne)"}}>{name}</p>
                      {active && <div style={{display:"flex",alignItems:"center",gap:"4px",marginTop:"4px"}}><div style={{width:"5px",height:"5px",background:"#34D399",borderRadius:"50%"}} /><span style={{color:"#34D399",fontSize:"10px"}}>Activo</span></div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={{position:"relative",zIndex:10,maxWidth:"1100px",margin:"0 auto",padding:"0 40px 80px"}}>
          <h2 style={{fontFamily:"var(--font-syne)",fontSize:"clamp(28px,4vw,40px)",fontWeight:700,textAlign:"center",marginBottom:"12px"}}>Todo lo que necesitas</h2>
          <p style={{color:"rgba(255,255,255,0.25)",textAlign:"center",marginBottom:"48px",fontSize:"14px"}}>Sin suscripciones. Sin límites artificiales.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"16px"}}>
            {[
              {title:"Kiosk con PIN",desc:"Tablet en la entrada. Cada empleado tiene su PIN único. Nadie puede fichar por otro."},
              {title:"Geofencing móvil",desc:"El empleado solo puede fichar desde su celular si está dentro del radio de la empresa."},
              {title:"Alertas de tardanza",desc:"Email automático cuando alguien llega tarde. En tiempo real, sin configuración."},
              {title:"Nómina automática",desc:"Cálculo quincenal con horas normales y extras. Exporta a CSV o PDF en un clic."},
              {title:"Multi-empresa",desc:"Cada cliente tiene su propio espacio aislado con sus empleados y configuración."},
              {title:"Pago único $49",desc:"Sin mensualidades. Paga una vez, usa para siempre. Actualizaciones incluidas."},
            ].map(f=>(
              <div key={f.title} className="glass feature-card" style={{borderRadius:"20px",padding:"28px"}}>
                <div style={{width:"32px",height:"32px",background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:"10px",marginBottom:"16px"}} />
                <h3 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"16px",marginBottom:"8px"}}>{f.title}</h3>
                <p style={{color:"rgba(255,255,255,0.35)",fontSize:"13px",lineHeight:1.7}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section style={{position:"relative",zIndex:10,maxWidth:"420px",margin:"0 auto",padding:"0 40px 80px",textAlign:"center"}}>
          <div className="glass glow" style={{borderRadius:"28px",padding:"40px"}}>
            <p style={{color:"rgba(255,255,255,0.3)",fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase",marginBottom:"12px",fontFamily:"var(--font-syne)"}}>Precio único</p>
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:"8px",marginBottom:"8px"}}>
              <span className="gold-text" style={{fontFamily:"var(--font-syne)",fontSize:"80px",fontWeight:800,lineHeight:1}}>$49</span>
              <span style={{color:"rgba(255,255,255,0.2)",marginBottom:"12px",fontSize:"14px"}}>para siempre</span>
            </div>
            <p style={{color:"rgba(255,255,255,0.2)",fontSize:"12px",marginBottom:"28px"}}>Un solo pago. Sin sorpresas.</p>
            <ul style={{listStyle:"none",padding:0,marginBottom:"28px",textAlign:"left"}}>
              {["Empleados ilimitados","Kiosk con PIN","Geofencing móvil","Alertas por email","Nómina automática","Soporte incluido"].map(f=>(
                <li key={f} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.5)",fontSize:"13px"}}>
                  <div style={{width:"6px",height:"6px",background:"#C9A84C",borderRadius:"50%",flexShrink:0}} />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/en/register" className="btn-3d" style={{display:"block",background:"linear-gradient(135deg,#C9A84C,#F0D080)",color:"#000",padding:"16px",borderRadius:"16px",fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"15px",textDecoration:"none",boxShadow:"0 0 40px rgba(201,168,76,0.25)"}}>
              Comenzar 7 días gratis
            </Link>
            <p style={{color:"rgba(255,255,255,0.15)",fontSize:"11px",marginTop:"12px"}}>Sin tarjeta requerida durante el trial</p>
          </div>
        </section>

        <footer style={{position:"relative",zIndex:10,borderTop:"1px solid rgba(255,255,255,0.05)",padding:"24px",textAlign:"center"}}>
          <p style={{color:"rgba(255,255,255,0.15)",fontSize:"12px"}}>Punchly.Clock — Control de asistencia profesional</p>
        </footer>
      </div>
    </>
  );
}