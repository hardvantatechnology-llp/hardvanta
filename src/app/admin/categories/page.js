import { Layers } from "lucide-react";
import Pagination, { parsePage } from "@/components/admin/Pagination";
import CatalogEntityRow from "@/components/admin/CatalogEntityRow";
import NewCatalogEntityForm from "@/components/admin/NewCatalogEntityForm";
import { createCategory, updateCategory, toggleCategoryActive, deleteCategory } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Categories — Admin" };

const PAGE_SIZE = 20;

export default async function CategoriesPage({ searchParams }) {
  const { prisma } = await import("@/lib/prisma");

  const page = parsePage(searchParams);
  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.category.count(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Categories</h1>
          <p className="text-sm text-silver-dark mt-0.5">{total} total categories</p>
        </div>
        <NewCatalogEntityForm label="category" onCreate={createCategory} />
      </div>

      <div className="overflow-hidden rounded-xl border border-silver-light bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-silver-light bg-cloud text-left text-xs font-bold uppercase tracking-wider text-silver-dark">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">Products</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-silver-light">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-silver-dark">
                  <Layers size={32} className="mx-auto mb-2 text-silver" />
                  No categories found
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <CatalogEntityRow
                  key={cat.id}
                  item={cat}
                  productCount={cat._count.products}
                  onUpdate={updateCategory}
                  onToggleActive={toggleCategoryActive}
                  onDelete={deleteCategory}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} basePath="/admin/categories" />
    </div>
  );
}
