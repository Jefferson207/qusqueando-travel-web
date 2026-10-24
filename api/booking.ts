import { formatCurrency } from "../src/lib/utils.js";
import { buildBooking, limitBookings, saveBooking } from "./_bookings.js";
import { handle, json, readBody } from "./_lib.js";
import { button, esc, highlight, layout, rows, sendMail } from "./_mail.js";
import { getSiteConfig } from "./_store.js";

const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const travelers = (adults: number, kids: number) => `${adults} adulto${adults > 1 ? "s" : ""}${kids ? ` y ${kids} niño${kids > 1 ? "s" : ""}` : ""}`;
const waLink = (phone: string, text: string) => `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

// Solicitud de reserva desde la web: se guarda para el panel (/admin › Reservas)
// y, si Resend está configurado, avisa a la agencia y confirma al cliente.
export const POST = handle(async (request) => {
  const booking = await buildBooking(await readBody(request));
  await limitBookings(request);
  const saved = await saveBooking(booking);

  const config = await getSiteConfig();
  const people = saved.adults + saved.kids;
  const names = saved.experiences.map((item) => item.name).join(", ");
  const detail = saved.experiences
    .map((item) => `${item.name} · ${item.duration}${item.price ? ` · ${formatCurrency(item.price, item.currency)} x ${people} = ${formatCurrency(item.price * people, item.currency)}` : " · Precio a confirmar"}`)
    .join("\n");
  const trip = rows([
    [saved.experiences.length > 1 ? "Experiencias" : "Experiencia", detail],
    ["Fecha de inicio", longDate(saved.date)],
    ["Viajeros", travelers(saved.adults, saved.kids)],
  ]);
  const contact = rows([["Nombre", saved.name], ["Correo", saved.email], ["WhatsApp", saved.phone], ["País", saved.country], ["Comentarios", saved.notes]]);
  const first = saved.name.split(" ")[0];

  const [notified, emailed] = await Promise.all([
    sendMail(
      config.email,
      `🧳 Nueva reserva ${saved.code}: ${names} — ${saved.name}`,
      layout({
        eyebrow: "Nueva solicitud de reserva",
        title: `${saved.name} quiere viajar`,
        intro: "Un cliente solicitó una reserva desde la web. Confírmale disponibilidad, precio final y forma de pago.",
        body: `${highlight("Código de solicitud", saved.code)}${trip}<p style="margin:20px 0 8px;font-weight:700">El cliente</p>${contact}
${button(waLink(saved.phone, `Hola ${first}, te escribimos de Qusqueando Travel por tu solicitud ${saved.code} (${names}).`), "Escribirle por WhatsApp")}`,
      }),
      saved.email,
    ),
    sendMail(
      saved.email,
      `Recibimos tu solicitud ${saved.code} · Qusqueando Travel`,
      layout({
        eyebrow: "Solicitud de reserva",
        title: `¡Gracias, ${first}!`,
        intro: `Recibimos tu solicitud para <b>${esc(names)}</b>. Te contactaremos muy pronto para confirmar disponibilidad, precio final y forma de pago.`,
        body: `${highlight("Código de solicitud", saved.code)}${trip}
<p style="margin:20px 0 0;padding:14px;border-left:4px solid #d4952a;background:#fbf6ea;font-size:13px">Esta es una <b>solicitud</b>, todavía no una reserva confirmada. Queda confirmada cuando te enviemos la disponibilidad y realices el pago.</p>
${button(waLink(config.whatsapp, `Hola Qusqueando Travel, tengo una consulta sobre mi solicitud ${saved.code}.`), "Escríbenos por WhatsApp")}`,
      }),
      config.email,
    ),
  ]);

  return json({ code: saved.code, emailed, notified });
});
