import { TrendingUp, ShoppingCart, Users, Package } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";

export const dynamic = "force-dynamic";
export const metadata = { title: "Analytics — Admin" };

export default async function AnalyticsPage() {
  const { prisma } = await import("@/lib/prisma");

  const [
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    recentOrders,
    ordersByStatus,
  ] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.product.count(),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: true, items: true },
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  const revenue = totalRevenue._sum.total || 0;

  const statusColors = {
    PENDING:    "bg-yellow-400",
    PROCESSING: "bg-blue-400",
    SHIPPED:    "bg-purple-400",
    DELIVERED:  "bg-green-400",
    CANCELLED:  "bg-red-400",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Analytics</h1>
        <p className="text-sm text-silver-dark mt-0.5">Store performance overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
        {[
          { label: "Total Revenue", value: formatPrice(revenue), icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
          { label: "Total Orders", value: totalOrders, icon: ShoppingCart, color: "text-royal", bg: "bg-royal/10" },
          { label: "Customers", value: totalCustomers, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Products", value: totalProducts, icon: Package, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-silver-light bg-white p-5 shadow-card">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${stat.bg} mb-3`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="text-xs text-silver-dark font-semibold uppercase">{stat.label}</p>
            <p className="text-2xl font-bold text-navy mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mb-4">
        {/* Orders by Status */}
        <div className="rounded-xl border border-silver-light bg-white p-5 shadow-card">
          <h2 className="text-base font-bold text-navy mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {ordersByStatus.map((s) => {
              const pct = totalOrders > 0 ? Math.round((s._count.status / totalOrders) * 100) : 0;
              return (
                <div key={s.status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-navy">{s.status}</span>
                    <span className="text-silver-dark">{s._count.status} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-silver-light overflow-hidden">
                    <div
                      className={`h-full rounded-full ${statusColors[s.status] || "bg-gray-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Average Order Value */}
        <div className="rounded-xl border border-silver-light bg-white p-5 shadow-card">
          <h2 className="text-base font-bold text-navy mb-4">Key Metrics</h2>
          <div className="space-y-4">
            {[
              { label: "Average Order Value", value: totalOrders > 0 ? formatPrice(Math.round(revenue / totalOrders)) : "₹0" },
              { label: "Total Revenue", value: formatPrice(revenue) },
              { label: "Completed Orders", value: ordersByStatus.find(s => s.status === "DELIVERED")?._count.status || 0 },
              { label: "Cancelled Orders", value: ordersByStatus.find(s => s.status === "CANCELLED")?._count.status || 0 },
            ].map((m) => (
              <div key={m.label} className="flex justify-between items-center border-b border-silver-light pb-3 last:border-0 last:pb-0">
                <span className="text-sm text-silver-dark">{m.label}</span>
                <span className="text-sm font-bold text-navy">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-silver-light bg-white shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-silver-light bg-cloud">
          <h2 className="text-sm font-bold uppercase tracking-wider text-royal">Recent Orders</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-silver-light text-left text-xs font-bold uppercase tracking-wider text-silver-dark">
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-silver-light">
            {recentOrders.map((order) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}