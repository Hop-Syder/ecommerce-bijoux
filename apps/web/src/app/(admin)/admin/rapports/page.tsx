import { auth } from "@/auth";
import { adminApiClient } from "@/lib/adminApiClient";
import { formatXOF } from "@/lib/format";
import type {
  MarginReport,
  MostNegotiatedProduct,
  PriceGapSummary,
  SellerPerformance,
} from "@/types/admin";

export default async function AdminReportsPage() {
  const session = await auth();
  const token = session!.apiToken;

  const [priceGap, margin, sellers, products] = await Promise.all([
    adminApiClient.get<PriceGapSummary>(token, "/api/admin/reports/price-gap"),
    adminApiClient.get<MarginReport>(token, "/api/admin/reports/margin"),
    adminApiClient.get<SellerPerformance[]>(token, "/api/admin/reports/seller-performance"),
    adminApiClient.get<MostNegotiatedProduct[]>(token, "/api/admin/reports/most-negotiated-products"),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl text-noir">Rapports</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <ReportCard title="Écart moyen catalogue / réel">
          <p className="font-display text-2xl text-noir">{formatXOF(priceGap.averageEcart)}</p>
          <p className="text-sm text-anthracite/60">
            {priceGap.averageEcartPercent.toFixed(1)} % du prix catalogue · {priceGap.negotiationsCount} négociation(s)
          </p>
        </ReportCard>

        <ReportCard title="Marge théorique vs réelle">
          <p className="font-display text-2xl text-noir">{formatXOF(margin.marginLost)}</p>
          <p className="text-sm text-anthracite/60">
            perdue sur {margin.ordersCount} commande(s) — catalogue {formatXOF(margin.theoreticalTotal)} vs réel{" "}
            {formatXOF(margin.realTotal)}
          </p>
        </ReportCard>
      </div>

      <section className="mt-8">
        <h2 className="font-display text-xl text-noir">Performance par vendeur</h2>
        <table className="mt-3 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-noir/10 text-left text-anthracite/60">
              <th className="py-2">Vendeur</th>
              <th className="py-2">Négociations</th>
              <th className="py-2">Écart moyen</th>
              <th className="py-2">Validations manager requises</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((s) => (
              <tr key={s.sellerId} className="border-b border-noir/5">
                <td className="py-2">{s.sellerName}</td>
                <td className="py-2">{s.negotiationsCount}</td>
                <td className="py-2">{formatXOF(s.averageEcart)}</td>
                <td className="py-2">{s.requiresApprovalCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl text-noir">Produits les plus négociés</h2>
        <table className="mt-3 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-noir/10 text-left text-anthracite/60">
              <th className="py-2">Produit</th>
              <th className="py-2">Négociations</th>
              <th className="py-2">Écart moyen</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.productId} className="border-b border-noir/5">
                <td className="py-2">{p.productName}</td>
                <td className="py-2">{p.negotiationsCount}</td>
                <td className="py-2">{formatXOF(p.averageEcart)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function ReportCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-noir/10 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-anthracite/70">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
