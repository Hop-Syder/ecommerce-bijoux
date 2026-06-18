import type { Product, ProductImage, Category } from "@prisma/client";

type ProductWithRelations = Product & {
  images?: ProductImage[];
  category?: Category;
};

/**
 * Whitelist explicite des champs publics : prixMin ne doit JAMAIS apparaître ici.
 * Toute route publique doit passer par cette fonction plutôt que renvoyer le modèle brut.
 */
export function serializePublicProduct(product: ProductWithRelations) {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    slug: product.slug,
    description: product.description,
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
        }
      : undefined,
    prixCatalogue: product.prixMax,
    material: product.material,
    weightApproxG: product.weightApproxG,
    stone: product.stone,
    setting: product.setting,
    hallmark: product.hallmark,
    sizeOptions: product.sizeOptions,
    colorOptions: product.colorOptions,
    engravingAvailable: product.engravingAvailable,
    deliveryDelay: product.deliveryDelay,
    warranty: product.warranty,
    inStock: product.stock > 0,
    status: product.status,
    badges: product.badges,
    isFeatured: product.isFeatured,
    images: (product.images ?? [])
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => ({ url: img.url, alt: img.alt, isPrimary: img.isPrimary })),
  };
}

export function serializePublicProductList(products: ProductWithRelations[]) {
  return products.map(serializePublicProduct);
}
