// POST /api/register — create a new email/password user.
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }
    if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }
    // Indian mobile number: 10 digits starting 6-9.
    const phoneDigits = String(phone || "").replace(/\D/g, "").slice(-10);
    if (!/^[6-9][0-9]{9}$/.test(phoneDigits)) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }
    const safeName = typeof name === "string" ? name.trim().slice(0, 100) : "";

    // Rate limit account-creation spam per-IP and per-email.
    const normalizedEmail = email.toLowerCase().trim();
    const ip = getClientIp(request);
    const byIp = checkRateLimit(`register:ip:${ip}`, { limit: 10, windowMs: 60 * 60 * 1000 });
    const byEmail = checkRateLimit(`register:email:${normalizedEmail}`, { limit: 5, windowMs: 60 * 60 * 1000 });
    if (!byIp.allowed || !byEmail.allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const { prisma } = await import("@/lib/prisma");
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    let user;
    try {
      user = await prisma.user.create({
        data: {
          name: safeName || null,
          email: normalizedEmail,
          phone: phoneDigits,
          password: hashed,
        },
        select: { id: true, name: true, email: true },
      });
    } catch (err) {
      // Two concurrent requests for the same email can both pass the
      // `existing` check above before either insert commits — the DB's
      // unique constraint is the real guard, so translate its violation into
      // the same 409 the pre-check returns instead of a generic 500.
      if (err?.code === "P2002") {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 }
        );
      }
      throw err;
    }

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("register error", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
