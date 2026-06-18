import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { buildReferenceCandidate } from "../lib/orderReference.js";
import type { CreateOrderInput } from "../validators/publicOrder.js";

export class OrderCreationError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

/**
 * Revalide chaque ligne du panier à partir des prix actuels en base —
 * ne jamais faire confiance aux prix envoyés par le client.
 */
export async function createPublicOrder(input: CreateOrderInput) {
  const productIds = input.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, status: "PUBLISHED" },
  });
  const productById = new Map(products.map((p) => [p.id, p]));

  for (const item of input.items) {
    if (!productById.has(item.productId)) {
      throw new OrderCreationError(`Produit indisponible : ${item.productId}`, 422);
    }
  }

  const orderItemsData = input.items.map((item) => {
    const product = productById.get(item.productId)!;
    return {
      productId: product.id,
      productNameSnap: product.name,
      variantSize: item.variantSize,
      variantColor: item.variantColor,
      engravingText: item.engravingText,
      quantity: item.quantity,
      prixCatalogueSnap: product.prixMax,
      prixMinSnap: product.prixMin,
    };
  });

  const totalCatalogue = orderItemsData.reduce(
    (sum, item) => sum + Number(item.prixCatalogueSnap) * item.quantity,
    0
  );

  const order = await createOrderWithUniqueReference({
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    customerEmail: input.customerEmail,
    deliveryAddress: input.deliveryAddress,
    deliveryCity: input.deliveryCity,
    deliveryNotes: input.deliveryNotes,
    remarks: input.remarks,
    totalCatalogue,
    items: orderItemsData,
  });

  return order;
}

type OrderCreateData = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryNotes?: string;
  remarks?: string;
  totalCatalogue: number;
  items: Prisma.OrderItemUncheckedCreateWithoutOrderInput[];
};

async function createOrderWithUniqueReference(data: OrderCreateData, attempt = 0) {
  if (attempt >= 5) {
    throw new OrderCreationError("Impossible de générer une référence de commande unique", 500);
  }
  const reference = buildReferenceCandidate();
  try {
    return await prisma.order.create({
      data: {
        reference,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        deliveryAddress: data.deliveryAddress,
        deliveryCity: data.deliveryCity,
        deliveryNotes: data.deliveryNotes,
        remarks: data.remarks,
        totalCatalogue: data.totalCatalogue,
        items: { create: data.items },
      },
      include: { items: true },
    });
  } catch (err: unknown) {
    const isUniqueViolation =
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: string }).code === "P2002";
    if (isUniqueViolation) {
      return createOrderWithUniqueReference(data, attempt + 1);
    }
    throw err;
  }
}
