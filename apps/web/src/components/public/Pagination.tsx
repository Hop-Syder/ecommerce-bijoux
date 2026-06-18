import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  basePath,
  searchParams,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function buildHref(targetPage: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && key !== "page") params.set(key, value);
    }
    params.set("page", String(targetPage));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <nav className="mt-10 flex justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          className={`rounded-sm px-3 py-1.5 text-sm ${
            p === page ? "bg-noir text-ivoire" : "border border-noir/15 text-anthracite"
          }`}
        >
          {p}
        </Link>
      ))}
    </nav>
  );
}
