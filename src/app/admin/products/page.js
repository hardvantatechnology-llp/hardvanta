import Link from "next/link";
import Image from "next/image";

import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/utils/formatPrice";
import { imageSrc } from "@/utils/imageSrc";
import { Plus } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import Pagination, { parsePage } from "@/components/admin/Pagination";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminProductsPage({ searchParams }) {
  const page = parsePage(searchParams);
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: true,
        brand: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">
          Products ({total})
        </h1>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-royal px-4 py-2 text-sm font-semibold text-white hover:bg-royal-dark"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-silver-light bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-silver-light bg-cloud text-left text-xs uppercase text-silver-dark">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-b border-silver-light last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded bg-cloud">
                      <Image
                        src={imageSrc(p.image || "")}
                        alt={p.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>

                    <span className="font-medium text-navy">
                      {p.name}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3">
                  {p.brand?.name || "-"}
                </td>

                <td className="px-4 py-3">
                  {p.category?.name || "-"}
                </td>

                <td className="px-4 py-3 font-semibold">
                  {formatPrice(p.salePrice ?? p.price)}
                </td>

                <td className="px-4 py-3">
                  {p.stock}
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="font-semibold text-royal hover:underline"
                    >
                      Edit
                    </Link>

                    <DeleteProductButton
                      id={p.id}
                      name={p.name}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} basePath="/admin/products" />
    </div>
  );
}