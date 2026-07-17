"use client";

import { motion } from "framer-motion";
import { Check, Clock, Package, Truck, Home, XCircle } from "lucide-react";

// The normal forward journey of an order. CANCELLED is handled separately.
const STEPS = [
  { key: "PENDING", label: "Order Placed", Icon: Clock },
  { key: "PROCESSING", label: "Processing", Icon: Package },
  { key: "SHIPPED", label: "Shipped", Icon: Truck },
  { key: "DELIVERED", label: "Delivered", Icon: Home },
];

export default function OrderTracker({ status }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400">
        <XCircle size={18} />
        This order was cancelled.
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const Icon = step.Icon;
        return (
          <div key={step.key} className="flex flex-1 items-center last:flex-none">
            {/* Node */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{ scale: active ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  done
                    ? "bg-gradient-to-br from-electric to-liquid text-white shadow-glow-electric"
                    : active
                      ? "glass-card text-electric-light ring-2 ring-electric/40"
                      : "glass-card text-white/25"
                }`}
              >
                {done ? <Check size={18} /> : <Icon size={16} />}
              </motion.div>
              <span
                className={`mt-1.5 w-20 text-center text-[11px] font-medium leading-tight ${
                  done || active ? "text-white/85" : "text-white/30"
                }`}
              >
                {step.label}
              </span>
            </div>
            {/* Connector line (not after the last node) */}
            {i < STEPS.length - 1 && (
              <div className="-mt-5 h-0.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={false}
                  animate={{ width: i < currentIndex ? "100%" : "0%" }}
                  transition={{ duration: 0.4 }}
                  className="h-full bg-gradient-to-r from-electric to-liquid"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
