import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { withProfileRetry } from "@/lib/auth/server";
import { saveList, unsaveList } from "@/lib/api/lists";

/** POST /api/lists/{id}/save — save a list for the current user. */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await withProfileRetry(() => saveList(id));
    return NextResponse.json({ isSaved: true });
  } catch (e) {
    return errorResponse(e, "Failed to save list");
  }
}

/** DELETE /api/lists/{id}/save — remove a list from the user's saved. */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await withProfileRetry(() => unsaveList(id));
    return NextResponse.json({ isSaved: false });
  } catch (e) {
    return errorResponse(e, "Failed to unsave list");
  }
}

function errorResponse(e: unknown, fallback: string) {
  if (e instanceof ApiError) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }
  console.error("[save list] route handler error:", e);
  return NextResponse.json(
    { error: e instanceof Error ? e.message : fallback },
    { status: 500 },
  );
}
