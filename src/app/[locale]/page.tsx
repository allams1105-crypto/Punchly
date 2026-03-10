"use client";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";
import LangToggle from "@/components/LangToggle";


export default function LandingPage() {
  const { t } = useLang();

  const features = [
    { key: "f1", icon: "⏱" },
    { key: "f2", icon: "" },
    { key: "f3", icon: "" },
    { key: "f4", icon: "" },
    { key: "f5", icon: "" },
    { key: "f6", icon: "" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="border-b border-white/8 px-4 py-3 flex items-center justify-between sticky top-0 z-50 bg-black/95 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#E8B84B] rounded-xl flex items-center justify-center">
            <span className="text-black font-black text-sm">P</span>
          </div>
          <span className="text-white font-black text-lg">Punchly.Clock</span>
        </div>
        <div className="flex items-center gap-2">
          <LangToggle />
          
          <Link href="/en/login" className="text-white/60 hover:text-white text-sm font-medium transition px-3 py-1.5">
            {t("nav.login")}
          </Link>
          <Link href="/en/register" className="bg-[#E8B84B] text-black px-4 py-1.5 rounded-xl text-sm font-black hover:bg-[#d4a43a] transition">
            {t("nav.register")}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-16 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#E8B84B]/10 border border-[#E8B84B]/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 bg-[#E8B84B] rounded-full animate-pulse"></span>
          <span className="text-[#E8B84B] text-xs font-semibold">{t("landing.badge")}</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-black leading-[1.05] mb-6">
          {t("landing.hero1")}{" "}
          <span className="text-[#E8B84B]">{t("landing.hero2")}</span>
          <br />{t("landing.hero3")}
        </h1>
        <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          {t("landing.desc")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/en/register"
            className="bg-[#E8B84B] text-black px-8 py-4 rounded-2xl font-black text-base hover:bg-[#d4a43a] transition">
            {t("landing.cta1")}
          </Link>
          <a href="#pricing"
            className="border border-white/15 text-white/70 px-8 py-4 rounded-2xl font-semibold text-base hover:border-white/30 hover:text-white transition">
            {t("landing.cta2")}
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 pb-16 max-w-3xl mx-auto">
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: "7", label: t("landing.stats.trial") },
            { value: "∞", label: t("landing.stats.employees") },
            { value: "$49", label: t("landing.stats.price") },
          ].map(s => (
            <div key={s.label} className="bg-white/3 border border-white/8 rounded-2xl p-5 text-center">
              <p className="text-3xl font-black text-[#E8B84B] mb-1">{s.value}</p>
              <p className="text-xs text-white/40">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-12">{t("landing.features.title")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => (
            <div key={f.key} className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-[#E8B84B]/30 hover:bg-[#E8B84B]/3 transition group">
              <div className="w-10 h-10 bg-[#E8B84B]/10 rounded-xl flex items-center justify-center mb-4 text-xl group-hover:bg-[#E8B84B]/20 transition">
                {f.icon}
              </div>
              <h3 className="text-sm font-black text-white mb-2">{t(`landing.${f.key}.title`)}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{t(`landing.${f.key}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-3">{t("landing.pricing.title")}</h2>
        <p className="text-white/40 text-center text-sm mb-12">{t("landing.pricing.desc")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Free */}
          <div className="bg-white/3 border border-white/8 rounded-3xl p-8">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">{t("landing.free.label")}</p>
            <p className="text-5xl font-black text-white mb-1">{t("landing.free.price")}</p>
            <p className="text-xs text-white/30 mb-8">{t("landing.free.sub")}</p>
            <Link href="/en/register"
              className="block text-center border border-white/15 text-white/70 py-3 rounded-xl font-semibold text-sm hover:border-white/30 hover:text-white transition">
              {t("landing.free.cta")}
            </Link>
          </div>
          {/* Pro */}
          <div className="bg-[#E8B84B] rounded-3xl p-8 relative">
            
            <p className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-4">{t("landing.pro.label")}</p>
            <p className="text-5xl font-black text-black mb-1">{t("landing.pro.price")}</p>
            <p className="text-xs text-black/40 mb-8">{t("landing.pro.sub")}</p>
            <Link href="/en/register"
              className="block text-center bg-black text-[#E8B84B] py-3 rounded-xl font-black text-sm hover:bg-black/80 transition">
              {t("landing.pro.cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-black mb-4">{t("landing.cta.title")}</h2>
        <p className="text-white/40 mb-8">{t("landing.cta.desc")}</p>
        <Link href="/en/register"
          className="inline-block bg-[#E8B84B] text-black px-10 py-4 rounded-2xl font-black text-base hover:bg-[#d4a43a] transition">
          {t("landing.cta.btn")}
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 px-6 py-6 text-center">
        <p className="text-xs text-white/20">© 2026 Punchly.Clock · Todos los derechos reservados</p>
      </footer>
    </div>
  );
}