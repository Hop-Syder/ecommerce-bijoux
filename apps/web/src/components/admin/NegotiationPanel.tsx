"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { adminApiClient, ApiError } from "@/lib/adminApiClient";
import { Button } from "@/components/ui/Button";
import { formatXOF } from "@/lib/format";
import type { AdminNegotiation } from "@/types/admin";

const STATUS_LABELS: Record<AdminNegotiation["status"], string> = {
  AUCUNE: "Aucune négociation",
  AUTO_VALIDEE: "Validée automatiquement",
  EN_ATTENTE: "En attente de validation manager",
  VALIDEE: "Validée par le manager",
  REJETEE: "Rejetée",
};

export function NegotiationPanel({
  orderId,
  negotiations,
}: {
  orderId: string;
  negotiations: AdminNegotiation[];
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user.role === "ADMIN";

  const [prixPropose, setPrixPropose] = useState("");
  const [reason, setReason] = useState("");
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.apiToken || !proofImage) return;
    setSubmitting(true);
    setError(null);
    try {
      await adminApiClient.uploadWithFields(
        session.apiToken,
        `/api/admin/negotiations/orders/${orderId}/negotiate`,
        "proofImage",
        proofImage,
        { prixPropose, ...(reason ? { reason } : {}) }
      );
      setPrixPropose("");
      setReason("");
      setProofImage(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDecision(negotiationId: string, decision: "approve" | "reject") {
    if (!session?.apiToken) return;
    try {
      await adminApiClient.patch(session.apiToken, `/api/admin/negotiations/${negotiationId}/${decision}`, {});
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur lors de la décision");
    }
  }

  return (
    <section className="rounded-sm border border-noir/10 bg-white p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-anthracite/70">
        Négociation
      </h2>

      {negotiations.length > 0 && (
        <ul className="mt-3 space-y-3">
          {negotiations.map((n) => (
            <li key={n.id} className="rounded-sm border border-noir/10 p-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-noir">{formatXOF(n.prixPropose)}</span>
                <span className="text-anthracite/60">{STATUS_LABELS[n.status]}</span>
              </div>
              <p className="mt-1 text-anthracite/60">
                Écart vs catalogue : {formatXOF(n.ecart)} {n.reason ? `· ${n.reason}` : ""}
              </p>
              {n.proofImageUrl && (
                <a
                  href={n.proofImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-or hover:underline"
                >
                  Voir la preuve
                </a>
              )}
              {n.status === "EN_ATTENTE" && isAdmin && (
                <div className="mt-2 flex gap-2">
                  <Button type="button" variant="whatsapp" onClick={() => handleDecision(n.id, "approve")}>
                    Approuver
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => handleDecision(n.id, "reject")}>
                    Rejeter
                  </Button>
                </div>
              )}
              {n.status === "EN_ATTENTE" && !isAdmin && (
                <p className="mt-2 text-xs text-anthracite/50">
                  Validation manager (Admin) requise — prix sous le plancher.
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-3 border-t border-noir/10 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-anthracite/70">
          Enregistrer un prix de vente négocié
        </p>
        <div className="flex flex-wrap gap-3">
          <input
            type="number"
            placeholder="Prix réel convenu (FCFA)"
            value={prixPropose}
            onChange={(e) => setPrixPropose(e.target.value)}
            className="input w-56"
            required
          />
          <input
            type="text"
            placeholder="Motif (optionnel)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="input w-56"
          />
        </div>
        <div>
          <label className="text-xs text-anthracite/60">
            Preuve obligatoire (capture WhatsApp ou reçu)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProofImage(e.target.files?.[0] ?? null)}
            className="mt-1 block text-sm"
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Enregistrement..." : "Enregistrer la négociation"}
        </Button>
      </form>
    </section>
  );
}
