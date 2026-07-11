
import { formatPrice } from "@/utils/formatPrice";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const { prisma } = await import("@/lib/prisma");
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, user: { select: { email: true, name: true } } },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">Orders ({orders.length})</h1>

      {orders.length === 0 ? (
        <p className="rounded-xl border border-silver-light bg-white py-12 text-center text-silver-dark">
          No orders yet.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-silver-light bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-silver-light pb-3">
                <div>
                  <p className="font-semibold text-navy">
                    #{o.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-silver-dark">
                    {o.user?.email} ·{" "}
                    {new Date(o.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      o.paymentMethod === "ONLINE"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                    title={o.paymentId ? `Payment ID: ${o.paymentId}` : undefined}
                  >
                    {o.paymentMethod === "ONLINE" ? "💳 Paid Online" : "💵 Cash on Delivery"}
                  </span>
                  <OrderStatusSelect id={o.id} status={o.status} />
                </div>
              </div>

              <div className="space-y-1 py-3 text-sm">
                {o.items.map((it) => (
                  <div key={it.id} className="flex justify-between">
                    <span className="text-silver-dark">{it.productName} × {it.quantity}</span>
                    <span className="font-medium text-navy">
                      {formatPrice(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {o.address && (
                <p className="border-t border-silver-light pt-2 text-xs text-silver-dark">
                  Ship to: {[o.address.fullName, o.address.line1, o.address.city, o.address.state, o.address.pincode].filter(Boolean).join(", ")}
                  {o.address.phone ? ` · ${o.address.phone}` : ""}
                </p>
              )}

              <div className="flex justify-between border-t border-silver-light pt-3 text-sm font-bold text-navy">
                <span>Total</span>
                <span>{formatPrice(o.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
