import { z } from "zod";

export const createOrderSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(6),
  customerEmail: z.string().email().optional(),
  deliveryAddress: z.string().min(3),
  deliveryCity: z.string().min(2),
  deliveryNotes: z.string().optional(),
  remarks: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().positive(),
        variantSize: z.string().optional(),
        variantColor: z.string().optional(),
        engravingText: z.string().optional(),
      })
    )
    .min(1),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
