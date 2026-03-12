"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name||!orgName||!email||!password) { setError("Todos los campos son requeridos"); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/register", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ name, orgName, email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error||"Error al registrar"); return; }
    // Auto login
    const { signIn } = await import("next-auth/react");
    await signIn("credentials", { email, password, redirect: false });
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
      <style>{`
        .btn-gold{background:linear-gradient(135deg,#C9A84C,#F0D080);color:#000;font-family:var(--font-syne);font-weight:700;transition:all 0.3s ease;border:none;cursor:pointer}
        .btn-gold:hover{transform:translateY(-2px);box-shadow:0 16px 40px rgba(201,168,76,0.3)}
        input:focus{border:1px solid rgba(201,168,76,0.4)!important;outline:none!important}
      `}</style>
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
              {label:"Tu nombre",value:name,set:setName,placeholder:"Juan Pérez",type:"text"},
              {label:"Nombre de la empresa",value:orgName,set:setOrgName,placeholder:"Mi Empresa",type:"text"},
              {label:"Email",value:email,set:setEmail,placeholder:"juan@empresa.com",type:"email"},
              {label:"Contraseña",value:password,set:setPassword,placeholder:"••••••",type:"password"},
            ].map(f=>(
              <div key={f.label}>
                <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",fontFamily:"var(--font-dm-sans)"}}>{f.label}</label>
                <input type={f.type} value={f.value} onChange={e=>f.set(e.target.value)} placeholder={f.placeholder} required style={inputStyle} />
              </div>
            ))}
            {error && <p style={{color:"#F87171",fontSize:"13px",fontFamily:"var(--font-dm-sans)"}}>{error}</p>}
            <button type="submit" disabled={loading} className="btn-gold"
              style={{padding:"14px",borderRadius:"14px",fontSize:"14px",marginTop:"4px",opacity:loading?0.6:1}}>
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
}