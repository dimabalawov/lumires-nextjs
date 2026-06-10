import Link from "next/link";

interface ShowAllLinkProps {
  href: string;
  title?: string;
  style?: React.CSSProperties;
  className?: string;
  withBorder?: boolean;
  isCenter?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function ShowAllLink({ href, title, style, className, withBorder, isCenter, onClick }: ShowAllLinkProps) {
  return (
    <Link
      href={href}
      className={`flex justify-end lowercase text-brand-light
        hover:opacity-70 transition-opacity items-center font-oswald font-light
        tracking-[0.06em] text-[18px] gap-1.5
        ${className ?? ""}`}
      style={style}
      onClick={onClick}
    >
      <span className={`pb-0.5 ${withBorder ? "border-b border-current" : ""}`}>{title || "SHOW ALL"}</span>
      <span className={`border-none ${isCenter ? "text-xl -translate-y-2" : ""}`}>→</span>
    </Link>
  );
}