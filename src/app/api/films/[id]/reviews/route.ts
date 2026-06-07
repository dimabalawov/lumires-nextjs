import { NextResponse, type NextRequest } from "next/server";
import { ApiError } from "@/lib/api/client";
import { withProfileRetry } from "@/lib/api/auth";
import { createReview } from "@/lib/api/reviews";

/** POST /api/films/{id}/reviews — publish a review for a film as the current user. */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const {
    title = null,
    text,
    rating = null,
    isSpoilerFree = false,
    slug = "-",
  } = await req.json().catch(() => ({}));

  if (typeof text !== "string" || text.trim() === "") {
    return NextResponse.json({ error: "Review text is required" }, { status: 400 });
  }

  try {
    await withProfileRetry(() =>
      createReview(Number(id), { title, text, rating, isSpoilerFree }, slug),
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    console.error("[create review] route handler error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create review" },
      { status: 500 },
    );
  }
}
