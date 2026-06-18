import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { orderStatusSchema, orderUpdateSchema } from "../validators/adminOrder.js";
import { hasPendingNegotiation } from "../services/negotiationService.js";
import { signProofUrl } from "../lib/signedUrl.js";

export const adminOrdersRouter = Router();

adminOrdersRouter.use(requireAuth, requireRole("ADMIN", "SECRETARIAT"));

adminOrdersRouter.get("/", async (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const orders = await prisma.order.findMany({
    where: status ? { status: status as never } : undefined,
    include: { items: true, handledBy: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders);
});

adminOrdersRouter.get("/:id", async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: true, handledBy: true, negotiations: true },
  });
  if (!order) return res.status(404).json({ error: "Commande introuvable" });
  res.json({
    ...order,
    negotiations: order.negotiations.map((n) => ({
      ...n,
      proofImageUrl: n.proofImageUrl ? signProofUrl(n.proofImageUrl) : null,
    })),
  });
});

adminOrdersRouter.patch("/:id/status", async (req, res) => {
  const parsed = orderStatusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  if (parsed.data.status !== "ANNULEE" && (await hasPendingNegotiation(req.params.id))) {
    return res.status(409).json({
      error: "Une négociation est en attente de validation manager — résolvez-la avant de faire progresser la commande",
    });
  }

  const order = await prisma.order
    .update({ where: { id: req.params.id }, data: { status: parsed.data.status } })
    .catch(() => null);
  if (!order) return res.status(404).json({ error: "Commande introuvable" });
  res.json(order);
});

adminOrdersRouter.patch("/:id", async (req, res) => {
  const parsed = orderUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const order = await prisma.order
    .update({ where: { id: req.params.id }, data: parsed.data })
    .catch(() => null);
  if (!order) return res.status(404).json({ error: "Commande introuvable" });
  res.json(order);
});
