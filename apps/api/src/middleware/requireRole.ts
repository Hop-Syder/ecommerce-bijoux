import type { NextFunction, Request, Response } from "express";
import type { ApiTokenPayload } from "../lib/jwt.js";

export function requireRole(...roles: ApiTokenPayload["role"][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Accès refusé pour ce rôle" });
    }
    next();
  };
}
