"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  Repeat,
  Package,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Phone,
  LogOut,
  LayoutDashboard,
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
  AlignJustify,
} from "lucide-react";
import { categories } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import Logo from "./Logo";

function XIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products", dropdown: true },
  { label: "Bulk Enquiry", href: "/bulk-enquiry" },
  { label: "New Arrivals", href: "/products" },
  { label: "ATL Kits Enquiry", href: "/atl-kits-enquiry" },
  { label: "Blogs", href: "/blogs" },
  { label: "Tools", href: "/tools" },
];

const shopMenu = [
  { label: "Shop", href: "/products" },
  { label: "Track your order", href: "/orders" },
  { label: "Featured Brands", href: "/products" },
  { label: "Payment Options", href: "/checkout" },
];

const socials = [
  { Icon: Facebook,  href: "#" },
  { Icon: XIcon,     href: "#" },
  { Icon: Linkedin,  href: "https://www.linkedin.com/company/hardvanta-technologies-llp/posts/?feedView=all" },
  { Icon: Instagram, href: "https://www.instagram.com/hardvantatechnology" },
  { Icon: Youtube,   href: "#" },
];

export default function Navbar() {
  const { count } = useCart();
  const router = useRouter();
  const { data: session, status } = useSession();
  const loggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";

  const [mobileOpen, setMobileOpen]       = useState(false); // Menu drawer
  const [catOpen, setCatOpen]             = useState(false); // Categories sidebar (desktop trigger)
  const [shopOpen, setShopOpen]           = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false); // Categories sidebar (mobile trigger)
  const [query, setQuery]                 = useState("");

  const categorySidebarOpen = catOpen || mobileCatOpen;
  const closeCategorySidebar = () => {
    setCatOpen(false);
    setMobileCatOpen(false);
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Measure the real navbar height live, so the mobile drawer can snap
  // exactly to its bottom edge instead of relying on a fixed pixel guess
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => setHeaderHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Lock background scroll while the categories sidebar or mobile drawer is open
  useEffect(() => {
    if (categorySidebarOpen || mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [categorySidebarOpen, mobileOpen]);

  function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    setMobileOpen(false);
  }

  return (
    <header ref={headerRef} className="sticky top-0 z-50 w-full bg-white">

      {/* ── Row 1 MOBILE: Phone (centered) ── */}
      <div className="border-b border-silver-light bg-white md:hidden">
        <div className="flex flex-col items-center gap-1.5 py-2">
          <a href="tel:+919170546395" className="flex items-center gap-2 text-sm font-bold text-navy">
            <Phone size={14} className="text-navy" />
            <span>+91 91705 46395</span>
            <span className="font-normal text-navy">Customer Support</span>
          </a>
          <div className="flex items-center gap-4 text-navy">
            {socials.map(({ Icon, href }, i) => (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                className="hover:text-royal transition-colors">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 1 DESKTOP: Phone + Socials single line ── */}
      <div className="hidden border-b border-silver-light bg-white md:block">
        <div className="container-page flex items-center justify-between py-2 text-sm">
          <a href="tel:+919170546395" className="flex items-center gap-2 text-navy">
            <Phone size={15} className="text-royal" />
            <span className="font-semibold">+91 91705 46395</span>
            <span className="text-silver-dark">Customer Support</span>
          </a>
          <div className="flex items-center gap-3 text-silver-dark">
            {socials.map(({ Icon, href }, i) => (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                className="hover:text-royal transition-colors">
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 2: Logo + Search + Icons ── */}
      <div className="border-b border-silver-light bg-white">
        <div className="container-page flex items-center gap-3 py-2.5">

          <Logo size={48} />

          {/* Search — desktop only */}
          <form onSubmit={handleSearch}
            className="hidden flex-1 md:flex items-center overflow-hidden rounded-full border border-silver bg-white shadow-sm">
            <span className="pl-4 text-silver-dark"><Search size={17} /></span>
            <input type="text" value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for Products..."
              className="w-full px-3 py-2 text-sm text-navy outline-none bg-transparent"
            />
            <button type="submit"
              className="m-1 rounded-full bg-royal px-5 py-2 text-sm font-semibold text-white hover:bg-royal-dark transition-colors">
              Search
            </button>
          </form>

          {/* Desktop action icons */}
          <div className="hidden md:flex items-center gap-5 text-navy">
            <Link href="#" className="flex flex-col items-center text-xs hover:text-royal transition-colors">
              <Repeat size={20} /><span className="mt-0.5">Compare</span>
            </Link>
            <Link href="/orders" className="flex flex-col items-center text-xs hover:text-royal transition-colors">
              <Package size={20} /><span className="mt-0.5">Orders</span>
            </Link>
            {isAdmin && (
              <Link href="/admin" className="flex flex-col items-center text-xs font-semibold text-royal hover:text-royal-dark transition-colors">
                <LayoutDashboard size={20} /><span className="mt-0.5">Admin</span>
              </Link>
            )}
            <Link href={loggedIn ? "/account" : "/login"} className="flex flex-col items-center text-xs hover:text-royal transition-colors">
              <User size={20} /><span className="mt-0.5">{loggedIn ? "Account" : "Login"}</span>
            </Link>
            {loggedIn && (
              <button onClick={() => signOut({ callbackUrl: "/" })}
                className="flex flex-col items-center text-xs hover:text-royal transition-colors">
                <LogOut size={20} /><span className="mt-0.5">Logout</span>
              </button>
            )}
            <Link href="/wishlist" className="flex flex-col items-center text-xs hover:text-royal transition-colors">
              <Heart size={20} /><span className="mt-0.5">Wishlist</span>
            </Link>
            <Link href="/cart" className="relative flex flex-col items-center text-xs hover:text-royal transition-colors">
              <ShoppingBag size={20} /><span className="mt-0.5">Cart</span>
              {count > 0 && (
                <span className="absolute -right-2 -top-1.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-royal px-1 text-[10px] font-bold text-white">{count}</span>
              )}
            </Link>
          </div>

          {/* Mobile icons: 👤 🛒 only */}
          <div className="flex md:hidden items-center gap-3 ml-auto">
            <Link href={loggedIn ? "/account" : "/login"} className="text-navy hover:text-royal">
              <User size={22} />
            </Link>
            <Link href="/cart" className="relative text-navy hover:text-royal">
              <ShoppingBag size={22} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex min-w-[16px] h-[16px] items-center justify-center rounded-full bg-royal text-[9px] font-bold text-white">{count}</span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Row 3 MOBILE: ≡ All Categories  icons  ≡ Menu ── */}
      <div className="border-b border-silver-light bg-white md:hidden">
        <div className="flex items-center justify-between px-4 py-2">
          {/* All Categories — opens the categories sidebar */}
          <button
            onClick={() => { setMobileCatOpen(true); setMobileOpen(false); }}
            className="flex items-center gap-1.5 text-sm font-semibold text-navy">
            <AlignJustify size={18} />
            <span>All Categories</span>
            <ChevronRight size={14} />
          </button>

          <div className="flex items-center gap-5 text-navy">
            <Link href="#" title="Compare"><Repeat size={20} /></Link>
            <Link href="/orders" title="Orders"><Package size={20} /></Link>
            {isAdmin && <Link href="/admin"><LayoutDashboard size={20} className="text-royal" /></Link>}
          </div>

          {/* Menu — apni alag state */}
          <button
            onClick={() => { setMobileOpen((v) => !v); setMobileCatOpen(false); }}
            className="flex items-center gap-1.5 text-sm font-semibold text-navy">
            <Menu size={18} />
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* ── Row 3 DESKTOP: Full nav bar ── */}
      <div className="hidden border-b border-silver-light bg-white shadow-sm md:block">
        <div className="container-page flex items-stretch">
          <button
            onClick={() => setCatOpen(true)}
            className="flex h-full items-center gap-2 bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-dark transition-colors">
            <AlignJustify size={16} /> All Categories <ChevronDown size={14} />
          </button>

          <nav className="flex flex-1 flex-wrap items-center">
            {navLinks.map((l) =>
              l.label === "Shop" ? (
                <div key={l.label} className="relative"
                  onMouseEnter={() => setShopOpen(true)}
                  onMouseLeave={() => setShopOpen(false)}>
                  <Link href={l.href}
                    className="flex items-center gap-1 whitespace-nowrap px-3 py-3 text-sm font-medium text-navy hover:text-royal transition-colors">
                    {l.label} <ChevronDown size={13} />
                  </Link>
                  {shopOpen && (
                    <div className="absolute left-0 top-full z-50 w-52 rounded-b-lg border border-silver-light bg-white py-2 shadow-xl">
                      {shopMenu.map((m) => (
                        <Link key={m.label} href={m.href}
                          className="block px-4 py-2.5 text-sm text-navy hover:bg-cloud hover:text-royal transition-colors">
                          {m.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={l.label} href={l.href}
                  className="flex items-center gap-1 whitespace-nowrap px-3 py-3 text-sm font-medium text-navy hover:text-royal transition-colors">
                  {l.label}
                  {l.dropdown && <ChevronDown size={13} />}
                </Link>
              )
            )}
          </nav>

          <Link href="#"
            className="flex items-center gap-2 border-l border-silver-light bg-cloud px-5 py-3 text-sm font-semibold text-navy hover:text-royal transition-colors">
            <ShoppingBag size={16} /> Sell on Hardvanta
          </Link>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {/* Portalled to document.body (same reasoning as the categories
          sidebar) and pinned to the live-measured navbar height so it
          always sits flush against the bottom of the navbar — no gap,
          no overlap — regardless of exact navbar height on the device. */}
      {mounted && mobileOpen && createPortal(
        <div
          className="fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-white md:hidden"
          style={{ top: headerHeight }}
        >
          <div className="px-4 pb-8 pt-3">

            {/* Search */}
            <form onSubmit={handleSearch}
              className="mb-4 flex items-center overflow-hidden rounded-full border border-silver shadow-sm">
              <span className="pl-4 text-silver-dark"><Search size={16} /></span>
              <input type="text" value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for Products..."
                className="w-full px-3 py-2.5 text-sm outline-none"
              />
              <button type="submit" className="m-1 rounded-full bg-royal px-4 py-2 text-white">
                <Search size={15} />
              </button>
            </form>

            {/* Nav Links */}
            <div className="mb-4 rounded-xl border border-silver-light overflow-hidden">
              {navLinks.map((l, i) => (
                <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 text-sm font-medium text-navy hover:bg-cloud hover:text-royal transition-colors ${
                    i !== navLinks.length - 1 ? "border-b border-silver-light" : ""}`}>
                  <span>{l.label}</span>
                  {l.dropdown && <ChevronDown size={14} className="text-silver-dark" />}
                </Link>
              ))}
            </div>

            {/* All Categories — opens the categories sidebar */}
            <button
              onClick={() => { setMobileCatOpen(true); setMobileOpen(false); }}
              className="mb-4 flex w-full items-center justify-between rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white">
              <span className="flex items-center gap-2"><AlignJustify size={15} /> All Categories</span>
              <ChevronRight size={15} />
            </button>

            {/* Account */}
            <div className="mb-4 rounded-xl border border-silver-light overflow-hidden">
              <Link href={loggedIn ? "/account" : "/login"} onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 border-b border-silver-light px-4 py-3 text-sm font-medium text-navy hover:bg-cloud">
                <User size={18} className="text-royal" />
                {loggedIn ? "My Account" : "Login / Register"}
              </Link>
              <Link href="/orders" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 border-b border-silver-light px-4 py-3 text-sm font-medium text-navy hover:bg-cloud">
                <Package size={18} className="text-royal" /> My Orders
              </Link>
              <Link href="/wishlist" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-navy hover:bg-cloud">
                <Heart size={18} className="text-royal" /> Wishlist
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 border-t border-silver-light px-4 py-3 text-sm font-semibold text-royal hover:bg-cloud">
                  <LayoutDashboard size={18} /> Admin Dashboard
                </Link>
              )}
              {loggedIn && (
                <button onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                  className="flex w-full items-center gap-3 border-t border-silver-light px-4 py-3 text-sm font-medium text-navy hover:bg-cloud">
                  <LogOut size={18} className="text-royal" /> Logout
                </button>
              )}
            </div>

            {/* Socials */}
            <div className="flex items-center justify-center gap-4 py-2">
              {socials.map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-silver-light text-navy hover:border-royal hover:text-royal transition-colors">
                  <Icon size={17} />
                </a>
              ))}
            </div>

            {/* Contact */}
            <div className="mt-2 rounded-xl border border-silver-light bg-cloud px-4 py-3 text-center">
              <p className="text-xs text-silver-dark">Customer Support · 9:15 AM – 6:15 PM, Mon–Sat</p>
              <a href="tel:+919170546395"
                className="mt-1 flex items-center justify-center gap-2 font-semibold text-navy hover:text-royal">
                <Phone size={15} className="text-royal" /> +91 91705 46395
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── All Categories Sidebar (works across mobile, tablet & desktop) ── */}
      {/* Portalled to document.body so it is always truly fixed to the real
          viewport — never trapped inside a transformed/sticky ancestor,
          which is what was causing the panel to open with a gap at the top. */}
      {mounted && createPortal(
        <>
          {/* Overlay */}
          <div
            onClick={closeCategorySidebar}
            aria-hidden={!categorySidebarOpen}
            className={`fixed inset-0 z-[90] h-screen w-screen bg-navy/50 backdrop-blur-[2px] transition-opacity duration-300 ${
              categorySidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          />

          {/* Sliding panel */}
          <aside
            role="dialog"
            aria-label="All Categories"
            aria-hidden={!categorySidebarOpen}
            className={`fixed left-0 top-0 z-[100] flex h-screen w-[86%] max-w-[300px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:max-w-[320px] ${
              categorySidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Sidebar header */}
            <div className="flex shrink-0 items-center justify-between bg-navy px-5 py-4">
              <span className="flex items-center gap-2 text-base font-semibold text-white">
                <AlignJustify size={18} /> All Categories
              </span>
              <button
                onClick={closeCategorySidebar}
                aria-label="Close categories"
                className="rounded-full p-1.5 text-white transition-colors hover:bg-navy-dark hover:text-royal-light">
                <X size={20} />
              </button>
            </div>

            {/* Sidebar category list */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {categories.map((c, i) => (
                <Link
                  key={c.slug}
                  href={`/products?category=${c.slug}`}
                  onClick={closeCategorySidebar}
                  className={`flex items-center justify-between px-5 py-3.5 text-sm font-medium text-navy transition-colors hover:bg-cloud hover:text-royal ${
                    i !== categories.length - 1 ? "border-b border-silver-light" : ""
                  }`}
                >
                  <span>{c.name}</span>
                  <ChevronRight size={15} className="text-silver-dark" />
                </Link>
              ))}
            </div>
          </aside>
        </>,
        document.body
      )}
    </header>
  );
}