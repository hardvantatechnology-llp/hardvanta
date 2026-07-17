"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import { SORT_OPTIONS } from "@/utils/sortProducts";

export default function SortDropdown({ current = "relevance", searchParams = {}, basePath }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function selectSort(value) {
    setOpen(false);
    const params = new URLSearchParams(searchParams);
    if (value === "relevance") params.delete("sort");
    else params.set("sort", value);
    params.delete("page");
    const qs = params.toString();
    router.push(`${basePath}${qs ? `?${qs}` : ""}`);
  }

  const activeLabel = SORT_OPTIONS.find((o) => o.value === current)?.label || "Relevance";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-medium text-white/80 transition-all hover:text-white hover:shadow-glow-electric"
      >
        <ArrowUpDown size={14} />
        <span className="hidden sm:inline">Sort:</span> {activeLabel}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="glass-strong absolute right-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-2xl p-1.5"
          >
            {SORT_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => selectSort(o.value)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                {o.label}
                {current === o.value && <Check size={14} className="text-electric-light" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
