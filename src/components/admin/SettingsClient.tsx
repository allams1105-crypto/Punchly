"use client";
import { LocationMap } from "@/components/ui/expand-map";
import { useState } from "react";
import PushRegister from "@/components/PushRegister";

const primary = "var(--accent)";

const inputS: React.CSSProperties = {
  width:"100%", background:"var(--bg-primary)", border:"1px solid var(--border)",
  padding:"12px 14px", borderRadius:"12px", color:"var(--text-primary)", fontSize:"14px",
  outline:"none", fontFamily:"var(--font-inter)", transition:"border 0.2s", boxSizing:"border-box"
};
const labelS: React.CSSProperties = {
  fontSize:"10px", fontWeight:700, color:"var(--text-muted)",
  textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:"8px", display:"block",
  fontFamily:"var(--font-inter)"
};

function SaveBtn({ onClick, loading }: { onClick: ()=>void; loading: boolean }) {
  return (
    <button onClick={onClick} disabled={loading}
      style={{background:`linear-gradient(135deg,${primary},var(--accent-dark))`,color:"white",padding:"12px 24px",borderRadius:"12px",fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"13px",border:"none",cursor:"pointer",opacity:loading?0.6:1,transition:"all 0.2s"}}>
      {loading?"Guardando...":"Guardar cambios"}
    </button>
  );
}

function GeneralTab({ org }: { org: any }) {
  const [name, setName] = useState(org?.name||"");
  const [alertEmail, setAlertEmail] = useState(org?.alertEmail||"");
  const [overtimeThreshold, setOvertimeThreshold] = useState(org?.overtimeThreshold?.toString() || "1.5");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    setSaving(true);
    await Promise.all([
      fetch("/api/settings/org",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name, overtimeThreshold})}),
      fetch("/api/settings/alert-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({alertEmail})}),
    ]);
    setMsg("Guardado"); setSaving(false);
    setTimeout(()=>setMsg(""),3000);
  }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
      <div>
        <label style={labelS}>Nombre de la empresa</label>
        <input style={inputS} value={name} onChange={e=>setName(e.target.value)}
          onFocus={e=>e.currentTarget.style.borderColor=primary} onBlur={e=>e.currentTarget.style.borderColor="var(--border)"} />
      </div>
      <div>
        <label style={labelS}>Umbral de Horas Extras (Horas)</label>
        <input type="number" step="0.5" min="0" style={inputS} value={overtimeThreshold} onChange={e=>setOvertimeThreshold(e.target.value)}
          onFocus={e=>e.currentTarget.style.borderColor=primary} onBlur={e=>e.currentTarget.style.borderColor="var(--border)"} />
        <p style={{fontSize:"12px",color:"var(--text-muted)",marginTop:"8px",fontFamily:"var(--font-inter)",lineHeight:"1.4"}}>
          Las horas extras empezarán a contar después de esta cantidad de tiempo adicional trabajado.
        </p>
      </div>
      <div>
        <label style={labelS}>Email de alertas</label>
        <input type="email" style={inputS} value={alertEmail} onChange={e=>setAlertEmail(e.target.value)} placeholder="alerts@empresa.com"
          onFocus={e=>e.currentTarget.style.borderColor=primary} onBlur={e=>e.currentTarget.style.borderColor="var(--border)"} />
        <p style={{fontSize:"12px",color:"var(--text-muted)",marginTop:"8px",fontFamily:"var(--font-inter)",lineHeight:"1.4"}}>Recibe notificaciones de tardanzas y ausencias</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"12px",marginTop:"8px"}}>
        <SaveBtn onClick={save} loading={saving} />
        {msg && <p style={{fontSize:"13px",color:"#34D399",fontFamily:"var(--font-inter)",textAlign:"center",fontWeight:600}}>{msg}</p>}
      </div>
      <div style={{paddingTop:"24px",borderTop:"1px solid var(--border)"}}>
        <PushRegister />
      </div>
    </div>
  );
}



function SecurityTab() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    if (!current||!next) { setMsg("Completa ambos campos"); return; }
    setSaving(true);
    const res = await fetch("/api/settings/password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({currentPassword:current,newPassword:next})});
    const d = await res.json();
    setMsg(res.ok?"Contraseña actualizada":d.error||"Error");
    setSaving(false);
    if (res.ok) { setCurrent(""); setNext(""); }
    setTimeout(()=>setMsg(""),4000);
  }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
      <div>
        <label style={labelS}>Contraseña actual</label>
        <input type="password" style={inputS} value={current} onChange={e=>setCurrent(e.target.value)} placeholder="••••••"
          onFocus={e=>e.currentTarget.style.borderColor=primary} onBlur={e=>e.currentTarget.style.borderColor="var(--border)"} />
      </div>
      <div>
        <label style={labelS}>Nueva contraseña</label>
        <input type="password" style={inputS} value={next} onChange={e=>setNext(e.target.value)} placeholder="••••••"
          onFocus={e=>e.currentTarget.style.borderColor=primary} onBlur={e=>e.currentTarget.style.borderColor="var(--border)"} />
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"12px",marginTop:"8px"}}>
        <SaveBtn onClick={save} loading={saving} />
        {msg && <p style={{fontSize:"13px",color:msg.includes("Error")||msg.includes("ncorr")?"#F87171":"#34D399",fontFamily:"var(--font-inter)",textAlign:"center",fontWeight:600}}>{msg}</p>}
      </div>
    </div>
  );
}

function PlanTab({ org }: { org: any }) {
  function checkout() {
    window.location.href = "https://wa.me/18098686257?text=Hola,%20quiero%20activar%20mi%20suscripci%C3%B3n";
  }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
      {org?.isPro ? (
        <div style={{background:"var(--bg-primary)",border:"1px solid var(--border)",borderRadius:"16px",padding:"24px",textAlign:"center"}}>
          <p style={{fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"18px",color:"#34D399",marginBottom:"8px"}}>Licencia activa</p>
          <p style={{fontFamily:"var(--font-inter)",fontSize:"14px",color:"var(--text-muted)"}}>Suscripción activa. Incluye soporte local.</p>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
          <div style={{background:"var(--bg-primary)",border:"1px solid var(--border)",borderRadius:"16px",padding:"32px 24px",textAlign:"center"}}>
            <p style={{fontFamily:"var(--font-inter)",fontSize:"13px",color:"var(--text-muted)",marginBottom:"12px"}}>Planes desde</p>
            <p style={{fontFamily:"var(--font-inter)",fontWeight:800,fontSize:"48px",color:primary,lineHeight:1}}>RD$500 <span style={{fontSize:"18px",fontWeight:500,color:"var(--text-muted)"}}>/mes</span></p>
            <p style={{fontFamily:"var(--font-inter)",fontSize:"12px",color:"var(--text-muted)",marginTop:"12px"}}>Pago por transferencia local · Sin contratos</p>
          </div>
          <ul style={{listStyle:"none",padding:0,display:"flex",flexDirection:"column",gap:"12px"}}>
            {["Kiosko web inteligente","Geolocalización móvil","Alertas de tardanza","Reporte por WhatsApp","Exportación a Excel"].map(f=>(
              <li key={f} style={{display:"flex",alignItems:"center",gap:"12px",padding:"12px 0",borderBottom:"1px solid var(--border)",fontSize:"14px",color:"var(--text-primary)",fontFamily:"var(--font-inter)"}}>
                <div style={{width:"6px",height:"6px",background:primary,borderRadius:"50%",flexShrink:0}} />{f}
              </li>
            ))}
          </ul>
          <button onClick={checkout} className="mobile-btn"
            style={{background:`linear-gradient(135deg,${primary},var(--accent-dark))`,color:"white",padding:"18px",borderRadius:"14px",fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"15px",border:"none",cursor:"pointer",transition:"all 0.2s",marginTop:"8px"}}>
            Hablar con un asesor
          </button>
        </div>
      )}
    </div>
  );
}

export default function SettingsClient({ org, user }: { org: any; user: any }) {
  const [tab, setTab] = useState("general");

  const tabs = [
    {id:"general",label:"General"},
    {id:"security",label:"Seguridad"},
    {id:"plan",label:"Plan"},
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"24px"}}>
      <style>{`
        input:focus,select:focus{outline:none}
        .mobile-btn { width: 100%; text-align: center; justify-content: center; display: flex; align-items: center; }
        .settings-card { padding: 32px; }
        .tabs-container { display: flex; gap: 4px; background: var(--bg-primary); border: 1px solid var(--border); border-radius: 16px; padding: 6px; width: fit-content; }
        .tab-btn { padding: 12px 24px; border-radius: 12px; font-size: 14px; font-family: var(--font-inter); transition: all 0.2s; border: none; cursor: pointer; }
        
        @media(max-width: 768px) {
          .settings-card { padding: 20px !important; border-radius: 24px !important; border-left: none; border-right: none; background: var(--bg-card) !important; }
          .tabs-container { width: 100% !important; display: grid !important; grid-template-columns: 1fr 1fr 1fr !important; padding: 4px !important; }
          .tab-btn { padding: 10px 4px !important; font-size: 13px !important; width: 100% !important; }
          input { font-size: 16px !important; padding: 14px 16px !important; border-radius: 14px !important; }
          label { font-size: 11px !important; margin-bottom: 10px !important; letter-spacing: 1px !important; }
        }
      `}</style>

      {/* Tab bar */}
      <div className="tabs-container">
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} className="tab-btn"
            style={{
              fontWeight:tab===t.id?700:500,
              background:tab===t.id?"var(--accent)":"transparent",
              color:tab===t.id?"white":"var(--text-muted)"}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="settings-card" style={{background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:"24px"}}>
        {tab==="general" && <GeneralTab org={org} />}
        {tab==="security" && <SecurityTab />}
        {tab==="plan" && <PlanTab org={org} />}
      </div>
    </div>
  );
}
