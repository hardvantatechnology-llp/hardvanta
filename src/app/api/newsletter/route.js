// POST /api/newsletter — { email }. Public, unauthenticated signup used by
// the Footer and Blogs-page newsletter forms.
import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`newsletter:ip:${ip}`, { limit: 10, windowMs: 60 * 60 * 1000 });
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const { prisma } = await import("@/lib/prisma");
  // Idempotent — re-submitting the same email (e.g. from both the Footer and
  // the Blogs page) is a no-op, not an error.
  await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  // Best-effort — a failed confirmation email must never fail the signup.
  try {
    const { sendNewsletterConfirmationEmail } = await import("@/lib/email");
    await sendNewsletterConfirmationEmail(email);
  } catch (err) {
    console.error("[newsletter] confirmation email failed:", err?.message || err);
  }

  return NextResponse.json({ ok: true });
}
