"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { Stepper } from "@/components/public/Stepper";
import { Button } from "@/components/ui/Button";
import { formatXOF } from "@/lib/format";
import { createOrder } from "@/lib/orders";
import { ApiError } from "@/lib/apiClient";
import { useHasMounted } from "@/hooks/useHasMounted";

type FormState = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryCity: string;
  deliveryQuartier: string;
  deliveryAddressDetail: string;
  deliveryPreference: string;
  remarks: string;
};

const INITIAL_STATE: FormState = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  deliveryCity: "",
  deliveryQuartier: "",
  deliveryAddressDetail: "",
  deliveryPreference: "",
  remarks: "",
};

export default function OrderFormPage() {
  const router = useRouter();
  const mounted = useHasMounted();
  const lines = useCartStore((state) => state.lines);
  const clearCart = useCartStore((state) => state.clear);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = lines.reduce(
    (sum, line) => sum + Number(line.prixCatalogue) * line.quantity,
    0
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleConfirm() {
    setSubmitting(true);
    setError(null);
    const deliveryAddress = [form.deliveryQuartier, form.deliveryAddressDetail]
      .filter(Boolean)
      .join(" — ");

    try {
      const order = await createOrder({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail || undefined,
        deliveryAddress,
        deliveryCity: form.deliveryCity,
        deliveryNotes: form.deliveryPreference || undefined,
        remarks: form.remarks || undefined,
        items: lines.map((line) => ({
          productId: line.productId,
          quantity: line.quantity,
          variantSize: line.variantSize,
          variantColor: line.variantColor,
          engravingText: line.engravingText,
        })),
      });

      sessionStorage.setItem(
        "sika-last-order",
        JSON.stringify({
          order,
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          deliveryCity: form.deliveryCity,
          deliveryAddress,
          deliveryNotes: form.deliveryPreference || undefined,
        })
      );
      clearCart();
      router.push("/commande/confirmation");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Une erreur est survenue, veuillez réessayer."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) return null;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 text-center">
        <p className="text-anthracite/70">Votre panier est vide.</p>
        <Link href="/catalogue" className="mt-4 inline-block">
          <Button variant="secondary">Découvrir le catalogue</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-center font-display text-3xl text-noir">Finaliser la commande</h1>
      <div className="mt-8">
        <Stepper currentStep={step} />
      </div>

      <div className="mt-8 rounded-sm border border-noir/10 bg-white p-6">
        {step === 1 && (
          <div className="space-y-4">
            <Field label="Nom complet">
              <input
                value={form.customerName}
                onChange={(e) => update("customerName", e.target.value)}
                className="input"
                required
              />
            </Field>
            <Field label="Téléphone">
              <input
                value={form.customerPhone}
                onChange={(e) => update("customerPhone", e.target.value)}
                placeholder="+229 ..."
                className="input"
                required
              />
            </Field>
            <Field label="Email (optionnel)">
              <input
                type="email"
                value={form.customerEmail}
                onChange={(e) => update("customerEmail", e.target.value)}
                className="input"
              />
            </Field>
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => setStep(2)}
                disabled={!form.customerName || !form.customerPhone}
              >
                Continuer
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Field label="Ville">
              <input
                value={form.deliveryCity}
                onChange={(e) => update("deliveryCity", e.target.value)}
                className="input"
                required
              />
            </Field>
            <Field label="Quartier">
              <input
                value={form.deliveryQuartier}
                onChange={(e) => update("deliveryQuartier", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Adresse précise">
              <input
                value={form.deliveryAddressDetail}
                onChange={(e) => update("deliveryAddressDetail", e.target.value)}
                placeholder="Immeuble, repère..."
                className="input"
                required
              />
            </Field>
            <Field label="Préférence de livraison (optionnel)">
              <input
                value={form.deliveryPreference}
                onChange={(e) => update("deliveryPreference", e.target.value)}
                placeholder="Ex: Après-midi"
                className="input"
              />
            </Field>
            <div className="flex justify-between">
              <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                Retour
              </Button>
              <Button
                type="button"
                onClick={() => setStep(3)}
                disabled={!form.deliveryCity || !form.deliveryAddressDetail}
              >
                Continuer
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Field label="Remarques (optionnel)">
              <textarea
                value={form.remarks}
                onChange={(e) => update("remarks", e.target.value)}
                className="input"
                rows={3}
              />
            </Field>

            <div className="rounded-sm bg-ivoire p-4 text-sm">
              <p className="font-medium text-noir">Récapitulatif</p>
              <ul className="mt-2 space-y-1 text-anthracite/80">
                {lines.map((line) => (
                  <li key={line.lineId} className="flex justify-between">
                    <span>
                      {line.name} × {line.quantity}
                    </span>
                    <span>{formatXOF(Number(line.prixCatalogue) * line.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex justify-between border-t border-noir/10 pt-2 font-semibold text-noir">
                <span>Total catalogue</span>
                <span>{formatXOF(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-anthracite/60">Frais de livraison à confirmer</p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-between">
              <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                Retour
              </Button>
              <Button
                type="button"
                variant="whatsapp"
                onClick={handleConfirm}
                disabled={submitting}
              >
                {submitting ? "Envoi en cours..." : "📲 COMMANDER VIA WHATSAPP"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-anthracite/70">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
