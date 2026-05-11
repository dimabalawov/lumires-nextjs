interface GradientDividerProps {
  className?: string;
}

// Horizontal 1px divider: brand-muted (left) fading to transparent (right).
// Used under film meta line and description.
export default function GradientDivider({ className = "" }: GradientDividerProps) {
  return (
    <div
      className={`h-px ${className}`}
      style={{ background: "linear-gradient(90deg, #9B8F84 0%, rgba(53,49,45,0) 100%)" }}
    />
  );
}
