"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

// Shared "enter quantity" modal — originally inline in the cart page, now
// reused everywhere quantity can be edited (product page, cart page, cart
// drawer) so there's a single click-to-edit interaction across the site.
export default function QuantityModal({ open, currentQty, onClose, onApply }) {
  const [inputVal, setInputVal] = useState(String(currentQty));
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();
  const titleId = useId();
  const inputRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      setInputVal(String(currentQty));
      setError("");
    }
  }, [open, currentQty]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  function handleApply() {
    const num = parseInt(inputVal, 10);
    if (!inputVal || isNaN(num) || num < 1) {
      setError("Please enter a valid quantity (min 1).");
      return;
    }
    onApply(num);
    onClose();
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          className="fixed inset-0 z-[250] flex items-center justify-center bg-brand-navy/70 backdrop-blur-md px-4"
          onClick={onClose}
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-sm glass-brand-strong rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h3 id={titleId} className="text-base font-bold text-brand-text">Enter Quantity</h3>
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
                ref={inputRef}
                type="number"
                min={1}
                value={inputVal}
                onChange={(e) => { setInputVal(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
                onFocus={(e) => e.target.select()}
                placeholder="Enter quantity"
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
      )}
    </AnimatePresence>,
    document.body
  );
}
