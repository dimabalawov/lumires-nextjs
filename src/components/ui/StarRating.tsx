interface StarRatingProps {
  count?: number | null;
  max?: number;
  className?: string;
}

export default function StarRating({ count, max, className = "" }: StarRatingProps) {
  if (max === undefined) {
    if (!count) {
      return null; 
    }
    return (
      <span className={`inline-flex gap-1 text-brand-muted text-[14px] ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <span key={i}>★</span>
        ))}
      </span>
    );
  }

  const filled = Math.max(0, Math.min(count ?? 0, max));
  const empty = Math.max(0, max - filled);

  return (
    <span
      aria-label={`${filled} out of ${max} stars`}
      className={`inline-flex tracking-widest ${className}`}
    >
      <span aria-hidden>{"★".repeat(filled)}</span>
      <span aria-hidden className="opacity-30">{"★".repeat(empty)}</span>
    </span>
  );
}
