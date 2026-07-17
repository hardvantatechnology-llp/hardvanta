// POST /api/bulk-enquiry — saves a B2B / bulk order enquiry to the database.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
const PHONE_RE = /^[0-9+\-()\s]{7,20}$/;

const MAX_LEN = {
  name: 100,
  organization: 150,
  email: 150,
  phone: 20,
  enquiryType: 50,
  products: 1000,
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
    const { name, organization, email, phone, enquiryType, products, quantity, message } = body;

    if (!name || !email || !phone || !products || !quantity) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof phone !== "string" ||
      typeof products !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid field types." },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!PHONE_RE.test(phone.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    const quantityNum = Number(quantity);
    if (!Number.isFinite(quantityNum) || quantityNum <= 0 || quantityNum > 1_000_000) {
      return NextResponse.json(
        { error: "Please enter a valid quantity." },
        { status: 400 }
      );
    }

    if (
      name.length > MAX_LEN.name ||
      email.length > MAX_LEN.email ||
      phone.length > MAX_LEN.phone ||
      products.length > MAX_LEN.products ||
      (organization && String(organization).length > MAX_LEN.organization) ||
      (enquiryType && String(enquiryType).length > MAX_LEN.enquiryType) ||
      (message && String(message).length > MAX_LEN.message)
    ) {
      return NextResponse.json(
        { error: "One or more fields exceed the maximum allowed length." },
        { status: 400 }
      );
    }

    const enquiry = await prisma.bulkEnquiry.create({
      data: {
        name: name.trim(),
        organization: organization ? String(organization).trim() : null,
        email: email.trim(),
        phone: phone.trim(),
        enquiryType: enquiryType || "Other",
        products: products.trim(),
        quantity,
        message: message ? String(message).trim() : null,
      },
    });

    return NextResponse.json({ success: true, id: enquiry.id });
  } catch (err) {
    console.error("POST /api/bulk-enquiry error:", err);
    return NextResponse.json(
      { error: "Could not submit enquiry. Please try again later." },
      { status: 500 }
    );
  }
}
