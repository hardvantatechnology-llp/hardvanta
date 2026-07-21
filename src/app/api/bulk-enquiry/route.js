// POST /api/bulk-enquiry — saves a B2B / bulk order enquiry to the database.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import {
  isValidEmail,
  isValidPhone,
  firstFieldExceedingMaxLength,
} from "@/lib/enquiryValidation";
import { sendEnquiryAdminNotification, sendEnquiryConfirmationEmail } from "@/lib/email";

const MAX_LEN = {
  name: 100,
  organization: 150,
  email: 150,
  phone: 20,
  enquiryType: 50,
  products: 1000,
  quantity: 50,
  message: 2000,
};

export async function POST(request) {
  try {
    const { allowed } = checkRateLimit(`bulk-enquiry:${getClientIp(request)}`, {
      limit: 5,
      windowMs: 60_000,
    });
    if (!allowed) {
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
      typeof products !== "string" ||
      typeof quantity !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid field types." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    if (!quantity.trim()) {
      return NextResponse.json(
        { error: "Please enter a valid quantity." },
        { status: 400 }
      );
    }

    const badField = firstFieldExceedingMaxLength(
      { name, organization, email, phone, enquiryType, products, quantity, message },
      MAX_LEN
    );
    if (badField) {
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
        quantity: quantity.trim(),
        message: message ? String(message).trim() : null,
      },
    });

    // The enquiry is already saved at this point — a failure sending either
    // email must never turn a successful submission into an error response.
    try {
      const formType = enquiry.enquiryType === "B2B / Bulk" ? "B2B / Bulk Order" : "Bulk";
      await Promise.all([
        sendEnquiryAdminNotification({
          formType,
          id: enquiry.id,
          name: enquiry.name,
          company: enquiry.organization,
          email: enquiry.email,
          phone: enquiry.phone,
          product: enquiry.products,
          quantity: enquiry.quantity,
          message: enquiry.message,
        }),
        sendEnquiryConfirmationEmail({ to: enquiry.email, name: enquiry.name, formType }),
      ]);
    } catch (emailErr) {
      console.error("POST /api/bulk-enquiry email notification error:", emailErr);
    }

    return NextResponse.json({ success: true, id: enquiry.id });
  } catch (err) {
    console.error("POST /api/bulk-enquiry error:", err);
    return NextResponse.json(
      { error: "Could not submit enquiry. Please try again later." },
      { status: 500 }
    );
  }
}
