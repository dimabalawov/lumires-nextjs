import { NextResponse, type NextRequest } from "next/server";
import { ApiError } from "@/lib/api/client";
import { withProfileRetry } from "@/lib/auth/server";
import { followUser } from "@/lib/api/users";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const result = await withProfileRetry(() => followUser(id));
    return NextResponse.json(result ?? { ok: true });
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    console.error("[follow user] route handler error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to follow user" },
      { status: 500 },
    );
  }
}