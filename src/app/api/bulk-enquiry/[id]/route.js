// PATCH /api/bulk-enquiry/[id] — update an enquiry's status (admin only).
// Serves both the "B2B / Bulk Orders" and "Bulk Enquiries" admin sections,
// which are just two filtered views over this same table.
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["NEW", "CONTACTED", "QUOTATION_SENT", "WON", "LOST", "COMPLETED"];

export async function PATCH(request, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { status } = await request.json();
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const enquiry = await prisma.bulkEnquiry
    .update({ where: { id: params.id }, data: { status } })
    .catch(() => null);

  if (!enquiry) {
    return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  }
  return NextResponse.json({ enquiry });
}
