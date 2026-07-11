import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json(
        { valid: false, message: "Please enter a coupon code." },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    // Coupon exist karta hai?
    if (!coupon) {
      return NextResponse.json(
        { valid: false, message: "Invalid coupon code." }
      );
    }

    // Active hai?
    if (!coupon.active) {
      return NextResponse.json(
        { valid: false, message: "This coupon is no longer active." }
      );
    }

    // Expired toh nahi?
    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return NextResponse.json(
        { valid: false, message: "This coupon has expired." }
      );
    }

    // Min order check
    if (subtotal < coupon.minOrder) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order of ₹${coupon.minOrder} required for this coupon.`,
      });
    }

    // Discount calculate karo
    let discountAmount = 0;
    if (coupon.type === "percent") {
      discountAmount = Math.round((subtotal * coupon.discount) / 100);
      // Max discount cap (agar set hai)
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else {
      // flat discount
      discountAmount = coupon.discount;
    }

    // Discount subtotal se zyada na ho
    discountAmount = Math.min(discountAmount, subtotal);

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