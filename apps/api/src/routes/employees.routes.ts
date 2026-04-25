import { Router } from "express";

import {
  adminEmployeeCreateSchema,
  employeeIdParamSchema,
  employeeUpdateSchema,
  paginationSchema
} from "@workforce/shared";

import { parseOrThrow } from "../lib/validation";
import { requireAuth, requireRole } from "../middleware/auth";
import type { AppServices } from "../services";
import type { AuthenticatedRequest } from "../types";

export function buildEmployeesRouter(services: AppServices): Router {
  const router = Router();

  router.get("/", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      const input = parseOrThrow(paginationSchema, req.query);
      const response = await services.employees.list({
        authUser: req.authUser!,
        page: input.page ?? 1,
        pageSize: input.pageSize ?? 10,
        search: input.search,
        department: input.department
      });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = parseOrThrow(employeeIdParamSchema, req.params);
      const response = await services.employees.getById({
        authUser: req.authUser!,
        employeeId: id
      });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.post("/", requireAuth, requireRole("admin"), async (req: AuthenticatedRequest, res, next) => {
    try {
      const input = parseOrThrow(adminEmployeeCreateSchema, req.body);
      const response = await services.employees.create({
        authUser: req.authUser!,
        input: {
          ...input,
          role: input.role || "employee"
        }
      });
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = parseOrThrow(employeeIdParamSchema, req.params);
      const updates = parseOrThrow(employeeUpdateSchema, req.body);
      const response = await services.employees.update({
        authUser: req.authUser!,
        employeeId: id,
        updates
      });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id/history", requireAuth, async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = parseOrThrow(employeeIdParamSchema, req.params);
      const response = await services.employees.history({
        authUser: req.authUser!,
        employeeId: id
      });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:id", requireAuth, requireRole("admin"), async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = parseOrThrow(employeeIdParamSchema, req.params);
      const response = await services.employees.delete({
        authUser: req.authUser!,
        employeeId: id
      });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
