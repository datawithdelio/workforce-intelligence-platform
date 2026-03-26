import type { Request } from "express";

import type { AuthUser } from "@workforce/shared";

export interface AuthenticatedRequest extends Request {
  authUser?: AuthUser;
}
