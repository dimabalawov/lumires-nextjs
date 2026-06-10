export default function SectionSkeleton() {
  return (
    <div className="w-full animate-pulse bg-brand-dark py-16 lg:py-24">
      <div className="section-container">
        <div className="h-8 w-48 bg-white/10 rounded mb-10" />
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-60 flex-1 bg-white/10 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}