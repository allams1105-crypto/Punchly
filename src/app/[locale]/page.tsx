import Link from "next/link";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export default async function LandingPage({ params }: { params: any }) {
  const { locale } = await params;
  const isEs = locale === "es";

  return (
    <>
      <style>{`
        .glass{background:rgba(255,255,255,0.05);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.09)}
        .glass-gold{background:rgba(201,168,76,0.1);backdrop-filter:blur(20px);border:1px solid rgba(201,168,76,0.25)}
        .gold-text{background:linear-gradient(135deg,#FFD166,#C9A84C,#FFD166);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .card-3d{transition:transform 0.4s cubic-bezier(0.34,1.2,0.64,1),box-shadow 0.4s ease;transform-style:preserve-3d}
        .card-3d:hover{transform:translateY(-8px) rotateX(4deg) rotateY(-2deg);box-shadow:0 40px 80px rgba(0,0,0,0.6),0 0 60px rgba(201,168,76,0.15)}
        .btn-gold{background:linear-gradient(135deg,#FFD166,#C9A84C);color:#000;font-family:var(--font-syne);font-weight:700;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);text-decoration:none;display:inline-block}
        .btn-gold:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 20px 60px rgba(201,168,76,0.5)}
        .btn-ghost{background:rgba(255,255,255,0.05);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.7);transition:all 0.3s ease;text-decoration:none;display:inline-block}
        .btn-ghost:hover{background:rgba(255,255,255,0.1);color:white;transform:translateY(-2px)}
        .feature-card{transition:all 0.35s cubic-bezier(0.34,1.2,0.64,1);border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.03)}
        .feature-card:hover{transform:translateY(-6px);border-color:rgba(201,168,76,0.3)!important;box-shadow:0 30px 60px rgba(0,0,0,0.4),0 0 40px rgba(201,168,76,0.1)}
        .step-card{transition:all 0.3s ease;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.03)}
        .step-card:hover{border-color:rgba(96,165,250,0.3)!important;box-shadow:0 20px 40px rgba(0,0,0,0.4)}
        @keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-16px) rotate(0.8deg)}}
        @keyframes fade-up{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.7)}}
        .float{animation:float 8s ease-in-out infinite}
        .fade-up-1{animation:fade-up 1s ease 0.6s both}
        .fade-up-2{animation:fade-up 1s ease 0.8s both}
        .fade-up-3{animation:fade-up 1s ease 1s both}
        .pulse-dot{animation:pulse-dot 2s ease-in-out infinite}
        .lang-btn{font-size:12px;color:rgba(255,255,255,0.3);text-decoration:none;padding:5px 10px;border-radius:8px;transition:all 0.2s;font-family:var(--font-dm-sans);font-weight:500}
        .lang-btn:hover{color:white;background:rgba(255,255,255,0.06)}
        .lang-active{color:#C9A84C!important;font-weight:700!important}
        @media(max-width:768px){.hide-sm{display:none!important}.grid-sm-1{grid-template-columns:1fr!important}.grid-sm-2{grid-template-columns:1fr 1fr!important}}
      `}</style>

      <div style={{minHeight:"100vh",color:"white",overflow:"hidden",fontFamily:"var(--font-dm-sans)",
        background:"radial-gradient(ellipse at 20% 0%, rgba(96,165,250,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 0%, rgba(201,168,76,0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(139,92,246,0.07) 0%, transparent 50%), #060810"}}>

        {/* Ambient orbs */}
        <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
          <div style={{position:"absolute",top:"-20%",left:"10%",width:"600px",height:"600px",borderRadius:"50%",background:"radial-gradient(circle,rgba(201,168,76,0.07) 0%,transparent 70%)",filter:"blur(40px)"}} />
          <div style={{position:"absolute",top:"10%",right:"5%",width:"500px",height:"500px",borderRadius:"50%",background:"radial-gradient(circle,rgba(96,165,250,0.07) 0%,transparent 70%)",filter:"blur(40px)"}} />
          <div style={{position:"absolute",bottom:"20%",left:"30%",width:"400px",height:"400px",borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.05) 0%,transparent 70%)",filter:"blur(40px)"}} />
        </div>

        {/* Nav */}
        <nav style={{position:"absolute",top:0,left:0,right:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 24px",maxWidth:"1280px",margin:"0 auto",boxSizing:"border-box",width:"100%"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{width:"34px",height:"34px",borderRadius:"10px",background:"linear-gradient(135deg,#FFD166,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 24px rgba(255,209,102,0.35)",flexShrink:0}}>
              <span style={{color:"#000",fontWeight:900,fontSize:"15px",fontFamily:"var(--font-syne)"}}>P</span>
            </div>
            <span className="hide-sm" style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"15px",letterSpacing:"-0.3px"}}>Punchly.Clock</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
            <a href="/en" className={"lang-btn"+(isEs?"":" lang-active")} style={{fontSize:"11px",padding:"4px 8px"}}>EN</a>
            <span style={{color:"rgba(255,255,255,0.1)",fontSize:"10px"}}>·</span>
            <a href="/es" className={"lang-btn"+(isEs?" lang-active":"")} style={{fontSize:"11px",padding:"4px 8px"}}>ES</a>
            <span className="hide-sm" style={{width:"1px",height:"14px",background:"rgba(255,255,255,0.1)",margin:"0 6px"}} />
            <Link href={`/${locale}/login`} className="hide-sm" style={{fontSize:"13px",color:"rgba(255,255,255,0.45)",textDecoration:"none",fontWeight:500}}>{isEs?"Iniciar sesión":"Sign in"}</Link>
            <Link href={`/${locale}/register`} className="btn-gold" style={{padding:"8px 16px",borderRadius:"10px",fontSize:"12px",fontFamily:"var(--font-syne)",textDecoration:"none",display:"inline-block",marginLeft:"4px"}}>
              {isEs?"Comenzar":"Get started"}
            </Link>
          </div>
        </nav>

        {/* HERO */}
        <HeroGeometric locale={locale} />

        {/* FLOATING KIOSK */}
        <section style={{position:"relative",zIndex:10,padding:"20px 20px 80px",background:"linear-gradient(to bottom,transparent,#060810 50%)"}}>
          <div className="float" style={{maxWidth:"700px",margin:"0 auto"}}>
            <div style={{borderRadius:"24px",padding:"3px",background:"linear-gradient(135deg,rgba(201,168,76,0.3),rgba(96,165,250,0.15),rgba(139,92,246,0.2))",boxShadow:"0 50px 100px rgba(0,0,0,0.7),0 0 80px rgba(201,168,76,0.08)"}}>
              <div style={{background:"linear-gradient(145deg,#0D0F1A,#080A12)",borderRadius:"21px",overflow:"hidden"}}>
                <div style={{padding:"16px 22px",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"linear-gradient(to right,rgba(201,168,76,0.04),transparent)"}}>
                  <div>
                    <p style={{fontFamily:"var(--font-syne)",fontSize:"32px",fontWeight:800,lineHeight:1,color:"white"}}>09:41</p>
                    <p style={{color:"rgba(255,255,255,0.2)",fontSize:"11px",marginTop:"3px",fontFamily:"var(--font-dm-sans)"}}>Thursday, March 12</p>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:"6px",background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.15)",padding:"6px 12px",borderRadius:"100px"}}>
                    <div className="pulse-dot" style={{width:"5px",height:"5px",background:"#34D399",borderRadius:"50%"}} />
                    <span style={{color:"#34D399",fontSize:"11px",fontWeight:500,fontFamily:"var(--font-dm-sans)"}}>3 on shift</span>
                  </div>
                </div>
                <div style={{padding:"10px 18px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"10px",padding:"9px 14px",display:"flex",alignItems:"center",gap:"8px"}}>
                    <svg width="12" height="12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    <span style={{color:"rgba(255,255,255,0.15)",fontSize:"12px",fontFamily:"var(--font-dm-sans)"}}>Search your name...</span>
                  </div>
                </div>
                <div style={{padding:"14px 18px",display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"8px"}} className="grid-sm-2">
                  {[["A","Ana G.","#FFD166",true],["L","Luis M.","#60A5FA",true],["S","Sofia R.","#34D399",true],["C","Carlos P.","#F87171",false],["M","María J.","#A78BFA",false],["P","Pedro L.","#FB923C",false]].map(([i,n,c,a])=>(
                    <div key={String(n)} className="card-3d" style={{background:a?"rgba(52,211,153,0.05)":"rgba(255,255,255,0.03)",border:a?"1px solid rgba(52,211,153,0.12)":"1px solid rgba(255,255,255,0.05)",borderRadius:"12px",padding:"12px 8px",cursor:"pointer",textAlign:"center"}}>
                      <div style={{width:"28px",height:"28px",borderRadius:"8px",background:String(c)+"18",border:"1px solid "+String(c)+"25",display:"flex",alignItems:"center",justifyContent:"center",color:String(c),fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"11px",margin:"0 auto 6px",boxShadow:"0 0 10px "+String(c)+"20"}}>{i}</div>
                      <p style={{fontSize:"9px",fontWeight:700,color:"rgba(255,255,255,0.85)",fontFamily:"var(--font-syne)",lineHeight:1.2}}>{n}</p>
                      {a ? <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"3px",marginTop:"4px"}}><div className="pulse-dot" style={{width:"3px",height:"3px",background:"#34D399",borderRadius:"50%"}} /><span style={{color:"#34D399",fontSize:"8px"}}>Active</span></div>
                        : <span style={{color:"rgba(255,255,255,0.15)",fontSize:"8px",marginTop:"4px",display:"block"}}>Tap to clock</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="fade-up-1 grid-sm-2" style={{maxWidth:"700px",margin:"28px auto 0",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px"}}>
            {[
              {value:"2,847",label:isEs?"Fichajes procesados":"Clock-ins processed",color:"#FFD166",glow:"rgba(201,168,76,0.12)"},
              {value:"99.9%",label:isEs?"Uptime garantizado":"Uptime guaranteed",color:"#34D399",glow:"rgba(52,211,153,0.08)"},
              {value:"< 1s",label:isEs?"Tiempo de respuesta":"Response time",color:"#60A5FA",glow:"rgba(96,165,250,0.08)"},
              {value:"$49",label:isEs?"Pago único":"One-time forever",color:"#FFD166",glow:"rgba(201,168,76,0.12)"},
            ].map(s=>(
              <div key={s.label} className="glass" style={{borderRadius:"14px",padding:"16px",textAlign:"center",boxShadow:"0 0 30px "+s.glow}}>
                <p style={{fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"22px",color:s.color,lineHeight:1}}>{s.value}</p>
                <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"10px",color:"rgba(255,255,255,0.3)",marginTop:"5px"}}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section style={{padding:"60px 20px",background:"linear-gradient(to bottom,#060810,#08091A)"}}>
          <div style={{maxWidth:"1100px",margin:"0 auto"}}>
            <div className="fade-up-2" style={{textAlign:"center",marginBottom:"56px"}}>
              <p style={{color:"rgba(201,168,76,0.7)",fontSize:"11px",fontWeight:700,letterSpacing:"3px",textTransform:"uppercase",fontFamily:"var(--font-dm-sans)",marginBottom:"12px"}}>{isEs?"Funcionalidades":"Features"}</p>
              <h2 style={{fontFamily:"var(--font-syne)",fontSize:"clamp(28px,4vw,44px)",fontWeight:800,marginBottom:"12px"}}>{isEs?"Todo lo que necesitas":"Everything you need"}</h2>
              <p style={{color:"rgba(255,255,255,0.25)",fontSize:"14px",maxWidth:"400px",margin:"0 auto",fontFamily:"var(--font-dm-sans)"}}>{isEs?"Sin suscripciones. Un solo pago.":"No subscriptions. One payment."}</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px"}} className="grid-sm-1">
              {[
                {t:isEs?"Kiosk con PIN":"PIN Kiosk",d:isEs?"Tablet en la entrada. PIN único por empleado. Nadie puede fichar por otro.":"Tablet at the entrance. Unique PIN per employee. No buddy punching.",icon:"M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",c:"#FFD166",g:"rgba(201,168,76,0.08)"},
                {t:isEs?"Geofencing":"Mobile Geofencing",d:isEs?"Solo pueden fichar desde el celular si están dentro del radio de la empresa.":"Employees can only clock in from their phone within the company radius.",icon:"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",c:"#60A5FA",g:"rgba(96,165,250,0.08)"},
                {t:isEs?"Alertas en tiempo real":"Live Alerts",d:isEs?"Email automático cuando alguien llega tarde. Sin configuración extra.":"Automatic email when someone is late. No extra setup needed.",icon:"M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",c:"#F87171",g:"rgba(248,113,113,0.08)"},
                {t:isEs?"Nómina automática":"Auto Payroll",d:isEs?"Cálculo quincenal con horas normales y extras. Exporta a CSV en un clic.":"Bi-weekly calculation with regular and overtime. Export to CSV in one click.",icon:"M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",c:"#34D399",g:"rgba(52,211,153,0.08)"},
                {t:isEs?"Multi-empresa":"Multi-tenant",d:isEs?"Cada cliente tiene su espacio aislado con sus empleados y configuración.":"Each client has their own isolated space with employees and settings.",icon:"M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",c:"#A78BFA",g:"rgba(167,139,250,0.08)"},
                {t:isEs?"Pago único $49":"One-time $49",d:isEs?"Sin mensualidades. Sin sorpresas. Paga una vez y usa Punchly.Clock para siempre.":"No subscriptions. No surprises. Pay once and use Punchly.Clock forever.",icon:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",c:"#FFD166",g:"rgba(201,168,76,0.08)"},
              ].map(f=>(
                <div key={f.t} className="feature-card" style={{borderRadius:"20px",padding:"28px",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.05)"}}>
                  <div style={{width:"44px",height:"44px",borderRadius:"13px",background:f.g,border:"1px solid "+f.c+"22",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"18px",boxShadow:"0 0 20px "+f.g}}>
                    <svg width="20" height="20" fill="none" stroke={f.c} strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={f.icon}/></svg>
                  </div>
                  <h3 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"16px",marginBottom:"10px",color:"rgba(255,255,255,0.95)"}}>{f.t}</h3>
                  <p style={{color:"rgba(255,255,255,0.3)",fontSize:"13px",lineHeight:1.8,fontFamily:"var(--font-dm-sans)"}}>{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{padding:"60px 20px",background:"linear-gradient(to bottom,#08091A,#060810)"}}>
          <div style={{maxWidth:"960px",margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:"56px"}}>
              <p style={{color:"rgba(96,165,250,0.7)",fontSize:"11px",fontWeight:700,letterSpacing:"3px",textTransform:"uppercase",fontFamily:"var(--font-dm-sans)",marginBottom:"12px"}}>{isEs?"Proceso":"Process"}</p>
              <h2 style={{fontFamily:"var(--font-syne)",fontSize:"clamp(28px,4vw,44px)",fontWeight:800}}>{isEs?"Listo en 3 minutos":"Up and running in 3 minutes"}</h2>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"20px"}} className="grid-sm-1">
              {[
                {step:"01",t:isEs?"Crea tu cuenta":"Create your account",d:isEs?"Regístrate gratis. 7 días de prueba completa.":"Sign up free. Full 7-day trial.",c:"#FFD166"},
                {step:"02",t:isEs?"Agrega empleados":"Add employees",d:isEs?"Crea perfiles, asigna PINs y configura horarios.":"Create profiles, assign PINs and set schedules.",c:"#60A5FA"},
                {step:"03",t:isEs?"Abre el kiosk":"Open the kiosk",d:isEs?"Coloca una tablet en la entrada y listo.":"Place a tablet at the entrance and you're done.",c:"#34D399"},
              ].map(s=>(
                <div key={s.step} className="step-card" style={{borderRadius:"20px",padding:"32px",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.05)"}}>
                  <div style={{fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"52px",lineHeight:1,marginBottom:"16px",
                    background:"linear-gradient(135deg,"+s.c+","+s.c+"30)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{s.step}</div>
                  <h3 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"17px",marginBottom:"10px",color:"rgba(255,255,255,0.95)"}}>{s.t}</h3>
                  <p style={{color:"rgba(255,255,255,0.3)",fontSize:"13px",lineHeight:1.8,fontFamily:"var(--font-dm-sans)"}}>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section style={{padding:"60px 20px 80px",background:"linear-gradient(to bottom,#060810,#030508)"}}>
          <div style={{maxWidth:"500px",margin:"0 auto",textAlign:"center"}}>
            <div className="fade-up-3">
              <p style={{color:"rgba(201,168,76,0.7)",fontSize:"11px",fontWeight:700,letterSpacing:"3px",textTransform:"uppercase",fontFamily:"var(--font-dm-sans)",marginBottom:"12px"}}>{isEs?"Precio":"Pricing"}</p>
              <h2 style={{fontFamily:"var(--font-syne)",fontSize:"clamp(28px,4vw,44px)",fontWeight:800,marginBottom:"40px"}}>{isEs?"Sin sorpresas":"No surprises"}</h2>
              <div style={{borderRadius:"28px",padding:"3px",background:"linear-gradient(135deg,rgba(201,168,76,0.4),rgba(96,165,250,0.2),rgba(139,92,246,0.2))",boxShadow:"0 60px 100px rgba(0,0,0,0.6),0 0 80px rgba(201,168,76,0.1)"}}>
                <div style={{background:"linear-gradient(145deg,#0D0F1A,#080A12)",borderRadius:"25px",padding:"40px"}}>
                  <p style={{color:"rgba(255,255,255,0.2)",fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase",marginBottom:"12px",fontFamily:"var(--font-syne)"}}>{isEs?"Pago único":"One-time payment"}</p>
                  <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:"8px",marginBottom:"8px"}}>
                    <span className="gold-text" style={{fontFamily:"var(--font-syne)",fontSize:"88px",fontWeight:800,lineHeight:1}}>$49</span>
                    <span style={{color:"rgba(255,255,255,0.2)",marginBottom:"14px",fontSize:"14px",fontFamily:"var(--font-dm-sans)"}}>{isEs?"para siempre":"forever"}</span>
                  </div>
                  <p style={{color:"rgba(255,255,255,0.2)",fontSize:"12px",marginBottom:"28px",fontFamily:"var(--font-dm-sans)"}}>{isEs?"Un solo pago. Acceso permanente.":"One payment. Permanent access."}</p>
                  <ul style={{listStyle:"none",padding:0,marginBottom:"28px",textAlign:"left"}}>
                    {(isEs
                      ? [["Empleados ilimitados","#FFD166"],["Kiosk con PIN","#60A5FA"],["Geofencing móvil","#34D399"],["Alertas por email","#F87171"],["Nómina automática","#A78BFA"],["Soporte incluido","#FB923C"]]
                      : [["Unlimited employees","#FFD166"],["PIN kiosk","#60A5FA"],["Mobile geofencing","#34D399"],["Email alerts","#F87171"],["Auto payroll","#A78BFA"],["Support included","#FB923C"]]
                    ).map(([f,c])=>(
                      <li key={String(f)} style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.5)",fontSize:"13px",fontFamily:"var(--font-dm-sans)"}}>
                        <div style={{width:"5px",height:"5px",background:String(c),borderRadius:"50%",flexShrink:0,boxShadow:"0 0 6px "+String(c)}} />{f}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/${locale}/register`} className="btn-gold" style={{display:"block",padding:"17px",borderRadius:"16px",fontFamily:"var(--font-syne)",fontSize:"15px",textDecoration:"none",textAlign:"center",boxShadow:"0 0 50px rgba(201,168,76,0.3)"}}>
                    {isEs?"Comenzar 7 días gratis":"Start 7-day free trial"}
                  </Link>
                  <p style={{color:"rgba(255,255,255,0.12)",fontSize:"11px",marginTop:"14px",fontFamily:"var(--font-dm-sans)"}}>{isEs?"Acceso completo durante el trial":"Full access during trial"}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{background:"#030508",borderTop:"1px solid rgba(255,255,255,0.04)",padding:"24px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <div style={{width:"26px",height:"26px",borderRadius:"8px",background:"linear-gradient(135deg,#FFD166,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:"#000",fontWeight:900,fontSize:"11px",fontFamily:"var(--font-syne)"}}>P</span>
            </div>
            <span style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"13px",color:"rgba(255,255,255,0.3)"}}>Punchly.Clock</span>
          </div>
          <p style={{color:"rgba(255,255,255,0.12)",fontSize:"12px",fontFamily:"var(--font-dm-sans)"}}>Professional attendance tracking · 2026</p>
          <div style={{display:"flex",gap:"20px"}}>
            <Link href={`/${locale}/login`} style={{color:"rgba(255,255,255,0.2)",fontSize:"12px",textDecoration:"none",fontFamily:"var(--font-dm-sans)"}}>{isEs?"Iniciar sesión":"Login"}</Link>
            <Link href={`/${locale}/register`} style={{color:"rgba(201,168,76,0.5)",fontSize:"12px",textDecoration:"none",fontFamily:"var(--font-dm-sans)"}}>{isEs?"Registro":"Register"}</Link>
          </div>
        </footer>
      </div>
    </>
  );
}