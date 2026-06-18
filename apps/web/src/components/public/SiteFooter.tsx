import Link from "next/link";
import { WHATSAPP_PHONE, WHATSAPP_PHONE_DISPLAY } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-noir text-ivoire">
      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-xl text-or">SIKA BIJOUX</p>
          <p className="mt-2 text-sm text-ivoire/70">
            Joaillerie béninoise — or, argent et bronze d&apos;Abomey.
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm text-ivoire/80">
          <Link href="/catalogue">Catalogue</Link>
          <Link href="/notre-atelier">Notre Atelier</Link>
          <Link href="/guide-des-tailles">Guide des tailles</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div>
          <p className="text-sm text-ivoire/70">Commande &amp; contact</p>
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 text-whatsapp"
          >
            📲 {WHATSAPP_PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </footer>
  );
}
