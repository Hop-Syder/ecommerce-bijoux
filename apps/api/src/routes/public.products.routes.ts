import { Router } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import {
  serializePublicProduct,
  serializePublicProductList,
} from "../serializers/publicProductSerializer.js";
import { productListQuerySchema } from "../validators/publicProductQuery.js";

export const publicProductsRouter = Router();

publicProductsRouter.get("/featured", async (_req, res) => {
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED", isFeatured: true },
    include: { images: true, category: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });
  res.json(serializePublicProductList(products));
});

publicProductsRouter.get("/", async (req, res) => {
  const parsed = productListQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { category, material, stone, minPrice, maxPrice, inStock, sort, page, pageSize } =
    parsed.data;

  const where: Prisma.ProductWhereInput = {
    status: "PUBLISHED",
    ...(category ? { category: { slug: category } } : {}),
    ...(material ? { material } : {}),
    ...(stone ? { stone: { equals: stone, mode: "insensitive" } } : {}),
    ...(inStock === true ? { stock: { gt: 0 } } : {}),
    ...(inStock === false ? { stock: { lte: 0 } } : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          prixMax: {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
          },
        }
      : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc"
      ? { prixMax: "asc" }
      : sort === "price_desc"
        ? { prixMax: "desc" }
        : { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: true, category: true },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    items: serializePublicProductList(products),
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
});

publicProductsRouter.get("/:slug", async (req, res) => {
  const product = await prisma.product.findFirst({
    where: { slug: req.params.slug, status: "PUBLISHED" },
    include: { images: true, category: true },
  });
  if (!product) {
    return res.status(404).json({ error: "Produit introuvable" });
  }
  res.json(serializePublicProduct(product));
});

publicProductsRouter.get("/:slug/similar", async (req, res) => {
  const product = await prisma.product.findFirst({
    where: { slug: req.params.slug },
    select: { id: true, categoryId: true },
  });
  if (!product) {
    return res.status(404).json({ error: "Produit introuvable" });
  }
  const similar = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: { images: true, category: true },
    take: 4,
  });
  res.json(serializePublicProductList(similar));
});
