// Dominios desde los que next/image puede cargar imágenes. next.config.ts usa
// esta misma lista, y el admin rechaza URLs de cualquier otro dominio.
export const imageHosts = [
  "images.unsplash.com",
  "res.cloudinary.com",
  "qusqueandotravel.com",
  "www.qusqueandotravel.com",
];

export function isAllowedImageUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && imageHosts.includes(url.hostname);
  } catch {
    return false;
  }
}
