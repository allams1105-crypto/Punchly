"use client";
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
      <style>{`
        .btn-gold{background:linear-gradient(135deg,#FFD166,#C9A84C);color:#000;font-family:var(--font-syne);font-weight:700;transition:all 0.3s ease;border:none;cursor:pointer}
        .btn-gold:hover{transform:translateY(-2px);box-shadow:0 16px 40px rgba(201,168,76,0.4)}
        input:focus{border-color:rgba(201,168,76,0.5)!important;box-shadow:0 0 0 3px rgba(201,168,76,0.08)}
        .lang-switch a{font-size:11px;color:rgba(255,255,255,0.3);text-decoration:none;padding:4px 8px;border-radius:6px;transition:all 0.2s}
        .lang-switch a:hover{color:white;background:rgba(255,255,255,0.06)}
        .lang-switch a.active{color:#C9A84C;font-weight:700}
      `}</style>
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
}