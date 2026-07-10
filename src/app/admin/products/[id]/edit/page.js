import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }) {
  const { prisma } = await import("@/lib/prisma");
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      brand: true,
    },
  });
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
} 