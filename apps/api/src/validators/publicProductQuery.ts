import { z } from "zod";

export const productListQuerySchema = z.object({
  category: z.string().optional(),
  material: z.enum(["OR_18K", "OR_24K", "ARGENT_925", "BRONZE"]).optional(),
  stone: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  inStock: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  sort: z.enum(["price_asc", "price_desc", "newest"]).default("newest"),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(48).default(12),
});

export type ProductListQuery = z.infer<typeof productListQuerySchema>;
