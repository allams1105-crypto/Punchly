import { writeFileSync, readFileSync } from "fs";

// 1. Fix hero text
let hero = readFileSync("src/components/ui/shape-landing-hero.tsx", "utf8");
hero = hero
  .replace(/sin excusas/g, "inteligente y simple")
  .replace(/Sin tarjeta requerida durante el trial/g, "Cancela cuando quieras")
  .replace(/sin tarjeta de crédito/g, "prueba completa gratis");
writeFileSync("src/components/ui/shape-landing-hero.tsx", hero);

// 2. Fix landing text
let landing = readFileSync("src/app/[locale]/page.tsx", "utf8");
landing = landing
  .replace(/sin excusas/gi, "inteligente y simple")
  .replace(/Sin tarjeta requerida durante el trial/gi, "Cancela cuando quieras")
  .replace(/sin tarjeta de crédito/gi, "prueba completa gratis")
  .replace(/7 días gratis — sin tarjeta de crédito/gi, "7 días de prueba completa gratis");
writeFileSync("src/app/[locale]/page.tsx", landing);

// 3. Add EN/ES to landing nav
landing = readFileSync("src/app/[locale]/page.tsx", "utf8");
landing = landing.replace(
  `<Link href="/en/login" style={{fontSize:"13px",color:"rgba(255,255,255,0.45)",textDecoration:"none",fontWeight:500}}>Iniciar sesión</Link>`,
  `<a href="/es/login" style={{fontSize:"12px",color:"rgba(255,255,255,0.25)",textDecoration:"none",fontWeight:500,fontFamily:"var(--font-dm-sans)"}}>ES</a>
            <span style={{color:"rgba(255,255,255,0.1)"}}>·</span>
            <a href="/en/login" style={{fontSize:"12px",color:"rgba(255,255,255,0.45)",textDecoration:"none",fontWeight:600",fontFamily:"var(--font-dm-sans)"}}>EN</a>
            <span style={{color:"rgba(255,255,255,0.1)",margin:"0 4px"}}>|</span>
            <Link href="/en/login" style={{fontSize:"13px",color:"rgba(255,255,255,0.45)",textDecoration:"none",fontWeight:500}}>Iniciar sesión</Link>`
);
writeFileSync("src/app/[locale]/page.tsx", landing);

// 4. Create ES locale pages that mirror EN
const { mkdirSync } = await import("fs");
mkdirSync("src/app/[locale]/es", { recursive: true });

// The [locale] routing already handles es/en via the URL
// We need to make sure translations work in login/register
// Update login to detect locale from URL
const loginPage = `"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const t = {
  en: { title:"Welcome back", sub:"Sign in to Punchly.Clock", email:"Email", password:"Password", btn:"Sign in", loading:"Signing in...", error:"Incorrect email or password", register:"Don't have an account?", registerLink:"Sign up" },
  es: { title:"Bienvenido", sub:"Inicia sesión en Punchly.Clock", email:"Email", password:"Contraseña", btn:"Iniciar sesión", loading:"Iniciando...", error:"Email o contraseña incorrectos", register:"¿No tienes cuenta?", registerLink:"Regístrate" },
};

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) === "es" ? "es" : "en";
  const tx = t[locale];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) { setError(tx.error); return; }
    router.push("/"+locale+"/admin/dashboard");
  }

  const inputStyle: React.CSSProperties = {
    width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
    borderRadius:"12px", padding:"12px 16px", color:"#FAFAFA", fontSize:"14px",
    outline:"none", fontFamily:"var(--font-dm-sans)", transition:"border 0.2s", boxSizing:"border-box"
  };

  return (
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%), #060810",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}>
      <style>{\`
        .btn-gold{background:linear-gradient(135deg,#FFD166,#C9A84C);color:#000;font-family:var(--font-syne);font-weight:700;transition:all 0.3s ease;border:none;cursor:pointer}
        .btn-gold:hover{transform:translateY(-2px);box-shadow:0 16px 40px rgba(201,168,76,0.4)}
        input:focus{border-color:rgba(201,168,76,0.5)!important;box-shadow:0 0 0 3px rgba(201,168,76,0.08)}
        .lang-switch a{font-size:11px;color:rgba(255,255,255,0.3);text-decoration:none;padding:4px 8px;border-radius:6px;transition:all 0.2s}
        .lang-switch a:hover{color:white;background:rgba(255,255,255,0.06)}
        .lang-switch a.active{color:#C9A84C;font-weight:700}
      \`}</style>
      <div style={{width:"100%",maxWidth:"400px"}}>
        {/* Lang switcher */}
        <div className="lang-switch" style={{display:"flex",justifyContent:"center",gap:"4px",marginBottom:"24px"}}>
          <a href="/en/login" className={locale==="en"?"active":""}>EN</a>
          <span style={{color:"rgba(255,255,255,0.1)",lineHeight:"26px"}}>·</span>
          <a href="/es/login" className={locale==="es"?"active":""}>ES</a>
        </div>

        <div style={{textAlign:"center",marginBottom:"32px"}}>
          <div style={{width:"44px",height:"44px",borderRadius:"14px",background:"linear-gradient(135deg,#FFD166,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",boxShadow:"0 0 30px rgba(255,209,102,0.3)"}}>
            <span style={{color:"#000",fontWeight:900,fontSize:"18px",fontFamily:"var(--font-syne)"}}>P</span>
          </div>
          <h1 style={{fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"24px",color:"#FAFAFA",marginBottom:"6px"}}>{tx.title}</h1>
          <p style={{color:"rgba(255,255,255,0.3)",fontSize:"13px",fontFamily:"var(--font-dm-sans)"}}>{tx.sub}</p>
        </div>

        <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"24px",padding:"32px"}}>
          <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:"16px"}}>
            <div>
              <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",fontFamily:"var(--font-dm-sans)"}}>{tx.email}</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" required style={inputStyle} />
            </div>
            <div>
              <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",fontFamily:"var(--font-dm-sans)"}}>{tx.password}</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••" required style={inputStyle} />
            </div>
            {error && <p style={{color:"#F87171",fontSize:"13px",fontFamily:"var(--font-dm-sans)"}}>{error}</p>}
            <button type="submit" disabled={loading} className="btn-gold" style={{padding:"14px",borderRadius:"14px",fontSize:"14px",marginTop:"4px",opacity:loading?0.6:1,width:"100%"}}>
              {loading?tx.loading:tx.btn}
            </button>
          </form>
        </div>

        <p style={{textAlign:"center",marginTop:"20px",fontSize:"13px",color:"rgba(255,255,255,0.25)",fontFamily:"var(--font-dm-sans)"}}>
          {tx.register}{" "}
          <Link href={"/"+locale+"/register"} style={{color:"#C9A84C",textDecoration:"none",fontWeight:600}}>{tx.registerLink}</Link>
        </p>
      </div>
    </div>
  );
}`;

const registerPage = `"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const t = {
  en: { title:"Create account", sub:"7-day free trial", name:"Your name", org:"Company name", email:"Email", password:"Password", btn:"Create free account", loading:"Creating...", error:"Error creating account", login:"Already have an account?", loginLink:"Sign in",
    namePh:"John Doe", orgPh:"My Company Inc.", emailPh:"you@company.com" },
  es: { title:"Crea tu cuenta", sub:"7 días de prueba gratis", name:"Tu nombre", org:"Nombre de la empresa", email:"Email", password:"Contraseña", btn:"Crear cuenta gratis", loading:"Creando...", error:"Error al crear cuenta", login:"¿Ya tienes cuenta?", loginLink:"Iniciar sesión",
    namePh:"Juan Pérez", orgPh:"Mi Empresa S.A.", emailPh:"juan@empresa.com" },
};

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) === "es" ? "es" : "en";
  const tx = t[locale];
  const [form, setForm] = useState({ name:"", orgName:"", email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name||!form.orgName||!form.email||!form.password) { setError(tx.error); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error||tx.error); return; }
    const { signIn } = await import("next-auth/react");
    await signIn("credentials",{email:form.email,password:form.password,redirect:false});
    router.push("/"+locale+"/admin/dashboard");
  }

  const inputStyle: React.CSSProperties = {
    width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
    borderRadius:"12px", padding:"12px 16px", color:"#FAFAFA", fontSize:"14px",
    outline:"none", fontFamily:"var(--font-dm-sans)", transition:"border 0.2s", boxSizing:"border-box"
  };

  return (
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%), #060810",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}>
      <style>{\`
        .btn-gold{background:linear-gradient(135deg,#FFD166,#C9A84C);color:#000;font-family:var(--font-syne);font-weight:700;transition:all 0.3s ease;border:none;cursor:pointer}
        .btn-gold:hover{transform:translateY(-2px);box-shadow:0 16px 40px rgba(201,168,76,0.4)}
        input:focus{border-color:rgba(201,168,76,0.5)!important}
        .lang-switch a{font-size:11px;color:rgba(255,255,255,0.3);text-decoration:none;padding:4px 8px;border-radius:6px;transition:all 0.2s}
        .lang-switch a:hover{color:white}
        .lang-switch a.active{color:#C9A84C;font-weight:700}
      \`}</style>
      <div style={{width:"100%",maxWidth:"420px"}}>
        <div className="lang-switch" style={{display:"flex",justifyContent:"center",gap:"4px",marginBottom:"24px"}}>
          <a href="/en/register" className={locale==="en"?"active":""}>EN</a>
          <span style={{color:"rgba(255,255,255,0.1)",lineHeight:"26px"}}>·</span>
          <a href="/es/register" className={locale==="es"?"active":""}>ES</a>
        </div>

        <div style={{textAlign:"center",marginBottom:"32px"}}>
          <div style={{width:"44px",height:"44px",borderRadius:"14px",background:"linear-gradient(135deg,#FFD166,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",boxShadow:"0 0 30px rgba(255,209,102,0.3)"}}>
            <span style={{color:"#000",fontWeight:900,fontSize:"18px",fontFamily:"var(--font-syne)"}}>P</span>
          </div>
          <h1 style={{fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"24px",color:"#FAFAFA",marginBottom:"6px"}}>{tx.title}</h1>
          <p style={{color:"rgba(255,255,255,0.3)",fontSize:"13px",fontFamily:"var(--font-dm-sans)"}}>{tx.sub}</p>
        </div>

        <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"24px",padding:"32px"}}>
          <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:"14px"}}>
            {[
              {key:"name",label:tx.name,ph:tx.namePh,type:"text"},
              {key:"orgName",label:tx.org,ph:tx.orgPh,type:"text"},
              {key:"email",label:tx.email,ph:tx.emailPh,type:"email"},
              {key:"password",label:tx.password,ph:"••••••",type:"password"},
            ].map(f=>(
              <div key={f.key}>
                <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",fontFamily:"var(--font-dm-sans)"}}>{f.label}</label>
                <input type={f.type} value={form[f.key as keyof typeof form]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} required style={inputStyle} />
              </div>
            ))}
            {error && <p style={{color:"#F87171",fontSize:"13px",fontFamily:"var(--font-dm-sans)"}}>{error}</p>}
            <button type="submit" disabled={loading} className="btn-gold" style={{padding:"14px",borderRadius:"14px",fontSize:"14px",marginTop:"4px",opacity:loading?0.6:1,width:"100%"}}>
              {loading?tx.loading:tx.btn}
            </button>
          </form>
        </div>

        <p style={{textAlign:"center",marginTop:"20px",fontSize:"13px",color:"rgba(255,255,255,0.25)",fontFamily:"var(--font-dm-sans)"}}>
          {tx.login}{" "}
          <Link href={"/"+locale+"/login"} style={{color:"#C9A84C",textDecoration:"none",fontWeight:600}}>{tx.loginLink}</Link>
        </p>
      </div>
    </div>
  );
}`;

writeFileSync("src/app/[locale]/login/page.tsx", loginPage);
writeFileSync("src/app/[locale]/register/page.tsx", registerPage);

console.log("Listo!");
