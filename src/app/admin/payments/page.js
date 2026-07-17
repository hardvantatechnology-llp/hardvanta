import { CreditCard } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import Pagination, { parsePage } from "@/components/admin/Pagination";

export const dynamic = "force-dynamic";
export const metadata = { title: "Payments — Admin" };

const PAGE_SIZE = 20;

export default async function PaymentsPage({ searchParams }) {
  const { prisma } = await import("@/lib/prisma");

  const page = parsePage(searchParams);
  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: { order: { include: { user: true } } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.payment.count(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const STATUS_STYLES = {
    PENDING: "bg-yellow-50 text-yellow-700",
    SUCCESS: "bg-green-50 text-green-700",
    FAILED: "bg-red-50 text-red-600",
    REFUNDED: "bg-purple-50 text-purple-700",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Payments</h1>
        <p className="text-sm text-silver-dark mt-0.5">{total} total payments</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-silver-light bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-silver-light bg-cloud text-left text-xs font-bold uppercase tracking-wider text-silver-dark">
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Method</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-silver-light">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-silver-dark">
                  <CreditCard size={32} className="mx-auto mb-2 text-silver" />
                  No payments found
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-cloud transition-colors">
                  <td className="px-5 py-3 font-semibold text-royal">#{payment.orderId.slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-3 text-silver-dark">{payment.order?.user?.name || "—"}</td>
                  <td className="px-5 py-3 text-silver-dark">{payment.method}</td>
                  <td className="px-5 py-3 font-bold text-navy">{formatPrice(payment.amount)}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[payment.status] || "bg-gray-100"}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-silver-dark">
                    {new Date(payment.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} basePath="/admin/payments" />
    </div>
  );
}