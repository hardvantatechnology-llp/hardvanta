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

// Fixed allowlist of accepted image MIME types → file extension. SVG is
// deliberately excluded since it can embed executable script content.
const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

async function saveOne(file, supabase) {
  const ext = ALLOWED_TYPES[file.type?.toLowerCase()];
  if (!ext) {
    throw new Error("Only JPG, PNG, WEBP, or GIF images are allowed.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Each image must be under 5MB.");
  }
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
