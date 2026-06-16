"use client";

import { getFriends } from "@/lib/api/users.client";
import { FriendItem } from "@/types/profile";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

const TABS = [
  { key: "followers", label: "Followers" },
  { key: "followings", label: "Followings" },
  { key: "friends", label: "Friends" },
] as const;

type ModalTab = (typeof TABS)[number]["key"];

interface MemberItem {
  userId: string;
  username: string;
  avatarUrl: string | null;
  followersCount: number;
  isFollower: boolean;
  isFollowing: boolean;
}

interface FollowersModalProps {
  username: string;
  initialTab: ModalTab;
  onClose: () => void;
}

function buildMembers(friends: FriendItem[]): MemberItem[] {
  const map = new Map<string, MemberItem>();
  for (const f of friends) {
    const isFollower = f.otherUserId === f.sourceUserId;
    const isFollowing = f.otherUserId === f.targetUserId;
    const existing = map.get(f.otherUserId);
    if (existing) {
      existing.isFollower ||= isFollower;
      existing.isFollowing ||= isFollowing;
    } else {
      map.set(f.otherUserId, {
        userId: f.otherUserId,
        username: f.username,
        avatarUrl: f.avatarUrl ?? null,
        followersCount: f.followerCount,
        isFollower,
        isFollowing,
      });
    }
  }
  return [...map.values()];
}

export default function FollowersModal({ username, initialTab, onClose }: FollowersModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>(initialTab);
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ followers: 0, followings: 0, friends: 0 });
  const [isMe, setIsMe] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await getFriends(username);
        if (!cancelled) {
          setMembers(buildMembers(res.friends ?? []));
          setCounts({
            followers: res.totalFollowers,
            followings: res.totalFollowings,
            friends: res.totalFriends,
          });
          setIsMe(res.isMe);
        }
      } catch (err) {
        if (!cancelled) {
          setMembers([]);
          setCounts({ followers: 0, followings: 0, friends: 0 });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [username]);

  const filtered = useMemo(() => {
    const byTab = members.filter((m) => {
      if (activeTab === "followers") return m.isFollower;
      if (activeTab === "followings") return m.isFollowing;
      return m.isFollower && m.isFollowing; // friends
    });
    const q = search.toLowerCase();
    return q ? byTab.filter((m) => m.username.toLowerCase().includes(q)) : byTab;
  }, [members, activeTab, search]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-[440px] max-h-[80vh] flex flex-col rounded-2xl border border-brand-gold/20 bg-brand-dark overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-gold/15">
          <span className="font-oswald font-light uppercase text-brand-gold text-[14px] tracking-[0.1em]">
            {username}
          </span>
          <button
            onClick={onClose}
            className="text-brand-muted hover:text-brand-light cursor-pointer transition-colors"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-brand-gold/15">
          {TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={[
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-oswald text-[13px] uppercase tracking-[0.04em] transition-colors cursor-pointer",
                  isActive
                    ? "text-brand-dark bg-brand-gold rounded-xl ring-1 ring-brand-gold/40"
                    : "text-brand-gold bg-transparent border border-brand-gold hover:text-brand-gold",
                ].join(" ")}
              >
                {tab.label}

                <span className={["text-[11px] text-brand-darkrounded-full px-1.5 font-bold",
                  isActive
                    ? "text-brand-dark"
                    : "text-brand-gold",
                ].join(" ")}
                >
                  {counts[tab.key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-brand-gold/15">
          <div className="flex items-center gap-2 rounded-lg border border-brand-gold/20 px-3 py-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand-muted">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members..."
              className="flex-1 bg-transparent text-manrope text-[15px] text-brand-light placeholder:text-brand-muted/60 outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {loading ? (
            <p className="text-center text-brand-muted text-[13px] py-8">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-brand-muted text-[13px] py-8">No members found</p>
          ) : (
            <>
              <p className="text-center text-brand-muted text-[11px] uppercase tracking-[0.1em] mb-3">
                {filtered.length} members
              </p>
              {filtered.map((m) => (
                <MemberRow key={m.userId} member={m} isMe={isMe} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MemberRow({ member, isMe }: { member: MemberItem; isMe: boolean }) {
  const isFriend = member.isFollower && member.isFollowing;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-brand-gold/10 last:border-0">
      <Link href={`/users/${member.username}`} className="shrink-0">
        {member.avatarUrl ? (
          <Image
            src={member.avatarUrl}
            alt={member.username}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover ring-1 ring-brand-gold/40"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center text-[14px] font-medium text-brand-gold ring-1 ring-brand-gold/40">
            {member.username[0]?.toUpperCase()}
          </div>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/users/${member.username}`} className="block">
          <span className="text-[13px] text-brand-light hover:text-brand-gold transition-colors">
            @{member.username}
          </span>
        </Link>
        <div className="flex items-center gap-2 mt-0.5">
          {isFriend && (
            <span className="text-[9px] uppercase tracking-[0.08em] text-brand-muted/80 border border-brand-gold/20 rounded px-1">
              friend
            </span>
          )}
          <span className="text-[11px] text-brand-muted">
            {member.followersCount.toLocaleString()} followers
          </span>
        </div>
      </div>

      {isMe && (
        <button
          className={[
            "shrink-0 px-3 py-1.5 rounded-md text-[11px] uppercase tracking-[0.06em] font-medium cursor-pointer transition-colors",
            member.isFollowing
              ? "text-brand-gold border border-brand-gold/30 hover:bg-brand-gold/10"
              : "bg-brand-gold text-brand-dark hover:opacity-90",
          ].join(" ")}
        >
          {member.isFollowing ? "Following" : "Follow back"}
        </button>
      )}
    </div>
  );
}