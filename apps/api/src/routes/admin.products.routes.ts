import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { upload } from "../middleware/upload.js";
import { savePublicImage } from "../lib/storage.js";
import { productInputSchema } from "../validators/adminProduct.js";

export const adminProductsRouter = Router();

adminProductsRouter.use(requireAuth, requireRole("ADMIN", "SECRETARIAT"));

adminProductsRouter.get("/", async (_req, res) => {
  const products = await prisma.product.findMany({
    include: { images: true, category: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(products);
});

adminProductsRouter.get("/:id", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { images: true, category: true },
  });
  if (!product) return res.status(404).json({ error: "Produit introuvable" });
  res.json(product);
});

adminProductsRouter.post("/", async (req, res) => {
  const parsed = productInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const product = await prisma.product.create({ data: parsed.data });
  res.status(201).json(product);
});

adminProductsRouter.put("/:id", async (req, res) => {
  const parsed = productInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const product = await prisma.product
    .update({ where: { id: req.params.id }, data: parsed.data })
    .catch(() => null);
  if (!product) return res.status(404).json({ error: "Produit introuvable" });
  res.json(product);
});

adminProductsRouter.delete("/:id", async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } }).catch(() => null);
  res.status(204).send();
});

adminProductsRouter.post("/:id/images", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });

  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) return res.status(404).json({ error: "Produit introuvable" });

  const { url } = await savePublicImage(req.file.buffer, req.file.originalname);
  const image = await prisma.productImage.create({
    data: { productId: product.id, url, isPrimary: false, sortOrder: 99 },
  });
  res.status(201).json(image);
});

adminProductsRouter.delete("/:id/images/:imageId", async (req, res) => {
  await prisma.productImage
    .delete({ where: { id: req.params.imageId } })
    .catch(() => null);
  res.status(204).send();
});
