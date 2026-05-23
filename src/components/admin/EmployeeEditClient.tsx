"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const COLORS = ["var(--accent)","#60A5FA","#34D399","#F87171","#A78BFA","#FB923C","#38BDF8","#4ADE80","#E879F9","#94A3B8"];

export default function EmployeeEditClient({ employee }: { employee: any }) {
  const router = useRouter();
  const [name, setName] = useState(employee.name||"");
  const [email, setEmail] = useState(employee.email||"");
  const [hourlyRate, setHourlyRate] = useState(employee.hourlyRate||"");
  const [isActive, setIsActive] = useState(employee.isActive);
  const [avatarColor, setAvatarColor] = useState(employee.avatarColor||"var(--accent)");
  const [kioskPin, setKioskPin] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState("");
  
  // Photo state
  const [photo, setPhoto] = useState<string|null>(employee.avatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("La imagen no debe pesar más de 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;
        
        canvas.width = 150;
        canvas.height = 150;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, startX, startY, size, size, 0, 0, 150, 150);
          const base64 = canvas.toDataURL("image/jpeg", 0.7);
          setPhoto(base64);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  // Colores globales inyectados para TypeScript
  const bg = "var(--bg-primary, #0A0A0A)";
  const card = "var(--bg-card, #111111)";
  const border = "var(--border, rgba(255,255,255,0.08))";
  const text = "var(--text-primary, #FAFAFA)";
  const muted = "var(--text-muted, #A1A1AA)";
  const primary = "var(--accent)";

  // El "as const" soluciona los errores de TypeScript con el CSS en línea
  const inputS = {width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",padding:"10px 14px",color:"#FAFAFA",fontSize:"13px",fontFamily:"var(--font-inter)",transition:"border 0.2s",boxSizing:"border-box" as const};
  const labelS = {display:"block",fontSize:"11px",fontWeight:600,color:"rgba(255,255,255,0.3)",textTransform:"uppercase" as const,letterSpacing:"1px",marginBottom:"8px",fontFamily:"var(--font-inter)"};

  async function save() {
    setSaving(true);
    const body: any = { name, email, hourlyRate: Number(hourlyRate), isActive, avatarUrl: photo };
    if (kioskPin.length === 4) body.kioskPin = kioskPin;
    try {
      const [r1, r2] = await Promise.all([
        fetch("/api/employees/"+employee.id, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) }),
        fetch("/api/employees/avatar", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({userId:employee.id,avatarColor}) }),
      ]);
      setMsg(r1.ok?"Guardado":"Error al guardar");
    } catch (e) {
      setMsg("Error en el servidor");
    }
    setSaving(false);
    if (kioskPin) setKioskPin("");
    setTimeout(()=>setMsg(""),3000);
  }

  async function deleteEmployee() {
    if (!confirm("¿Eliminar este empleado? Esta acción no se puede deshacer.")) return;
    setDeleting(true);
    await fetch("/api/employees/"+employee.id, { method:"DELETE" });
    router.push("/en/admin/employees");
  }

  const initials = name.split(" ").map((n:string)=>n.charAt(0)).join("").substring(0,2).toUpperCase();

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"16px", background: bg}}>
      <style>{`
  .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)}
  .btn-primary{background:var(--accent);color:#fff;font-family:var(--font-inter);font-weight:600;transition:all 0.2s ease;text-decoration:none;display:inline-block;border:1px solid var(--accent-dark);border-radius:12px}
  .btn-primary:hover{background:var(--accent-dark);transform:translateY(-1px);box-shadow:0 4px 12px rgba(59, 130, 246, 0.25)}
  input,select{color-scheme:dark}
  input:focus,select:focus{border:1px solid rgba(59, 130, 246,0.4)!important;outline:none}
  @media(max-width:768px){.hide-mobile{display:none!important}.stack-mobile{flex-direction:column!important}.full-mobile{width:100%!important}.grid-mobile-1{grid-template-columns:1fr!important}}
 input:focus,select:focus{border:1px solid rgba(59, 130, 246,0.4)!important;outline:none}`}</style>

      {/* Avatar */}
      <div style={{background:card,backdropFilter:"blur(20px)",border:"1px solid "+border,borderRadius:"20px",overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid "+border}}>
          <h3 style={{fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"14px",color:text}}>Avatar</h3>
        </div>
        <div style={{padding:"20px",display:"flex",alignItems:"center",gap:"20px"}} className="stack-mobile">
          <div style={{width:"80px",height:"80px",borderRadius:"24px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"28px",fontFamily:"var(--font-inter)",fontWeight:800,flexShrink:0,transition:"all 0.2s",background:avatarColor+"18",border:"2px solid "+avatarColor+"30",color:avatarColor,overflow:"hidden"}}>
            {photo ? (
              <img src={photo} alt="Avatar" style={{width:"100%",height:"100%",objectFit:"cover"}} />
            ) : (
              initials||"?"
            )}
          </div>
          <div>
            <p style={{fontFamily:"var(--font-inter)",fontSize:"12px",color:muted,marginBottom:"10px"}}>Foto o Color de Avatar</p>
            <div style={{display:"flex",gap:"8px",marginBottom:"12px"}}>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} style={{display:"none"}} />
              <button onClick={() => fileInputRef.current?.click()} style={{background:"rgba(255,255,255,0.05)",color:"#FFF",border:"1px solid rgba(255,255,255,0.1)",padding:"6px 12px",borderRadius:"8px",fontSize:"12px",fontWeight:600,fontFamily:"var(--font-inter)",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"}}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                {photo ? "Cambiar foto" : "Subir foto"}
              </button>
              {photo && (
                <button onClick={() => setPhoto(null)} style={{background:"transparent",color:"#F87171",border:"1px solid rgba(248,113,113,0.3)",padding:"6px 12px",borderRadius:"8px",fontSize:"12px",fontWeight:600,fontFamily:"var(--font-inter)",cursor:"pointer"}}>
                  Quitar foto
                </button>
              )}
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"8px",opacity:photo?0.5:1,pointerEvents:photo?"none":"auto"}}>
              {COLORS.map(c=>(
                <button key={c} onClick={()=>setAvatarColor(c)}
                  style={{width:"28px",height:"28px",borderRadius:"8px",border:avatarColor===c?"2px solid white":"2px solid transparent",background:c,cursor:"pointer",transform:avatarColor===c?"scale(1.15)":"scale(1)",transition:"all 0.15s"}} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{background:card,backdropFilter:"blur(20px)",border:"1px solid "+border,borderRadius:"20px",overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid "+border}}>
          <h3 style={{fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"14px",color:text}}>Información</h3>
        </div>
        <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:"14px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}} className="grid-mobile-1">
            <div>
              <label style={labelS}>Nombre</label>
              <input value={name} onChange={e=>setName(e.target.value)} style={inputS} />
            </div>
            <div>
              <label style={labelS}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={inputS} />
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}} className="grid-mobile-1">
            <div>
              <label style={labelS}>Tarifa/hora ($)</label>
              <input type="number" value={hourlyRate} onChange={e=>setHourlyRate(e.target.value)} style={inputS} />
            </div>
            <div>
              <label style={labelS}>Estado</label>
              <select value={isActive?"1":"0"} onChange={e=>setIsActive(e.target.value==="1")} style={inputS}>
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </select>
            </div>
          </div>
          <div>
            <label style={labelS}>PIN del Kiosk (4 dígitos)</label>
            <input type="password" value={kioskPin} onChange={e=>setKioskPin(e.target.value.replace(/\D/g,"").substring(0,4))}
              placeholder="Dejar vacío para no cambiar" maxLength={4} style={inputS} />
            <p style={{fontFamily:"var(--font-inter)",fontSize:"11px",color:muted,marginTop:"6px"}}>El empleado usa este PIN para fichar en el kiosk</p>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:"8px",flexWrap:"wrap",gap:"10px"}}>
            <button onClick={deleteEmployee} disabled={deleting}
              style={{background:"transparent",border:"none",cursor:"pointer",color:"#F87171",fontSize:"13px",fontFamily:"var(--font-inter)",fontWeight:500,opacity:deleting?0.5:1}}>
              {deleting?"Eliminando...":"Eliminar empleado"}
            </button>
            <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
              {msg && <p style={{fontSize:"12px",color:msg==="Guardado"?"#34D399":"#F87171",fontFamily:"var(--font-inter)"}}>{msg}</p>}
              <button onClick={save} disabled={saving} className="btn-primary" style={{padding:"10px 24px",borderRadius:"12px",fontSize:"13px",opacity:saving?0.6:1}}>
                {saving?"Guardando...":"Guardar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}