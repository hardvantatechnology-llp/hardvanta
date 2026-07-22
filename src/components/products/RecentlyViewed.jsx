"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const KEY = "hv_recently_viewed";
const MAX = 8;

export function trackRecentlyViewed(productId) {
  if (typeof window === "undefined" || !productId) return;
  try {
    const prev = JSON.parse(localStorage.getItem(KEY) || "[]");
    const next = [productId, ...prev.filter((id) => id !== productId)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable — recently-viewed is a nice-to-have, fail silently
  }
}

export default function RecentlyViewed({ excludeId }) {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    let cancelled = false;
    trackRecentlyViewed(excludeId);
    try {
      const ids = JSON.parse(localStorage.getItem(KEY) || "[]").filter((id) => id !== excludeId);
      if (!ids.length) {
        setProducts([]);
        return;
      }
      Promise.all(
        ids.map((id) =>
          fetch(`/api/products/${id}`)
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => d?.product ?? null)
            .catch(() => null)
        )
      ).then((results) => {
        if (!cancelled) setProducts(results.filter(Boolean));
      });
    } catch {
      setProducts([]);
    }
    return () => {
      cancelled = true;
    };
  }, [excludeId]);

  if (!products || products.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="mb-6 text-2xl font-bold text-brand-text">Recently Viewed</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 auto-rows-fr">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
