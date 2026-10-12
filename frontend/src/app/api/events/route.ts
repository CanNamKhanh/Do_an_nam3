import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/http/server";

export const dynamic = "force-dynamic";

/** Proxy: lấy lịch công khai từ backend Express (/events/public). */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  try {
    const { data } = await backendClient.get<unknown>("/events/public", {
      params: { from: searchParams.get("from"), to: searchParams.get("to") },
    });
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Không lấy được lịch sự kiện" },
      { status: 502 },
    );
  }
}
