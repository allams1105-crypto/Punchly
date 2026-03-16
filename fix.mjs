import { writeFileSync, readFileSync } from "fs";

let layout = readFileSync("src/app/[locale]/admin/layout.tsx", "utf8");

// 1. Uncomment the redirect and add overlay blocking
layout = layout.replace(
  `  // 5. Redirección de pago (Solo si no estamos ya en la página de pago)
  // Nota: Asegúrate de que /en/paywall NO use este mismo layout o entrarás en bucle.
  if (trialExpired && !isPro) {
    // redirect("/en/paywall"); // Comenta esta línea temporalmente para probar si carga el dashboard
  }`,
  `  // 5. Trial expired — hard block
  if (trialExpired && !isPro) {
    redirect("/en/paywall");
  }`
);

// 2. Add paywall overlay when trial is expired but not yet redirected (extra safety)
// Also add click blocker when daysLeft === 0
layout = layout.replace(
  `        {!isPro && <TrialBanner daysLeft={daysLeft} />}
        {children}`,
  `        {!isPro && <TrialBanner daysLeft={daysLeft} />}
        {trialExpired && !isPro ? (
          <div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(6,8,16,0.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",backdropFilter:"blur(20px)"}}>
            <div style={{textAlign:"center",maxWidth:"400px",padding:"40px"}}>
              <div style={{width:"56px",height:"56px",borderRadius:"16px",background:"linear-gradient(135deg,#C9A84C,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",boxShadow:"0 0 40px rgba(201,168,76,0.3)"}}>
                <span style={{color:"#000",fontWeight:900,fontSize:"22px",fontFamily:"var(--font-syne)"}}>P</span>
              </div>
              <h2 style={{fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"24px",color:"#FAFAFA",marginBottom:"12px"}}>Tu prueba ha terminado</h2>
              <p style={{color:"rgba(255,255,255,0.4)",fontSize:"14px",lineHeight:1.7,fontFamily:"var(--font-dm-sans)",marginBottom:"28px"}}>
                Activa tu licencia por un pago único de $49 para seguir usando Punchly.Clock sin límites.
              </p>
              <a href="/en/paywall" style={{display:"block",background:"linear-gradient(135deg,#C9A84C,#F0D080)",color:"#000",padding:"16px 32px",borderRadius:"16px",fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"15px",textDecoration:"none",boxShadow:"0 0 40px rgba(201,168,76,0.3)"}}>
                Activar licencia — $49
              </a>
              <p style={{color:"rgba(255,255,255,0.15)",fontSize:"11px",marginTop:"12px",fontFamily:"var(--font-dm-sans)"}}>Pago único · Sin mensualidades · Acceso permanente</p>
            </div>
          </div>
        ) : children}`
);

writeFileSync("src/app/[locale]/admin/layout.tsx", layout);
console.log("Listo!");

