// Dominios desde los que next/image puede cargar imágenes. next.config.ts usa
// esta misma lista, y el admin rechaza URLs de cualquier otro dominio.
export const imageHosts = [
  "images.unsplash.com",
  "res.cloudinary.com",
  "qusqueandotravel.com",
  "www.qusqueandotravel.com",
  // Imágenes subidas desde el admin (endpoint de cPanel).
  "driatechinnovation.com",
  "www.driatechinnovation.com",
];

export function isAllowedImageUrl(value: string) {
  // Imágenes propias de /public (p. ej. /images/hero-machu-picchu-dorado.jpg).
  if (/^\/(?!\/)[\w\-./]+$/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && imageHosts.includes(url.hostname);
  } catch {
    return false;
  }
}
