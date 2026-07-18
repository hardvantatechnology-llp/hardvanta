// GET /api/coupons?subtotal=123 — "available coupons" feed for the cart page.
// Returns only coupons that are eligible right now for the given subtotal
// (active, not soft-deleted, started, not expired, usage remaining, minOrder
// satisfied), each with a precomputed `discountAmount` so the client doesn't
// need to re-derive the discount math.
import { NextResponse } from "next/server";
import { getEligibility, computeDiscount } from "@/lib/couponEngine";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const subtotalParam = Number(searchParams.get("subtotal"));
    const subtotal = Number.isFinite(subtotalParam) && subtotalParam >= 0 ? subtotalParam : 0;

    const { prisma } = await import("@/lib/prisma");
    const now = new Date();

    const coupons = await prisma.coupon.findMany({
      where: {
        active: true,
        deletedAt: null,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [{ OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }],
      },
      select: {
        code: true,
        description: true,
        discount: true,
        type: true,
        minOrder: true,
        maxDiscount: true,
        expiresAt: true,
        usageLimit: true,
        usedCount: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const eligible = coupons
      .filter((c) => getEligibility(c, subtotal, now).ok)
      .map((c) => ({ ...c, discountAmount: computeDiscount(c, subtotal) }));

    return NextResponse.json({ coupons: eligible });
  } catch (err) {
    console.error("GET /api/coupons error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
