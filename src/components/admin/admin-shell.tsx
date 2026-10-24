import Link from "@/components/link";
import { useLocation } from "react-router-dom";
import { CalendarCheck, ExternalLink, FolderTree, LayoutDashboard, LogOut, Settings, Waypoints } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/pages/admin/admin-context";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/experiencias", label: "Paquetes", icon: Waypoints },
  { href: "/admin/reservas", label: "Reservas", icon: CalendarCheck },
  { href: "/admin/categorias", label: "Categorías", icon: FolderTree },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { config: siteConfig, logout } = useAdmin();
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-[#f4f5f7] lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 z-30 flex flex-col bg-[#021623] text-white lg:h-screen">
        <div className="flex items-center justify-between gap-3 px-5 py-4 lg:block lg:py-6">
          <Link href="/admin" className="flex items-center gap-3">
            <img src={siteConfig.logoMark} alt="" className="h-10 w-auto rounded-lg bg-[#fbf6ea] p-1" />
            <span className="leading-tight">
              <span className="block text-sm font-bold">{siteConfig.name}</span>
              <span className="block text-xs text-white/55">Panel de administración</span>
            </span>
          </Link>
          <button onClick={logout} className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden" aria-label="Cerrar sesión">
            <LogOut className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:pb-0" aria-label="Administración">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                isActive(item.href)
                  ? "bg-[#d4952a] text-[#021623]"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden border-t border-white/10 p-3 lg:grid lg:gap-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" /> Ver sitio web
          </a>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
