"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";
import { imageSrc } from "@/utils/imageSrc";
import Button from "@/components/ui/Button";
import QuantityModal from "@/components/ui/QuantityModal";

export default function CartDrawer({ open, onClose }) {
  const { items, updateQuantity, removeItem, total, count } = useCart();
  const [mounted, setMounted] = useState(false);
  // Tracks which item's quantity modal is open — same click-to-edit
  // interaction as the cart page.
  const [modalItemId, setModalItemId] = useState(null);
  const modalItem = modalItemId ? items.find((i) => i.id === modalItemId) : null;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        aria-hidden={!open}
        className={`fixed inset-0 z-[90] h-screen w-screen bg-brand-navy/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sliding panel */}
      <aside
        role="dialog"
        aria-label="Cart"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-[100] flex h-screen w-[90%] max-w-[400px] flex-col glass-brand-strong shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-brand-border bg-gradient-to-r from-brand-blue to-brand-navy px-5 py-4">
          <span className="flex items-center gap-2 text-base font-semibold text-white">
            <ShoppingBag size={18} /> Your Cart {count > 0 && `(${count})`}
          </span>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="rounded-full p-1.5 text-white transition-colors hover:bg-white/20"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        {count === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue/20 to-brand-navy/20 shadow-brand-glow">
              <ShoppingBag size={28} className="text-brand-blue" />
            </div>
            <p className="font-semibold text-brand-text">Your cart is empty</p>
            <p className="text-sm text-brand-muted">Add some products to get started.</p>
            <Button href="/products" variant="brand-gradient" onClick={onClose} className="mt-2">
              Browse Products
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
              <AnimatePresence initial={false}>
                {items.map((item) => {
                  const price = item.salePrice ?? item.price;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mb-3 flex gap-3 overflow-hidden rounded-2xl glass-brand-card p-3"
                    >
                      <Link
                        href={`/products/${item.id}`}
                        onClick={onClose}
                        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-brand-silver"
                      >
                        <Image src={imageSrc(item.image)} alt={item.name} fill sizes="64px" className="object-contain p-1" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <Link href={`/products/${item.id}`} onClick={onClose}>
                          <p className="line-clamp-1 text-sm font-medium text-brand-text hover:text-brand-blue">
                            {item.name}
                          </p>
                        </Link>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-lg bg-brand-silver">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="flex h-6 w-6 items-center justify-center text-brand-muted hover:text-brand-text"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <button
                              onClick={() => setModalItemId(item.id)}
                              className="w-5 text-center text-xs font-semibold text-brand-text"
                              title="Click to enter quantity manually"
                            >
                              {item.quantity}
                            </button>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex h-6 w-6 items-center justify-center text-brand-muted hover:text-brand-text"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-brand-text">{formatPrice(price * item.quantity)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                        className="shrink-0 text-brand-muted transition-colors hover:text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-brand-border p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-brand-muted">Subtotal</span>
                <span className="text-xl font-bold text-brand-text">{formatPrice(total)}</span>
              </div>
              <Button href="/checkout" variant="brand-gradient" onClick={onClose} className="w-full">
                Checkout <ArrowRight size={16} />
              </Button>
              <Button href="/cart" variant="brand-glass" onClick={onClose} className="mt-2 w-full">
                View Cart
              </Button>
            </div>
          </>
        )}
      </aside>

      <QuantityModal
        open={!!modalItem}
        currentQty={modalItem?.quantity ?? 1}
        onClose={() => setModalItemId(null)}
        onApply={(qty) => modalItem && updateQuantity(modalItem.id, qty)}
      />
    </>,
    document.body
  );
}
