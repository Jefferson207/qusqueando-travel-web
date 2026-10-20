import { slugify } from "@/lib/utils";

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

const imageBank = [
  "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531968455001-5c5272a41129?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1627896157734-4d7d438b0896?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop",
];

const baseIncludes = [
  "Guía especializado",
  "Asistencia permanente",
  "Briefing previo a la salida",
  "Botiquín básico",
];

const baseExcludes = ["Almuerzos no indicados", "Propinas", "Gastos personales"];

function makeExperience(
  index: number,
  name: string,
  category: string,
  duration: string,
  location: string,
  priceFrom: number,
  featured = false,
): Experience {
  const slug = slugify(name);
  return {
    id: slug,
    name,
    slug,
    category,
    shortDescription:
      "Una experiencia diseñada para descubrir patrimonio, paisaje y conocimiento andino con mirada contemporánea.",
    fullDescription:
      "Recorrido curado por Qusqueando Travel para viajeros que buscan comprender el territorio peruano desde su historia, sus símbolos y la relación de las culturas andinas con el cielo. Integramos interpretación cultural, tiempos cómodos y acompañamiento experto.",
    duration,
    location,
    difficulty: index % 3 === 0 ? "Moderado" : "Fácil",
    modality: index % 2 === 0 ? "Privado o compartido" : "Privado",
    priceFrom,
    currency: "USD",
    mainImage: imageBank[index % imageBank.length],
    gallery: [
      imageBank[index % imageBank.length],
      imageBank[(index + 1) % imageBank.length],
      imageBank[(index + 2) % imageBank.length],
    ],
    includes: baseIncludes,
    excludes: baseExcludes,
    itinerary: [
      {
        title: "Encuentro y contexto",
        description:
          "Recepción, introducción cultural y salida hacia los principales puntos de interpretación.",
      },
      {
        title: "Exploración guiada",
        description:
          "Recorrido por espacios arqueológicos o naturales con explicación histórica y simbólica.",
      },
      {
        title: "Cierre de experiencia",
        description:
          "Tiempo para fotografías, preguntas y retorno coordinado al punto acordado.",
      },
    ],
    faqs: [
      {
        question: "¿La experiencia requiere aclimatación?",
        answer:
          "Recomendamos llegar a Cusco al menos un día antes para adaptarse mejor a la altura.",
      },
      {
        question: "¿Puedo reservar una salida privada?",
        answer:
          "Sí. Todas las experiencias pueden organizarse de forma privada según disponibilidad.",
      },
    ],
    status: "ACTIVE",
    featured,
    order: index,
    seoTitle: `${name} | Qusqueando Travel`,
    seoDescription: `Reserva ${name} con Qusqueando Travel y descubre una experiencia cultural premium en Perú.`,
  };
}

export const experiences: Experience[] = [
  makeExperience(0, "Machu Picchu", "Machu Picchu", "Full day", "Cusco y Machu Picchu", 289, true),
  makeExperience(1, "Valle Sagrado", "Valle Sagrado", "1 día", "Pisac, Urubamba y Ollantaytambo", 95, true),
  makeExperience(2, "Waqrapukara", "Caminatas", "Full day", "Acomayo, Cusco", 120, true),
  makeExperience(3, "City Tour Cusco", "Cultura", "Medio día", "Centro histórico de Cusco", 45, true),
  makeExperience(4, "Tour Arqueoastronómico", "Arqueoastronomía", "1 día", "Cusco", 135, true),
  makeExperience(5, "Observación de Estrellas", "Arqueoastronomía", "Noche", "Valle Sagrado", 80, true),
  makeExperience(6, "Solsticio de Invierno", "Arqueoastronomía", "1 día", "Cusco", 150),
  makeExperience(7, "Equinoccio", "Arqueoastronomía", "1 día", "Cusco", 150),
  makeExperience(8, "Tour Privado", "Tours privados", "A medida", "Perú", 180),
  makeExperience(9, "Paquete Personalizado", "Personalizados", "Flexible", "Perú", 250),
];
