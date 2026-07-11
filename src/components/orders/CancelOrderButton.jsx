"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

export default function CancelOrderButton({ orderId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  async function handleCancel() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
      if (res.ok) {
        router.push(`/orders/${orderId}?cancelled=1`);
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not cancel order. Call support: +91 91705 46395.");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  if (showConfirm) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-red-600">Cancel this order?</span>
          <button onClick={handleCancel} disabled={loading}
            className="rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors">
            {loading ? "Cancelling..." : "Yes, Cancel"}
          </button>
          <button onClick={() => { setShowConfirm(false); setError(""); }}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-navy hover:bg-gray-50 transition-colors">
            No
          </button>
        </div>
        {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <button onClick={() => setShowConfirm(true)}
      className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors">
      <XCircle size={15} /> Cancel Order
    </button>
  );
}