export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
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
