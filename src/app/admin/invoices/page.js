import { FileText } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import Pagination, { parsePage } from "@/components/admin/Pagination";

export const dynamic = "force-dynamic";
export const metadata = { title: "Invoices — Admin" };

const PAGE_SIZE = 20;

export default async function InvoicesPage({ searchParams }) {
  const { prisma } = await import("@/lib/prisma");

  const page = parsePage(searchParams);
  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      include: { order: { include: { user: true } } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.invoice.count(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Invoices</h1>
        <p className="text-sm text-silver-dark mt-0.5">{total} total invoices</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-silver-light bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-silver-light bg-cloud text-left text-xs font-bold uppercase tracking-wider text-silver-dark">
              <th className="px-5 py-3">Invoice #</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Subtotal</th>
              <th className="px-5 py-3">Tax</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-silver-light">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-silver-dark">
                  <FileText size={32} className="mx-auto mb-2 text-silver" />
                  No invoices found
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-cloud transition-colors">
                  <td className="px-5 py-3 font-bold text-royal">{inv.invoiceNumber}</td>
                  <td className="px-5 py-3 text-silver-dark">{inv.order?.user?.name || "—"}</td>
                  <td className="px-5 py-3 text-navy">{formatPrice(inv.subtotal)}</td>
                  <td className="px-5 py-3 text-navy">{formatPrice(inv.tax)}</td>
                  <td className="px-5 py-3 font-bold text-navy">{formatPrice(inv.total)}</td>
                  <td className="px-5 py-3 text-silver-dark">
                    {new Date(inv.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} basePath="/admin/invoices" />
    </div>
  );
}