import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { categoryInputSchema, reorderSchema } from "../validators/adminCategory.js";

export const adminCategoriesRouter = Router();

adminCategoriesRouter.use(requireAuth, requireRole("ADMIN", "SECRETARIAT"));

adminCategoriesRouter.get("/", async (_req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  res.json(categories);
});

adminCategoriesRouter.post("/", async (req, res) => {
  const parsed = categoryInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const maxSortOrder = await prisma.category.aggregate({ _max: { sortOrder: true } });
  const category = await prisma.category.create({
    data: { ...parsed.data, sortOrder: (maxSortOrder._max.sortOrder ?? 0) + 1 },
  });
  res.status(201).json(category);
});

adminCategoriesRouter.put("/reorder", async (req, res) => {
  const parsed = reorderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  await prisma.$transaction(
    parsed.data.order.map(({ id, sortOrder }) =>
      prisma.category.update({ where: { id }, data: { sortOrder } })
    )
  );
  res.status(204).send();
});

adminCategoriesRouter.put("/:id", async (req, res) => {
  const parsed = categoryInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const category = await prisma.category
    .update({ where: { id: req.params.id }, data: parsed.data })
    .catch(() => null);
  if (!category) return res.status(404).json({ error: "Catégorie introuvable" });
  res.json(category);
});

adminCategoriesRouter.delete("/:id", async (req, res) => {
  await prisma.category.delete({ where: { id: req.params.id } }).catch(() => null);
  res.status(204).send();
});
