import { Layers } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Categories — Admin" };

export default async function CategoriesPage() {
  const { prisma } = await import("@/lib/prisma");

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Categories</h1>
          <p className="text-sm text-silver-dark mt-0.5">{categories.length} total categories</p>
        </div>
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
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-silver-dark">
                  <Layers size={32} className="mx-auto mb-2 text-silver" />
                  No categories found
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-cloud transition-colors">
                  <td className="px-5 py-3 font-semibold text-navy">{cat.name}</td>
                  <td className="px-5 py-3 text-silver-dark">{cat.slug}</td>
                  <td className="px-5 py-3 text-silver-dark">{cat._count.products}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      cat.active
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-600"
                    }`}>
                      {cat.active ? "Active" : "Inactive"}
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