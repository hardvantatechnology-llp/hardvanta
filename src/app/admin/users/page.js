import { Users, Shield, User } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Users — Admin" };

export default async function UsersPage() {
  const { prisma } = await import("@/lib/prisma");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  const admins = users.filter((u) => u.role === "ADMIN");
  const customers = users.filter((u) => u.role === "USER");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Users</h1>
        <p className="text-sm text-silver-dark mt-0.5">{users.length} total users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-silver-light bg-white p-4 shadow-card flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-royal/10">
            <Shield size={20} className="text-royal" />
          </div>
          <div>
            <p className="text-xs text-silver-dark font-semibold uppercase">Admins</p>
            <p className="text-2xl font-bold text-navy">{admins.length}</p>
          </div>
        </div>
        <div className="rounded-xl border border-silver-light bg-white p-4 shadow-card flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
            <User size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-silver-dark font-semibold uppercase">Customers</p>
            <p className="text-2xl font-bold text-navy">{customers.length}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-silver-light bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-silver-light bg-cloud text-left text-xs font-bold uppercase tracking-wider text-silver-dark">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Orders</th>
              <th className="px-5 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-silver-light">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-silver-dark">
                  <Users size={32} className="mx-auto mb-2 text-silver" />
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-cloud transition-colors">
                  <td className="px-5 py-3 font-semibold text-navy">{user.name || "—"}</td>
                  <td className="px-5 py-3 text-silver-dark">{user.email}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      user.role === "ADMIN"
                        ? "bg-royal/10 text-royal"
                        : "bg-green-50 text-green-700"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-silver-dark">{user._count.orders}</td>
                  <td className="px-5 py-3 text-silver-dark">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
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