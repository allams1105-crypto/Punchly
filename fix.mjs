import { writeFileSync } from "fs";

// ==================== LOGIN PAGE ====================
const loginPage = `"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";
import LangToggle from "@/components/LangToggle";

export default function LoginPage() {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.ok) {
      window.location.href = "/en/admin/dashboard";
    } else {
      setError("Email o contraseña incorrectos");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      <div className="hidden lg:flex w-1/2 bg-[#E8B84B] flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
            <span className="text-[#E8B84B] font-black text-base">P</span>
          </div>
          <span className="text-black font-black text-xl">Punchly.Clock</span>
        </div>
        <div>
          <h2 className="text-4xl font-black text-black leading-tight mb-4">{t("login.left.title")}</h2>
          <p className="text-black/60 text-lg">{t("login.left.sub")}</p>
        </div>
        <div className="flex gap-6">
          <div><p className="text-3xl font-black text-black">7</p><p className="text-black/60 text-sm">{t("landing.stats.trial")}</p></div>
          <div><p className="text-3xl font-black text-black">$49</p><p className="text-black/60 text-sm">{t("landing.stats.price")}</p></div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="flex justify-end mb-6">
            <LangToggle />
          </div>
          <div className="mb-8">
            <h1 className="text-2xl font-black text-[var(--text-primary)] mb-1">{t("login.title")}</h1>
            <p className="text-[var(--text-muted)] text-sm">{t("login.subtitle")}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">{t("login.email")}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">{t("login.password")}</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" required />
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"><p className="text-red-400 text-sm">{error}</p></div>}
            <button type="submit" disabled={loading}
              className="w-full bg-[#E8B84B] text-black py-3 rounded-xl text-sm font-black hover:bg-[#d4a43a] transition disabled:opacity-50">
              {loading ? t("login.loading") : t("login.btn")}
            </button>
          </form>
          <p className="text-center text-xs text-[var(--text-muted)] mt-6">
            {t("login.register")} <Link href="/en/register" className="text-[#E8B84B] font-semibold hover:underline">{t("login.register.link")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}`;

// ==================== REGISTER PAGE ====================
const registerPage = `"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";
import LangToggle from "@/components/LangToggle";

export default function RegisterPage() {
  const { t } = useLang();
  const [orgName, setOrgName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgName, name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Error al registrar"); setLoading(false); return; }
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.ok) {
      window.location.href = "/en/admin/dashboard";
    } else {
      window.location.href = "/en/login";
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      <div className="hidden lg:flex w-1/2 bg-[#E8B84B] flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
            <span className="text-[#E8B84B] font-black text-base">P</span>
          </div>
          <span className="text-black font-black text-xl">Punchly.Clock</span>
        </div>
        <div>
          <h2 className="text-4xl font-black text-black leading-tight mb-4">{t("register.left.title")}</h2>
          <p className="text-black/60 text-lg">{t("register.left.sub")}</p>
        </div>
        <div className="flex gap-6">
          <div><p className="text-3xl font-black text-black">7</p><p className="text-black/60 text-sm">{t("landing.stats.trial")}</p></div>
          <div><p className="text-3xl font-black text-black">$49</p><p className="text-black/60 text-sm">{t("landing.stats.price")}</p></div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="flex justify-end mb-6">
            <LangToggle />
          </div>
          <div className="mb-8">
            <h1 className="text-2xl font-black text-[var(--text-primary)] mb-1">{t("register.title")}</h1>
            <p className="text-[var(--text-muted)] text-sm">{t("register.subtitle")}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">{t("register.company")}</label>
              <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">{t("register.name")}</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">{t("register.email")}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">{t("register.password")}</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" required />
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"><p className="text-red-400 text-sm">{error}</p></div>}
            <button type="submit" disabled={loading}
              className="w-full bg-[#E8B84B] text-black py-3 rounded-xl text-sm font-black hover:bg-[#d4a43a] transition disabled:opacity-50">
              {loading ? t("register.loading") : t("register.btn")}
            </button>
          </form>
          <p className="text-center text-xs text-[var(--text-muted)] mt-6">
            {t("register.login")} <Link href="/en/login" className="text-[#E8B84B] font-semibold hover:underline">{t("register.login.link")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}`;

// ==================== PAYWALL PAGE ====================
const paywallPage = `"use client";
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
}`;

writeFileSync("src/app/[locale]/login/page.tsx", loginPage);
writeFileSync("src/app/[locale]/register/page.tsx", registerPage);
writeFileSync("src/app/[locale]/paywall/page.tsx", paywallPage);
console.log("Listo!");

