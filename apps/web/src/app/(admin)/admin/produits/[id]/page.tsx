import { auth } from "@/auth";
import { adminApiClient } from "@/lib/adminApiClient";
import { ProductForm } from "@/components/admin/ProductForm";
import type { AdminCategory, AdminProduct } from "@/types/admin";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const [categories, product] = await Promise.all([
    adminApiClient.get<AdminCategory[]>(session!.apiToken, "/api/admin/categories"),
    adminApiClient.get<AdminProduct>(session!.apiToken, `/api/admin/products/${id}`),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl text-noir">{product.name}</h1>
      <div className="mt-6">
        <ProductForm categories={categories} product={product} />
      </div>
    </div>
  );
}
