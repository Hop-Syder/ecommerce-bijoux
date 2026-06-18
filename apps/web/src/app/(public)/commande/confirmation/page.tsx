"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppLink, buildWhatsAppMessage, type WhatsAppOrderData } from "@/lib/whatsapp";
import { formatXOF } from "@/lib/format";
import type { OrderConfirmation } from "@/types/order";

type StoredOrder = {
  order: OrderConfirmation;
  customerName: string;
  customerPhone: string;
  deliveryCity: string;
  deliveryAddress: string;
  deliveryNotes?: string;
};

export default function OrderConfirmationPage() {
  const [stored, setStored] = useState<StoredOrder | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // sessionStorage n'existe pas côté serveur : lecture unique post-montage, pas une boucle de rendu.
    const raw = sessionStorage.getItem("sika-last-order");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only storage read
    if (raw) setStored(JSON.parse(raw));
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (!stored) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <p className="text-anthracite/70">Aucune commande récente trouvée.</p>
        <Link href="/catalogue" className="mt-4 inline-block">
          <Button variant="secondary">Retour au catalogue</Button>
        </Link>
      </div>
    );
  }

  const whatsAppData: WhatsAppOrderData = {
    reference: stored.order.reference,
    createdAt: stored.order.createdAt,
    customerName: stored.customerName,
    customerPhone: stored.customerPhone,
    deliveryCity: stored.deliveryCity,
    deliveryAddress: stored.deliveryAddress,
    deliveryNotes: stored.deliveryNotes,
    items: stored.order.items.map((item) => ({
      productName: item.productName,
      variantSize: item.variantSize,
      variantColor: item.variantColor,
      quantity: item.quantity,
      prixCatalogue: item.prixCatalogue,
    })),
    totalCatalogue: stored.order.totalCatalogue,
  };

  const message = buildWhatsAppMessage(whatsAppData);
  const link = buildWhatsAppLink(message);

  return (
    <div className="mx-auto max-w-xl px-6 py-16 text-center">
      <p className="text-whatsapp text-sm font-medium uppercase tracking-wide">
        Commande enregistrée
      </p>
      <h1 className="mt-2 font-display text-3xl text-noir">Réf. {stored.order.reference}</h1>
      <p className="mt-4 text-anthracite/80">
        Total catalogue : <strong>{formatXOF(stored.order.totalCatalogue)}</strong>
        <br />
        Pour finaliser, envoyez le message pré-rempli ci-dessous sur WhatsApp. Notre équipe vous
        recontactera sous 30 minutes pour confirmer disponibilité, livraison et — si besoin —
        négocier le tarif.
      </p>

      <a href={link} target="_blank" rel="noopener noreferrer" className="mt-8 inline-block">
        <Button variant="whatsapp">📲 COMMANDER VIA WHATSAPP</Button>
      </a>

      <pre className="mt-8 whitespace-pre-wrap rounded-sm border border-noir/10 bg-white p-4 text-left text-xs text-anthracite/80">
        {message}
      </pre>
    </div>
  );
}
