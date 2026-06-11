import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { withProfileRetry } from "@/lib/auth/server";
import { likeFilm } from "@/lib/api/films";

/** POST /api/films/{id}/like - toggle the current user's like on a film. */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const result = await withProfileRetry(() => likeFilm(id));
    return NextResponse.json(result ?? { ok: true });
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    console.error("[like film] route handler error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to like film" },
      { status: 500 },
    );
  }
}
