"use client";

// FILE: src/components/layout/SearchBar.jsx
//
// Drop-in replacement for the <form> search in Navbar.jsx
// Behaviour:
//   • Click the trigger bar  → full-screen Flipkart-style overlay opens
//   • Type                   → live suggestions from /api/products?q=
//   • Enter / "Search" btn   → navigates to /search?q=<term>
//   • Escape / backdrop click → closes overlay
//
// Requires: lucide-react (already installed), next/navigation, Tailwind (all
//           colour tokens match the rest of Hardvanta — navy, royal, silver-*, cloud)

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, TrendingUp, Clock } from "lucide-react";

// ─── Static trending terms (update as you like) ──────────────────────────────
const TRENDING = [
  "Arduino Uno",
  "ESP32",
  "Raspberry Pi 4",
  "HC-SR04 Ultrasonic Sensor",
  "NEMA 17 Stepper Motor",
  "16x2 LCD Display",
  "NRF24L01 Wireless Module",
  "LiPo Battery",
];

const RECENT_KEY = "hv_recent_searches";

// Escape HTML entities so untrusted text (product/brand names) can never be
// interpreted as markup when injected via dangerouslySetInnerHTML.
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

export default function SearchBar() {
  const router = useRouter();
  const inputRef  = useRef(null);
  const panelRef  = useRef(null);

  const [isOpen,      setIsOpen]      = useState(false);
  const [query,       setQuery]       = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recent,      setRecent]      = useState([]);
  const [loading,     setLoading]     = useState(false);

  // ── Load recent searches ──────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      setRecent(saved.slice(0, 5));
    } catch { /* ignore */ }
  }, []);

  const saveRecent = useCallback((term) => {
    try {
      const prev    = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      const updated = [term, ...prev.filter((s) => s !== term)].slice(0, 5);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      setRecent(updated);
    } catch { /* ignore */ }
  }, []);

  // ── Fetch live suggestions from your existing API ─────────────────────────
  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return; }

    const controller = new AbortController();
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const res  = await fetch(
          `/api/products?q=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        const hits = (data.products || []).slice(0, 7).map((p) => ({
          label: p.name,
          sub:   p.brand?.name || p.category?.name || "",
          id:    p.id,
        }));
        setSuggestions(hits);
      } catch (e) {
        if (e.name !== "AbortError") setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 220); // 220 ms debounce

    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);

  // ── Open / close helpers ─────────────────────────────────────────────────
  const openOverlay = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 60);
  };

  const closeOverlay = () => {
    setIsOpen(false);
    setQuery("");
    setSuggestions([]);
  };

  // ── Navigate to search results page ──────────────────────────────────────
  const doSearch = useCallback((term) => {
    const q = (term ?? query).trim();
    if (!q) return;
    saveRecent(q);
    closeOverlay();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }, [query, router, saveRecent]); // eslint-disable-line

  // ── Keyboard ──────────────────────────────────────────────────────────────
  const onKeyDown = (e) => {
    if (e.key === "Enter")  doSearch();
    if (e.key === "Escape") closeOverlay();
  };

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) closeOverlay();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]); // eslint-disable-line

  // ── Lock body scroll while overlay is open ────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const showEmpty = isOpen && !query.trim();
  const showHits  = isOpen && query.trim().length > 0;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ══════════════════════════════════════════════════
          TRIGGER BAR — sits exactly where the old <form> was.
          Copy the same Tailwind classes Navbar uses for its search bar.
         ══════════════════════════════════════════════════ */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Open search"
        onClick={openOverlay}
        onKeyDown={(e) => e.key === "Enter" && openOverlay()}
        className="flex w-full min-w-0 items-center overflow-hidden rounded-full border border-silver bg-white shadow-sm hover:border-royal hover:ring-2 hover:ring-royal/20 cursor-text select-none transition-all duration-200"
      >
        <span className="pl-3 md:pl-4 text-silver-dark"><Search size={17} /></span>
        <span className="flex-1 truncate px-2 py-2 text-sm text-silver-dark md:px-3">
  Search for Products...
</span>
        <span className="m-1 rounded-full bg-royal px-3 py-2 text-sm font-semibold text-white md:px-5">
          <Search size={16} className="md:hidden" />
          <span className="hidden md:inline">Search</span>
        </span>
      </div>

      {/* ══════════════════════════════════════════════════
          FULL-SCREEN OVERLAY
         ══════════════════════════════════════════════════ */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col">

          {/* Backdrop */}
          <div className="absolute inset-0 bg-navy/50 backdrop-blur-[2px]" />

          {/* Panel */}
          <div
            ref={panelRef}
            className="relative z-10 w-full bg-white shadow-2xl"
          >
            {/* ── Input row (royal bg, like Flipkart) ── */}
            <div className="flex items-center gap-2 bg-royal px-3 py-3 md:px-6">
              <Search size={18} className="shrink-0 text-white" />

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search for products, brands and more"
                autoComplete="off"
                spellCheck={false}
                className="flex-1 bg-transparent text-base text-white placeholder:text-white/60 outline-none"
              />

              {/* Clear button */}
              {query && (
                <button
                  onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                  aria-label="Clear"
                  className="rounded-full p-1 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              )}

              {/* Search button */}
              <button
                onClick={() => doSearch()}
                className="rounded-md bg-white px-4 py-1.5 text-sm font-bold text-royal
                           hover:bg-cloud transition-colors whitespace-nowrap"
              >
                Search
              </button>

              {/* Close */}
              <button
                onClick={closeOverlay}
                aria-label="Close search"
                className="ml-1 rounded-full p-1 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* ── Dropdown ── */}
            <div className="max-h-[70vh] overflow-y-auto overscroll-contain bg-white">

              {/* Loading shimmer */}
              {loading && (
                <div className="flex items-center gap-3 px-5 py-4 text-sm text-silver-dark animate-pulse">
                  <Search size={14} /> Searching…
                </div>
              )}

              {/* Live suggestions */}
              {showHits && !loading && suggestions.length > 0 && (
                <ul>
                  {suggestions.map((s, i) => (
                    <li key={i}>
                      <button
                        onClick={() => doSearch(s.label)}
                        className="flex w-full items-center gap-3 px-5 py-3 text-left
                                   hover:bg-cloud transition-colors"
                      >
                        <Search size={14} className="shrink-0 text-silver-dark" />
                        <div className="flex flex-col">
                          {/* Bold the matched part */}
                          <span
                            className="text-sm text-navy"
                            dangerouslySetInnerHTML={{
                              __html: escapeHtml(s.label).replace(
                                new RegExp(`(${escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"),
                                "<strong class='text-royal'>$1</strong>"
                              ),
                            }}
                          />
                          {s.sub && (
                            <span className="text-xs text-silver-dark">
                              in {s.sub}
                            </span>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}

                  {/* "See all results" footer */}
                  <li className="border-t border-silver-light">
                    <button
                      onClick={() => doSearch()}
                      className="flex w-full items-center gap-2 px-5 py-3 text-sm font-semibold
                                 text-royal hover:bg-cloud transition-colors"
                    >
                      <Search size={14} />
                      See all results for &quot;{query}&quot;
                    </button>
                  </li>
                </ul>
              )}

              {/* No results */}
              {showHits && !loading && suggestions.length === 0 && (
                <div className="px-5 py-6 text-center text-sm text-silver-dark">
                  No products found for &quot;<span className="font-semibold text-navy">{query}</span>&quot;
                  <button
                    onClick={() => doSearch()}
                    className="mt-3 block w-full rounded-xl border border-silver-light py-2.5
                               text-sm font-semibold text-royal hover:bg-cloud transition-colors"
                  >
                    Search anyway
                  </button>
                </div>
              )}

              {/* Empty state: recent + trending */}
              {showEmpty && (
                <>
                  {/* Recent searches */}
                  {recent.length > 0 && (
                    <div>
                      <p className="flex items-center gap-1.5 px-5 pt-4 pb-2 text-[11px] font-bold
                                    uppercase tracking-wider text-silver-dark">
                        <Clock size={12} /> Recent Searches
                      </p>
                      <ul>
                        {recent.map((r, i) => (
                          <li key={i}>
                            <button
                              onClick={() => doSearch(r)}
                              className="flex w-full items-center gap-3 px-5 py-2.5 text-left
                                         hover:bg-cloud transition-colors"
                            >
                              <Clock size={14} className="shrink-0 text-silver-dark" />
                              <span className="text-sm text-navy">{r}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Trending */}
                  <div>
                    <p className="flex items-center gap-1.5 px-5 pt-4 pb-2 text-[11px] font-bold
                                  uppercase tracking-wider text-silver-dark">
                      <TrendingUp size={12} /> Trending Searches
                    </p>
                    <ul className="pb-4">
                      {TRENDING.map((t, i) => (
                        <li key={i}>
                          <button
                            onClick={() => doSearch(t)}
                            className="flex w-full items-center gap-3 px-5 py-2.5 text-left
                                       hover:bg-cloud transition-colors"
                          >
                            <TrendingUp size={14} className="shrink-0 text-royal" />
                            <span className="text-sm text-navy">{t}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}