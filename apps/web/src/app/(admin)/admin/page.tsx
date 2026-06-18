import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-noir">Tableau de bord</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/negociations"
          className="rounded-sm border border-noir/10 bg-white p-6 hover:border-or"
        >
          <p className="font-display text-xl text-noir">Négociations</p>
          <p className="mt-1 text-sm text-anthracite/60">File de validation manager</p>
        </Link>
        <Link
          href="/admin/rapports"
          className="rounded-sm border border-noir/10 bg-white p-6 hover:border-or"
        >
          <p className="font-display text-xl text-noir">Rapports</p>
          <p className="mt-1 text-sm text-anthracite/60">Écarts, marge, performance vendeurs</p>
        </Link>
        <Link
          href="/admin/produits"
          className="rounded-sm border border-noir/10 bg-white p-6 hover:border-or"
        >
          <p className="font-display text-xl text-noir">Produits</p>
          <p className="mt-1 text-sm text-anthracite/60">Catalogue, prix catalogue et prix plancher</p>
        </Link>
        <Link
          href="/admin/categories"
          className="rounded-sm border border-noir/10 bg-white p-6 hover:border-or"
        >
          <p className="font-display text-xl text-noir">Catégories</p>
          <p className="mt-1 text-sm text-anthracite/60">Organisation du catalogue</p>
        </Link>
        <Link
          href="/admin/commandes"
          className="rounded-sm border border-noir/10 bg-white p-6 hover:border-or"
        >
          <p className="font-display text-xl text-noir">Commandes</p>
          <p className="mt-1 text-sm text-anthracite/60">Suivi et statuts</p>
        </Link>
      </div>
    </div>
  );
}
