import { Router } from "express";

import type { AppServices } from "../services";
import { buildAdminRouter } from "./admin.routes";
import { buildAuthRouter } from "./auth.routes";
import { buildChangeRequestsRouter } from "./change-requests.routes";
import { buildDashboardRouter } from "./dashboard.routes";
import { buildEmployeesRouter } from "./employees.routes";
import { buildNotificationsRouter } from "./notifications.routes";
import { buildScoresRouter } from "./scores.routes";

export function buildApiRouter(services: AppServices): Router {
  const router = Router();

  router.use("/auth", buildAuthRouter(services));
  router.use("/employees", buildEmployeesRouter(services));
  router.use("/change-requests", buildChangeRequestsRouter(services));
  router.use("/dashboard", buildDashboardRouter(services));
  router.use("/notifications", buildNotificationsRouter(services));
  router.use("/scores", buildScoresRouter(services));
  router.use("/admin", buildAdminRouter(services));

  return router;
}
