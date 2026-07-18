import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authOptions = await getAuthOptions();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Login karo" }, { status: 401 });

    // Only the fields the wishlist page actually renders — the nav's heart
    // icon only needs `productId`, and the full wishlist grid only needs
    // these few product fields, not the entire Product row.
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        productId: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            price: true,
            salePrice: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(wishlist);
  } catch (err) {
    console.error("Wishlist GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authOptions = await getAuthOptions();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Login karo" }, { status: 401 });

    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ error: "productId chahiye" }, { status: 400 });

    const item = await prisma.wishlist.upsert({
      where: { userId_productId: { userId: session.user.id, productId } },
      update: {},
      create: { userId: session.user.id, productId },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("Wishlist POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const authOptions = await getAuthOptions();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Login karo" }, { status: 401 });

    const { productId } = await req.json();

    await prisma.wishlist.deleteMany({
      where: { userId: session.user.id, productId },
    });

    return NextResponse.json({ message: "Removed" });
  } catch (err) {
    console.error("Wishlist DELETE error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}