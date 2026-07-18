"use client";

import { Ticket, CheckCircle2, Star, Calendar } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";
import { useToast } from "@/components/ui/Toast";

export default function AvailableCoupons() {
  const { availableCoupons, bestCoupon, coupon, applyCoupon } = useCart();
  const toast = useToast();

  if (availableCoupons.length === 0) return null;

  async function handleApply(code) {
    await applyCoupon(code);
    toast.success(`Coupon ${code} applied!`);
  }

  return (
    <div className="glass-card rounded-3xl p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
        <Ticket size={16} className="text-electric-light" /> Available Coupons
      </h3>
      <div className="space-y-2.5">
        {availableCoupons.map((c) => {
          const isBest = bestCoupon && c.code === bestCoupon.code;
          const isApplied = coupon?.code === c.code;
          return (
            <div
              key={c.code}
              className={`rounded-2xl border p-3 transition-all ${
                isApplied ? "border-cyan/40 bg-cyan/5" : isBest ? "border-electric/40 bg-electric/5" : "border-white/10"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white">{c.code}</span>
                    {isBest && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-electric to-liquid px-2 py-0.5 text-[10px] font-bold text-white">
                        <Star size={10} fill="currentColor" /> Best Offer
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs font-semibold text-cyan">
                    Save {formatPrice(c.discountAmount)}
                    {c.type === "percent" ? ` (${c.discount}% off)` : ""}
                  </p>
                  {c.description && <p className="mt-1 text-xs text-white/50 line-clamp-2">{c.description}</p>}
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-white/40">
                    {c.minOrder > 0 && <span>Min order {formatPrice(c.minOrder)}</span>}
                    {c.expiresAt && (
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        Expires {new Date(c.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    )}
                  </div>
                </div>

                {isApplied ? (
                  <span className="flex shrink-0 items-center gap-1 rounded-lg bg-cyan/10 px-3 py-1.5 text-xs font-semibold text-cyan">
                    <CheckCircle2 size={13} /> Applied ✓
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleApply(c.code)}
                    className="shrink-0 rounded-lg bg-gradient-to-r from-electric to-liquid px-3 py-1.5 text-xs font-semibold text-white shadow-glow-electric hover:brightness-110 transition-all"
                  >
                    Apply
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
