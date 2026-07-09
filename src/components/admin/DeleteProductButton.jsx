"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteProductButton({ id, name }) {
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        window.location.href = "/admin/products";
      } else {
        alert(data.error || "Could not delete product.");
        setBusy(false);
      }
    } catch (err) {
      alert("Network error. Please try again.");
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      className="text-silver-dark hover:text-red-500 disabled:opacity-50 transition-colors"
      aria-label="Delete"
      title={`Delete ${name}`}
    >
      {busy ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-silver border-t-red-500" />
      ) : (
        <Trash2 size={16} />
      )}
    </button>
  );
}