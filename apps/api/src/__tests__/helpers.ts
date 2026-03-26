import { signAccessToken } from "../lib/jwt";

export function bearerTokenFor(input: { id: number; email: string; role: "employee" | "manager" | "admin" }) {
  return `Bearer ${signAccessToken(input)}`;
}
