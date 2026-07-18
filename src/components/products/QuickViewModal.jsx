"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Star, X, ShoppingCart, Heart, Check, ArrowRight } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { imageSrc } from "@/utils/imageSrc";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Button from "@/components/ui/Button";

export default function QuickViewModal({ product, onClose }) {
  const { addItem } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (!mounted || !product) return null;

  const wished = wishlistIds?.has?.(product.id);
  const price = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice != null && product.price > 0;
  const outOfStock = product.inStock === false;

  async function handleAdd() {
    if (outOfStock) return;
    try {
      await addItem(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (e) {
      console.error("add to cart failed", e);
    }
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduce ? undefined : { opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-obsidian/70 backdrop-blur-md p-4"
      >
        <motion.div
          key="panel"
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
          initial={reduce ? false : { opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-strong relative grid w-full max-w-2xl gap-6 rounded-3xl p-6 sm:grid-cols-2"
        >
          <button
            onClick={onClose}
            aria-label="Close quick view"
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full glass text-white/80 hover:text-white"
          >
            <X size={18} />
          </button>

          <div className="relative aspect-square overflow-hidden rounded-2xl bg-white/5">
            <Image
              src={imageSrc(product.image)}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 90vw, 400px"
              className="object-contain p-4"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-electric-light">
              {product.brand?.name}
            </span>
            <h2 className="mt-1 text-xl font-bold text-white">{product.name}</h2>

            <div className="mt-2 flex items-center gap-1.5 text-sm text-white/60">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="font-medium text-white">{product.rating || 0}</span>
              <span>({product.reviewCount || 0} reviews)</span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">{formatPrice(price)}</span>
              {hasDiscount && (
                <span className="text-sm text-white/40 line-through">{formatPrice(product.price)}</span>
              )}
            </div>

            <p className="mt-2 text-sm font-medium">
              {outOfStock ? (
                <span className="text-red-400">Out of stock</span>
              ) : (
                <span className="text-cyan">In stock — ready to ship</span>
              )}
            </p>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={handleAdd}
                disabled={outOfStock}
                variant={added ? "glass" : "gradient"}
                className="flex-1"
              >
                {added ? (
                  <><Check size={16} /> Added</>
                ) : (
                  <><ShoppingCart size={16} /> {outOfStock ? "Out of stock" : "Add to Cart"}</>
                )}
              </Button>
              <button
                onClick={() => toggleWishlist(product.id)}
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg glass text-white/80 hover:shadow-glow-purple"
              >
                <Heart size={18} className={wished ? "fill-red-500 text-red-500" : ""} />
              </button>
            </div>

            <Link
              href={`/products/${product.id}`}
              onClick={onClose}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-electric-light hover:gap-2 hover:text-cyan transition-all"
            >
              View full details <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
