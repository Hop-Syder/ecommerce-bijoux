function randomSuffix(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function buildReferenceCandidate(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `SKB-${y}${m}${d}-${randomSuffix()}`;
}
