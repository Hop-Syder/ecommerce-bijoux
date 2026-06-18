import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { signApiToken } from "../lib/jwt.js";
import { loginSchema } from "../validators/authLogin.js";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !user.active) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  const passwordOk = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!passwordOk) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  const token = signApiToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});
