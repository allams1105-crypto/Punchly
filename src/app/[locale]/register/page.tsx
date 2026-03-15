"use client";
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
      <style>{`
        .btn-gold{background:linear-gradient(135deg,#FFD166,#C9A84C);color:#000;font-family:var(--font-syne);font-weight:700;transition:all 0.3s ease;border:none;cursor:pointer}
        .btn-gold:hover{transform:translateY(-2px);box-shadow:0 16px 40px rgba(201,168,76,0.4)}
        input:focus{border-color:rgba(201,168,76,0.5)!important}
        .lang-switch a{font-size:11px;color:rgba(255,255,255,0.3);text-decoration:none;padding:4px 8px;border-radius:6px;transition:all 0.2s}
        .lang-switch a:hover{color:white}
        .lang-switch a.active{color:#C9A84C;font-weight:700}
      `}</style>
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
}