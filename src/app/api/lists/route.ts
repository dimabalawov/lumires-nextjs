import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { withProfileRetry } from "@/lib/api/auth";
import { createFilmsList } from "@/lib/api/lists";
import type { CreateFilmsListCommand } from "@/types/api";

/** POST /api/lists — create a new film list for the current user. */
export async function POST(req: Request) {
  let payload: Partial<CreateFilmsListCommand>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const filmIds = Array.isArray(payload.filmIds)
    ? payload.filmIds.filter((n): n is number => typeof n === "number")
    : [];

  if (title.length < 5) {
    return NextResponse.json(
      { error: "Title must be at least 5 characters." },
      { status: 400 },
    );
  }
  if (filmIds.length < 1) {
    return NextResponse.json(
      { error: "Add at least one film to the list." },
      { status: 400 },
    );
  }

  const command: CreateFilmsListCommand = {
    title,
    description:
      typeof payload.description === "string" && payload.description.trim()
        ? payload.description.trim()
        : null,
    isPrivate: Boolean(payload.isPrivate),
    filmIds,
  };

  try {
    const result = await withProfileRetry(() => createFilmsList(command));
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    console.error("[create list] route handler error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create list" },
      { status: 500 },
    );
  }
}
