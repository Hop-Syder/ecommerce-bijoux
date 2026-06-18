import { CatalogView } from "@/components/public/CatalogView";

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <CatalogView
      searchParams={resolvedSearchParams}
      basePath="/catalogue"
      title="Catalogue"
    />
  );
}
