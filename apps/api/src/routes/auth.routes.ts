import { Router } from "express";

import { loginRequestSchema, registerRequestSchema } from "@workforce/shared";

import { parseOrThrow } from "../lib/validation";
import { requireAuth } from "../middleware/auth";
import type { AppServices } from "../services";
import type { AuthenticatedRequest } from "../types";

export function buildAuthRouter(services: AppServices): Router {
  const router = Router();

  router.post("/login", async (req, res, next) => {
    try {
      const input = parseOrThrow(loginRequestSchema, req.body);
      const response = await services.auth.login(input);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.post("/register", async (req, res, next) => {
    try {
      const input = parseOrThrow(registerRequestSchema, req.body);
      const response = await services.auth.register(input);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.post("/logout", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      const response = await services.auth.logout(req.authUser!);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get("/me", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      const response = await services.auth.me(req.authUser!);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
