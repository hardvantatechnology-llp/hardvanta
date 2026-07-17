import { Tag } from "lucide-react";
import Pagination, { parsePage } from "@/components/admin/Pagination";
import CatalogEntityRow from "@/components/admin/CatalogEntityRow";
import NewCatalogEntityForm from "@/components/admin/NewCatalogEntityForm";
import { createBrand, updateBrand, toggleBrandActive, deleteBrand } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Brands — Admin" };

const PAGE_SIZE = 20;

export default async function BrandsPage({ searchParams }) {
  const { prisma } = await import("@/lib/prisma");

  const page = parsePage(searchParams);
  const [brands, total] = await Promise.all([
    prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.brand.count(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Brands</h1>
          <p className="text-sm text-silver-dark mt-0.5">{total} total brands</p>
        </div>
        <NewCatalogEntityForm label="brand" onCreate={createBrand} />
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
            {brands.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-silver-dark">
                  <Tag size={32} className="mx-auto mb-2 text-silver" />
                  No brands found
                </td>
              </tr>
            ) : (
              brands.map((brand) => (
                <CatalogEntityRow
                  key={brand.id}
                  item={brand}
                  productCount={brand._count.products}
                  onUpdate={updateBrand}
                  onToggleActive={toggleBrandActive}
                  onDelete={deleteBrand}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} basePath="/admin/brands" />
    </div>
  );
}
