import { Ticket } from "lucide-react";
import Pagination, { parsePage } from "@/components/admin/Pagination";
import AdminSearchInput from "@/components/admin/AdminSearchInput";

export const dynamic = "force-dynamic";
export const metadata = { title: "Coupons — Admin" };

const PAGE_SIZE = 20;

export default async function CouponsPage({ searchParams }) {
  const { prisma } = await import("@/lib/prisma");

  const page = parsePage(searchParams);
  const q = searchParams?.q?.trim();
  const where = q ? { code: { contains: q, mode: "insensitive" } } : {};

  const [coupons, total] = await Promise.all([
    prisma.coupon.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.coupon.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Coupons</h1>
        <p className="text-sm text-white/40 mt-0.5">{total} total coupons</p>
      </div>

      <div className="mb-4">
        <AdminSearchInput placeholder="Search by code…" basePath="/admin/coupons" searchParams={searchParams} />
      </div>

      <div className="overflow-hidden rounded-2xl glass-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-left text-xs font-bold uppercase tracking-wider text-white/40">
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Discount</th>
                <th className="px-5 py-3">Expires</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-white/50">
                    <Ticket size={32} className="mx-auto mb-2 text-white/20" />
                    No coupons found
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3 font-bold text-electric-light">{coupon.code}</td>
                    <td className="px-5 py-3 font-semibold text-white/90">{coupon.discount}% off</td>
                    <td className="px-5 py-3 text-white/40">
                      {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString("en-IN") : "No expiry"}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        coupon.active ? "bg-cyan/10 text-cyan" : "bg-red-500/10 text-red-400"
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
      </div>

      <Pagination page={page} totalPages={totalPages} basePath="/admin/coupons" searchParams={searchParams} />
    </div>
  );
}
