"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext(null);
const STORAGE_KEY = "hardvanta_cart";
export function clampQuantity(quantity) {
  return Math.max(1, quantity);
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

  const addItem = useCallback(
    async (product, quantity = 1) => {
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
              ? { ...i, quantity: clampQuantity(i.quantity + quantity) }
              : i
          );
        }
        return [...prev, { ...product, quantity: clampQuantity(quantity) }];
      });
    },
    [isAuthed]
  );

  const removeItem = useCallback(
    async (id) => {
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
    },
    [isAuthed]
  );

  const updateQuantity = useCallback(
    async (id, quantity) => {
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
        prev.map((i) => (i.id === id ? { ...i, quantity: clampQuantity(quantity) } : i))
      );
    },
    [isAuthed, removeItem]
  );

  const clearCart = useCallback(
    async () => {
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
    },
    [isAuthed]
  );

  // Re-syncs local cart state from the server cart — used after checkout,
  // where the order transaction already cleared the purchased items in the
  // DB but this context's local `items` state has no way to know that yet.
  const refreshCart = useCallback(async () => {
    if (!isAuthed) return;
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (res.ok && Array.isArray(data.items)) setItems(data.items);
    } catch (e) {
      console.error("refreshCart failed", e);
    }
  }, [isAuthed]);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce(
    (sum, i) => sum + (i.salePrice ?? i.price) * i.quantity,
    0
  );

  // Stable reference unless the cart itself actually changes — lets consumers
  // that only read unrelated context fields (or are wrapped in memo) skip
  // re-rendering on every unrelated provider re-render.
  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      refreshCart,
      count,
      total,
      coupon,
      setCoupon,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, refreshCart, count, total, coupon]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
