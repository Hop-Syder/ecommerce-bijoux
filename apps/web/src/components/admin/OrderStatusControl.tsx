"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { adminApiClient, ApiError } from "@/lib/adminApiClient";

const STATUSES = ["RECUE", "EN_FABRICATION", "CONTROLE_QUALITE", "LIVREE", "ANNULEE"] as const;

const STATUS_LABELS: Record<(typeof STATUSES)[number], string> = {
  RECUE: "Reçue",
  EN_FABRICATION: "En fabrication / gravure",
  CONTROLE_QUALITE: "Contrôle qualité",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
};

export function OrderStatusControl({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: (typeof STATUSES)[number];
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(status: (typeof STATUSES)[number]) {
    if (!session?.apiToken) return;
    setUpdating(true);
    setError(null);
    try {
      await adminApiClient.patch(session.apiToken, `/api/admin/orders/${orderId}/status`, { status });
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur lors de la mise à jour");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div>
      <select
        className="input"
        value={currentStatus}
        disabled={updating}
        onChange={(e) => handleChange(e.target.value as (typeof STATUSES)[number])}
      >
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
