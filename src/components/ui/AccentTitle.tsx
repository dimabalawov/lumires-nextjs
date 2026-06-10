interface AccentTitleProps {
  text: string;
  accent?: string;
  className?: string;
}

export function AccentTitle({ text, accent, className }: AccentTitleProps) {
  return (
    <h2
      className={`font-manrope font-light text-brand-light opacity-90 leading-10 lg:leading-14 tracking-[0.06em] ${className ?? ""}`}
      style={{ fontSize: "clamp(20px, 3vw, 48px)" }}
    >
      {text} { accent ? <span className="text-brand-gold">{accent}</span> : null }
    </h2>
  );
}