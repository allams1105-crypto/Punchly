"use client";
import { useState } from "react";

export default function SettingsClient({ org, user }: any) {
  const [activeTab, setActiveTab] = useState("general");
  const gold = "#D4AF37";

  const tabs = [
    { id: "general", label: "General" },
    { id: "geofencing", label: "Geofencing" },
    { id: "security", label: "Seguridad" },
    { id: "plan", label: "Plan & Licencia" },
  ];

  return (
    <div className="space-y-8">
      {/* Navbar de Settings */}
      <div className="flex gap-2 p-1 bg-[#0A0A0A] border border-white/5 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === tab.id 
              ? "bg-white text-black" 
              : "text-white/40 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido Dinámico */}
      <div className="apple-card p-8">
        {activeTab === "general" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold font-syne">Organización</h3>
            <div className="space-y-4">
              <div>
                <label className="stat-label">Nombre de la empresa</label>
                <input type="text" className="input-stealth" defaultValue={org.name} />
              </div>
              <div>
                <label className="stat-label">Email de alertas</label>
                <input type="email" className="input-stealth" defaultValue={org.alertEmail} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "geofencing" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold font-syne">Geofencing</h3>
            <p className="text-xs text-white/30">Restringe el fichaje al radio de la empresa.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="stat-label">Latitud</label>
                <input type="text" className="input-stealth" placeholder="18.4861" />
              </div>
              <div>
                <label className="stat-label">Longitud</label>
                <input type="text" className="input-stealth" placeholder="-69.9312" />
              </div>
            </div>
            <button className="btn-white w-full">Detectar mi ubicación</button>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold font-syne">Seguridad</h3>
            <div className="space-y-4">
              <input type="password" title="current" className="input-stealth" placeholder="Contraseña actual" />
              <input type="password" title="new" className="input-stealth" placeholder="Nueva contraseña" />
              <button className="btn-white w-full">Actualizar Password</button>
            </div>
          </div>
        )}

        {activeTab === "plan" && (
          <div className="space-y-6 text-center py-4">
            <h3 className="text-lg font-bold font-syne">Tu Licencia</h3>
            <div className="p-6 border border-[#D4AF37]/20 bg-[#D4AF37]/5 rounded-2xl">
              <p className="text-sm font-medium mb-4">Activa Punchly.Clock de por vida</p>
              <p className="text-4xl font-black font-syne text-[#D4AF37]">$49</p>
              <p className="text-[10px] text-white/20 mt-2 uppercase tracking-widest">Un solo pago · Sin suscripciones</p>
            </div>
            <button className="btn-white w-full py-4 !bg-[#D4AF37]">Activar Ahora</button>
          </div>
        )}
      </div>

      <style jsx>{`
        .input-stealth {
          width: 100%;
          background: #050505;
          border: 1px solid rgba(255,255,255,0.05);
          padding: 12px;
          border-radius: 12px;
          color: white;
          font-size: 14px;
          outline: none;
        }
        .input-stealth:focus {
          border-color: ${gold};
        }
      `}</style>
    </div>
  );
}