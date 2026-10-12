import { NextResponse } from "next/server";
import { fetchDisplayFromBackend } from "@/services/backend.service";

export const dynamic = "force-dynamic";

/** Proxy: trình duyệt gọi /api/display, server Next gọi backend :8000. */
export async function GET() {
  try {
    return NextResponse.json(await fetchDisplayFromBackend(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Không kết nối được backend" }, { status: 502 });
  }
}
