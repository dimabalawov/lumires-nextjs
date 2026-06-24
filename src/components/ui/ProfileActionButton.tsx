"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/api/auth.client";
import { RelationshipStatus, RelationshipType, type UserProfile } from "@/types/profile";
import Link from "next/link";

function ShareIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
            <path d="M12 3v13M8 7l4-4 4 4" />
        </svg>
    );
}
function CopyIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
    );
}
function MuteIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M11 5 6 9H3v6h3l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
    );
}
function BlockIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" />
        </svg>
    );
}
function ReportIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="8" x2="12" y2="12.5" />
            <line x1="12" y1="16" x2="12" y2="16" />
        </svg>
    );
}
function DotsIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
            <circle cx="12" cy="5" r="1.7" />
            <circle cx="12" cy="12" r="1.7" />
            <circle cx="12" cy="19" r="1.7" />
        </svg>
    );
}

function MenuItem({
    label,
    icon,
    danger,
    onClick,
}: {
    label: string;
    icon: React.ReactNode;
    danger?: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex w-full items-center justify-between gap-6 rounded-lg px-3 py-2 text-left font-manrope text-[13.5px] transition-colors hover:bg-white/[0.06] ${danger ? "text-brand-danger" : "text-brand-light"
                }`}
        >
            <span>{label}</span>
            <span className={danger ? "text-brand-danger" : "text-brand-muted"}>{icon}</span>
        </button>
    );
}

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
    const [isMuted, setIsMuted] = useState<boolean>(
        (profile as { isMuted?: boolean }).isMuted ?? false
    );

    const [menuOpen, setMenuOpen] = useState(false);
    const wrapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!menuOpen) return;
        const onDown = (e: MouseEvent) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [menuOpen]);

    const baseButton =
        "cursor-pointer px-[14px] text-[11px] py-[7px] border border-profile-accent rounded-xl font-manrope font-semibold uppercase tracking-[0.13em] hover:opacity-90 transition-opacity flex justify-center items-center gap-2";


    async function handleFollow() {
        const next = !isFollowed;

        setIsFollowed(next);
        onRelationshipChange?.({
            following: next,
            blocked: isBlocked,
        });

        try {
            await apiRequest<void>(
                `/users/${profile.id}/${next ? "follow" : "unfollow"}`,
                {
                    method: "POST",
                    body: { targetUserId: profile.id },
                    auth: true,
                    cache: "no-store",
                }
            );

            toast.success(next ? "Following" : "Unfollowed");
        } catch (e: any) {
            setIsFollowed(!next);

            onRelationshipChange?.({
                following: !next,
                blocked: isBlocked,
            });

            if (e?.status === 401 || e?.status === 403) {
                router.push("/login");
                return;
            }

            if (e?.status === 404) {
                toast.error("User not found.");
            } else {
                toast.error("Something went wrong.");
            }
        }
    }

    async function handleBlock() {
        setMenuOpen(false);
        setIsBlocked(true);
        setIsFollowed(false);
        onRelationshipChange?.({ following: false, blocked: true });
        try {
            await apiRequest<void>(`/users/${profile.id}/block`, {
                method: "POST",
                body: { targetUserId: profile.id },
                auth: true,
                cache: "no-store",
            });
            toast.success("Blocked");
            window.location.reload();
        } catch (e: any) {
            setIsBlocked(false);
            onRelationshipChange?.({ following: isFollowed, blocked: false });
            if (e?.status === 401 || e?.status === 403) {
                router.push("/login");
                return;
            }
            toast.error("Couldn't block.");
        }
    }

    async function handleUnblock() {
        setMenuOpen(false);
        setIsBlocked(false);
        onRelationshipChange?.({ following: isFollowed, blocked: false });
        try {
            await apiRequest<void>(`/users/${profile.id}/unblock`, {
                method: "POST",
                auth: true,
                body: {},
                cache: "no-store",
            });
            toast.success("Unblocked");
            window.location.reload();
        } catch (e: any) {
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
            <Link href="/settings" className={`${baseButton} w-full bg-profile-accent text-brand-dark`}>
                Edit profile
                <Image src="/imgs/profile/edit.svg" alt="" width={12} height={12} />
            </Link>
        );
    }

    const followedBack =
        profile.incomingRelationship?.type === RelationshipType.Follow &&
        profile.incomingRelationship?.status === RelationshipStatus.Accepted &&
        !isFollowed;

    let mainButton: React.ReactNode;
    if (isBlocked) {
        mainButton = (
            <button type="button" onClick={handleUnblock} className={`${baseButton} w-full bg-brand-dark text-profile-accent`}>
                Unblock
            </button>
        );
    } else if (followedBack) {
        mainButton = (
            <button type="button" onClick={handleFollow} className={`${baseButton} w-full bg-profile-accent text-brand-dark`}>
                Follow back
            </button>
        );
    } else {
        mainButton = (
            <button
                type="button"
                onClick={handleFollow}
                className={`${baseButton} w-full ${isFollowed ? "bg-brand-dark text-profile-accent" : "bg-profile-accent text-brand-dark"}`}
            >
                {isFollowed ? "× Unfollow" : "+ Follow"}
            </button>
        );
    }

    return (
        <div ref={wrapRef} className="relative flex w-full items-stretch gap-2">
            <div className="flex-1">{mainButton}</div>

            {/* kebab trigger */}
            <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="More options"
                className="cursor-pointer flex shrink-0 items-center justify-center rounded-xl border border-profile-accent bg-profile-accent px-3 text-brand-dark transition-opacity hover:opacity-90"
            >
                <DotsIcon />
            </button>

            {menuOpen && (
                <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 rounded-xl border border-white/10 bg-[#1a1714] p-1.5 shadow-2xl"
                >
                    {isBlocked ? (
                        <MenuItem label="unblock user" icon={<BlockIcon />} onClick={handleUnblock} />
                    ) : (
                        <MenuItem label="block user" icon={<BlockIcon />} danger onClick={handleBlock} />
                    )}
                </div>
            )}
        </div>
    );
}