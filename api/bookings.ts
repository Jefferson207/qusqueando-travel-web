import { deleteBooking, listBookings, updateBooking } from "./_bookings.js";
import { handle, json, readBody, requireAdmin } from "./_lib.js";

// Reservas recibidas desde la web, para el panel.
export const GET = handle(async (request) => {
  requireAdmin(request);
  return json({ bookings: await listBookings() });
});

// Cambia el estado y las notas internas de una reserva.
export const PATCH = handle(async (request) => {
  requireAdmin(request);
  return json({ booking: await updateBooking(await readBody(request)) });
});

// Elimina una reserva (por ejemplo, una prueba).
export const DELETE = handle(async (request) => {
  requireAdmin(request);
  await deleteBooking(new URL(request.url).searchParams.get("code") ?? "");
  return json({ ok: true });
});
