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

export default function CartDrawer({ open, onClose }) {
  const { items, updateQuantity, removeItem, total, count } = useCart();
  const [mounted, setMounted] = useState(false);

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
        className={`fixed inset-0 z-[90] h-screen w-screen bg-obsidian/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sliding panel */}
      <aside
        role="dialog"
        aria-label="Cart"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-[100] flex h-screen w-[90%] max-w-[400px] flex-col glass-strong shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-gradient-to-r from-electric to-liquid px-5 py-4">
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
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-electric/20 to-liquid/20 shadow-glow-electric">
              <ShoppingBag size={28} className="text-electric-light" />
            </div>
            <p className="font-semibold text-white">Your cart is empty</p>
            <p className="text-sm text-white/50">Add some products to get started.</p>
            <Button href="/products" variant="gradient" onClick={onClose} className="mt-2">
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
                      className="mb-3 flex gap-3 overflow-hidden rounded-2xl glass-card p-3"
                    >
                      <Link
                        href={`/products/${item.id}`}
                        onClick={onClose}
                        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5"
                      >
                        <Image src={imageSrc(item.image)} alt={item.name} fill sizes="64px" className="object-contain p-1" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <Link href={`/products/${item.id}`} onClick={onClose}>
                          <p className="line-clamp-1 text-sm font-medium text-white/90 hover:text-electric-light">
                            {item.name}
                          </p>
                        </Link>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-lg bg-white/5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="flex h-6 w-6 items-center justify-center text-white/70 hover:text-white"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-5 text-center text-xs font-semibold text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex h-6 w-6 items-center justify-center text-white/70 hover:text-white"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-white">{formatPrice(price * item.quantity)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                        className="shrink-0 text-white/30 transition-colors hover:text-red-400"
                      >
                        <Trash2 size={15} />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-white/10 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-white/60">Subtotal</span>
                <span className="text-xl font-bold text-white">{formatPrice(total)}</span>
              </div>
              <Button href="/checkout" variant="gradient" onClick={onClose} className="w-full">
                Checkout <ArrowRight size={16} />
              </Button>
              <Button href="/cart" variant="glass" onClick={onClose} className="mt-2 w-full">
                View Cart
              </Button>
            </div>
          </>
        )}
      </aside>
    </>,
    document.body
  );
}
