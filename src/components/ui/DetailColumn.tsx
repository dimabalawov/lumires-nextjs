import type { ReactNode } from "react";

interface DetailColumnProps {
  label: string;
  children: ReactNode;
}

export default function DetailColumn({ label, children }: DetailColumnProps) {
  return (
    <div>
      <h3 className="uppercase font-oswald font-light text-brand-gold tracking-[0.18em] text-[12px] mb-3">
        {label}
      </h3>
      <div className="font-manrope font-light text-brand-light/90 text-[14px] leading-[1.6]">
        {children}
      </div>
    </div>
  );
}
