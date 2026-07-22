"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PartyPopper } from "lucide-react";

export default function OrderSuccessBanner() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="mb-6 flex items-center gap-4 rounded-3xl glass-brand-card p-5 shadow-brand-glow"
    >
      <motion.div
        initial={reduce ? false : { scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 14, delay: reduce ? 0 : 0.15 }}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-navy shadow-brand-glow"
      >
        <PartyPopper size={22} className="text-white" />
      </motion.div>
      <div>
        <p className="font-bold text-brand-text">Order placed successfully!</p>
        <p className="text-sm text-brand-muted">We&apos;ll deliver it soon — thanks for shopping with us.</p>
      </div>
    </motion.div>
  );
}
