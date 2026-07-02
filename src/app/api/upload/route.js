import Link from "next/link";

import { formatPrice } from "@/utils/formatPrice";
import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  FolderTree,
  AlertTriangle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const { prisma } = await import("@/lib/prisma");

  const [
    productCount,
    orderCount,
    userCount,
    categoryCount,
    recentProducts,
    orders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.category.count(),

    prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),

    prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        items: true,
      },
    }),
  ]);

  const revenue = await prisma.order.aggregate({
    _sum: {
      total: true,
    },
  });

  const lowStockProducts = await prisma.product.findMany({
    where: {
      stock: {
        lte: 5,
      },
    },
    take: 5,
  });

  const stats = [
    {
      label: "Revenue",
      value: formatPrice(revenue._sum.total || 0),
      icon: IndianRupee,
    },
    {
      label: "Orders",
      value: orderCount,
      icon: ShoppingCart,
    },
    {
      label: "Products",
      value: productCount,
      icon: Package,
    },
    {
      label: "Customers",
      value: userCount,
      icon: Users,
    },
    {
      label: "Categories",
      value: categoryCount,
      icon: FolderTree,
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-navy">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl border border-silver-light bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-silver-dark">
                {label}
              </span>

              <Icon size={20} className="text-royal" />
            </div>

            <p className="mt-3 text-2xl font-bold text-navy">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}

        <div className="rounded-xl border border-silver-light bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">
              Recent Orders
            </h2>

            <Link
              href="/admin/orders"
              className="text-sm font-semibold text-royal hover:underline"
            >
              View All
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="py-8 text-center text-silver-dark">
              No orders found.
            </p>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-semibold">
                      #{o.id.slice(-8).toUpperCase()}
                    </p>

                    <p className="text-sm text-gray-500">
                      {o.items.length} Item
                      {o.items.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                      {o.status}
                    </span>

                    <p className="mt-2 font-bold">
                      {formatPrice(o.total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Products */}

        <div className="rounded-xl border border-silver-light bg-white p-5">
          <h2 className="mb-4 text-lg font-bold text-navy">
            Recent Products
          </h2>

          <div className="space-y-3">
            {recentProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-semibold">
                    {product.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    Stock : {product.stock}
                  </p>
                </div>

                <div className="font-bold">
                  {formatPrice(product.price)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock */}

      <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="text-red-600" />

          <h2 className="text-lg font-bold text-red-600">
            Low Stock Products
          </h2>
        </div>

        {lowStockProducts.length === 0 ? (
          <p>No low stock products.</p>
        ) : (
          <div className="space-y-2">
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg bg-white p-3"
              >
                <span>{p.name}</span>

                <span className="font-bold text-red-600">
                  {p.stock} Left
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}