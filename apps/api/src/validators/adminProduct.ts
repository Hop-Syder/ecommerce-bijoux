import { z } from "zod";

const MATERIALS = ["OR_18K", "OR_24K", "ARGENT_925", "BRONZE"] as const;
const STATUSES = ["DRAFT", "PUBLISHED", "OUT_OF_STOCK", "ARCHIVED"] as const;

export const productInputSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Le slug ne doit contenir que des lettres minuscules, chiffres et tirets"),
  description: z.string().optional(),
  categoryId: z.string().min(1),
  prixMax: z.coerce.number().positive(),
  prixMin: z.coerce.number().positive(),
  material: z.enum(MATERIALS),
  weightApproxG: z.coerce.number().nonnegative().optional(),
  stone: z.string().optional(),
  setting: z.string().optional(),
  hallmark: z.string().optional(),
  sizeOptions: z.array(z.string()).default([]),
  colorOptions: z.array(z.string()).default([]),
  engravingAvailable: z.boolean().default(false),
  deliveryDelay: z.string().optional(),
  warranty: z.string().optional(),
  stock: z.coerce.number().int().nonnegative().default(0),
  status: z.enum(STATUSES).default("DRAFT"),
  badges: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
}).refine((data) => data.prixMin <= data.prixMax, {
  message: "Le prix plancher doit être inférieur ou égal au prix catalogue",
  path: ["prixMin"],
});

export const productUpdateSchema = productInputSchema;
