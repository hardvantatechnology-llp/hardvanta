"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin";

export async function deleteReview(id) {
  const session = await getAdminSession();
  if (!session) throw new Error("Forbidden");
  if (!id) throw new Error("Missing review id.");

  await prisma.review.delete({ where: { id } }).catch(() => {
    throw new Error("Review not found or already deleted.");
  });

  revalidatePath("/admin/reviews");
}
