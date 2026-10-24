import { Link as RouterLink, type LinkProps as RouterLinkProps } from "react-router-dom";

type LinkProps = Omit<RouterLinkProps, "to"> & { href: string };

// Enlace interno con la misma forma de uso que next/link (prop href).
export default function Link({ href, ...props }: LinkProps) {
  return <RouterLink to={href} {...props} />;
}
