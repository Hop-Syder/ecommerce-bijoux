import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  serializePublicCategory,
  serializePublicCategoryList,
} from "../serializers/publicCategorySerializer.js";

export const publicCategoriesRouter = Router();

publicCategoriesRouter.get("/", async (_req, res) => {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  res.json(serializePublicCategoryList(categories));
});

publicCategoriesRouter.get("/:slug", async (req, res) => {
  const category = await prisma.category.findFirst({
    where: { slug: req.params.slug, active: true },
  });
  if (!category) {
    return res.status(404).json({ error: "Catégorie introuvable" });
  }
  res.json(serializePublicCategory(category));
});
