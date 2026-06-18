const ITEMS = [
  "Or certifié & poinçonné",
  "Livraison sécurisée",
  "Commande via WhatsApp",
  "Gravure personnalisée",
];

export function TrustBanner() {
  return (
    <section className="border-y border-or/30 bg-ivoire">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-6 py-6 text-center sm:grid-cols-4">
        {ITEMS.map((item) => (
          <p key={item} className="text-xs font-medium uppercase tracking-wide text-anthracite">
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}
