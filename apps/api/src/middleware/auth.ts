import type { NextFunction, Request, Response } from "express";
import { verifyApiToken, type ApiTokenPayload } from "../lib/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: ApiTokenPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentification requise" });
  }
  try {
    req.user = verifyApiToken(header.slice("Bearer ".length));
    next();
  } catch {
    return res.status(401).json({ error: "Session invalide ou expirée" });
  }
}
