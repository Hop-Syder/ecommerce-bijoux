import { notFound } from "next/navigation";
import { CatalogView } from "@/components/public/CatalogView";
import { getCategoryBySlug } from "@/lib/catalog";
import { ApiError } from "@/lib/apiClient";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const category = await getCategoryBySlug(slug).catch((err) => {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  });

  if (!category) notFound();

  return (
    <CatalogView
      searchParams={resolvedSearchParams}
      basePath={`/categorie/${slug}`}
      lockedCategorySlug={slug}
      title={category.name}
    />
  );
}
