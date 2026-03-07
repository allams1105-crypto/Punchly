import { writeFileSync } from "fs";

const content = `"use client";
import { useState } from "react";

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="bg-gradient-to-r from-violet-600 to-blue-500 text-white text-xs px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 font-medium"
    >
      {loading ? "..." : "Upgrade Pro"}
    </button>
  );
}`;

writeFileSync("src/components/admin/UpgradeButton.tsx", content);
console.log("Listo!");

