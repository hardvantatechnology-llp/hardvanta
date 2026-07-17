import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Simple prev/next + page-count pagination for admin list pages.
 * Server-renderable (no client hooks) — just builds `?page=n` links.
 */
export default function Pagination({ page, totalPages, basePath }) {
  if (totalPages <= 1) return null;

  const prevHref = `${basePath}?page=${Math.max(1, page - 1)}`;
  const nextHref = `${basePath}?page=${Math.min(totalPages, page + 1)}`;

  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <p className="text-silver-dark">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Link
          href={prevHref}
          aria-disabled={page <= 1}
          className={`flex items-center gap-1 rounded-lg border border-silver-light px-3 py-1.5 font-medium ${
            page <= 1
              ? "pointer-events-none text-silver"
              : "text-navy hover:border-royal hover:text-royal"
          }`}
        >
          <ChevronLeft size={14} /> Prev
        </Link>
        <Link
          href={nextHref}
          aria-disabled={page >= totalPages}
          className={`flex items-center gap-1 rounded-lg border border-silver-light px-3 py-1.5 font-medium ${
            page >= totalPages
              ? "pointer-events-none text-silver"
              : "text-navy hover:border-royal hover:text-royal"
          }`}
        >
          Next <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}

/** Parse a `?page=` searchParam into a safe positive integer. */
export function parsePage(searchParams) {
  const n = parseInt(searchParams?.page, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
