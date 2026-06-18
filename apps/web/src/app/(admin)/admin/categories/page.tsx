import { auth } from "@/auth";
import { adminApiClient } from "@/lib/adminApiClient";
import { CategoryManager } from "@/components/admin/CategoryManager";
import type { AdminCategory } from "@/types/admin";

export default async function AdminCategoriesPage() {
  const session = await auth();
  const categories = await adminApiClient.get<AdminCategory[]>(
    session!.apiToken,
    "/api/admin/categories"
  );

  return (
    <div>
      <h1 className="font-display text-3xl text-noir">Catégories</h1>
      <div className="mt-6">
        <CategoryManager categories={categories} />
      </div>
    </div>
  );
}
