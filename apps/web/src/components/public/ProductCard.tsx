import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/catalog";
import { Badge } from "@/components/ui/Badge";
import { PriceTag } from "@/components/ui/PriceTag";

const MATERIAL_LABELS: Record<Product["material"], string> = {
  OR_18K: "Or 18K",
  OR_24K: "Or 24K",
  ARGENT_925: "Argent 925",
  BRONZE: "Bronze",
};

export function ProductCard({ product }: { product: Product }) {
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];

  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group block overflow-hidden rounded-sm border border-noir/10 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-ivoire">
        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt ?? product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
        )}
        {product.badges.length > 0 && (
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.badges.map((badge) => (
              <Badge key={badge}>{badge}</Badge>
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        {product.category && (
          <p className="text-xs uppercase tracking-wide text-anthracite/60">
            {product.category.name}
          </p>
        )}
        <h3 className="font-display text-lg leading-tight text-noir">{product.name}</h3>
        <p className="mt-1 text-xs text-anthracite/60">
          {MATERIAL_LABELS[product.material]}
          {product.weightApproxG ? ` · ~${product.weightApproxG} g` : ""}
        </p>
        <div className="mt-2">
          <PriceTag amount={product.prixCatalogue} size="sm" />
        </div>
      </div>
    </Link>
  );
}
