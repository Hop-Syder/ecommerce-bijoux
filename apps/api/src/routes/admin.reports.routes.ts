import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import {
  getMarginReport,
  getMostNegotiatedProducts,
  getPriceGapSummary,
  getSellerPerformance,
} from "../services/reportService.js";

export const adminReportsRouter = Router();

adminReportsRouter.use(requireAuth, requireRole("ADMIN", "SECRETARIAT"));

adminReportsRouter.get("/price-gap", async (_req, res) => {
  res.json(await getPriceGapSummary());
});

adminReportsRouter.get("/margin", async (_req, res) => {
  res.json(await getMarginReport());
});

adminReportsRouter.get("/seller-performance", async (_req, res) => {
  res.json(await getSellerPerformance());
});

adminReportsRouter.get("/most-negotiated-products", async (_req, res) => {
  res.json(await getMostNegotiatedProducts());
});
