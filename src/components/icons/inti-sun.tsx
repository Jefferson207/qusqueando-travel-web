import type { SVGProps } from "react";

// Sol andino (Inti) del logo: disco con anillo y ocho rayos alternos.
// Usa currentColor, así que se colorea igual que los íconos de lucide.
export function IntiSun({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <path d="M12 1.5v3.3M12 19.2v3.3M1.5 12h3.3M19.2 12h3.3" />
      <path d="M5.4 5.4l1.7 1.7M16.9 16.9l1.7 1.7M5.4 18.6l1.7-1.7M16.9 7.1l1.7-1.7" />
    </svg>
  );
}
