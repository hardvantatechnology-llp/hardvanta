"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareButton({ title, className = "" }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled or share failed — fall through to clipboard copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — silently no-op
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share this product"
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg glass-brand-card text-brand-muted transition-all hover:shadow-brand-glow ${className}`}
    >
      {copied ? <Check size={18} className="text-brand-blue" /> : <Share2 size={18} />}
    </button>
  );
}
