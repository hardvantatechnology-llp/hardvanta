import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { formatPrice } from "@/utils/formatPrice";
import OrderTracker from "@/components/orders/OrderTracker";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Orders — Hardvanta" };

const STATUS_STYLES = {
  PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
  PROCESSING: "bg-blue-50 text-blue-700 border border-blue-200",
  SHIPPED: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  DELIVERED: "bg-green-50 text-green-700 border border-green-200",
  CANCELLED: "bg-red-50 text-red-600 border border-red-200",
};

export default async function OrdersPage({ searchParams }) {
  const { getAuthOptions } = await import("@/lib/auth");
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/orders");

  const { prisma } = await import("@/lib/prisma");
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const justPlaced = searchParams?.placed === "1";

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy">My Orders</h1>
            <p className="text-sm text-gray-500 mt-0.5">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
          </div>
          <Link href="/products" className="rounded-xl bg-royal px-4 py-2 text-sm font-semibold text-white hover:bg-navy transition-colors">
            Shop More
          </Link>
        </div>

        {justPlaced && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-medium text-green-700">
            Order placed successfully! We will deliver it soon.
          </div>
        )}

        {orders.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center bg-white rounded-2xl border border-gray-200">
            <div className="w-20 h-20 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
              <span className="text-4xl">📦</span>
            </div>
            <h2 className="text-xl font-bold text-navy mb-2">No orders yet</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">Looks like you have not placed any orders yet.</p>
            <Link href="/products" className="rounded-xl bg-royal px-6 py-3 text-sm font-semibold text-white hover:bg-navy transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-bold text-navy">Order #{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status] || "bg-gray-100 text-navy"}`}>
                      {order.status}
                    </span>
                    <Link href={`/orders/${order.id}`} className="text-xs font-semibold text-royal hover:underline">
                      Details
                    </Link>
                  </div>
                </div>

                <div className="px-5 py-5">
                  <OrderTracker status={order.status} />
                </div>

                <div className="px-5 pb-4 space-y-1.5 border-t border-gray-100 pt-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-500">{item.name} x {item.quantity}</span>
                      <span className="font-medium text-navy">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
                  <span className="text-sm font-bold text-navy">Total: {formatPrice(order.total)}</span>
                  <div className="flex items-center gap-2">
                    {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                      <Link href={`/orders/${order.id}?cancel=1`} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors">
                        Cancel
                      </Link>
                    )}
                    <Link href={`/orders/${order.id}`} className="rounded-lg bg-royal px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy transition-colors">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Customer support */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-bold text-navy">Need help with an order?</h2>
          <p className="mt-1 text-xs text-gray-500">
            Our support team is here for you, Mon–Sat, 9:15 AM – 6:15 PM.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href="tel:+919170546395"
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-navy hover:border-royal hover:text-royal transition-colors"
            >
              📞 +91 91705 46395
            </a>
            <a
              href="mailto:support@hardvanta.in"
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-navy hover:border-royal hover:text-royal transition-colors"
            >
              ✉️ support@hardvanta.in
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}