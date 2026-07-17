"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

const MAX_QTY = 99;

export default function AddToCart({ product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [addError, setAddError] = useState(false);

  // ✅ FIXED: sirf inStock field se check — stock number se nahi
  const outOfStock = product.inStock === false;
  const maxQty = typeof product.stock === "number" ? Math.min(product.stock, MAX_QTY) : MAX_QTY;

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

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">

        {/* Minus button */}
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={outOfStock}
          className="rounded-lg border border-silver p-2 hover:border-royal disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>

        {/* Quantity display */}
        <span className="w-10 text-center font-semibold text-navy">{qty}</span>

        {/* Plus button */}
        <button
          onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
          disabled={outOfStock || qty >= maxQty}
          className="rounded-lg border border-silver p-2 hover:border-royal disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>

      </div>

      {/* Add to Cart button */}
      <button
        onClick={handleAdd}
        disabled={outOfStock}
        className={`inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          addError ? "bg-red-600 hover:bg-red-700" : "bg-royal hover:bg-royal-dark"
        }`}
      >
        {addError ? (
          "Couldn't add — retry"
        ) : added ? (
          <><Check size={18} /> Added</>
        ) : (
          <><ShoppingCart size={18} />
          {outOfStock ? "Out of Stock" : "Add to Cart"}</>
        )}
      </button>
    </div>
  );
}