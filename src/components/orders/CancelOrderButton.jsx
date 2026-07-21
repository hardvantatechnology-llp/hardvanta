"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/ui/Toast";

export default function CancelOrderButton({ orderId }) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  async function handleCancel() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
      if (res.ok) {
        toast.success("Order cancelled successfully.");
        router.push(`/orders/${orderId}?cancelled=1`);
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      const message = data.error || "Could not cancel order. Call support: +91 91705 46395.";
      setError(message);
      toast.error(message);
    } catch {
      const message = "Something went wrong. Please try again.";
      setError(message);
      toast.error(message);
    }
    setLoading(false);
  }

  return (
    <>
      <button onClick={() => setShowConfirm(true)}
        className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors">
        <XCircle size={15} /> Cancel Order
      </button>

      <ConfirmModal
        open={showConfirm}
        onClose={() => { setShowConfirm(false); setError(""); }}
        onConfirm={handleCancel}
        loading={loading}
        error={error}
        title="Cancel this order?"
        description="This can't be undone. Your stock reservation will be released."
        confirmLabel="Yes, Cancel Order"
        cancelLabel="Keep Order"
      />
    </>
  );
}
