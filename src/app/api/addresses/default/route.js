// PATCH /api/addresses/default { id } → set one saved address as default
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";

async function requireUser() {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export async function PATCH(request) {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Address id required." }, { status: 400 });
  }

  const { prisma } = await import("@/lib/prisma");

  const addresses = await prisma.$transaction(async (tx) => {
    const existing = await tx.address.findFirst({
      where: { id, userId },
      select: { id: true },
    });
    if (!existing) return null;

    await tx.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
    await tx.address.update({ where: { id }, data: { isDefault: true } });

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
