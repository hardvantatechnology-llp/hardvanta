"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

export default function CancelOrderButton({ orderId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleCancel() {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
      if (res.ok) {
        router.push(`/orders/${orderId}?cancelled=1`);
        router.refresh();
      } else {
        const data = await res.json();
alert(data.error || "Could not cancel order. Please contact support.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
    setShowConfirm(false);
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5">
        <span className="text-sm font-medium text-red-600">Cancel this order?</span>
        <button onClick={handleCancel} disabled={loading}
          className="rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors">
          {loading ? "Cancelling..." : "Yes, Cancel"}
        </button>
        <button onClick={() => setShowConfirm(false)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-navy hover:bg-gray-50 transition-colors">
          No
        </button>
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