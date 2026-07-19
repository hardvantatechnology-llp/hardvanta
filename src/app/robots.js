// Next.js App Router convention — generates /robots.txt at build/request time.
export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/api",
        "/account",
        "/checkout",
        "/orders",
        "/cart",
        "/wishlist",
        "/compare",
        "/login",
        "/register",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
