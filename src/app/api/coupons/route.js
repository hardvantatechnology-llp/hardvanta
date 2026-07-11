import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const coupons = await prisma.coupon.findMany({
      where: {
        active: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }]
      },
      select: {
        code: true,
        description: true,
        discount: true,
        type: true,
        minOrder: true,
      }
    });
    return NextResponse.json(coupons);
  } catch (err) {
    console.error("GET /api/coupons error:", err);
    return NextResponse.json({ error: "Internal server error", details: err.message }, { status: 500 });
  }
}