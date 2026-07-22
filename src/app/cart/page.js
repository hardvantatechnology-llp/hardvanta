"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2, Plus, Minus, ShoppingBag, ShieldCheck,
  Truck, Tag, ArrowRight, Zap, Ticket, X
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";
import { imageSrc } from "@/utils/imageSrc";
import Button from "@/components/ui/Button";
import AvailableCoupons from "@/components/cart/AvailableCoupons";
import CartDeliveryBlock from "@/components/delivery/CartDeliveryBlock";
import { useShippingSettings } from "@/hooks/useShippingSettings";

// ─── Quantity Modal ───────────────────────────────────────────────────────────
function QuantityModal({ currentQty, onClose, onApply }) {
  const [inputVal, setInputVal] = useState(String(currentQty));
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/70 backdrop-blur-md px-4"
      onClick={onClose}
    >
      {/* Modal box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        className="w-full max-w-sm glass-brand-strong rounded-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="text-base font-bold text-brand-text">Enter Quantity</h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-brand-muted hover:bg-brand-silver transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Current qty hint */}
        <p className="px-5 text-xs text-brand-muted mb-3">
          Current quantity: <span className="font-semibold text-brand-text">{currentQty}</span>
        </p>

        {/* Input */}
        <div className="px-5 pb-2">
          <input
            type="number"
            min={1}
            value={inputVal}
            onChange={(e) => { setInputVal(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            onFocus={(e) => e.target.select()}
            placeholder="Enter quantity"
            autoFocus
            className="w-full rounded-xl glass-brand-card px-4 py-3 text-sm font-semibold text-brand-text outline-none focus:shadow-brand-glow placeholder:font-normal placeholder:text-brand-muted"
          />
          {error && (
            <p className="mt-1.5 text-xs text-red-600">{error}</p>
          )}
        </div>

        {/* Divider */}
        <div className="mt-4 border-t border-brand-border" />

        {/* Action buttons */}
        <div className="grid grid-cols-2">
          <button
            onClick={onClose}
            className="py-4 text-sm font-bold text-brand-muted hover:bg-brand-silver transition-colors border-r border-brand-border"
          >
            CANCEL
          </button>
          <button
            onClick={handleApply}
            className="py-4 text-sm font-bold text-brand-blue hover:bg-brand-silver transition-colors"
          >
            APPLY
          </button>
        </div>
      </motion.div>
    </motion.div>
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
  couponError,
  couponLoading,
  applyCoupon: applyCouponCtx,
  removeCoupon: removeCouponCtx,
} = useCart();

  const [couponCode, setCouponCode] = useState("");

  const { freeShippingThreshold, deliveryCharge } = useShippingSettings();

  // Modal state — tracks which item's modal is open
  const [modalItemId, setModalItemId] = useState(null);

  // Surfaces failures from cart mutations (network errors, server errors) so
  // they don't get lost as unhandled promise rejections.
  const [cartError, setCartError] = useState("");

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
  const shipping = (subtotal - couponDiscount) >= freeShippingThreshold ? 0 : deliveryCharge;
  const grandTotal = subtotal - couponDiscount + shipping;
  const totalSaved = productDiscount + couponDiscount;

  // ── Quantity handler: + increments by 1 ────────────────────────────────────
  async function handleIncrement(item) {
    try {
      await updateQuantity(item.id, item.quantity + 1);
    } catch (e) {
      setCartError(e.message || "Could not update quantity. Please try again.");
    }
  }

  async function handleModalApply(itemId, qty) {
    try {
      await updateQuantity(itemId, qty);
    } catch (e) {
      setCartError(e.message || "Could not update quantity. Please try again.");
    }
  }

  async function handleDecrement(item) {
    try {
      await updateQuantity(item.id, item.quantity - 1);
    } catch (e) {
      setCartError(e.message || "Could not update quantity. Please try again.");
    }
  }

  async function handleRemove(id) {
    try {
      await removeItem(id);
    } catch (e) {
      setCartError(e.message || "Could not remove item. Please try again.");
    }
  }

  // ── Coupon helpers ────────────────────────────────────────────────────────
  // Delegate to the shared CartContext implementation (also used by
  // AvailableCoupons and the checkout page) so all three stay in sync.
  async function applyCoupon() {
    if (!couponCode.trim()) return;
    const { ok } = await applyCouponCtx(couponCode);
    if (ok) setCouponCode("");
  }

  function removeCoupon() {
    removeCouponCtx();
    setCouponCode("");
  }

  // ── Empty cart ────────────────────────────────────────────────────────────
  if (count === 0) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-brand-bg to-brand-silver flex flex-col items-center justify-center px-4 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue/20 to-brand-navy/20 shadow-brand-glow mx-auto mb-6">
          <ShoppingBag size={40} className="text-brand-blue" />
        </div>
        <h1 className="text-2xl font-bold text-brand-text">Your cart is empty</h1>
        <p className="mt-2 max-w-xs text-brand-muted">
          Looks like you haven&apos;t added anything yet. Let&apos;s fix that!
        </p>
        <Button href="/products" variant="brand-gradient" size="lg" className="mt-8">
          Browse Products <ArrowRight size={18} />
        </Button>
      </div>
    );
  }

  // ── Active modal item lookup ──────────────────────────────────────────────
  const modalItem = modalItemId ? items.find((i) => i.id === modalItemId) : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-brand-bg to-brand-silver">
      <div className="liquid-blob left-1/4 top-[-15%] h-96 w-96 bg-brand-blue/10" />

      {/* Quantity Modal */}
      <AnimatePresence>
        {modalItem && (
          <QuantityModal
            currentQty={modalItem.quantity}
            onClose={() => setModalItemId(null)}
            onApply={(qty) => handleModalApply(modalItem.id, qty)}
          />
        )}
      </AnimatePresence>

      {/* Page header */}
      <div className="relative border-b border-brand-border">
        <div className="container-page py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-brand-text">Shopping Cart</h1>
              <p className="text-sm text-brand-muted mt-0.5">{count} item{count !== 1 ? "s" : ""} in your cart</p>
            </div>
            <Link href="/products" className="text-sm font-semibold text-brand-blue hover:text-brand-steel hidden sm:block">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="container-page relative py-6">
        {cartError && (
          <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-600">{cartError}</p>
        )}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence initial={false}>
              {items.map((item) => {
                const price = item.salePrice ?? item.price;
                const hasDiscount = item.salePrice != null && item.price > 0;
                const discountPct = hasDiscount
                  ? Math.round(((item.price - item.salePrice) / item.price) * 100)
                  : 0;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25 }}
                    className="group flex gap-4 glass-brand-card rounded-3xl p-4 transition-all hover:shadow-brand-glow"
                  >
                    <Link href={`/products/${item.id}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-silver">
                      <Image
                        src={imageSrc(item.image)}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                      />
                      {hasDiscount && (
                        <span className="absolute left-1 top-1 rounded-md bg-gradient-to-r from-brand-blue to-brand-navy px-1.5 py-0.5 text-[10px] font-bold text-white">
                          -{discountPct}%
                        </span>
                      )}
                    </Link>

                    <div className="flex flex-1 flex-col min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link href={`/products/${item.id}`}>
                            <h3 className="line-clamp-2 text-sm font-semibold text-brand-text hover:text-brand-blue transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          {item.brand && (
                            <p className="mt-0.5 text-xs text-brand-muted">{item.brand?.name || item.brand}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-brand-muted hover:bg-red-500/10 hover:text-red-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                        {/* ── Quantity Controls ── */}
                        <div className="flex items-center rounded-lg bg-brand-silver overflow-hidden">
                          <button
                            onClick={() => handleDecrement(item)}
                            className="flex h-8 w-8 items-center justify-center text-brand-text hover:bg-brand-grey/30 transition-colors"
                          >
                            <Minus size={13} />
                          </button>

                          {/* Quantity display — click opens modal too */}
                          <button
                            onClick={() => setModalItemId(item.id)}
                            className="w-9 text-center text-sm font-bold text-brand-text hover:text-brand-blue transition-colors"
                            title="Click to enter quantity manually"
                          >
                            {item.quantity}
                          </button>

                          <button
                            onClick={() => handleIncrement(item)}
                            className="flex h-8 w-8 items-center justify-center text-brand-text hover:bg-brand-grey/30 transition-colors"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-brand-text">{formatPrice(price * item.quantity)}</p>
                          {hasDiscount && (
                            <p className="text-xs text-brand-muted/70 line-through">{formatPrice(item.price * item.quantity)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Free shipping progress bar */}
            {(subtotal - couponDiscount) < freeShippingThreshold && (
              <div className="glass-brand-card rounded-3xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-brand-steel">
                    <Truck size={16} />
                    Add {formatPrice(freeShippingThreshold - (subtotal - couponDiscount))} more for FREE shipping!
                  </div>
                  <span className="text-xs text-brand-muted font-medium">
                    {Math.round(((subtotal - couponDiscount) / freeShippingThreshold) * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-brand-border overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ width: `${Math.min(((subtotal - couponDiscount) / freeShippingThreshold) * 100, 100)}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-brand-steel to-brand-blue"
                  />
                </div>
              </div>
            )}

            {(subtotal - couponDiscount) >= freeShippingThreshold && (
              <div className="glass-brand-card rounded-3xl p-4 flex items-center gap-3">
                <Truck size={20} className="text-brand-steel shrink-0" />
                <p className="text-sm font-semibold text-brand-steel">🎉 You&apos;ve unlocked FREE shipping!</p>
              </div>
            )}

            <CartDeliveryBlock />
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="sticky top-24">
              <div className="glass-brand-strong rounded-3xl p-5">
                <h2 className="mb-4 text-base font-bold text-brand-text">Order Summary</h2>

                <div className="space-y-3 text-sm">

                  {/* MRP */}
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Total MRP ({count} item{count !== 1 ? "s" : ""})</span>
                    <span className="font-semibold text-brand-text">{formatPrice(mrpTotal)}</span>
                  </div>

                  {/* Product Discount */}
                  {productDiscount > 0 && (
                    <div className="flex justify-between text-brand-steel">
                      <span className="flex items-center gap-1.5">
                        <Tag size={13} /> Discount on MRP
                      </span>
                      <span className="font-semibold">-{formatPrice(productDiscount)}</span>
                    </div>
                  )}

                  {/* Subtotal */}
                  {productDiscount > 0 && (
                    <div className="flex justify-between border-t border-brand-border pt-3">
                      <span className="text-brand-muted">Subtotal</span>
                      <span className="font-semibold text-brand-text">{formatPrice(subtotal)}</span>
                    </div>
                  )}

                  {/* Coupon Discount */}
                  {coupon && (
                    <div className="flex justify-between text-brand-steel">
                      <span className="flex items-center gap-1.5">
                        <Ticket size={13} /> Coupon ({coupon.code})
                      </span>
                      <span className="font-semibold">-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}

                  {/* Shipping */}
                  <div className="flex justify-between">
                    <span className="text-brand-muted flex items-center gap-1.5">
                      <Truck size={13} /> Shipping
                    </span>
                    <span className={`font-semibold ${shipping === 0 ? "text-brand-steel" : "text-brand-text"}`}>
                      {shipping === 0 ? "FREE" : formatPrice(shipping)}
                    </span>
                  </div>

                </div>

                <div className="my-4 border-t border-dashed border-brand-border" />

                {/* Grand Total */}
                <div className="flex justify-between items-center">
                  <span className="font-bold text-brand-text text-base">Amount Payable</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-brand-text">{formatPrice(grandTotal)}</span>
                    {totalSaved > 0 && (
                      <p className="text-xs text-brand-steel font-medium mt-0.5">🎉 You save {formatPrice(totalSaved)}</p>
                    )}
                  </div>
                </div>

                {/* Coupon Input */}
                <div className="mt-4">
                  {coupon ? (
                    <div className="flex items-center justify-between rounded-xl border border-brand-steel/30 bg-brand-steel/10 px-3 py-2.5">
                      <div className="flex items-center gap-2 text-sm text-brand-steel font-semibold">
                        <Ticket size={15} />
                        {coupon.code} applied!
                      </div>
                      <button onClick={removeCoupon} className="text-brand-steel hover:text-red-600 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                        placeholder="Enter coupon code"
                        className="flex-1 rounded-xl glass-brand-card px-3 py-2 text-sm text-brand-text outline-none focus:shadow-brand-glow uppercase placeholder:normal-case placeholder:text-brand-muted"
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="rounded-xl bg-gradient-to-r from-brand-blue to-brand-navy px-4 py-2 text-sm font-semibold text-white shadow-brand-glow hover:brightness-110 disabled:opacity-50 disabled:shadow-none transition-all"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <p className="mt-1.5 text-xs text-red-600">{couponError}</p>
                  )}
                </div>

                <Button href="/checkout" variant="brand-gradient" size="lg" className="mt-4 w-full">
                  <Zap size={17} />
                  Proceed to Checkout
                </Button>

                <Link
                  href="/products"
                  className="mt-3 block text-center text-sm font-medium text-brand-muted hover:text-brand-blue transition-colors"
                >
                  ← Continue Shopping
                </Link>
              </div>

              {/* Available Coupons */}
              <div className="mt-4">
                <AvailableCoupons />
              </div>

              {/* Trust badges */}
              <div className="mt-4 glass-brand-card rounded-3xl p-4">
                <div className="space-y-3">
                  {[
                    { icon: <ShieldCheck size={16} className="text-brand-steel" />, text: "100% Secure Checkout" },
                    { icon: <Truck size={16} className="text-brand-blue" />, text: `Free Shipping above ${formatPrice(freeShippingThreshold)}` },
                  ].map((badge) => (
                    <div key={badge.text} className="flex items-center gap-3 text-sm text-brand-muted">
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
