"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingCart, Check, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";

export default function AddToCart({ product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [addError, setAddError] = useState(false);
  const [buying, setBuying] = useState(false);

  // ✅ FIXED: sirf inStock field se check — stock number se nahi
  const outOfStock = product.inStock === false;

  async function handleAdd() {
    try {
      await addItem(product, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (e) {
      console.error("add to cart failed", e);
      setAddError(true);
      setTimeout(() => setAddError(false), 2000);
    }
  }

  async function handleBuyNow() {
    setBuying(true);
    try {
      await addItem(product, qty);
      router.push("/checkout");
    } catch (e) {
      console.error("buy now failed", e);
      setAddError(true);
      setTimeout(() => setAddError(false), 2000);
      setBuying(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-1 rounded-xl glass-brand-card overflow-hidden">
        {/* Minus button */}
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={outOfStock}
          className="flex h-11 w-11 items-center justify-center text-brand-muted transition-colors hover:bg-brand-silver disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>

        {/* Quantity display */}
        <div className="relative w-10 h-11 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={qty}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 flex items-center justify-center font-semibold text-brand-text"
            >
              {qty}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Plus button */}
        <button
          onClick={() => setQty((q) => q + 1)}
          disabled={outOfStock}
          className="flex h-11 w-11 items-center justify-center text-brand-muted transition-colors hover:bg-brand-silver disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Add to Cart button */}
      <Button
        onClick={handleAdd}
        disabled={outOfStock}
        variant={addError ? "primary" : added ? "brand-glass" : "brand-outline"}
        size="lg"
        className={outOfStock ? "!bg-brand-silver !text-brand-muted !border-brand-border !shadow-none" : ""}
      >
        {addError ? (
          "Couldn't add — retry"
        ) : added ? (
          <><Check size={18} /> Added</>
        ) : (
          <><ShoppingCart size={18} />
          {outOfStock ? "Out of Stock" : "Add to Cart"}</>
        )}
      </Button>

      {/* Buy Now button */}
      <Button
        onClick={handleBuyNow}
        disabled={outOfStock || buying}
        variant="brand-gradient"
        size="lg"
      >
        <Zap size={18} />
        {buying ? "Redirecting…" : "Buy Now"}
      </Button>
    </div>
  );
}
