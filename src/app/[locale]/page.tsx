import Link from "next/link";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export default function LandingPage() {
  return (
    <>
      <style>{`
        .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)}
        .glass-gold{background:rgba(201,168,76,0.08);backdrop-filter:blur(20px);border:1px solid rgba(201,168,76,0.2)}
        .gold-text{background:linear-gradient(135deg,#C9A84C,#F0D080,#C9A84C);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .glow{box-shadow:0 0 60px rgba(201,168,76,0.2),0 0 120px rgba(201,168,76,0.05)}
        .card-3d{transition:transform 0.4s ease,box-shadow 0.4s ease;transform-style:preserve-3d}
        .card-3d:hover{transform:translateY(-6px) rotateX(3deg) rotateY(-1deg);box-shadow:0 30px 80px rgba(0,0,0,0.5),0 0 40px rgba(201,168,76,0.12)}
        .btn-3d{transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1)}
        .btn-3d:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 20px 40px rgba(201,168,76,0.3)}
        .btn-3d:active{transform:scale(0.97)}
        .feature-card{transition:all 0.35s cubic-bezier(0.34,1.2,0.64,1)}
        .feature-card:hover{transform:translateY(-4px) scale(1.02);background:rgba(255,255,255,0.07)!important;border-color:rgba(201,168,76,0.25)!important}
        @keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-16px) rotate(1deg)}}
        @keyframes float-slow{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes fade-up{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.8)}}
        .float{animation:float 7s ease-in-out infinite}
        .float-slow{animation:float-slow 5s ease-in-out infinite}
        .fade-up-1{animation:fade-up 0.9s ease 0.6s both}
        .fade-up-2{animation:fade-up 0.9s ease 0.75s both}
        .fade-up-3{animation:fade-up 0.9s ease 0.9s both}
        .pulse-dot{animation:pulse-dot 2s ease-in-out infinite}
        @media(max-width:768px){.hide-sm{display:none!important}.stack-sm{flex-direction:column!important}.grid-sm-1{grid-template-columns:1fr!important}}
      `}</style>

      <div style={{minHeight:"100vh",background:"#030303",color:"white",overflow:"hidden",fontFamily:"var(--font-dm-sans)"}}>

        {/* NAV — absolute over hero */}
        <nav style={{position:"absolute",top:0,left:0,right:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"24px 40px",maxWidth:"1200px",margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{width:"32px",height:"32px",borderRadius:"10px",background:"linear-gradient(135deg,#C9A84C,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 20px rgba(201,168,76,0.3)"}}>
              <span style={{color:"#000",fontWeight:900,fontSize:"14px",fontFamily:"var(--font-syne)"}}>P</span>
            </div>
            <span style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"15px"}}>Punchly.Clock</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
            <Link href="/en/login" style={{fontSize:"13px",color:"rgba(255,255,255,0.4)",textDecoration:"none",fontWeight:500}}>Iniciar sesión</Link>
            <Link href="/en/register" className="glass-gold btn-3d" style={{color:"#C9A84C",padding:"8px 20px",borderRadius:"12px",fontSize:"13px",fontWeight:600,textDecoration:"none",display:"inline-block"}}>Comenzar gratis</Link>
          </div>
        </nav>

        {/* HERO — full screen with smoke */}
        <HeroGeometric badge="7 días gratis — sin tarjeta de crédito" title1="Control de asistencia" title2="sin excusas" />

        {/* FLOATING KIOSK MOCKUP */}
        <section style={{background:"linear-gradient(to bottom,#030303,#0A0A0A)",padding:"0 40px 100px",marginTop:"-80px",position:"relative",zIndex:10}}>
          <div className="float" style={{maxWidth:"860px",margin:"0 auto"}}>
            <div className="glass glow" style={{borderRadius:"28px",padding:"4px"}}>
              <div style={{background:"#0D0D0D",borderRadius:"24px",overflow:"hidden"}}>
                {/* Kiosk header */}
                <div style={{padding:"24px 32px",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div>
                    <p style={{fontFamily:"var(--font-syne)",fontSize:"44px",fontWeight:800,color:"white",lineHeight:1}}>09:41</p>
                    <p style={{color:"rgba(255,255,255,0.2)",fontSize:"12px",marginTop:"4px",fontFamily:"var(--font-dm-sans)"}}>Jueves, 12 de marzo · Punchly.Clock</p>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:"8px",alignItems:"flex-end"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"6px",background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.15)",padding:"7px 14px",borderRadius:"100px"}}>
                      <div className="pulse-dot" style={{width:"6px",height:"6px",background:"#34D399",borderRadius:"50%"}} />
                      <span style={{color:"#34D399",fontSize:"12px",fontWeight:500,fontFamily:"var(--font-dm-sans)"}}>3 en turno ahora</span>
                    </div>
                    <p style={{color:"rgba(255,255,255,0.15)",fontSize:"11px",fontFamily:"var(--font-dm-sans)"}}>Busca tu nombre para fichar</p>
                  </div>
                </div>
                {/* Search bar */}
                <div style={{padding:"16px 24px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"12px",padding:"12px 16px",display:"flex",alignItems:"center",gap:"10px"}}>
                    <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    <span style={{color:"rgba(255,255,255,0.15)",fontSize:"13px",fontFamily:"var(--font-dm-sans)"}}>Busca tu nombre...</span>
                  </div>
                </div>
                {/* Employee grid */}
                <div style={{padding:"20px 24px",display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"12px"}}>
                  {[
                    ["A","Ana G.","#C9A84C",true],
                    ["L","Luis M.","#60A5FA",true],
                    ["S","Sofia R.","#34D399",true],
                    ["C","Carlos P.","#F87171",false],
                    ["M","María J.","#A78BFA",false],
                    ["P","Pedro L.","#FB923C",false],
                  ].map(([init,name,color,active])=>(
                    <div key={String(name)} className="card-3d" style={{background:active?"rgba(52,211,153,0.05)":"rgba(255,255,255,0.03)",border:active?"1px solid rgba(52,211,153,0.12)":"1px solid rgba(255,255,255,0.05)",borderRadius:"16px",padding:"16px 12px",cursor:"pointer",textAlign:"center"}}>
                      <div style={{width:"36px",height:"36px",borderRadius:"10px",background:String(color)+"18",border:"1px solid "+String(color)+"25",display:"flex",alignItems:"center",justifyContent:"center",color:String(color),fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"14px",margin:"0 auto 8px"}}>
                        {init}
                      </div>
                      <p style={{fontSize:"11px",fontWeight:700,color:"white",fontFamily:"var(--font-syne)",lineHeight:1.2}}>{name}</p>
                      {active
                        ? <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"4px",marginTop:"5px"}}>
                            <div className="pulse-dot" style={{width:"4px",height:"4px",background:"#34D399",borderRadius:"50%"}} />
                            <span style={{color:"#34D399",fontSize:"9px"}}>Activo</span>
                          </div>
                        : <span style={{color:"rgba(255,255,255,0.2)",fontSize:"9px",marginTop:"5px",display:"block"}}>Toca para fichar</span>
                      }
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="fade-up-1" style={{maxWidth:"860px",margin:"40px auto 0",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px"}} >
            {[
              {value:"2,847",label:"Fichajes procesados",color:"#C9A84C"},
              {value:"99.9%",label:"Uptime garantizado",color:"#34D399"},
              {value:"< 1s",label:"Tiempo de respuesta",color:"#60A5FA"},
              {value:"$49",label:"Pago único forever",color:"#C9A84C"},
            ].map(s=>(
              <div key={s.label} className="glass" style={{borderRadius:"16px",padding:"20px",textAlign:"center"}}>
                <p style={{fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"24px",color:s.color,lineHeight:1}}>{s.value}</p>
                <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:"rgba(255,255,255,0.25)",marginTop:"6px"}}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section style={{background:"#0A0A0A",padding:"80px 40px"}}>
          <div style={{maxWidth:"1100px",margin:"0 auto"}}>
            <div className="fade-up-2" style={{textAlign:"center",marginBottom:"60px"}}>
              <p style={{color:"rgba(201,168,76,0.6)",fontSize:"11px",fontWeight:700,letterSpacing:"3px",textTransform:"uppercase",fontFamily:"var(--font-dm-sans)",marginBottom:"12px"}}>Funcionalidades</p>
              <h2 style={{fontFamily:"var(--font-syne)",fontSize:"clamp(28px,4vw,42px)",fontWeight:800,marginBottom:"12px"}}>Todo lo que necesitas</h2>
              <p style={{color:"rgba(255,255,255,0.25)",fontSize:"14px",maxWidth:"400px",margin:"0 auto"}}>Sin suscripciones. Sin límites. Un solo pago.</p>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px"}} className="grid-sm-1">
              {[
                {title:"Kiosk con PIN",desc:"Tablet en la entrada. Cada empleado tiene su PIN de 4 dígitos. Nadie puede fichar por otro.",icon:"M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",color:"#C9A84C"},
                {title:"Geofencing móvil",desc:"El empleado solo puede fichar desde su celular si está dentro del radio configurado.",icon:"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",color:"#60A5FA"},
                {title:"Alertas en tiempo real",desc:"Email automático al admin cuando alguien llega tarde. Sin configuración extra.",icon:"M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",color:"#F87171"},
                {title:"Nómina automática",desc:"Cálculo quincenal con horas normales y extras. Exporta a CSV en un clic.",icon:"M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",color:"#34D399"},
                {title:"Multi-empresa",desc:"Cada cliente tiene su espacio aislado. Datos, empleados y configuración separados.",icon:"M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",color:"#A78BFA"},
                {title:"Pago único $49",desc:"Sin mensualidades. Sin sorpresas. Paga una vez y usa Punchly.Clock para siempre.",icon:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",color:"#C9A84C"},
              ].map(f=>(
                <div key={f.title} className="glass feature-card" style={{borderRadius:"20px",padding:"28px"}}>
                  <div style={{width:"40px",height:"40px",borderRadius:"12px",background:f.color+"12",border:"1px solid "+f.color+"20",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"16px"}}>
                    <svg width="18" height="18" fill="none" stroke={f.color} strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={f.icon}/>
                    </svg>
                  </div>
                  <h3 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"16px",marginBottom:"8px"}}>{f.title}</h3>
                  <p style={{color:"rgba(255,255,255,0.35)",fontSize:"13px",lineHeight:1.7,fontFamily:"var(--font-dm-sans)"}}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{background:"#030303",padding:"80px 40px"}}>
          <div style={{maxWidth:"900px",margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:"60px"}}>
              <p style={{color:"rgba(201,168,76,0.6)",fontSize:"11px",fontWeight:700,letterSpacing:"3px",textTransform:"uppercase",fontFamily:"var(--font-dm-sans)",marginBottom:"12px"}}>Proceso</p>
              <h2 style={{fontFamily:"var(--font-syne)",fontSize:"clamp(28px,4vw,42px)",fontWeight:800}}>Listo en 3 minutos</h2>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"20px",position:"relative"}} className="grid-sm-1">
              {[
                {step:"01",title:"Crea tu cuenta",desc:"Regístrate gratis. 7 días de prueba sin tarjeta de crédito."},
                {step:"02",title:"Agrega empleados",desc:"Crea perfiles, asigna PINs y configura horarios en minutos."},
                {step:"03",title:"Abre el kiosk",desc:"Coloca una tablet en la entrada y listo. Tus empleados fichan con su PIN."},
              ].map((s,i)=>(
                <div key={s.step} style={{position:"relative"}}>
                  {i<2 && <div className="hide-sm" style={{position:"absolute",top:"30px",right:"-10px",width:"20px",height:"1px",background:"rgba(201,168,76,0.2)",zIndex:1}} />}
                  <div className="glass" style={{borderRadius:"20px",padding:"28px"}}>
                    <div style={{fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"48px",color:"rgba(201,168,76,0.15)",lineHeight:1,marginBottom:"16px"}}>{s.step}</div>
                    <h3 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"16px",marginBottom:"8px"}}>{s.title}</h3>
                    <p style={{color:"rgba(255,255,255,0.35)",fontSize:"13px",lineHeight:1.7,fontFamily:"var(--font-dm-sans)"}}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section style={{background:"#0A0A0A",padding:"80px 40px 100px"}}>
          <div style={{maxWidth:"480px",margin:"0 auto",textAlign:"center"}}>
            <div className="fade-up-3">
              <p style={{color:"rgba(201,168,76,0.6)",fontSize:"11px",fontWeight:700,letterSpacing:"3px",textTransform:"uppercase",fontFamily:"var(--font-dm-sans)",marginBottom:"12px"}}>Precio</p>
              <h2 style={{fontFamily:"var(--font-syne)",fontSize:"clamp(28px,4vw,42px)",fontWeight:800,marginBottom:"40px"}}>Sin sorpresas</h2>

              <div className="glass glow" style={{borderRadius:"28px",padding:"40px",border:"1px solid rgba(201,168,76,0.15)"}}>
                <p style={{color:"rgba(255,255,255,0.25)",fontSize:"12px",letterSpacing:"3px",textTransform:"uppercase",marginBottom:"12px",fontFamily:"var(--font-syne)"}}>Pago único</p>
                <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:"8px",marginBottom:"6px"}}>
                  <span className="gold-text" style={{fontFamily:"var(--font-syne)",fontSize:"80px",fontWeight:800,lineHeight:1}}>$49</span>
                  <span style={{color:"rgba(255,255,255,0.2)",marginBottom:"12px",fontSize:"14px",fontFamily:"var(--font-dm-sans)"}}>para siempre</span>
                </div>
                <p style={{color:"rgba(255,255,255,0.2)",fontSize:"12px",marginBottom:"28px",fontFamily:"var(--font-dm-sans)"}}>Un solo pago. Acceso permanente. Sin cobros adicionales.</p>

                <ul style={{listStyle:"none",padding:0,marginBottom:"28px",textAlign:"left"}}>
                  {["Empleados ilimitados","Kiosk con PIN por empleado","Geofencing desde el móvil","Alertas de tardanza por email","Nómina quincenal automática","Soporte incluido"].map(f=>(
                    <li key={f} style={{display:"flex",alignItems:"center",gap:"10px",padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.5)",fontSize:"13px",fontFamily:"var(--font-dm-sans)"}}>
                      <div style={{width:"5px",height:"5px",background:"#C9A84C",borderRadius:"50%",flexShrink:0}} />{f}
                    </li>
                  ))}
                </ul>

                <Link href="/en/register" className="btn-3d" style={{display:"block",background:"linear-gradient(135deg,#C9A84C,#F0D080)",color:"#000",padding:"16px",borderRadius:"16px",fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"15px",textDecoration:"none",boxShadow:"0 0 40px rgba(201,168,76,0.2)"}}>
                  Comenzar 7 días gratis
                </Link>
                <p style={{color:"rgba(255,255,255,0.15)",fontSize:"11px",marginTop:"12px",fontFamily:"var(--font-dm-sans)"}}>Sin tarjeta requerida durante el trial</p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{background:"#030303",borderTop:"1px solid rgba(255,255,255,0.05)",padding:"32px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <div style={{width:"24px",height:"24px",borderRadius:"7px",background:"linear-gradient(135deg,#C9A84C,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:"#000",fontWeight:900,fontSize:"10px",fontFamily:"var(--font-syne)"}}>P</span>
            </div>
            <span style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"13px",color:"rgba(255,255,255,0.4)"}}>Punchly.Clock</span>
          </div>
          <p style={{color:"rgba(255,255,255,0.15)",fontSize:"12px",fontFamily:"var(--font-dm-sans)"}}>Control de asistencia profesional · 2026</p>
          <div style={{display:"flex",gap:"20px"}}>
            <Link href="/en/login" style={{color:"rgba(255,255,255,0.2)",fontSize:"12px",textDecoration:"none",fontFamily:"var(--font-dm-sans)"}}>Login</Link>
            <Link href="/en/register" style={{color:"rgba(201,168,76,0.6)",fontSize:"12px",textDecoration:"none",fontFamily:"var(--font-dm-sans)"}}>Registro</Link>
          </div>
        </footer>
      </div>
    </>
  );
}