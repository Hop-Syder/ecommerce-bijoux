import type { CategorySummary, Material, ProductListFilters } from "@/types/catalog";

const MATERIAL_OPTIONS: { value: Material; label: string }[] = [
  { value: "OR_18K", label: "Or 18K" },
  { value: "OR_24K", label: "Or 24K" },
  { value: "ARGENT_925", label: "Argent 925" },
  { value: "BRONZE", label: "Bronze" },
];

export function FiltersSidebar({
  categories,
  filters,
  lockedCategorySlug,
}: {
  categories: CategorySummary[];
  filters: ProductListFilters;
  lockedCategorySlug?: string;
}) {
  return (
    <form method="get" className="space-y-6 rounded-sm border border-noir/10 bg-white p-5">
      {lockedCategorySlug && <input type="hidden" name="category" value={lockedCategorySlug} />}

      {!lockedCategorySlug && (
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-anthracite/70">
            Catégorie
          </label>
          <select
            name="category"
            defaultValue={filters.category ?? ""}
            className="mt-2 w-full rounded-sm border border-noir/15 px-3 py-2 text-sm"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-anthracite/70">
          Matière
        </label>
        <select
          name="material"
          defaultValue={filters.material ?? ""}
          className="mt-2 w-full rounded-sm border border-noir/15 px-3 py-2 text-sm"
        >
          <option value="">Toutes</option>
          {MATERIAL_OPTIONS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-anthracite/70">
          Prix (FCFA)
        </label>
        <div className="mt-2 flex gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            defaultValue={filters.minPrice ?? ""}
            className="w-full rounded-sm border border-noir/15 px-3 py-2 text-sm"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            defaultValue={filters.maxPrice ?? ""}
            className="w-full rounded-sm border border-noir/15 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-anthracite/70">
          Disponibilité
        </label>
        <select
          name="inStock"
          defaultValue={filters.inStock === undefined ? "" : String(filters.inStock)}
          className="mt-2 w-full rounded-sm border border-noir/15 px-3 py-2 text-sm"
        >
          <option value="">Toutes</option>
          <option value="true">En stock</option>
          <option value="false">Sur commande</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-anthracite/70">
          Trier par
        </label>
        <select
          name="sort"
          defaultValue={filters.sort ?? "newest"}
          className="mt-2 w-full rounded-sm border border-noir/15 px-3 py-2 text-sm"
        >
          <option value="newest">Nouveautés</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full rounded-sm bg-noir py-2 text-sm font-medium text-ivoire hover:bg-anthracite"
      >
        Filtrer
      </button>
    </form>
  );
}
