import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href?: string;
  linkLabel?: string;
}

export default function SectionHeader({
  title,
  href = "#",
  linkLabel = "show all →",
}: SectionHeaderProps) {
  return (
    <div className="section-container mb-8 lg:mb-12 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end">
      <h2 className="uppercase font-oswald text-brand-light opacity-90 font-normal text-[28px] leading-[36px] lg:text-[56px] lg:leading-[64px] tracking-[0.06em]">
        {title}
      </h2>
      <Link
        href={href}
        className="uppercase text-brand-light hover:opacity-70 transition-opacity font-oswald underline sm:mb-2 font-light text-base tracking-[0.06em]"
      >
        {linkLabel}
      </Link>
    </div>
  );
}
