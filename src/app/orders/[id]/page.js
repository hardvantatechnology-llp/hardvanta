import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";
import { Package, ArrowLeft, Phone, MapPin, CreditCard, CheckCircle2, Clock, Truck, Home, ShieldCheck } from "lucide-react";
import OrderTracker from "@/components/orders/OrderTracker";
import CancelOrderButton from "@/components/orders/CancelOrderButton";

export const dynamic = "force-dynamic";

const STATUS_CONFIG = {
  PENDING:    { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  label: "Pending"    },
  PROCESSING: { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   label: "Processing" },
  SHIPPED:    { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", label: "Shipped"    },
  DELIVERED:  { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  label: "Delivered"  },
  CANCELLED:  { bg: "bg-red-50",    text: "text-red-600",    border: "border-red-200",    label: "Cancelled"  },
};

function formatAddress(address) {
  if (!address) return "Address not available";
  if (typeof address === "string") return address;
  const parts = [];
  if (address.fullName)  parts.push(address.fullName);
  if (address.phone)     parts.push(address.phone);
  if (address.flatHouse) parts.push(address.flatHouse);
  if (address.area)      parts.push(address.area);
  if (address.landmark)  parts.push("Near " + address.landmark);
  if (address.line1)     parts.push(address.line1);
  if (address.city)      parts.push(address.city);
  if (address.state)     parts.push(address.state);
  if (address.pincode)   parts.push(address.pincode);
  return parts.filter(Boolean).join(", ");
}

export default async function OrderDetailPage({ params, searchParams }) {
  const { getAuthOptions } = await import("@/lib/auth");
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/orders");

  const { prisma } = await import("@/lib/prisma");
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });

  if (!order || order.userId !== session.user.id) notFound();

  const justCancelled = searchParams?.cancelled === "1";
  const addr = formatAddress(order.address);
  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;

  // Calculate subtotal from items
  const subtotal = order.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const shipping = order.total - subtotal;

  return (
    <div className="min-h-screen bg-cloud">

      {/* Top bar */}
      <div className="bg-navy">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm text-silver hover:text-white transition-colors">
            <ArrowLeft size={15} /> Back to Orders
          </Link>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-white">Order #{order.id.slice(-8).toUpperCase()}</h1>
              <p className="text-sm text-silver/70 mt-0.5">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <span className={`rounded-full border px-4 py-1.5 text-xs font-bold tracking-wide ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
              {statusCfg.label}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">

        {/* Success / cancelled banners */}
        {justCancelled && (
          <div className="flex items-center gap-2 rounded-2xl bg-green-50 border border-green-200 px-5 py-3.5 text-sm font-medium text-green-700">
            <CheckCircle2 size={18} /> Order cancelled successfully. Stock has been restored.
          </div>
        )}

        {/* Order tracker */}
        <div className="bg-white rounded-2xl border border-silver-light shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-silver-light bg-cloud">
            <p className="text-xs font-bold uppercase tracking-widest text-royal">
              {order.status === "CANCELLED" ? "Order Status" : "Order Progress"}
            </p>
          </div>
          <div className="px-5 py-6">
            <OrderTracker status={order.status} />
          </div>
        </div>

        {/* Order items */}
        <div className="bg-white rounded-2xl border border-silver-light shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-silver-light bg-cloud">
            <p className="text-xs font-bold uppercase tracking-widest text-royal">Order Items</p>
          </div>

          <div className="divide-y divide-silver-light">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cloud border border-silver-light">
                  <Package size={20} className="text-silver-dark" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy line-clamp-1">{item.productName}</p>
                  <p className="text-xs text-silver-dark mt-0.5">
                    Qty: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <p className="text-sm font-bold text-navy shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div className="border-t border-silver-light bg-cloud px-5 py-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-silver-dark">Subtotal</span>
              <span className="font-semibold text-navy">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-silver-dark flex items-center gap-1.5">
                <Truck size={13} /> Shipping
              </span>
              <span className={`font-semibold ${shipping === 0 ? "text-green-600" : "text-navy"}`}>
                {shipping === 0 ? "FREE" : formatPrice(shipping)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-navy pt-2 border-t border-silver-light">
              <span>Order Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Address + Payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-silver-light shadow-card p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-royal mb-3 flex items-center gap-1.5">
              <MapPin size={13} /> Delivery Address
            </p>
            <p className="text-sm text-silver-dark leading-relaxed">{addr}</p>
          </div>

          <div className="bg-white rounded-2xl border border-silver-light shadow-card p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-royal mb-3 flex items-center gap-1.5">
              <CreditCard size={13} /> Payment
            </p>
            <p className="text-sm font-semibold text-navy">{order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-semibold text-green-700">
              <CheckCircle2 size={12} /> Confirmed
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="bg-white rounded-2xl border border-silver-light shadow-card p-4">
          <div className="flex flex-wrap gap-4">
            {[
              { icon: <ShieldCheck size={15} className="text-green-600" />, text: "100% Secure Order" },
              { icon: <Truck size={15} className="text-royal" />, text: "Free shipping above ₹999" },
              { icon: <Phone size={15} className="text-orange-500" />, text: "Support: Mon–Sat, 9AM–6PM" },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-2 text-xs text-silver-dark">
                {b.icon} {b.text}
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 pb-4">
          {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
            <CancelOrderButton orderId={order.id} />
          )}
          <a
            href="tel:+919170546395"
            className="flex items-center gap-2 rounded-xl border border-silver-light bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:border-royal hover:text-royal transition-colors shadow-card"
          >
            <Phone size={15} /> Contact Support
          </a>
          <Link
            href="/products"
            className="flex items-center gap-2 rounded-xl bg-royal px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}