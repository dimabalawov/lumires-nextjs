import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`uppercase font-oswald font-light tracking-[0.2em] text-[12px] lg:text-[13px] ${className}`}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`}>
            {i > 0 && <span className="mx-3 text-brand-light/40">/</span>}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-brand-light/60 hover:opacity-70 transition-opacity"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-brand-light">{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
