"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useHasMounted } from "@/hooks/useHasMounted";

export function SiteHeader() {
  const router = useRouter();
  const mounted = useHasMounted();
  const itemCount = useCartStore((state) =>
    state.lines.reduce((sum, line) => sum + line.quantity, 0)
  );

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q");
    router.push(`/catalogue${q ? `?q=${encodeURIComponent(String(q))}` : ""}`);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-or/20 bg-ivoire/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="font-display text-2xl text-noir">
          SIKA <span className="text-or">BIJOUX</span>
        </Link>
        <form onSubmit={handleSearch} className="hidden flex-1 max-w-sm sm:block">
          <input
            name="q"
            type="search"
            placeholder="Rechercher un bijou..."
            className="w-full rounded-sm border border-noir/15 bg-white px-3 py-2 text-sm focus:border-or focus:outline-none"
          />
        </form>
        <nav className="flex items-center gap-6 text-sm font-medium text-anthracite">
          <Link href="/catalogue" className="hidden sm:inline">
            Catalogue
          </Link>
          <Link href="/panier" className="relative">
            Panier
            {mounted && itemCount > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-or text-xs text-noir">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
