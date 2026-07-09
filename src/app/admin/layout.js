import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin";
import {
  LayoutDashboard, Package, ShoppingCart, Home,
  Users, Tag, Layers, Star, Ticket, Archive,
  Bell, Settings, FileText, CreditCard, Mail, BookOpen,
  TrendingUp, BarChart2, Image, UserCog, Store
} from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — hardvanta" };

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
      { href: "/admin/banners",        label: "Banners",        icon: Image },
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

export default async function AdminLayout({ children }) {
  const session = await getAdminSession();
  if (!session) redirect("/login?callbackUrl=/admin");

  return (
    <div className="container-page flex flex-col gap-6 py-8 lg:flex-row">
      <aside className="lg:w-60 shrink-0">
        <div className="rounded-xl border border-silver-light bg-white p-3 sticky top-24">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-silver-dark">
            Admin Panel
          </p>

          <nav className="space-y-4">
            {SECTIONS.map((section) => (
              <div key={section.label}>
                <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-silver-dark/60">
                  {section.label}
                </p>
                <div className="space-y-0.5">
                  {section.items.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-cloud hover:text-royal transition-colors"
                    >
                      <Icon size={16} /> {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="border-t border-silver-light pt-2">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-silver-dark hover:bg-cloud hover:text-royal transition-colors"
              >
                <Home size={16} /> Back to store
              </Link>
            </div>
          </nav>
        </div>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}