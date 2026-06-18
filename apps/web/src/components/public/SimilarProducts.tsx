import type { Product } from "@/types/catalog";
import { ProductCard } from "@/components/public/ProductCard";

export function SimilarProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl text-noir">Produits similaires</h2>
      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
