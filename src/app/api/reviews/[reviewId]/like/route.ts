import { NextResponse, type NextRequest } from "next/server";
import { ApiError } from "@/lib/api/client";
import { withProfileRetry } from "@/lib/api/auth";
import { likeReview } from "@/lib/api/reviews";

/** POST /api/reviews/{reviewId}/like — toggle the current user's like on a review. */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> },
) {
  const { reviewId } = await params;
  const { filmId = "-", slug = "-" } = await req.json().catch(() => ({}));

  try {
    const result = await withProfileRetry(() => likeReview(filmId, reviewId, slug));
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    console.error("[like review] route handler error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to like review" },
      { status: 500 },
    );
  }
}
