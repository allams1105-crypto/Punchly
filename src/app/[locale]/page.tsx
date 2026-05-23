import Link from "next/link";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export default async function LandingPage({ params }: { params: any }) {
  const { locale } = await params;
  const lang = locale || "es";

  return (
    <>
      <style>{`
        .glass{background:rgba(15, 23, 42, 0.8);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);border:1px solid rgba(255,255,255,0.12);box-shadow:0 8px 32px rgba(0,0,0,0.3);transition:all 0.3s ease}
        .glass:hover{transform:translateY(-4px);border-color:rgba(59, 130, 246, 0.4);box-shadow:0 12px 40px rgba(59, 130, 246, 0.15)}
        .glass-pro{background:rgba(59, 130, 246, 0.05);backdrop-filter:blur(20px);border:1px solid rgba(59, 130, 246, 0.15)}
        .primary-text{background:linear-gradient(135deg,#60A5FA,#3B82F6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .card-pro{transition:transform 0.2s ease,box-shadow 0.2s ease; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.02)}
        .card-pro:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(0,0,0,0.5),0 0 0 1px rgba(59, 130, 246, 0.3)}
        .btn-primary{background:var(--accent);color:#fff;font-family:var(--font-inter);font-weight:600;transition:all 0.2s ease;text-decoration:none;display:inline-block; border:1px solid var(--accent-dark)}
        .btn-primary:hover{background:var(--accent-dark);transform:translateY(-1px);box-shadow:0 4px 12px rgba(59, 130, 246, 0.25)}
        .btn-ghost{background:rgba(255,255,255,0.03);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.8);transition:all 0.2s ease;text-decoration:none;display:inline-block}
        .btn-ghost:hover{background:rgba(255,255,255,0.08);color:white}
        .feature-card{position:relative;overflow:hidden;transition:all 0.4s cubic-bezier(0.4, 0, 0.2, 1);border:1px solid rgba(255,255,255,0.08);background:linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);box-shadow:0 4px 20px rgba(0,0,0,0.2)}
        .feature-card::before{content:"";position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(59, 130, 246, 0.5),transparent);opacity:0;transition:opacity 0.4s ease}
        .feature-card:hover{transform:translateY(-8px);border-color:rgba(59, 130, 246, 0.4)!important;box-shadow:0 20px 40px rgba(0,0,0,0.5), 0 0 40px rgba(59, 130, 246, 0.1)}
        .feature-card:hover::before{opacity:1}
        .step-card{transition:all 0.3s ease;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02)}
        .step-card:hover{border-color:rgba(59, 130, 246, 0.3)!important;box-shadow:0 12px 30px rgba(0,0,0,0.4)}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes fade-up{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse-dot{0%,100%{opacity:1}50%{opacity:0.5}}
        .float{animation:float 6s ease-in-out infinite}
        .fade-up-1{animation:fade-up 0.8s ease 0.2s both}
        .fade-up-2{animation:fade-up 0.8s ease 0.4s both}
        .fade-up-3{animation:fade-up 0.8s ease 0.6s both}
        .pulse-dot{animation:pulse-dot 2s ease-in-out infinite}
        @media(max-width:768px){.hide-sm{display:none!important}.grid-sm-1{grid-template-columns:1fr!important}.grid-sm-2{grid-template-columns:1fr 1fr!important}}
      `}</style>

      <div style={{minHeight:"100vh",color:"var(--text-primary)",overflow:"hidden",fontFamily:"var(--font-inter)",background:"var(--bg-primary)"}}>

        {/* Ambient subtle glow */}
        <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
          <div style={{position:"absolute",top:"-10%",left:"20%",width:"600px",height:"600px",borderRadius:"50%",background:"radial-gradient(circle,rgba(59,130,246,0.04) 0%,transparent 70%)",filter:"blur(60px)"}} />
        </div>

        {/* Nav */}
        <nav style={{position:"absolute",top:0,left:0,right:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 24px",maxWidth:"1280px",margin:"0 auto",boxSizing:"border-box",width:"100%",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{width:"34px",height:"34px",borderRadius:"8px",background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{color:"#fff",fontWeight:800,fontSize:"16px",fontFamily:"var(--font-inter)"}}>P</span>
            </div>
            <span className="hide-sm" style={{fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"15px",letterSpacing:"-0.3px",color:"var(--text-primary)"}}>Punchly.Clock</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
            <Link href={`/${lang}/login`} className="hide-sm" style={{fontSize:"14px",color:"var(--text-muted)",textDecoration:"none",fontWeight:500}}>Iniciar sesión</Link>
            <Link href={`/${lang}/register`} className="btn-primary" style={{padding:"8px 16px",borderRadius:"8px",fontSize:"13px",fontFamily:"var(--font-inter)",textDecoration:"none",display:"inline-block"}}>
              Prueba gratuita
            </Link>
          </div>
        </nav>

        {/* HERO */}
        <HeroGeometric locale={locale} />

        {/* FLOATING KIOSK */}
        <section style={{position:"relative",zIndex:10,padding:"20px 20px 80px"}}>
          <div className="float" style={{maxWidth:"700px",margin:"0 auto"}}>
            <div style={{borderRadius:"16px",padding:"1px",background:"rgba(255,255,255,0.1)",boxShadow:"0 20px 40px rgba(0,0,0,0.4)"}}>
              <div style={{background:"var(--bg-card)",borderRadius:"15px",overflow:"hidden"}}>
                <div style={{padding:"16px 22px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(255,255,255,0.02)"}}>
                  <div>
                    <p style={{fontFamily:"var(--font-inter)",fontSize:"28px",fontWeight:700,lineHeight:1,color:"var(--text-primary)"}}>09:05</p>
                    <p style={{color:"#EF4444",fontSize:"12px",marginTop:"4px",fontFamily:"var(--font-inter)",fontWeight:600}}>⚠️ 1 Llegada tardía detectada</p>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:"6px",background:"rgba(59, 130, 246, 0.1)",border:"1px solid rgba(59, 130, 246, 0.2)",padding:"6px 12px",borderRadius:"6px"}}>
                    <div className="pulse-dot" style={{width:"6px",height:"6px",background:"var(--accent)",borderRadius:"50%"}} />
                    <span style={{color:"var(--accent)",fontSize:"12px",fontWeight:600,fontFamily:"var(--font-inter)"}}>Sistema Activo</span>
                  </div>
                </div>
                <div style={{padding:"16px 18px",display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"12px"}} className="grid-sm-2">
                  {[["A","Ana G.","#3B82F6",true],["L","Luis M.","#6366F1",true],["S","Sofia R.","#10B981",true],["C","Carlos P.","#8B5CF6",false],["M","María J.","#EF4444",false],["P","Pedro L.","#F59E0B",false]].map(([i,n,c,a])=>(
                    <div key={String(n)} className="card-pro" style={{borderRadius:"10px",padding:"14px 8px",cursor:"pointer",textAlign:"center"}}>
                      <div style={{width:"32px",height:"32px",borderRadius:"50%",background:String(c)+"15",display:"flex",alignItems:"center",justifyContent:"center",color:String(c),fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"12px",margin:"0 auto 8px"}}>{i}</div>
                      <p style={{fontSize:"11px",fontWeight:600,color:"var(--text-primary)",fontFamily:"var(--font-inter)",lineHeight:1.2}}>{n}</p>
                      {a ? <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"4px",marginTop:"6px"}}><div className="pulse-dot" style={{width:"4px",height:"4px",background:"#10B981",borderRadius:"50%"}} /><span style={{color:"#10B981",fontSize:"10px",fontWeight:500}}>A tiempo</span></div>
                        : (n === "María J." ? <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"4px",marginTop:"6px"}}><span style={{color:"#EF4444",fontSize:"10px",fontWeight:600}}>Retraso (5m)</span></div> 
                        : <span style={{color:"var(--text-muted)",fontSize:"10px",marginTop:"6px",display:"block"}}>Sin marcar</span>)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="fade-up-1 grid-sm-2" style={{maxWidth:"800px",margin:"40px auto 0",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"16px"}}>
            {[
              {value:"100%",label:"Precisión de Nómina",color:"var(--text-primary)"},
              {value:"0",label:"Errores humanos",color:"var(--text-primary)"},
              {value:"-40%",label:"Reducción de tardanzas",color:"#10B981"},
              {value:"$34",label:"Suscripción mensual",color:"var(--accent)"},
            ].map(s=>(
              <div key={s.label} className="glass" style={{borderRadius:"12px",padding:"20px",textAlign:"center"}}>
                <p style={{fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"24px",color:s.color,lineHeight:1}}>{s.value}</p>
                <p style={{fontFamily:"var(--font-inter)",fontSize:"12px",color:"var(--text-muted)",marginTop:"8px"}}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES - PROBLEM VS SOLUTION */}
        <section style={{padding:"80px 20px",background:"var(--bg-card)",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)"}}>
          <div style={{maxWidth:"1100px",margin:"0 auto"}}>
            <div className="fade-up-2" style={{textAlign:"center",marginBottom:"64px"}}>
              <p style={{color:"var(--accent)",fontSize:"12px",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",fontFamily:"var(--font-inter)",marginBottom:"16px"}}>Diseñado para Restaurantes, Tiendas y Oficinas</p>
              <h2 style={{fontFamily:"var(--font-inter)",fontSize:"clamp(28px,4vw,40px)",fontWeight:700,marginBottom:"16px",color:"var(--text-primary)"}}>Resolviendo problemas reales</h2>
              <p style={{color:"var(--text-muted)",fontSize:"16px",maxWidth:"600px",margin:"0 auto",fontFamily:"var(--font-inter)"}}>Deja de perder tiempo calculando horas a mano o lidiando con empleados que "se cubren" entre ellos.</p>
            </div>
            
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"24px"}} className="grid-sm-1">
              {[
                {t:"IA en Cálculo de Nómina",d:"El sistema procesa automáticamente horas regulares y horas extras. Exporta el reporte quincenal en 1 clic listo para pagar.",icon:"M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",c:"#3B82F6"},
                {t:"Alertas Inteligentes",d:"¿Alguien no llegó a su turno? Punchly te enviará un email al instante para que no tengas sorpresas al abrir tu negocio.",icon:"M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",c:"#EF4444"},
                {t:"Prevención de Fraude",d:"Con Kiosko de PIN único o Geolocalización Móvil estricta. Nadie puede marcar asistencia por un compañero ausente.",icon:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",c:"#10B981"},
              ].map(f=>(
                <div key={f.t} className="feature-card" style={{borderRadius:"16px",padding:"32px"}}>
                  <div style={{width:"48px",height:"48px",borderRadius:"12px",background:f.c+"15",color:f.c,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"20px"}}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={f.icon}/></svg>
                  </div>
                  <h3 style={{fontFamily:"var(--font-inter)",fontWeight:600,fontSize:"18px",marginBottom:"12px",color:"var(--text-primary)"}}>{f.t}</h3>
                  <p style={{color:"var(--text-muted)",fontSize:"14px",lineHeight:1.6,fontFamily:"var(--font-inter)"}}>{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section style={{padding:"80px 20px 100px",borderTop:"1px solid var(--border)"}}>
          <div style={{maxWidth:"480px",margin:"0 auto",textAlign:"center"}}>
            <div className="fade-up-3">
              <p style={{color:"var(--accent)",fontSize:"12px",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",fontFamily:"var(--font-inter)",marginBottom:"16px"}}>Precio</p>
              <h2 style={{fontFamily:"var(--font-inter)",fontSize:"clamp(28px,4vw,40px)",fontWeight:700,marginBottom:"48px",color:"var(--text-primary)"}}>Justo y transparente</h2>
              
              <div style={{background:"var(--bg-card)",borderRadius:"20px",padding:"48px",border:"1px solid var(--border)",boxShadow:"0 12px 40px rgba(0,0,0,0.2)"}}>
                <p style={{color:"var(--text-primary)",fontSize:"14px",fontWeight:600,textTransform:"uppercase",letterSpacing:"1px",marginBottom:"16px",fontFamily:"var(--font-inter)"}}>Suscripción Mensual</p>
                <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:"8px",marginBottom:"12px"}}>
                  <span style={{fontFamily:"var(--font-inter)",fontSize:"72px",fontWeight:800,lineHeight:1,color:"var(--text-primary)"}}>$34</span>
                  <span style={{color:"var(--text-muted)",marginBottom:"14px",fontSize:"16px",fontFamily:"var(--font-inter)"}}>al mes</span>
                </div>
                <p style={{color:"var(--text-muted)",fontSize:"14px",marginBottom:"32px",fontFamily:"var(--font-inter)"}}>Sin contratos. Cancela cuando quieras.</p>
                
                <ul style={{listStyle:"none",padding:0,marginBottom:"40px",textAlign:"left"}}>
                  {[
                    "Empleados ilimitados",
                    "Kiosko web inteligente",
                    "Geolocalización móvil",
                    "Alertas de tardanza",
                    "Cálculo de horas extras",
                    "Asistencia técnica 24/7 incluida"
                  ].map((f)=>(
                    <li key={f} style={{display:"flex",alignItems:"center",gap:"12px",padding:"12px 0",borderBottom:"1px solid var(--border)",color:"var(--text-muted)",fontSize:"14px",fontFamily:"var(--font-inter)"}}>
                      <svg width="16" height="16" fill="none" stroke="var(--accent)" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={`/${lang}/register`} className="btn-primary" style={{display:"block",padding:"16px",borderRadius:"10px",fontFamily:"var(--font-inter)",fontSize:"16px",textDecoration:"none",textAlign:"center",width:"100%",boxSizing:"border-box"}}>
                  Comenzar 7 días gratis
                </Link>
                <p style={{color:"var(--text-muted)",fontSize:"12px",marginTop:"16px",fontFamily:"var(--font-inter)"}}>No requiere tarjeta de crédito</p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{background:"var(--bg-card)",borderTop:"1px solid var(--border)",padding:"32px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{width:"28px",height:"28px",borderRadius:"6px",background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:"#fff",fontWeight:800,fontSize:"12px",fontFamily:"var(--font-inter)"}}>P</span>
            </div>
            <span style={{fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"14px",color:"var(--text-primary)"}}>Punchly.Clock</span>
          </div>
          <p style={{color:"var(--text-muted)",fontSize:"13px",fontFamily:"var(--font-inter)"}}>Sistema Inteligente para Negocios · 2026</p>
          <div style={{display:"flex",gap:"24px"}}>
            <Link href={`/${lang}/login`} style={{color:"var(--text-muted)",fontSize:"13px",textDecoration:"none",fontFamily:"var(--font-inter)"}}>Iniciar sesión</Link>
            <Link href={`/${lang}/register`} style={{color:"var(--text-muted)",fontSize:"13px",textDecoration:"none",fontFamily:"var(--font-inter)"}}>Registro</Link>
          </div>
        </footer>
      </div>
    </>
  );
}