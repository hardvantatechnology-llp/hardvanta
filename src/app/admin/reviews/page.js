import { Star } from "lucide-react";
import Pagination, { parsePage } from "@/components/admin/Pagination";
import DeleteReviewButton from "@/components/admin/DeleteReviewButton";
import { deleteReview } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reviews — Admin" };

const PAGE_SIZE = 20;

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "fill-amber-400 text-amber-400" : "text-silver-light"}
        />
      ))}
    </div>
  );
}

export default async function ReviewsPage({ searchParams }) {
  const { prisma } = await import("@/lib/prisma");

  const page = parsePage(searchParams);
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { id: true, name: true } },
        user: { select: { name: true, email: true } },
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.review.count(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Reviews</h1>
        <p className="text-sm text-silver-dark mt-0.5">{total} total reviews</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-silver-light bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-silver-light bg-cloud text-left text-xs font-bold uppercase tracking-wider text-silver-dark">
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Rating</th>
              <th className="px-5 py-3">Comment</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-silver-light">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-silver-dark">
                  <Star size={32} className="mx-auto mb-2 text-silver" />
                  No reviews found
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="hover:bg-cloud transition-colors">
                  <td className="px-5 py-3 font-semibold text-navy">
                    {review.product?.name || "—"}
                  </td>
                  <td className="px-5 py-3 text-silver-dark">
                    {review.user?.name || review.user?.email || "—"}
                  </td>
                  <td className="px-5 py-3">
                    <StarRating rating={review.rating} />
                  </td>
                  <td className="px-5 py-3 max-w-xs text-silver-dark">
                    <p className="line-clamp-2">{review.comment || "—"}</p>
                  </td>
                  <td className="px-5 py-3 text-silver-dark">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end">
                      <DeleteReviewButton id={review.id} onDelete={deleteReview} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} basePath="/admin/reviews" />
    </div>
  );
}
