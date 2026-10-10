export async function register() {
  // Keep Node-only database code out of Edge bundles. Schema migrations run in
  // Render's start command before the server accepts traffic.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation-node");
  }
}
