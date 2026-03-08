import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="border-b border-white/8 px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-black/95 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#E8B84B] rounded-xl flex items-center justify-center">
            <span className="text-black font-black text-sm">P</span>
          </div>
          <span className="text-white font-black text-lg">Punchly.Clock</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/en/login" className="text-sm text-white/50 hover:text-white transition font-medium">
            Iniciar sesión
          </Link>
          <Link href="/en/register"
            className="bg-[#E8B84B] text-black text-sm px-4 py-2 rounded-xl font-black hover:bg-[#d4a43a] transition">
            Prueba gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-[#E8B84B]/10 border border-[#E8B84B]/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 bg-[#E8B84B] rounded-full"></span>
          <span className="text-[#E8B84B] text-xs font-semibold">Control de asistencia, simplificado</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
          Saber quién está<br />
          trabajando,{" "}
          <span className="text-[#E8B84B]">ahora mismo.</span>
        </h1>
        <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Punchly.Clock ayuda a pequeños negocios a registrar horas, gestionar nómina y usar check-ins por kiosk — todo en un lugar.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/en/register"
            className="bg-[#E8B84B] text-black px-8 py-3.5 rounded-2xl font-black text-base hover:bg-[#d4a43a] transition w-full sm:w-auto text-center">
            14 días gratis, sin tarjeta →
          </Link>
          <Link href="/en/login"
            className="border border-white/10 text-white/70 px-8 py-3.5 rounded-2xl font-medium text-base hover:border-white/30 hover:text-white transition w-full sm:w-auto text-center">
            Iniciar sesión
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/8 py-12 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-black text-[#E8B84B]">100%</p>
            <p className="text-white/40 text-sm mt-1">En la nube</p>
          </div>
          <div>
            <p className="text-4xl font-black text-[#E8B84B]">24/7</p>
            <p className="text-white/40 text-sm mt-1">Disponible</p>
          </div>
          <div>
            <p className="text-4xl font-black text-[#E8B84B]">∞</p>
            <p className="text-white/40 text-sm mt-1">Empleados</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-12">Todo lo que necesitas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/8 rounded-2xl p-6 hover:border-[#E8B84B]/30 transition">
            <div className="w-10 h-10 bg-[#E8B84B]/15 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3 className="font-black text-white mb-2">Control de horas</h3>
            <p className="text-white/40 text-sm">Registra entradas y salidas en tiempo real desde cualquier dispositivo.</p>
          </div>
          <div className="bg-white/5 border border-white/8 rounded-2xl p-6 hover:border-[#E8B84B]/30 transition">
            <div className="w-10 h-10 bg-[#E8B84B]/15 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </div>
            <h3 className="font-black text-white mb-2">Nómina automática</h3>
            <p className="text-white/40 text-sm">Calcula pagos quincenales con horas regulares y extras automáticamente.</p>
          </div>
          <div className="bg-[#E8B84B]/5 border border-[#E8B84B]/20 rounded-2xl p-6">
            <div className="w-10 h-10 bg-[#E8B84B]/15 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            </div>
            <h3 className="font-black text-white mb-2">Modo Kiosk</h3>
            <p className="text-white/40 text-sm">Instala un tablet en tu oficina para que los empleados fichen con PIN.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto bg-[#E8B84B] rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-black mb-4">Empieza hoy gratis</h2>
          <p className="text-black/60 mb-8">Sin tarjeta de crédito. Sin contrato. Cancela cuando quieras.</p>
          <Link href="/en/register"
            className="bg-black text-white px-8 py-3.5 rounded-2xl font-black text-base hover:bg-black/80 transition inline-block">
            Crear cuenta gratis →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 px-6 py-8 text-center">
        <p className="text-white/20 text-sm">© 2026 Punchly.Clock · Todos los derechos reservados</p>
      </footer>
    </div>
  );
}