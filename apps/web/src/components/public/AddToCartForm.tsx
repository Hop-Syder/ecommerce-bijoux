"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/types/catalog";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";

export function AddToCartForm({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [variantSize, setVariantSize] = useState(product.sizeOptions[0] ?? "");
  const [variantColor, setVariantColor] = useState(product.colorOptions[0] ?? "");
  const [engravingText, setEngravingText] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addItem({
      product,
      quantity,
      variantSize: variantSize || undefined,
      variantColor: variantColor || undefined,
      engravingText: engravingText.trim() || undefined,
    });
    setAdded(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {product.sizeOptions.length > 0 && (
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-anthracite/70">
            Taille
          </label>
          <select
            value={variantSize}
            onChange={(e) => setVariantSize(e.target.value)}
            className="mt-2 w-full rounded-sm border border-noir/15 px-3 py-2 text-sm"
          >
            {product.sizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      {product.colorOptions.length > 0 && (
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-anthracite/70">
            Couleur
          </label>
          <select
            value={variantColor}
            onChange={(e) => setVariantColor(e.target.value)}
            className="mt-2 w-full rounded-sm border border-noir/15 px-3 py-2 text-sm"
          >
            {product.colorOptions.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>
      )}

      {product.engravingAvailable && (
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-anthracite/70">
            Texte de gravure (optionnel)
          </label>
          <input
            type="text"
            maxLength={30}
            value={engravingText}
            onChange={(e) => setEngravingText(e.target.value)}
            placeholder="Ex: Pour toujours"
            className="mt-2 w-full rounded-sm border border-noir/15 px-3 py-2 text-sm"
          />
        </div>
      )}

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-anthracite/70">
          Quantité
        </label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          className="mt-2 w-24 rounded-sm border border-noir/15 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="primary">
          Ajouter au panier
        </Button>
        {added && (
          <Button type="button" variant="secondary" onClick={() => router.push("/panier")}>
            Voir le panier
          </Button>
        )}
      </div>
    </form>
  );
}
