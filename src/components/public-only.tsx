import { useLocation } from "react-router-dom";

// Muestra su contenido solo en la web pública (no dentro de /admin).
export function PublicOnly({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return pathname.startsWith("/admin") ? null : children;
}
