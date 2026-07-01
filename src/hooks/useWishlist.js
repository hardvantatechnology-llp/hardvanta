// src/hooks/useWishlist.js
"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export function useWishlist() {
  const { data: session } = useSession();
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Wishlist fetch karo jab user login ho
  useEffect(() => {
    if (!session) return;
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setWishlistIds(new Set(data.map((i) => i.productId)));
        }
      });
  }, [session]);

  // Toggle — add ya remove
  const toggleWishlist = useCallback(
    async (productId) => {
      if (!session) {
        alert("Wishlist use karne ke liye pehle login karo!");
        return;
      }

      const isInWishlist = wishlistIds.has(productId);
      setLoading(true);

      if (isInWishlist) {
        // Remove
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
        // Add
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

  return { wishlistIds, toggleWishlist, loading };
}