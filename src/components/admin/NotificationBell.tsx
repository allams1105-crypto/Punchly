"use client";
import { useState, useEffect, useRef } from "react";

type Notification = {
  id: string;
  userName: string;
  action: string;
  details: string;
  createdAt: string;
};

export default function NotificationBell({ orgId }: { orgId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [lastCheck, setLastCheck] = useState(new Date().toISOString());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    async function fetchNotifs() {
      try {
        const res = await fetch(`/api/activity?limit=10`);
        const data = await res.json();
        const logs = data.logs || [];
        const recent = logs.filter((l: any) =>
          ["CLOCK_IN", "CLOCK_OUT"].includes(l.action) &&
          new Date(l.createdAt) > new Date(lastCheck)
        );
        if (recent.length > 0) {
          setNotifications(prev => [...recent, ...prev].slice(0, 20));
          setUnread(prev => prev + recent.length);
          setLastCheck(new Date().toISOString());
        }
      } catch (e) {}
    }

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [lastCheck]);

  function handleOpen() {
    setOpen(!open);
    if (!open) setUnread(0);
  }

  const actionLabel: Record<string, { label: string; color: string }> = {
    CLOCK_IN: { label: "Entró", color: "text-green-400" },
    CLOCK_OUT: { label: "Salió", color: "text-blue-400" },
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={handleOpen}
        className="relative p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#E8B84B] text-black text-xs font-black rounded-full flex items-center justify-center leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Notificaciones</h3>
            {notifications.length > 0 && (
              <button onClick={() => setNotifications([])} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                Limpiar
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border)]">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <svg className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <p className="text-xs text-[var(--text-muted)]">Sin notificaciones nuevas</p>
              </div>
            ) : notifications.map((n) => {
              const action = actionLabel[n.action] || { label: n.action, color: "text-[var(--text-muted)]" };
              const date = new Date(n.createdAt);
              const mins = Math.floor((Date.now() - date.getTime()) / 60000);
              const timeAgo = mins < 1 ? "ahora" : mins < 60 ? `${mins}m` : `${Math.floor(mins/60)}h`;
              return (
                <div key={n.id} className="px-4 py-3 hover:bg-[var(--border)]/20 transition">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-semibold text-[var(--text-primary)]">{n.userName}</p>
                    <p className="text-xs text-[var(--text-muted)]">{timeAgo}</p>
                  </div>
                  <p className={`text-xs ${action.color}`}>{action.label} · {n.details}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}