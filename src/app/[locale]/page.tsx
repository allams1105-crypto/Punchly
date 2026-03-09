import Link from "next/link";

export default function LandingPage() {
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
          <Link href="/en/login" className="text-sm text-white/50 hover:text-white transition font-medium hidden sm:block">
            Iniciar sesión
          </Link>
          <Link href="/en/register" className="bg-[#E8B84B] text-black text-sm px-4 py-2 rounded-xl font-black hover:bg-[#d4a43a] transition">
            Prueba gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 md:py-32 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/60 mb-8">
          <span className="w-1.5 h-1.5 bg-[#E8B84B] rounded-full"></span>
          Control de asistencia, simplificado
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-[0.95] mb-6">
          Saber quién está<br />trabajando,{" "}
          <span className="text-[#E8B84B]">ahora mismo.</span>
        </h1>
        <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Punchly.Clock ayuda a pequeños negocios a registrar horas, gestionar nómina y usar check-ins por kiosk — todo en un lugar.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/en/register"
            className="bg-[#E8B84B] text-black px-8 py-4 rounded-2xl font-black text-base hover:bg-[#d4a43a] transition">
            7 días gratis →
          </Link>
          <Link href="#precios"
            className="border border-white/15 text-white/70 px-8 py-4 rounded-2xl font-semibold text-base hover:border-white/30 hover:text-white transition">
            Ver precios
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/8 px-6 py-10">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-black text-[#E8B84B]">7</p>
            <p className="text-white/40 text-sm mt-1">Días gratis</p>
          </div>
          <div>
            <p className="text-3xl font-black text-[#E8B84B]">∞</p>
            <p className="text-white/40 text-sm mt-1">Empleados</p>
          </div>
          <div>
            <p className="text-3xl font-black text-[#E8B84B]">$49</p>
            <p className="text-white/40 text-sm mt-1">Pago único</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-12">Todo lo que necesitas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: <svg className="w-5 h-5 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 7"/></svg>, title: "Control de horas", desc: "Registra entradas y salidas en tiempo real desde cualquier dispositivo." },
            { icon: <svg className="w-5 h-5 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="7" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>, title: "Nómina automática", desc: "Calcula pagos quincenales con horas regulares y extras automáticamente." },
            { icon: <svg className="w-5 h-5 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="5" y="2" width="7" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>, title: "Modo Kiosk", desc: "Instala un tablet en tu oficina para que los empleados fichen con PIN." },
            { icon: <svg className="w-5 h-5 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, title: "Actividad en tiempo real", desc: "Ve quién está trabajando ahora mismo sin necesidad de recargar." },
            { icon: <svg className="w-5 h-5 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, title: "Reportes por email", desc: "Recibe el resumen quincenal de horas y nómina directo en tu correo." },
            { icon: <svg className="w-5 h-5 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: "Licencia de por vida", desc: "Un solo pago, sin mensualidades, sin sorpresas. Tuyo para siempre." },
          ].map(f => (
            <div key={f.title} className="bg-white/5 border border-white/8 rounded-2xl p-6 hover:border-[#E8B84B]/30 transition">
              <div className="w-10 h-10 bg-[#E8B84B]/15 rounded-xl flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-black text-white mb-2">{f.title}</h3>
              <p className="text-white/40 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="precios" className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-3">Precio simple, sin sorpresas</h2>
          <p className="text-white/40">Sin mensualidades. Sin contratos. Un pago y es tuyo para siempre.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free trial */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Prueba gratis</p>
            <p className="text-5xl font-black text-white mb-1">$0</p>
            <p className="text-white/40 text-sm mb-8">7 días · sin tarjeta</p>
            <div className="space-y-3 mb-8">
              {["Todos los features incluidos","Empleados ilimitados","Kiosk incluido","Nómina automática"].map(f => (
                <div key={f} className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-white/30 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  <p className="text-sm text-white/60">{f}</p>
                </div>
              ))}
            </div>
            <Link href="/en/register"
              className="block w-full border border-white/15 text-white text-center py-3.5 rounded-2xl font-black hover:border-white/30 transition text-sm">
              Empezar gratis →
            </Link>
          </div>

          {/* License */}
          <div className="bg-[#E8B84B] rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-black/15 text-black text-xs font-black px-3 py-1 rounded-full">Más popular</div>
            <p className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-4">Licencia completa</p>
            <p className="text-5xl font-black text-black mb-1">$49</p>
            <p className="text-black/50 text-sm mb-8">pago único de por vida</p>
            <div className="space-y-3 mb-8">
              {["Todo lo del plan gratis","Acceso de por vida","Sin mensualidades","Soporte incluido","Actualizaciones gratis"].map(f => (
                <div key={f} className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-black/60 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  <p className="text-sm text-black/80 font-medium">{f}</p>
                </div>
              ))}
            </div>
            <Link href="/en/register"
              className="block w-full bg-black text-white text-center py-3.5 rounded-2xl font-black hover:bg-black/80 transition text-sm">
              Obtener licencia →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto bg-[#E8B84B] rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-black mb-4">Empieza hoy gratis</h2>
          <p className="text-black/60 mb-8">7 días gratis. Luego solo $49 una vez.</p>
          <Link href="/en/register"
            className="bg-black text-white px-8 py-3.5 rounded-2xl font-black text-base hover:bg-black/80 transition inline-block">
            Crear cuenta gratis →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 bg-[#E8B84B] rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-xs">P</span>
          </div>
          <span className="text-white/60 font-bold text-sm">Punchly.Clock</span>
        </div>
        <p className="text-white/20 text-xs">© 2026 Punchly.Clock · Todos los derechos reservados</p>
      </footer>
    </div>
  );
}