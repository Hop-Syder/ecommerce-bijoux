const TESTIMONIALS = [
  { name: "Aïcha, Cotonou", text: "Ma bague de fiançailles est magnifique, exactement comme négocié sur WhatsApp." },
  { name: "Bella H., Porto-Novo", text: "Service très humain, livraison rapide et bijou conforme aux photos." },
  { name: "Kossi A., Calavi", text: "La gravure personnalisée a fait toute la différence pour mon cadeau." },
];

export function Testimonials() {
  return (
    <section className="bg-noir/5 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center font-display text-3xl text-noir">Ils nous font confiance</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <blockquote key={t.name} className="rounded-sm bg-white p-6 shadow-sm">
              <p className="text-sm text-anthracite/80">&ldquo;{t.text}&rdquo;</p>
              <footer className="mt-3 text-xs font-medium uppercase tracking-wide text-or">
                {t.name}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
