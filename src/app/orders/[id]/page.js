import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";
import { Package, ArrowLeft, Phone, MapPin, CreditCard, CheckCircle2, Truck, ShieldCheck } from "lucide-react";
import OrderTracker from "@/components/orders/OrderTracker";
import CancelOrderButton from "@/components/orders/CancelOrderButton";
import Button from "@/components/ui/Button";

export const dynamic = "force-dynamic";

const STATUS_CONFIG = {
  PENDING:    { bg: "bg-amber-500/10",  text: "text-amber-300",  border: "border-amber-500/20",  label: "Pending"    },
  PROCESSING: { bg: "bg-electric/10",   text: "text-electric-light", border: "border-electric/20",   label: "Processing" },
  SHIPPED:    { bg: "bg-liquid/10",     text: "text-liquid-light", border: "border-liquid/20", label: "Shipped"    },
  DELIVERED:  { bg: "bg-cyan/10",       text: "text-cyan",  border: "border-cyan/20",  label: "Delivered"  },
  CANCELLED:  { bg: "bg-red-500/10",    text: "text-red-400",    border: "border-red-500/20",    label: "Cancelled"  },
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
  if (address.line2)     parts.push(address.line2);
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-graphite to-obsidian">
      <div className="liquid-blob left-1/4 top-[-15%] h-96 w-96 bg-electric/10" />

      {/* Top bar */}
      <div className="relative border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-electric-light transition-colors">
            <ArrowLeft size={15} /> Back to Orders
          </Link>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-white">Order #{order.id.slice(-8).toUpperCase()}</h1>
              <p className="text-sm text-white/40 mt-0.5">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <span className={`rounded-full border px-4 py-1.5 text-xs font-bold tracking-wide ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
              {statusCfg.label}
            </span>
          </div>
        </div>
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-6 space-y-4">

        {/* Success / cancelled banners */}
        {justCancelled && (
          <div className="flex items-center gap-2 rounded-2xl bg-cyan/10 border border-cyan/20 px-5 py-3.5 text-sm font-medium text-cyan">
            <CheckCircle2 size={18} /> Order cancelled successfully. Stock has been restored.
          </div>
        )}

        {/* Order tracker */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10">
            <p className="text-xs font-bold uppercase tracking-widest text-electric-light">
              {order.status === "CANCELLED" ? "Order Status" : "Order Progress"}
            </p>
          </div>
          <div className="px-5 py-6">
            <OrderTracker status={order.status} />
          </div>
        </div>

        {/* Order items */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10">
            <p className="text-xs font-bold uppercase tracking-widest text-electric-light">Order Items</p>
          </div>

          <div className="divide-y divide-white/10">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5">
                  <Package size={20} className="text-white/40" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white/90 line-clamp-1">{item.productName}</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    Qty: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <p className="text-sm font-bold text-white shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div className="border-t border-white/10 bg-white/[0.02] px-5 py-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Subtotal</span>
              <span className="font-semibold text-white">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40 flex items-center gap-1.5">
                <Truck size={13} /> Shipping
              </span>
              <span className={`font-semibold ${shipping === 0 ? "text-cyan" : "text-white"}`}>
                {shipping === 0 ? "FREE" : formatPrice(shipping)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
              <span>Order Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Address + Payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-electric-light mb-3 flex items-center gap-1.5">
              <MapPin size={13} /> Delivery Address
            </p>
            <p className="text-sm text-white/50 leading-relaxed">{addr}</p>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-electric-light mb-3 flex items-center gap-1.5">
              <CreditCard size={13} /> Payment
            </p>
            <p className="text-sm font-semibold text-white/90">{order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-cyan/10 border border-cyan/20 px-3 py-1 text-xs font-semibold text-cyan">
              <CheckCircle2 size={12} /> Confirmed
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="glass-card rounded-2xl p-4">
          <div className="flex flex-wrap gap-4">
            {[
              { icon: <ShieldCheck size={15} className="text-cyan" />, text: "100% Secure Order" },
              { icon: <Truck size={15} className="text-electric-light" />, text: "Free shipping above ₹999" },
              { icon: <Phone size={15} className="text-amber-400" />, text: "Support: +91 91705 46395 (Mon–Sat)" },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-2 text-xs text-white/50">
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
            className="flex items-center gap-2 rounded-xl glass-card px-4 py-2.5 text-sm font-semibold text-white/80 hover:shadow-glow-electric transition-all"
          >
            <Phone size={15} /> Call Support: +91 91705 46395
          </a>
          <Button href="/products" variant="gradient">
            Continue Shopping
          </Button>
        </div>

      </div>
    </div>
  );
}
