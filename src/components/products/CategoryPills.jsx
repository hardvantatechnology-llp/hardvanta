"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const VISIBLE_COUNT = 4;

export default function CategoryPills({ categories, activeCat }) {
  const [expanded, setExpanded] = useState(false);
  const panelRef = useRef(null);

  const visibleCats = categories.slice(0, VISIBLE_COUNT);
  const extraCats = categories.slice(VISIBLE_COUNT);

  const pillClass = (isActive) =>
    `shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
      isActive
        ? "bg-gradient-to-r from-brand-blue to-brand-navy text-white shadow-brand-glow"
        : "glass-brand text-brand-muted hover:text-brand-text hover:shadow-brand-glow"
    }`;

  return (
    <div className="mb-8">
      {/* Scrollable row: All + first few categories */}
      <div
        className="flex gap-2 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <Link href="/products" className={pillClass(!activeCat)}>
          All
        </Link>
        {visibleCats.map((c) => (
          <Link
            key={c.slug}
            href={`/products?category=${c.slug}`}
            className={pillClass(activeCat === c.slug)}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Show more / less toggle */}
      {extraCats.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-2 flex w-full items-center justify-center gap-1.5 text-sm font-medium text-brand-blue hover:text-brand-steel"
          >
            {expanded ? "Show less" : "Show all categories"}
            <ChevronDown
              size={16}
              className="transition-transform duration-300"
              style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>

          <div
            ref={panelRef}
            className="overflow-hidden transition-all duration-300 ease-out"
            style={{
              maxHeight: expanded ? `${panelRef.current?.scrollHeight ?? 500}px` : "0px",
              opacity: expanded ? 1 : 0,
            }}
          >
            <div className="flex flex-wrap gap-2 pt-3">
              {extraCats.map((c) => (
                <Link
                  key={c.slug}
                  href={`/products?category=${c.slug}`}
                  className={pillClass(activeCat === c.slug)}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
