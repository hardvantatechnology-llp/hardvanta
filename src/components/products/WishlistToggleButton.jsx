"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistToggleButton({ productId, className = "" }) {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const wished = wishlistIds?.has?.(productId);

  return (
    <button
      type="button"
      onClick={() => toggleWishlist(productId)}
      aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg glass-card text-white/80 transition-all hover:shadow-glow-purple ${className}`}
    >
      <Heart size={18} className={wished ? "fill-red-500 text-red-500" : ""} />
    </button>
  );
}
