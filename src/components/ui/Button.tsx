import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "goldFilled" | "goldOutlined" | "neutralOutlined";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant: Variant;
  iconOnly?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  goldFilled: "bg-brand-gold text-brand-dark border border-brand-gold",
  goldOutlined: "bg-brand-gold/10 text-brand-gold border border-brand-gold",
  neutralOutlined: "text-brand-light border border-[rgba(155,143,132,0.46)]",
};

export default function Button({
  variant,
  iconOnly = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  const sizing = iconOnly
    ? "h-[48px] w-[48px] shrink-0 justify-center"
    : variant === "goldOutlined"
      ? "h-[48px] px-[22px] py-[13px] gap-[10px]"
      : "h-[48px] px-[22px] py-[14px] gap-2";

  return (
    <button
      type={type}
      className={`inline-flex items-center rounded-[4px] uppercase font-manrope font-medium tracking-[0.12em] text-[13px] hover:opacity-80 transition-opacity ${variantClasses[variant]} ${sizing} ${className}`}
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
