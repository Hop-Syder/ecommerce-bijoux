import { z } from "zod";

export const orderStatusSchema = z.object({
  status: z.enum(["RECUE", "EN_FABRICATION", "CONTROLE_QUALITE", "LIVREE", "ANNULEE"]),
});

export const orderUpdateSchema = z.object({
  handledById: z.string().nullable().optional(),
  deliveryFee: z.coerce.number().nonnegative().nullable().optional(),
  remarks: z.string().optional(),
});
