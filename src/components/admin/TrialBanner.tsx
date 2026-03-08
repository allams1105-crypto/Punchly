"use client";
import Link from "next/link";

export default function TrialBanner({ daysLeft, expired }: { daysLeft: number; expired: boolean }) {
  if (!expired && daysLeft > 7) return null;

  return (
    <div className={`w-full px-4 py-2.5 flex items-center justify-between gap-3 ${expired ? "bg-red-500/10 border-b border-red-500/20" : "bg-[#E8B84B]/10 border-b border-[#E8B84B]/20"}`}>
      <div className="flex items-center gap-2.5 min-w-0">
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${expired ? "bg-red-400" : "bg-[#E8B84B]"}`} />
        <p className={`text-xs font-medium truncate ${expired ? "text-red-400" : "text-[#E8B84B]"}`}>
          {expired
            ? "Tu período de prueba ha terminado — actualiza a Pro para seguir usando Punchly.Clock"
            : `Te quedan ${daysLeft} días de prueba gratis`}
        </p>
      </div>
      <Link href="/en/admin/settings"
        className={`shrink-0 text-xs font-black px-3 py-1.5 rounded-lg transition ${expired ? "bg-red-500 text-white hover:bg-red-600" : "bg-[#E8B84B] text-black hover:bg-[#d4a43a]"}`}>
        {expired ? "Actualizar ahora" : "Ver planes"}
      </Link>
    </div>
  );
}