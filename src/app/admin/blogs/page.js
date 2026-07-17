import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { imageSrc } from "@/utils/imageSrc";
import DeleteBlogButton from "@/components/admin/DeleteBlogButton";
import Pagination, { parsePage } from "@/components/admin/Pagination";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminBlogsPage({ searchParams }) {
  const { prisma } = await import("@/lib/prisma");
  const page = parsePage(searchParams);
  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.blog.count(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Blogs ({total})</h1>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 rounded-lg bg-royal px-4 py-2 text-sm font-semibold text-white hover:bg-royal-dark"
        >
          <Plus size={18} /> Add Blog
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-silver-light bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-silver-light bg-cloud text-left text-xs uppercase text-silver-dark">
            <tr>
              <th className="px-4 py-3">Blog</th>
              <th className="hidden px-4 py-3 sm:table-cell">Category</th>
              <th className="hidden px-4 py-3 md:table-cell">Author</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((b) => (
              <tr key={b.id} className="border-b border-silver-light last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-cloud">
                      <Image src={imageSrc(b.coverImage)} alt={b.title} fill sizes="40px" className="object-cover" />
                    </div>
                    <span className="line-clamp-1 font-medium text-navy">{b.title}</span>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-silver-dark sm:table-cell">{b.category}</td>
                <td className="hidden px-4 py-3 text-silver-dark md:table-cell">{b.author}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      b.published
                        ? "bg-green-100 text-green-700"
                        : "bg-silver-light text-silver-dark"
                    }`}
                  >
                    {b.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/blogs/${b.id}/edit`}
                      className="font-semibold text-royal hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteBlogButton id={b.id} title={b.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} basePath="/admin/blogs" />
    </div>
  );
}