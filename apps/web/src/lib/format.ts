export function formatXOF(amount: number | string): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}
