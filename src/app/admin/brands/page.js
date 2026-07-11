import { Tag } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Brands — Admin" };

export default async function BrandsPage() {
  const { prisma } = await import("@/lib/prisma");
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Brands</h1>
        <p className="text-sm text-silver-dark mt-0.5">{brands.length} total brands</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-silver-light bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-silver-light bg-cloud text-left text-xs font-bold uppercase tracking-wider text-silver-dark">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">Products</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-silver-light">
            {brands.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-silver-dark">
                  <Tag size={32} className="mx-auto mb-2 text-silver" />
                  No brands found
                </td>
              </tr>
            ) : (
              brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-cloud transition-colors">
                  <td className="px-5 py-3 font-semibold text-navy">{brand.name}</td>
                  <td className="px-5 py-3 text-silver-dark">{brand.slug}</td>
                  <td className="px-5 py-3 text-silver-dark">{brand._count.products}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${brand.active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                      {brand.active ? "Active" : "Inactive"}
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