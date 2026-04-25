import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
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
  DATABASE_URL: connectionStringSchema
});

const env = envSchema.parse({
  DATABASE_URL:
    process.env.DATABASE_URL ?? "postgresql://workforce:workforce@localhost:5433/workforce_intelligence"
});

export const pool = new Pool({
  connectionString: env.DATABASE_URL
});

export const db = drizzle(pool);
