import { Archive, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Inventory — Admin" };

export default async function InventoryPage() {
  const { prisma } = await import("@/lib/prisma");

  const products = await prisma.product.findMany({
    orderBy: { stock: "asc" },
    include: { category: true, brand: true },
  });

  const outOfStock = products.filter((p) => p.stock === 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Inventory</h1>
        <p className="text-sm text-silver-dark mt-0.5">{products.length} total products</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-silver-light bg-white p-4 shadow-card">
          <p className="text-xs text-silver-dark font-semibold uppercase">Total Products</p>
          <p className="text-2xl font-bold text-navy mt-1">{products.length}</p>
        </div>
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-xs text-orange-600 font-semibold uppercase">Low Stock (≤5)</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{lowStock.length}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs text-red-600 font-semibold uppercase">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{outOfStock.length}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-silver-light bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-silver-light bg-cloud text-left text-xs font-bold uppercase tracking-wider text-silver-dark">
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">SKU</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-silver-light">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-cloud transition-colors">
                <td className="px-5 py-3 font-semibold text-navy line-clamp-1 max-w-[200px]">{product.name}</td>
                <td className="px-5 py-3 text-silver-dark">{product.sku}</td>
                <td className="px-5 py-3 text-silver-dark">{product.category?.name}</td>
                <td className="px-5 py-3 font-bold text-navy">{product.stock}</td>
                <td className="px-5 py-3">
                  {product.stock === 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                      <AlertTriangle size={11} /> Out of Stock
                    </span>
                  ) : product.stock <= 5 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
                      <AlertTriangle size={11} /> Low Stock
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                      In Stock
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}