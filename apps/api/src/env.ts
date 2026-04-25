import { z } from "zod";

const connectionStringSchema = z
  .string()
  .min(1)
  .refine((value) => {
    try {
      const url = new URL(value);
      return ["postgres:", "postgresql:", "http:", "https:"].includes(url.protocol);
    } catch {
      return false;
    }
  }, "Invalid connection string");

const envSchema = z.object({
  API_PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: connectionStringSchema,
  JWT_SECRET: z.string().min(16),
  NEXTAUTH_SECRET: z.string().min(16),
  NEXTAUTH_URL: z.string().url(),
  WEB_APP_URL: z.string().url()
});

export const env = envSchema.parse({
  API_PORT: process.env.PORT ?? process.env.API_PORT ?? "4000",
  DATABASE_URL:
    process.env.DATABASE_URL ?? "postgresql://workforce:workforce@localhost:5433/workforce_intelligence",
  JWT_SECRET: process.env.JWT_SECRET ?? "development-jwt-secret",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? "development-nextauth-secret",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  WEB_APP_URL: process.env.WEB_APP_URL ?? "http://localhost:3000"
});
