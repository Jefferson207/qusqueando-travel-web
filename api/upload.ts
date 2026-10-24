import { HttpError, handle, json, requireAdmin } from "./_lib.js";

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const maxBytes = 5 * 1024 * 1024;

// Recibe la imagen desde el panel y la reenvía al hosting (cPanel).
export const POST = handle(async (request) => {
  requireAdmin(request);

  const uploadUrl = process.env.CPANEL_UPLOAD_URL;
  const token = process.env.CPANEL_UPLOAD_TOKEN;
  if (!uploadUrl || !token) throw new HttpError(500, "Falta configurar la subida de imágenes (cPanel) en el servidor.");

  const incoming = await request.formData().catch(() => null);
  const file = incoming?.get("file");
  if (!(file instanceof File)) throw new HttpError(400, "Falta el archivo (campo «file»).");
  if (!allowedTypes.includes(file.type)) throw new HttpError(415, "Formato no permitido. Usa JPG, PNG, WebP o AVIF.");
  if (file.size > maxBytes) throw new HttpError(413, "La imagen supera los 5 MB.");

  // Solo se reenvía el archivo y el token del servidor, nunca otros campos del cliente.
  const outgoing = new FormData();
  outgoing.append("file", file);
  outgoing.append("token", token);

  const response = await fetch(uploadUrl, { method: "POST", body: outgoing });
  const text = await response.text();
  let data: { url?: unknown; error?: unknown } = {};
  try {
    data = JSON.parse(text);
  } catch {
    // respuesta en texto plano
  }
  if (!response.ok || typeof data.url !== "string") {
    console.error("cPanel upload failed", response.status, text.slice(0, 300));
    throw new HttpError(502, typeof data.error === "string" ? data.error : "No se pudo subir la imagen.");
  }
  return json({ url: data.url });
});
