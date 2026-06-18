import jwt from "jsonwebtoken";

const SECRET = process.env.API_JWT_SECRET ?? "dev-secret-change-me";
const PUBLIC_BASE_URL = process.env.API_PUBLIC_URL ?? "http://localhost:4000";

/**
 * Équivalent local de `supabase.storage.from(bucket).createSignedUrl(key, ttl)` :
 * une URL à durée de vie courte, générée à la demande, jamais persistée en base.
 */
export function signProofUrl(storageKey: string, ttlSeconds = 600): string {
  const token = jwt.sign({ key: storageKey }, SECRET, { expiresIn: ttlSeconds });
  return `${PUBLIC_BASE_URL}/api/admin/negotiations/proofs/view?token=${encodeURIComponent(token)}`;
}

export function verifyProofToken(token: string): { key: string } {
  return jwt.verify(token, SECRET) as { key: string };
}
