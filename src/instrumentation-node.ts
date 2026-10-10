import { seedDatabase } from "@/lib/seed";
import { upgradeCatalogue } from "@/lib/catalogue";

// This module is loaded only by the Node.js instrumentation entry point.
// Keep seeding idempotent: it creates starter data only on an empty database.
try {
  await seedDatabase();
} catch (err) {
  console.error("[instrumentation] seed skipped:", err);
}

try {
  await upgradeCatalogue();
} catch (err) {
  console.error("[instrumentation] catalogue upgrade skipped:", err);
}
