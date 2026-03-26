import jwt from "jsonwebtoken";

import type { AuthUser } from "@workforce/shared";

import { env } from "../env";

const tokenExpiry = "12h";

export function signAccessToken(user: AuthUser): string {
  return jwt.sign(user, env.JWT_SECRET, { expiresIn: tokenExpiry });
}

export function verifyAccessToken(token: string): AuthUser {
  return jwt.verify(token, env.JWT_SECRET) as AuthUser;
}
