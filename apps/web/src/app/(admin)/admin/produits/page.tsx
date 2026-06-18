import Link from "next/link";
import { auth } from "@/auth";
import { adminApiClient } from "@/lib/adminApiClient";
import { formatXOF } from "@/lib/format";
import type { AdminProduct } from "@/types/admin";

export default async function AdminProductsPage() {
  const session = await auth();
  const products = await adminApiClient.get<AdminProduct[]>(session!.apiToken, "/api/admin/products");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-noir">Produits</h1>
        <Link
          href="/admin/produits/nouveau"
          className="rounded-sm bg-noir px-4 py-2 text-sm text-ivoire hover:bg-anthracite"
        >
          + Nouveau produit
        </Link>
      </div>

      <table className="mt-6 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-noir/10 text-left text-anthracite/60">
            <th className="py-2">SKU</th>
            <th className="py-2">Nom</th>
            <th className="py-2">Catégorie</th>
            <th className="py-2">Prix catalogue</th>
            <th className="py-2">Prix plancher</th>
            <th className="py-2">Statut</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-noir/5">
              <td className="py-2">{product.sku}</td>
              <td className="py-2">{product.name}</td>
              <td className="py-2">{product.category?.name}</td>
              <td className="py-2">{formatXOF(product.prixMax)}</td>
              <td className="py-2 text-anthracite/60">{formatXOF(product.prixMin)}</td>
              <td className="py-2">{product.status}</td>
              <td className="py-2 text-right">
                <Link href={`/admin/produits/${product.id}`} className="text-or hover:underline">
                  Modifier
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
