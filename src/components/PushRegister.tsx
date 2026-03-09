"use client";
import { useEffect, useState } from "react";

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map(c => c.charCodeAt(0)));
}

export default function PushRegister() {
  const [status, setStatus] = useState<"idle"|"subscribed"|"denied"|"loading">("idle");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    navigator.serviceWorker.register("/sw.js").catch(console.error);
    const saved = localStorage.getItem("punchly-push");
    if (saved === "subscribed") setStatus("subscribed");
  }, []);

  async function subscribe() {
    setStatus("loading");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub }),
      });
      localStorage.setItem("punchly-push", "subscribed");
      setStatus("subscribed");
    } catch (e) {
      setStatus("denied");
    }
  }

  if (status === "subscribed") return (
    <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-xl">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      Notificaciones activas
    </div>
  );

  if (status === "denied") return (
    <p className="text-xs text-red-400">Notificaciones bloqueadas en tu navegador</p>
  );

  return (
    <button onClick={subscribe} disabled={status === "loading"}
      className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border)] px-3 py-2 rounded-xl transition disabled:opacity-50">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      {status === "loading" ? "Activando..." : "Activar notificaciones push"}
    </button>
  );
}