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
  const locale = "es";
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
    width:"100%", background:"var(--bg-primary)", border:"1px solid var(--border)",
    borderRadius:"12px", padding:"12px 16px", color:"var(--text-primary)", fontSize:"14px",
    outline:"none", fontFamily:"var(--font-inter)", transition:"border 0.2s", boxSizing:"border-box"
  };

  return (
    <div className="landing-override" style={{minHeight:"100vh",background:"var(--bg-primary)",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}>
      <style>{`
        .btn-primary{background:var(--accent);color:#fff;font-family:var(--font-inter);font-weight:600;transition:all 0.2s ease;text-decoration:none;display:inline-block;border:1px solid var(--accent-dark);border-radius:12px}
        .btn-primary:hover{background:var(--accent-dark);transform:translateY(-1px);box-shadow:0 4px 12px rgba(59, 130, 246, 0.25)}
        input:focus{border-color:rgba(59, 130, 246,0.5)!important;box-shadow:0 0 0 3px rgba(59, 130, 246,0.08)}
        .lang-switch a{font-size:11px;color:rgba(255,255,255,0.3);text-decoration:none;padding:4px 8px;border-radius:6px;transition:all 0.2s}
        .lang-switch a:hover{color:white;background:rgba(255,255,255,0.06)}
        .lang-switch a.active{color:var(--accent);font-weight:700}
      `}</style>
      <div style={{width:"100%",maxWidth:"400px"}}>
        <div style={{textAlign:"center",marginBottom:"32px"}}>
          <img src="/logo.png" alt="Punchly" style={{width:"44px",height:"44px",borderRadius:"50%",margin:"0 auto 24px",objectFit:"contain"}} />
          <h1 style={{fontFamily:"var(--font-inter)",fontWeight:800,fontSize:"24px",color:"var(--text-primary)",marginBottom:"6px"}}>{tx.title}</h1>
          <p style={{color:"var(--text-muted)",fontSize:"13px",fontFamily:"var(--font-inter)"}}>{tx.sub}</p>
        </div>

        <div style={{background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:"24px",padding:"32px",boxShadow:"0 12px 40px rgba(0,0,0,0.05)"}}>
          <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:"16px"}}>
            <div>
              <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",fontFamily:"var(--font-inter)"}}>{tx.email}</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" required style={inputStyle} />
            </div>
            <div>
              <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",fontFamily:"var(--font-inter)"}}>{tx.password}</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••" required style={inputStyle} />
            </div>
            {error && <p style={{color:"#F87171",fontSize:"13px",fontFamily:"var(--font-inter)"}}>{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary" style={{padding:"14px",borderRadius:"14px",fontSize:"14px",marginTop:"4px",opacity:loading?0.6:1,width:"100%"}}>
              {loading?tx.loading:tx.btn}
            </button>
          </form>
        </div>

        <p style={{textAlign:"center",marginTop:"20px",fontSize:"13px",color:"var(--text-muted)",fontFamily:"var(--font-inter)"}}>
          {tx.register}{" "}
          <Link href={"/"+locale+"/register"} style={{color:"var(--accent)",textDecoration:"none",fontWeight:600}}>{tx.registerLink}</Link>
        </p>
      </div>
    </div>
  );
}