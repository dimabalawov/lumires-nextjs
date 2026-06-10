interface FilterTabsProps {
  tabs: { value: number; label: string }[];
  active: number;
  onChange: (value: number) => void;
}

export function FilterTabs({ tabs, active, onChange }: FilterTabsProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 lg:gap-3">
      {tabs.map((tab) => {
        const isActive = tab.value === active;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={
              isActive
                ? "border text-brand-dark bg-brand-gold lg:bg-transparent lg:border-brand-gold/45 lg:text-brand-gold uppercase font-manrope font-normal text-[13px] tracking-[0.2em] px-4.5 py-2.5 rounded-4xl lg:rounded-sm"
                : "border border-transparent text-brand-light hover:opacity-70 uppercase font-manrope font-normal text-[13px] tracking-[0.2em] px-[18px] py-[10px] rounded-[4px] transition-opacity"
            }
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}