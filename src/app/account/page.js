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
    PENDING:    { bg: "bg-yellow-50",  text: "text-yellow-700",  border: "border-yellow-200" },
    PROCESSING: { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200"   },
    SHIPPED:    { bg: "bg-purple-50",  text: "text-purple-700",  border: "border-purple-200" },
    DELIVERED:  { bg: "bg-green-50",   text: "text-green-700",   border: "border-green-200"  },
    CANCELLED:  { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200"    },
  };

  const menuItems = [
    {
      group: "My Activities",
      items: [
        {
          icon: <Package size={20} className="text-royal" />,
          label: "My Orders",
          desc: `${orderCount} order${orderCount !== 1 ? "s" : ""} placed`,
          href: "/orders",
          badge: orderCount > 0 ? orderCount : null,
        },
        {
          icon: <Heart size={20} className="text-red-500" />,
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
          icon: <MapPin size={20} className="text-orange-500" />,
          label: "Saved Addresses",
          desc: "Manage delivery addresses",
          href: "/account/addresses",
          badge: null,
        },
        {
          icon: <Shield size={20} className="text-green-600" />,
          label: "Security",
          desc: "Password & login settings",
          href: "/account/security",
          badge: null,
        },
        {
          icon: <Bell size={20} className="text-purple-500" />,
          label: "Notifications",
          desc: "Email & SMS preferences",
          href: "/account/notifications",
          badge: null,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-cloud">
      {/* Hero Banner */}
      <div className="bg-navy">
        <div className="container-page py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-royal text-xl font-bold text-white shadow-lg ring-2 ring-white/20 overflow-hidden">
              {session.user.image ? (
                // ✅ <img> → <Image> fix
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
              <p className="text-xs font-semibold uppercase tracking-wider text-silver/60">
                Welcome back
              </p>
              <h1 className="text-xl font-bold text-white">
                {session.user.name || "Hardvanta Customer"}
              </h1>
              <p className="text-sm text-silver">{session.user.email}</p>
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
                className="flex flex-col items-center rounded-xl bg-white/10 py-3 backdrop-blur"
              >
                <span className="text-silver/70">{s.icon}</span>
                <span className="mt-1 text-lg font-bold text-white">{s.value}</span>
                <span className="text-[11px] text-silver/70">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Menu */}
          <div className="space-y-4 lg:col-span-1">
            {menuItems.map((group) => (
              <div
                key={group.group}
                className="overflow-hidden rounded-xl border border-silver-light bg-white shadow-card"
              >
                <p className="border-b border-silver-light bg-cloud px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-silver-dark">
                  {group.group}
                </p>
                <ul>
                  {group.items.map((item, i) => (
                    <li
                      key={item.label}
                      className={i !== group.items.length - 1 ? "border-b border-silver-light" : ""}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-cloud"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cloud">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-navy">{item.label}</p>
                          <p className="text-xs text-silver-dark">{item.desc}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.badge && (
                            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-royal px-1.5 text-[10px] font-bold text-white">
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight size={16} className="text-silver-dark" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="overflow-hidden rounded-xl border border-silver-light bg-white p-4 shadow-card">
              <SignOutButton />
            </div>
          </div>

          {/* Right: Recent Orders */}
          <div className="lg:col-span-2 space-y-4">
            <div className="overflow-hidden rounded-xl border border-silver-light bg-white shadow-card">
              <div className="flex items-center justify-between border-b border-silver-light px-5 py-4">
                <h2 className="text-base font-bold text-navy">Recent Orders</h2>
                <Link href="/orders" className="text-xs font-semibold text-royal hover:underline">
                  View all →
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package size={40} className="mb-3 text-silver" />
                  <p className="font-semibold text-navy">No orders yet</p>
                  <p className="mt-1 text-sm text-silver-dark">
                    Start shopping and your orders will appear here
                  </p>
                  <Link href="/products">
                    <button className="mt-4 rounded-lg bg-royal px-6 py-2.5 text-sm font-semibold text-white hover:bg-royal-dark transition-colors">
                      Shop Now
                    </button>
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-silver-light">
                  {recentOrders.map((order) => {
                    const s = statusColor[order.status] || statusColor.PENDING;
                    const firstItem = order.items[0];
                    return (
                      <li key={order.id}>
                        <Link
                          href={`/orders/${order.id}`}
                          className="flex items-center gap-4 px-5 py-4 hover:bg-cloud transition-colors"
                        >
                          {/* ✅ <img> → <Image> fix */}
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-silver-light bg-cloud">
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
                                <Package size={20} className="text-silver" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-semibold text-navy">
                              {firstItem?.productName || "Order"}
                              {order.items.length > 1 && (
                                <span className="ml-1 text-silver-dark font-normal">
                                  +{order.items.length - 1} more
                                </span>
                              )}
                            </p>
                            <p className="mt-0.5 text-xs text-silver-dark flex items-center gap-1">
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
                              <span className="text-xs font-bold text-navy">
                                ₹{order.total.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <ChevronRight size={16} className="shrink-0 text-silver-dark" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Quick Actions */}
            <div className="overflow-hidden rounded-xl border border-silver-light bg-white shadow-card">
              <p className="border-b border-silver-light bg-cloud px-5 py-3 text-xs font-bold uppercase tracking-wider text-silver-dark">
                Quick Actions
              </p>
              <div className="grid grid-cols-2 gap-px bg-silver-light sm:grid-cols-4">
                {[
                  { label: "Shop Now",    href: "/products", icon: "🛍️" },
                  { label: "My Wishlist", href: "/wishlist", icon: "❤️" },
                  { label: "Track Order", href: "/orders",   icon: "📦" },
                  { label: "Get Help",    href: "/contact",  icon: "💬" },
                ].map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="flex flex-col items-center justify-center gap-1.5 bg-white py-4 text-center transition-colors hover:bg-cloud"
                  >
                    <span className="text-2xl">{a.icon}</span>
                    <span className="text-xs font-semibold text-navy">{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Help Card */}
            <div className="rounded-xl border border-royal/20 bg-royal/5 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-royal/10 text-royal">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="font-semibold text-navy">Need help with your account?</p>
                  <p className="mt-1 text-sm text-silver-dark">
                    Our support team is available Mon–Sat, 9:15 AM to 6:15 PM
                  </p>
                  <a
                    href="tel:+919170546395"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-royal bg-white px-4 py-2 text-sm font-semibold text-royal hover:bg-royal hover:text-white transition-colors"
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