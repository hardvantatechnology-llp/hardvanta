"use client";

import { memo, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Star, ShoppingCart, Heart, Check, Repeat, Eye } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { imageSrc } from "@/utils/imageSrc";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";

// Most visitors never open the quick-view modal — split it into its own
// chunk (framer-motion + portal included) so it isn't part of every product
// grid's initial JS, and load it only when someone clicks the eye icon.
const QuickViewModal = dynamic(() => import("./QuickViewModal"), { ssr: false });

const COMPARE_KEY = "hv_compare_ids";
const COMPARE_MAX = 4;
const COMPARE_EVENT = "hv-compare-change";
const NEW_WINDOW_DAYS = 14;

function readCompareIds() {
  try {
    return JSON.parse(localStorage.getItem(COMPARE_KEY) || "[]");
  } catch {
    return [];
  }
}

function Stars({ rating = 0 }) {
  const rounded = Math.round(rating);
  return (
    <span className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={i <= rounded ? "fill-amber-400 text-amber-400" : "fill-brand-border text-brand-border"}
        />
      ))}
    </span>
  );
}

function ProductCard({ product, priority = false }) {
  const { addItem } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const reduce = useReducedMotion();
  const [added, setAdded] = useState(false);
  const [addError, setAddError] = useState(false);
  const [compared, setCompared] = useState(false);
  const [quickView, setQuickView] = useState(false);
  // Starts false on both the server render and the client's first (hydration)
  // render, then updates after mount — computing this from Date.now() during
  // render would make it depend on the exact instant the server rendered vs.
  // the instant the client hydrates, which can disagree (and did) for a
  // product whose createdAt sits close to the NEW_WINDOW_DAYS boundary.
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    setCompared(readCompareIds().includes(product.id));
    const sync = () => setCompared(readCompareIds().includes(product.id));
    window.addEventListener(COMPARE_EVENT, sync);
    return () => window.removeEventListener(COMPARE_EVENT, sync);
  }, [product.id]);

  useEffect(() => {
    if (!product.createdAt) return;
    setIsNew(Date.now() - new Date(product.createdAt).getTime() < NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  }, [product.createdAt]);

  const toggleCompare = useCallback(
    (e) => {
      e.preventDefault();
      const ids = readCompareIds();
      const isIn = ids.includes(product.id);
      let next;
      if (isIn) {
        next = ids.filter((id) => id !== product.id);
      } else {
        if (ids.length >= COMPARE_MAX) return;
        next = [...ids, product.id];
      }
      localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(COMPARE_EVENT));
    },
    [product.id]
  );

  const wished = wishlistIds?.has?.(product.id);
  const price = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice != null && product.price > 0;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
  const outOfStock = product.inStock === false;

  async function handleAdd() {
    if (outOfStock) return;
    try {
      await addItem(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (e) {
      console.error("add to cart failed", e);
      setAddError(true);
      setTimeout(() => setAddError(false), 2000);
    }
  }

  return (
    <>
      <motion.div
        initial={reduce ? undefined : { opacity: 0, y: 22, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="h-full"
      >
        <GlassCard opaque glow="electric" className="group flex h-full flex-col overflow-hidden">
          {/* Image */}
          <div className="relative" style={{ transform: "translateZ(22px)", transformStyle: "preserve-3d" }}>
            <Link href={`/products/${product.id}`} className="block">
              <div className="relative aspect-square overflow-hidden bg-brand-silver">
                <Image
                  src={imageSrc(product.image)}
                  alt={product.name}
                  fill
                  {...(priority ? { priority: true } : { loading: "lazy" })}
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </Link>

            {/* Badges — top-left */}
            <div
              className="absolute left-3 top-3 flex flex-col gap-1.5 transition-transform duration-300 group-hover:scale-105"
              style={{ transform: "translateZ(36px)", transformStyle: "preserve-3d" }}
            >
              {hasDiscount && (
                <span className="rounded-md bg-gradient-to-r from-brand-blue to-brand-navy px-1.5 py-0.5 text-[10px] font-bold text-white shadow-brand-glow">
                  -{discountPct}%
                </span>
              )}
              {isNew && !outOfStock && (
                <span className="rounded-md bg-gradient-to-r from-brand-steel to-brand-blue px-1.5 py-0.5 text-[10px] font-bold text-white">
                  NEW
                </span>
              )}
              {outOfStock && (
                <span className="rounded-md bg-brand-navy/80 px-1.5 py-0.5 text-[10px] font-bold text-white/70">
                  Out of stock
                </span>
              )}
            </div>

            {/* Action icons — top-right. Solid dark backdrop (not translucent .glass) so
                they stay legible over light/white product photos, not just dark ones. */}
            <div
              className="absolute right-3 top-3 flex flex-col gap-1.5"
              style={{ transform: "translateZ(36px)", transformStyle: "preserve-3d" }}
            >
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy/70 shadow-glass backdrop-blur-md text-white/90 transition-all hover:scale-110 hover:bg-brand-navy/85 hover:shadow-brand-glow"
              >
                <Heart size={15} className={wished ? "fill-red-500 text-red-500" : ""} />
              </button>
              <button
                type="button"
                onClick={toggleCompare}
                aria-label={compared ? "Remove from compare" : "Add to compare"}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy/70 shadow-glass backdrop-blur-md text-white/90 transition-all hover:scale-110 hover:bg-brand-navy/85 hover:shadow-brand-glow"
              >
                <Repeat size={14} className={compared ? "text-brand-steel" : ""} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setQuickView(true);
                }}
                aria-label="Quick view"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy/70 shadow-glass backdrop-blur-md text-white/90 opacity-0 transition-all group-hover:opacity-100 hover:scale-110 hover:bg-brand-navy/85 hover:shadow-brand-glow"
              >
                <Eye size={14} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col p-4" style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}>
            <span className="truncate text-[11px] font-medium uppercase tracking-wide text-brand-muted">
              {product.brand?.name || " "}
            </span>

            <Link href={`/products/${product.id}`}>
              <h3 className="mt-0.5 line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-brand-text transition-colors hover:text-brand-blue">
                {product.name}
              </h3>
            </Link>

            <div className="mt-1.5 flex items-center gap-1.5">
              <Stars rating={product.rating} />
              <span className="text-xs font-medium text-brand-text">{product.rating || 0}</span>
              <span className="text-xs text-brand-muted">({product.reviewCount || 0})</span>
            </div>

            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-xl font-bold text-brand-text">{formatPrice(price)}</span>
              {hasDiscount && (
                <span className="text-xs text-brand-muted line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <Button
              onClick={handleAdd}
              disabled={outOfStock}
              variant={addError ? "primary" : added ? "brand-glass" : "brand-gradient"}
              className={`mt-auto h-11 w-full transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] ${outOfStock ? "!bg-brand-silver !text-brand-muted !shadow-none hover:!scale-100" : ""}`}
            >
              {outOfStock ? (
                "Out of stock"
              ) : addError ? (
                "Couldn't add — retry"
              ) : added ? (
                <><Check size={16} /> Added</>
              ) : (
                <><ShoppingCart size={16} /> Add to Cart</>
              )}
            </Button>
          </div>
        </GlassCard>
      </motion.div>

      {quickView && (
        <QuickViewModal product={product} onClose={() => setQuickView(false)} />
      )}
    </>
  );
}

export default memo(ProductCard);