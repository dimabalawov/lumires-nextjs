"use client"

import BlockedError from "@/components/errors/BlockedError";
import UnexpectedError from "@/components/errors/UnexpectedError";

export default function Error({ error }: { error: any }) {
    if (error?.status === 403 || error?.message === "Blocked") {
        return <BlockedError error={error} />;
    }

    return <UnexpectedError error={error} />
}
