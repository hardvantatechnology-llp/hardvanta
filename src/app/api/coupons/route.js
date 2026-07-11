import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const coupons = await prisma.coupon.findMany({
    where: {
      active: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
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
}