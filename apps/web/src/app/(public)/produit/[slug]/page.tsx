import { notFound } from "next/navigation";
import { ImageGallery } from "@/components/public/ImageGallery";
import { TechnicalSheet } from "@/components/public/TechnicalSheet";
import { AddToCartForm } from "@/components/public/AddToCartForm";
import { SimilarProducts } from "@/components/public/SimilarProducts";
import { PriceTag } from "@/components/ui/PriceTag";
import { Badge } from "@/components/ui/Badge";
import { getProductBySlug, getSimilarProducts } from "@/lib/catalog";
import { ApiError } from "@/lib/apiClient";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug).catch((err) => {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  });

  if (!product) notFound();

  const similarProducts = await getSimilarProducts(slug);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-10 md:grid-cols-2">
        <ImageGallery images={product.images} productName={product.name} />

        <div>
          {product.category && (
            <p className="text-xs uppercase tracking-wide text-anthracite/60">
              {product.category.name}
            </p>
          )}
          <h1 className="font-display text-3xl text-noir">{product.name}</h1>

          <div className="mt-2 flex gap-2">
            {product.badges.map((badge) => (
              <Badge key={badge}>{badge}</Badge>
            ))}
          </div>

          <div className="mt-4">
            <PriceTag amount={product.prixCatalogue} size="lg" />
          </div>

          <p className="mt-2 text-sm">
            {product.inStock ? (
              <span className="text-whatsapp">En stock</span>
            ) : (
              <span className="text-anthracite/60">Sur commande</span>
            )}
          </p>

          {product.description && (
            <p className="mt-4 text-anthracite/80">{product.description}</p>
          )}

          <div className="mt-6">
            <AddToCartForm product={product} />
          </div>

          <div className="mt-8">
            <TechnicalSheet product={product} />
          </div>
        </div>
      </div>

      <SimilarProducts products={similarProducts} />
    </div>
  );
}
