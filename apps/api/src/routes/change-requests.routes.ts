import { Router } from "express";

import { changeRequestIdParamSchema, changeRequestReviewSchema } from "@workforce/shared";

import { parseOrThrow } from "../lib/validation";
import { requireAuth, requireRole } from "../middleware/auth";
import type { AppServices } from "../services";
import type { AuthenticatedRequest } from "../types";

export function buildChangeRequestsRouter(services: AppServices): Router {
  const router = Router();

  router.get("/", requireAuth, requireRole("manager", "admin"), async (req: AuthenticatedRequest, res, next) => {
    try {
      const response = await services.changeRequests.list({ authUser: req.authUser! });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", requireAuth, requireRole("manager", "admin"), async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = parseOrThrow(changeRequestIdParamSchema, req.params);
      const response = await services.changeRequests.getById({
        authUser: req.authUser!,
        id
      });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.post(
    "/:id/approve",
    requireAuth,
    requireRole("manager", "admin"),
    async (req: AuthenticatedRequest, res, next) => {
      try {
        const { id } = parseOrThrow(changeRequestIdParamSchema, req.params);
        const { notes } = parseOrThrow(changeRequestReviewSchema, req.body ?? {});
        const response = await services.changeRequests.approve({
          authUser: req.authUser!,
          id,
          notes
        });
        res.status(200).json(response);
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    "/:id/reject",
    requireAuth,
    requireRole("manager", "admin"),
    async (req: AuthenticatedRequest, res, next) => {
      try {
        const { id } = parseOrThrow(changeRequestIdParamSchema, req.params);
        const { notes } = parseOrThrow(changeRequestReviewSchema, req.body ?? {});
        const response = await services.changeRequests.reject({
          authUser: req.authUser!,
          id,
          notes
        });
        res.status(200).json(response);
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}
