import experienceImages from "./experience-images.json" with { type: "json" };
import { slugify } from "./utils.js";

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Experience = {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  duration: string;
  location: string;
  difficulty: string;
  modality: string;
  priceFrom: number;
  currency: string;
  mainImage: string;
  gallery: string[];
  includes: string[];
  excludes: string[];
  itinerary: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  status: "ACTIVE" | "DRAFT";
  featured: boolean;
  order: number;
  seoTitle: string;
  seoDescription: string;
};

export const categories: Category[] = [
  "Arqueoastronomía",
  "Cultura",
  "Naturaleza",
  "Machu Picchu",
  "Valle Sagrado",
  "Caminatas",
  "Tours privados",
  "Personalizados",
].map((name) => ({ id: slugify(name), name, slug: slugify(name) }));

// Fotos de cada experiencia (la primera es la principal). Compartido con
// scripts/actualizar-imagenes-experiencias.mjs.
const imagesBySlug: Record<string, string[]> = experienceImages;
const fallbackImages = ["/images/hero-machu-picchu-dorado.jpg"];

type Draft = Omit<Experience, "id" | "slug" | "mainImage" | "gallery" | "status" | "order" | "seoTitle" | "seoDescription" | "currency" | "faqs"> & {
  currency?: string;
  faqs?: Experience["faqs"];
};

const commonFaqs = [
  {
    question: "¿Necesito aclimatarme antes del tour?",
    answer: "Recomendamos llegar a Cusco al menos un día antes para adaptarse mejor a la altura.",
  },
  {
    question: "¿Puedo hacerlo en privado?",
    answer: "Sí. Escríbenos y organizamos la salida privada según disponibilidad.",
  },
];

/** Completa los datos comunes de cada paquete (slug, fotos, SEO…). */
function makeExperience(index: number, draft: Draft): Experience {
  const slug = slugify(draft.name);
  const gallery = imagesBySlug[slug] ?? fallbackImages;
  return {
    ...draft,
    id: slug,
    slug,
    currency: draft.currency ?? "USD",
    mainImage: gallery[0],
    gallery,
    faqs: draft.faqs ?? commonFaqs,
    status: "ACTIVE",
    order: index,
    seoTitle: `${draft.name} | Qusqueando Travel`,
    seoDescription: draft.shortDescription,
  };
}

export const experiences: Experience[] = [
  makeExperience(0, {
    name: "Qosqo Yacta Tradicional",
    category: "Cultura",
    featured: true,
    shortDescription:
      "City tour por el Cusco imperial: Qoricancha, Tambomachay, Puka Pukara, Qenqo y Sacsayhuamán con guía oficial y transporte.",
    fullDescription:
      "Recorre el corazón del Cusco inca y colonial. Empezamos en la Plaza de Armas, la antigua Huacaypata, con visita opcional a la Catedral, joya del arte cusqueño donde se mezclan las influencias andina y europea. Por la calle Loreto llegamos al Qoricancha, santuario cósmico y religioso de los incas: una visita clave para entender su arquitectura y la etnoastronomía que regía su vida social, política y religiosa. Luego subimos al parque arqueológico de Sacsayhuamán para conocer Tambomachay, Puka Pukara, Qenqo y la gran explanada de Sacsayhuamán, con sus muros ciclópeos en forma de rayo.",
    duration: "Medio día (7:30 a. m. – 1:30 p. m.)",
    location: "Cusco y parque arqueológico de Sacsayhuamán",
    difficulty: "Fácil",
    modality: "Grupal o privado",
    priceFrom: 0,
    includes: [
      "Ingreso a los centros arqueológicos de Sacsayhuamán",
      "Ingreso al museo de sitio del Qoricancha",
      "Transporte ida y vuelta desde tu hotel o residencia",
      "Guía oficial de turismo",
    ],
    excludes: ["Ingreso a la Catedral del Cusco (visita opcional)"],
    itinerary: [
      { title: "7:30 a. m. · Recojo y Plaza de Armas", description: "Te recogemos en tu hotel y vamos a la Plaza de Armas, la antigua Huacaypata. Visita opcional de unos 40 minutos a la Catedral, con obras de la escuela cusqueña y de los maestros Bitti, Medoro y Alesio." },
      { title: "Calle Loreto y Qoricancha", description: "Caminamos por la calle Loreto hasta el Qoricancha, santuario cósmico y religioso de los incas. Durante una hora conocerás su arquitectura y la etnoastronomía inca (hasta las 10:00 a. m.)." },
      { title: "10:40 a. m. · Tambomachay", description: "Por la carretera de circunvalación llegamos a Tambomachay: canales y fuentes ceremoniales dedicados al agua, al aire, al fuego y a la tierra (40 min)." },
      { title: "11:20 a. m. · Puka Pukara", description: "Antiguo punto de control para los peregrinos del Collasuyo y el Antisuyo, con un punto de observación de las constelaciones de la Vía Láctea, como el gran Amaru (40 min)." },
      { title: "12:20 p. m. · Qenqo", description: "Roca enigmática con tallados astronómicos, juegos de sombras y una cueva con mesa altar. En los solsticios (21 y 22 de junio) se forma la figura de un puma con luz y sombra (40 min)." },
      { title: "1:10 p. m. · Sacsayhuamán", description: "La gran explanada con piedras ciclópeas de andesita, muros en zigzag que evocan el rayo (Illapa) y el torreón circular de Muyuqmarca (1 hora)." },
      { title: "1:30 p. m. · Retorno", description: "Regresamos a la ciudad y te dejamos en tu hotel u hospedaje." },
    ],
    faqs: [
      { question: "¿Qué debo llevar?", answer: "Casaca abrigadora, zapatos cómodos, lentes de sol, gorra, pasaporte o DNI, efectivo y cámara." },
      ...commonFaqs,
    ],
  }),
  makeExperience(1, {
    name: "Valle Sagrado",
    category: "Valle Sagrado",
    featured: true,
    shortDescription:
      "Día completo por Chinchero, Ollantaytambo y Pisac con guía oficial, almuerzo buffet con show en vivo y transporte.",
    fullDescription:
      "Un día completo por el Valle Sagrado de los Incas. Conocerás Chinchero, con tallados de animales míticos, andenes y huacas orientadas a sus montañas y lagunas sagradas; el valle de Urubamba custodiado por los apus Chicón, Pumahuanca, Sawasiray y Pitusiray; Ollantaytambo, con su Templo del Sol de diorita rosada y la andenería que forma la figura de la llama de la Vía Láctea; y Pisac, con el barrio del Intihuatana rodeado de andenes y acueductos.",
    duration: "Día completo (7:00 a. m. – 7:20 p. m.)",
    location: "Chinchero, Urubamba, Ollantaytambo y Pisac",
    difficulty: "Moderado",
    modality: "Grupal o privado",
    priceFrom: 0,
    includes: [
      "Ingreso a los centros arqueológicos de Pisac, Ollantaytambo y Chinchero",
      "Guía oficial de turismo",
      "Almuerzo buffet con show musical en vivo",
      "Transporte ida y vuelta desde la ciudad del Cusco",
    ],
    excludes: ["Box lunch", "Bebidas"],
    itinerary: [
      { title: "7:00 a. m. · Recojo", description: "Te recogemos en tu hotel u hospedaje y partimos al Valle Sagrado." },
      { title: "8:30 a. m. · Chinchero", description: "Centro arqueológico con tallados ocultos de animales míticos, andenes y huacas dirigidas a sus montañas sagradas y a las lagunas de Piuray y Huaypo. Visitamos también su artesanía textil (1 h 20 min aprox.)." },
      { title: "Valle de Urubamba", description: "Bajamos al valle con vista a los campos de Maras y a los nevados Chicón, Pumahuanca, Sawasiray, Pitusiray y la Verónica (Wakaywillka), acompañados por el río Vilcanota." },
      { title: "12:15 p. m. · Almuerzo buffet", description: "Almuerzo buffet con show musical en vivo en el valle de Huarán, Yanahuara (2 horas)." },
      { title: "2:30 p. m. · Ollantaytambo", description: "Cantería inca y preinca, el Templo del Sol de diorita rosada con chakanas y figuras de felinos y serpientes, y el mito de Tunupa, el sabio viajero (1 hora aprox.)." },
      { title: "5:00 p. m. · Pisac", description: "Barrios del antiguo curacazgo y el sector del Intihuatana, rodeados de grandes andenes, acueductos y un paisaje impresionante." },
      { title: "7:20 p. m. · Retorno a Cusco", description: "Regresamos a la ciudad (1 h 30 min aprox.) y te dejamos en tu hotel u hospedaje." },
    ],
  }),
  makeExperience(2, {
    name: "Free Walking Tour Qosqo Puma City",
    category: "Cultura",
    featured: true,
    shortDescription:
      "Caminata guiada por el Cusco mágico y milenario: calles incas, puntos energéticos y Sacsayhuamán por fuera. Salidas diarias.",
    fullDescription:
      "Un recorrido a pie pensado para todo público. Descubre las calles del Cusco y su cosmogonía de origen andino, preinca e inca, visitando la mayoría de puntos energéticos de esta ciudad milenaria y el Hurin Qosqo, con vista exterior del parque arqueológico de Sacsayhuamán. Salidas diarias en dos horarios: de 8:00 a. m. a 1:00 p. m. y de 2:30 p. m. a 6:30 p. m. Precio para peruanos: S/ 15; extranjeros: USD 10.",
    duration: "4 a 5 horas (salidas 8:00 a. m. y 2:30 p. m.)",
    location: "Centro histórico del Cusco",
    difficulty: "Fácil",
    modality: "Grupal",
    priceFrom: 10,
    includes: ["Agua mineral", "Box lunch", "Guía oficial de turismo", "Show musical"],
    excludes: ["Ingreso a los centros arqueológicos", "Transporte turístico", "Gorras o viseras"],
    itinerary: [
      { title: "Punto de encuentro", description: "Salidas diarias a las 8:00 a. m. y a las 2:30 p. m. en el centro del Cusco." },
      { title: "Calles del Cusco milenario", description: "Caminamos por las calles incas y coloniales conociendo la cosmogonía andina, preinca e inca y sus puntos energéticos." },
      { title: "Hurin Qosqo y Sacsayhuamán", description: "Recorremos el Hurin Qosqo y vemos por fuera el parque arqueológico de Sacsayhuamán." },
      { title: "Cierre", description: "El tour termina a la 1:00 p. m. (turno mañana) o a las 6:30 p. m. (turno tarde)." },
    ],
    faqs: [
      { question: "¿Cuánto cuesta?", answer: "Para peruanos S/ 15 y para extranjeros USD 10 por persona." },
      { question: "¿Qué debo llevar?", answer: "Zapatillas cómodas, gorra con visera o abrigadora, casaca, poncho de lluvia, efectivo, cámara, pasaporte o documento de identidad, snacks y al menos medio litro de agua extra." },
      ...commonFaqs,
    ],
  }),
  makeExperience(3, {
    name: "Valle Sur",
    category: "Cultura",
    featured: true,
    shortDescription:
      "Tipón, Pikillacta, la Capilla Sixtina de América en Andahuaylillas y la laguna de Urcos en un día con guía oficial y transporte.",
    fullDescription:
      "Un día por el valle sur del Cusco. Tipón, con fuentes ceremoniales dedicadas al culto solar y al agua que nacen del apu Pachatusan; Pikillacta, la gran ciudad wari de muros de hasta cuatro metros; Andahuaylillas, la Capilla Sixtina de América, decorada con pan de oro y obras de valor incalculable; y la laguna de Urcos, famosa por la leyenda de los toros encadenados con una cadena de oro.",
    duration: "Día completo (7:00 a. m. – 6:00 p. m.)",
    location: "Tipón, Pikillacta, Andahuaylillas y Urcos",
    difficulty: "Fácil",
    modality: "Grupal o privado",
    priceFrom: 0,
    includes: ["Transporte terrestre ida y vuelta", "Guía oficial de turismo"],
    excludes: [
      "Ingreso a los centros arqueológicos de Tipón y Pikillacta",
      "Ingreso a la capilla de Andahuaylillas",
      "Bebidas",
      "Box lunch",
    ],
    itinerary: [
      { title: "7:00 a. m. · Recojo", description: "Partimos desde la ciudad del Cusco hacia el valle sur (1 h 45 min aprox.)." },
      { title: "Tipón", description: "Fuentes ceremoniales dedicadas al culto solar y al agua, usnus, tambos y canales que nacen del apu Pachatusan (1 hora aprox.)." },
      { title: "Pikillacta", description: "Ciudad wari con muros de argamasa y piedra de hasta cuatro metros, plazas, calles y sitios ceremoniales, luego aprovechada por los incas (1 hora, hasta las 12:10 p. m.)." },
      { title: "12:40 p. m. · Andahuaylillas", description: "La Capilla Sixtina de América, decorada con pan de oro y obras de arte de valor incalculable (35 min). Después, tiempo para almorzar en la plaza (1 hora aprox.)." },
      { title: "2:40 p. m. · Laguna de Urcos", description: "Laguna famosa por la leyenda de los dos toros que salen del agua con una campana de oro (1 hora)." },
      { title: "6:00 p. m. · Retorno", description: "Llegamos a Cusco y te dejamos en tu hotel u hospedaje." },
    ],
    faqs: [
      { question: "¿Qué debo llevar?", answer: "Documentos, ropa abrigadora, poncho de lluvia, zapatillas de planta gruesa, efectivo en soles, cámara, agua y snacks." },
      ...commonFaqs,
    ],
  }),
];
