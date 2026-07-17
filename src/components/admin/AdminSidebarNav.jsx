"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Home,
  Users, Tag, Layers, Star, Ticket, Archive,
  Bell, Settings, FileText, CreditCard, Mail, BookOpen,
  TrendingUp, BarChart2, Image as ImageIcon, UserCog, Store,
  Menu, X,
} from "lucide-react";
import SwitchToUserView from "./SwitchToUserView";

const SECTIONS = [
  {
    label: "Main",
    items: [
      { href: "/admin",           label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Analytics", icon: TrendingUp },
      { href: "/admin/products",  label: "Products",  icon: Package },
      { href: "/admin/orders",    label: "Orders",    icon: ShoppingCart },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/categories", label: "Categories", icon: Layers },
      { href: "/admin/brands",     label: "Brands",     icon: Tag },
      { href: "/admin/inventory",  label: "Inventory",  icon: Archive },
    ],
  },
  {
    label: "Users",
    items: [
      { href: "/admin/customers", label: "Customers", icon: Users },
      { href: "/admin/users",     label: "All Users", icon: UserCog },
      { href: "/admin/sellers",   label: "Sellers",   icon: Store },
      { href: "/admin/reviews",   label: "Reviews",   icon: Star },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "/admin/coupons",  label: "Coupons",  icon: Ticket },
      { href: "/admin/payments", label: "Payments", icon: CreditCard },
      { href: "/admin/invoices", label: "Invoices", icon: FileText },
      { href: "/admin/reports",  label: "Reports",  icon: BarChart2 },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/blogs",          label: "Blogs",          icon: BookOpen },
      { href: "/admin/banners",        label: "Banners",        icon: ImageIcon },
      { href: "/admin/notifications",  label: "Notifications",  icon: Bell },
      { href: "/admin/contact",        label: "Contact",        icon: Mail },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function AdminSidebarNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="lg:w-64 shrink-0">
      <div className="glass-strong rounded-2xl p-3 lg:sticky lg:top-24">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="admin-sidebar-nav"
          className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/40 lg:pointer-events-none"
        >
          Admin Panel
          <span className="lg:hidden text-white/60">
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </span>
        </button>

        <nav id="admin-sidebar-nav" className={`space-y-4 ${mobileOpen ? "block" : "hidden"} lg:block`}>
          {SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map(({ href, label, icon: Icon }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-gradient-to-r from-electric to-liquid text-white shadow-glow-electric"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon size={16} /> {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="space-y-1 border-t border-white/10 pt-2">
            <SwitchToUserView />
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Home size={16} /> Back to store
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  );
}
