import Link from "next/link";
import { auth } from "@/auth";
import { adminApiClient } from "@/lib/adminApiClient";
import { formatXOF } from "@/lib/format";
import type { AdminOrder } from "@/types/admin";

const STATUS_LABELS: Record<AdminOrder["status"], string> = {
  RECUE: "Reçue",
  EN_FABRICATION: "En fabrication",
  CONTROLE_QUALITE: "Contrôle qualité",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const session = await auth();
  const orders = await adminApiClient.get<AdminOrder[]>(
    session!.apiToken,
    `/api/admin/orders${status ? `?status=${status}` : ""}`
  );

  return (
    <div>
      <h1 className="font-display text-3xl text-noir">Commandes</h1>

      <div className="mt-4 flex gap-2 text-sm">
        <Link href="/admin/commandes" className={!status ? "font-semibold text-or" : "text-anthracite/60"}>
          Toutes
        </Link>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <Link
            key={value}
            href={`/admin/commandes?status=${value}`}
            className={status === value ? "font-semibold text-or" : "text-anthracite/60"}
          >
            {label}
          </Link>
        ))}
      </div>

      <table className="mt-6 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-noir/10 text-left text-anthracite/60">
            <th className="py-2">Réf.</th>
            <th className="py-2">Client</th>
            <th className="py-2">Total catalogue</th>
            <th className="py-2">Statut</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-noir/5">
              <td className="py-2">{order.reference}</td>
              <td className="py-2">{order.customerName}</td>
              <td className="py-2">{formatXOF(order.totalCatalogue)}</td>
              <td className="py-2">{STATUS_LABELS[order.status]}</td>
              <td className="py-2 text-right">
                <Link href={`/admin/commandes/${order.id}`} className="text-or hover:underline">
                  Détail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
