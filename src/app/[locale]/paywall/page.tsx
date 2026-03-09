import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import UpgradeButton from "@/components/admin/UpgradeButton";

export default async function PaywallPage() {
  const session = await auth();
  if (!session) redirect("/en/login");

  const orgId = (session.user as any).organizationId;
  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  if (org?.isPro) redirect("/en/admin/dashboard");

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 justify-center mb-10">
          <div className="w-10 h-10 bg-[#E8B84B] rounded-2xl flex items-center justify-center">
            <span className="text-black font-black text-lg">P</span>
          </div>
          <span className="text-white font-black text-xl">Punchly.Clock</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#E8B84B]/10 border border-[#E8B84B]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h1 className="text-2xl font-black text-white mb-2">Tu prueba ha terminado</h1>
            <p className="text-white/50 text-sm">Activa tu licencia para seguir usando Punchly.Clock sin límites.</p>
          </div>
          <div className="space-y-3 mb-8">
            {["Control de asistencia ilimitado","Nómina quincenal automática","Kiosk para tablets","Reportes por email","Acceso de por vida — sin mensualidades"].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-[#E8B84B]/15 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className="text-sm text-white/80">{f}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#E8B84B]/5 border border-[#E8B84B]/15 rounded-2xl p-4 mb-6 text-center">
            <p className="text-white/50 text-xs mb-1">Precio único, sin sorpresas</p>
            <p className="text-4xl font-black text-[#E8B84B]">$49</p>
            <p className="text-white/40 text-xs mt-1">pago único · acceso de por vida</p>
          </div>
          <UpgradeButton variant="full" />
          <p className="text-center text-xs text-white/30 mt-4">Pago seguro con Stripe · Sin suscripciones</p>
        </div>
        <div className="text-center mt-6">
          <a href="/api/auth/signout" className="text-xs text-white/20 hover:text-white/40 transition">Cerrar sesión</a>
        </div>
      </div>
    </div>
  );
}