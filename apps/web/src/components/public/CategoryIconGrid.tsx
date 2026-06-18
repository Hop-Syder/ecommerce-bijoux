import Link from "next/link";
import type { CategorySummary } from "@/types/catalog";

export function CategoryIconGrid({ categories }: { categories: CategorySummary[] }) {
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-7">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categorie/${category.slug}`}
          className="flex flex-col items-center gap-2 rounded-sm p-3 text-center transition-colors hover:bg-or/10"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-or text-or">
            <CategoryGlyph name={category.name} />
          </span>
          <span className="text-xs font-medium text-anthracite">{category.name}</span>
        </Link>
      ))}
    </div>
  );
}

function CategoryGlyph({ name }: { name: string }) {
  return <span className="font-display text-lg">{name.charAt(0)}</span>;
}
