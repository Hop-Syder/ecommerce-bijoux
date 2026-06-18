import { Hero } from "@/components/public/Hero";
import { TrustBanner } from "@/components/public/TrustBanner";
import { AtelierSection } from "@/components/public/AtelierSection";
import { Testimonials } from "@/components/public/Testimonials";
import { CategoryIconGrid } from "@/components/public/CategoryIconGrid";
import { ProductCard } from "@/components/public/ProductCard";
import { getCategories, getFeaturedProducts } from "@/lib/catalog";

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <>
      <Hero />
      <TrustBanner />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center font-display text-3xl text-noir">Nos Catégories</h2>
        <div className="mt-8">
          <CategoryIconGrid categories={categories} />
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-center font-display text-3xl text-noir">Produits Phares</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <AtelierSection />
      <Testimonials />
    </>
  );
}
