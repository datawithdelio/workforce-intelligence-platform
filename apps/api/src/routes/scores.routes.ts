import { Router } from "express";

import { scoreEmployeeIdParamSchema } from "@workforce/shared";

import { parseOrThrow } from "../lib/validation";
import { requireAuth, requireRole } from "../middleware/auth";
import type { AppServices } from "../services";
import type { AuthenticatedRequest } from "../types";

export function buildScoresRouter(services: AppServices): Router {
  const router = Router();

  router.get(
    "/summary",
    requireAuth,
    requireRole("admin"),
    async (req: AuthenticatedRequest, res, next) => {
      try {
        const response = await services.scores.summary({ authUser: req.authUser! });
        res.status(200).json(response);
      } catch (error) {
        next(error);
      }
    }
  );

  router.get(
    "/:employee_id",
    requireAuth,
    requireRole("manager", "admin"),
    async (req: AuthenticatedRequest, res, next) => {
      try {
        const { employee_id } = parseOrThrow(scoreEmployeeIdParamSchema, req.params);
        const response = await services.scores.getByEmployee({
          authUser: req.authUser!,
          employeeId: employee_id
        });
        res.status(200).json(response);
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}
