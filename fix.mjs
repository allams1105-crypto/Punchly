import { writeFileSync } from "fs";

// Update Sidebar to include LangToggle
const sidebar = `"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import LangToggle from "@/components/LangToggle";
import { useLang } from "@/lib/LangContext";
import { useState, useEffect } from "react";

export default function Sidebar({ orgName }: { orgName: string }) {
  const pathname = usePathname();
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/en/admin/dashboard", label: t("sidebar.dashboard"), icon: <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { href: "/en/admin/payroll", label: t("sidebar.payroll"), icon: <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
    { href: "/en/admin/activity", label: t("sidebar.activity"), icon: <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { href: "/en/admin/employees/new", label: t("sidebar.new.employee"), icon: <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> },
    { href: "/en/admin/kiosk", label: t("sidebar.kiosk"), icon: <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> },
    { href: "/en/admin/settings", label: t("sidebar.settings"), icon: <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
  ];

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const NavContent = () => (
    <>
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <p className="text-[var(--text-muted)] text-xs font-semibold uppercase tracking-widest px-3 mb-3 opacity-50">Menu</p>
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href}
              className={\`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium \${active ? "bg-[#E8B84B] text-black font-bold" : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]"}\`}>
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-2 py-3 border-t border-[var(--border)] space-y-1">
        <div className="px-3 py-1 flex items-center gap-2">
          <ThemeToggle />
          <LangToggle />
        </div>
        <a href="/api/auth/signout"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all w-full">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          {t("sidebar.logout")}
        </a>
      </div>
    </>
  );

  return (
    <>
      <div className="hidden md:flex w-60 shrink-0 h-screen flex-col bg-[var(--bg-card)] border-r border-[var(--border)]">
        <div className="px-4 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#E8B84B] rounded-xl flex items-center justify-center shrink-0">
              <span className="text-black font-black text-sm">P</span>
            </div>
            <div>
              <p className="text-[var(--text-primary)] font-black text-sm leading-none">Punchly.Clock</p>
              <p className="text-[var(--text-muted)] text-xs mt-0.5 truncate max-w-[130px]">{orgName}</p>
            </div>
          </div>
        </div>
        <NavContent />
      </div>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[var(--bg-card)] border-b border-[var(--border)] flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#E8B84B] rounded-lg flex items-center justify-center shrink-0">
            <span className="text-black font-black text-xs">P</span>
          </div>
          <p className="text-[var(--text-primary)] font-black text-sm">Punchly.Clock</p>
        </div>
        <button onClick={() => setOpen(true)}
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-72 h-full bg-[var(--bg-card)] border-r border-[var(--border)] flex flex-col">
            <div className="px-4 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#E8B84B] rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-black font-black text-sm">P</span>
                </div>
                <div>
                  <p className="text-[var(--text-primary)] font-black text-sm leading-none">Punchly.Clock</p>
                  <p className="text-[var(--text-muted)] text-xs mt-0.5 truncate max-w-[130px]">{orgName}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <NavContent />
          </div>
        </div>
      )}
      <div className="md:hidden h-14 shrink-0" />
    </>
  );
}`;

writeFileSync("src/components/admin/Sidebar.tsx", sidebar);
console.log("Listo!");

