import { createHash, createHmac } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

/**
 * Persistent media storage.
 *
 * 1. If Cloudinary credentials exist in the environment (CLOUDINARY_CLOUD_NAME,
 *    CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) every upload is pushed to the
 *    cloud and the returned secure_url is saved in PostgreSQL. This is the
 *    recommended setup for Render / Vercel / any ephemeral file system.
 * 2. Otherwise files are written to a durable data directory (UPLOAD_DIR,
 *    defaults to `.data/uploads` inside the project) and served through the
 *    `/api/file/[name]` route, so the URL stored in the DB always resolves.
 */

const EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "image/svg+xml": ".svg",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

export function uploadDir() {
  // A relative default is resolved from the app's working directory at runtime.
  // Avoid resolving it during the build, which makes Turbopack trace the whole project.
  return process.env.UPLOAD_DIR || ".data/uploads";
}

export function cloudinaryEnabled() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
  );
}

async function uploadToCloudinary(buffer: Buffer, filename: string): Promise<string> {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME!;
  const key = process.env.CLOUDINARY_API_KEY!;
  const secret = process.env.CLOUDINARY_API_SECRET!;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = process.env.CLOUDINARY_FOLDER || "milan-enterprises";
  const params = `folder=${folder}&public_id=${encodeURIComponent(filename)}&timestamp=${timestamp}`;
  const signature = createHash("sha1").update(params + secret).digest("hex");

  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(buffer)]), filename);
  form.append("api_key", key);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("public_id", filename);
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/auto/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed (${res.status}): ${text.slice(0, 200)}`);
  }
  const json = (await res.json()) as { secure_url?: string; url?: string };
  const url = json.secure_url || json.url;
  if (!url) throw new Error("Cloudinary did not return a URL");
  return url;
}

export async function saveUpload(file: File): Promise<{ url: string; storage: "cloudinary" | "disk"; name: string }> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = EXT[file.type] || path.extname(file.name || "").toLowerCase() || ".bin";
  const base = (file.name || "upload").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-").slice(0, 40);
  const stamp = Date.now().toString(36);
  const rand = createHmac("sha256", "me").update(`${base}${stamp}${Math.random()}`).digest("hex").slice(0, 6);
  const name = `${base || "file"}-${stamp}-${rand}${ext}`;

  if (cloudinaryEnabled()) {
    try {
      const url = await uploadToCloudinary(buffer, name.replace(ext, ""));
      return { url, storage: "cloudinary", name };
    } catch (err) {
      console.error("[upload] cloudinary failed, falling back to disk:", err);
    }
  }

  const dir = uploadDir();
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buffer);
  return { url: `/api/file/${name}`, storage: "disk", name };
}

export async function deleteUpload(url: string): Promise<void> {
  if (!url) return;
  if (url.startsWith("/api/file/")) {
    try {
      const { unlink } = await import("fs/promises");
      await unlink(path.join(uploadDir(), url.replace("/api/file/", "")));
    } catch {
      /* ignore */
    }
  }
}
