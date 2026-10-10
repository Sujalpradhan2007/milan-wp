import { NextRequest, NextResponse } from "next/server";
import { createReadStream, existsSync, statSync } from "fs";
import { basename, extname, join } from "path";
import { uploadDir } from "@/lib/upload";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp",
  ".gif": "image/gif", ".avif": "image/avif", ".svg": "image/svg+xml",
  ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime",
};

export async function GET(_req: NextRequest, ctx: { params: Promise<{ name: string }> }) {
  const { name } = await ctx.params;
  const safe = basename(name);
  // Keep the literal "uploads" segment so Turbopack does not trace the whole
  // project through the path helper (same directory as src/lib/upload.ts).
  const full = join(/* turbopackIgnore: true */ uploadDir(), "uploads", safe);
  if (!existsSync(full) || !statSync(full).isFile()) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
  const ext = extname(safe).toLowerCase();
  const stream = createReadStream(full);
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      stream.on("data", (chunk) => controller.enqueue(new Uint8Array(chunk as Buffer)));
      stream.on("end", () => controller.close());
      stream.on("error", (e) => controller.error(e));
    },
    cancel() { stream.destroy(); },
  });
  return new Response(body, {
    headers: {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
