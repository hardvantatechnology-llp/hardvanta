// POST /api/contact — saves a "Send Us a Message" submission from /contact.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEnquiryAdminNotification, sendContactConfirmationEmail } from "@/lib/email";

// Best-effort in-memory rate limiter (per server instance) to curb spam
// submissions to this public, unauthenticated endpoint.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateLimitHits = new Map();

function isRateLimited(key) {
  const now = Date.now();
  const entry = rateLimitHits.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitHits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

function getClientKey(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/;

const MAX_LEN = {
  name: 100,
  email: 150,
  phone: 10,
  subject: 100,
  message: 2000,
};

export async function POST(request) {
  try {
    if (isRateLimited(getClientKey(request))) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, subject, message } = body;

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: "Please fill in your name, email, and message." },
        { status: 400 }
      );
    }
    if (
      typeof firstName !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string"
    ) {
      return NextResponse.json({ error: "Invalid field types." }, { status: 400 });
    }

    const name = `${firstName} ${lastName || ""}`.trim();

    if (!EMAIL_RE.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }
    if (phone && !PHONE_RE.test(String(phone).trim())) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit Indian mobile number, or leave it blank." },
        { status: 400 }
      );
    }
    if (
      name.length > MAX_LEN.name ||
      email.length > MAX_LEN.email ||
      message.length > MAX_LEN.message ||
      (subject && String(subject).length > MAX_LEN.subject)
    ) {
      return NextResponse.json(
        { error: "One or more fields exceed the maximum allowed length." },
        { status: 400 }
      );
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email: email.trim(),
        phone: phone ? String(phone).trim() : null,
        subject: subject ? String(subject).trim() : null,
        message: message.trim(),
      },
    });

    // The message is already saved at this point — a failure sending either
    // email must never turn a successful submission into an error response.
    try {
      await Promise.all([
        sendEnquiryAdminNotification({
          formType: "Contact",
          id: contactMessage.id,
          name: contactMessage.name,
          email: contactMessage.email,
          phone: contactMessage.phone,
          message: contactMessage.message,
        }),
        sendContactConfirmationEmail({ to: contactMessage.email, name: contactMessage.name }),
      ]);
    } catch (emailErr) {
      console.error("POST /api/contact email notification error:", emailErr);
    }

    return NextResponse.json({ success: true, id: contactMessage.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/contact error:", err);
    return NextResponse.json(
      { error: "Could not send your message. Please try again later." },
      { status: 500 }
    );
  }
}
