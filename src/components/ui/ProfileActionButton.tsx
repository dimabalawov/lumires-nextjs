"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/api/auth.client";
import { RelationshipStatus, RelationshipType, type UserProfile } from "@/types/profile";

export default function ProfileActionButton({ profile }: { profile: UserProfile }) {
    const router = useRouter();
    const [isFollowed, setIsFollowed] = useState(
        profile.outgoingRelationship?.type === RelationshipType.Follow &&
        profile.outgoingRelationship?.status === RelationshipStatus.Accepted
    );

    const desired = useRef(isFollowed);
    const serverFollowed = useRef(isFollowed);
    const syncing = useRef(false);

    const baseButton =
        "cursor-pointer border border-brand-gold w-full rounded-sm font-oswald font-normal uppercase tracking-[0.13em] text-[24px] py-4 hover:opacity-90 transition-opacity flex justify-center items-center";

    async function sync() {
        if (syncing.current) return;
        syncing.current = true;
        try {
            while (desired.current !== serverFollowed.current) {
                await apiRequest<void>(`/users/${profile.id}/follow`, {
                    method: "POST",
                    body: { targetUserId: profile.id },
                    auth: true,
                    cache: "no-store",
                });

                const nowFollowed = desired.current;
                serverFollowed.current = nowFollowed;
                setIsFollowed(nowFollowed);
                toast.success(nowFollowed ? "Following" : "Unfollowed");
            }
        } catch (e: any) {
            desired.current = serverFollowed.current;
            setIsFollowed(serverFollowed.current);

            if (e?.status === 401 || e?.status === 403) {
                router.push("/login");
                return;
            }
            if (e?.status === 404) toast.error("User not found.");
            else if (e?.status === 409) toast.error("Already following or blocked.");
            else toast.error("Something went wrong.");
        } finally {
            syncing.current = false;
        }
    }

    function handleFollow() {
        desired.current = !desired.current;
        setIsFollowed(desired.current);
        void sync();
    }

    if (profile.isMe) {
        return (
            <button type="button" className={`${baseButton} bg-brand-gold text-brand-dark gap-2.25`}>
                <Image src="/imgs/profile/edit.svg" alt="" width={24} height={24} />
                Edit profile
            </button>
        );
    }

    if (profile.outgoingRelationship?.type === RelationshipType.Block) {
        return <button className={`${baseButton} bg-brand-dark text-brand-gold`}>Unblock</button>;
    }

    if (
        profile.incomingRelationship?.type === RelationshipType.Follow &&
        profile.incomingRelationship?.status === RelationshipStatus.Accepted &&
        !isFollowed
    ) {
        return (
            <button onClick={handleFollow} className={`${baseButton} bg-brand-gold text-brand-dark`}>
                Follow back
            </button>
        );
    }

    return (
        <button
            onClick={handleFollow}
            className={`${baseButton} ${isFollowed ? "bg-brand-dark text-brand-gold" : "bg-brand-gold text-brand-dark"}`}
        >
            {isFollowed ? "Unfollow" : "Follow"}
        </button>
    );
}