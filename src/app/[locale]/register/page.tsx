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
  const locale = "es";
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
    width:"100%", background:"var(--bg-primary)", border:"1px solid var(--border)",
    borderRadius:"12px", padding:"12px 16px", color:"var(--text-primary)", fontSize:"14px",
    outline:"none", fontFamily:"var(--font-inter)", transition:"border 0.2s", boxSizing:"border-box"
  };

  return (
    <div className="landing-override" style={{minHeight:"100vh",background:"var(--bg-primary)",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}>
      <style>{`
        .btn-primary{background:var(--accent);color:#fff;font-family:var(--font-inter);font-weight:600;transition:all 0.2s ease;text-decoration:none;display:inline-block;border:1px solid var(--accent-dark);border-radius:12px}
        .btn-primary:hover{background:var(--accent-dark);transform:translateY(-1px);box-shadow:0 4px 12px rgba(59, 130, 246, 0.25)}
        input:focus{border-color:rgba(59, 130, 246,0.5)!important}
        .lang-switch a{font-size:11px;color:rgba(255,255,255,0.3);text-decoration:none;padding:4px 8px;border-radius:6px;transition:all 0.2s}
        .lang-switch a:hover{color:white}
        .lang-switch a.active{color:var(--accent);font-weight:700}
      `}</style>
      <div style={{width:"100%",maxWidth:"420px"}}>
        <div style={{textAlign:"center",marginBottom:"32px"}}>
          <div style={{width:"44px",height:"44px",borderRadius:"14px",background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",boxShadow:"0 0 30px rgba(30, 58, 138, 0.15)"}}>
            <span style={{color:"white",fontWeight:900,fontSize:"18px",fontFamily:"var(--font-inter)"}}>P</span>
          </div>
          <h1 style={{fontFamily:"var(--font-inter)",fontWeight:800,fontSize:"24px",color:"var(--text-primary)",marginBottom:"6px"}}>{tx.title}</h1>
          <p style={{color:"var(--text-muted)",fontSize:"13px",fontFamily:"var(--font-inter)"}}>{tx.sub}</p>
        </div>

        <div style={{background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:"24px",padding:"32px",boxShadow:"0 12px 40px rgba(0,0,0,0.05)"}}>
          <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:"14px"}}>
            {[
              {key:"name",label:tx.name,ph:tx.namePh,type:"text"},
              {key:"orgName",label:tx.org,ph:tx.orgPh,type:"text"},
              {key:"email",label:tx.email,ph:tx.emailPh,type:"email"},
              {key:"password",label:tx.password,ph:"••••••",type:"password"},
            ].map(f=>(
              <div key={f.key}>
                <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",fontFamily:"var(--font-inter)"}}>{f.label}</label>
                <input type={f.type} value={form[f.key as keyof typeof form]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} required style={inputStyle} />
              </div>
            ))}
            {error && <p style={{color:"#F87171",fontSize:"13px",fontFamily:"var(--font-inter)"}}>{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary" style={{padding:"14px",borderRadius:"14px",fontSize:"14px",marginTop:"4px",opacity:loading?0.6:1,width:"100%"}}>
              {loading?tx.loading:tx.btn}
            </button>
          </form>
        </div>

        <p style={{textAlign:"center",marginTop:"20px",fontSize:"13px",color:"var(--text-muted)",fontFamily:"var(--font-inter)"}}>
          {tx.login}{" "}
          <Link href={"/"+locale+"/login"} style={{color:"var(--accent)",textDecoration:"none",fontWeight:600}}>{tx.loginLink}</Link>
        </p>
      </div>
    </div>
  );
}