import { z } from "zod";

export const categoryInputSchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Le slug ne doit contenir que des lettres minuscules, chiffres et tirets"),
  description: z.string().optional(),
  bannerUrl: z.string().optional(),
  icon: z.string().optional(),
  active: z.boolean().default(true),
});

export const reorderSchema = z.object({
  order: z.array(z.object({ id: z.string(), sortOrder: z.number().int() })),
});
