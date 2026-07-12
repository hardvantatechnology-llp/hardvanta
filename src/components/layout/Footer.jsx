import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
import Logo from "./Logo";

const columns = [
  {
    title: "Information",
    links: [
      { label: "Track Your Order", href: "/orders" },
      { label: "Videos", href: "/videos" },
      { label: "FAQ", href: "/faq" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "My Account",
    links: [
      { label: "My Account", href: "/account" },
      { label: "Cart", href: "/cart" },
      { label: "Checkout", href: "/checkout" },
      { label: "Payment Options", href: "/payment-options" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Hardvanta B2B", href: "/b2b" },
      { label: "Bulk Orders", href: "/b2b#bulk" },
      { label: "Prototyping Services", href: "/b2b#prototyping" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Investor Relations", href: "/investor-relations" },
      { label: "CSR", href: "/csr" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Shipping & Refund", href: "/shipping-refund" },
      { label: "E-Waste Collection", href: "/ewaste" },
    ],
  },
];

const socials = [
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: Twitter, href: "#", label: "Twitter" },
  {
    Icon: Linkedin,
    href: "https://www.linkedin.com/company/hardvanta-technologies-llp/posts/?feedView=all",
    label: "LinkedIn",
  },
  {
    Icon: Instagram,
    href: "https://www.instagram.com/hardvantatechnology",
    label: "Instagram",
  },
  { Icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-navy text-silver-light">

      {/* Newsletter strip */}
      <div className="border-b border-white/10 bg-navy-dark">
        <div className="container-page grid items-center gap-6 py-8 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-bold text-white">
              Subscribe to our Newsletter
            </h3>
            <p className="mt-1 text-sm text-silver">
              Get promotional offers &amp; discounts straight to your inbox.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="First Name"
              className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-silver outline-none focus:border-royal sm:w-1/3"
            />
            <input
              type="email"
              placeholder="Email Id"
              className="w-full flex-1 rounded-lg border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-silver outline-none focus:border-royal"
            />
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg bg-royal px-5 py-2.5 text-sm font-semibold text-white hover:bg-royal-light transition-colors"
            >
              <Mail size={15} /> Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="container-page grid grid-cols-2 gap-8 py-12 sm:grid-cols-2 md:grid-cols-6">

        {/* Brand col */}
        <div className="col-span-2">
          <Logo size={44} dark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-silver">
            India&apos;s store for robotics, electronics and DIY engineering
            products. Your ideas, our parts!
          </p>
          <p className="mt-1 text-xs text-silver/70">
            A unit of Hardvanta Technologies
          </p>

          {/* Contact */}
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-silver/60">
              Got Questions?
            </p>
            <p className="mt-0.5 text-xs text-silver">
              Call us 9:15 AM – 6:15 PM, Mon–Sat
            </p>
            <a
              href="tel:+919170546395"
              className="mt-2 flex items-center gap-2 text-white hover:text-royal-light transition-colors"
            >
              <Phone size={15} className="text-royal-light" />
              <span className="font-semibold">+91 91705 46395</span>
            </a>
          </div>

          {/* App store buttons */}
          <div className="mt-5 flex gap-3">
            <a
              href="#"
              className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-xs text-white hover:border-royal hover:bg-white/10 transition-colors"
            >
              <span>▶</span> Google Play
            </a>
            <a
              href="#"
              className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-xs text-white hover:border-royal hover:bg-white/10 transition-colors"
            >
              <span></span> App Store
            </a>
          </div>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              {col.title}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-silver hover:text-royal-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-5 sm:flex-row">
          <p className="text-xs text-silver/70">
            © 2026 Hardvanta — All Rights Reserved.
          </p>

          {/* Social icons */}
          <div className="flex gap-2">
            {socials.map(({ Icon, href, label }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:border-royal hover:bg-royal transition-colors"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}