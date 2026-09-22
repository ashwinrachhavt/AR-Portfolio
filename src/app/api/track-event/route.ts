import { track } from "@vercel/analytics/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { event, data } = payload as { event?: string; data?: Record<string, unknown> };
    if (event) {
      // Forward the custom event to Vercel analytics
      // Vercel analytics expects property values of type string | number | boolean | null
      const safeData = data as Record<string, string | number | boolean | null>;
      track(event, safeData ?? {});
    }
    return NextResponse.json({ status: "acknowledged" });
  } catch (error) {
    console.error("Analytics route error:", error);
    return NextResponse.json({ status: "error", error: (error as any).message }, { status: 400 });
  }
}
