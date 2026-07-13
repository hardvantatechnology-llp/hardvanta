"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Trash2, Plus, Minus, ShoppingBag, ShieldCheck,
  Truck, RotateCcw, Tag, ArrowRight, Zap, Ticket, X
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";
import { imageSrc } from "@/utils/imageSrc";

// ─── Quantity Modal ───────────────────────────────────────────────────────────
function QuantityModal({ currentQty, onClose, onApply }) {
  const [inputVal, setInputVal] = useState("");
  const [error, setError] = useState("");

  function handleApply() {
    const num = parseInt(inputVal, 10);
    if (!inputVal || isNaN(num) || num < 1) {
      setError("Please enter a valid quantity (min 1).");
      return;
    }
    onApply(num);
    onClose();
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      {/* Modal box */}
      <div
        className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="text-base font-bold text-navy">Enter Quantity</h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-silver-dark hover:bg-silver-light transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Current qty hint */}
        <p className="px-5 text-xs text-silver-dark mb-3">
          Current quantity: <span className="font-semibold text-navy">{currentQty}</span>
        </p>

        {/* Input */}
        <div className="px-5 pb-2">
          <input
            type="number"
            min={1}
            value={inputVal}
            onChange={(e) => { setInputVal(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder="Enter quantity"
            autoFocus
            className="w-full rounded-xl border border-silver px-4 py-3 text-sm font-semibold text-navy outline-none focus:border-royal focus:ring-2 focus:ring-royal/20 placeholder:font-normal"
          />
          {error && (
            <p className="mt-1.5 text-xs text-red-500">{error}</p>
          )}
        </div>

        {/* Divider */}
        <div className="mt-4 border-t border-silver-light" />

        {/* Action buttons */}
        <div className="grid grid-cols-2">
          <button
            onClick={onClose}
            className="py-4 text-sm font-bold text-silver-dark hover:bg-silver-light/60 transition-colors border-r border-silver-light"
          >
            CANCEL
          </button>
          <button
            onClick={handleApply}
            className="py-4 text-sm font-bold text-royal hover:bg-royal/5 transition-colors"
          >
            APPLY
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Cart Page ───────────────────────────────────────────────────────────
export default function CartPage() {
  const {
  items,
  updateQuantity,
  removeItem,
  total,
  count,
  coupon,
  setCoupon,
} = useCart();

  const [couponCode, setCouponCode] = useState("");
  
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  // Modal state — tracks which item's modal is open
  const [modalItemId, setModalItemId] = useState(null);

  // MRP total (before any discounts)
  const mrpTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Product discount
  const productDiscount = items.reduce((sum, item) => {
    if (item.salePrice != null) {
      return sum + (item.price - item.salePrice) * item.quantity;
    }
    return sum;
  }, 0);

  // Subtotal after product discount
  const subtotal = total;

  // Coupon discount
  const couponDiscount = coupon?.discountAmount ?? 0;

  // Shipping & grand total
  const shipping = (subtotal - couponDiscount) >= 999 ? 0 : 49;
  const grandTotal = subtotal - couponDiscount + shipping;
  const totalSaved = productDiscount + couponDiscount;

  // ── Quantity handler: + always increments by 1 (no limit) ─────────────────
  function handleIncrement(item) {
    updateQuantity(item.id, item.quantity + 1);
  }

  function handleModalApply(itemId, qty) {
    updateQuantity(itemId, qty);
  }

  // ── Coupon helpers ────────────────────────────────────────────────────────
  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setCouponError("");
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim().toUpperCase(), subtotal }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setCouponError(data.message || "Invalid coupon.");
        setCoupon(null);
      } else {
        setCoupon(data);
        setCouponCode("");
      }
    } catch {
      setCouponError("Something went wrong. Try again.");
    } finally {
      setCouponLoading(false);
    }
  }

  function removeCoupon() {
    setCoupon(null);
    setCouponCode("");
    setCouponError("");
  }

  // ── Empty cart ────────────────────────────────────────────────────────────
  if (count === 0) {
    return (
      <div className="min-h-[70vh] bg-cloud flex flex-col items-center justify-center px-4 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-card mx-auto mb-6">
          <ShoppingBag size={40} className="text-silver" />
        </div>
        <h1 className="text-2xl font-bold text-navy">Your cart is empty</h1>
        <p className="mt-2 max-w-xs text-silver-dark">
          Looks like you haven&apos;t added anything yet. Let&apos;s fix that!
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

  // ── Active modal item lookup ──────────────────────────────────────────────
  const modalItem = modalItemId ? items.find((i) => i.id === modalItemId) : null;

  return (
    <div className="min-h-screen bg-cloud">
      {/* Quantity Modal */}
      {modalItem && (
        <QuantityModal
          currentQty={modalItem.quantity}
          onClose={() => setModalItemId(null)}
          onApply={(qty) => handleModalApply(modalItem.id, qty)}
        />
      )}

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

          {/* Cart Items */}
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
                      <button
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-silver-dark hover:bg-red-50 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                      {/* ── Quantity Controls ── */}
                      <div className="flex items-center rounded-lg border border-silver bg-cloud overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center text-navy hover:bg-silver-light transition-colors"
                        >
                          <Minus size={13} />
                        </button>

                        {/* Quantity display — click opens modal too */}
                        <button
                          onClick={() => setModalItemId(item.id)}
                          className="w-9 text-center text-sm font-bold text-navy hover:text-royal transition-colors"
                          title="Click to enter quantity manually"
                        >
                          {item.quantity}
                        </button>

                        <button
                          onClick={() => handleIncrement(item)}
                          className="flex h-8 w-8 items-center justify-center text-navy hover:bg-silver-light transition-colors"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-navy">{formatPrice(price * item.quantity)}</p>
                        {hasDiscount && (
                          <p className="text-xs text-silver-dark line-through">{formatPrice(item.price * item.quantity)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Free shipping progress bar */}
            {(subtotal - couponDiscount) < 999 && (
              <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-orange-700">
                    <Truck size={16} />
                    Add {formatPrice(999 - (subtotal - couponDiscount))} more for FREE shipping!
                  </div>
                  <span className="text-xs text-orange-500 font-medium">
                    {Math.round(((subtotal - couponDiscount) / 999) * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-orange-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-orange-500 transition-all duration-500"
                    style={{ width: `${Math.min(((subtotal - couponDiscount) / 999) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {(subtotal - couponDiscount) >= 999 && (
              <div className="rounded-2xl border border-green-100 bg-green-50 p-4 flex items-center gap-3">
                <Truck size={20} className="text-green-600 shrink-0" />
                <p className="text-sm font-semibold text-green-700">🎉 You&apos;ve unlocked FREE shipping!</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="sticky top-24">
              <div className="rounded-2xl border border-silver-light bg-white p-5 shadow-card">
                <h2 className="mb-4 text-base font-bold text-navy">Order Summary</h2>

                <div className="space-y-3 text-sm">

                  {/* MRP */}
                  <div className="flex justify-between">
                    <span className="text-silver-dark">Total MRP ({count} item{count !== 1 ? "s" : ""})</span>
                    <span className="font-semibold text-navy">{formatPrice(mrpTotal)}</span>
                  </div>

                  {/* Product Discount */}
                  {productDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1.5">
                        <Tag size={13} /> Discount on MRP
                      </span>
                      <span className="font-semibold">-{formatPrice(productDiscount)}</span>
                    </div>
                  )}

                  {/* Subtotal */}
                  {productDiscount > 0 && (
                    <div className="flex justify-between border-t border-silver-light pt-3">
                      <span className="text-silver-dark">Subtotal</span>
                      <span className="font-semibold text-navy">{formatPrice(subtotal)}</span>
                    </div>
                  )}

                  {/* Coupon Discount */}
                  {coupon && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1.5">
                        <Ticket size={13} /> Coupon ({coupon.code})
                      </span>
                      <span className="font-semibold">-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}

                  {/* Shipping */}
                  <div className="flex justify-between">
                    <span className="text-silver-dark flex items-center gap-1.5">
                      <Truck size={13} /> Shipping
                    </span>
                    <span className={`font-semibold ${shipping === 0 ? "text-green-600" : "text-navy"}`}>
                      {shipping === 0 ? "FREE" : formatPrice(shipping)}
                    </span>
                  </div>

                </div>

                <div className="my-4 border-t border-dashed border-silver-light" />

                {/* Grand Total */}
                <div className="flex justify-between items-center">
                  <span className="font-bold text-navy text-base">Amount Payable</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-navy">{formatPrice(grandTotal)}</span>
                    {totalSaved > 0 && (
                      <p className="text-xs text-green-600 font-medium mt-0.5">🎉 You save {formatPrice(totalSaved)}</p>
                    )}
                  </div>
                </div>

                {/* Coupon Input */}
                <div className="mt-4">
                  {coupon ? (
                    <div className="flex items-center justify-between rounded-xl border border-green-300 bg-green-50 px-3 py-2.5">
                      <div className="flex items-center gap-2 text-sm text-green-700 font-semibold">
                        <Ticket size={15} />
                        {coupon.code} applied!
                      </div>
                      <button onClick={removeCoupon} className="text-green-600 hover:text-red-500 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                        placeholder="Enter coupon code"
                        className="flex-1 rounded-xl border border-silver-dark px-3 py-2 text-sm outline-none focus:border-royal focus:ring-2 focus:ring-royal/20 uppercase placeholder:normal-case"
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="rounded-xl bg-royal px-4 py-2 text-sm font-semibold text-white hover:bg-royal-dark disabled:opacity-50 transition-colors"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <p className="mt-1.5 text-xs text-red-500">{couponError}</p>
                  )}
                </div>

                <Link
                  href="/checkout"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-royal py-3.5 font-bold text-white hover:bg-royal-dark transition-colors shadow-sm"
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
                    { icon: <Truck size={16} className="text-royal" />, text: "Free Shipping above ₹999" },
                    { icon: <RotateCcw size={16} className="text-royal" />, text: "Easy Returns & Refunds" },
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