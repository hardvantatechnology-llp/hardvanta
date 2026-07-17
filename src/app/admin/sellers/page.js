import { Store, Package, TrendingUp } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import Pagination, { parsePage } from "@/components/admin/Pagination";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sellers — Admin" };

const PAGE_SIZE = 20;

export default async function SellersPage({ searchParams }) {
  const { prisma } = await import("@/lib/prisma");

  const page = parsePage(searchParams);

  // Sellers = brands with their product counts and revenue.
  // Paginate the brand list, and compute revenue/units-sold with DB-side
  // aggregation scoped only to the brands shown on this page, instead of
  // loading every brand's full product + order-item history into memory.
  const [brands, totalBrands, totalProductCount] = await Promise.all([
    prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.brand.count(),
    prisma.product.count(),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalBrands / PAGE_SIZE));

  const brandIds = brands.map((b) => b.id);
  const productLinks = brandIds.length
    ? await prisma.product.findMany({
        where: { brandId: { in: brandIds } },
        select: { id: true, brandId: true },
      })
    : [];
  const productToBrand = new Map(productLinks.map((p) => [p.id, p.brandId]));
  const productIds = productLinks.map((p) => p.id);

  // Only the order items for products belonging to the brands on this page —
  // bounded by pagination rather than the whole store's order history.
  const orderItems = productIds.length
    ? await prisma.orderItem.findMany({
        where: { productId: { in: productIds } },
        select: { productId: true, price: true, quantity: true },
      })
    : [];

  const totalsByBrand = new Map();
  for (const oi of orderItems) {
    const brandId = productToBrand.get(oi.productId);
    if (!brandId) continue;
    const cur = totalsByBrand.get(brandId) || { totalSold: 0, totalRevenue: 0 };
    cur.totalSold += oi.quantity;
    cur.totalRevenue += oi.price * oi.quantity;
    totalsByBrand.set(brandId, cur);
  }

  const sellersData = brands.map((brand) => {
    const totals = totalsByBrand.get(brand.id) || { totalSold: 0, totalRevenue: 0 };
    return {
      ...brand,
      totalProducts: brand._count.products,
      totalSold: totals.totalSold,
      totalRevenue: totals.totalRevenue,
    };
  });

  const pageRevenue = sellersData.reduce((sum, s) => sum + s.totalRevenue, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Sellers</h1>
        <p className="text-sm text-silver-dark mt-0.5">{totalBrands} total sellers/brands</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-silver-light bg-white p-4 shadow-card">
          <p className="text-xs text-silver-dark font-semibold uppercase">Total Sellers</p>
          <p className="text-2xl font-bold text-navy mt-1">{totalBrands}</p>
        </div>
        <div className="rounded-xl border border-silver-light bg-white p-4 shadow-card">
          <p className="text-xs text-silver-dark font-semibold uppercase">Total Products</p>
          <p className="text-2xl font-bold text-navy mt-1">{totalProductCount}</p>
        </div>
        <div className="rounded-xl border border-silver-light bg-white p-4 shadow-card">
          <p className="text-xs text-silver-dark font-semibold uppercase">Revenue (this page)</p>
          <p className="text-2xl font-bold text-navy mt-1">
            {formatPrice(pageRevenue)}
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

      <Pagination page={page} totalPages={totalPages} basePath="/admin/sellers" />
    </div>
  );
}