import Image from "next/image";
import Link from "next/link";
import { ActiveMember } from "@/types/film";
import MissingAvatar from "./MissingAvatar";

// A single member: circular portrait, handle, then "reviews N · lists N / this week".
export default function ActiveMemberCard({ member }: { member: ActiveMember }) {
  const portrait = member.avatarUrl ? (
    <div className="relative size-[120px] lg:size-[138px] overflow-hidden rounded-full">
      <Image
        src={member.avatarUrl}
        alt={member.username}
        fill
        className="object-cover"
        sizes="140px"
      />
    </div>
  ) : (
    <MissingAvatar username={member.username.replace(/^@/, "")} width={138} height={138} />
  );

  return (
    <div className="flex w-[150px] shrink-0 flex-col items-center text-center select-none">
      {member.href ? (
        <Link href={member.href} className="transition-opacity hover:opacity-80">
          {portrait}
        </Link>
      ) : (
        portrait
      )}

      {member.href ? (
        <Link
          href={member.href}
          className="mt-5 font-manrope font-normal text-brand-gold text-[16px] lg:text-[18px] leading-none transition-opacity hover:opacity-80"
        >
          {member.username}
        </Link>
      ) : (
        <span className="mt-5 font-manrope font-normal text-brand-gold text-[16px] lg:text-[18px] leading-none">
          {member.username}
        </span>
      )}

      <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-brand-light/15 to-transparent" />

      {/* BODY3 WEB — Manrope Regular 14/24, 6% */}
      <div className="mt-2 flex items-center justify-center gap-4 font-manrope font-normal text-[14px] leading-[24px] tracking-[0.06em]">
        <span className="text-brand-muted">
          reviews <span className="text-brand-gold">{member.reviews}</span>
        </span>
        <span className="text-brand-muted">
          lists <span className="text-brand-gold">{member.lists}</span>
        </span>
      </div>
      <span className="font-manrope font-normal text-[14px] leading-[24px] tracking-[0.06em] text-brand-muted">
        this week
      </span>
    </div>
  );
}
