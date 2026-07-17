// Presentational sort helper for already-fetched product arrays — no DB/query changes.
export const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating: High to Low" },
];

export function sortProducts(list, sortKey) {
  if (!Array.isArray(list)) return [];
  const arr = [...list];
  const price = (p) => p.salePrice ?? p.price ?? 0;

  switch (sortKey) {
    case "newest":
      return arr.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    case "price-asc":
      return arr.sort((a, b) => price(a) - price(b));
    case "price-desc":
      return arr.sort((a, b) => price(b) - price(a));
    case "rating-desc":
      return arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    default:
      return arr;
  }
}
