import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { getEligibility, computeDiscount } from "@/lib/couponEngine";

export async function POST(req) {
  try {
    const { allowed } = checkRateLimit(`coupon-validate:${getClientIp(req)}`, {
      limit: 20,
      windowMs: 60_000,
    });
    if (!allowed) {
      return NextResponse.json(
        { valid: false, message: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json(
        { valid: false, message: "Please enter a coupon code." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(subtotal) || subtotal < 0) {
      return NextResponse.json(
        { valid: false, message: "Invalid order subtotal." },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json({ valid: false, message: "Invalid coupon code." });
    }

    const eligibility = getEligibility(coupon, subtotal);
    if (!eligibility.ok) {
      return NextResponse.json({ valid: false, message: eligibility.reason });
    }

    const discountAmount = computeDiscount(coupon, subtotal);

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discount: coupon.discount,
      discountAmount,
      message: "Coupon applied successfully!",
    });
  } catch (err) {
    console.error("Coupon validate error:", err);
    return NextResponse.json(
      { valid: false, message: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
