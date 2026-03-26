import type { ZodSchema } from "zod";

import { AppError } from "./errors";

export function parseOrThrow<T>(schema: ZodSchema<T>, input: unknown): T {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw new AppError("Request validation failed.", 400, result.error.flatten());
  }

  return result.data;
}
