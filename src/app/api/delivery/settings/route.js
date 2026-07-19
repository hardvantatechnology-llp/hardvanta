// GET /api/delivery/settings — public store-wide shipping config (free-
// shipping threshold + delivery charge) so the cart/checkout pages reflect
// whatever the admin has configured in DeliverySettings instead of a
// hardcoded number baked into the client.
import { NextResponse } from "next/server";
import { getDeliverySettings } from "@/lib/delivery";

export async function GET() {
  const settings = await getDeliverySettings();
  return NextResponse.json({
    freeShippingThreshold: settings.freeShippingThreshold,
    deliveryCharge: settings.deliveryCharge,
  });
}
