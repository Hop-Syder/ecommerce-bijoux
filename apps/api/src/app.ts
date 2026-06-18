import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import { publicCategoriesRouter } from "./routes/public.categories.routes.js";
import { publicProductsRouter } from "./routes/public.products.routes.js";
import { publicOrdersRouter } from "./routes/public.orders.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { adminProductsRouter } from "./routes/admin.products.routes.js";
import { adminCategoriesRouter } from "./routes/admin.categories.routes.js";
import { adminOrdersRouter } from "./routes/admin.orders.routes.js";
import { adminUsersRouter } from "./routes/admin.users.routes.js";
import { adminNegotiationsRouter } from "./routes/admin.negotiations.routes.js";
import { adminReportsRouter } from "./routes/admin.reports.routes.js";
import { UPLOADS_DIR } from "./lib/storage.js";

export const app = express();

app.use(cors({ origin: process.env.WEB_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/public/categories", publicCategoriesRouter);
app.use("/api/public/products", publicProductsRouter);
app.use("/api/public/orders", publicOrdersRouter);

app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/categories", adminCategoriesRouter);
app.use("/api/admin/orders", adminOrdersRouter);
app.use("/api/admin/users", adminUsersRouter);
app.use("/api/admin/negotiations", adminNegotiationsRouter);
app.use("/api/admin/reports", adminReportsRouter);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Erreur interne du serveur" });
};
app.use(errorHandler);
