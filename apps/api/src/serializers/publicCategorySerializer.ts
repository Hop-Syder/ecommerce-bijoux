import type { Category } from "@prisma/client";

export function serializePublicCategory(category: Category) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    bannerUrl: category.bannerUrl,
    icon: category.icon,
  };
}

export function serializePublicCategoryList(categories: Category[]) {
  return categories.map(serializePublicCategory);
}
