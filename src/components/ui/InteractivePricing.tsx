"use client";
import { useState } from "react";

export default function InteractivePricing() {
  const [activePlan, setActivePlan] = useState("Business");

  const plans = [
    {t:"Starter", e:"1-10 empleados", p:"RD$500"},
    {t:"Business", e:"11-25 empleados", p:"RD$1,000"},
    {t:"Pro", e:"26-50 empleados", p:"RD$1,800"}
  ];

  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"24px"}} className="grid-sm-1">
      {plans.map(plan => {
        const isActive = activePlan === plan.t;
        return (
          <div 
            key={plan.t} 
            onClick={() => setActivePlan(plan.t)}
            style={{
              background:"var(--bg-card)",
              borderRadius:"20px",
              padding:"40px 24px",
              border: isActive ? "2px solid #1E3A8A" : "1px solid var(--border)",
              boxShadow: isActive ? "0 20px 40px rgba(2, 132, 199, 0.1)" : "0 12px 40px rgba(0,0,0,0.05)", 
              position:"relative",
              cursor:"pointer",
              transition:"all 0.3s ease",
              transform: isActive ? "translateY(-4px)" : "translateY(0)"
            }}
          >
            {isActive ? (
              <div style={{position:"absolute",top:"-12px",left:"50%",transform:"translateX(-50%)",background:"#1E3A8A",color:"white",fontSize:"12px",fontWeight:700,padding:"4px 12px",borderRadius:"100px"}}>
                Plan Seleccionado
              </div>
            ) : plan.t === "Business" ? (
              <div style={{position:"absolute",top:"-12px",left:"50%",transform:"translateX(-50%)",background:"#F1F5F9",color:"var(--text-muted)",fontSize:"12px",fontWeight:700,padding:"4px 12px",borderRadius:"100px",border:"1px solid var(--border)"}}>
                Más Popular
              </div>
            ) : null}
            <p style={{color:"var(--text-primary)",fontSize:"18px",fontWeight:700,marginBottom:"8px",fontFamily:"var(--font-inter)"}}>{plan.t}</p>
            <p style={{color:"var(--text-muted)",fontSize:"14px",marginBottom:"24px",fontFamily:"var(--font-inter)"}}>{plan.e}</p>
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:"4px",marginBottom:"32px"}}>
              <span style={{fontFamily:"var(--font-inter)",fontSize:"42px",fontWeight:800,lineHeight:1,color:"var(--text-primary)"}}>{plan.p}</span>
              <span style={{color:"var(--text-muted)",marginBottom:"8px",fontSize:"14px",fontFamily:"var(--font-inter)",fontWeight:500}}>/mes</span>
            </div>
            
            <ul style={{listStyle:"none",padding:0,marginBottom:"40px",textAlign:"left"}}>
              {[
                "Kiosko web inteligente",
                "Alertas de tardanza",
                "Reporte por WhatsApp",
                "Exportación a Excel"
              ].map((f)=>(
                <li key={f} style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 0",borderBottom:"1px solid var(--border)",color:"var(--text-muted)",fontSize:"13px",fontFamily:"var(--font-inter)",fontWeight:500}}>
                  <svg width="16" height="16" fill="none" stroke="#1E3A8A" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  {f}
                </li>
              ))}
            </ul>
            <a href={`https://wa.me/18098686257?text=Hola,%20me%20interesa%20el%20plan%20${plan.t}%20de%20Punchly`} target="_blank" rel="noopener noreferrer" className={isActive ? "bizneo-btn-blue" : "bizneo-btn-outline"} style={{display:"flex",padding:"14px",borderRadius:"8px",fontFamily:"var(--font-inter)",fontSize:"15px",textDecoration:"none",textAlign:"center",width:"100%",boxSizing:"border-box",justifyContent:"center"}} onClick={(e) => e.stopPropagation()}>
              Hablar con un asesor
            </a>
          </div>
        );
      })}
    </div>
  );
}
