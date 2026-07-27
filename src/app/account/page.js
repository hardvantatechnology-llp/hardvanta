import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import {
  Package, MapPin, Heart,
  Shield, Bell, ChevronRight, Star, Clock, CheckCircle2
} from "lucide-react";
import SignOutButton from "@/components/auth/SignOutButton";
import Button from "@/components/ui/Button";
import { formatDate } from "@/utils/formatDateTime";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Account — HV KART" };

export default async function AccountPage() {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/account");

  const { prisma } = await import("@/lib/prisma");

  const [orderCount, wishlistCount] = await Promise.all([
    prisma.order.count({ where: { userId: session.user.id } }),
    prisma.wishlist.count({ where: { userId: session.user.id } }),
  ]);

  const recentOrders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { items: { take: 1, include: { product: true } } },
  });

  const initials = (session.user.name || "HC")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const statusColor = {
    PENDING:    { bg: "bg-amber-500/10",  text: "text-amber-700",  border: "border-amber-500/20" },
    PROCESSING: { bg: "bg-brand-blue/10",   text: "text-brand-blue", border: "border-brand-blue/20"   },
    SHIPPED:    { bg: "bg-brand-steel/10",     text: "text-brand-steel",  border: "border-brand-steel/20" },
    DELIVERED:  { bg: "bg-brand-navy/10",       text: "text-brand-navy",   border: "border-brand-navy/20"  },
    CANCELLED:  { bg: "bg-red-500/10",    text: "text-red-600",     border: "border-red-500/20"    },
  };

  const menuItems = [
    {
      group: "My Activities",
      items: [
        {
          icon: <Package size={20} className="text-brand-blue" />,
          label: "My Orders",
          desc: `${orderCount} order${orderCount !== 1 ? "s" : ""} placed`,
          href: "/orders",
          badge: orderCount > 0 ? orderCount : null,
        },
        {
          icon: <Heart size={20} className="text-brand-steel" />,
          label: "My Wishlist",
          desc: `${wishlistCount} item${wishlistCount !== 1 ? "s" : ""} saved`,
          href: "/wishlist",
          badge: wishlistCount > 0 ? wishlistCount : null,
        },
      ],
    },
    {
      group: "Account Settings",
      items: [
        {
          icon: <MapPin size={20} className="text-brand-blue" />,
          label: "Saved Addresses",
          desc: "Manage delivery addresses",
          href: "/account/addresses",
          badge: null,
        },
        {
          icon: <Shield size={20} className="text-brand-navy" />,
          label: "Security",
          desc: "Password & login settings",
          href: "/account/security",
          badge: null,
        },
        {
          icon: <Bell size={20} className="text-brand-steel" />,
          label: "Notifications",
          desc: "Email & SMS preferences",
          href: "/account/notifications",
          badge: null,
        },
      ],
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-brand-silver to-brand-bg">
      <div className="liquid-blob left-1/4 top-[-20%] h-96 w-96 bg-brand-blue/10" />

      {/* Hero Banner */}
      <div className="relative border-b border-brand-border">
        <div className="container-page py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-navy text-xl font-bold text-white shadow-brand-glow ring-2 ring-brand-border overflow-hidden">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Welcome back
              </p>
              <h1 className="text-xl font-bold text-brand-text">
                {session.user.name || "HV KART Customer"}
              </h1>
              <p className="text-sm text-brand-muted">{session.user.email}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label: "Orders", value: orderCount, icon: <Package size={15} /> },
              { label: "Wishlist", value: wishlistCount, icon: <Heart size={15} /> },
              { label: "Reviews", value: 0, icon: <Star size={15} /> },
            ].map((s) => (
              <div
                key={s.label}
                className="glass-brand-card flex flex-col items-center rounded-xl py-3"
              >
                <span className="text-brand-muted">{s.icon}</span>
                <span className="mt-1 text-lg font-bold text-brand-text">{s.value}</span>
                <span className="text-[11px] text-brand-muted">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page relative py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Menu */}
          <div className="space-y-4 lg:col-span-1">
            {menuItems.map((group) => (
              <div
                key={group.group}
                className="glass-brand-card overflow-hidden rounded-2xl"
              >
                <p className="border-b border-brand-border px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-muted">
                  {group.group}
                </p>
                <ul>
                  {group.items.map((item, i) => (
                    <li
                      key={item.label}
                      className={i !== group.items.length - 1 ? "border-b border-brand-border" : ""}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-brand-silver"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-silver">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-brand-text">{item.label}</p>
                          <p className="text-xs text-brand-muted">{item.desc}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.badge && (
                            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-brand-blue to-brand-navy px-1.5 text-[10px] font-bold text-white">
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight size={16} className="text-brand-muted" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="glass-brand-card overflow-hidden rounded-2xl p-4">
              <SignOutButton />
            </div>
          </div>

          {/* Right: Recent Orders */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-brand-card overflow-hidden rounded-2xl">
              <div className="flex items-center justify-between border-b border-brand-border px-5 py-4">
                <h2 className="text-base font-bold text-brand-text">Recent Orders</h2>
                <Link href="/orders" className="text-xs font-semibold text-brand-blue hover:text-brand-steel">
                  View all →
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package size={40} className="mb-3 text-brand-muted" />
                  <p className="font-semibold text-brand-text">No orders yet</p>
                  <p className="mt-1 text-sm text-brand-muted">
                    Start shopping and your orders will appear here
                  </p>
                  <Button href="/products" variant="brand-gradient" className="mt-4">
                    Shop Now
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-brand-border">
                  {recentOrders.map((order) => {
                    const s = statusColor[order.status] || statusColor.PENDING;
                    const firstItem = order.items[0];
                    return (
                      <li key={order.id}>
                        <Link
                          href={`/orders/${order.id}`}
                          className="flex items-center gap-4 px-5 py-4 hover:bg-brand-silver transition-colors"
                        >
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-brand-silver">
                            {firstItem?.product?.image ? (
                              <Image
                                src={firstItem.product.image}
                                alt={firstItem.product.name || "Product"}
                                width={56}
                                height={56}
                                className="h-full w-full object-contain p-1"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Package size={20} className="text-brand-muted" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-semibold text-brand-text">
                              {firstItem?.productName || "Order"}
                              {order.items.length > 1 && (
                                <span className="ml-1 text-brand-muted font-normal">
                                  +{order.items.length - 1} more
                                </span>
                              )}
                            </p>
                            <p className="mt-0.5 text-xs text-brand-muted flex items-center gap-1">
                              <Clock size={11} />
                              {formatDate(order.createdAt)}
                            </p>
                            <div className="mt-1.5 flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${s.bg} ${s.text} ${s.border}`}>
                                <CheckCircle2 size={10} />
                                {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                              </span>
                              <span className="text-xs font-bold text-brand-text">
                                ₹{order.total.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <ChevronRight size={16} className="shrink-0 text-brand-muted" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Quick Actions */}
            <div className="glass-brand-card overflow-hidden rounded-2xl">
              <p className="border-b border-brand-border px-5 py-3 text-xs font-bold uppercase tracking-wider text-brand-muted">
                Quick Actions
              </p>
              <div className="grid grid-cols-2 gap-px bg-brand-border sm:grid-cols-4">
                {[
                  { label: "Shop Now",    href: "/products", icon: "🛍️" },
                  { label: "My Wishlist", href: "/wishlist", icon: "❤️" },
                  { label: "Track Order", href: "/orders",   icon: "📦" },
                  { label: "Get Help",    href: "/contact",  icon: "💬" },
                ].map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="flex flex-col items-center justify-center gap-1.5 bg-white py-4 text-center transition-colors hover:bg-brand-silver"
                  >
                    <span className="text-2xl">{a.icon}</span>
                    <span className="text-xs font-semibold text-brand-text">{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Help Card */}
            <div className="glass-brand-card rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="font-semibold text-brand-text">Need help with your account?</p>
                  <p className="mt-1 text-sm text-brand-muted">
                    Our support team is available Mon–Sat, 9:15 AM to 6:15 PM
                  </p>
                  <a
                    href="tel:+919170546395"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg glass-brand-card px-4 py-2 text-sm font-semibold text-brand-blue hover:shadow-brand-glow transition-all"
                  >
                    📞 Call +91 91705 46395
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
