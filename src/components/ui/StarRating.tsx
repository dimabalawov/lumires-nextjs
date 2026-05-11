interface StarRatingProps {
  count: number;
  max?: number;
  className?: string;
}

export default function StarRating({ count, max, className = "" }: StarRatingProps) {
  // When `max` is omitted, behave like before: render only filled stars.
  if (max === undefined) {
    return (
      <span className={`inline-flex gap-1 text-brand-muted text-[14px] ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <span key={i}>★</span>
        ))}
      </span>
    );
  }

  // With `max`, render the remaining stars as dimmed.
  const filled = Math.max(0, Math.min(count, max));
  const empty = Math.max(0, max - filled);
  return (
    <span
      aria-label={`${filled} out of ${max} stars`}
      className={`inline-flex tracking-[0.1em] ${className}`}
    >
      <span aria-hidden>{"★".repeat(filled)}</span>
      <span aria-hidden className="opacity-30">{"★".repeat(empty)}</span>
    </span>
  );
}
