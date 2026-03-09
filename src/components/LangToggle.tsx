"use client";
import { useLang } from "@/lib/LangContext";

export default function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`flex items-center bg-[var(--border)] rounded-lg p-0.5 ${className}`}>
      <button onClick={() => setLang("es")}
        className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${lang === "es" ? "bg-[#E8B84B] text-black" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}>
        ES
      </button>
      <button onClick={() => setLang("en")}
        className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${lang === "en" ? "bg-[#E8B84B] text-black" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}>
        EN
      </button>
    </div>
  );
}