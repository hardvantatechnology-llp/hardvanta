"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Heart, Trash2, ShoppingCart, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";
import { imageSrc } from "@/utils/imageSrc";
import Button from "@/components/ui/Button";

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
      <div className="min-h-[70vh] bg-gradient-to-b from-brand-silver to-brand-bg container-page flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full glass-brand-card">
          <Lock size={32} className="text-brand-blue" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-brand-text">Login required</h1>
        <p className="mt-2 max-w-sm text-brand-muted">
          Please sign in to view your wishlist and save your favourite products.
        </p>
        <Button href="/login?callbackUrl=/wishlist" variant="brand-gradient" className="mt-6">
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-brand-silver to-brand-bg min-h-screen">
      <div className="liquid-blob left-1/4 top-[-15%] h-96 w-96 bg-brand-steel/10" />
      <div className="container-page relative py-8">
        <h1 className="relative mb-8 inline-block text-2xl font-bold text-brand-text after:absolute after:-bottom-2 after:left-0 after:h-1 after:w-12 after:rounded-full after:bg-gradient-to-r after:from-brand-blue after:to-brand-navy">
          My Wishlist{!loading ? ` (${wishlist.length})` : ""}
        </h1>

        {loading && (
          <p className="py-16 text-center text-brand-muted">Loading your wishlist…</p>
        )}

        {!loading && wishlist.length === 0 && (
          <div className="glass-brand-card flex flex-col items-center gap-3 rounded-3xl py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue/20 to-brand-navy/20 shadow-brand-glow">
              <Heart size={30} className="text-brand-steel" />
            </div>
            <p className="text-xl font-bold text-brand-text">Your wishlist is empty</p>
            <p className="max-w-sm text-sm text-brand-muted">
              Tap the ♥ on any product to save it here for later.
            </p>
            <Button href="/products" variant="brand-gradient" className="mt-2">
              Browse Products
            </Button>
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
                  className="glass-brand-card flex flex-col overflow-hidden rounded-3xl transition-all hover:shadow-brand-glow"
                >
                  <Link
                    href={`/products/${p.slug}`}
                    className="relative aspect-square overflow-hidden bg-brand-silver"
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
                      <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-brand-text hover:text-brand-blue">
                        {p.name}
                      </h3>
                    </Link>
                    <span className="mt-2 text-lg font-bold text-brand-text">
                      {formatPrice(price)}
                    </span>
                    <div className="mt-3 flex flex-col gap-2">
                      <Button
                        onClick={async () => {
                          try {
                            await addItem(p);
                          } catch (e) {
                            console.error("add to cart failed", e);
                          }
                          handleRemove(item.productId);
                        }}
                        variant="brand-gradient"
                        size="sm"
                      >
                        <ShoppingCart size={15} /> Add to Cart
                      </Button>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className="flex items-center justify-center gap-2 rounded-lg border border-brand-border px-3 py-2 text-sm font-semibold text-brand-muted hover:border-red-400/40 hover:text-red-600 transition-colors"
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
    </div>
  );
}
