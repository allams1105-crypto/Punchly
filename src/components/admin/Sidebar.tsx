"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/en/admin/dashboard", label: "Dashboard" },
  { href: "/en/admin/payroll", label: "Nomina" },
  { href: "/en/admin/activity", label: "Actividad" },
  { href: "/en/admin/employees/new", label: "Nuevo Empleado" },
  { href: "/en/admin/kiosk", label: "Kiosk" },
  { href: "/en/admin/settings", label: "Settings" },
];

export default function Sidebar({ orgName }: { orgName: string }) {
  const pathname = usePathname();

  return (
    <div className="w-56 shrink-0 h-screen sticky top-0 flex flex-col bg-[var(--bg-card)] border-r border-[var(--border)]">
      <div className="px-5 py-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#E8B84B] rounded-xl flex items-center justify-center">
            <span className="text-black font-black text-sm">P</span>
          </div>
          <div>
            <p className="text-[var(--text-primary)] font-black text-sm">Punchly.Clock</p>
            <p className="text-[var(--text-muted)] text-xs truncate max-w-[120px]">{orgName}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map((link) => (
          <Link key={link.href} href={link.href}
            className={pathname === link.href
              ? "flex items-center px-3 py-2.5 rounded-xl text-sm font-bold bg-[#E8B84B] text-black"
              : "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]"}>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-[var(--border)]">
        <a href="/api/auth/signout"
          className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 w-full">
          Salir
        </a>
      </div>
    </div>
  );
}
