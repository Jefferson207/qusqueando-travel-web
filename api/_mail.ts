// Correos automáticos con Resend. Si falta RESEND_API_KEY no se envía nada y la web sigue funcionando.

const SITE = "https://qusqueandotravel.com";
const C = { navy: "#021623", gold: "#d4952a", goldDark: "#b97a0b", cream: "#fbf6ea", ink: "#021623", muted: "#667085", line: "#efe2c8" };
const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "'Segoe UI',Arial,Helvetica,sans-serif";

export const esc = (value: unknown) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Plantilla con el logo y los colores de la web (tablas y estilos en línea para Gmail/Outlook). */
export function layout({ eyebrow, title, intro, body }: { eyebrow: string; title: string; intro?: string; body: string }) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${C.cream}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream}"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden">
 <tr><td align="center" style="padding:24px;background:${C.navy}"><a href="${SITE}"><img src="${SITE}/logo-blanco.png" width="130" alt="Qusqueando Travel" style="display:block;width:130px;height:auto;border:0"></a></td></tr>
 <tr><td style="height:4px;line-height:4px;font-size:0;background:${C.gold}">&nbsp;</td></tr>
 <tr><td style="padding:32px 32px 8px;font-family:${SANS};color:${C.ink}">
  <p style="margin:0 0 8px;font-size:11px;letter-spacing:2.5px;font-weight:700;color:${C.goldDark};text-transform:uppercase">${esc(eyebrow)}</p>
  <h1 style="margin:0 0 12px;font-family:${SERIF};font-size:26px;line-height:1.25;color:${C.navy}">${esc(title)}</h1>
  ${intro ? `<p style="margin:0;font-size:15px;line-height:1.65;color:${C.muted}">${intro}</p>` : ""}
 </td></tr>
 <tr><td style="padding:16px 32px 32px;font-family:${SANS};color:${C.ink};font-size:15px;line-height:1.6">${body}</td></tr>
 <tr><td align="center" style="background:${C.navy};padding:22px 32px;font-family:${SANS};color:#d0d5dd;font-size:13px">
  <p style="margin:0 0 4px;font-family:${SERIF};font-size:16px;color:#ffffff;font-style:italic">Más que un viaje, una conexión con los Andes</p>
  <a href="${SITE}" style="color:#f3c77a;text-decoration:none;font-weight:700">qusqueandotravel.com</a>
 </td></tr>
</table></td></tr></table></body></html>`;
}

/** Ficha con los datos en filas. */
export const rows = (list: [string, unknown][]) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.line};border-radius:12px;border-collapse:separate;overflow:hidden">${list
    .filter(([, value]) => value !== "" && value !== undefined && value !== null)
    .map(
      ([label, value], i) =>
        `<tr><td style="padding:10px 14px;background:${i % 2 ? "#ffffff" : C.cream};font-size:12px;font-weight:700;color:${C.muted};text-transform:uppercase;width:34%;vertical-align:top">${esc(label)}</td><td style="padding:10px 14px;background:${i % 2 ? "#ffffff" : C.cream};font-size:14px;white-space:pre-wrap;vertical-align:top">${esc(value)}</td></tr>`,
    )
    .join("")}</table>`;

/** Recuadro destacado (código de la solicitud). */
export const highlight = (label: string, value: string) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px"><tr><td align="center" style="padding:18px;border-radius:12px;background:${C.cream};border:2px dashed ${C.gold}">
<p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;font-weight:700;color:${C.muted};text-transform:uppercase">${esc(label)}</p>
<p style="margin:0;font-size:26px;font-weight:800;color:${C.goldDark};letter-spacing:2px">${esc(value)}</p></td></tr></table>`;

export const button = (href: string, text: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto 4px"><tr><td align="center" style="border-radius:999px;background:${C.gold}"><a href="${esc(href)}" style="display:inline-block;padding:13px 28px;font-family:${SANS};font-size:15px;font-weight:700;color:${C.navy};text-decoration:none">${esc(text)}</a></td></tr></table>`;

/** Envía un correo; devuelve false (sin lanzar error) si no está configurado o falla. */
export async function sendMail(to: string | string[], subject: string, html: string, replyTo?: string) {
  const key = process.env.RESEND_API_KEY || "";
  const list = (Array.isArray(to) ? to : [to]).filter(Boolean);
  if (!key || !list.length) return false;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || "Qusqueando Travel <reservas@qusqueandotravel.com>",
        to: list,
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!response.ok) console.error("Resend", response.status, (await response.text()).slice(0, 300));
    return response.ok;
  } catch (error) {
    console.error("Resend", error);
    return false;
  }
}
