import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-ivoire">
      <header className="flex items-center justify-between border-b border-or/20 bg-noir px-6 py-4 text-ivoire">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="font-display text-xl text-or">
            SIKA BIJOUX — Admin
          </Link>
          <nav className="flex gap-5 text-sm">
            <Link href="/admin/produits">Produits</Link>
            <Link href="/admin/categories">Catégories</Link>
            <Link href="/admin/commandes">Commandes</Link>
            <Link href="/admin/negociations">Négociations</Link>
            <Link href="/admin/rapports">Rapports</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span>
            {session.user.name} · {session.user.role}
          </span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button type="submit" className="underline">
              Déconnexion
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
