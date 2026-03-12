import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      

      <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
        {/* Background orbs */}
        <div className="orb w-96 h-96 bg-[#C9A84C]/10 top-0 left-1/4 -translate-x-1/2" style={{position:'fixed'}} />
        <div className="orb w-64 h-64 bg-white/5 bottom-1/4 right-1/4" style={{position:'fixed'}} />
        
        {/* Grid bg */}
        <div className="grid-bg fixed inset-0 pointer-events-none" />

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center glow" style={{background:'linear-gradient(135deg,#C9A84C,#8B6914)'}}>
              <span className="font-syne font-800 text-black text-sm font-extrabold">P</span>
            </div>
            <span className="font-syne font-bold text-white tracking-tight">Punchly.Clock</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/en/login" className="text-sm text-white/50 hover:text-white transition font-medium">Iniciar sesión</Link>
            <Link href="/en/register" className="glass-gold text-[#C9A84C] px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#C9A84C]/15 transition">
              Comenzar gratis
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative z-10 max-w-5xl mx-auto px-8 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs text-white/50 mb-8 fade-up">
            <div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
            7 días gratis — sin tarjeta de crédito
          </div>
          
          <h1 className="font-syne text-6xl md:text-8xl font-extrabold leading-none tracking-tight mb-6 fade-up-2">
            Control de<br />
            <span className="gold-text">asistencia</span><br />
            sin excusas
          </h1>
          
          <p className="text-white/40 text-lg md:text-xl max-w-xl mx-auto mb-10 font-light leading-relaxed fade-up-3">
            Kiosk inteligente con PIN, geofencing desde el móvil y reportes automáticos. Todo por un pago único.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center fade-up-4">
            <Link href="/en/register"
              className="glow font-syne font-bold px-8 py-4 rounded-2xl text-black text-base transition hover:scale-105"
              style={{background:'linear-gradient(135deg,#C9A84C,#F0D080)'}}>
              Empezar 7 días gratis
            </Link>
            <Link href="/en/login"
              className="glass px-8 py-4 rounded-2xl text-white/70 text-base font-medium hover:text-white hover:bg-white/8 transition">
              Ya tengo cuenta
            </Link>
          </div>
        </section>

        {/* Floating kiosk mockup */}
        <section className="relative z-10 max-w-4xl mx-auto px-8 mb-32">
          <div className="float">
            <div className="glass rounded-3xl p-1 glow">
              <div className="bg-[#111] rounded-[20px] overflow-hidden">
                {/* Fake kiosk UI */}
                <div className="bg-[#0D0D0D] px-8 py-6 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-syne text-4xl font-bold text-white">09:41</p>
                      <p className="text-white/30 text-sm mt-1">Jueves, 12 de marzo</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse" />
                      <span className="text-xs text-[#C9A84C] font-medium">3 en turno</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-3 gap-3">
                  {["Ana G.", "Luis M.", "Sofia R.", "Carlos P.", "María J.", "Pedro L."].map((name, i) => (
                    <div key={name} className="glass rounded-2xl p-4 card-3d cursor-pointer">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-syne font-bold text-sm mb-3"
                        style={{background: ['#C9A84C','#60A5FA','#34D399','#F87171','#A78BFA','#FB923C'][i]+'20', color: ['#C9A84C','#60A5FA','#34D399','#F87171','#A78BFA','#FB923C'][i]}}>
                        {name.charAt(0)}
                      </div>
                      <p className="text-xs font-semibold text-white">{name}</p>
                      {i < 3 && <div className="flex items-center gap-1 mt-1"><div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"/><span className="text-xs text-green-400">Activo</span></div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="relative z-10 max-w-5xl mx-auto px-8 mb-32">
          <h2 className="font-syne text-4xl font-bold text-center mb-3">Todo lo que necesitas</h2>
          <p className="text-white/30 text-center mb-12 text-sm">Sin suscripciones. Sin límites artificiales.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Kiosk con PIN", desc: "Tablet en la entrada. Cada empleado tiene su PIN único. Nadie puede fichar por otro." },
              { title: "Geofencing", desc: "Desde el móvil. El empleado solo puede fichar si está dentro del radio configurado." },
              { title: "Alertas de tardanza", desc: "Email automático al admin cuando alguien llega tarde. En tiempo real." },
              { title: "Nómina automática", desc: "Cálculo quincenal con horas normales y extras. Exporta a CSV o PDF." },
              { title: "Multi-empresa", desc: "Cada cliente tiene su propio espacio aislado con sus empleados y datos." },
              { title: "Pago único $49", desc: "Sin mensualidades. Paga una vez, usa para siempre. Actualizaciones incluidas." },
            ].map((f, i) => (
              <div key={f.title} className="glass rounded-2xl p-6 card-3d" style={{animationDelay: i*0.1+'s'}}>
                <div className="w-8 h-8 glass-gold rounded-xl mb-4" />
                <h3 className="font-syne font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="relative z-10 max-w-md mx-auto px-8 mb-32 text-center">
          <div className="glass rounded-3xl p-8 glow">
            <p className="text-white/40 text-sm mb-2 font-syne uppercase tracking-widest">Precio único</p>
            <div className="flex items-end justify-center gap-2 mb-4">
              <span className="font-syne text-7xl font-extrabold gold-text">$49</span>
              <span className="text-white/30 mb-3">para siempre</span>
            </div>
            <ul className="text-sm text-white/50 space-y-2 mb-8 text-left">
              {["Empleados ilimitados","Kiosk con PIN","Geofencing móvil","Alertas por email","Nómina automática","Soporte incluido"].map(f => (
                <li key={f} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/en/register"
              className="block w-full py-4 rounded-2xl font-syne font-bold text-black transition hover:scale-105 glow"
              style={{background:'linear-gradient(135deg,#C9A84C,#F0D080)'}}>
              Comenzar 7 días gratis
            </Link>
            <p className="text-xs text-white/20 mt-3">Sin tarjeta requerida durante el trial</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/5 py-8 text-center">
          <p className="text-white/20 text-xs">Punchly.Clock — Control de asistencia profesional</p>
        </footer>
      </div>
    </>
  );
}