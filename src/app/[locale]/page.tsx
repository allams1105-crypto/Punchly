import Link from "next/link";
import { MapPin, Clock, FileSpreadsheet, Check, ArrowRight } from "lucide-react";
import InteractivePricing from "@/components/ui/InteractivePricing";
export default async function LandingPage({ params }: { params: any }) {
  const { locale } = await params;
  const lang = locale || "es";

  return (
    <>
      <style>{`
        .landing-override {
          --bg-primary: #F8FAFC !important;
          --bg-card: #FFFFFF !important;
          --border: #E2E8F0 !important;
          --text-primary: #1E293B !important;
          --text-muted: #64748B !important;
        }
        .landing-override .glass {
          background: #FFFFFF !important;
          border: 1px solid #E2E8F0 !important;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03) !important;
        }
        .landing-override .feature-card {
          background: #FFFFFF !important;
          border: 1px solid #E2E8F0 !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04) !important;
        }
        .landing-override .feature-card:hover {
          border-color: #1E3A8A !important;
          box-shadow: 0 20px 40px rgba(2, 132, 199, 0.1) !important;
        }
        .bizneo-btn-blue {
          background: #1E3A8A;
          color: white;
          border-radius: 8px;
          padding: 14px 28px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
        }
        .bizneo-btn-blue:hover {
          background: #172554;
        }
        .bizneo-btn-outline {
          border: 1px solid #94A3B8;
          color: #1E293B;
          border-radius: 8px;
          padding: 14px 28px;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          transition: all 0.2s;
        }
        .bizneo-btn-outline:hover {
          background: rgba(0,0,0,0.02);
          border-color: #1E293B;
        }
        .mockup-shadow {
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
        }
        
        .cool-bar-scroll::-webkit-scrollbar {
          height: 0px;
          background: transparent;
        }
        
        @media(max-width:768px){
          .hide-sm{display:none!important}
          .hero-title{font-size:36px!important}
        }
      `}</style>

      <div className="landing-override" style={{minHeight:"100vh",color:"var(--text-primary)",overflow:"hidden",fontFamily:"var(--font-inter)",background:"var(--bg-primary)"}}>
        
        {/* NEW HERO BACKGROUND */}
        <div style={{position:"absolute", top:0, left:0, right:0, height:"600px", background:"linear-gradient(180deg, #F0F6FF 0%, #F8FAFC 100%)", zIndex:0}}></div>

        {/* NAV */}
        <nav style={{position:"relative",zIndex:50,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"24px 40px",maxWidth:"1400px",margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
             <img src="/logo.png" alt="Punchly" style={{width:"28px",height:"28px",borderRadius:"8px",objectFit:"contain"}} />
             <span style={{fontFamily:"var(--font-inter)",fontWeight:800,fontSize:"22px",letterSpacing:"-0.5px",color:"#1A2B4C"}}>
               punchly
             </span>
          </div>

          <div className="hide-sm" style={{display:"flex",alignItems:"center",gap:"24px"}}>
             <Link href={`/${lang}/login`} style={{color:"#1A2B4C",textDecoration:"none",fontWeight:600,fontSize:"14px"}}>Iniciar sesión</Link>
             <Link href={`/${lang}/register`} className="bizneo-btn-blue" style={{padding:"10px 20px"}}>Registrarse gratis</Link>
          </div>
        </nav>

        {/* CENTERED HERO (Clockify Style) */}
        <section style={{textAlign: "center", paddingTop: "60px", paddingBottom: "20px", position: "relative", zIndex: 10, maxWidth: "800px", margin: "0 auto", paddingLeft: "20px", paddingRight: "20px"}}>
          {/* Stars */}
          <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "4px", marginBottom: "20px"}}>
            <div style={{display: "flex", gap: "2px", color: "#FBBF24"}}>
              {[1,2,3,4].map(i => (
                <svg key={i} width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              ))}
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" opacity="0.5"/></svg>
            </div>
            <span style={{color: "#64748B", fontSize: "14px", marginLeft: "8px", fontWeight: 500}}>4.8 (9,000+ reseñas)</span>
          </div>

          <h1 className="hero-title" style={{fontFamily:"var(--font-inter)",fontSize:"clamp(40px, 6vw, 68px)",fontWeight:800,lineHeight:1.1,letterSpacing:"-1px",marginBottom:"24px",color:"#1A2B4C"}}>
            Calcula la nómina en <br/>
            <span style={{color:"#1E3A8A"}}>solo 30 segundos</span>
          </h1>
          <p style={{color:"#4A5568",fontSize:"18px",lineHeight:1.6,fontWeight:500,maxWidth:"650px",margin:"0 auto 32px"}}>
            Tus empleados pueden ponchar desde el celular, pero solo si están en el negocio. El sistema de asistencia con validación por ubicación que evita fraudes y automatiza tu planilla.
          </p>

          <Link href={`/${lang}/register`} className="bizneo-btn-blue" style={{padding: "16px 36px", fontSize: "16px"}}>
            Registrarse gratis
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </Link>
          
          <div style={{marginTop: "20px", color: "#1E3A8A", fontSize: "14px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"}}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Primera quincena gratis · Configuración incluida
          </div>
        </section>

        {/* ORIGINAL APP MOCKUP */}
        <section style={{position: "relative", zIndex: 10, maxWidth: "1000px", margin: "40px auto 0", padding: "0 20px 100px", display: "flex", flexDirection: "column", alignItems: "center"}}>
          <div className="mockup-shadow" style={{width: "100%", background: "#F8FAFC", borderRadius: "24px", border: "1px solid #E2E8F0", overflow: "hidden", display: "flex", flexDirection: "column", position: "relative"}}>
            {/* Window Controls */}
            <div style={{background: "#F1F5F9", padding: "16px 24px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #E2E8F0"}}>
              <div style={{width: "12px", height: "12px", borderRadius: "50%", background: "#EF4444"}}></div>
              <div style={{width: "12px", height: "12px", borderRadius: "50%", background: "#F59E0B"}}></div>
              <div style={{width: "12px", height: "12px", borderRadius: "50%", background: "#10B981"}}></div>
            </div>
            
            {/* Dashboard Content */}
            <div style={{padding: "40px", display: "flex", gap: "40px", alignItems: "center", justifyContent: "center"}}>
              {/* Mobile Phone Simulation */}
              <div style={{width: "300px", background: "#FFFFFF", borderRadius: "32px", border: "8px solid #E2E8F0", padding: "24px", display: "flex", flexDirection: "column", gap: "24px", flexShrink: 0, boxShadow: "0 4px 20px rgba(0,0,0,0.05)"}}>
                <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
                  <div style={{width: "48px", height: "48px", background: "#1E3A8A", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "20px"}}>J</div>
                  <div>
                    <div style={{color: "#1E293B", fontWeight: 700, fontSize: "18px"}}>Juan Pérez</div>
                    <div style={{color: "#64748B", fontSize: "13px"}}>Cajero</div>
                  </div>
                </div>
                
                <div style={{background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "16px", padding: "20px", textAlign: "center"}}>
                  <div style={{color: "#10B981", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px"}}>Turno Activo</div>
                  <div style={{color: "#1E293B", fontSize: "32px", fontWeight: 800, fontFamily: "var(--font-inter)", letterSpacing: "-1px"}}>04:12:35</div>
                </div>
                
                <button style={{background: "#EF4444", color: "white", border: "none", padding: "16px", borderRadius: "16px", fontWeight: 700, fontSize: "16px", width: "100%", cursor: "pointer"}}>
                  Terminar Turno
                </button>
                
                <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "#64748B", fontSize: "12px"}}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                  Ubicación validada
                </div>
              </div>

              {/* Desktop Dashboard Elements */}
              <div className="hide-sm" style={{flex: 1, display: "flex", flexDirection: "column", gap: "20px"}}>
                <div style={{display: "flex", gap: "20px"}}>
                  <div style={{flex: 1, background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "20px", padding: "24px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)"}}>
                    <div style={{color: "#64748B", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px"}}>Horas Trabajadas</div>
                    <div style={{color: "#1E293B", fontSize: "36px", fontWeight: 800}}>42h 15m</div>
                  </div>
                  <div style={{flex: 1, background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "20px", padding: "24px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)"}}>
                    <div style={{color: "#64748B", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px"}}>Tardanzas</div>
                    <div style={{color: "#10B981", fontSize: "36px", fontWeight: 800}}>0</div>
                  </div>
                </div>
                
                <div style={{background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "20px", padding: "24px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)"}}>
                  <div style={{color: "#64748B", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px"}}>Actividad Reciente</div>
                  {[
                    {name: "Juan Pérez", action: "Entrada", time: "08:00 AM", status: "A tiempo"},
                    {name: "María Gómez", action: "Salida", time: "05:00 PM", status: "Turno completo"},
                    {name: "Carlos Ruiz", action: "Entrada", time: "08:15 AM", status: "Tarde"}
                  ].map((log, i) => (
                    <div key={i} style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i !== 2 ? "1px solid #F1F5F9" : "none"}}>
                      <div style={{color: "#1E293B", fontWeight: 600, fontSize: "14px"}}>{log.name}</div>
                      <div style={{color: "#64748B", fontSize: "14px"}}>{log.action} a las {log.time}</div>
                      <div style={{color: log.status === "Tarde" ? "#EF4444" : "#10B981", fontSize: "12px", fontWeight: 700, background: log.status === "Tarde" ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", padding: "4px 8px", borderRadius: "6px"}}>{log.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section style={{position:"relative",zIndex:10,padding:"40px 20px",marginTop:"0",background:"transparent"}}>
          <div className="grid-sm-2" style={{maxWidth:"1000px",margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"16px"}}>
            {[
              {value:"100%",label:"Precisión de Nómina",color:"var(--text-primary)"},
              {value:"0",label:"Errores humanos",color:"var(--text-primary)"},
              {value:"-40%",label:"Reducción de tardanzas",color:"#10B981"},
              {value:"RD$299",label:"Suscripción desde",color:"#1E3A8A"},
            ].map(s=>(
              <div key={s.label} className="glass" style={{borderRadius:"12px",padding:"24px 20px",textAlign:"center"}}>
                <p style={{fontFamily:"var(--font-inter)",fontWeight:800,fontSize:"28px",color:s.color,lineHeight:1}}>{s.value}</p>
                <p style={{fontFamily:"var(--font-inter)",fontSize:"13px",fontWeight:600,color:"var(--text-muted)",marginTop:"12px"}}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BEFORE & AFTER */}
        <section style={{padding:"60px 20px", background:"transparent", position:"relative", zIndex:10}}>
          <div style={{maxWidth:"900px", margin:"0 auto"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"32px"}}>
              {/* Before */}
              <div style={{background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:"20px",padding:"40px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"24px",color:"var(--text-primary)"}}>
                  <svg width="28" height="28" fill="none" stroke="#EF4444" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <h3 style={{fontFamily:"var(--font-inter)",fontWeight:800,fontSize:"22px"}}>Sin Punchly</h3>
                </div>
                <ul style={{listStyle:"none",padding:0,color:"var(--text-muted)",fontSize:"16px",fontFamily:"var(--font-inter)",lineHeight:1.6}}>
                  <li style={{marginBottom:"16px",display:"flex",gap:"12px"}}><span><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#EF4444" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></span> Llaman al supervisor</li>
                  <li style={{marginBottom:"16px",display:"flex",gap:"12px"}}><span><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#EF4444" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></span> Firman una hoja de papel</li>
                  <li style={{marginBottom:"16px",display:"flex",gap:"12px"}}><span><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#EF4444" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></span> Envían mensajes por WhatsApp</li>
                  <li style={{marginBottom:"16px",display:"flex",gap:"12px"}}><span><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#EF4444" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></span> O simplemente dicen "ya llegué"</li>
                </ul>
              </div>

              {/* After */}
              <div style={{background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:"20px",padding:"40px",boxShadow:"0 12px 40px rgba(0,0,0,0.05)"}}>
                <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"24px",color:"var(--text-primary)"}}>
                  <svg width="28" height="28" fill="none" stroke="#10B981" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <h3 style={{fontFamily:"var(--font-inter)",fontWeight:800,fontSize:"22px"}}>Con Punchly</h3>
                </div>
                <ul style={{listStyle:"none",padding:0,color:"var(--text-muted)",fontSize:"16px",fontFamily:"var(--font-inter)",lineHeight:1.6,fontWeight:500}}>
                  <li style={{marginBottom:"16px",display:"flex",gap:"12px"}}><span><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></span> Abren la app desde el celular</li>
                  <li style={{marginBottom:"16px",display:"flex",gap:"12px"}}><span><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></span> Presionan "Entrar"</li>
                  <li style={{marginBottom:"16px",display:"flex",gap:"12px"}}><span><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></span> El sistema verifica la ubicación GPS</li>
                  <li style={{marginBottom:"16px",display:"flex",gap:"12px"}}><span><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></span> Registra la hora automáticamente</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section style={{padding:"80px 20px",background:"var(--bg-card)",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)",position:"relative",zIndex:10}}>
          <div style={{maxWidth:"1100px",margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:"64px"}}>
              <p style={{color:"#1E3A8A",fontSize:"13px",fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",fontFamily:"var(--font-inter)",marginBottom:"16px"}}>Diseñado para Restaurantes, Tiendas y Oficinas</p>
              <h2 style={{fontFamily:"var(--font-inter)",fontSize:"clamp(28px,4vw,40px)",fontWeight:800,marginBottom:"16px",color:"var(--text-primary)"}}>Resolviendo problemas reales</h2>
              <p style={{color:"var(--text-muted)",fontSize:"16px",maxWidth:"600px",margin:"0 auto",fontFamily:"var(--font-inter)"}}>Deja de perder tiempo calculando horas a mano o lidiando con empleados que "se cubren" entre ellos.</p>
            </div>
            
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"24px"}} className="grid-sm-1">
              <div className="feature-card" style={{borderRadius:"16px",padding:"32px"}}>
                <div style={{width:"48px",height:"48px",borderRadius:"12px",background:"#F1F5F9",border:"1px solid var(--border)",color:"var(--text-primary)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"20px",boxShadow:"0 2px 10px rgba(0,0,0,0.02)"}}>
                  <MapPin size={24} />
                </div>
                <h3 style={{fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"18px",marginBottom:"12px",color:"var(--text-primary)"}}>Asistencia Inteligente</h3>
                <p style={{color:"var(--text-muted)",fontSize:"15px",lineHeight:1.6,fontFamily:"var(--font-inter)"}}>Registro de entrada y salida desde el celular con validación por geolocalización estricta.</p>
              </div>

              <div className="feature-card" style={{borderRadius:"16px",padding:"32px"}}>
                <div style={{width:"48px",height:"48px",borderRadius:"12px",background:"#F1F5F9",border:"1px solid var(--border)",color:"var(--text-primary)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"20px",boxShadow:"0 2px 10px rgba(0,0,0,0.02)"}}>
                  <Clock size={24} />
                </div>
                <h3 style={{fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"18px",marginBottom:"12px",color:"var(--text-primary)"}}>Control Automático</h3>
                <p style={{color:"var(--text-muted)",fontSize:"15px",lineHeight:1.6,fontFamily:"var(--font-inter)"}}>Control automático de tardanzas y cálculo exacto de horas trabajadas sin intervención humana.</p>
              </div>

              <div className="feature-card" style={{borderRadius:"16px",padding:"32px"}}>
                <div style={{width:"48px",height:"48px",borderRadius:"12px",background:"#F1F5F9",border:"1px solid var(--border)",color:"var(--text-primary)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"20px",boxShadow:"0 2px 10px rgba(0,0,0,0.02)"}}>
                  <FileSpreadsheet size={24} />
                </div>
                <h3 style={{fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"18px",marginBottom:"12px",color:"var(--text-primary)"}}>Reportes Exportables</h3>
                <p style={{color:"var(--text-muted)",fontSize:"15px",lineHeight:1.6,fontFamily:"var(--font-inter)"}}>Exporta los datos a Excel para la nómina y mantén un historial de asistencia por empleado.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section style={{padding:"80px 20px 100px",borderTop:"1px solid var(--border)",position:"relative",zIndex:10,background:"var(--bg-primary)"}}>
          <div style={{maxWidth:"1000px",margin:"0 auto",textAlign:"center"}}>
            <p style={{color:"#1E3A8A",fontSize:"13px",fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",fontFamily:"var(--font-inter)",marginBottom:"16px"}}>Precios Accesibles</p>
            <h2 style={{fontFamily:"var(--font-inter)",fontSize:"clamp(28px,4vw,40px)",fontWeight:800,marginBottom:"16px",color:"var(--text-primary)"}}>La barrera de entrada es casi cero</h2>
            <p style={{color:"var(--text-muted)",fontSize:"16px",maxWidth:"600px",margin:"0 auto 48px",fontFamily:"var(--font-inter)"}}>No pagues licencias caras. Paga solo por el tamaño de tu equipo.</p>
            
            <InteractivePricing />
            
            <div style={{marginTop: "40px", display: "inline-block"}}>
              <p style={{color: "var(--text-primary)", fontSize: "16px", fontWeight: 700, margin: 0, textAlign: "center"}}>
                Oferta de lanzamiento: Primera quincena gratis + Configuración gratuita
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{background:"var(--bg-card)",borderTop:"1px solid var(--border)",padding:"32px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"16px",position:"relative",zIndex:10}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
             <span style={{fontFamily:"var(--font-inter)",fontWeight:800,fontSize:"18px",color:"#1A2B4C"}}>
               punchly
             </span>
          </div>
          <p style={{color:"var(--text-muted)",fontSize:"13px",fontFamily:"var(--font-inter)",fontWeight:500}}>Sistema Inteligente para Negocios · 2026</p>
          <div style={{display:"flex",gap:"24px"}}>
            <Link href={`/${lang}/login`} style={{color:"var(--text-muted)",fontSize:"13px",textDecoration:"none",fontFamily:"var(--font-inter)",fontWeight:500}}>Iniciar sesión</Link>
            <Link href={`/${lang}/register`} style={{color:"var(--text-muted)",fontSize:"13px",textDecoration:"none",fontFamily:"var(--font-inter)",fontWeight:500}}>Registro</Link>
          </div>
        </footer>
      </div>
    </>
  );
}