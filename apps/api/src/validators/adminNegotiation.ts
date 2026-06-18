import { z } from "zod";

export const negotiateInputSchema = z.object({
  prixPropose: z.coerce.number().positive(),
  reason: z.string().optional(),
  orderItemId: z.string().optional(),
});
