// POST /api/upload — admin uploads one OR many image files, returns their URLs.
// Body: multipart/form-data with one or more "file" fields.
//
// Uses Supabase Storage when configured (best for production / shared use).
// Falls back to saving into /public/uploads locally so the upload button works
// out of the box in development without any Supabase setup.
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { isAdmin } from "@/lib/admin";
import { getSupabaseAdmin, PRODUCT_BUCKET } from "@/lib/supabase";

async function saveOne(file, supabase) {
  if (!file.type?.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Each image must be under 5MB.");
  }
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();

  if (supabase) {
    const { error } = await supabase.storage
      .from(PRODUCT_BUCKET)
      .upload(filename, arrayBuffer, { contentType: file.type, upsert: false });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(filename);
    return data.publicUrl;
  }

  // Local fallback → /public/uploads
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), Buffer.from(arrayBuffer));
  return `/uploads/${filename}`;
}

export async function POST(request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const files = formData.getAll("file").filter((f) => f && typeof f !== "string");
  if (files.length === 0) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  try {
    const urls = [];
    for (const file of files) {
      urls.push(await saveOne(file, supabase));
    }
    // `url` kept for backward compatibility with single-file callers.
    return NextResponse.json({ urls, url: urls[0] });
  } catch (err) {
    return NextResponse.json(
      { error: `Upload failed: ${err?.message || "unknown error"}` },
      { status: 500 }
    );
  }
}
