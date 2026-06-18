import type { Product } from "@/types/catalog";

const MATERIAL_LABELS: Record<Product["material"], string> = {
  OR_18K: "Or 18K",
  OR_24K: "Or 24K",
  ARGENT_925: "Argent 925",
  BRONZE: "Bronze",
};

export function TechnicalSheet({ product }: { product: Product }) {
  const rows: [string, string | null][] = [
    ["Matière", MATERIAL_LABELS[product.material]],
    ["Poids approximatif", product.weightApproxG ? `${product.weightApproxG} g` : null],
    ["Pierre", product.stone],
    ["Sertissage", product.setting],
    ["Poinçon", product.hallmark],
    ["Délai de fabrication", product.deliveryDelay],
    ["Garantie", product.warranty],
  ];

  return (
    <dl className="divide-y divide-noir/10 border-y border-noir/10">
      {rows
        .filter(([, value]) => value)
        .map(([label, value]) => (
          <div key={label} className="flex justify-between py-2 text-sm">
            <dt className="text-anthracite/60">{label}</dt>
            <dd className="font-medium text-noir">{value}</dd>
          </div>
        ))}
    </dl>
  );
}
