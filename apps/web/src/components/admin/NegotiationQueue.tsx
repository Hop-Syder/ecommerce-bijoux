"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { adminApiClient, ApiError } from "@/lib/adminApiClient";
import { Button } from "@/components/ui/Button";
import { formatXOF } from "@/lib/format";
import type { AdminNegotiation } from "@/types/admin";

export function NegotiationQueue({ negotiations }: { negotiations: AdminNegotiation[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user.role === "ADMIN";

  async function handleDecision(id: string, decision: "approve" | "reject") {
    if (!session?.apiToken) return;
    try {
      await adminApiClient.patch(session.apiToken, `/api/admin/negotiations/${id}/${decision}`, {});
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    }
  }

  if (negotiations.length === 0) {
    return <p className="mt-6 text-anthracite/70">Aucune négociation en attente de validation.</p>;
  }

  return (
    <table className="mt-6 w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-noir/10 text-left text-anthracite/60">
          <th className="py-2">Commande</th>
          <th className="py-2">Client</th>
          <th className="py-2">Prix catalogue</th>
          <th className="py-2">Prix plancher</th>
          <th className="py-2">Prix proposé</th>
          <th className="py-2">Écart</th>
          <th className="py-2">Preuve</th>
          <th className="py-2"></th>
        </tr>
      </thead>
      <tbody>
        {negotiations.map((n) => (
          <tr key={n.id} className="border-b border-noir/5">
            <td className="py-2">{n.order?.reference}</td>
            <td className="py-2">{n.order?.customerName}</td>
            <td className="py-2">{formatXOF(n.prixCatalogue)}</td>
            <td className="py-2 text-anthracite/60">{formatXOF(n.prixMin)}</td>
            <td className="py-2 font-medium text-noir">{formatXOF(n.prixPropose)}</td>
            <td className="py-2">{formatXOF(n.ecart)}</td>
            <td className="py-2">
              {n.proofImageUrl && (
                <a href={n.proofImageUrl} target="_blank" rel="noopener noreferrer" className="text-or hover:underline">
                  Voir
                </a>
              )}
            </td>
            <td className="py-2 text-right">
              {isAdmin ? (
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="whatsapp" onClick={() => handleDecision(n.id, "approve")}>
                    Approuver
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => handleDecision(n.id, "reject")}>
                    Rejeter
                  </Button>
                </div>
              ) : (
                <span className="text-xs text-anthracite/50">Réservé Admin</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
