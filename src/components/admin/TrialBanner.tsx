"use client";
import { useRouter } from "next/navigation";

export default function TrialBanner({ daysLeft }: { daysLeft: number }) {
  const router = useRouter();
  const urgent = daysLeft <= 2;
  return (
    <div style={{
      display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"10px 24px",
      background: urgent ? "rgba(248,113,113,0.08)" : "rgba(59, 130, 246,0.06)",
      borderBottom: urgent ? "1px solid rgba(248,113,113,0.15)" : "1px solid rgba(59, 130, 246,0.12)",
    }}>
      <p style={{fontFamily:"var(--font-inter)",fontSize:"13px",color: urgent?"#F87171":"rgba(59, 130, 246,0.9)"}}>
        {daysLeft === 0 ? "Tu período de prueba ha terminado" : `Quedan ${daysLeft} día${daysLeft===1?"":"s"} de prueba — activa tu licencia para no perder el acceso`}
      </p>
      <button onClick={()=>router.push("/en/paywall")}
        style={{fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"12px",padding:"6px 16px",borderRadius:"10px",border:"none",cursor:"pointer",flexShrink:0,
          background: urgent ? "#F87171" : "var(--accent)",
          color: urgent ? "white" : "#000"}}>
        Activar licencia
      </button>
    </div>
  );
}