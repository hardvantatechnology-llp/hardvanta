"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
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
  MapPin,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useDeliveryLocation } from "@/context/DeliveryLocationContext";
import { getUserView, setUserView } from "@/lib/viewMode";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import LocationPickerModal from "@/components/delivery/LocationPickerModal";

// The drawer is closed on first paint on every page (Navbar is in the root
// layout) — split it out so its code only loads once someone opens the cart.
const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer"), { ssr: false });

// X (Twitter) official SVG — lucide mein Twitter icon nahi hota
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
  { Icon: Instagram, href: "https://www.instagram.com/hardvantatechnologies?utm_source=qr&igsh=ZG92b3oxZzczeXZw" },
  { Icon: Youtube,   href: "#" },
];

export default function Navbar() {
  const { count } = useCart();
  const router = useRouter();
  const { data: session, status } = useSession();
  const loggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";
  const { location: deliveryLocation, hydrated: locationHydrated } = useDeliveryLocation();

  const [mobileOpen, setMobileOpen]       = useState(false); // Menu drawer
  const [catOpen, setCatOpen]             = useState(false); // Categories sidebar (desktop trigger)
  const [shopOpen, setShopOpen]           = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false); // Categories sidebar (mobile trigger)
  const [query, setQuery]                 = useState("");
  const [scrolled, setScrolled]           = useState(false);
  const [cartOpen, setCartOpen]           = useState(false); // Cart drawer
  const [locationPickerOpen, setLocationPickerOpen] = useState(false); // Delivery location modal

  const categorySidebarOpen = catOpen || mobileCatOpen;
  const closeCategorySidebar = () => {
    setCatOpen(false);
    setMobileCatOpen(false);
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Purely visual: intensify the glass bar once the page has scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Live categories — fetched from the DB-backed API route instead of the
  // legacy mock array, so admin-managed categories show up here.
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/categories")
      .then((res) => (res.ok ? res.json() : { categories: [] }))
      .then((data) => {
        if (cancelled) return;
        const list = (data.categories || [])
          .filter((c) => c.active !== false)
          .sort((a, b) => a.name.localeCompare(b.name));
        setCategories(list);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // "User view": when an admin switches to user view, hide admin-only UI.
  const [userViewMode, setUserViewMode] = useState(false);
  useEffect(() => {
    const sync = () => setUserViewMode(getUserView());
    sync();
    window.addEventListener("viewmodechange", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("viewmodechange", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const showAdmin = isAdmin && !userViewMode;

  // Identical on server and client-before-hydration — the real location only
  // ever swaps in after `locationHydrated` flips, avoiding a hydration mismatch.
  const deliveryLocationLabel = !locationHydrated
    ? "Select delivery location"
    : deliveryLocation
      ? `${deliveryLocation.areaLabel}, ${deliveryLocation.city}`
      : "Select delivery location";

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
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-brand-border bg-white/95 backdrop-blur-2xl shadow-brand-glass"
          : "border-brand-border/70 bg-white/85 backdrop-blur-xl"
      }`}
    >

      {/* ── Row 1 MOBILE: Support left, Location center, Socials right ── */}
      <div className="border-b border-brand-border md:hidden">
        <div className="flex items-center justify-between gap-2 px-4 py-2">
          <a href="tel:+919170546395" className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-brand-text">
            <Phone size={14} className="text-brand-blue" />
          </a>

          <button
            type="button"
            onClick={() => setLocationPickerOpen(true)}
            className="flex min-w-0 flex-1 items-center justify-center gap-1 truncate text-xs font-semibold text-brand-text"
          >
            <MapPin size={12} className="shrink-0 text-brand-blue" />
            <span className="truncate">Deliver to {deliveryLocationLabel}</span>
            <ChevronDown size={10} className="shrink-0 text-brand-muted" />
          </button>

          <div className="flex shrink-0 items-center gap-3 text-brand-muted">
            {socials.map(({ Icon, href }, i) => (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                className="hover:text-brand-blue transition-colors duration-150">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 1 DESKTOP: Support left, Location center, Socials right ── */}
      <div className="hidden border-b border-brand-border md:block">
        <div className="container-page flex items-center justify-between py-2 text-sm">
          <div className="flex flex-1 items-center">
            <a href="tel:+919170546395" className="flex items-center gap-2 text-brand-text/90 hover:text-brand-blue transition-colors">
              <Phone size={15} className="text-brand-blue" />
              <span className="font-semibold">+91 91705 46395</span>
              <span className="text-brand-muted">· Customer Support</span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setLocationPickerOpen(true)}
            className="flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap font-semibold text-brand-text hover:text-brand-blue transition-colors"
          >
            <MapPin size={14} className="text-brand-blue" />
            <span>Deliver to {deliveryLocationLabel}</span>
            <ChevronDown size={12} className="text-brand-muted" />
          </button>

          <div className="flex flex-1 items-center justify-end gap-3 text-brand-muted">
            {mounted && isAdmin && (
              <button
                onClick={() => {
                  if (userViewMode) { setUserView(false); router.push("/admin"); }
                  else { setUserView(true); router.push("/"); }
                }}
                className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue hover:bg-brand-blue/20 transition-colors"
                title={userViewMode ? "Switch back to admin" : "Browse the store as a normal customer"}
              >
                {userViewMode ? "🔧 Back to Admin" : "👁 View as customer"}
              </button>
            )}
            {socials.map(({ Icon, href }, i) => (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                className="hover:text-brand-blue transition-colors duration-150">
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 2: Logo + Search + Icons ── */}
      <div className="border-b border-brand-border">
        <div className="container-page flex items-center gap-3 py-2.5">

          <Logo size={60} />

          {/* Search — inline on all screens */}
          <SearchBar />

          {/* Desktop action icons */}
          <div className="hidden md:flex items-center gap-5 text-brand-text/90">
            <Link href="/compare" className="group flex flex-col items-center text-xs hover:text-brand-blue transition-colors duration-150">
              <Repeat size={20} className="group-hover:scale-110 transition-transform duration-150" />
              <span className="mt-0.5">Compare</span>
            </Link>
            <Link href="/orders" className="group flex flex-col items-center text-xs hover:text-brand-blue transition-colors duration-150">
              <Package size={20} className="group-hover:scale-110 transition-transform duration-150" />
              <span className="mt-0.5">Orders</span>
            </Link>
            {showAdmin && (
              <Link href="/admin" className="group flex flex-col items-center text-xs font-semibold text-brand-blue hover:text-brand-steel transition-colors duration-150">
                <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform duration-150" />
                <span className="mt-0.5">Admin</span>
              </Link>
            )}
            <Link href={loggedIn ? "/account" : "/login"} className="group flex flex-col items-center text-xs hover:text-brand-blue transition-colors duration-150">
              <User size={20} className="group-hover:scale-110 transition-transform duration-150" />
              <span className="mt-0.5">{loggedIn ? "Account" : "Login"}</span>
            </Link>
            {loggedIn && (
              <button onClick={() => signOut({ callbackUrl: "/" })}
                className="group flex flex-col items-center text-xs hover:text-brand-blue transition-colors duration-150">
                <LogOut size={20} className="group-hover:scale-110 transition-transform duration-150" />
                <span className="mt-0.5">Logout</span>
              </button>
            )}
            <Link href="/wishlist" className="group flex flex-col items-center text-xs hover:text-brand-blue transition-colors duration-150">
              <Heart size={20} className="group-hover:scale-110 group-hover:fill-brand-navy/30 transition-all duration-150" />
              <span className="mt-0.5">Wishlist</span>
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="group relative flex flex-col items-center text-xs hover:text-brand-blue transition-colors duration-150"
            >
              <ShoppingBag size={20} className="group-hover:scale-110 transition-transform duration-150" />
              <span className="mt-0.5">Cart</span>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute -right-2 -top-1.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-navy px-1 text-[10px] font-bold text-white shadow-brand-glow"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Mobile icons: cart only (search is in Row 3) */}
          <div className="flex md:hidden items-center gap-3 ml-auto">
            <Link href={loggedIn ? "/account" : "/login"} className="text-brand-text/90 hover:text-brand-blue transition-colors">
              <User size={22} />
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative text-brand-text/90 hover:text-brand-blue transition-colors"
            >
              <ShoppingBag size={22} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex min-w-[16px] h-[16px] items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-navy text-[9px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Row 3 MOBILE: ≡ All Categories  icons  ≡ Menu ── */}
      <div className="border-b border-brand-border md:hidden">
        <div className="flex items-center justify-between px-4 py-2">
          {/* All Categories — opens the categories sidebar */}
          <button
            onClick={() => { setMobileCatOpen(true); setMobileOpen(false); }}
            className="flex items-center gap-1.5 text-sm font-semibold text-brand-text">
            <AlignJustify size={18} />
            <span>All Categories</span>
            <ChevronRight size={14} />
          </button>

          <div className="flex items-center gap-5 text-brand-text/90">
            <Link href="/compare" title="Compare"><Repeat size={20} /></Link>
            <Link href="/orders" title="Orders"><Package size={20} /></Link>
            {showAdmin && <Link href="/admin"><LayoutDashboard size={20} className="text-brand-blue" /></Link>}
          </div>

          <button
            onClick={() => { setMobileOpen((v) => !v); setMobileCatOpen(false); }}
            className="flex items-center gap-1.5 text-sm font-semibold text-brand-text">
            <Menu size={18} />
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* ── Row 3 DESKTOP: Full nav bar ── */}
      <div className="hidden border-b border-brand-border md:block">
        <div className="container-page flex items-stretch">
          <button
            onClick={() => setCatOpen(true)}
            className="flex h-full items-center gap-2 bg-gradient-to-r from-brand-blue to-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-brand-glow transition-all hover:brightness-110">
            <AlignJustify size={16} /> All Categories <ChevronDown size={14} />
          </button>

          <nav className="flex flex-1 flex-wrap items-center">
            {navLinks.map((l) =>
              l.label === "Shop" ? (
                <div key={l.label} className="relative"
                  onMouseEnter={() => setShopOpen(true)}
                  onMouseLeave={() => setShopOpen(false)}
                  onFocus={() => setShopOpen(true)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) setShopOpen(false);
                  }}>
                  <Link href={l.href}
                    aria-haspopup="true"
                    aria-expanded={shopOpen}
                    className="flex items-center gap-1 whitespace-nowrap px-3 py-3 text-sm font-medium text-brand-text/90 hover:text-brand-blue transition-colors duration-150">
                    {l.label} <ChevronDown size={13} className={`transition-transform duration-200 ${shopOpen ? "rotate-180" : ""}`} />
                  </Link>
                  <div
                    className={`absolute left-0 top-full z-50 w-52 rounded-b-2xl glass-brand-strong py-2 transition-all duration-200 origin-top ${
                      shopOpen ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"
                    }`}
                  >
                    {shopMenu.map((m) => (
                      <Link key={m.label} href={m.href}
                        className="block px-4 py-2.5 text-sm text-brand-text/80 hover:bg-brand-silver hover:text-brand-blue hover:pl-6 transition-all duration-150">
                        {m.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={l.label} href={l.href}
                  className="flex items-center gap-1 whitespace-nowrap px-3 py-3 text-sm font-medium text-brand-text/90 hover:text-brand-blue transition-colors duration-150">
                  {l.label}
                  {l.dropdown && <ChevronDown size={13} />}
                </Link>
              )
            )}
          </nav>

          <Link href="/sell"
            className="flex items-center gap-2 border-l border-brand-border bg-brand-silver/60 px-5 py-3 text-sm font-semibold text-brand-text hover:text-brand-blue hover:bg-brand-silver transition-colors duration-150">
            <ShoppingBag size={16} /> Sell on HV KART
          </Link>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {/* Portalled to document.body and pinned to the live-measured navbar height
          so it always sits flush against the bottom of the navbar. */}
      {mounted && createPortal(
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-white/95 backdrop-blur-2xl md:hidden"
              style={{ top: headerHeight }}
            >
              <div className="px-4 pb-8 pt-3">

                <div className="mb-4">
                  <SearchBar />
                </div>

                {/* Nav Links */}
                <div className="mb-4 rounded-2xl glass-brand overflow-hidden">
                  {navLinks.map((l, i) => (
                    <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 text-sm font-medium text-brand-text/90 hover:bg-brand-silver hover:text-brand-blue transition-colors ${
                        i !== navLinks.length - 1 ? "border-b border-brand-border" : ""}`}>
                      <span>{l.label}</span>
                      {l.dropdown && <ChevronDown size={14} className="text-brand-muted" />}
                    </Link>
                  ))}
                </div>

                {/* All Categories — opens the categories sidebar */}
                <button
                  onClick={() => { setMobileCatOpen(true); setMobileOpen(false); }}
                  className="mb-4 flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-brand-blue to-brand-navy px-4 py-3 text-sm font-semibold text-white shadow-brand-glow">
                  <span className="flex items-center gap-2"><AlignJustify size={15} /> All Categories</span>
                  <ChevronRight size={15} />
                </button>

                {/* Account */}
                <div className="mb-4 rounded-2xl glass-brand overflow-hidden">
                  <Link href={loggedIn ? "/account" : "/login"} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 border-b border-brand-border px-4 py-3 text-sm font-medium text-brand-text/90 hover:bg-brand-silver">
                    <User size={18} className="text-brand-blue" />
                    {loggedIn ? "My Account" : "Login / Register"}
                  </Link>
                  <Link href="/orders" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 border-b border-brand-border px-4 py-3 text-sm font-medium text-brand-text/90 hover:bg-brand-silver">
                    <Package size={18} className="text-brand-blue" /> My Orders
                  </Link>
                  <Link href="/wishlist" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-brand-text/90 hover:bg-brand-silver">
                    <Heart size={18} className="text-brand-blue" /> Wishlist
                  </Link>
                  {showAdmin && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 border-t border-brand-border px-4 py-3 text-sm font-semibold text-brand-blue hover:bg-brand-silver">
                      <LayoutDashboard size={18} /> Admin Dashboard
                    </Link>
                  )}
                  {mounted && isAdmin && (
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        if (userViewMode) { setUserView(false); router.push("/admin"); }
                        else { setUserView(true); router.push("/"); }
                      }}
                      className="flex w-full items-center gap-3 border-t border-brand-border px-4 py-3 text-sm font-medium text-brand-text/90 hover:bg-brand-silver">
                      {userViewMode
                        ? <><LayoutDashboard size={18} className="text-brand-blue" /> Back to Admin</>
                        : <><User size={18} className="text-brand-blue" /> View as customer</>}
                    </button>
                  )}
                  {loggedIn && (
                    <button onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                      className="flex w-full items-center gap-3 border-t border-brand-border px-4 py-3 text-sm font-medium text-brand-text/90 hover:bg-brand-silver">
                      <LogOut size={18} className="text-brand-blue" /> Logout
                    </button>
                  )}
                </div>

                {/* Socials */}
                <div className="flex items-center justify-center gap-4 py-2">
                  {socials.map(({ Icon, href }, i) => (
                    <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-full glass-brand text-brand-text/90 hover:text-brand-blue transition-colors">
                      <Icon size={17} />
                    </a>
                  ))}
                </div>

                {/* Contact */}
                <div className="mt-2 rounded-2xl glass-brand px-4 py-3 text-center">
                  <p className="text-xs text-brand-muted">Customer Support · 9:15 AM – 6:15 PM, Mon–Sat</p>
                  <a href="tel:+919170546395"
                    className="mt-1 flex items-center justify-center gap-2 font-semibold text-brand-text/90 hover:text-brand-blue">
                    <Phone size={15} className="text-brand-blue" /> +91 91705 46395
                  </a>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ── All Categories Sidebar (works across mobile, tablet & desktop) ── */}
      {/* Portalled to document.body so it is always truly fixed to the real
          viewport — never trapped inside a transformed/sticky ancestor. */}
      {mounted && createPortal(
        <>
          {/* Overlay */}
          <div
            onClick={closeCategorySidebar}
            aria-hidden={!categorySidebarOpen}
            className={`fixed inset-0 z-[90] h-screen w-screen bg-brand-navy/40 backdrop-blur-sm transition-opacity duration-300 ${
              categorySidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          />

          {/* Sliding panel */}
          <aside
            role="dialog"
            aria-label="All Categories"
            aria-hidden={!categorySidebarOpen}
            className={`fixed left-0 top-0 z-[100] flex h-screen w-[86%] max-w-[300px] flex-col glass-brand-strong shadow-2xl transition-transform duration-300 ease-in-out sm:max-w-[320px] ${
              categorySidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Sidebar header */}
            <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-brand-blue to-brand-navy px-5 py-4">
              <span className="flex items-center gap-2 text-base font-semibold text-white">
                <AlignJustify size={18} /> All Categories
              </span>
              <button
                onClick={closeCategorySidebar}
                aria-label="Close categories"
                className="rounded-full p-1.5 text-white transition-colors hover:bg-white/20">
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
                  className={`flex items-center justify-between px-5 py-3.5 text-sm font-medium text-brand-text/90 transition-colors hover:bg-brand-silver hover:text-brand-blue ${
                    i !== categories.length - 1 ? "border-b border-brand-border" : ""
                  }`}
                >
                  <span>{c.name}</span>
                  <ChevronRight size={15} className="text-brand-muted" />
                </Link>
              ))}
            </div>
          </aside>
        </>,
        document.body
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <LocationPickerModal open={locationPickerOpen} onClose={() => setLocationPickerOpen(false)} />
    </header>
  );
}
