import { NextRequest, NextResponse } from "next/server";
import { HttpError, requireResource } from "@/lib/auth";
import { saveUpload } from "@/lib/upload";
import { logActivity } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 12 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const session = await requireResource("machines");
    const form = await req.formData();
    const files = form.getAll("files").filter((f): f is File => f instanceof File);
    if (!files.length) {
      const single = form.get("file");
      if (single instanceof File) files.push(single);
    }
    if (!files.length) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const results: { url: string; storage: string; name: string }[] = [];
    for (const file of files.slice(0, 12)) {
      if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: `${file.name} is larger than 12 MB` }, { status: 413 });
      }
      const ok = /^(image|video)\//.test(file.type);
      if (!ok) return NextResponse.json({ error: `${file.name}: only images and videos are allowed` }, { status: 415 });
      results.push(await saveUpload(file));
    }
    await logActivity(session.name, "uploaded media", "uploads", `${results.length} file(s)`);
    return NextResponse.json({ data: results, url: results[0]?.url });
  } catch (err) {
    const e = err as HttpError;
    return NextResponse.json({ error: e.message || "Upload failed" }, { status: e.status || 500 });
  }
}
