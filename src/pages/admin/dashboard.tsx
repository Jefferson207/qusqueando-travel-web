import Link from "@/components/link";
import { useEffect, useState } from "react";
import { ArrowRight, BellRing, EyeOff, Flame, FolderTree, Globe, Plus, Settings, Waypoints } from "lucide-react";
import { api } from "@/lib/admin-api";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminHeader, AdminPanel, adminPrimaryButton } from "@/components/admin/admin-ui";
import { useAdmin } from "@/pages/admin/admin-context";
import { formatCurrency } from "@/lib/utils";

export default function AdminPage() {
  const { experiences, categories, config } = useAdmin();
  const [newBookings, setNewBookings] = useState(0);
  useEffect(() => {
    api<{ bookings: { status: string }[] }>("/api/bookings")
      .then((data) => setNewBookings(data.bookings.filter((booking) => booking.status === "nueva").length))
      .catch(() => setNewBookings(0));
  }, []);
  const active = experiences.filter((experience) => experience.status === "ACTIVE").length;
  const featured = experiences.filter((experience) => experience.featured).length;

  const metrics = [
    { label: "Paquetes publicados", value: active, icon: Globe, tone: "bg-[#ecfdf3] text-[#067647]" },
    { label: "Borradores", value: experiences.length - active, icon: EyeOff, tone: "bg-[#f2f4f7] text-[#475467]" },
    { label: "Destacados en inicio", value: featured, icon: Flame, tone: "bg-[#fef3ec] text-[#c4512b]" },
    { label: "Categorías", value: categories.length, icon: FolderTree, tone: "bg-[#fdf0dc] text-[#8a5a08]" },
  ];

  const shortcuts = [
    { href: "/admin/experiencias/nueva", label: "Crear un paquete", text: "Nuevo tour con fotos, precios e itinerario.", icon: Plus },
    { href: "/admin/experiencias", label: "Editar paquetes", text: "Precios, fotos, estado y destacados.", icon: Waypoints },
    { href: "/admin/configuracion", label: "Logos y portadas", text: "Imágenes de la página de inicio y del logo.", icon: Settings },
    { href: "/admin/configuracion", label: "WhatsApp y redes", text: `WhatsApp actual: ${config.whatsappDisplay}`, icon: Globe },
  ];

  return (
    <AdminShell>
      <AdminHeader
        title="¡Hola! 👋"
        description={`Bienvenido al panel de ${config.name}.`}
        actions={
          <Link href="/admin/experiencias/nueva" className={adminPrimaryButton}>
            <Plus className="h-4 w-4" /> Nuevo paquete
          </Link>
        }
      />

      {newBookings ? (
        <Link href="/admin/reservas" className="mt-6 flex items-center gap-4 rounded-2xl border border-[#f5c9a8] bg-[#fef3ec] p-4 transition hover:-translate-y-0.5 hover:shadow-md">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#c4512b] text-white"><BellRing className="h-5 w-5" /></span>
          <span className="flex-1">
            <b className="block text-[#021623]">{newBookings} {newBookings === 1 ? "reserva nueva" : "reservas nuevas"} por atender</b>
            <span className="text-sm text-[#667085]">Confírmales disponibilidad y precio por WhatsApp o correo.</span>
          </span>
          <ArrowRight className="h-5 w-5 text-[#c4512b]" />
        </Link>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-[#e4e7ec] bg-white p-5 shadow-sm">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${metric.tone}`}>
              <metric.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-3xl font-bold text-[#021623]">{metric.value}</p>
            <p className="mt-1 text-sm text-[#667085]">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <AdminPanel title="Accesos rápidos">
          <div className="grid gap-2">
            {shortcuts.map((shortcut) => (
              <Link
                key={shortcut.label}
                href={shortcut.href}
                className="group flex items-center gap-4 rounded-xl border border-[#eaecf0] p-3 transition hover:border-[#d4952a] hover:bg-[#fffaf1]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#021623] text-[#e6a93e]">
                  <shortcut.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-[#021623]">{shortcut.label}</span>
                  <span className="block truncate text-xs text-[#667085]">{shortcut.text}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-[#98a2b3] transition group-hover:translate-x-0.5 group-hover:text-[#b97a0b]" />
              </Link>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Paquetes">
          <ul className="divide-y divide-[#eaecf0]">
            {experiences.slice(0, 6).map((experience) => (
              <li key={experience.id}>
                <Link href={`/admin/experiencias/${encodeURIComponent(experience.slug)}`} className="flex items-center gap-3 py-2.5 hover:opacity-80">
                  <img src={experience.mainImage} alt="" className="h-10 w-14 shrink-0 rounded-lg bg-[#f2f4f7] object-cover" />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#021623]">{experience.name}</span>
                  <span className="text-sm text-[#667085]">{formatCurrency(experience.priceFrom, experience.currency)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/admin/experiencias" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#b97a0b] hover:underline">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
