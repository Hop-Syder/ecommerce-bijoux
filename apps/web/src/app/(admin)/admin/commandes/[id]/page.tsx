import { auth } from "@/auth";
import { adminApiClient } from "@/lib/adminApiClient";
import { formatXOF } from "@/lib/format";
import { OrderStatusControl } from "@/components/admin/OrderStatusControl";
import { NegotiationPanel } from "@/components/admin/NegotiationPanel";
import type { AdminOrder } from "@/types/admin";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const order = await adminApiClient.get<AdminOrder>(session!.apiToken, `/api/admin/orders/${id}`);

  return (
    <div>
      <h1 className="font-display text-3xl text-noir">Commande {order.reference}</h1>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <section className="rounded-sm border border-noir/10 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-anthracite/70">
            Client
          </h2>
          <p className="mt-2 text-sm">{order.customerName}</p>
          <p className="text-sm">{order.customerPhone}</p>
          {order.customerEmail && <p className="text-sm">{order.customerEmail}</p>}
        </section>

        <section className="rounded-sm border border-noir/10 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-anthracite/70">
            Livraison
          </h2>
          <p className="mt-2 text-sm">{order.deliveryCity}</p>
          <p className="text-sm">{order.deliveryAddress}</p>
          {order.deliveryNotes && <p className="text-sm text-anthracite/60">{order.deliveryNotes}</p>}
        </section>
      </div>

      <section className="mt-6 rounded-sm border border-noir/10 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-anthracite/70">
          Articles (prix catalogue)
        </h2>
        <ul className="mt-2 divide-y divide-noir/5 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between py-2">
              <span>
                {item.productNameSnap}
                {item.variantSize ? ` (${item.variantSize})` : ""} × {item.quantity}
              </span>
              <span>{formatXOF(item.prixCatalogueSnap)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex justify-between border-t border-noir/10 pt-2 font-semibold">
          <span>Total catalogue</span>
          <span>{formatXOF(order.totalCatalogue)}</span>
        </div>
      </section>

      <section className="mt-6 rounded-sm border border-noir/10 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-anthracite/70">Statut</h2>
        <div className="mt-2">
          <OrderStatusControl orderId={order.id} currentStatus={order.status} />
        </div>
        {order.totalReal && (
          <p className="mt-2 text-sm text-anthracite/70">
            Prix de vente réel : <strong>{formatXOF(order.totalReal)}</strong>
          </p>
        )}
      </section>

      <div className="mt-6">
        <NegotiationPanel orderId={order.id} negotiations={order.negotiations} />
      </div>
    </div>
  );
}
