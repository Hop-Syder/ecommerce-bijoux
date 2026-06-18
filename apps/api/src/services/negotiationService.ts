import { prisma } from "../lib/prisma.js";
import { savePrivateProof } from "../lib/storage.js";

export class NegotiationError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

type NegotiateInput = {
  orderId: string;
  prixPropose: number;
  reason?: string;
  orderItemId?: string;
  createdById: string;
  proofFile: { buffer: Buffer; originalname: string };
};

/**
 * Cœur de la traçabilité des 3 prix : compare le prix réellement convenu au prix
 * plancher (snapshot pris à la commande, pas le plancher actuel du produit) et
 * détermine si une validation manager est requise avant d'accepter la vente.
 */
export async function recordNegotiation(input: NegotiateInput) {
  const order = await prisma.order.findUnique({
    where: { id: input.orderId },
    include: { items: true },
  });
  if (!order) throw new NegotiationError("Commande introuvable", 404);

  let prixCatalogue: number;
  let prixMin: number;

  if (input.orderItemId) {
    const item = order.items.find((i) => i.id === input.orderItemId);
    if (!item) throw new NegotiationError("Article de commande introuvable", 404);
    prixCatalogue = Number(item.prixCatalogueSnap) * item.quantity;
    prixMin = Number(item.prixMinSnap) * item.quantity;
  } else {
    prixCatalogue = Number(order.totalCatalogue);
    prixMin = order.items.reduce(
      (sum, item) => sum + Number(item.prixMinSnap) * item.quantity,
      0
    );
  }

  const { key: proofImageUrl } = await savePrivateProof(
    input.proofFile.buffer,
    input.proofFile.originalname
  );

  const ecart = prixCatalogue - input.prixPropose;
  const requiresApproval = input.prixPropose < prixMin;

  const negotiation = await prisma.negotiation.create({
    data: {
      orderId: order.id,
      orderItemId: input.orderItemId,
      prixCatalogue,
      prixMin,
      prixPropose: input.prixPropose,
      ecart,
      proofImageUrl,
      reason: input.reason,
      status: requiresApproval ? "EN_ATTENTE" : "AUTO_VALIDEE",
      requiresApproval,
      createdById: input.createdById,
    },
  });

  if (!requiresApproval) {
    await prisma.order.update({
      where: { id: order.id },
      data: { totalReal: input.prixPropose },
    });
  }

  return negotiation;
}

export async function decideNegotiation(
  negotiationId: string,
  decision: "VALIDEE" | "REJETEE",
  decidedById: string
) {
  const negotiation = await prisma.negotiation.findUnique({ where: { id: negotiationId } });
  if (!negotiation) throw new NegotiationError("Négociation introuvable", 404);
  if (!negotiation.requiresApproval || negotiation.status !== "EN_ATTENTE") {
    throw new NegotiationError("Cette négociation ne nécessite pas (ou plus) de validation", 409);
  }

  const updated = await prisma.negotiation.update({
    where: { id: negotiationId },
    data: { status: decision, decidedById, decidedAt: new Date() },
  });

  if (decision === "VALIDEE") {
    await prisma.order.update({
      where: { id: negotiation.orderId },
      data: { totalReal: negotiation.prixPropose },
    });
  }

  return updated;
}

export async function hasPendingNegotiation(orderId: string): Promise<boolean> {
  const pending = await prisma.negotiation.findFirst({
    where: { orderId, status: "EN_ATTENTE" },
  });
  return pending !== null;
}
