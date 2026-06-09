import Link from "next/link";

const SECTIONS = [
  {
    href: "/admin/directors",
    title: "Most Discussed Directors",
    description: "Set each director's weekly mention count. The section sorts high → low.",
  },
  {
    href: "/admin/collections",
    title: "Collections Created By Film Lovers",
    description: "Curate which film lists are featured in the Collections section on /lists.",
  },
];

export default function AdminHome() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {SECTIONS.map((s) => (
        <Link
          key={s.href}
          href={s.href}
          className="group rounded-[4px] border border-brand-muted/20 p-6 hover:border-brand-gold/60 transition-colors"
        >
          <h2 className="font-oswald uppercase text-brand-light text-[22px] tracking-[0.06em] group-hover:text-brand-gold transition-colors">
            {s.title}
          </h2>
          <p className="mt-3 font-manrope text-[14px] leading-[1.5] text-brand-muted">
            {s.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
