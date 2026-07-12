"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Heart, Trash2, ShoppingCart, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";
import { imageSrc } from "@/utils/imageSrc";

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const { addItem } = useCart();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      setLoading(false);
      return;
    }
    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => {
        setWishlist(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session, status]);

  async function handleRemove(productId) {
    setWishlist((prev) => prev.filter((item) => item.productId !== productId));
    await fetch("/api/wishlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
  }

  // ---------------- Login required ----------------
  if (status !== "loading" && !session) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <Lock size={52} className="text-silver-dark" />
        <h1 className="mt-4 text-2xl font-bold text-navy">Login required</h1>
        <p className="mt-2 max-w-sm text-silver-dark">
          Please sign in to view your wishlist and save your favourite products.
        </p>
        <Link
          href="/login?callbackUrl=/wishlist"
          className="mt-6 rounded-lg bg-royal px-6 py-3 font-semibold text-white hover:bg-royal-dark"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="heading-accent mb-8">
        My Wishlist{!loading ? ` (${wishlist.length})` : ""}
      </h1>

      {loading && (
        <p className="py-16 text-center text-silver-dark">Loading your wishlist…</p>
      )}

      {!loading && wishlist.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-silver py-20 text-center">
          <Heart size={48} className="text-silver-dark" />
          <p className="text-xl font-bold text-navy">Your wishlist is empty</p>
          <p className="max-w-sm text-sm text-silver-dark">
            Tap the ♥ on any product to save it here for later.
          </p>
          <Link
            href="/products"
            className="mt-2 rounded-lg bg-royal px-6 py-3 font-semibold text-white hover:bg-royal-dark"
          >
            Browse Products
          </Link>
        </div>
      )}

      {!loading && wishlist.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {wishlist.map((item) => {
            const p = item.product;
            if (!p) return null;
            const price = p.salePrice ?? p.price;
            return (
              <div
                key={item.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-silver-light bg-white shadow-card"
              >
                <Link
                  href={`/products/${p.slug}`}
                  className="relative aspect-square overflow-hidden bg-cloud"
                >
                  <Image
                    src={imageSrc(p.image)}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-contain p-3"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-3.5">
                  <Link href={`/products/${p.slug}`}>
                    <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-navy hover:text-royal">
                      {p.name}
                    </h3>
                  </Link>
                  <span className="mt-2 text-lg font-bold text-navy">
                    {formatPrice(price)}
                  </span>
                  <div className="mt-3 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        addItem(p);
                        handleRemove(item.productId);
                      }}
                      className="flex items-center justify-center gap-2 rounded-lg bg-royal px-3 py-2 text-sm font-semibold text-white hover:bg-royal-dark"
                    >
                      <ShoppingCart size={15} /> Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="flex items-center justify-center gap-2 rounded-lg border border-silver px-3 py-2 text-sm font-semibold text-silver-dark hover:border-red-300 hover:text-red-500"
                    >
                      <Trash2 size={15} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
