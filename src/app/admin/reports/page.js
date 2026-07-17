import { TrendingUp, Download } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import Pagination, { parsePage } from "@/components/admin/Pagination";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reports — Admin" };

const PAGE_SIZE = 20;

export default async function ReportsPage({ searchParams }) {
  const { prisma } = await import("@/lib/prisma");

  const page = parsePage(searchParams);

  const [
    orders,
    totalOrderCount,
    revenueAgg,
    deliveredAgg,
    cancelledCount,
    topProducts,
  ] = await Promise.all([
    prisma.order.findMany({
      include: { items: true, user: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.aggregate({ where: { status: "DELIVERED" }, _sum: { total: true }, _count: true }),
    prisma.order.count({ where: { status: "CANCELLED" } }),
    prisma.orderItem.groupBy({
      by: ["productId", "productName"],
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 10,
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalOrderCount / PAGE_SIZE));

  const totalRevenue = revenueAgg._sum.total || 0;
  const deliveredRevenue = deliveredAgg._sum.total || 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Reports</h1>
        <p className="text-sm text-silver-dark mt-0.5">Sales and performance reports</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
        {[
          { label: "Total Revenue", value: formatPrice(totalRevenue), color: "text-navy" },
          { label: "Delivered Revenue", value: formatPrice(deliveredRevenue), color: "text-green-600" },
          { label: "Total Orders", value: totalOrderCount, color: "text-royal" },
          { label: "Cancelled", value: cancelledCount, color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-silver-light bg-white p-4 shadow-card">
            <p className="text-xs text-silver-dark font-semibold uppercase">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Top Products */}
      <div className="rounded-xl border border-silver-light bg-white shadow-card overflow-hidden mb-4">
        <div className="px-5 py-4 border-b border-silver-light bg-cloud">
          <p className="text-xs font-bold uppercase tracking-wider text-royal">Top Selling Products</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-silver-light text-left text-xs font-bold uppercase tracking-wider text-silver-dark">
              <th className="px-5 py-3">#</th>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Units Sold</th>
              <th className="px-5 py-3">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-silver-light">
            {topProducts.map((p, i) => (
              <tr key={p.productId} className="hover:bg-cloud transition-colors">
                <td className="px-5 py-3 font-bold text-silver-dark">{i + 1}</td>
                <td className="px-5 py-3 font-semibold text-navy">{p.productName}</td>
                <td className="px-5 py-3 text-silver-dark">{p._sum.quantity}</td>
                <td className="px-5 py-3 font-bold text-navy">
                  {formatPrice((p._sum.price || 0) * (p._sum.quantity || 0))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* All Orders Table */}
      <div className="rounded-xl border border-silver-light bg-white shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-silver-light bg-cloud flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-royal">All Orders</p>
          <span className="text-xs text-silver-dark">{totalOrderCount} orders</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-silver-light text-left text-xs font-bold uppercase tracking-wider text-silver-dark">
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-silver-light">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-cloud transition-colors">
                <td className="px-5 py-3 font-semibold text-royal">#{order.id.slice(-8).toUpperCase()}</td>
                <td className="px-5 py-3 text-silver-dark">{order.user?.name || "—"}</td>
                <td className="px-5 py-3 text-silver-dark">{order.items.length}</td>
                <td className="px-5 py-3 font-bold text-navy">{formatPrice(order.total)}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    order.status === "DELIVERED" ? "bg-green-50 text-green-700" :
                    order.status === "CANCELLED" ? "bg-red-50 text-red-600" :
                    order.status === "SHIPPED" ? "bg-purple-50 text-purple-700" :
                    order.status === "PROCESSING" ? "bg-blue-50 text-blue-700" :
                    "bg-yellow-50 text-yellow-700"
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-silver-dark">
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} basePath="/admin/reports" />
    </div>
  );
}