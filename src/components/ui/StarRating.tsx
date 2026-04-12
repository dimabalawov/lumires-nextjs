interface StarRatingProps {
  count: number;
}

export default function StarRating({ count }: StarRatingProps) {
  return (
    <div className="flex gap-1 text-brand-muted text-[14px]">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}
