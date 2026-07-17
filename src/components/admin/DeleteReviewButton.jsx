"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteReviewButton({ id, onDelete }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleDelete() {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    setError("");
    startTransition(async () => {
      try {
        await onDelete(id);
      } catch (err) {
        setError(err?.message || "Could not delete review.");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="flex items-center gap-1 font-semibold text-red-600 hover:underline disabled:opacity-60"
      >
        {pending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
        Delete
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
