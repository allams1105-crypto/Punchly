"use client";
import Link from "next/link";

export default function TrialBanner({ daysLeft, expired }: { daysLeft: number; expired: boolean }) {
  if (expired) return null;

  const urgent = daysLeft <= 2;

  return (
    <div className={`w-full px-4 py-2 flex items-center justify-between gap-3 ${urgent ? "bg-red-500/10 border-b border-red-500/20" : "bg-[#E8B84B]/10 border-b border-[#E8B84B]/20"}`}>
      <div className="flex items-center gap-2.5 min-w-0">
        <div className={`shrink-0 flex flex-col items-center justify-center w-8 h-8 rounded-lg font-black text-sm leading-none ${urgent ? "bg-red-500/20 text-red-400" : "bg-[#E8B84B]/20 text-[#E8B84B]"}`}>
          <span className="text-base font-black">{daysLeft}</span>
        </div>
        <p className={`text-xs font-medium ${urgent ? "text-red-400" : "text-[#E8B84B]"}`}>
          {daysLeft === 1
            ? "Queda 1 día de prueba"
            : `Quedan ${daysLeft} días de prueba — activa tu licencia para no perder el acceso`}
        </p>
      </div>
      <Link href="/en/admin/settings"
        className={`shrink-0 text-xs font-black px-3 py-1.5 rounded-lg transition ${urgent ? "bg-red-500 text-white hover:bg-red-600" : "bg-[#E8B84B] text-black hover:bg-[#d4a43a]"}`}>
        Activar licencia
      </Link>
    </div>
  );
}