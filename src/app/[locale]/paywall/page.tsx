"use client";
import { useState } from "react";
import { useLang } from "@/lib/LangContext";

const features = ["paywall.f1","paywall.f2","paywall.f3","paywall.f4","paywall.f5"];

export default function PaywallPage() {
  const { t } = useLang();
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-9 h-9 bg-[#E8B84B] rounded-xl flex items-center justify-center">
            <span className="text-black font-black text-base">P</span>
          </div>
          <span className="text-white font-black text-xl">Punchly.Clock</span>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-white/10">
            <h1 className="text-2xl font-black text-white mb-2">{t("paywall.title")}</h1>
            <p className="text-white/50 text-sm">{t("paywall.desc")}</p>
          </div>

          <div className="px-8 py-6 border-b border-white/10">
            <div className="flex items-end gap-2 mb-1">
              <span className="text-5xl font-black text-[#E8B84B]">$49</span>
              <span className="text-white/40 text-sm mb-2">{t("paywall.price.note")}</span>
            </div>
            <p className="text-xs text-white/30">{t("paywall.price.sub")}</p>
          </div>

          <div className="px-8 py-6 space-y-3 border-b border-white/10">
            {features.map(key => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-[#E8B84B]/10 border border-[#E8B84B]/30 rounded-md flex items-center justify-center shrink-0">
                  <span className="text-[#E8B84B] text-xs">✓</span>
                </div>
                <p className="text-sm text-white/70">{t(key)}</p>
              </div>
            ))}
          </div>

          <div className="px-8 py-6 space-y-3">
            <button onClick={handleUpgrade} disabled={loading}
              className="w-full bg-[#E8B84B] text-black py-4 rounded-2xl font-black text-sm hover:bg-[#d4a43a] transition disabled:opacity-50">
              {loading ? "Redirigiendo..." : t("paywall.cta")}
            </button>
            <p className="text-center text-xs text-white/30">{t("paywall.secure")}</p>
            <a href="/api/auth/signout" className="block text-center text-xs text-white/30 hover:text-white/50 transition">{t("paywall.logout")}</a>
          </div>
        </div>
      </div>
    </div>
  );
}