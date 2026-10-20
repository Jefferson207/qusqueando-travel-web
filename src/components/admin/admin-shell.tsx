import Link from "next/link";
import { BarChart3, FolderTree, Settings, Waypoints } from "lucide-react";

const items = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/experiencias", label: "Experiencias", icon: Waypoints },
  { href: "/admin/categorias", label: "Categorías", icon: FolderTree },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="h-fit rounded-lg border border-[#e4e7ec] bg-white p-3 shadow-sm">
          <p className="px-3 py-2 text-sm font-bold text-[#021623]">Admin</p>
          <nav className="mt-2 grid gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#475467] hover:bg-[#f6f7f9] hover:text-[#021623]"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}

export function AdminNotice({ error, saved }: { error?: string; saved?: string }) {
  if (error) {
    return (
      <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        {error}
      </p>
    );
  }

  if (saved) {
    return (
      <p role="status" className="mt-6 rounded-xl border border-[#d9dfa8] bg-[#f4f6e3] px-4 py-3 text-sm font-medium text-[#5c6312]">
        Cambios guardados.
      </p>
    );
  }

  return null;
}
