// GET /api/delivery/reverse-geocode?lat=&lng= — "Use Current Location":
// turns a browser GPS coordinate into a pincode via OpenStreetMap's free
// Nominatim reverse-geocoding API (no key required), then checks
// serviceability. Nominatim's usage policy requires a descriptive
// User-Agent and asks for at most ~1 request/second — the rate limit below
// is deliberately conservative to stay well inside that.
import { NextResponse } from "next/server";
import { checkServiceability } from "@/lib/delivery";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "lat and lng are required." }, { status: 400 });
  }

  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`delivery-geocode:ip:${ip}`, { limit: 5, windowMs: 60 * 1000 });
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  let postcode = null;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { "User-Agent": "hardvanta.in delivery-location-feature (support@hardvanta.in)" } }
    );
    if (res.ok) {
      const data = await res.json();
      postcode = data?.address?.postcode || null;
    }
  } catch {
    // Fall through — treated as "could not determine location" below.
  }

  if (!postcode) {
    return NextResponse.json({ error: "Could not determine your pincode from this location. Please search manually." }, { status: 422 });
  }

  const serviceability = await checkServiceability(postcode);
  // Named `detectedPincode` (not `pincode`) so it can't collide with the
  // `pincode` object nested inside `serviceability` when serviceable — that
  // spread order previously let the nested object silently overwrite this string.
  return NextResponse.json({ detectedPincode: postcode, ...serviceability });
}
