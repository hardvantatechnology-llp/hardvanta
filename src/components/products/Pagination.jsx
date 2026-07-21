import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

function pageHref(basePath, searchParams, page) {
  const params = new URLSearchParams(searchParams);
  if (page <= 1) params.delete("page");
  else params.set("page", String(page));
  const qs = params.toString();
  return `${basePath}${qs ? `?${qs}` : ""}`;
}

export default function Pagination({ page = 1, totalPages = 1, basePath, searchParams = {} }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  const linkClass = (active) =>
    `flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-medium transition-all ${
      active
        ? "bg-gradient-to-r from-electric to-liquid text-white shadow-glow-electric"
        : "glass text-white/70 hover:text-white hover:shadow-glow-electric"
    }`;

  const disabledClass =
    "flex h-9 w-9 items-center justify-center rounded-full glass text-white/20 cursor-not-allowed";

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={pageHref(basePath, searchParams, page - 1)} className={linkClass(false)} aria-label="Previous page">
          <ChevronLeft size={16} />
        </Link>
      ) : (
        <span className={disabledClass} aria-hidden="true"><ChevronLeft size={16} /></span>
      )}

      {start > 1 && (
        <>
          <Link href={pageHref(basePath, searchParams, 1)} className={linkClass(false)}>1</Link>
          {start > 2 && <span className="px-1 text-white/30">…</span>}
        </>
      )}

      {pages.map((p) => (
        <Link key={p} href={pageHref(basePath, searchParams, p)} className={linkClass(p === page)} aria-current={p === page ? "page" : undefined}>
          {p}
        </Link>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-white/30">…</span>}
          <Link href={pageHref(basePath, searchParams, totalPages)} className={linkClass(false)}>
            {totalPages}
          </Link>
        </>
      )}

      {page < totalPages ? (
        <Link href={pageHref(basePath, searchParams, page + 1)} className={linkClass(false)} aria-label="Next page">
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className={disabledClass} aria-hidden="true"><ChevronRight size={16} /></span>
      )}
    </nav>
  );
}
