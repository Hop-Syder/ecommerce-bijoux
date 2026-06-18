import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center bg-noir text-ivoire">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-or">Joaillerie béninoise</p>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">SIKA BIJOUX</h1>
        <p className="mt-4 text-ivoire/80">
          Or, argent et bronze d&apos;Abomey — des pièces authentiques, alliant tradition locale
          et création contemporaine.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/catalogue">
            <Button variant="secondary">Découvrir le catalogue</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
