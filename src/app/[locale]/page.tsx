import Link from "next/link";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export default function LandingPage() {
  const gold = "#D4AF37";

  return (
    <div style={{ background: "#030303", color: "#FAFAFA", minHeight: "100vh", fontFamily: "var(--font-dm-sans)", overflowX: "hidden" }}>
      <style>{`
        .nav-blur { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); background: rgba(3,3,3,0.7); border-bottom: 1px solid rgba(255,255,255,0.03); }
        .apple-card { background: #0A0A0A; border: 1px solid rgba(255,255,255,0.03); border-radius: 24px; transition: all 0.3s ease; }
        .apple-card:hover { border-color: rgba(255,255,255,0.08); background: #0D0D0D; }
        .btn-white { background: #FAFAFA; color: #000; padding: 12px 24px; border-radius: 14px; font-weight: 700; font-size: 14px; text-decoration: none; transition: 0.2s; display: inline-flex; align-items: center; }
        .btn-white:hover { transform: scale(1.02); opacity: 0.9; }
        .btn-ghost { color: rgba(255,255,255,0.4); text-decoration: none; font-size: 14px; font-weight: 600; transition: 0.2s; }
        .btn-ghost:hover { color: #FAFAFA; }
        .label-stealth { font-size: 10px; font-weight: 800; color: ${gold}; text-transform: uppercase; letter-spacing: 2px; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .float-subtle { animation: float 6s ease-in-out infinite; }
      `}</style>

      {/* Navigation */}
      <nav className="nav-blur" style={{ position: "fixed", top: 0, width: "100%", zIndex: 100 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "28px", height: "28px", background: "#FAFAFA", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#000", fontWeight: 900, fontSize: "12px", fontFamily: "var(--font-syne)" }}>P</span>
            </div>
            <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "16px", letterSpacing: "-0.5px" }}>Punchly.</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <Link href="/en/login" className="btn-ghost">Login</Link>
            <Link href="/en/register" className="btn-white">Comenzar</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroGeometric 
        badge="Punchly.Clock v2.0"
        title1="Asistencia de personal"
        title2="simplificada."
      />

      {/* Content Wrapper */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>
        
        {/* Mockup Preview - Minimalist Style */}
        <section style={{ marginTop: "-12vh", position: "relative", zIndex: 20 }}>
          <div className="apple-card float-subtle" style={{ padding: "40px", maxWidth: "900px", margin: "0 auto", boxShadow: "0 40px 100px rgba(0,0,0,0.8)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
              <div>
                <p className="label-stealth">Live Terminal</p>
                <h2 style={{ fontSize: "48px", fontWeight: 800, fontFamily: "var(--font-syne)", marginTop: "8px" }}>09:41</h2>
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "14px" }}>Marzo 14, 2026</p>
              </div>
              <div style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", padding: "8px 16px", borderRadius: "100px", color: "#34D399", fontSize: "12px", fontWeight: 700 }}>
                • 3 Empleados activos
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {[
                { name: "Ana Garcia", init: "AG", active: true },
                { name: "Luis Mendez", init: "LM", active: true },
                { name: "Sofia Rosa", init: "SR", active: false }
              ].map(u => (
                <div key={u.name} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "16px", padding: "20px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: u.active ? gold : "#111", color: u.active ? "#000" : "#444", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "12px", marginBottom: "12px" }}>{u.init}</div>
                  <p style={{ fontSize: "14px", fontWeight: 700 }}>{u.name}</p>
                  <p style={{ fontSize: "11px", color: u.active ? "#34D399" : "rgba(255,255,255,0.1)", fontWeight: 700, marginTop: "4px" }}>{u.active ? "En turno" : "Inactivo"}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid - No icons, just Typography */}
        <section style={{ padding: "160px 0" }}>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <p className="label-stealth">Propuesta de valor</p>
            <h2 style={{ fontSize: "40px", fontWeight: 800, fontFamily: "var(--font-syne)", marginTop: "16px" }}>Diseñado para la eficiencia.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "64px" }}>
            {[
              { t: "Kiosk Mode", d: "Terminal centralizada con acceso por PIN único para cada empleado." },
              { t: "Geofencing", d: "Validación GPS automática. Solo fichajes dentro del radio de la empresa." },
              { t: "Reportes One-Click", d: "Exportación de nómina y horas extras en segundos. Sin fricción." },
              { t: "Sin Suscripción", d: "Paga $49 una vez. Es tuyo para siempre con todas las actualizaciones." },
              { t: "Multi-sucursal", d: "Administra múltiples centros de trabajo desde un solo panel maestro." },
              { t: "Notificaciones", d: "Alertas inmediatas de tardanzas enviadas directamente a tu email." }
            ].map(f => (
              <div key={f.t} style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>{f.t}</h3>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", lineHeight: 1.6 }}>{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing CTA */}
        <section style={{ paddingBottom: "160px" }}>
          <div className="apple-card" style={{ padding: "80px", textAlign: "center", border: `1px solid ${gold}20`, background: `radial-gradient(circle at center, ${gold}08 0%, transparent 70%)` }}>
            <p className="label-stealth" style={{ marginBottom: "24px" }}>Acceso Vitalicio</p>
            <h2 style={{ fontSize: "88px", fontWeight: 800, fontFamily: "var(--font-syne)", letterSpacing: "-4px", lineHeight: 1 }}>$49</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "18px", marginTop: "16px" }}>Paga una vez, úsalo para siempre.</p>
            <div style={{ marginTop: "48px" }}>
              <Link href="/en/register" className="btn-white" style={{ padding: "16px 48px", fontSize: "16px" }}>Empezar 7 días gratis</Link>
            </div>
            <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "12px", marginTop: "24px" }}>No se requiere tarjeta de crédito para el periodo de prueba.</p>
          </div>
        </section>

      </main>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "40px", textAlign: "center" }}>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700 }}>Punchly.Clock — Industrial Security Standards</p>
      </footer>
    </div>
  );
}