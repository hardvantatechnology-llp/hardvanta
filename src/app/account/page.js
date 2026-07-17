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

export const dynamic = "force-dynamic";
export const metadata = { title: "My Account — Hardvanta" };

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
    PENDING:    { bg: "bg-amber-500/10",  text: "text-amber-300",  border: "border-amber-500/20" },
    PROCESSING: { bg: "bg-electric/10",   text: "text-electric-light", border: "border-electric/20"   },
    SHIPPED:    { bg: "bg-liquid/10",     text: "text-liquid-light",  border: "border-liquid/20" },
    DELIVERED:  { bg: "bg-cyan/10",       text: "text-cyan",   border: "border-cyan/20"  },
    CANCELLED:  { bg: "bg-red-500/10",    text: "text-red-400",     border: "border-red-500/20"    },
  };

  const menuItems = [
    {
      group: "My Activities",
      items: [
        {
          icon: <Package size={20} className="text-electric-light" />,
          label: "My Orders",
          desc: `${orderCount} order${orderCount !== 1 ? "s" : ""} placed`,
          href: "/orders",
          badge: orderCount > 0 ? orderCount : null,
        },
        {
          icon: <Heart size={20} className="text-liquid" />,
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
          icon: <MapPin size={20} className="text-amber-400" />,
          label: "Saved Addresses",
          desc: "Manage delivery addresses",
          href: "/account/addresses",
          badge: null,
        },
        {
          icon: <Shield size={20} className="text-cyan" />,
          label: "Security",
          desc: "Password & login settings",
          href: "/account/security",
          badge: null,
        },
        {
          icon: <Bell size={20} className="text-liquid-light" />,
          label: "Notifications",
          desc: "Email & SMS preferences",
          href: "/account/notifications",
          badge: null,
        },
      ],
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-graphite to-obsidian">
      <div className="liquid-blob left-1/4 top-[-20%] h-96 w-96 bg-electric/10" />

      {/* Hero Banner */}
      <div className="relative border-b border-white/10">
        <div className="container-page py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-electric to-liquid text-xl font-bold text-white shadow-glow-electric ring-2 ring-white/10 overflow-hidden">
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
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Welcome back
              </p>
              <h1 className="text-xl font-bold text-white">
                {session.user.name || "Hardvanta Customer"}
              </h1>
              <p className="text-sm text-white/50">{session.user.email}</p>
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
                className="glass-card flex flex-col items-center rounded-xl py-3"
              >
                <span className="text-white/50">{s.icon}</span>
                <span className="mt-1 text-lg font-bold text-white">{s.value}</span>
                <span className="text-[11px] text-white/40">{s.label}</span>
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
                className="glass-card overflow-hidden rounded-2xl"
              >
                <p className="border-b border-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white/40">
                  {group.group}
                </p>
                <ul>
                  {group.items.map((item, i) => (
                    <li
                      key={item.label}
                      className={i !== group.items.length - 1 ? "border-b border-white/10" : ""}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/5"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white/90">{item.label}</p>
                          <p className="text-xs text-white/40">{item.desc}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.badge && (
                            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-electric to-liquid px-1.5 text-[10px] font-bold text-white">
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight size={16} className="text-white/30" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="glass-card overflow-hidden rounded-2xl p-4">
              <SignOutButton />
            </div>
          </div>

          {/* Right: Recent Orders */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card overflow-hidden rounded-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <h2 className="text-base font-bold text-white">Recent Orders</h2>
                <Link href="/orders" className="text-xs font-semibold text-electric-light hover:text-cyan">
                  View all →
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package size={40} className="mb-3 text-white/20" />
                  <p className="font-semibold text-white">No orders yet</p>
                  <p className="mt-1 text-sm text-white/40">
                    Start shopping and your orders will appear here
                  </p>
                  <Button href="/products" variant="gradient" className="mt-4">
                    Shop Now
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-white/10">
                  {recentOrders.map((order) => {
                    const s = statusColor[order.status] || statusColor.PENDING;
                    const firstItem = order.items[0];
                    return (
                      <li key={order.id}>
                        <Link
                          href={`/orders/${order.id}`}
                          className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors"
                        >
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white/5">
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
                                <Package size={20} className="text-white/20" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-semibold text-white/90">
                              {firstItem?.productName || "Order"}
                              {order.items.length > 1 && (
                                <span className="ml-1 text-white/40 font-normal">
                                  +{order.items.length - 1} more
                                </span>
                              )}
                            </p>
                            <p className="mt-0.5 text-xs text-white/40 flex items-center gap-1">
                              <Clock size={11} />
                              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric",
                              })}
                            </p>
                            <div className="mt-1.5 flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${s.bg} ${s.text} ${s.border}`}>
                                <CheckCircle2 size={10} />
                                {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                              </span>
                              <span className="text-xs font-bold text-white">
                                ₹{order.total.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <ChevronRight size={16} className="shrink-0 text-white/30" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Quick Actions */}
            <div className="glass-card overflow-hidden rounded-2xl">
              <p className="border-b border-white/10 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/40">
                Quick Actions
              </p>
              <div className="grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-4">
                {[
                  { label: "Shop Now",    href: "/products", icon: "🛍️" },
                  { label: "My Wishlist", href: "/wishlist", icon: "❤️" },
                  { label: "Track Order", href: "/orders",   icon: "📦" },
                  { label: "Get Help",    href: "/contact",  icon: "💬" },
                ].map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="flex flex-col items-center justify-center gap-1.5 bg-graphite py-4 text-center transition-colors hover:bg-white/5"
                  >
                    <span className="text-2xl">{a.icon}</span>
                    <span className="text-xs font-semibold text-white/80">{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Help Card */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-electric/10 text-electric-light">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="font-semibold text-white">Need help with your account?</p>
                  <p className="mt-1 text-sm text-white/50">
                    Our support team is available Mon–Sat, 9:15 AM to 6:15 PM
                  </p>
                  <a
                    href="tel:+919170546395"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg glass-card px-4 py-2 text-sm font-semibold text-electric-light hover:shadow-glow-electric transition-all"
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
