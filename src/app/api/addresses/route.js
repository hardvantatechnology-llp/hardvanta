// Address book API.
//   GET  /api/addresses → current user's saved addresses (default first)
//   POST /api/addresses → save a new address for the current user
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { sanitizeAddressInput } from "@/lib/addressValidation";

async function requireUser() {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export async function GET() {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { prisma } = await import("@/lib/prisma");
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ addresses });
  } catch (err) {
    console.error("GET /api/addresses error:", err);
    return NextResponse.json({ error: "Could not load addresses." }, { status: 500 });
  }
}

export async function POST(request) {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { data, error } = sanitizeAddressInput(body);
    if (error) return NextResponse.json({ error }, { status: 400 });

    const { prisma } = await import("@/lib/prisma");

    const existingCount = await prisma.address.count({ where: { userId } });
    // First address a user ever saves is always their default — there's
    // nothing to fall back to otherwise.
    const makeDefault = data.isDefault === true || existingCount === 0;

    const addresses = await prisma.$transaction(async (tx) => {
      if (makeDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }
      await tx.address.create({
        data: { ...data, userId, isDefault: makeDefault },
      });
      return tx.address.findMany({
        where: { userId },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      });
    });

    return NextResponse.json({ addresses }, { status: 201 });
  } catch (err) {
    console.error("POST /api/addresses error:", err);
    return NextResponse.json({ error: "Could not save address." }, { status: 500 });
  }
}
