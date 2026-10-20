import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
};

const baseButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4952a] disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-0.5 hover:scale-[1.03]";

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        baseButton,
        variant === "primary" &&
          "bg-[#d4952a] text-[#021623] shadow-[0_14px_32px_rgba(212,149,42,0.28)] hover:bg-[#b97a0b] hover:shadow-[0_18px_42px_rgba(212,149,42,0.38)]",
        variant === "secondary" &&
          "bg-[#021623] text-white shadow-[0_14px_32px_rgba(2,22,35,0.20)] hover:bg-[#0b2a3c] hover:shadow-[0_18px_42px_rgba(2,22,35,0.28)]",
        variant === "outline" &&
          "border border-[#d7dce4] bg-white/90 text-[#021623] shadow-[0_10px_28px_rgba(2,22,35,0.08)] hover:bg-white hover:shadow-[0_18px_42px_rgba(2,22,35,0.12)]",
        variant === "ghost" && "text-[#021623] hover:bg-[#f6f7f9]",
        className,
      )}
      {...props}
    />
  );
}

export function buttonClassName(
  variant: "primary" | "secondary" | "ghost" | "outline" = "primary",
  className?: string,
) {
  return cn(
    baseButton,
    variant === "primary" &&
      "bg-[#d4952a] text-[#021623] shadow-[0_14px_32px_rgba(212,149,42,0.28)] hover:bg-[#b97a0b] hover:shadow-[0_18px_42px_rgba(212,149,42,0.38)]",
    variant === "secondary" &&
      "bg-[#021623] text-white shadow-[0_14px_32px_rgba(2,22,35,0.20)] hover:bg-[#0b2a3c] hover:shadow-[0_18px_42px_rgba(2,22,35,0.28)]",
    variant === "outline" &&
      "border border-[#d7dce4] bg-white/90 text-[#021623] shadow-[0_10px_28px_rgba(2,22,35,0.08)] hover:bg-white hover:shadow-[0_18px_42px_rgba(2,22,35,0.12)]",
    variant === "ghost" && "text-[#021623] hover:bg-[#f6f7f9]",
    className,
  );
}
