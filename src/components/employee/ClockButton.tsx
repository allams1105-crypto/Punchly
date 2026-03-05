"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  isActive: boolean;
  entryId?: string;
  clockInTime?: string;
}

export default function ClockButton({ isActive, entryId, clockInTime }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState("");

  // Timer en vivo
  useEffect(() => {
    if (!isActive || !clockInTime) return;

    const update = () => {
      const diff = new Date().getTime() - new Date(clockInTime).getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setElapsed(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [isActive, clockInTime]);

  async function handleClock() {
    setLoading(true);

    const res = await fetch("/api/clock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: isActive ? "out" : "in",
        entryId,
      }),
    });

    if (res.ok) {
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {isActive && elapsed && (
        <div className="text-4xl font-mono font-bold text-gray-900">
          {elapsed}
        </div>
      )}

      <button
        onClick={handleClock}
        disabled={loading}
        className={`w-48 h-48 rounded-full text-white text-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
          isActive
            ? "bg-red-500 hover:bg-red-600"
            : "bg-black hover:bg-gray-800"
        }`}
      >
        {loading ? "..." : isActive ? "Clock Out" : "Clock In"}
      </button>
    </div>
  );
}