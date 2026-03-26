import { Router } from "express";

import { changeRequestIdParamSchema } from "@workforce/shared";

import { parseOrThrow } from "../lib/validation";
import { requireAuth } from "../middleware/auth";
import type { AppServices } from "../services";
import type { AuthenticatedRequest } from "../types";

export function buildNotificationsRouter(services: AppServices): Router {
  const router = Router();

  router.get("/", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      const response = await services.notifications.list({ authUser: req.authUser! });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.post("/:id/read", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = parseOrThrow(changeRequestIdParamSchema, req.params);
      const response = await services.notifications.markRead({
        authUser: req.authUser!,
        id
      });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
