import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  ChevronRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  BadgeCheck,
  Headphones,
} from "lucide-react";
import { getProductById, getRelatedProducts } from "@/lib/queries";
import { formatPrice } from "@/utils/formatPrice";
import ProductGallery from "@/components/products/ProductGallery";
import ProductGrid from "@/components/products/ProductGrid";
import AddToCart from "@/components/products/AddToCart";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const product = await getProductById(params.id);
  return { title: product ? `${product.name} — hardvanta` : "Product — hardvanta" };
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

  return (
    <div className="container-page py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-silver-dark">
        <Link href="/" className="hover:text-royal">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-royal">Products</Link>
        <ChevronRight size={14} />
        <Link
          href={`/products?category=${product.category?.slug}`}
          className="capitalize hover:text-royal"
        >
          {product.category?.name}
        </Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image gallery */}
        <ProductGallery images={galleryImages} alt={product.name} discountPct={discountPct} />

        {/* Buy box */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-royal">
            {product.brand?.name}
          </span>
          <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1 rounded bg-green-50 px-2 py-0.5 font-semibold text-green-700">
              <Star size={14} className="fill-green-600 text-green-600" />
              {product.rating}
            </span>
            <span className="text-silver-dark">{product.reviewCount} ratings</span>
          </div>

          {/* Price */}
          <div className="mt-5 rounded-2xl border border-silver-light bg-cloud p-5">
            <div className="flex flex-wrap items-end gap-3">
              <span className="text-3xl font-extrabold text-navy">
                {formatPrice(price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="mb-1 text-lg text-silver-dark line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="mb-1 text-sm font-bold text-green-600">
                    Save {formatPrice(savings)}
                  </span>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-silver-dark">Inclusive of all taxes</p>

            {/* ✅ FIXED: inStock field se check */}
            <p className="mt-3 text-sm font-medium">
              {product.inStock !== false ? (
                <span className="text-green-600">● In stock — ready to ship</span>
              ) : (
                <span className="text-red-500">● Out of stock</span>
              )}
            </p>

            <div className="mt-4">
              <AddToCart product={product} />
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              [Truck, "Fast delivery"],
              [BadgeCheck, "Genuine"],
              
              [Headphones, "Support"],
            ].map(([Icon, label], i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-silver-light bg-white p-3 text-center text-xs font-medium text-navy"
              >
                <Icon size={20} className="text-royal" />
                {label}
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="mb-2 text-lg font-bold text-navy">About this product</h2>
            <p className="leading-relaxed text-ink/75">{product.description}</p>
          </div>

          {/* Specifications */}
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-bold text-navy">Specifications</h2>
            <dl className="overflow-hidden rounded-xl border border-silver-light">
              {specs.map(([k, v], i) => (
                <div
                  key={k}
                  className={`grid grid-cols-3 text-sm ${i % 2 ? "bg-white" : "bg-cloud"}`}
                >
                  <dt className="px-4 py-3 font-medium text-silver-dark">{k}</dt>
                  <dd className="col-span-2 px-4 py-3 capitalize text-navy">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="heading-accent mb-8">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}