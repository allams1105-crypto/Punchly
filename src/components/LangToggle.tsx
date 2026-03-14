"use client";
import { usePathname, useRouter } from "next/navigation";

export default function LangToggle({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  // Obtenemos el idioma actual de la URL
  const segments = pathname.split("/");
  const currentLang = segments[1]; 
  const gold = "#D4AF37";

  const changeLang = (newLang: string) => {
    if (currentLang === newLang) return;
    
    // Cambiamos el primer segmento de la URL (/en/... -> /es/...)
    const newSegments = [...segments];
    newSegments[1] = newLang;
    const newPath = newSegments.join("/");
    
    router.push(newPath);
  };

  const btnStyle = (active: boolean) => ({
    flex: 1,
    padding: "6px 10px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
    transition: "all 0.2s ease",
    background: active ? gold : "transparent",
    color: active ? "#000" : "rgba(255,255,255,0.4)",
    fontFamily: "var(--font-syne)"
  });

  return (
    <div className={className} style={{
      display: "flex", 
      background: "rgba(255,255,255,0.04)", 
      border: "1px solid rgba(255,255,255,0.08)", 
      borderRadius: "10px", 
      padding: "2px",
      width: "100%",
      boxSizing: "border-box"
    }}>
      <button 
        onClick={() => changeLang("es")}
        style={btnStyle(currentLang === "es")}
      >
        ES
      </button>
      <button 
        onClick={() => changeLang("en")}
        style={btnStyle(currentLang === "en")}
      >
        EN
      </button>
    </div>
  );
}