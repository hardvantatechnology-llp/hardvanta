// Persists the logged-in user's chosen delivery location server-side.
//   GET    /api/delivery/location → the caller's saved location, or null
//   PUT    /api/delivery/location → set/replace it { pincode, areaLabel, city, deliveryAreaId? }
//   DELETE /api/delivery/location → clear it
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

async function requireUser() {
  const { getAuthOptions } = await import("@/lib/auth");
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export async function GET() {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const location = await prisma.userSelectedLocation.findUnique({ where: { userId } });
  return NextResponse.json({ location });
}

export async function PUT(request) {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { pincode, areaLabel, city, deliveryAreaId } = await request.json();
  if (!pincode || !areaLabel || !city) {
    return NextResponse.json({ error: "pincode, areaLabel and city are required." }, { status: 400 });
  }

  const location = await prisma.userSelectedLocation.upsert({
    where: { userId },
    update: { pincode, areaLabel, city, deliveryAreaId: deliveryAreaId ?? null },
    create: { userId, pincode, areaLabel, city, deliveryAreaId: deliveryAreaId ?? null },
  });
  return NextResponse.json({ location });
}

export async function DELETE() {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.userSelectedLocation.deleteMany({ where: { userId } });
  return NextResponse.json({ success: true });
}
