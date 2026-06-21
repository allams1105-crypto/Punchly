"use client";
import { useState } from "react";

export default function UpgradeButton({ variant = "banner" }: { variant?: "banner" | "full" }) {
  const [loading, setLoading] = useState(false);

  function handleUpgrade() {
    window.location.href = "https://wa.me/18098686257?text=Hola,%20necesito%20activar%20mi%20licencia";
  }

  if (variant === "full") {
    return (
      <button onClick={handleUpgrade}
        className="w-full bg-[#E8B84B] text-black py-4 rounded-2xl text-base font-black hover:bg-[#d4a43a] transition flex items-center justify-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
        Hablar con un asesor
      </button>
    );
  }

  return (
    <button onClick={handleUpgrade}
      className="shrink-0 text-xs font-black px-3 py-1.5 rounded-lg bg-[#E8B84B] text-black hover:bg-[#d4a43a] transition">
      Activar licencia
    </button>
  );
}
