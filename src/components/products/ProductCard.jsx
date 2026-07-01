"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Check } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { imageSrc } from "@/utils/imageSrc";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/hooks/useWishlist";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const wished = wishlistIds.has(product.id);

  const price = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice != null;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
  const outOfStock = product.stock != null && product.stock <= 0;

  function handleAdd() {
    if (outOfStock) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-silver-light bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative">
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-cloud">
            <Image
              src={imageSrc(product.image)}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="rounded-md bg-royal px-2 py-1 text-[11px] font-bold text-white shadow-sm">
              -{discountPct}%
            </span>
          )}
          {outOfStock && (
            <span className="rounded-md bg-navy/80 px-2 py-1 text-[11px] font-bold text-white">
              Out of stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label="Add to wishlist"
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-navy shadow-sm backdrop-blur transition-colors hover:text-royal"
        >
          <Heart size={16} className={wished ? "fill-royal text-royal" : ""} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <span className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-silver-dark">
          {product.brand}
        </span>
        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-navy transition-colors hover:text-royal">
            {product.name}
          </h3>
        </Link>

        {product.rating > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded bg-green-50 px-1.5 py-0.5 text-xs font-semibold text-green-700">
              <Star size={12} className="fill-green-600 text-green-600" />
              {product.rating}
            </span>
            <span className="text-xs text-silver-dark">
              ({product.reviewCount})
            </span>
          </div>
        )}

        <div className="mt-3 flex items-end gap-2">
          <span className="text-lg font-bold text-navy">
            {formatPrice(price)}
          </span>
          {hasDiscount && (
            <span className="mb-0.5 text-xs text-silver-dark line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className={`mt-3.5 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] ${
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
            <>
              <Check size={16} /> Added
            </>
          ) : (
            <>
              <ShoppingCart size={16} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}