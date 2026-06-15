import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { withProfileRetry } from "@/lib/auth/server";
import { followUser } from "@/lib/api/users";

export async function POST(req: Request) {
    const { targetUserId } = (await req.json().catch(() => ({}))) as {
        targetUserId?: string;
    };

    if (!targetUserId) {
        return NextResponse.json({ error: "targetUserId is required" }, { status: 400 });
    }

    try {
        await withProfileRetry(() => followUser(targetUserId));
        return NextResponse.json({ ok: true });
    } catch (e) {
        if (e instanceof ApiError) {
            return NextResponse.json({ error: e.message }, { status: e.status });
        }
        return NextResponse.json({ error: "Failed to follow user" }, { status: 500 });
    }
}