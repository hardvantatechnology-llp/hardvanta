"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
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
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setWishlistIds(new Set(data.map((i) => i.productId)));
        }
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

      if (isInWishlist) {
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
      } else {
        setWishlistIds((prev) => new Set(prev).add(productId));
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
      }

      setLoading(false);
    },
    [session, wishlistIds]
  );

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}