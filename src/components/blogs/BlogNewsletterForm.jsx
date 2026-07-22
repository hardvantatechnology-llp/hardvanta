"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

// Extracted into its own client component because the page it's used on
// (src/app/blogs/page.js) is an async server component and can't hold the
// state/fetch call a working submit handler needs.
export default function BlogNewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not subscribe. Please try again.");
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Could not subscribe. Please try again.");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mt-3 flex items-center overflow-hidden rounded-lg glass-brand-card">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
          placeholder="Email address"
          aria-label="Email address"
          className="w-full bg-transparent px-3 py-2 text-sm text-brand-text outline-none placeholder:text-brand-muted"
        />
        <button
          type="submit"
          disabled={status === "loading" || !email.trim()}
          className="flex items-center gap-1.5 bg-gradient-to-r from-brand-blue to-brand-navy px-3 py-2 text-xs font-semibold text-white hover:brightness-110 transition-all disabled:opacity-50 disabled:hover:brightness-100"
        >
          {status === "success" ? <Check size={14} /> : <Mail size={14} />}
          {status === "loading" ? "Subscribing…" : status === "success" ? "Subscribed!" : "Subscribe"}
        </button>
      </form>
      {status === "error" && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
