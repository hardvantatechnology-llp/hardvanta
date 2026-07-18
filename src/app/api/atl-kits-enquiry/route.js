// POST /api/atl-kits-enquiry — saves an ATL Kits enquiry to the database.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import {
  isValidEmail,
  isValidPhone,
  firstFieldExceedingMaxLength,
  isValidBoundedInt,
} from "@/lib/enquiryValidation";
import { sendEnquiryAdminNotification, sendEnquiryConfirmationEmail } from "@/lib/email";

const MAX_LEN = {
  schoolName: 150,
  contactPerson: 100,
  designation: 100,
  email: 150,
  phone: 20,
  state: 50,
  kits: 300,
  budgetRange: 50,
  udise: 20,
  message: 2000,
};

export async function POST(request) {
  try {
    const { allowed } = checkRateLimit(`atl-kits-enquiry:${getClientIp(request)}`, {
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
    const {
      schoolName,
      contactPerson,
      designation,
      phone,
      email,
      state,
      kits,
      quantity,
      budgetRange,
      udise,
      message,
    } = body;

    if (!schoolName || !contactPerson || !phone || !email || !state || quantity == null) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (
      typeof schoolName !== "string" ||
      typeof contactPerson !== "string" ||
      typeof phone !== "string" ||
      typeof email !== "string" ||
      typeof state !== "string"
    ) {
      return NextResponse.json({ error: "Invalid field types." }, { status: 400 });
    }

    if (!Array.isArray(kits) || kits.length === 0 || !kits.every((k) => typeof k === "string")) {
      return NextResponse.json(
        { error: "Please select at least one kit." },
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

    if (!isValidBoundedInt(quantity, { min: 1, max: 100_000 })) {
      return NextResponse.json(
        { error: "Please enter a valid quantity." },
        { status: 400 }
      );
    }

    const kitsJoined = kits.map((k) => k.trim()).filter(Boolean).join(", ");

    const badField = firstFieldExceedingMaxLength(
      { schoolName, contactPerson, designation, email, phone, state, kits: kitsJoined, budgetRange, udise, message },
      MAX_LEN
    );
    if (badField) {
      return NextResponse.json(
        { error: "One or more fields exceed the maximum allowed length." },
        { status: 400 }
      );
    }

    const enquiry = await prisma.atlKitsEnquiry.create({
      data: {
        schoolName: schoolName.trim(),
        contactPerson: contactPerson.trim(),
        designation: designation ? String(designation).trim() : null,
        phone: phone.trim(),
        email: email.trim(),
        state: state.trim(),
        kits: kitsJoined,
        quantity: Math.trunc(Number(quantity)),
        budgetRange: budgetRange ? String(budgetRange).trim() : null,
        udise: udise ? String(udise).trim() : null,
        message: message ? String(message).trim() : null,
      },
    });

    // The enquiry is already saved at this point — a failure sending either
    // email must never turn a successful submission into an error response.
    try {
      await Promise.all([
        sendEnquiryAdminNotification({
          formType: "ATL Kits",
          id: enquiry.id,
          name: enquiry.contactPerson,
          company: enquiry.schoolName,
          email: enquiry.email,
          phone: enquiry.phone,
          product: enquiry.kits,
          quantity: enquiry.quantity,
          message: enquiry.message,
        }),
        sendEnquiryConfirmationEmail({
          to: enquiry.email,
          name: enquiry.contactPerson,
          formType: "ATL Kits",
        }),
      ]);
    } catch (emailErr) {
      console.error("POST /api/atl-kits-enquiry email notification error:", emailErr);
    }

    return NextResponse.json({ success: true, id: enquiry.id });
  } catch (err) {
    console.error("POST /api/atl-kits-enquiry error:", err);
    return NextResponse.json(
      { error: "Could not submit enquiry. Please try again later." },
      { status: 500 }
    );
  }
}
