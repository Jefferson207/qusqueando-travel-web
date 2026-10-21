export const siteConfig = {
  name: "Qusqueando Travel",
  whatsapp: "+51916788768",
  whatsappDisplay: "+51 916 788 768",
  email: "reservas@qusqueandotravel.com",
  address: "Cusco, Perú",
  // El texto después de "|" se muestra en una segunda línea dorada en cursiva.
  heroTitle: "Vive el Perú | como nunca antes",
  heroSubtitle:
    "Experiencias culturales, arqueoastronómicas y de naturaleza diseñadas para conectar con la esencia andina.",
  heroImage: "/images/hero-machu-picchu-dorado.jpg",
  // Imagen de fondo de la sección "¿Por qué elegir Qusqueando?".
  aboutImage: "/images/viajera-machu-picchu.jpg",
  // Ícono del menú superior y logo completo del pie de página.
  logoMark: "/logo-emblem.png",
  logoFull: "/logo.png",
  socials: {
    instagram: "https://instagram.com/qusqueandotravel",
    facebook: "https://facebook.com/qusqueandotravel",
    tiktok: "",
    youtube: "",
  },
};

export type SiteConfig = typeof siteConfig;

// Valores por defecto anteriores: si siguen guardados en Redis sin cambios,
// se reemplazan por los nuevos del rediseño.
export const legacySiteDefaults: Partial<SiteConfig> = {
  heroTitle: "Explora el Perú desde su historia, sus estrellas y su cultura.",
  heroSubtitle:
    "Experiencias culturales, arqueoastronómicas y de naturaleza diseñadas para conectar con la cosmovisión andina.",
  heroImage:
    "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1800&auto=format&fit=crop",
};

export const siteDomain = "qusqueandotravel.com";

// Mensajes prellenados de WhatsApp. WhatsApp muestra *texto* en negrita y
// _texto_ en cursiva. La firma final indica que el contacto viene de la web.
const webSignature = `🌐 _Mensaje enviado desde la web ${siteDomain}_`;

export const whatsappMessages = {
  general: () =>
    [
      "¡Hola, *Qusqueando Travel*! 👋",
      "",
      "Me gustaría recibir *información* sobre sus tours y experiencias en Perú 🏔️",
      "",
      "📋 Me interesa conocer:",
      "• Tours disponibles y *precios* 💰",
      "• *Disponibilidad* de fechas 📅",
      "",
      "¡Muchas gracias! 🙌",
      "",
      webSignature,
    ].join("\n"),

  planTrip: () =>
    [
      "¡Hola, *Qusqueando Travel*! 👋",
      "",
      "Quiero *planear mi viaje a Cusco* ✈️🏔️",
      "",
      "Me gustaría recibir ayuda con:",
      "🗺️ Rutas y experiencias recomendadas",
      "📅 Fechas y duración del viaje",
      "🏛️ Cultura, naturaleza y astronomía andina",
      "",
      "¿Me ayudan a armar mi itinerario? 😊",
      "",
      webSignature,
    ].join("\n"),

  availability: (destination: string, date: string, travelers: string) =>
    [
      "¡Hola, *Qusqueando Travel*! 👋",
      "",
      "Quisiera consultar *disponibilidad* para:",
      `📍 Destino: *${destination || "Por definir"}*`,
      `📅 Fecha: *${date || "Por definir"}*`,
      `👥 Viajeros: *${travelers}*`,
      "",
      "¿Qué experiencias me recomiendan? 😊",
      "",
      webSignature,
    ].join("\n"),

  experience: (name: string, slug?: string) =>
    [
      "¡Hola, *Qusqueando Travel*! 👋",
      "",
      `Me interesa reservar: *${name}* 🏔️`,
      "",
      "¿Me podrían confirmar?",
      "📅 *Disponibilidad* de fechas",
      "💰 *Precio* por persona",
      "👥 Opciones privada o compartida",
      ...(slug ? ["", `🔗 https://${siteDomain}/experiencias/${slug}`] : []),
      "",
      webSignature,
    ].join("\n"),
};

// Se usa api.whatsapp.com/send en lugar de wa.me: la redirección de wa.me
// corrompe los emojis (aparecen como �). En escritorio, WhatsappDesktopLinks
// cambia estos enlaces por web.whatsapp.com.
const whatsappApiUrl = "https://api.whatsapp.com/send";
const whatsappWebUrl = "https://web.whatsapp.com/send";

export function whatsappMessageUrl(phone: string, message: string) {
  const params = new URLSearchParams({ phone: phone.replace(/\D/g, ""), text: message });
  return `${whatsappApiUrl}?${params.toString().replace(/\+/g, "%20")}`;
}

export function toWhatsappWebUrl(href: string) {
  if (!href.startsWith(whatsappApiUrl)) return null;
  return whatsappWebUrl + href.slice(whatsappApiUrl.length);
}

export function whatsappUrl(phone: string, experienceName?: string, experienceSlug?: string) {
  const message = experienceName
    ? whatsappMessages.experience(experienceName, experienceSlug)
    : whatsappMessages.general();

  return whatsappMessageUrl(phone, message);
}
