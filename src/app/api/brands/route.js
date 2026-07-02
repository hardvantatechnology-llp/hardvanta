import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ brands });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { name } = await req.json();

    const brand = await prisma.brand.create({
      data: {
        name,
        slug: slugify(name),
      },
    });

    return NextResponse.json({ brand });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}