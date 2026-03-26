import { Router } from "express";

import { requireAuth, requireRole } from "../middleware/auth";
import type { AppServices } from "../services";
import type { AuthenticatedRequest } from "../types";

export function buildDashboardRouter(services: AppServices): Router {
  const router = Router();

  router.get("/kpis", requireAuth, requireRole("manager", "admin"), async (req: AuthenticatedRequest, res, next) => {
    try {
      const response = await services.dashboard.getKpis({ authUser: req.authUser! });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get(
    "/activity",
    requireAuth,
    requireRole("manager", "admin"),
    async (req: AuthenticatedRequest, res, next) => {
      try {
        const response = await services.dashboard.getActivity({ authUser: req.authUser! });
        res.status(200).json(response);
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}
