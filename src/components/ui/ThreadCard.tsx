import Image from "next/image";
import Link from "next/link";
import MissingAvatar from "@/components/ui/MissingAvatar";
import type { ThreadItem } from "@/types/threads";

const LONG_THRESHOLD = 500; // matches the backend LongThreshold

function readMinutes(text: string) {
  // chars/5 ≈ words, /200 wpm, +1 — same shape as the API's read-time calc
  return Math.floor(text.length / 5 / 200) + 1;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = String(d.getDate()).padStart(2, "0");
  return `${month} ${day} · ${d.getFullYear()}`;
}

export default function ThreadCard({ thread }: { thread: ThreadItem }) {
  const href = `/threads/${thread.id}`;
  // No explicit "type" on the DTO — derive the badge from length.
  const badge = thread.text.length >= LONG_THRESHOLD ? "Long-form" : "Thread";

  return (
    <article className="flex flex-col gap-5 border-t border-brand-gold/10 pt-8 lg:flex-row">
      {thread.image && (
        <Link
          href={href}
          className="relative block aspect-[4/3] w-full shrink-0 overflow-hidden rounded-sm lg:aspect-auto lg:w-[210px] lg:self-stretch"
        >
          <Image src={thread.image} alt="" fill unoptimized sizes="210px" className="object-cover" />
        </Link>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {thread.avatarUrl ? (
              <Image
                src={thread.avatarUrl}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <MissingAvatar width={28} height={28} username={thread.username} />
            )}
            <div className="leading-tight">
              <Link
                href={`/users/${thread.username}`}
                className="font-manrope text-sm text-brand-light hover:text-brand-gold"
              >
                @{thread.username}
              </Link>
              <p className="font-manrope text-[11px] uppercase tracking-[0.18em] text-brand-muted">
                {badge} · {readMinutes(thread.text)} min read
              </p>
            </div>
          </div>
          <span className="shrink-0 font-manrope text-[11px] uppercase tracking-[0.18em] text-brand-muted">
            {formatDate(thread.createdAt)}
          </span>
        </div>

        {thread.title && (
          <Link
            href={href}
            className="mt-4 block font-oswald leading-snug text-brand-gold hover:opacity-80"
            style={{ fontSize: "clamp(18px, 2vw, 22px)" }}
          >
            {thread.title}
          </Link>
        )}

        <p className="mt-2 line-clamp-3 font-manrope text-[14px] font-light leading-relaxed text-brand-light/75">
          {thread.text}
        </p>

        <div className="mt-4 flex items-center gap-6 font-manrope text-[12px] uppercase tracking-[0.12em] text-brand-muted">
          <span className={thread.isLikedByMe ? "text-brand-gold" : undefined}>
            ♥ {thread.likesCount} likes
          </span>
          <span>{thread.repliesCount} replies</span>
          <span>share</span>
        </div>

        {thread.comment && (
          <div className="mt-4 rounded-sm border border-brand-gold/12 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2">
              {thread.comment.avatarUrl ? (
                <Image
                  src={thread.comment.avatarUrl}
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5 rounded-full object-cover"
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-white/10" />
              )}
              <span className="font-manrope text-[13px] text-brand-light">
                @{thread.comment.username}
              </span>
            </div>
            <p className="mt-2 line-clamp-3 font-manrope text-[13px] font-light leading-relaxed text-brand-light/70">
              {thread.comment.text}
            </p>
          </div>
        )}

        {thread.repliesCount > 0 && (
          <Link
            href={href}
            className="mt-3 inline-block font-manrope text-[12px] uppercase tracking-[0.18em] text-brand-gold/80 hover:text-brand-gold"
          >
            See more replies ({thread.repliesCount}) →
          </Link>
        )}
      </div>
    </article>
  );
}