import { FiltersSidebar } from "@/components/public/FiltersSidebar";
import { Pagination } from "@/components/public/Pagination";
import { ProductCard } from "@/components/public/ProductCard";
import { getCategories, getProducts } from "@/lib/catalog";
import type { Material } from "@/types/catalog";

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function CatalogView({
  searchParams,
  basePath,
  lockedCategorySlug,
  title,
}: {
  searchParams: RawSearchParams;
  basePath: string;
  lockedCategorySlug?: string;
  title: string;
}) {
  const categories = await getCategories();

  const filters = {
    category: lockedCategorySlug ?? first(searchParams.category),
    material: first(searchParams.material) as Material | undefined,
    minPrice: first(searchParams.minPrice) ? Number(first(searchParams.minPrice)) : undefined,
    maxPrice: first(searchParams.maxPrice) ? Number(first(searchParams.maxPrice)) : undefined,
    inStock:
      first(searchParams.inStock) === undefined ? undefined : first(searchParams.inStock) === "true",
    sort: (first(searchParams.sort) as "price_asc" | "price_desc" | "newest" | undefined) ??
      "newest",
    page: first(searchParams.page) ? Number(first(searchParams.page)) : 1,
  };

  const { items, pagination } = await getProducts(filters);

  const flatSearchParams: Record<string, string | undefined> = {
    category: filters.category,
    material: filters.material,
    minPrice: filters.minPrice?.toString(),
    maxPrice: filters.maxPrice?.toString(),
    inStock: filters.inStock === undefined ? undefined : String(filters.inStock),
    sort: filters.sort,
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl text-noir">{title}</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-[260px_1fr]">
        <aside>
          <FiltersSidebar
            categories={categories}
            filters={filters}
            lockedCategorySlug={lockedCategorySlug}
          />
        </aside>
        <div>
          {items.length === 0 ? (
            <p className="text-anthracite/70">Aucun produit ne correspond à ces filtres.</p>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            basePath={basePath}
            searchParams={flatSearchParams}
          />
        </div>
      </div>
    </div>
  );
}
