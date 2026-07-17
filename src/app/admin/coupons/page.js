import { Ticket } from "lucide-react";
import Pagination, { parsePage } from "@/components/admin/Pagination";

export const dynamic = "force-dynamic";
export const metadata = { title: "Coupons — Admin" };

const PAGE_SIZE = 20;

export default async function CouponsPage({ searchParams }) {
  const { prisma } = await import("@/lib/prisma");

  const page = parsePage(searchParams);
  const [coupons, total] = await Promise.all([
    prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.coupon.count(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Coupons</h1>
        <p className="text-sm text-silver-dark mt-0.5">{total} total coupons</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-silver-light bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-silver-light bg-cloud text-left text-xs font-bold uppercase tracking-wider text-silver-dark">
              <th className="px-5 py-3">Code</th>
              <th className="px-5 py-3">Discount</th>
              <th className="px-5 py-3">Expires</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-silver-light">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-silver-dark">
                  <Ticket size={32} className="mx-auto mb-2 text-silver" />
                  No coupons found
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-cloud transition-colors">
                  <td className="px-5 py-3 font-bold text-royal">{coupon.code}</td>
                  <td className="px-5 py-3 font-semibold text-navy">{coupon.discount}% off</td>
                  <td className="px-5 py-3 text-silver-dark">
                    {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString("en-IN") : "No expiry"}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      coupon.active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                    }`}>
                      {coupon.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} basePath="/admin/coupons" />
    </div>
  );
}
