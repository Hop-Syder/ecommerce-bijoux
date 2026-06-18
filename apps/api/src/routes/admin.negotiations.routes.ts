import path from "node:path";
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { upload } from "../middleware/upload.js";
import { negotiateInputSchema } from "../validators/adminNegotiation.js";
import { decideNegotiation, NegotiationError, recordNegotiation } from "../services/negotiationService.js";
import { signProofUrl, verifyProofToken } from "../lib/signedUrl.js";
import { PRIVATE_UPLOADS_DIR } from "../lib/storage.js";

export const adminNegotiationsRouter = Router();

function withSignedProof<T extends { proofImageUrl: string | null }>(negotiation: T) {
  return {
    ...negotiation,
    proofImageUrl: negotiation.proofImageUrl ? signProofUrl(negotiation.proofImageUrl) : null,
  };
}

// Route de consultation des preuves : pas de requireAuth (un <img> ne peut pas
// envoyer de header Authorization) — la sécurité vient du token signé à courte
// durée de vie, généré à la demande par withSignedProof, jamais persisté.
adminNegotiationsRouter.get("/proofs/view", async (req, res) => {
  const token = typeof req.query.token === "string" ? req.query.token : "";
  try {
    const { key } = verifyProofToken(token);
    res.sendFile(path.join(PRIVATE_UPLOADS_DIR, key));
  } catch {
    res.status(401).json({ error: "Lien de preuve invalide ou expiré" });
  }
});

adminNegotiationsRouter.use(requireAuth, requireRole("ADMIN", "SECRETARIAT"));

adminNegotiationsRouter.get("/", async (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const negotiations = await prisma.negotiation.findMany({
    where: status ? { status: status as never } : undefined,
    include: { order: true, createdBy: true, decidedBy: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(negotiations.map(withSignedProof));
});

adminNegotiationsRouter.post(
  "/orders/:orderId/negotiate",
  upload.single("proofImage"),
  async (req, res) => {
    const parsed = negotiateInputSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    if (!req.file) return res.status(400).json({ error: "La preuve (capture WhatsApp ou reçu) est obligatoire" });

    try {
      const negotiation = await recordNegotiation({
        orderId: req.params.orderId,
        prixPropose: parsed.data.prixPropose,
        reason: parsed.data.reason,
        orderItemId: parsed.data.orderItemId,
        createdById: req.user!.sub,
        proofFile: { buffer: req.file.buffer, originalname: req.file.originalname },
      });
      res.status(201).json(withSignedProof(negotiation));
    } catch (err) {
      if (err instanceof NegotiationError) return res.status(err.status).json({ error: err.message });
      throw err;
    }
  }
);

adminNegotiationsRouter.patch("/:id/approve", requireRole("ADMIN"), async (req, res) => {
  try {
    const negotiation = await decideNegotiation(req.params.id, "VALIDEE", req.user!.sub);
    res.json(withSignedProof(negotiation));
  } catch (err) {
    if (err instanceof NegotiationError) return res.status(err.status).json({ error: err.message });
    throw err;
  }
});

adminNegotiationsRouter.patch("/:id/reject", requireRole("ADMIN"), async (req, res) => {
  try {
    const negotiation = await decideNegotiation(req.params.id, "REJETEE", req.user!.sub);
    res.json(withSignedProof(negotiation));
  } catch (err) {
    if (err instanceof NegotiationError) return res.status(err.status).json({ error: err.message });
    throw err;
  }
});
