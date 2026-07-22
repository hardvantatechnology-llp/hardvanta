import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  ChevronRight,
  Truck,
  ShieldCheck,
  BadgeCheck,
  Headphones,
} from "lucide-react";
import { getProductById, getRelatedProducts } from "@/lib/queries";
import { formatPrice } from "@/utils/formatPrice";
import { imageSrc } from "@/utils/imageSrc";
import ProductGallery from "@/components/products/ProductGallery";
import ProductGrid from "@/components/products/ProductGrid";
import AddToCart from "@/components/products/AddToCart";
import WishlistToggleButton from "@/components/products/WishlistToggleButton";
import ShareButton from "@/components/products/ShareButton";
import RecentlyViewed from "@/components/products/RecentlyViewed";
import DeliveryInfoCard from "@/components/delivery/DeliveryInfoCard";

// Product data is now served through unstable_cache (see src/lib/queries.js),
// so the page itself can be revalidated on an interval instead of forcing a
// full SSR render (and a DB round trip) on every single request.
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const product = await getProductById(params.id);
  if (!product) return { title: "Product — hardvanta" };

  const title = `${product.name} — hardvanta`;
  const description = product.shortDescription || product.description?.slice(0, 160) || undefined;
  const image = imageSrc(product.image);

  return {
    title,
    description,
    openGraph: { title, description, images: [image], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function ProductDetailPage({ params }) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category.slug, product.id, 4);

  const price = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice != null && product.price > 0;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
  const savings = hasDiscount ? product.price - product.salePrice : 0;
  // Build the gallery: main image first, then the extra ProductImage rows (deduped).
  const galleryImages = [
    ...new Set(
      [product.image, ...(product.images || []).map((i) => i.imageUrl)].filter(Boolean)
    ),
  ];

  const specs = [
    ["Brand", product.brand?.name],
    ["Category", product.category?.name],
    ["SKU", product.id.slice(-8).toUpperCase()],
    // ✅ FIXED: inStock field se check
    ["Availability", product.inStock !== false ? "In stock" : "Out of stock"],
  ];

  const trustBadges = [
    [Truck, "Fast delivery"],
    [ShieldCheck, "100% Genuine"],
    [BadgeCheck, "Quality Checked"],
    [Headphones, "Expert Support"],
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-brand-bg to-brand-silver">
      <div className="liquid-blob left-1/4 top-[-15%] h-96 w-96 bg-brand-blue/10" />
      <div className="container-page relative py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-blue">Home</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-brand-blue">Products</Link>
          <ChevronRight size={14} />
          <Link
            href={`/products?category=${product.category?.slug}`}
            className="capitalize hover:text-brand-blue"
          >
            {product.category?.name}
          </Link>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image gallery */}
          <ProductGallery images={galleryImages} alt={product.name} discountPct={discountPct} />

          {/* Buy box */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-blue">
                  {product.brand?.name}
                </span>
                <h1 className="mt-1 text-2xl font-bold text-brand-text sm:text-3xl">
                  {product.name}
                </h1>
              </div>
              <div className="flex shrink-0 gap-2">
                <WishlistToggleButton productId={product.id} />
                <ShareButton title={product.name} />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 rounded bg-gradient-to-r from-brand-blue to-brand-navy px-2 py-0.5 font-semibold text-white">
                <Star size={14} className="fill-white text-white" />
                {product.rating}
              </span>
              <span className="text-brand-muted">{product.reviewCount} ratings</span>
            </div>

            {/* Price */}
            <div className="glass-brand-card mt-5 rounded-3xl p-5">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-3xl font-extrabold text-brand-text">
                  {formatPrice(price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="mb-1 text-lg text-brand-muted line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="mb-1 text-sm font-bold text-brand-blue">
                      Save {formatPrice(savings)}
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-brand-muted">Inclusive of all taxes</p>

              {/* ✅ FIXED: inStock field se check */}
              <p className="mt-3 text-sm font-medium">
                {product.inStock !== false ? (
                  <span className="text-brand-blue">● In stock — ready to ship</span>
                ) : (
                  <span className="text-red-600">● Out of stock</span>
                )}
              </p>

              <div className="mt-4">
                <AddToCart product={product} />
              </div>
            </div>

            {/* Delivery information */}
            <DeliveryInfoCard />

            {/* Trust badges */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {trustBadges.map(([Icon, label], i) => (
                <div
                  key={i}
                  className="glass-brand-card flex flex-col items-center gap-1.5 rounded-xl p-3 text-center text-xs font-medium text-brand-text"
                >
                  <Icon size={20} className="text-brand-blue" />
                  {label}
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="mb-2 text-lg font-bold text-brand-text">About this product</h2>
              <p className="leading-relaxed text-brand-muted">{product.description}</p>
            </div>

            {/* Specifications */}
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-bold text-brand-text">Specifications</h2>
              <dl className="glass-brand-card overflow-hidden rounded-xl">
                {specs.map(([k, v], i) => (
                  <div
                    key={k}
                    className={`grid grid-cols-3 text-sm ${i % 2 ? "bg-brand-silver/60" : ""}`}
                  >
                    <dt className="px-4 py-3 font-medium text-brand-muted">{k}</dt>
                    <dd className="col-span-2 px-4 py-3 capitalize text-brand-text">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="relative mb-8 inline-block text-2xl font-bold text-brand-text after:absolute after:-bottom-2 after:left-0 after:h-1 after:w-12 after:rounded-full after:bg-gradient-to-r after:from-brand-blue after:to-brand-navy">
              You may also like
            </h2>
            <ProductGrid products={related} />
          </section>
        )}

        {/* Recently viewed */}
        <RecentlyViewed excludeId={product.id} />
      </div>
    </div>
  );
}
