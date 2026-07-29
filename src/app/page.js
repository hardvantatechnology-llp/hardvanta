import Link from "next/link";
import Hero from "@/components/home/Hero";
import CategoryTiles from "@/components/home/CategoryTiles";
import BenefitsStrip from "@/components/home/BenefitsStrip";
import GoogleReviews from "@/components/home/GoogleReviews";
import ProductGrid from "@/components/products/ProductGrid";
import { getFeaturedProducts, getDeals } from "@/lib/queries";

// Home page has no per-user data — safe to serve as ISR instead of forcing a
// fresh SSR render (and DB round trip) on every request.
export const revalidate = 60;

export default async function Home() {
  const [featured, deals] = await Promise.all([
    getFeaturedProducts(),
    getDeals(4),
  ]);

  return (
    <>
      <Hero />
      <BenefitsStrip />
      <CategoryTiles />

      {/* Deals strip */}
      <section className="bg-brand-silver py-12">
        <div className="container-page">
          <div className="mb-8 flex items-center justify-between">
            {/*
              FIX: `heading-accent` renders white text, which was invisible
              on this light `bg-brand-silver` section. Forcing a dark brand
              color here (with `!`) keeps the underline/accent styling from
              `heading-accent` intact while making the text legible.
            */}
            <h2 className="heading-accent !text-brand-navy">🔥 Hot Deals</h2>
            <Link href="/products" className="text-sm font-semibold text-brand-blue hover:text-brand-steel">
              View all
            </Link>
          </div>
          <ProductGrid products={deals} />
        </div>
      </section>

      {/* Featured products */}
      <section className="container-page py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="heading-accent !text-brand-navy">Featured Products</h2>
          <Link href="/products" className="text-sm font-semibold text-brand-blue hover:text-brand-steel">
            Shop all
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      {/* Google reviews */}
      <GoogleReviews />

      {/* Promo banner */}
      <section className="container-page pb-12">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl glass-brand-card p-8 sm:flex-row">
          <div>
            <h3 className="text-xl font-bold text-brand-text">Bulk &amp; Educational Orders</h3>
            <p className="text-sm text-brand-muted">
              Special pricing for schools, colleges and makerspaces.
            </p>
          </div>
          <Link
            href="/products"
            className="rounded-lg bg-gradient-to-r from-brand-blue to-brand-navy px-6 py-3 font-semibold text-white shadow-brand-glow hover:brightness-110 transition-all"
          >
            Get a Quote
          </Link>
        </div>
      </section>
    </>
  );
}