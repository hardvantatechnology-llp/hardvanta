"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

/** Debounced search box that drives a `?q=` search param, preserving other params. */
export default function AdminSearchInput({ placeholder = "Search…", basePath, searchParams = {} }) {
  const router = useRouter();
  const [value, setValue] = useState(searchParams?.q || "");
  const timer = useRef(null);

  useEffect(() => {
    setValue(searchParams?.q || "");
  }, [searchParams?.q]);

  function push(next) {
    const params = new URLSearchParams(searchParams);
    if (next) params.set("q", next);
    else params.delete("q");
    params.delete("page");
    const qs = params.toString();
    router.push(`${basePath}${qs ? `?${qs}` : ""}`);
  }

  function handleChange(e) {
    const next = e.target.value;
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => push(next), 400);
  }

  function clear() {
    clearTimeout(timer.current);
    setValue("");
    push("");
  }

  return (
    <div className="relative w-full max-w-sm">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
      <input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-lg glass-card pl-9 pr-8 py-2 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30"
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
