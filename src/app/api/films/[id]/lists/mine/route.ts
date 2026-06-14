import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { withProfileRetry } from "@/lib/auth/server";
import { getMyListsForFilm } from "@/lib/api/lists";

/** GET /api/films/{id}/lists/mine — the current user's lists, each flagged with
 * whether this film is already in it. Powers the Add-to-list modal. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const result = await withProfileRetry(() => getMyListsForFilm(Number(id)));
    return NextResponse.json(result ?? { lists: [] });
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    console.error("[my lists for film] route handler error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load your lists" },
      { status: 500 },
    );
  }
}
