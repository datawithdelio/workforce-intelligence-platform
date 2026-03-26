import { Router } from "express";

import { requireAuth, requireRole } from "../middleware/auth";
import type { AppServices } from "../services";
import type { AuthenticatedRequest } from "../types";

export function buildAdminRouter(services: AppServices): Router {
  const router = Router();

  router.get("/users", requireAuth, requireRole("admin"), async (req: AuthenticatedRequest, res, next) => {
    try {
      const response = await services.admin.listUsers({ authUser: req.authUser! });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
