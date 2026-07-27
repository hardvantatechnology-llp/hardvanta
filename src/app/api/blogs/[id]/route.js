// PATCH /api/blogs/[id] — update a blog (admin only).
// DELETE /api/blogs/[id] — delete a blog (admin only).
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";

export async function PATCH(request, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { prisma } = await import("@/lib/prisma");
    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, category, author, published } = body;

    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json(
        { error: "Title, slug, excerpt and content are required." },
        { status: 400 }
      );
    }

    // If slug changed, make sure the new one isn't already taken by another blog.
    const slugOwner = await prisma.blog.findUnique({ where: { slug } });
    if (slugOwner && slugOwner.id !== id) {
      return NextResponse.json(
        { error: "A blog with this slug already exists." },
        { status: 400 }
      );
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage: coverImage || "",
        category: category || "General",
        author: author || "HV KART Team",
        published: published ?? true,
      },
    });
    return NextResponse.json(blog);
  } catch (err) {
    return NextResponse.json(
      { error: `Could not update blog: ${err?.message || "unknown error"}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { prisma } = await import("@/lib/prisma");

    await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: `Could not delete blog: ${err?.message || "unknown error"}` },
      { status: 500 }
    );
  }
}