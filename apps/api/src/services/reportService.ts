import type { NegotiationStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

const RESOLVED_STATUSES: NegotiationStatus[] = ["AUTO_VALIDEE", "VALIDEE"];

export async function getPriceGapSummary() {
  const negotiations = await prisma.negotiation.findMany({
    where: { status: { in: RESOLVED_STATUSES } },
  });

  const count = negotiations.length;
  const totalEcart = negotiations.reduce((sum, n) => sum + Number(n.ecart), 0);
  const totalCatalogue = negotiations.reduce((sum, n) => sum + Number(n.prixCatalogue), 0);

  return {
    negotiationsCount: count,
    averageEcart: count > 0 ? totalEcart / count : 0,
    averageEcartPercent: totalCatalogue > 0 ? (totalEcart / totalCatalogue) * 100 : 0,
  };
}

export async function getMarginReport() {
  const orders = await prisma.order.findMany({
    where: { totalReal: { not: null } },
    select: { totalCatalogue: true, totalReal: true },
  });

  const theoreticalTotal = orders.reduce((sum, o) => sum + Number(o.totalCatalogue), 0);
  const realTotal = orders.reduce((sum, o) => sum + Number(o.totalReal ?? 0), 0);

  return {
    ordersCount: orders.length,
    theoreticalTotal,
    realTotal,
    marginLost: theoreticalTotal - realTotal,
  };
}

export async function getSellerPerformance() {
  const negotiations = await prisma.negotiation.findMany({
    where: { status: { in: RESOLVED_STATUSES } },
    include: { createdBy: true },
  });

  const bySeller = new Map<
    string,
    { sellerName: string; count: number; totalEcart: number; requiresApprovalCount: number }
  >();

  for (const negotiation of negotiations) {
    const key = negotiation.createdById;
    const entry = bySeller.get(key) ?? {
      sellerName: negotiation.createdBy.name,
      count: 0,
      totalEcart: 0,
      requiresApprovalCount: 0,
    };
    entry.count += 1;
    entry.totalEcart += Number(negotiation.ecart);
    if (negotiation.requiresApproval) entry.requiresApprovalCount += 1;
    bySeller.set(key, entry);
  }

  return Array.from(bySeller.entries()).map(([sellerId, data]) => ({
    sellerId,
    sellerName: data.sellerName,
    negotiationsCount: data.count,
    averageEcart: data.count > 0 ? data.totalEcart / data.count : 0,
    requiresApprovalCount: data.requiresApprovalCount,
  }));
}

export async function getMostNegotiatedProducts() {
  const negotiations = await prisma.negotiation.findMany({
    where: { status: { in: RESOLVED_STATUSES } },
    include: {
      order: { include: { items: { include: { product: true } } } },
      orderItem: { include: { product: true } },
    },
  });

  const byProduct = new Map<string, { productName: string; count: number; totalEcart: number }>();

  for (const negotiation of negotiations) {
    const products = negotiation.orderItem
      ? [negotiation.orderItem.product]
      : negotiation.order.items.map((item) => item.product);

    const uniqueProducts = Array.from(new Map(products.map((p) => [p.id, p])).values());

    for (const product of uniqueProducts) {
      const entry = byProduct.get(product.id) ?? {
        productName: product.name,
        count: 0,
        totalEcart: 0,
      };
      entry.count += 1;
      entry.totalEcart += Number(negotiation.ecart);
      byProduct.set(product.id, entry);
    }
  }

  return Array.from(byProduct.entries())
    .map(([productId, data]) => ({
      productId,
      productName: data.productName,
      negotiationsCount: data.count,
      averageEcart: data.count > 0 ? data.totalEcart / data.count : 0,
    }))
    .sort((a, b) => b.negotiationsCount - a.negotiationsCount);
}
