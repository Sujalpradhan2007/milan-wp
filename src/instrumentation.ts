export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  try {
    const [{ db }, { migrate }, path] = await Promise.all([
      import("@/db"),
      import("drizzle-orm/node-postgres/migrator"),
      import("path"),
    ]);
    await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  } catch (err) {
    console.error("[instrumentation] database migration skipped:", err);
  }
  try {
    const { seedDatabase } = await import("@/lib/seed");
    await seedDatabase();
  } catch (err) {
    console.error("[instrumentation] seed skipped:", err);
  }
  try {
    const { upgradeCatalogue } = await import("@/lib/catalogue");
    await upgradeCatalogue();
  } catch (err) {
    console.error("[instrumentation] catalogue upgrade skipped:", err);
  }
}
