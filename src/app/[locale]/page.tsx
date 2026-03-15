import Link from "next/link";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
        .glass{background:rgba(255,255,255,0.05);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.1)}
        .glass-gold{background:rgba(201,168,76,0.1);backdrop-filter:blur(20px);border:1px solid rgba(201,168,76,0.25)}
        .gold-text{background:linear-gradient(135deg,#FFD166,#C9A84C,#FFD166);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .glow-gold{box-shadow:0 0 80px rgba(201,168,76,0.25),0 0 160px rgba(201,168,76,0.08)}
        .glow-blue{box-shadow:0 0 80px rgba(96,165,250,0.15),0 0 160px rgba(96,165,250,0.05)}
        .card-3d{transition:transform 0.4s cubic-bezier(0.34,1.2,0.64,1),box-shadow 0.4s ease;transform-style:preserve-3d}
        .card-3d:hover{transform:translateY(-8px) rotateX(4deg) rotateY(-2deg);box-shadow:0 40px 80px rgba(0,0,0,0.6),0 0 60px rgba(201,168,76,0.15)}
        .btn-gold{background:linear-gradient(135deg,#FFD166,#C9A84C);color:#000;font-weight:700;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1)}
        .btn-gold:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 20px 60px rgba(201,168,76,0.5)}
        .btn-ghost{background:rgba(255,255,255,0.05);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.7);transition:all 0.3s ease}
        .btn-ghost:hover{background:rgba(255,255,255,0.1);color:white;border-color:rgba(255,255,255,0.2)}
        .feature-card{transition:all 0.35s cubic-bezier(0.34,1.2,0.64,1);border:1px solid rgba(255,255,255,0.06)}
        .feature-card:hover{transform:translateY(-6px);border-color:rgba(201,168,76,0.3)!important;box-shadow:0 30px 60px rgba(0,0,0,0.4),0 0 40px rgba(201,168,76,0.1)}
        .step-card{transition:all 0.3s ease;border:1px solid rgba(255,255,255,0.06)}
        .step-card:hover{border-color:rgba(96,165,250,0.3)!important;box-shadow:0 20px 40px rgba(0,0,0,0.4),0 0 40px rgba(96,165,250,0.1)}
        @keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-20px) rotate(0.8deg)}}
        @keyframes fade-up{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.7)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        .float{animation:float 8s ease-in-out infinite}
        .fade-up-1{animation:fade-up 1s ease 0.6s both}
        .fade-up-2{animation:fade-up 1s ease 0.8s both}
        .fade-up-3{animation:fade-up 1s ease 1s both}
        .pulse-dot{animation:pulse-dot 2s ease-in-out infinite}
        .shimmer-text{background:linear-gradient(90deg,#FFD166,#fff,#60A5FA,#fff,#FFD166);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 6s linear infinite}
        @media(max-width:768px){.hide-sm{display:none!important}.stack-sm{flex-direction:column!important}.grid-sm-1{grid-template-columns:1fr!important}.grid-sm-2{grid-template-columns:1fr 1fr!important}}
      `}</style>

      <div style={{minHeight:"100vh",color:"white",overflow:"hidden",fontFamily:"var(--font-dm-sans)",
        background:"radial-gradient(ellipse at 20% 0%, rgba(96,165,250,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 0%, rgba(201,168,76,0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(139,92,246,0.08) 0%, transparent 50%), #060810"}}>

        {/* Ambient orbs */}
        <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
          <div style={{position:"absolute",top:"-20%",left:"10%",width:"600px",height:"600px",borderRadius:"50%",background:"radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)",filter:"blur(40px)"}} />
          <div style={{position:"absolute",top:"10%",right:"5%",width:"500px",height:"500px",borderRadius:"50%",background:"radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)",filter:"blur(40px)"}} />
          <div style={{position:"absolute",bottom:"20%",left:"30%",width:"400px",height:"400px",borderRadius:"50%",background:"radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",filter:"blur(40px)"}} />
        </div>

        {/* Nav */}
        <nav style={{position:"absolute",top:0,left:0,right:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"24px 48px",maxWidth:"1280px",margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{width:"34px",height:"34px",borderRadius:"10px",background:"linear-gradient(135deg,#FFD166,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 24px rgba(255,209,102,0.4)"}}>
              <span style={{color:"#000",fontWeight:900,fontSize:"15px",fontFamily:"var(--font-syne)"}}>P</span>
            </div>
            <span style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"15px",letterSpacing:"-0.3px"}}>Punchly.Clock</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
            <Link href="/en/login" style={{fontSize:"13px",color:"rgba(255,255,255,0.45)",textDecoration:"none",fontWeight:500,transition:"color 0.2s"}}>Iniciar sesión</Link>
            <Link href="/en/register" className="glass-gold btn-gold" style={{padding:"9px 22px",borderRadius:"12px",fontSize:"13px",textDecoration:"none",display:"inline-block",fontFamily:"var(--font-syne)"}}>Comenzar gratis</Link>
          </div>
        </nav>

        {/* HERO */}
        <HeroGeometric badge="7 días gratis — sin tarjeta de crédito" title1="Control de asistencia" title2="sin excusas" />

        {/* FLOATING KIOSK */}
        <section style={{position:"relative",zIndex:10,padding:"0 40px 80px",marginTop:"-60px",
          background:"linear-gradient(to bottom, transparent, #060810 40%)"}}>
          <div className="float" style={{maxWidth:"900px",margin:"0 auto"}}>
            <div style={{borderRadius:"28px",padding:"3px",background:"linear-gradient(135deg,rgba(201,168,76,0.3),rgba(96,165,250,0.15),rgba(139,92,246,0.2))",boxShadow:"0 60px 120px rgba(0,0,0,0.7),0 0 80px rgba(201,168,76,0.1)"}}>
              <div style={{background:"linear-gradient(145deg,#0D0F1A,#080A12)",borderRadius:"25px",overflow:"hidden"}}>
                {/* Header */}
                <div style={{padding:"22px 30px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"linear-gradient(to right,rgba(201,168,76,0.05),transparent)"}}>
                  <div>
                    <p style={{fontFamily:"var(--font-syne)",fontSize:"42px",fontWeight:800,lineHeight:1,background:"linear-gradient(135deg,#fff,rgba(255,255,255,0.7))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>09:41</p>
                    <p style={{color:"rgba(255,255,255,0.2)",fontSize:"12px",marginTop:"4px",fontFamily:"var(--font-dm-sans)"}}>Jueves, 12 de marzo · Punchly.Clock</p>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:"8px",alignItems:"flex-end"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"6px",background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.2)",padding:"7px 14px",borderRadius:"100px",boxShadow:"0 0 20px rgba(52,211,153,0.1)"}}>
                      <div className="pulse-dot" style={{width:"6px",height:"6px",background:"#34D399",borderRadius:"50%"}} />
                      <span style={{color:"#34D399",fontSize:"12px",fontWeight:500,fontFamily:"var(--font-dm-sans)"}}>3 en turno ahora</span>
                    </div>
                    <p style={{color:"rgba(255,255,255,0.12)",fontSize:"11px",fontFamily:"var(--font-dm-sans)"}}>Toca tu nombre para fichar</p>
                  </div>
                </div>
                {/* Search */}
                <div style={{padding:"14px 22px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"12px",padding:"11px 16px",display:"flex",alignItems:"center",gap:"10px"}}>
                    <svg width="13" height="13" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    <span style={{color:"rgba(255,255,255,0.15)",fontSize:"13px",fontFamily:"var(--font-dm-sans)"}}>Busca tu nombre...</span>
                  </div>
                </div>
                {/* Employees */}
                <div style={{padding:"18px 22px",display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"10px"}}>
                  {[["A","Ana G.","#FFD166",true],["L","Luis M.","#60A5FA",true],["S","Sofia R.","#34D399",true],["C","Carlos P.","#F87171",false],["M","María J.","#A78BFA",false],["P","Pedro L.","#FB923C",false]].map(([i,n,c,a])=>(
                    <div key={String(n)} className="card-3d" style={{background:a?"rgba(52,211,153,0.05)":"rgba(255,255,255,0.03)",border:a?"1px solid rgba(52,211,153,0.15)":"1px solid rgba(255,255,255,0.06)",borderRadius:"14px",padding:"14px 10px",cursor:"pointer",textAlign:"center",boxShadow:a?"0 0 20px rgba(52,211,153,0.06)":"none"}}>
                      <div style={{width:"34px",height:"34px",borderRadius:"10px",background:String(c)+"18",border:"1px solid "+String(c)+"30",display:"flex",alignItems:"center",justifyContent:"center",color:String(c),fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"13px",margin:"0 auto 8px",boxShadow:"0 0 12px "+String(c)+"20"}}>
                        {i}
                      </div>
                      <p style={{fontSize:"11px",fontWeight:700,color:"rgba(255,255,255,0.9)",fontFamily:"var(--font-syne)",lineHeight:1.2}}>{n}</p>
                      {a
                        ? <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"3px",marginTop:"5px"}}>
                            <div className="pulse-dot" style={{width:"4px",height:"4px",background:"#34D399",borderRadius:"50%"}} />
                            <span style={{color:"#34D399",fontSize:"9px"}}>Activo</span>
                          </div>
                        : <span style={{color:"rgba(255,255,255,0.15)",fontSize:"9px",marginTop:"5px",display:"block"}}>Toca para fichar</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="fade-up-1" style={{maxWidth:"900px",margin:"36px auto 0",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px"}} >
            {[
              {value:"2,847",label:"Fichajes procesados",color:"#FFD166",glow:"rgba(201,168,76,0.15)"},
              {value:"99.9%",label:"Uptime garantizado",color:"#34D399",glow:"rgba(52,211,153,0.1)"},
              {value:"< 1s",label:"Tiempo de respuesta",color:"#60A5FA",glow:"rgba(96,165,250,0.1)"},
              {value:"$49",label:"Pago único forever",color:"#FFD166",glow:"rgba(201,168,76,0.15)"},
            ].map(s=>(
              <div key={s.label} className="glass" style={{borderRadius:"16px",padding:"20px",textAlign:"center",boxShadow:"0 0 40px "+s.glow}}>
                <p style={{fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"26px",color:s.color,lineHeight:1}}>{s.value}</p>
                <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:"rgba(255,255,255,0.3)",marginTop:"6px"}}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section style={{padding:"80px 40px",background:"linear-gradient(to bottom,#060810,#08091A)"}}>
          <div style={{maxWidth:"1100px",margin:"0 auto"}}>
            <div className="fade-up-2" style={{textAlign:"center",marginBottom:"60px"}}>
              <p style={{color:"rgba(201,168,76,0.7)",fontSize:"11px",fontWeight:700,letterSpacing:"3px",textTransform:"uppercase",fontFamily:"var(--font-dm-sans)",marginBottom:"12px"}}>Funcionalidades</p>
              <h2 style={{fontFamily:"var(--font-syne)",fontSize:"clamp(28px,4vw,44px)",fontWeight:800,marginBottom:"12px"}}>Todo lo que necesitas</h2>
              <p style={{color:"rgba(255,255,255,0.25)",fontSize:"14px",maxWidth:"400px",margin:"0 auto",fontFamily:"var(--font-dm-sans)"}}>Sin suscripciones. Sin límites. Un solo pago.</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px"}} className="grid-sm-1">
              {[
                {title:"Kiosk con PIN",desc:"Tablet en la entrada. Cada empleado tiene su PIN de 4 dígitos. Nadie puede fichar por otro.",icon:"M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",color:"#FFD166",glow:"rgba(201,168,76,0.08)"},
                {title:"Geofencing móvil",desc:"El empleado solo puede fichar si está dentro del radio configurado de la empresa.",icon:"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",color:"#60A5FA",glow:"rgba(96,165,250,0.08)"},
                {title:"Alertas en tiempo real",desc:"Email automático cuando alguien llega tarde. Sin configuración extra requerida.",icon:"M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",color:"#F87171",glow:"rgba(248,113,113,0.08)"},
                {title:"Nómina automática",desc:"Cálculo quincenal con horas normales y extras. Exporta a CSV en un clic.",icon:"M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",color:"#34D399",glow:"rgba(52,211,153,0.08)"},
                {title:"Multi-empresa",desc:"Cada cliente tiene su espacio aislado. Datos, empleados y configuración separados.",icon:"M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",color:"#A78BFA",glow:"rgba(167,139,250,0.08)"},
                {title:"Pago único $49",desc:"Sin mensualidades. Sin sorpresas. Paga una vez y usa Punchly.Clock para siempre.",icon:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",color:"#FFD166",glow:"rgba(201,168,76,0.08)"},
              ].map(f=>(
                <div key={f.title} className="feature-card" style={{borderRadius:"20px",padding:"28px",background:"rgba(255,255,255,0.03)",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.05)"}}>
                  <div style={{width:"44px",height:"44px",borderRadius:"13px",background:f.glow,border:"1px solid "+f.color+"25",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"18px",boxShadow:"0 0 20px "+f.glow}}>
                    <svg width="20" height="20" fill="none" stroke={f.color} strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={f.icon}/></svg>
                  </div>
                  <h3 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"16px",marginBottom:"10px",color:"rgba(255,255,255,0.95)"}}>{f.title}</h3>
                  <p style={{color:"rgba(255,255,255,0.3)",fontSize:"13px",lineHeight:1.8,fontFamily:"var(--font-dm-sans)"}}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{padding:"80px 40px",background:"linear-gradient(to bottom,#08091A,#060810)"}}>
          <div style={{maxWidth:"960px",margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:"60px"}}>
              <p style={{color:"rgba(96,165,250,0.7)",fontSize:"11px",fontWeight:700,letterSpacing:"3px",textTransform:"uppercase",fontFamily:"var(--font-dm-sans)",marginBottom:"12px"}}>Proceso</p>
              <h2 style={{fontFamily:"var(--font-syne)",fontSize:"clamp(28px,4vw,44px)",fontWeight:800}}>Listo en 3 minutos</h2>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"20px"}} className="grid-sm-1">
              {[
                {step:"01",title:"Crea tu cuenta",desc:"Regístrate gratis. 7 días de prueba completa sin tarjeta de crédito.",color:"#FFD166",glow:"rgba(201,168,76,0.08)"},
                {step:"02",title:"Agrega empleados",desc:"Crea perfiles, asigna PINs y configura horarios de trabajo.",color:"#60A5FA",glow:"rgba(96,165,250,0.08)"},
                {step:"03",title:"Abre el kiosk",desc:"Coloca una tablet en la entrada. Empleados fichan con su PIN.",color:"#34D399",glow:"rgba(52,211,153,0.08)"},
              ].map((s,i)=>(
                <div key={s.step} className="step-card" style={{borderRadius:"20px",padding:"32px",background:"rgba(255,255,255,0.03)",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.05)"}}>
                  <div style={{fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"52px",lineHeight:1,marginBottom:"16px",
                    background:"linear-gradient(135deg,"+s.color+","+s.color+"40)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                    {s.step}
                  </div>
                  <h3 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"17px",marginBottom:"10px",color:"rgba(255,255,255,0.95)"}}>{s.title}</h3>
                  <p style={{color:"rgba(255,255,255,0.3)",fontSize:"13px",lineHeight:1.8,fontFamily:"var(--font-dm-sans)"}}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section style={{padding:"80px 40px 100px",background:"linear-gradient(to bottom,#060810,#030508)"}}>
          <div style={{maxWidth:"500px",margin:"0 auto",textAlign:"center"}}>
            <div className="fade-up-3">
              <p style={{color:"rgba(201,168,76,0.7)",fontSize:"11px",fontWeight:700,letterSpacing:"3px",textTransform:"uppercase",fontFamily:"var(--font-dm-sans)",marginBottom:"12px"}}>Precio</p>
              <h2 style={{fontFamily:"var(--font-syne)",fontSize:"clamp(28px,4vw,44px)",fontWeight:800,marginBottom:"40px"}}>Sin sorpresas</h2>

              <div style={{borderRadius:"28px",padding:"3px",background:"linear-gradient(135deg,rgba(201,168,76,0.4),rgba(96,165,250,0.2),rgba(139,92,246,0.2))",boxShadow:"0 60px 100px rgba(0,0,0,0.6),0 0 80px rgba(201,168,76,0.1)"}}>
                <div style={{background:"linear-gradient(145deg,#0D0F1A,#080A12)",borderRadius:"25px",padding:"40px"}}>
                  <p style={{color:"rgba(255,255,255,0.25)",fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase",marginBottom:"12px",fontFamily:"var(--font-syne)"}}>Pago único</p>
                  <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:"8px",marginBottom:"8px"}}>
                    <span className="gold-text" style={{fontFamily:"var(--font-syne)",fontSize:"88px",fontWeight:800,lineHeight:1}}>$49</span>
                    <span style={{color:"rgba(255,255,255,0.2)",marginBottom:"14px",fontSize:"14px",fontFamily:"var(--font-dm-sans)"}}>para siempre</span>
                  </div>
                  <p style={{color:"rgba(255,255,255,0.2)",fontSize:"12px",marginBottom:"28px",fontFamily:"var(--font-dm-sans)"}}>Un solo pago. Acceso permanente.</p>

                  <ul style={{listStyle:"none",padding:0,marginBottom:"28px",textAlign:"left"}}>
                    {["Empleados ilimitados","Kiosk con PIN por empleado","Geofencing desde el móvil","Alertas de tardanza por email","Nómina quincenal automática","Soporte incluido"].map((f,i)=>{
                      const colors=["#FFD166","#60A5FA","#34D399","#F87171","#A78BFA","#FB923C"];
                      return (
                        <li key={f} style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.5)",fontSize:"13px",fontFamily:"var(--font-dm-sans)"}}>
                          <div style={{width:"5px",height:"5px",background:colors[i],borderRadius:"50%",flexShrink:0,boxShadow:"0 0 6px "+colors[i]}} />{f}
                        </li>
                      );
                    })}
                  </ul>

                  <Link href="/en/register" className="btn-gold" style={{display:"block",padding:"17px",borderRadius:"16px",fontFamily:"var(--font-syne)",fontSize:"15px",textDecoration:"none",boxShadow:"0 0 50px rgba(201,168,76,0.3)"}}>
                    Comenzar 7 días gratis
                  </Link>
                  <p style={{color:"rgba(255,255,255,0.15)",fontSize:"11px",marginTop:"14px",fontFamily:"var(--font-dm-sans)"}}>Sin tarjeta requerida durante el trial</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{background:"#030508",borderTop:"1px solid rgba(255,255,255,0.04)",padding:"32px 48px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <div style={{width:"26px",height:"26px",borderRadius:"8px",background:"linear-gradient(135deg,#FFD166,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:"#000",fontWeight:900,fontSize:"11px",fontFamily:"var(--font-syne)"}}>P</span>
            </div>
            <span style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"13px",color:"rgba(255,255,255,0.35)"}}>Punchly.Clock</span>
          </div>
          <p style={{color:"rgba(255,255,255,0.12)",fontSize:"12px",fontFamily:"var(--font-dm-sans)"}}>Control de asistencia profesional · 2026</p>
          <div style={{display:"flex",gap:"20px"}}>
            <Link href="/en/login" style={{color:"rgba(255,255,255,0.2)",fontSize:"12px",textDecoration:"none",fontFamily:"var(--font-dm-sans)"}}>Login</Link>
            <Link href="/en/register" style={{color:"rgba(201,168,76,0.5)",fontSize:"12px",textDecoration:"none",fontFamily:"var(--font-dm-sans)"}}>Registro</Link>
          </div>
        </footer>
      </div>
    </>
  );
}