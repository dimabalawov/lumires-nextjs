import { NextResponse, type NextRequest } from "next/server";
import { ApiError } from "@/lib/api/client";
import { withProfileRetry } from "@/lib/api/auth";
import { likeReviewComment } from "@/lib/api/reviews";

/** POST /api/reviews/{reviewId}/replies/{replyId}/like — toggle like on a reply. */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string; replyId: string }> },
) {
  const { reviewId, replyId } = await params;
  const { filmId = "-", slug = "-" } = await req.json().catch(() => ({}));

  try {
    const result = await withProfileRetry(() => likeReviewComment(filmId, reviewId, replyId, slug));
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    console.error("[like reply] route handler error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to like reply" },
      { status: 500 },
    );
  }
}
