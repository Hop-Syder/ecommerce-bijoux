"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartLine } from "@/store/cartStore";
import { useCartStore } from "@/store/cartStore";
import { formatXOF } from "@/lib/format";

export function CartLineRow({ line }: { line: CartLine }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeLine = useCartStore((state) => state.removeLine);
  const subtotal = Number(line.prixCatalogue) * line.quantity;

  return (
    <div className="flex gap-4 border-b border-noir/10 py-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-ivoire">
        {line.imageUrl && (
          <Image src={line.imageUrl} alt={line.name} fill className="object-cover" sizes="80px" />
        )}
      </div>
      <div className="flex-1">
        <Link href={`/produit/${line.slug}`} className="font-medium text-noir hover:text-or">
          {line.name}
        </Link>
        <p className="text-xs text-anthracite/60">
          {[line.variantSize, line.variantColor].filter(Boolean).join(" · ")}
          {line.engravingText ? ` · Gravure : "${line.engravingText}"` : ""}
        </p>
        <p className="mt-1 text-sm text-anthracite/80">{formatXOF(line.prixCatalogue)} / unité</p>
        <div className="mt-2 flex items-center gap-3">
          <input
            type="number"
            min={1}
            value={line.quantity}
            onChange={(e) => updateQuantity(line.lineId, Number(e.target.value))}
            className="w-16 rounded-sm border border-noir/15 px-2 py-1 text-sm"
          />
          <button
            type="button"
            onClick={() => removeLine(line.lineId)}
            className="text-xs text-anthracite/60 underline hover:text-noir"
          >
            Supprimer
          </button>
        </div>
      </div>
      <div className="text-right font-display text-lg text-noir">{formatXOF(subtotal)}</div>
    </div>
  );
}
