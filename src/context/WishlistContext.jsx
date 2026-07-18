"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { data: session } = useSession();
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      setWishlistIds(new Set());
      return;
    }
    fetch("/api/wishlist")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load wishlist"))))
      .then((data) => {
        if (Array.isArray(data)) {
          setWishlistIds(new Set(data.map((i) => i.productId)));
        }
      })
      .catch((e) => {
        console.error("wishlist fetch failed", e);
      });
  }, [session]);

  const toggleWishlist = useCallback(
    async (productId) => {
      if (!session) {
        // Not logged in — send them to login (wishlist is saved per account).
        window.location.href = "/login?callbackUrl=/wishlist";
        return;
      }

      const isInWishlist = wishlistIds.has(productId);
      setLoading(true);

      // Optimistic update — reverted in the catch block if the request fails.
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (isInWishlist) next.delete(productId);
        else next.add(productId);
        return next;
      });

      try {
        const res = await fetch("/api/wishlist", {
          method: isInWishlist ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (!res.ok) throw new Error("Could not update wishlist. Please try again.");
      } catch (e) {
        console.error("toggleWishlist failed", e);
        // Roll back the optimistic update since the server never confirmed it.
        setWishlistIds((prev) => {
          const next = new Set(prev);
          if (isInWishlist) next.add(productId);
          else next.delete(productId);
          return next;
        });
      } finally {
        setLoading(false);
      }
    },
    [session, wishlistIds]
  );

  const value = useMemo(
    () => ({ wishlistIds, toggleWishlist, loading }),
    [wishlistIds, toggleWishlist, loading]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}