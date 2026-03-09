"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations } from "./translations";

type Lang = "es" | "en";
const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }>({
  lang: "es", setLang: () => {}, t: (k) => k,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const saved = localStorage.getItem("punchly-lang") as Lang;
    if (saved === "en" || saved === "es") setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("punchly-lang", l);
  }

  function t(key: string): string {
    return (translations[lang] as any)[key] || key;
  }

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() { return useContext(LangContext); }