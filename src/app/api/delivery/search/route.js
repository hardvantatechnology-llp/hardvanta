// GET /api/delivery/search?q= — public search across pincode / locality / city,
// backing the location picker's single search box.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();

  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`delivery-search:ip:${ip}`, { limit: 60, windowMs: 60 * 1000 });
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const rows = await prisma.pincode.findMany({
    where: {
      active: true,
      deliveryArea: { active: true },
      OR: [
        { code: { startsWith: q } },
        { areaLabel: { contains: q, mode: "insensitive" } },
        { deliveryArea: { name: { contains: q, mode: "insensitive" } } },
      ],
    },
    include: { deliveryArea: true },
    take: 20,
    orderBy: { code: "asc" },
  });

  const results = rows.map((row) => ({
    pincode: row.code,
    areaLabel: row.areaLabel,
    city: row.deliveryArea.name,
    deliveryAreaId: row.deliveryArea.id,
  }));

  return NextResponse.json({ results });
}
