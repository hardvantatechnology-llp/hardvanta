import { Store, Package, TrendingUp } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sellers — Admin" };

export default async function SellersPage() {
  const { prisma } = await import("@/lib/prisma");

  // Sellers = brands with their product counts and revenue
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: {
      products: {
        include: {
          orderItems: true,
        },
      },
    },
  });

  const sellersData = brands.map((brand) => {
    const totalProducts = brand.products.length;
    const totalSold = brand.products.reduce(
      (sum, p) => sum + p.orderItems.reduce((s, oi) => s + oi.quantity, 0),
      0
    );
    const totalRevenue = brand.products.reduce(
      (sum, p) => sum + p.orderItems.reduce((s, oi) => s + oi.price * oi.quantity, 0),
      0
    );
    return { ...brand, totalProducts, totalSold, totalRevenue };
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Sellers</h1>
        <p className="text-sm text-silver-dark mt-0.5">{brands.length} total sellers/brands</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-silver-light bg-white p-4 shadow-card">
          <p className="text-xs text-silver-dark font-semibold uppercase">Total Sellers</p>
          <p className="text-2xl font-bold text-navy mt-1">{brands.length}</p>
        </div>
        <div className="rounded-xl border border-silver-light bg-white p-4 shadow-card">
          <p className="text-xs text-silver-dark font-semibold uppercase">Total Products</p>
          <p className="text-2xl font-bold text-navy mt-1">
            {sellersData.reduce((sum, s) => sum + s.totalProducts, 0)}
          </p>
        </div>
        <div className="rounded-xl border border-silver-light bg-white p-4 shadow-card">
          <p className="text-xs text-silver-dark font-semibold uppercase">Total Revenue</p>
          <p className="text-2xl font-bold text-navy mt-1">
            {formatPrice(sellersData.reduce((sum, s) => sum + s.totalRevenue, 0))}
          </p>
        </div>
      </div>

      {/* Sellers Table */}
      <div className="overflow-hidden rounded-xl border border-silver-light bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-silver-light bg-cloud text-left text-xs font-bold uppercase tracking-wider text-silver-dark">
              <th className="px-5 py-3">Brand / Seller</th>
              <th className="px-5 py-3">Products</th>
              <th className="px-5 py-3">Units Sold</th>
              <th className="px-5 py-3">Revenue</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-silver-light">
            {sellersData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-silver-dark">
                  <Store size={32} className="mx-auto mb-2 text-silver" />
                  No sellers found
                </td>
              </tr>
            ) : (
              sellersData.map((seller) => (
                <tr key={seller.id} className="hover:bg-cloud transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cloud border border-silver-light">
                        <Store size={16} className="text-royal" />
                      </div>
                      <div>
                        <p className="font-semibold text-navy">{seller.name}</p>
                        <p className="text-xs text-silver-dark">{seller.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1 text-silver-dark">
                      <Package size={13} /> {seller.totalProducts}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-silver-dark">{seller.totalSold} units</td>
                  <td className="px-5 py-3 font-bold text-navy">{formatPrice(seller.totalRevenue)}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      seller.active
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-600"
                    }`}>
                      {seller.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}