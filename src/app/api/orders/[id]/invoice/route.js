import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateInvoicePDF } from "@/lib/invoice";

export async function GET(_req, { params }) {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (!order.invoiceNumber) {
      return NextResponse.json({ error: "Invoice not generated yet" }, { status: 404 });
    }

    const pdfBytes = await generateInvoicePDF(order);

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${order.invoiceNumber}.pdf`,
      },
    });
  } catch (err) {
    console.error("GET /api/orders/[id]/invoice error:", err);
    return NextResponse.json({ error: "Could not generate invoice." }, { status: 500 });
  }
}
