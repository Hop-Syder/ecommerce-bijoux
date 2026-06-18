"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { CartLineRow } from "@/components/public/CartLineRow";
import { Button } from "@/components/ui/Button";
import { formatXOF } from "@/lib/format";
import { useHasMounted } from "@/hooks/useHasMounted";

export default function CartPage() {
  const mounted = useHasMounted();
  const lines = useCartStore((state) => state.lines);

  const subtotal = lines.reduce(
    (sum, line) => sum + Number(line.prixCatalogue) * line.quantity,
    0
  );

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl text-noir">Panier</h1>

      {lines.length === 0 ? (
        <div className="mt-8">
          <p className="text-anthracite/70">Votre panier est vide.</p>
          <Link href="/catalogue" className="mt-4 inline-block">
            <Button variant="secondary">Découvrir le catalogue</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8">
            {lines.map((line) => (
              <CartLineRow key={line.lineId} line={line} />
            ))}
          </div>

          <div className="mt-6 space-y-2 rounded-sm border border-noir/10 bg-white p-5">
            <div className="flex justify-between text-sm">
              <span className="text-anthracite/70">Sous-total</span>
              <span className="font-medium text-noir">{formatXOF(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-anthracite/70">Frais de livraison</span>
              <span className="text-anthracite/70">À confirmer</span>
            </div>
            <div className="flex justify-between border-t border-noir/10 pt-2 text-base">
              <span className="font-semibold text-noir">Total estimé</span>
              <span className="font-display text-xl text-noir">{formatXOF(subtotal)}</span>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Link href="/commande">
              <Button variant="primary">Passer la commande</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
