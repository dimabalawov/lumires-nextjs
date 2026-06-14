import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { withProfileRetry } from "@/lib/auth/server";
import { addFilmToList, removeFilmFromList } from "@/lib/api/lists";

type Params = { params: Promise<{ id: string; filmId: string }> };

/** POST /api/lists/{id}/films/{filmId} — add a film to the current user's list. */
export async function POST(_req: Request, { params }: Params) {
  const { id, filmId } = await params;
  try {
    const result = await withProfileRetry(() => addFilmToList(id, Number(filmId)));
    return NextResponse.json(result ?? { containsFilm: true });
  } catch (e) {
    return errorResponse(e, "add film to list");
  }
}

/** DELETE /api/lists/{id}/films/{filmId} — remove a film from the current user's list. */
export async function DELETE(_req: Request, { params }: Params) {
  const { id, filmId } = await params;
  try {
    const result = await withProfileRetry(() => removeFilmFromList(id, Number(filmId)));
    return NextResponse.json(result ?? { containsFilm: false });
  } catch (e) {
    return errorResponse(e, "remove film from list");
  }
}

function errorResponse(e: unknown, action: string) {
  if (e instanceof ApiError) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }
  console.error(`[${action}] route handler error:`, e);
  return NextResponse.json(
    { error: e instanceof Error ? e.message : `Failed to ${action}` },
    { status: 500 },
  );
}
