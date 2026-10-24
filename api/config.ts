import { HttpError, handle, json, parse, readBody, requireAdmin, siteConfigSchema } from "./_lib.js";
import { getSiteConfig, saveSiteConfig } from "./_store.js";

// "+51 916 788 768", "916788768" o "51916788768" -> "+51916788768".
function normalizeWhatsapp(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 9 && digits.startsWith("9")) digits = `51${digits}`;
  return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
}

export const PUT = handle(async (request) => {
  requireAdmin(request);
  const { instagram, facebook, tiktok, youtube, ...data } = parse(siteConfigSchema, await readBody(request));
  const whatsapp = normalizeWhatsapp(data.whatsappDisplay);
  if (!whatsapp) throw new HttpError(400, "El número de WhatsApp no es válido. Ejemplo: +51 916 788 768");

  const current = await getSiteConfig();
  const changes = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
  const config = { ...current, ...changes, whatsapp, socials: { instagram, facebook, tiktok, youtube } };
  await saveSiteConfig(config);
  return json({ config });
});
