import type { NextFunction, Response } from "express";

import type { UserRole } from "@workforce/shared";

import { AppError } from "../lib/errors";
import { verifyAccessToken } from "../lib/jwt";
import type { AuthenticatedRequest } from "../types";

export function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new AppError("Authentication is required.", 401);
    }

    const token = authorization.replace("Bearer ", "").trim();
    req.authUser = verifyAccessToken(token);
    next();
  } catch (error) {
    next(error);
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    try {
      if (!req.authUser) {
        throw new AppError("Authentication is required.", 401);
      }

      if (!roles.includes(req.authUser.role)) {
        throw new AppError("You do not have access to this resource.", 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
