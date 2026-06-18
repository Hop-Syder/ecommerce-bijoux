import { Router } from "express";
import { createOrderSchema } from "../validators/publicOrder.js";
import { createPublicOrder, OrderCreationError } from "../services/orderService.js";

export const publicOrdersRouter = Router();

publicOrdersRouter.post("/", async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const order = await createPublicOrder(parsed.data);
    res.status(201).json({
      id: order.id,
      reference: order.reference,
      createdAt: order.createdAt,
      totalCatalogue: order.totalCatalogue,
      items: order.items.map((item) => ({
        productName: item.productNameSnap,
        variantSize: item.variantSize,
        variantColor: item.variantColor,
        engravingText: item.engravingText,
        quantity: item.quantity,
        prixCatalogue: item.prixCatalogueSnap,
      })),
    });
  } catch (err) {
    if (err instanceof OrderCreationError) {
      return res.status(err.status).json({ error: err.message });
    }
    throw err;
  }
});
