// GET /api/delivery/check?pincode= — public serviceability + delivery-date estimate.
import { NextResponse } from "next/server";
import { getDeliveryEstimate } from "@/lib/delivery";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get("pincode") || "";

  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`delivery-check:ip:${ip}`, { limit: 60, windowMs: 60 * 1000 });
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const estimate = await getDeliveryEstimate(pincode);
  return NextResponse.json(estimate);
}
