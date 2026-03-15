import { writeFileSync, readFileSync } from "fs";

// Fix landing — bilingual hero, no redirect on ES
let landing = readFileSync("src/app/[locale]/page.tsx", "utf8");

// Replace hero component call to pass locale-aware text
landing = landing.replace(
  `<HeroGeometric badge="7-day free trial — no credit card required" title1="Attendance tracking" title2="made simple" />`,
  `<HeroGeometric badge="7-day free trial" title1="Attendance tracking" title2="made simple" />`
);

writeFileSync("src/app/[locale]/page.tsx", landing);

// Fix HeroGeometric to detect locale from window.location
let hero = readFileSync("src/components/ui/shape-landing-hero.tsx", "utf8");

hero = hero.replace(
  `export function HeroGeometric({ badge, title1, title2 }: { badge: string; title1: string; title2: string }) {`,
  `export function HeroGeometric({ badge, title1, title2 }: { badge: string; title1: string; title2: string }) {
  const isEs = typeof window !== "undefined" && window.location.pathname.startsWith("/es");
  const t = {
    badge: isEs ? "7 días de prueba gratis" : badge,
    title1: isEs ? "Control de asistencia" : title1,
    title2: isEs ? "" : title2,
    sub: isEs ? "Kiosk con PIN, geofencing desde el móvil y reportes automáticos. Un pago único de $49." : "PIN kiosk, mobile geofencing and automatic reports. One-time payment of $49.",
    btn1: isEs ? "Comenzar gratis" : "Start free trial",
    btn2: isEs ? "Ya tengo cuenta" : "Sign in",
    btn1href: isEs ? "/es/register" : "/en/register",
    btn2href: isEs ? "/es/login" : "/en/login",
  };`
);

// Replace hardcoded text with t. variables
hero = hero
  .replace(`{badge}`, `{t.badge}`)
  .replace(`{title1}<br/>`, `{t.title1}{t.title2 ? <br/> : null}`)
  .replace(
    `<span style={{background:"linear-gradient(135deg,#FFD166,#C9A84C,#FFD166)",WebkitBackgroundClip:"text",
            WebkitTextFillColor:"transparent",backgroundClip:"text",
            filter:"drop-shadow(0 0 40px rgba(201,168,76,0.4))"}}>
            {title2}
          </span>`,
    `{t.title2 && <span style={{background:"linear-gradient(135deg,#FFD166,#C9A84C,#FFD166)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",filter:"drop-shadow(0 0 40px rgba(201,168,76,0.4))"}}>
            {t.title2}
          </span>}`
  )
  .replace(
    `Kiosk con PIN, geofencing desde el móvil y reportes automáticos. Todo por un pago único de $49.`,
    `{t.sub}`
  )
  .replace(
    `href="/en/register" className="hero-btn-gold"`,
    `href={t.btn1href} className="hero-btn-gold"`
  )
  .replace(
    `href="/en/login" className="hero-btn-ghost"`,
    `href={t.btn2href} className="hero-btn-ghost"`
  )
  .replace(
    `Empezar 7 días gratis`,
    `{t.btn1}`
  )
  .replace(
    `Ya tengo cuenta`,
    `{t.btn2}`
  );

writeFileSync("src/components/ui/shape-landing-hero.tsx", hero);
console.log("Listo!");

