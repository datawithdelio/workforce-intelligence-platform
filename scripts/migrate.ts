import fs from "node:fs/promises";
import path from "node:path";

import { Client } from "pg";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url()
});

const env = envSchema.parse({
  DATABASE_URL:
    process.env.DATABASE_URL ?? "postgresql://workforce:workforce@localhost:5433/workforce_intelligence"
});

async function main() {
  const migrationsDir = path.resolve(
    "/Users/deliorincon/Desktop/pipeline/workforce-intelligence-platform/packages/db/migrations"
  );
  const files = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort((left, right) => left.localeCompare(right));

  const client = new Client({
    connectionString: env.DATABASE_URL
  });

  await client.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename TEXT NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const existingRows = await client.query<{ filename: string }>(
      "SELECT filename FROM schema_migrations ORDER BY filename ASC;"
    );
    const applied = new Set(existingRows.rows.map((row) => row.filename));

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`Skipping already applied migration: ${file}`);
        continue;
      }

      const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");
      console.log(`Applying migration: ${file}`);
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (filename) VALUES ($1);", [file]);
      await client.query("COMMIT");
    }

    console.log("Database migrations complete.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("Migration failed", error);
  process.exit(1);
});
