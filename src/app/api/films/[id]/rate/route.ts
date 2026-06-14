import { NextResponse, type NextRequest } from "next/server";
import { ApiError } from "@/lib/api/client";
import { withProfileRetry } from "@/lib/auth/server";
import { rateFilm, unrateFilm } from "@/lib/api/films";

/** POST /api/films/{id}/rate — set the current user's rating (0–5, half steps).
 * A rating of 0/null clears it via the upstream unrate endpoint. */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { rating } = await req.json().catch(() => ({}));

  if (rating != null && (typeof rating !== "number" || rating < 0 || rating > 5)) {
    return NextResponse.json({ error: "Rating must be between 0 and 5" }, { status: 400 });
  }

  try {
    await withProfileRetry(() =>
      rating && rating > 0 ? rateFilm(Number(id), rating) : unrateFilm(Number(id)),
    );
    return NextResponse.json({ ok: true, rating: rating ?? null });
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    console.error("[rate film] route handler error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to rate film" },
      { status: 500 },
    );
  }
}
