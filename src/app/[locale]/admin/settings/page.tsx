import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/admin/SettingsClient";
import PushRegister from "@/components/PushRegister";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/en/login");
  const orgId = (session.user as any).organizationId;

  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  const gold = "#D4AF37";

  return (
    <div className="flex-1 flex flex-col h-full bg-[#09090b]">
      {/* Header Estilizado */}
      <div className="h-16 border-b border-white/[0.06] px-8 flex items-center justify-between bg-black/20 backdrop-blur-md">
        <div>
          <h1 className="text-sm font-bold text-white tracking-tight font-syne">Configuración</h1>
          <p className="text-[11px] text-white/30 font-dm">Gestiona tu organización y preferencias personales</p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Contenido Principal con Scroll */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-2xl space-y-8 pb-20">
            
            {/* Sección: Notificaciones */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                </div>
                <h2 className="text-sm font-bold text-white uppercase tracking-widest text-[10px] opacity-40">Notificaciones</h2>
              </div>
              
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden transition-all hover:border-white/10">
                <div className="p-6 border-b border-white/[0.05]">
                  <h3 className="text-sm font-bold text-white">Alertas Push</h3>
                  <p className="text-xs text-white/30 mt-1">Recibe avisos de tardanzas y ausencias directamente en tu navegador o móvil.</p>
                </div>
                <div className="p-6 bg-white/[0.01]">
                  <PushRegister />
                </div>
              </div>
            </section>

            {/* Separador sutil */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent my-10" />

            {/* Sección: Organización y Cuenta (SettingsClient) */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <h2 className="text-sm font-bold text-white uppercase tracking-widest text-[10px] opacity-40">General & Empresa</h2>
              </div>
              
              <div className="settings-client-wrapper">
                <SettingsClient 
                  org={{ name: org?.name, alertEmail: (org as any)?.alertEmail }} 
                  user={session.user} 
                />
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        /* Forzar estilos premium al SettingsClient desde fuera */
        .settings-client-wrapper input { 
          background: rgba(255,255,255,0.03) !important; 
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 12px !important;
          color: white !important;
          font-size: 13px !important;
        }
        .settings-client-wrapper button {
          background: ${gold} !important;
          color: black !important;
          font-weight: 700 !important;
          border-radius: 12px !important;
          text-transform: none !important;
          font-size: 13px !important;
          transition: all 0.2s ease !important;
        }
        .settings-client-wrapper button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }
      `}} />
    </div>
  );
}