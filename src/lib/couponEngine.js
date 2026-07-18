// Single source of truth for coupon discount math + eligibility, shared by
// the customer-facing feed/validate routes, the order/payment routes that
// enforce the discount server-side, and the admin list's status badges —
// so none of these can ever disagree with each other.

export function computeDiscount(coupon, subtotal) {
  let discountAmount = 0;
  if (coupon.type === "percent") {
    discountAmount = Math.round((subtotal * coupon.discount) / 100);
    if (coupon.maxDiscount) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    }
  } else {
    discountAmount = coupon.discount;
  }
  return Math.max(0, Math.min(discountAmount, subtotal));
}

/**
 * @returns {{ ok: boolean, reason?: string }}
 */
export function getEligibility(coupon, subtotal, now = new Date()) {
  if (!coupon || coupon.deletedAt) {
    return { ok: false, reason: "Invalid coupon code." };
  }
  if (!coupon.active) {
    return { ok: false, reason: "This coupon is currently unavailable." };
  }
  if (coupon.startsAt && now < new Date(coupon.startsAt)) {
    return { ok: false, reason: "This coupon is not active yet." };
  }
  if (coupon.expiresAt && now > new Date(coupon.expiresAt)) {
    return { ok: false, reason: "This coupon has expired." };
  }
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    return { ok: false, reason: "This coupon has reached its usage limit." };
  }
  if (subtotal < coupon.minOrder) {
    return { ok: false, reason: `Minimum order of ₹${coupon.minOrder} required for this coupon.` };
  }
  return { ok: true };
}

/** Derived display status for admin badges/filters — layered on top of the raw `active` boolean. */
export function getComputedStatus(coupon, now = new Date()) {
  if (coupon.expiresAt && now > new Date(coupon.expiresAt)) return "EXPIRED";
  if (coupon.startsAt && now < new Date(coupon.startsAt)) return "SCHEDULED";
  return coupon.active ? "ACTIVE" : "INACTIVE";
}
