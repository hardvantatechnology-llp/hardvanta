// PATCH  /api/addresses/:id → update a saved address (partial)
// DELETE /api/addresses/:id → remove a saved address
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { sanitizeAddressInput } from "@/lib/addressValidation";

async function requireUser() {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export async function PATCH(request, { params }) {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { data, error } = sanitizeAddressInput(body, { partial: true });
  if (error) return NextResponse.json({ error }, { status: 400 });

  const { prisma } = await import("@/lib/prisma");
  const makeDefault = data.isDefault === true;

  const addresses = await prisma.$transaction(async (tx) => {
    // Scoped to userId so one user can never edit another's address.
    if (makeDefault) {
      await tx.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }
    const { count } = await tx.address.updateMany({
      where: { id: params.id, userId },
      data,
    });
    if (count === 0) return null;
    return tx.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  });

  if (!addresses) {
    return NextResponse.json({ error: "Address not found." }, { status: 404 });
  }
  return NextResponse.json({ addresses });
}

export async function DELETE(request, { params }) {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prisma } = await import("@/lib/prisma");

  const addresses = await prisma.$transaction(async (tx) => {
    const existing = await tx.address.findFirst({
      where: { id: params.id, userId },
      select: { id: true, isDefault: true },
    });
    if (!existing) return null;

    await tx.address.delete({ where: { id: existing.id } });

    // Leaving the address book without a default (when one still exists)
    // would silently break the "pre-select default" checkout behavior.
    if (existing.isDefault) {
      const next = await tx.address.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      if (next) {
        await tx.address.update({ where: { id: next.id }, data: { isDefault: true } });
      }
    }

    return tx.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  });

  if (!addresses) {
    return NextResponse.json({ error: "Address not found." }, { status: 404 });
  }
  return NextResponse.json({ addresses });
}
