/**
 * Applies Drizzle migrations in a fully non-interactive way.
 *
 * We deliberately avoid `drizzle-kit migrate` for the Render deploy: it renders
 * an interactive hanji spinner that misbehaves without a TTY, and on a database
 * whose tables were created earlier (e.g. by a previous push-based deploy) the
 * initial CREATE TABLE migration would fail. Instead we:
 *   1. Check which migrations are recorded in drizzle.__drizzle_migrations.
 *   2. If the schema already exists but no migration is recorded (push-created
 *      databases), we mark the existing baseline migration as applied.
 *   3. Any genuinely pending migrations are applied with
 *      drizzle-orm's migrate(), which is idempotent and non-interactive.
 */
import { Client } from "pg";
import { createHash } from "crypto";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import "dotenv/config";

const migrationsFolder = "drizzle";
const journal = JSON.parse(readFileSync(join(migrationsFolder, "meta", "_journal.json"), "utf8"));

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");

  const client = new Client({ connectionString: url });
  await client.connect();

  // Ensure the migration log table exists (same DDL drizzle-orm creates).
  await client.query(`CREATE SCHEMA IF NOT EXISTS drizzle`);
  await client.query(`CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
    id SERIAL PRIMARY KEY,
    hash TEXT NOT NULL,
    created_at BIGINT
  )`);

  const { rows } = await client.query("SELECT hash FROM drizzle.__drizzle_migrations");
  const applied = new Set(rows.map((r) => r.hash));

  // Build the hash for each migration the same way drizzle-orm does.
  const pending = [];
  const existingTables = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
  );
  const tableSet = new Set(existingTables.rows.map((r) => r.table_name));

  for (const entry of journal.entries) {
    const file = join(migrationsFolder, `${entry.tag}.sql`);
    if (!existsSync(file)) continue;
    const sqlText = readFileSync(file, "utf8");
    const hash = createHash("sha256").update(sqlText).digest("hex");
    if (applied.has(hash)) continue;

    // Baseline: tables already exist (push-created DB) -> record, don't re-run.
    const creates = [...sqlText.matchAll(/CREATE TABLE\s+"?([\w]+)"?/g)].map((m) => m[1]);
    const alreadyThere = creates.length > 0 && creates.every((t) => tableSet.has(t));
    if (alreadyThere) {
      console.log(`[migrate] ${entry.tag}: tables already exist, marking as applied`);
      await client.query(
        "INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)",
        [hash, Date.now()]
      );
      applied.add(hash);
      continue;
    }
    pending.push({ tag: entry.tag, sql: sqlText, hash });
  }

  if (pending.length) {
    const { drizzle } = await import("drizzle-orm/node-postgres");
    const { migrate } = await import("drizzle-orm/node-postgres/migrator");
    const { Pool } = await import("pg");
    const pool = new Pool({ connectionString: url });
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder });
    await pool.end();
    console.log(`[migrate] applied ${pending.length} pending migration(s)`);
  } else {
    console.log("[migrate] schema up to date");
  }

  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("[migrate] failed:", err);
  process.exit(1);
});
