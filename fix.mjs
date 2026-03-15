import { writeFileSync } from "fs";
import { readFileSync } from "fs";

let landing = readFileSync("src/app/[locale]/page.tsx", "utf8");

// Fix nav for mobile
landing = landing.replace(
  `        {/* Nav */}
        <nav style={{position:"absolute",top:0,left:0,right:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"24px 48px",maxWidth:"1280px",margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{width:"34px",height:"34px",borderRadius:"10px",background:"linear-gradient(135deg,#FFD166,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 24px rgba(255,209,102,0.35)"}}>
              <span style={{color:"#000",fontWeight:900,fontSize:"15px",fontFamily:"var(--font-syne)"}}>P</span>
            </div>
            <span style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"15px",letterSpacing:"-0.3px"}}>Punchly.Clock</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <a href="/en" className={"lang-btn"+(isEs?"":" lang-active")}>EN</a>
            <span style={{color:"rgba(255,255,255,0.1)"}}>·</span>
            <a href="/es" className={"lang-btn"+(isEs?" lang-active":"")}>ES</a>
            <span style={{width:"1px",height:"16px",background:"rgba(255,255,255,0.1)",margin:"0 8px"}} />
            <Link href={\`/\${locale}/login\`} style={{fontSize:"13px",color:"rgba(255,255,255,0.45)",textDecoration:"none",fontWeight:500}}>{isEs?"Iniciar sesión":"Sign in"}</Link>
            <Link href={\`/\${locale}/register\`} className="glass-gold btn-gold" style={{padding:"9px 22px",borderRadius:"12px",fontSize:"13px",fontFamily:"var(--font-syne)"}}>
              {isEs?"Comenzar":"Get started"}
            </Link>
          </div>
        </nav>`,
  `        {/* Nav */}
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
            <Link href={\`/\${locale}/login\`} className="hide-sm" style={{fontSize:"13px",color:"rgba(255,255,255,0.45)",textDecoration:"none",fontWeight:500}}>{isEs?"Iniciar sesión":"Sign in"}</Link>
            <Link href={\`/\${locale}/register\`} className="btn-gold" style={{padding:"8px 16px",borderRadius:"10px",fontSize:"12px",fontFamily:"var(--font-syne)",textDecoration:"none",display:"inline-block",marginLeft:"4px"}}>
              {isEs?"Comenzar":"Get started"}
            </Link>
          </div>
        </nav>`
);

// Also fix sections padding for mobile
landing = landing.replace(
  `<section style={{position:"relative",zIndex:10,padding:"20px 40px 80px"`,
  `<section style={{position:"relative",zIndex:10,padding:"20px 20px 80px"`
);

landing = landing.replace(
  `<section style={{padding:"80px 40px",background:"linear-gradient(to bottom,#060810,#08091A)"}}>`,
  `<section style={{padding:"60px 20px",background:"linear-gradient(to bottom,#060810,#08091A)"}}>`
);

landing = landing.replace(
  `<section style={{padding:"80px 40px",background:"linear-gradient(to bottom,#08091A,#060810)"}}>`,
  `<section style={{padding:"60px 20px",background:"linear-gradient(to bottom,#08091A,#060810)"}}>`
);

landing = landing.replace(
  `<section style={{padding:"80px 40px 100px",background:"linear-gradient(to bottom,#060810,#030508)"}}>`,
  `<section style={{padding:"60px 20px 80px",background:"linear-gradient(to bottom,#060810,#030508)"}}>`
);

landing = landing.replace(
  `<footer style={{background:"#030508",borderTop:"1px solid rgba(255,255,255,0.04)",padding:"32px 48px"`,
  `<footer style={{background:"#030508",borderTop:"1px solid rgba(255,255,255,0.04)",padding:"24px 20px"`
);

// Fix kiosk grid on mobile — 3 cols instead of 6
landing = landing.replace(
  `<div style={{padding:"14px 18px",display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"8px"}}>`,
  `<div style={{padding:"14px 18px",display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"8px"}} className="grid-sm-2">`
);

// Fix stats grid on mobile
landing = landing.replace(
  `<div className="fade-up-1" style={{maxWidth:"700px",margin:"28px auto 0",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px"}}>`,
  `<div className="fade-up-1 grid-sm-2" style={{maxWidth:"700px",margin:"28px auto 0",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px"}}>`
);

writeFileSync("src/app/[locale]/page.tsx", landing);
console.log("Listo!");

