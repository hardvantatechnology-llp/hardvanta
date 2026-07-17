import { Users } from "lucide-react";
import Pagination, { parsePage } from "@/components/admin/Pagination";

export const dynamic = "force-dynamic";
export const metadata = { title: "Customers — Admin" };

const PAGE_SIZE = 20;

export default async function CustomersPage({ searchParams }) {
  const { prisma } = await import("@/lib/prisma");

  const page = parsePage(searchParams);
  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where: { role: "USER" },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { orders: true } } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.user.count({ where: { role: "USER" } }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Customers</h1>
        <p className="text-sm text-silver-dark mt-0.5">{total} total customers</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-silver-light bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-silver-light bg-cloud text-left text-xs font-bold uppercase tracking-wider text-silver-dark">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Orders</th>
              <th className="px-5 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-silver-light">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-silver-dark">
                  <Users size={32} className="mx-auto mb-2 text-silver" />
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((user) => (
                <tr key={user.id} className="hover:bg-cloud transition-colors">
                  <td className="px-5 py-3 font-semibold text-navy">{user.name || "—"}</td>
                  <td className="px-5 py-3 text-silver-dark">{user.email}</td>
                  <td className="px-5 py-3 text-silver-dark">{user.phone || "—"}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-royal/10 px-2.5 py-1 text-xs font-semibold text-royal">
                      {user._count.orders} orders
                    </span>
                  </td>
                  <td className="px-5 py-3 text-silver-dark">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} basePath="/admin/customers" />
    </div>
  );
}