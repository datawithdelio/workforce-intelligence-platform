import type { NextFunction, Request, Response } from "express";

import { AppError } from "../lib/errors";

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      details: error.details ?? null
    });
    return;
  }

  res.status(500).json({
    message: "An unexpected server error occurred."
  });
}
