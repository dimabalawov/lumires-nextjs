"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/api/auth.client";
import { RelationshipStatus, RelationshipType, type UserProfile } from "@/types/profile";

export default function ProfileActionButton({
    profile,
    onRelationshipChange,
}: {
    profile: UserProfile;
    onRelationshipChange?: (state: { following: boolean; blocked: boolean }) => void;
}) {
    const router = useRouter();

    const [isFollowed, setIsFollowed] = useState(
        profile.outgoingRelationship?.type === RelationshipType.Follow &&
        profile.outgoingRelationship?.status === RelationshipStatus.Accepted
    );
    const [isBlocked, setIsBlocked] = useState(
        profile.outgoingRelationship?.type === RelationshipType.Block
    );

    const desired = useRef(isFollowed);
    const serverFollowed = useRef(isFollowed);
    const syncing = useRef(false);

    const baseButton =
        "cursor-pointer px-[14px] text-[11px] py-[7px] border border-brand-gold w-full rounded-xl font-manrope font-semibold uppercase tracking-[0.13em] hover:opacity-90 transition-opacity flex justify-center items-center gap-2";


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
                serverFollowed.current = desired.current;
                setIsFollowed(desired.current);
                toast.success(desired.current ? "Following" : "Unfollowed");
            }
        } catch (e: any) {
            desired.current = serverFollowed.current;
            setIsFollowed(serverFollowed.current);
            onRelationshipChange?.({ following: serverFollowed.current, blocked: isBlocked });

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
        const next = !desired.current;
        desired.current = next;
        setIsFollowed(next);
        onRelationshipChange?.({ following: next, blocked: isBlocked });
        void sync();
    }


    async function handleUnblock() {
        setIsBlocked(false);
        onRelationshipChange?.({ following: isFollowed, blocked: false });
        try {
            await apiRequest<void>(`/users/${profile.id}/block`, {
                method: "DELETE",
                auth: true,
                cache: "no-store",
            });
            toast.success("Unblocked");
        } catch (e: any) {
            // Roll back
            setIsBlocked(true);
            onRelationshipChange?.({ following: isFollowed, blocked: true });

            if (e?.status === 401 || e?.status === 403) {
                router.push("/login");
                return;
            }
            toast.error("Couldn't unblock.");
        }
    }

    if (profile.isMe) {
        return (
            <button type="button" className={`${baseButton} bg-brand-gold text-brand-dark`}>
                Edit profile
                <Image src="/imgs/profile/edit.svg" alt="" width={12} height={12} />
            </button>
        );
    }

    if (isBlocked) {
        return (
            <button
                type="button"
                onClick={handleUnblock}
                className={`${baseButton} bg-brand-dark text-brand-gold`}
            >
                Unblock
            </button>
        );
    }

    const followedBack =
        profile.incomingRelationship?.type === RelationshipType.Follow &&
        profile.incomingRelationship?.status === RelationshipStatus.Accepted &&
        !isFollowed;

    if (followedBack) {
        return (
            <button
                type="button"
                onClick={handleFollow}
                className={`${baseButton} bg-brand-gold text-brand-dark`}
            >
                Follow back
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={handleFollow}
            className={`${baseButton} ${isFollowed ? "bg-brand-dark text-brand-gold" : "bg-brand-gold text-brand-dark"}`}
        >
            {isFollowed ? "× Unfollow" : "+ Follow"}
        </button>
    );
}