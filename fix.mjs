import { writeFileSync } from "fs";

const content = `"use client";
import { useState } from "react";
import Link from "next/link";
import { Clock, DollarSign, Tablet, BarChart2, Building2, Shield } from "lucide-react";

const t = {
  en: {
    nav: { login: "Log in", start: "Get started free" },
    hero: {
      badge: "Attendance tracking, simplified",
      title: "Know who's working,",
      titleAccent: "right now.",
      sub: "Punchly helps small businesses track employee hours, manage payroll, and run kiosk check-ins — all in one place.",
      cta: "Start for free",
      demo: "See how it works",
    },
    features: {
      title: "Everything you need",
      sub: "Simple tools that actually get used.",
      items: [
        { icon: "clock", title: "Live time tracking", desc: "Employees clock in and out from any device. See who is working in real time." },
        { icon: "dollar", title: "Payroll calculator", desc: "Automatic bi-weekly payroll reports based on hours worked and hourly rates." },
        { icon: "tablet", title: "Kiosk mode", desc: "Set up a shared tablet at the entrance. Employees check in with their name." },
        { icon: "chart", title: "Weekly calendar", desc: "Employees see their hours by day and week in a clean visual calendar." },
        { icon: "building", title: "Multi-company", desc: "Each company has its own isolated data. Perfect for multiple locations." },
        { icon: "shield", title: "Secure and private", desc: "Role-based access. Employees only see their own data." },
      ],
    },
    pricing: {
      title: "Simple pricing",
      sub: "One plan. Everything included.",
      badge: "Most popular",
      pro: { name: "Pro", price: "$19", period: "/month", desc: "Everything you need to manage your team.", features: ["Unlimited employees", "Bi-weekly payroll reports", "Kiosk mode", "Weekly calendar view", "Email support"], cta: "Start free for 14 days" },
      free: { name: "Free", price: "$0", period: "/month", desc: "For small teams just getting started.", features: ["Up to 5 employees", "Basic time tracking", "Manual payroll"], cta: "Get started" },
    },
    footer: "Made for small businesses.",
  },
  es: {
    nav: { login: "Iniciar sesion", start: "Empieza gratis" },
    hero: {
      badge: "Control de asistencia, simplificado",
      title: "Sabe quien esta trabajando,",
      titleAccent: "ahora mismo.",
      sub: "Punchly ayuda a pequenos negocios a registrar horas, gestionar nomina y usar check-ins por kiosk — todo en un lugar.",
      cta: "Empieza gratis",
      demo: "Ver como funciona",
    },
    features: {
      title: "Todo lo que necesitas",
      sub: "Herramientas simples que realmente se usan.",
      items: [
        { icon: "clock", title: "Registro en tiempo real", desc: "Los empleados marcan entrada y salida desde cualquier dispositivo." },
        { icon: "dollar", title: "Calculo de nomina", desc: "Reportes quincenales automaticos basados en horas trabajadas y tarifas." },
        { icon: "tablet", title: "Modo kiosk", desc: "Instala una tablet en la entrada. Los empleados se registran sin login." },
        { icon: "chart", title: "Calendario semanal", desc: "Los empleados ven sus horas por dia y semana en un calendario visual." },
        { icon: "building", title: "Multi-empresa", desc: "Cada empresa tiene sus propios datos. Ideal para multiples sucursales." },
        { icon: "shield", title: "Seguro y privado", desc: "Acceso por roles. Los empleados solo ven sus propios datos." },
      ],
    },
    pricing: {
      title: "Precio simple",
      sub: "Un plan. Todo incluido.",
      badge: "Mas popular",
      pro: { name: "Pro", price: "$19", period: "/mes", desc: "Todo lo que necesitas para gestionar tu equipo.", features: ["Empleados ilimitados", "Reportes quincenales de nomina", "Modo kiosk", "Vista de calendario semanal", "Soporte por email"], cta: "14 dias gratis" },
      free: { name: "Gratis", price: "$0", period: "/mes", desc: "Para equipos pequenos que estan empezando.", features: ["Hasta 5 empleados", "Registro basico de horas", "Nomina manual"], cta: "Empezar" },
    },
    footer: "Hecho para pequenos negocios.",
  },
};

const icons: Record<string, React.ReactNode> = {
  clock: <Clock className="w-6 h-6" />,
  dollar: <DollarSign className="w-6 h-6" />,
  tablet: <Tablet className="w-6 h-6" />,
  chart: <BarChart2 className="w-6 h-6" />,
  building: <Building2 className="w-6 h-6" />,
  shield: <Shield className="w-6 h-6" />,
};

export default function LandingPage() {
  const [lang, setLang] = useState<"en" | "es">("es");
  const c = t[lang];

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">Punchly</span>
          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === "en" ? "es" : "en")} className="text-xs border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition font-medium">
              {lang === "en" ? "ES" : "EN"}
            </button>
            <Link href="/en/login" className="text-sm text-gray-500 hover:text-gray-900">{c.nav.login}</Link>
            <Link href="/en/register" className="bg-black text-white text-sm px-4 py-2 rounded-full hover:bg-gray-800 transition">{c.nav.start}</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-gradient-to-r from-violet-100 to-blue-100 text-violet-700 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            {c.hero.badge}
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-4">
            {c.hero.title}<br />
            <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
              {c.hero.titleAccent}
            </span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">{c.hero.sub}</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/en/register" className="bg-black text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-gray-800 transition shadow-lg">
              {c.hero.cta} →
            </Link>
            <Link href="/en/login" className="text-gray-500 hover:text-gray-900 text-base font-medium transition">
              {c.hero.demo}
            </Link>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="max-w-3xl mx-auto mt-16">
          <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-3xl p-8 border border-violet-100 shadow-xl">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Trabajando ahora", value: "4", color: "text-green-600" },
                { label: "Horas esta semana", value: "127h", color: "text-violet-600" },
                { label: "Nomina quincenal", value: "$3,840", color: "text-blue-600" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-4 text-center shadow-sm">
                  <p className={\`text-2xl font-bold \${stat.color}\`}>{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold text-gray-700">Empleados activos</span>
              </div>
              {["Maria Garcia", "Juan Perez", "Ana Lopez", "Carlos Ruiz"].map((name, i) => (
                <div key={name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700">{name}</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{i + 2}h {(i * 17) % 60}m</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">{c.features.title}</h2>
            <p className="text-xl text-gray-400">{c.features.sub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {c.features.items.map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition">
                <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600 mb-4">
                  {icons[feature.icon]}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">{c.pricing.title}</h2>
            <p className="text-xl text-gray-400">{c.pricing.sub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
              <p className="text-sm font-semibold text-gray-500 mb-2">{c.pricing.free.name}</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-5xl font-black text-gray-900">{c.pricing.free.price}</span>
                <span className="text-gray-400 mb-2">{c.pricing.free.period}</span>
              </div>
              <p className="text-sm text-gray-400 mb-6">{c.pricing.free.desc}</p>
              <ul className="space-y-3 mb-8">
                {c.pricing.free.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/en/register" className="block text-center border border-gray-300 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
                {c.pricing.free.cta}
              </Link>
            </div>
            <div className="bg-gradient-to-br from-violet-600 to-blue-500 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                {c.pricing.badge}
              </div>
              <p className="text-sm font-semibold text-violet-200 mb-2">{c.pricing.pro.name}</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-5xl font-black">{c.pricing.pro.price}</span>
                <span className="text-violet-200 mb-2">{c.pricing.pro.period}</span>
              </div>
              <p className="text-sm text-violet-200 mb-6">{c.pricing.pro.desc}</p>
              <ul className="space-y-3 mb-8">
                {c.pricing.pro.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white">
                    <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/en/register" className="block text-center bg-white text-violet-600 py-3 rounded-full font-bold hover:bg-violet-50 transition">
                {c.pricing.pro.cta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">Punchly</span>
            <p className="text-xs text-gray-400 mt-1">{c.footer}</p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/en/login" className="text-sm text-gray-400 hover:text-gray-900">{c.nav.login}</Link>
            <Link href="/en/register" className="text-sm text-gray-400 hover:text-gray-900">{c.nav.start}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}`;

writeFileSync("src/app/[locale]/page.tsx", content);
console.log("Listo!");
