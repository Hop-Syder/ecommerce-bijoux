import { formatXOF } from "@/lib/format";

export function PriceTag({
  amount,
  size = "md",
}: {
  amount: number | string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = { sm: "text-base", md: "text-xl", lg: "text-3xl" }[size];
  return <span className={`font-display font-semibold text-noir ${sizeClasses}`}>{formatXOF(amount)}</span>;
}
