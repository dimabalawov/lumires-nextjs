"use client";

import { usePathname, useRouter } from "next/navigation";

const TABS = [
  { value: "films", label: "Films" },
  { value: "lists", label: "Lists" },
  { value: "reviews", label: "Reviews" },
];

export default function LikesCategoryTabs({ active }: { active: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function select(tab: string) {
    router.push(tab === "films" ? pathname : `${pathname}?tab=${tab}`, { scroll: false });
  }

  return (
    <div className="my-6 flex flex-wrap items-center gap-2 lg:gap-3">
      {TABS.map((t) => {
        const isActive = t.value === active;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => select(t.value)}
            className={
              isActive
                ? "border border-brand-gold/45 text-brand-gold uppercase font-manrope font-normal text-[13px] tracking-[0.2em] px-[18px] py-[10px] rounded-[4px]"
                : "border border-transparent text-brand-light hover:opacity-70 uppercase font-manrope font-normal text-[13px] tracking-[0.2em] px-[18px] py-[10px] rounded-[4px] transition-opacity"
            }
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}