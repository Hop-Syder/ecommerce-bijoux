import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

export const adminUsersRouter = Router();

adminUsersRouter.use(requireAuth, requireRole("ADMIN", "SECRETARIAT"));

adminUsersRouter.get("/", async (_req, res) => {
  const users = await prisma.user.findMany({
    where: { active: true },
    select: { id: true, name: true, email: true, role: true },
  });
  res.json(users);
});
