import { writeFileSync, mkdirSync } from "fs";

const G = {
  bg: "#0A0A0A",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  text: "#FAFAFA",
  muted: "rgba(255,255,255,0.35)",
  gold: "#C9A84C",
  goldGrad: "linear-gradient(135deg,#C9A84C,#F0D080)",
  glass: "background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)",
};

const globalStyles = `
  .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)}
  .glass-gold{background:rgba(201,168,76,0.08);backdrop-filter:blur(20px);border:1px solid rgba(201,168,76,0.2)}
  .gold-text{background:linear-gradient(135deg,#C9A84C,#F0D080);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .glow{box-shadow:0 0 40px rgba(201,168,76,0.2)}
  .btn-gold{background:linear-gradient(135deg,#C9A84C,#F0D080);color:#000;font-family:var(--font-syne);font-weight:700;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1)}
  .btn-gold:hover{transform:translateY(-2px);box-shadow:0 16px 40px rgba(201,168,76,0.3)}
  .card-hover{transition:all 0.25s ease}
  .card-hover:hover{transform:translateY(-2px);border-color:rgba(201,168,76,0.2)!important}
  input,select{color-scheme:dark}
`;

// ============================================================
// LOGIN PAGE
// ============================================================
const loginPage = `"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await signIn("credentials", { email, pin, redirect: false });
    setLoading(false);
    if (res?.error) { setError("Email o PIN incorrectos"); return; }
    router.push("/en/admin/dashboard");
  }

  const inputStyle = {
    width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
    borderRadius:"12px", padding:"12px 16px", color:"#FAFAFA", fontSize:"14px",
    outline:"none", fontFamily:"var(--font-dm-sans)", transition:"border 0.2s"
  };

  return (
    <div style={{minHeight:"100vh",background:"#0A0A0A",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",
      backgroundImage:"radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 60%)"}}>
      <style>{\`${globalStyles} input:focus{border:1px solid rgba(201,168,76,0.4)!important;box-shadow:0 0 0 3px rgba(201,168,76,0.06)}\`}</style>
      <div style={{width:"100%",maxWidth:"400px"}}>
        <div style={{textAlign:"center",marginBottom:"32px"}}>
          <div style={{width:"44px",height:"44px",borderRadius:"14px",background:"linear-gradient(135deg,#C9A84C,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",boxShadow:"0 0 30px rgba(201,168,76,0.3)"}}>
            <span style={{color:"#000",fontWeight:900,fontSize:"18px",fontFamily:"var(--font-syne)"}}>P</span>
          </div>
          <h1 style={{fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"24px",color:"#FAFAFA",marginBottom:"6px"}}>Bienvenido</h1>
          <p style={{color:"rgba(255,255,255,0.3)",fontSize:"13px",fontFamily:"var(--font-dm-sans)"}}>Inicia sesión en Punchly.Clock</p>
        </div>

        <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"24px",padding:"32px"}}>
          <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:"16px"}}>
            <div>
              <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",fontFamily:"var(--font-dm-sans)"}}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@empresa.com" required style={inputStyle} />
            </div>
            <div>
              <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",fontFamily:"var(--font-dm-sans)"}}>PIN</label>
              <input type="password" value={pin} onChange={e=>setPin(e.target.value)} placeholder="••••••" required style={inputStyle} />
            </div>
            {error && <p style={{color:"#F87171",fontSize:"13px",fontFamily:"var(--font-dm-sans)"}}>{error}</p>}
            <button type="submit" disabled={loading} className="btn-gold"
              style={{padding:"14px",borderRadius:"14px",fontSize:"14px",border:"none",cursor:"pointer",marginTop:"4px",opacity:loading?0.6:1}}>
              {loading?"Iniciando...":"Iniciar sesión"}
            </button>
          </form>
        </div>

        <p style={{textAlign:"center",marginTop:"20px",fontSize:"13px",color:"rgba(255,255,255,0.25)",fontFamily:"var(--font-dm-sans)"}}>
          ¿No tienes cuenta?{" "}
          <Link href="/en/register" style={{color:"#C9A84C",textDecoration:"none",fontWeight:600}}>Regístrate</Link>
        </p>
      </div>
    </div>
  );
}`;

// ============================================================
// REGISTER PAGE
// ============================================================
const registerPage = `"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name:"", orgName:"", email:"", pin:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/register", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error||"Error al registrar"); return; }
    router.push("/en/admin/dashboard");
  }

  const inputStyle = {
    width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
    borderRadius:"12px", padding:"12px 16px", color:"#FAFAFA", fontSize:"14px",
    outline:"none", fontFamily:"var(--font-dm-sans)", transition:"border 0.2s", boxSizing:"border-box" as const
  };

  return (
    <div style={{minHeight:"100vh",background:"#0A0A0A",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",
      backgroundImage:"radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 60%)"}}>
      <style>{\`${globalStyles} input:focus{border:1px solid rgba(201,168,76,0.4)!important}\`}</style>
      <div style={{width:"100%",maxWidth:"420px"}}>
        <div style={{textAlign:"center",marginBottom:"32px"}}>
          <div style={{width:"44px",height:"44px",borderRadius:"14px",background:"linear-gradient(135deg,#C9A84C,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",boxShadow:"0 0 30px rgba(201,168,76,0.3)"}}>
            <span style={{color:"#000",fontWeight:900,fontSize:"18px",fontFamily:"var(--font-syne)"}}>P</span>
          </div>
          <h1 style={{fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"24px",color:"#FAFAFA",marginBottom:"6px"}}>Crea tu cuenta</h1>
          <p style={{color:"rgba(255,255,255,0.3)",fontSize:"13px",fontFamily:"var(--font-dm-sans)"}}>7 días gratis — sin tarjeta de crédito</p>
        </div>

        <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"24px",padding:"32px"}}>
          <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:"16px"}}>
            {[
              {key:"name",label:"Tu nombre",placeholder:"Juan Pérez",type:"text"},
              {key:"orgName",label:"Nombre de la empresa",placeholder:"Mi Empresa S.A.",type:"text"},
              {key:"email",label:"Email",placeholder:"juan@empresa.com",type:"email"},
              {key:"pin",label:"PIN de acceso",placeholder:"••••••",type:"password"},
            ].map(f=>(
              <div key={f.key}>
                <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",fontFamily:"var(--font-dm-sans)"}}>{f.label}</label>
                <input type={f.type} value={form[f.key as keyof typeof form]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                  placeholder={f.placeholder} required style={inputStyle} />
              </div>
            ))}
            {error && <p style={{color:"#F87171",fontSize:"13px",fontFamily:"var(--font-dm-sans)"}}>{error}</p>}
            <button type="submit" disabled={loading} className="btn-gold"
              style={{padding:"14px",borderRadius:"14px",fontSize:"14px",border:"none",cursor:"pointer",marginTop:"4px",opacity:loading?0.6:1}}>
              {loading?"Creando cuenta...":"Crear cuenta gratis"}
            </button>
          </form>
        </div>

        <p style={{textAlign:"center",marginTop:"20px",fontSize:"13px",color:"rgba(255,255,255,0.25)",fontFamily:"var(--font-dm-sans)"}}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/en/login" style={{color:"#C9A84C",textDecoration:"none",fontWeight:600}}>Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}`;

// ============================================================
// SIDEBAR — redesigned
// ============================================================
const sidebar = `"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import LangToggle from "@/components/LangToggle";

const links = [
  { href:"/en/admin/dashboard", label:"Dashboard", icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href:"/en/admin/employees", label:"Empleados", icon:"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { href:"/en/admin/employees/new", label:"Nuevo empleado", icon:"M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" },
  { href:"/en/admin/attendance", label:"Asistencia", icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href:"/en/admin/payroll", label:"Nómina", icon:"M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
  { href:"/en/admin/activity", label:"Actividad", icon:"M13 10V3L4 14h7v7l9-11h-7z" },
  { href:"/en/admin/kiosk", label:"Kiosk", icon:"M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" },
  { href:"/en/admin/settings", label:"Configuración", icon:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

export default function Sidebar({ orgName }: { orgName?: string }) {
  const path = usePathname();
  return (
    <div style={{width:"220px",minHeight:"100vh",background:"rgba(255,255,255,0.02)",borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",flexShrink:0}}>
      {/* Logo */}
      <div style={{padding:"20px 16px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"4px"}}>
          <div style={{width:"32px",height:"32px",borderRadius:"10px",background:"linear-gradient(135deg,#C9A84C,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{color:"#000",fontWeight:900,fontSize:"14px",fontFamily:"var(--font-syne)"}}>P</span>
          </div>
          <span style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:"#FAFAFA"}}>Punchly.Clock</span>
        </div>
        {orgName && <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:"rgba(255,255,255,0.25)",paddingLeft:"42px"}}>{orgName}</p>}
      </div>

      {/* Nav */}
      <nav style={{flex:1,padding:"12px 8px",overflowY:"auto"}}>
        <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"10px",fontWeight:600,color:"rgba(255,255,255,0.2)",textTransform:"uppercase",letterSpacing:"1.5px",padding:"4px 8px 8px"}}>Menu</p>
        {links.map(l=>{
          const active = path === l.href || path.startsWith(l.href+"/");
          return (
            <Link key={l.href} href={l.href}
              style={{display:"flex",alignItems:"center",gap:"10px",padding:"9px 10px",borderRadius:"12px",textDecoration:"none",marginBottom:"2px",
                background:active?"rgba(201,168,76,0.12)":"transparent",
                border:active?"1px solid rgba(201,168,76,0.2)":"1px solid transparent",
                color:active?"#C9A84C":"rgba(255,255,255,0.4)",
                fontSize:"13px",fontFamily:"var(--font-dm-sans)",fontWeight:active?600:400,
                transition:"all 0.15s ease"}}>
              <svg style={{width:"15px",height:"15px",flexShrink:0}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={l.icon}/>
              </svg>
              {l.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{padding:"12px 8px 16px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <LangToggle />
        <button onClick={()=>signOut({callbackUrl:"/en"})}
          style={{display:"flex",alignItems:"center",gap:"10px",padding:"9px 10px",borderRadius:"12px",width:"100%",border:"none",background:"transparent",color:"rgba(255,255,255,0.3)",fontSize:"13px",fontFamily:"var(--font-dm-sans)",cursor:"pointer",marginTop:"4px",transition:"all 0.15s"}}>
          <svg style={{width:"15px",height:"15px"}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Sign out
        </button>
      </div>
    </div>
  );
}`;

// ============================================================
// TRIAL BANNER — redesigned
// ============================================================
const trialBanner = `"use client";
import { useRouter } from "next/navigation";

export default function TrialBanner({ daysLeft }: { daysLeft: number }) {
  const router = useRouter();
  const urgent = daysLeft <= 2;
  return (
    <div style={{
      display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"10px 24px",
      background: urgent ? "rgba(248,113,113,0.08)" : "rgba(201,168,76,0.06)",
      borderBottom: urgent ? "1px solid rgba(248,113,113,0.15)" : "1px solid rgba(201,168,76,0.12)",
    }}>
      <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"13px",color: urgent?"#F87171":"rgba(201,168,76,0.9)"}}>
        {daysLeft === 0 ? "Tu período de prueba ha terminado" : \`Quedan \${daysLeft} día\${daysLeft===1?"":"s"} de prueba — activa tu licencia para no perder el acceso\`}
      </p>
      <button onClick={()=>router.push("/en/paywall")}
        style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"12px",padding:"6px 16px",borderRadius:"10px",border:"none",cursor:"pointer",flexShrink:0,
          background: urgent ? "#F87171" : "linear-gradient(135deg,#C9A84C,#F0D080)",
          color: urgent ? "white" : "#000"}}>
        Activar licencia
      </button>
    </div>
  );
}`;

// ============================================================
// PAYWALL PAGE — redesigned
// ============================================================
const paywallPage = `"use client";
import { useState } from "react";

export default function PaywallPage() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", { method:"POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }

  return (
    <div style={{minHeight:"100vh",background:"#0A0A0A",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",
      backgroundImage:"radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 60%)"}}>
      <style>{\`
        .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)}
        .gold-text{background:linear-gradient(135deg,#C9A84C,#F0D080);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .btn-gold{background:linear-gradient(135deg,#C9A84C,#F0D080);color:#000;font-family:var(--font-syne);font-weight:700;transition:all 0.3s ease}
        .btn-gold:hover{transform:translateY(-2px);box-shadow:0 20px 40px rgba(201,168,76,0.3)}
      \`}</style>
      <div style={{width:"100%",maxWidth:"440px",textAlign:"center"}}>
        <div style={{width:"44px",height:"44px",borderRadius:"14px",background:"linear-gradient(135deg,#C9A84C,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",boxShadow:"0 0 30px rgba(201,168,76,0.3)"}}>
          <span style={{color:"#000",fontWeight:900,fontSize:"18px",fontFamily:"var(--font-syne)"}}>P</span>
        </div>
        <h1 style={{fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"32px",color:"#FAFAFA",marginBottom:"8px"}}>Tu prueba ha terminado</h1>
        <p style={{color:"rgba(255,255,255,0.3)",fontSize:"14px",marginBottom:"32px",fontFamily:"var(--font-dm-sans)"}}>Activa tu licencia para seguir usando Punchly.Clock</p>

        <div className="glass" style={{borderRadius:"24px",padding:"36px",marginBottom:"20px"}}>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:"8px",marginBottom:"6px"}}>
            <span className="gold-text" style={{fontFamily:"var(--font-syne)",fontSize:"72px",fontWeight:800,lineHeight:1}}>$49</span>
            <span style={{color:"rgba(255,255,255,0.2)",marginBottom:"10px",fontSize:"14px",fontFamily:"var(--font-dm-sans)"}}>pago único</span>
          </div>
          <p style={{color:"rgba(255,255,255,0.2)",fontSize:"12px",marginBottom:"24px",fontFamily:"var(--font-dm-sans)"}}>Sin mensualidades. Sin sorpresas.</p>
          <ul style={{listStyle:"none",padding:0,marginBottom:"28px",textAlign:"left"}}>
            {["Empleados ilimitados","Kiosk con PIN","Geofencing móvil","Alertas por email","Nómina automática","Soporte incluido"].map(f=>(
              <li key={f} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.5)",fontSize:"13px",fontFamily:"var(--font-dm-sans)"}}>
                <div style={{width:"5px",height:"5px",background:"#C9A84C",borderRadius:"50%",flexShrink:0}} />
                {f}
              </li>
            ))}
          </ul>
          <button onClick={handleCheckout} disabled={loading} className="btn-gold"
            style={{width:"100%",padding:"16px",borderRadius:"14px",fontSize:"15px",border:"none",cursor:"pointer",opacity:loading?0.7:1}}>
            {loading?"Redirigiendo...":"Activar licencia — $49"}
          </button>
        </div>
      </div>
    </div>
  );
}`;

writeFileSync("src/app/[locale]/login/page.tsx", loginPage);
writeFileSync("src/app/[locale]/register/page.tsx", registerPage);
writeFileSync("src/components/admin/Sidebar.tsx", sidebar);
writeFileSync("src/components/admin/TrialBanner.tsx", trialBanner);
writeFileSync("src/app/[locale]/paywall/page.tsx", paywallPage);
console.log("Listo!");
