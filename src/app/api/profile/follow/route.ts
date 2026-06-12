import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { withProfileRetry } from "@/lib/auth/server";
import { followUser } from "@/lib/api/users";

export async function POST(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        await withProfileRetry(() => followUser(id));
        return NextResponse.json({ ok: true });
    } catch (e) {
        if (e instanceof ApiError) {
            return NextResponse.json({ error: e.message }, { status: e.status });
        }
        return NextResponse.json({ error: "Failed to follow user" }, { status: 500 });
    }
}