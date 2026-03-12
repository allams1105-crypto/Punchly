"use client";
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
      <style>{`
  .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)}
  .glass-gold{background:rgba(201,168,76,0.08);backdrop-filter:blur(20px);border:1px solid rgba(201,168,76,0.2)}
  .gold-text{background:linear-gradient(135deg,#C9A84C,#F0D080);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .glow{box-shadow:0 0 40px rgba(201,168,76,0.2)}
  .btn-gold{background:linear-gradient(135deg,#C9A84C,#F0D080);color:#000;font-family:var(--font-syne);font-weight:700;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1)}
  .btn-gold:hover{transform:translateY(-2px);box-shadow:0 16px 40px rgba(201,168,76,0.3)}
  .card-hover{transition:all 0.25s ease}
  .card-hover:hover{transform:translateY(-2px);border-color:rgba(201,168,76,0.2)!important}
  input,select{color-scheme:dark}
 input:focus{border:1px solid rgba(201,168,76,0.4)!important}`}</style>
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
}