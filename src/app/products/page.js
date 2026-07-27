import ProductGrid from "@/components/products/ProductGrid";
import CategoryPills from "@/components/products/CategoryPills";
import SortDropdown from "@/components/products/SortDropdown";
import Pagination from "@/components/products/Pagination";
import { sortProducts } from "@/utils/sortProducts";
import {
  getAllProducts,
  getProductsByCategory,
  getCategories,
  searchProducts,
  countAllProducts,
  countProductsByCategory,
  countSearchProducts,
} from "@/lib/queries";

export const metadata = { title: "All Products — HV KART" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;
const FETCH_BOUND = 500;

// These sorts already match the DB's default `createdAt desc` ordering, so
// the requested page can be fetched directly from Postgres (skip/take) rather
// than pulling the whole catalog into memory just to slice 24 rows out of it.
// "price"/"rating" sorts need the full matching set to order correctly (the
// effective price prefers salePrice over price), so those keep the bounded
// fetch + in-memory sort.
const DB_SORTABLE = new Set([undefined, "relevance", "newest"]);

export default async function ProductsPage({ searchParams }) {
  const activeCat = searchParams?.category;
  const q = searchParams?.q?.trim();
  const sort = searchParams?.sort;
  const page = Math.max(1, parseInt(searchParams?.page, 10) || 1);

  let list, total, totalPages, safePage, categories;

  if (DB_SORTABLE.has(sort)) {
    [total, categories] = await Promise.all([
      q
        ? countSearchProducts(q)
        : activeCat
          ? countProductsByCategory(activeCat)
          : countAllProducts(),
      getCategories(),
    ]);
    totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    safePage = Math.min(page, totalPages);
    list = await (q
      ? searchProducts(q, { page: safePage, limit: PAGE_SIZE })
      : activeCat
        ? getProductsByCategory(activeCat, { page: safePage, limit: PAGE_SIZE })
        : getAllProducts({ page: safePage, limit: PAGE_SIZE }));
  } else {
    const [rawList, cats] = await Promise.all([
      q
        ? searchProducts(q, { limit: FETCH_BOUND })
        : activeCat
          ? getProductsByCategory(activeCat, { limit: FETCH_BOUND })
          : getAllProducts({ limit: FETCH_BOUND }),
      getCategories(),
    ]);
    categories = cats;
    const sorted = sortProducts(rawList, sort);
    total = sorted.length;
    totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
    safePage = Math.min(page, totalPages);
    list = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-brand-bg to-brand-silver">
      <div className="liquid-blob left-1/3 top-[-200px] h-96 w-96 bg-brand-blue/10" />
      <div className="container-page relative py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-brand-text">
              {q ? `Results for "${q}"` : "All Products"}
            </h1>
            <p className="mt-1 text-sm text-brand-muted">{total} products</p>
          </div>
          <SortDropdown current={sort || "relevance"} searchParams={searchParams} basePath="/products" />
        </div>

        <CategoryPills categories={categories} activeCat={activeCat} />

        <ProductGrid products={list} />

        <Pagination page={safePage} totalPages={totalPages} basePath="/products" searchParams={searchParams} />
      </div>
    </div>
  );
}
