import { useCallback, useEffect, useState } from "react";
import { CalendarDays, Loader2, Mail, MessageCircle, Users } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminHeader, AdminNotice } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { Select } from "@/components/ui/pickers";
import { api } from "@/lib/admin-api";
import { formatDate, travelersLabel } from "@/lib/trip";
import { cn, formatCurrency } from "@/lib/utils";
import { errorMessage } from "@/pages/admin/admin-context";

type Booking = {
  code: string;
  createdAt: number;
  status: "nueva" | "contactado" | "confirmada" | "cancelada";
  experiences: { slug: string; name: string; duration: string; price: number; currency: string }[];
  date: string;
  adults: number;
  kids: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  notes: string;
  adminNotes: string;
};

const statuses = [
  { value: "nueva", label: "Nueva", tone: "bg-[#fef3ec] text-[#c4512b]" },
  { value: "contactado", label: "Contactado", tone: "bg-[#eff8ff] text-[#175cd3]" },
  { value: "confirmada", label: "Confirmada", tone: "bg-[#ecfdf3] text-[#067647]" },
  { value: "cancelada", label: "Cancelada", tone: "bg-[#f2f4f7] text-[#475467]" },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("todas");

  const load = useCallback(async () => {
    try {
      setBookings((await api<{ bookings: Booking[] }>("/api/bookings")).bookings);
    } catch (loadError) {
      setError(errorMessage(loadError));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function update(code: string, changes: Partial<Pick<Booking, "status" | "adminNotes">>) {
    setError("");
    try {
      const { booking } = await api<{ booking: Booking }>("/api/bookings", { method: "PATCH", body: { code, ...changes } });
      setBookings((list) => list?.map((item) => (item.code === code ? booking : item)) ?? null);
    } catch (updateError) {
      setError(errorMessage(updateError));
    }
  }

  async function remove(code: string) {
    setError("");
    try {
      await api(`/api/bookings?code=${encodeURIComponent(code)}`, { method: "DELETE" });
      setBookings((list) => list?.filter((item) => item.code !== code) ?? null);
    } catch (removeError) {
      setError(errorMessage(removeError));
    }
  }

  const visible = bookings?.filter((item) => filter === "todas" || item.status === filter) ?? [];
  const newCount = bookings?.filter((item) => item.status === "nueva").length ?? 0;

  return (
    <AdminShell>
      <AdminHeader
        title="Reservas"
        description={bookings ? `${bookings.length} solicitudes recibidas desde la web${newCount ? ` · ${newCount} nuevas` : ""}.` : "Solicitudes recibidas desde la web."}
        actions={
          <Select
            value={filter}
            onChange={setFilter}
            className="w-48"
            options={[{ value: "todas", label: "Todas" }, ...statuses.map(({ value, label }) => ({ value, label }))]}
          />
        }
      />
      <AdminNotice error={error || undefined} />

      {!bookings ? (
        <p className="mt-10 flex items-center gap-2 text-sm text-[#667085]"><Loader2 className="h-4 w-4 animate-spin" /> Cargando reservas...</p>
      ) : visible.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-[#e4e7ec] bg-white p-10 text-center">
          <p className="font-semibold text-[#021623]">No hay reservas {filter !== "todas" ? "con ese estado" : "todavía"}</p>
          <p className="mt-1 text-sm text-[#667085]">Aparecen aquí cuando un cliente envía una solicitud desde /reservar.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {visible.map((booking) => {
            const status = statuses.find((item) => item.value === booking.status) ?? statuses[0];
            const people = booking.adults + booking.kids;
            return (
              <article key={booking.code} className="rounded-2xl border border-[#e4e7ec] bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2">
                      <b className="text-[#021623]">{booking.name}</b>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", status.tone)}>{status.label}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-[#98a2b3]">
                      {booking.code} · recibida el {new Date(booking.createdAt).toLocaleString("es-PE", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={booking.status} onChange={(value) => update(booking.code, { status: value as Booking["status"] })} options={statuses} className="w-40" />
                    <DeleteButton label="Borrar" onConfirm={() => remove(booking.code)} confirmText={`¿Eliminar la reserva ${booking.code} de ${booking.name}?`} />
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-[1.4fr_1fr]">
                  <ul className="grid gap-1.5 text-sm">
                    {booking.experiences.map((item) => (
                      <li key={item.slug} className="flex justify-between gap-3">
                        <span>{item.name} <small className="text-[#98a2b3]">· {item.duration}</small></span>
                        <b>{item.price ? formatCurrency(item.price * people, item.currency) : "A confirmar"}</b>
                      </li>
                    ))}
                    <li className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#667085]">
                      <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {formatDate(booking.date, true)}</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {travelersLabel(booking.adults, booking.kids)}</span>
                    </li>
                  </ul>
                  <div className="grid content-start gap-1.5 text-sm">
                    <a href={`https://wa.me/${booking.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#067647] hover:underline"><MessageCircle className="h-4 w-4" /> {booking.phone}</a>
                    <a href={`mailto:${booking.email}`} className="flex items-center gap-2 text-[#175cd3] hover:underline"><Mail className="h-4 w-4" /> {booking.email}</a>
                    {booking.country ? <span className="text-xs text-[#667085]">País: {booking.country}</span> : null}
                  </div>
                </div>

                {booking.notes ? <p className="mt-3 rounded-xl bg-[#faf6ef] p-3 text-sm text-[#475467]"><b>Comentarios del cliente:</b> {booking.notes}</p> : null}
                <textarea
                  defaultValue={booking.adminNotes}
                  onBlur={(event) => {
                    if (event.target.value !== booking.adminNotes) void update(booking.code, { adminNotes: event.target.value });
                  }}
                  rows={2}
                  placeholder="Notas internas (se guardan al salir del campo)"
                  className="field mt-3 text-sm"
                />
              </article>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
