"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { adminApiClient, ApiError } from "@/lib/adminApiClient";
import { Button } from "@/components/ui/Button";
import type { AdminCategory, AdminProduct } from "@/types/admin";

const MATERIALS = ["OR_18K", "OR_24K", "ARGENT_925", "BRONZE"] as const;
const STATUSES = ["DRAFT", "PUBLISHED", "OUT_OF_STOCK", "ARCHIVED"] as const;

type FormState = {
  sku: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  prixMax: string;
  prixMin: string;
  material: (typeof MATERIALS)[number];
  weightApproxG: string;
  stone: string;
  setting: string;
  hallmark: string;
  sizeOptions: string;
  colorOptions: string;
  engravingAvailable: boolean;
  deliveryDelay: string;
  warranty: string;
  stock: string;
  status: (typeof STATUSES)[number];
  badges: string;
  isFeatured: boolean;
};

function toFormState(product?: AdminProduct): FormState {
  return {
    sku: product?.sku ?? "",
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    categoryId: product?.categoryId ?? "",
    prixMax: product?.prixMax ?? "",
    prixMin: product?.prixMin ?? "",
    material: product?.material ?? "OR_18K",
    weightApproxG: product?.weightApproxG ?? "",
    stone: product?.stone ?? "",
    setting: product?.setting ?? "",
    hallmark: product?.hallmark ?? "",
    sizeOptions: (product?.sizeOptions ?? []).join(", "),
    colorOptions: (product?.colorOptions ?? []).join(", "),
    engravingAvailable: product?.engravingAvailable ?? false,
    deliveryDelay: product?.deliveryDelay ?? "",
    warranty: product?.warranty ?? "",
    stock: String(product?.stock ?? 0),
    status: product?.status ?? "DRAFT",
    badges: (product?.badges ?? []).join(", "),
    isFeatured: product?.isFeatured ?? false,
  };
}

export function ProductForm({
  categories,
  product,
}: {
  categories: AdminCategory[];
  product?: AdminProduct;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState<FormState>(toFormState(product));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.apiToken) return;
    setSubmitting(true);
    setError(null);

    const payload = {
      sku: form.sku,
      name: form.name,
      slug: form.slug,
      description: form.description || undefined,
      categoryId: form.categoryId,
      prixMax: Number(form.prixMax),
      prixMin: Number(form.prixMin),
      material: form.material,
      weightApproxG: form.weightApproxG ? Number(form.weightApproxG) : undefined,
      stone: form.stone || undefined,
      setting: form.setting || undefined,
      hallmark: form.hallmark || undefined,
      sizeOptions: form.sizeOptions.split(",").map((s) => s.trim()).filter(Boolean),
      colorOptions: form.colorOptions.split(",").map((s) => s.trim()).filter(Boolean),
      engravingAvailable: form.engravingAvailable,
      deliveryDelay: form.deliveryDelay || undefined,
      warranty: form.warranty || undefined,
      stock: Number(form.stock),
      status: form.status,
      badges: form.badges.split(",").map((s) => s.trim()).filter(Boolean),
      isFeatured: form.isFeatured,
    };

    try {
      if (product) {
        await adminApiClient.put(session.apiToken, `/api/admin/products/${product.id}`, payload);
        router.refresh();
      } else {
        const created = await adminApiClient.post<AdminProduct>(
          session.apiToken,
          "/api/admin/products",
          payload
        );
        router.push(`/admin/produits/${created.id}`);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !product || !session?.apiToken) return;
    setUploading(true);
    try {
      await adminApiClient.upload(session.apiToken, `/api/admin/products/${product.id}/images`, file);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="SKU">
          <input className="input" value={form.sku} onChange={(e) => update("sku", e.target.value)} required />
        </Field>
        <Field label="Nom">
          <input className="input" value={form.name} onChange={(e) => update("name", e.target.value)} required />
        </Field>
        <Field label="Slug">
          <input className="input" value={form.slug} onChange={(e) => update("slug", e.target.value)} required />
        </Field>
        <Field label="Catégorie">
          <select
            className="input"
            value={form.categoryId}
            onChange={(e) => update("categoryId", e.target.value)}
            required
          >
            <option value="">Choisir...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Prix catalogue (FCFA)">
          <input
            type="number"
            className="input"
            value={form.prixMax}
            onChange={(e) => update("prixMax", e.target.value)}
            required
          />
        </Field>
        <Field label="Prix plancher (FCFA) — jamais public">
          <input
            type="number"
            className="input"
            value={form.prixMin}
            onChange={(e) => update("prixMin", e.target.value)}
            required
          />
        </Field>
        <Field label="Matière">
          <select
            className="input"
            value={form.material}
            onChange={(e) => update("material", e.target.value as FormState["material"])}
          >
            {MATERIALS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Statut">
          <select
            className="input"
            value={form.status}
            onChange={(e) => update("status", e.target.value as FormState["status"])}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Poids approximatif (g)">
          <input
            type="number"
            className="input"
            value={form.weightApproxG}
            onChange={(e) => update("weightApproxG", e.target.value)}
          />
        </Field>
        <Field label="Stock">
          <input type="number" className="input" value={form.stock} onChange={(e) => update("stock", e.target.value)} />
        </Field>
        <Field label="Pierre">
          <input className="input" value={form.stone} onChange={(e) => update("stone", e.target.value)} />
        </Field>
        <Field label="Sertissage">
          <input className="input" value={form.setting} onChange={(e) => update("setting", e.target.value)} />
        </Field>
        <Field label="Poinçon">
          <input className="input" value={form.hallmark} onChange={(e) => update("hallmark", e.target.value)} />
        </Field>
        <Field label="Délai de fabrication">
          <input
            className="input"
            value={form.deliveryDelay}
            onChange={(e) => update("deliveryDelay", e.target.value)}
          />
        </Field>
        <Field label="Garantie">
          <input className="input" value={form.warranty} onChange={(e) => update("warranty", e.target.value)} />
        </Field>
        <Field label="Tailles (séparées par virgule)">
          <input
            className="input"
            value={form.sizeOptions}
            onChange={(e) => update("sizeOptions", e.target.value)}
          />
        </Field>
        <Field label="Couleurs (séparées par virgule)">
          <input
            className="input"
            value={form.colorOptions}
            onChange={(e) => update("colorOptions", e.target.value)}
          />
        </Field>
        <Field label="Badges (séparés par virgule)">
          <input className="input" value={form.badges} onChange={(e) => update("badges", e.target.value)} />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          className="input"
          rows={3}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </Field>

      <div className="flex gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.engravingAvailable}
            onChange={(e) => update("engravingAvailable", e.target.checked)}
          />
          Gravure disponible
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => update("isFeatured", e.target.checked)}
          />
          Produit phare (accueil)
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Enregistrement..." : "Enregistrer"}
      </Button>

      {product && (
        <div className="border-t border-noir/10 pt-6">
          <p className="text-sm font-semibold text-noir">Photos</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {product.images.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={img.id} src={img.url} alt={img.alt ?? ""} className="h-20 w-20 rounded-sm object-cover" />
            ))}
          </div>
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="mt-3" />
        </div>
      )}
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-anthracite/70">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
