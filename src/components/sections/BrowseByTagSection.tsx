const tags = [
  { name: "slow cinema", count: "1.2k" },
  { name: "a24", count: "3.8k" },
  { name: "villeneuve", count: "412" },
  { name: "first watches", count: "7.2k" },
  { name: "comfort films", count: "2.4k" },
  { name: "long-form", count: "934" },
  { name: "criterion", count: "2.1k" },
  { name: "korean new wave", count: "540" },
  { name: "letterboxd 250", count: "5.6k" },
  { name: "underseen", count: "1.8k" },
  { name: "debut features", count: "623" },
  { name: "midnight movies", count: "1.1k" },
];

export default function BrowseByTagSection() {
  return (
    <section className="w-full bg-brand-dark pt-8 lg:pt-12 pb-16 lg:pb-24">
      <div className="section-container">
        <h2 className="mb-6 lg:mb-8 font-oswald font-light text-brand-light text-[28px] lg:text-[32px] tracking-[0.04em]">
          Browse By Tag
        </h2>

        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <button
              key={tag.name}
              type="button"
              className="inline-flex items-center gap-2 rounded-[4px] border border-brand-muted/30 px-3.5 py-2 hover:border-brand-gold/50 transition-colors"
            >
              <span className="font-manrope text-brand-light text-[14px]">{tag.name}</span>
              <span className="font-manrope text-brand-muted text-[12px]">{tag.count}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
