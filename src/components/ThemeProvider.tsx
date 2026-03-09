"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";

function ThemeRestorer() {
  useEffect(() => {
    const saved = localStorage.getItem("punchly-theme");
    if (saved === "light" || saved === "dark") {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(saved);
    }
  }, []);
  return null;
}

export function ThemeProvider({ children, ...props }: any) {
  return (
    <NextThemesProvider {...props}>
      <ThemeRestorer />
      {children}
    </NextThemesProvider>
  );
}