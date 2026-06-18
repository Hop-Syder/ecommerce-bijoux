"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { adminApiClient, ApiError } from "@/lib/adminApiClient";
import { Button } from "@/components/ui/Button";
import type { AdminCategory } from "@/types/admin";

export function CategoryManager({ categories }: { categories: AdminCategory[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.apiToken) return;
    setSubmitting(true);
    setError(null);
    try {
      await adminApiClient.post(session.apiToken, "/api/admin/categories", { name, slug });
      setName("");
      setSlug("");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur lors de la création");
    } finally {
      setSubmitting(false);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    if (!session?.apiToken) return;
    const target = index + direction;
    if (target < 0 || target >= categories.length) return;

    const reordered = [...categories];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    await adminApiClient.put(session.apiToken, "/api/admin/categories/reorder", {
      order: reordered.map((c, i) => ({ id: c.id, sortOrder: i })),
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!session?.apiToken) return;
    await adminApiClient.delete(session.apiToken, `/api/admin/categories/${id}`);
    router.refresh();
  }

  return (
    <div>
      <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-3 rounded-sm border border-noir/10 bg-white p-4">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-anthracite/70">Nom</span>
          <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-anthracite/70">Slug</span>
          <input className="input mt-1" value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </label>
        <Button type="submit" disabled={submitting}>
          Ajouter
        </Button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      <table className="mt-6 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-noir/10 text-left text-anthracite/60">
            <th className="py-2">Ordre</th>
            <th className="py-2">Nom</th>
            <th className="py-2">Slug</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.id} className="border-b border-noir/5">
              <td className="py-2">
                <button type="button" onClick={() => move(index, -1)} className="px-1 text-anthracite/60 hover:text-noir">
                  ↑
                </button>
                <button type="button" onClick={() => move(index, 1)} className="px-1 text-anthracite/60 hover:text-noir">
                  ↓
                </button>
              </td>
              <td className="py-2">{category.name}</td>
              <td className="py-2 text-anthracite/60">{category.slug}</td>
              <td className="py-2 text-right">
                <button
                  type="button"
                  onClick={() => remove(category.id)}
                  className="text-red-600 hover:underline"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
