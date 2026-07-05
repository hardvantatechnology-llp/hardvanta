"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Truck, RotateCcw, Tag, ArrowRight, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";
import { imageSrc } from "@/utils/imageSrc";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, count } = useCart();

  const shipping = total > 999 ? 0 : 49;
  const grandTotal = total + shipping;
  const savedAmount = items.reduce((sum, item) => {
    if (item.salePrice != null) {
      return sum + (item.price - item.salePrice) * item.quantity;
    }
    return sum;
  }, 0);

  if (count === 0) {
    return (
      <div className="min-h-[70vh] bg-cloud flex flex-col items-center justify-center px-4 text-center">
        <div className="relative mb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-card mx-auto">
            <ShoppingBag size={40} className="text-silver" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-navy">Your cart is empty</h1>
        <p className="mt-2 max-w-xs text-silver-dark">
          Looks like you haven't added anything yet. Let's fix that!
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-royal px-8 py-3.5 font-semibold text-white hover:bg-royal-dark transition-colors"
        >
          Browse Products <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cloud">
      {/* Page header */}
      <div className="bg-white border-b border-silver-light">
        <div className="container-page py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-navy">Shopping Cart</h1>
              <p className="text-sm text-silver-dark mt-0.5">{count} item{count !== 1 ? "s" : ""} in your cart</p>
            </div>
            <Link href="/products" className="text-sm font-semibold text-royal hover:underline hidden sm:block">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="container-page py-6">
        <div className="grid gap-6 lg:grid-cols-3">

          {/* ── Cart Items ── */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => {
              const price = item.salePrice ?? item.price;
              const hasDiscount = item.salePrice != null;
              const discountPct = hasDiscount
                ? Math.round(((item.price - item.salePrice) / item.price) * 100)
                : 0;

              return (
                <div
                  key={item.id}
                  className="group flex gap-4 rounded-2xl border border-silver-light bg-white p-4 shadow-card transition-all hover:shadow-card-hover"
                >
                  {/* Product image */}
                  <Link href={`/products/${item.id}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cloud border border-silver-light">
                    <Image
                      src={imageSrc(item.image)}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                    />
                    {hasDiscount && (
                      <span className="absolute left-1 top-1 rounded-md bg-royal px-1.5 py-0.5 text-[10px] font-bold text-white">
                        -{discountPct}%
                      </span>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex flex-1 flex-col min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link href={`/products/${item.id}`}>
                          <h3 className="line-clamp-2 text-sm font-semibold text-navy hover:text-royal transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        {item.brand && (
                          <p className="mt-0.5 text-xs text-silver-dark">{item.brand?.name || item.brand}</p>
                        )}
                      </div>
                      {/* Remove button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-silver-dark hover:bg-red-50 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                      {/* Qty controls */}
                      <div className="flex items-center rounded-lg border border-silver bg-cloud overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center text-navy hover:bg-silver-light transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-9 text-center text-sm font-bold text-navy">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center text-navy hover:bg-silver-light transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-bold text-navy">{formatPrice(price * item.quantity)}</p>
                        {hasDiscount && (
                          <p className="text-xs text-silver-dark line-through">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Free shipping progress bar */}
            {total <= 999 && (
              <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-orange-700">
                    <Truck size={16} />
                    Add {formatPrice(1000 - total)} more for FREE shipping!
                  </div>
                  <span className="text-xs text-orange-500 font-medium">
                    {Math.round((total / 1000) * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-orange-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-orange-500 transition-all duration-500"
                    style={{ width: `${Math.min((total / 1000) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {total > 999 && (
              <div className="rounded-2xl border border-green-100 bg-green-50 p-4 flex items-center gap-3">
                <Truck size={20} className="text-green-600 shrink-0" />
                <p className="text-sm font-semibold text-green-700">
                  🎉 You've unlocked FREE shipping!
                </p>
              </div>
            )}
          </div>

          {/* ── Order Summary ── */}
          <div className="space-y-4">
            <div className="sticky top-24">

              {/* Summary card */}
              <div className="rounded-2xl border border-silver-light bg-white p-5 shadow-card">
                <h2 className="mb-4 text-base font-bold text-navy">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-silver-dark">Subtotal ({count} items)</span>
                    <span className="font-semibold text-navy">{formatPrice(total)}</span>
                  </div>

                  {savedAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1.5">
                        <Tag size={13} /> Discount savings
                      </span>
                      <span className="font-semibold">-{formatPrice(savedAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-silver-dark flex items-center gap-1.5">
                      <Truck size={13} /> Shipping
                    </span>
                    <span className={`font-semibold ${shipping === 0 ? "text-green-600" : "text-navy"}`}>
                      {shipping === 0 ? "FREE" : formatPrice(shipping)}
                    </span>
                  </div>
                </div>

                <div className="my-4 border-t border-silver-light" />

                <div className="flex justify-between items-center">
                  <span className="font-bold text-navy">Total</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-navy">{formatPrice(grandTotal)}</span>
                    {savedAmount > 0 && (
                      <p className="text-xs text-green-600 font-medium mt-0.5">
                        You save {formatPrice(savedAmount)}
                      </p>
                    )}
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-royal py-3.5 font-bold text-white hover:bg-royal-dark transition-colors shadow-sm"
                >
                  <Zap size={17} />
                  Proceed to Checkout
                </Link>

                <Link
                  href="/products"
                  className="mt-3 block text-center text-sm font-medium text-silver-dark hover:text-royal transition-colors"
                >
                  ← Continue Shopping
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-4 rounded-2xl border border-silver-light bg-white p-4 shadow-card">
                <div className="space-y-3">
                  {[
                    { icon: <ShieldCheck size={16} className="text-green-600" />, text: "100% Secure Checkout" },
                    { icon: <Truck size={16} className="text-royal" />, text: "Free shipping above ₹999" },
                    { icon: <RotateCcw size={16} className="text-royal" />, text: "Easy returns & refunds" },
                  ].map((badge) => (
                    <div key={badge.text} className="flex items-center gap-3 text-sm text-silver-dark">
                      {badge.icon}
                      <span>{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}