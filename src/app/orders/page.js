import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Package } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import OrderTracker from "@/components/orders/OrderTracker";
import OrderSuccessBanner from "@/components/orders/OrderSuccessBanner";
import Button from "@/components/ui/Button";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Orders — Hardvanta" };

const STATUS_STYLES = {
  PENDING: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
  PROCESSING: "bg-electric/10 text-electric-light border border-electric/20",
  SHIPPED: "bg-liquid/10 text-liquid-light border border-liquid/20",
  DELIVERED: "bg-cyan/10 text-cyan border border-cyan/20",
  CANCELLED: "bg-red-500/10 text-red-400 border border-red-500/20",
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
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-graphite to-obsidian">
      <div className="liquid-blob left-1/4 top-[-15%] h-96 w-96 bg-electric/10" />
      <div className="relative max-w-4xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">My Orders</h1>
            <p className="text-sm text-white/40 mt-0.5">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
          </div>
          <Button href="/products" variant="gradient">
            Shop More
          </Button>
        </div>

        {justPlaced && <OrderSuccessBanner />}

        {orders.length === 0 ? (
          <div className="glass-card flex flex-col items-center py-24 text-center rounded-3xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-electric/20 to-liquid/20 shadow-glow-electric mb-4">
              <Package size={30} className="text-electric-light" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No orders yet</h2>
            <p className="text-sm text-white/40 mb-6 max-w-xs">Looks like you have not placed any orders yet.</p>
            <Button href="/products" variant="gradient">
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="glass-card rounded-3xl overflow-hidden transition-all hover:shadow-glow-electric">

                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-white/10">
                  <div>
                    <p className="text-sm font-bold text-white">Order #{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status] || "bg-white/10 text-white"}`}>
                      {order.status}
                    </span>
                    <Link href={`/orders/${order.id}`} className="text-xs font-semibold text-electric-light hover:text-cyan">
                      Details
                    </Link>
                  </div>
                </div>

                <div className="px-5 py-5">
                  <OrderTracker order={order} />
                </div>

                <div className="px-5 pb-4 space-y-1.5 border-t border-white/10 pt-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-white/50">{item.name} x {item.quantity}</span>
                      <span className="font-medium text-white">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between px-5 py-3 bg-white/[0.03] border-t border-white/10">
                  <span className="text-sm font-bold text-white">Total: {formatPrice(order.total)}</span>
                  <div className="flex items-center gap-2">
                    {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                      <Link href={`/orders/${order.id}`} className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors">
                        Cancel
                      </Link>
                    )}
                    <Link href={`/orders/${order.id}`} className="rounded-lg bg-gradient-to-r from-electric to-liquid px-3 py-1.5 text-xs font-semibold text-white shadow-glow-electric hover:brightness-110 transition-all">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Customer support */}
        <div className="mt-6 glass-card rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white">Need help with an order?</h2>
          <p className="mt-1 text-xs text-white/40">
            Our support team is here for you, Mon–Sat, 9:15 AM – 6:15 PM.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href="tel:+919170546395"
              className="flex items-center gap-2 rounded-xl glass-card px-4 py-2.5 text-sm font-semibold text-white/80 hover:shadow-glow-electric transition-all"
            >
              📞 +91 91705 46395
            </a>
            <a
              href="mailto:support@hardvanta.in"
              className="flex items-center gap-2 rounded-xl glass-card px-4 py-2.5 text-sm font-semibold text-white/80 hover:shadow-glow-electric transition-all"
            >
              ✉️ support@hardvanta.in
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
