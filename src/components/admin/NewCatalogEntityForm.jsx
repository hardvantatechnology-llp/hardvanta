"use client";

import { useState, useRef, useTransition } from "react";
import { Plus } from "lucide-react";

/** Quick "add category / add brand" form driven by a bound Server Action. */
export default function NewCatalogEntityForm({ label, onCreate }) {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const formRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const fd = new FormData(formRef.current);
    if (!String(fd.get("name") || "").trim()) {
      setError("Name is required.");
      return;
    }
    startTransition(async () => {
      try {
        await onCreate(fd);
        formRef.current?.reset();
      } catch (err) {
        setError(err?.message || "Could not create.");
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex items-start gap-2">
      <div>
        <input
          name="name"
          placeholder={`New ${label} name`}
          className="rounded-lg border border-silver-dark px-3 py-2 text-sm outline-none focus:border-royal"
          disabled={pending}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg bg-royal px-4 py-2 text-sm font-semibold text-white hover:bg-royal-dark disabled:opacity-60"
      >
        <Plus size={16} /> {pending ? "Adding…" : `Add ${label}`}
      </button>
    </form>
  );
}
