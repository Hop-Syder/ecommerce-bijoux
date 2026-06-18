export function Badge({ children }: { children: string }) {
  return (
    <span className="inline-block rounded-sm bg-or px-2 py-1 text-xs font-semibold uppercase tracking-wide text-noir">
      {children}
    </span>
  );
}
