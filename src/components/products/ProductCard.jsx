"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Check } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { imageSrc } from "@/utils/imageSrc";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

function Stars({ rating = 0 }) {
  const rounded = Math.round(rating);
  return (
    <span className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={i <= rounded ? "fill-amber-400 text-amber-400" : "fill-silver-light text-silver-light"}
        />
      ))}
    </span>
  );
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const wished = wishlistIds?.has?.(product.id);
  const price = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice != null;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
  const outOfStock = product.inStock === false;

  function handleAdd() {
    if (outOfStock) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_4px_rgba(10,31,68,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_28px_rgba(10,31,68,0.16)]">
      {/* Image — 1:1, contain, lazy */}
      <div className="relative">
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-white">
            <Image
              src={imageSrc(product.image)}
              alt={product.name}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Discount badge — top-left */}
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-md bg-royal px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
            -{discountPct}%
          </span>
        )}
        {outOfStock && (
          <span className="absolute left-3 top-3 rounded-md bg-navy/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
            Out of stock
          </span>
        )}

        {/* Wishlist — circular top-right */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-navy shadow-md transition-colors hover:text-red-500"
        >
          <Heart size={15} className={wished ? "fill-red-500 text-red-500" : ""} />
        </button>
      </div>

      {/* Content — 16px padding, tight spacing */}
      <div className="flex flex-1 flex-col p-4">
        <span className="truncate text-[11px] font-medium uppercase tracking-wide text-gray-400">
          {product.brand?.name || " "}
        </span>

        <Link href={`/products/${product.id}`}>
          <h3 className="mt-0.5 line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-navy transition-colors hover:text-royal">
            {product.name}
          </h3>
        </Link>

        {/* Rating beside stars */}
        <div className="mt-1.5 flex items-center gap-1.5">
          <Stars rating={product.rating} />
          <span className="text-xs font-medium text-navy">{product.rating || 0}</span>
          <span className="text-xs text-gray-400">({product.reviewCount || 0})</span>
        </div>

        {/* Price */}
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-xl font-bold text-navy">{formatPrice(price)}</span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Add to cart — compact, 44px */}
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className={`mt-auto flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${
            outOfStock
              ? "cursor-not-allowed bg-silver-light text-silver-dark"
              : added
                ? "bg-green-600 text-white"
                : "bg-royal text-white hover:bg-royal-dark"
          }`}
        >
          {outOfStock ? (
            "Out of stock"
          ) : added ? (
            <><Check size={16} /> Added</>
          ) : (
            <><ShoppingCart size={16} /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
}
