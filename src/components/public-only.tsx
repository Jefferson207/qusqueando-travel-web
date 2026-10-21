"use client";

import { usePathname } from "next/navigation";

// Muestra su contenido solo en la web pública (no dentro de /admin).
export function PublicOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return pathname.startsWith("/admin") ? null : children;
}
