import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");
const PRIVATE_UPLOADS_DIR = path.resolve(process.cwd(), "private-uploads");
const PUBLIC_BASE_URL = process.env.API_PUBLIC_URL ?? "http://localhost:4000";

/**
 * Stockage local de développement. À remplacer par un client Supabase Storage
 * (mêmes signatures) une fois le projet Supabase de l'utilisateur configuré —
 * voir apps/api/.env.example pour les variables SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.
 *
 * Bucket "public" (photos produits) : servi directement en statique, URL stable.
 * Bucket "privé" (preuves de négociation) : jamais servi en statique — voir signedUrl.ts,
 * qui génère une URL signée à durée de vie courte à chaque consultation, comme le ferait
 * `supabase.storage.from('negotiation-proofs').createSignedUrl(...)`.
 */
export async function savePublicImage(buffer: Buffer, originalName: string): Promise<{ url: string }> {
  const ext = path.extname(originalName) || ".jpg";
  const filename = `${randomUUID()}${ext}`;
  const dir = path.join(UPLOADS_DIR, "products");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return { url: `${PUBLIC_BASE_URL}/uploads/products/${filename}` };
}

export async function savePrivateProof(buffer: Buffer, originalName: string): Promise<{ key: string }> {
  const ext = path.extname(originalName) || ".jpg";
  const filename = `${randomUUID()}${ext}`;
  const dir = path.join(PRIVATE_UPLOADS_DIR, "negotiation-proofs");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return { key: `negotiation-proofs/${filename}` };
}

export { UPLOADS_DIR, PRIVATE_UPLOADS_DIR };
