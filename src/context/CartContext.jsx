"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext(null);
const STORAGE_KEY = "hardvanta_cart";
export const MAX_QUANTITY = 99;

export function clampQuantity(quantity, stock) {
  const ceiling = typeof stock === "number" ? Math.min(stock, MAX_QUANTITY) : MAX_QUANTITY;
  return Math.max(1, Math.min(quantity, ceiling));
}

export function CartProvider({ children }) {
  const { status } = useSession();
  const isAuthed = status === "authenticated";

  const [items, setItems] = useState([]);
const [coupon, setCoupon] = useState(null);

const [hydrated, setHydrated] = useState(false);
const mergedRef = useRef(false);

  // --- Guest: load from localStorage on mount ---
  useEffect(() => {
    if (isAuthed) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setHydrated(true);
  }, [isAuthed]);

  // --- Guest: persist to localStorage ---
  useEffect(() => {
    if (!isAuthed && hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated, isAuthed]);

  // --- Authenticated: merge any guest cart into DB, then load server cart ---
  useEffect(() => {
    if (status !== "authenticated" || mergedRef.current) return;
    mergedRef.current = true;

    async function sync() {
      try {
        let guest = [];
        try {
          guest = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        } catch {}
        for (const it of guest) {
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: it.id, quantity: it.quantity }),
          });
        }
        localStorage.removeItem(STORAGE_KEY);

        const res = await fetch("/api/cart");
        const data = await res.json();
        setItems(data.items || []);
      } catch (e) {
        console.error("cart sync failed", e);
      } finally {
        setHydrated(true);
      }
    }
    sync();
  }, [status]);

  // Reset merge guard on logout so a future login re-syncs.
  useEffect(() => {
    if (status === "unauthenticated") mergedRef.current = false;
  }, [status]);

  async function addItem(product, quantity = 1) {
    if (isAuthed) {
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id, quantity }),
        });
        let data = null;
        try { data = await res.json(); } catch {}
        if (!res.ok || !data || !Array.isArray(data.items)) {
          throw new Error(data?.error || "Could not add item to cart. Please try again.");
        }
        setItems(data.items);
      } catch (e) {
        console.error("addItem failed", e);
        // Keep the previous cart state intact and let the caller surface an error.
        throw e instanceof Error ? e : new Error("Could not add item to cart. Please try again.");
      }
      return;
    }
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, quantity: clampQuantity(i.quantity + quantity, i.stock) }
            : i
        );
      }
      return [...prev, { ...product, quantity: clampQuantity(quantity, product.stock) }];
    });
  }

  async function removeItem(id) {
    if (isAuthed) {
      try {
        const res = await fetch(`/api/cart?productId=${id}`, { method: "DELETE" });
        let data = null;
        try { data = await res.json(); } catch {}
        if (!res.ok || !data || !Array.isArray(data.items)) {
          throw new Error(data?.error || "Could not remove item from cart. Please try again.");
        }
        setItems(data.items);
      } catch (e) {
        console.error("removeItem failed", e);
        throw e instanceof Error ? e : new Error("Could not remove item from cart. Please try again.");
      }
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function updateQuantity(id, quantity) {
    if (quantity < 1) return removeItem(id);
    if (isAuthed) {
      try {
        const res = await fetch("/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id, quantity }),
        });
        let data = null;
        try { data = await res.json(); } catch {}
        if (!res.ok || !data || !Array.isArray(data.items)) {
          throw new Error(data?.error || "Could not update quantity. Please try again.");
        }
        setItems(data.items);
      } catch (e) {
        console.error("updateQuantity failed", e);
        throw e instanceof Error ? e : new Error("Could not update quantity. Please try again.");
      }
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: clampQuantity(quantity, i.stock) } : i))
    );
  }

  async function clearCart() {
    if (isAuthed) {
      try {
        const res = await fetch("/api/cart", { method: "DELETE" });
        let data = null;
        try { data = await res.json(); } catch {}
        if (!res.ok || !data || !Array.isArray(data.items)) {
          throw new Error(data?.error || "Could not clear cart. Please try again.");
        }
        setItems(data.items);
      } catch (e) {
        console.error("clearCart failed", e);
        throw e instanceof Error ? e : new Error("Could not clear cart. Please try again.");
      }
      return;
    }
    setItems([]);
  }

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce(
    (sum, i) => sum + (i.salePrice ?? i.price) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
  value={{
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    count,
    total,

    coupon,
    setCoupon,
  }}
>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
