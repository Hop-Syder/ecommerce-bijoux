import { auth } from "@/auth";
import { adminApiClient } from "@/lib/adminApiClient";
import { ProductForm } from "@/components/admin/ProductForm";
import type { AdminCategory } from "@/types/admin";

export default async function NewProductPage() {
  const session = await auth();
  const categories = await adminApiClient.get<AdminCategory[]>(
    session!.apiToken,
    "/api/admin/categories"
  );

  return (
    <div>
      <h1 className="font-display text-3xl text-noir">Nouveau produit</h1>
      <div className="mt-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
