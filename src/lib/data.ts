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
    priceFrom: 45,
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
    priceFrom: 65,
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
    priceFrom: 30,
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
  makeExperience(4, {
    name: "Tour a Machu Picchu 1 día",
    category: "Machu Picchu",
    featured: true,
    shortDescription:
      "Una maravilla del mundo te espera. ¡Vive la experiencia de conocer Machu Picchu en un solo día!",
    fullDescription:
      "¿Te imaginas contemplar con tus propios ojos una de las maravillas más extraordinarias del planeta?\nPrepárate para vivir una experiencia inolvidable recorriendo los impresionantes paisajes de los Andes hasta llegar a la majestuosa ciudadela inca de Machu Picchu.\nNuestro tour Machu Picchu Full Day desde Cusco está diseñado para viajeros que desean aprovechar al máximo su estadía en Perú, combinando comodidad, organización y descubrimiento cultural en una sola jornada.\n\nUna maravilla del mundo, un viaje extraordinario y una experiencia para toda la vida.\n\nUNA EXPERIENCIA, UN DESTINO Y UN RECUERDO PARA TODA LA VIDA.\nDesde los paisajes del Valle Sagrado hasta la majestuosidad de Machu Picchu, cada etapa de este viaje está pensada para acercarte a la historia y grandeza de la civilización inca.\n¡No dejes que te lo cuenten! Ven a descubrir Machu Picchu y vive la magia de los Andes.\n\nQUSQUEANDO – TURISMO CON ALMA\nConectamos corazones con culturas.",
    duration: "Full Day",
    location: "Cusco, Ollantaytambo, Aguas Calientes y Machu Picchu",
    difficulty: "Moderado",
    modality: "Grupal o privado",
    priceFrom: 0,
    includes: [
      "Transporte turístico Cusco – estación de tren de Ollantaytambo – Cusco.",
      "Boletos de tren turístico de ida y retorno (Inca Rail – Voyager, según servicio confirmado).",
      "Buses CONSETTUR de subida y bajada entre Aguas Calientes y Machu Picchu.",
      "Boleto de ingreso al Santuario Histórico de Machu Picchu, según circuito y horario confirmado.",
      "Guía oficial de turismo profesional y acreditado.",
      "Coordinación y asistencia durante toda la excursión.",
    ],
    excludes: [
      "Almuerzo y alimentación no especificada en el programa.",
      "Bebidas y snacks.",
      "Ingresos adicionales a Huayna Picchu, Montaña Machu Picchu u otras rutas especiales, salvo contratación expresa.",
      "Compras y gastos personales.",
      "Propinas.",
      "Otros servicios o gastos no detallados en la sección de servicios incluidos.",
    ],
    itinerary: [
      { title: "RECOJO EN CUSCO Y TRASLADO A OLLANTAYTAMBO", description: "¡Comienza la aventura hacia la maravilla del mundo!\nIniciaremos nuestra experiencia con el recojo desde tu hotel en Cusco, siempre que se encuentre dentro de nuestra zona de recojo establecida. De lo contrario, coordinaremos un punto de encuentro cercano.\nPartiremos en transporte turístico hacia Ollantaytambo, atravesando los impresionantes paisajes del Valle Sagrado de los Incas. Durante el recorrido podrás contemplar montañas, campos agrícolas y pintorescos poblados andinos.\nLlegaremos a la estación ferroviaria de Ollantaytambo para continuar nuestra aventura hacia Machu Picchu." },
      { title: "VIAJE EN TREN HACIA AGUAS CALIENTES", description: "Un recorrido panorámico entre montañas y naturaleza.\nAbordaremos nuestro tren turístico con destino a Aguas Calientes, también conocido como Machu Picchu Pueblo.\nDurante el trayecto disfrutarás de una experiencia visual extraordinaria, atravesando paisajes andinos, montañas imponentes, vegetación exuberante y el hermoso entorno natural del río Vilcanota.\nEste viaje ferroviario será parte de una aventura que nos acercará cada vez más a uno de los destinos más fascinantes del planeta." },
      { title: "ASCENSO EN BUS HACIA MACHU PICCHU", description: "Cada vez más cerca de la ciudad sagrada de los Incas.\nAl llegar a Aguas Calientes, nos dirigiremos hacia la estación de buses CONSETTUR para abordar el transporte turístico que nos llevará por la carretera Hiram Bingham hasta la entrada del Santuario Histórico de Machu Picchu.\nDurante el ascenso disfrutaremos de espectaculares vistas de las montañas que rodean este extraordinario complejo arqueológico.\nAl llegar, presentaremos nuestros documentos y boletos de ingreso para comenzar una de las experiencias más esperadas de nuestro viaje." },
      { title: "VISITA GUIADA A MACHU PICCHU", description: "¡El gran momento ha llegado: descubre una de las siete maravillas del mundo moderno!\nAcompañados por nuestro guía oficial de turismo, ingresaremos a la majestuosa ciudadela de Machu Picchu para descubrir la historia, arquitectura y conocimientos de la extraordinaria civilización inca.\nDurante aproximadamente 2 a 2 horas y 30 minutos, recorreremos los sectores contemplados en nuestro circuito de ingreso, apreciando sus impresionantes construcciones de piedra, terrazas agrícolas, templos y espacios ceremoniales.\nConoceremos la ingeniería desarrollada por los antiguos incas, su relación con las montañas sagradas y la importancia de la naturaleza dentro de su cosmovisión.\nNo será solamente una visita arqueológica: será una oportunidad para comprender el legado de una civilización que continúa sorprendiendo al mundo." },
      { title: "DESCENSO A AGUAS CALIENTES Y TIEMPO LIBRE", description: "Disfruta los últimos momentos de esta experiencia inolvidable.\nAl finalizar nuestra visita guiada, descenderemos en bus turístico hacia Aguas Calientes.\nDependiendo del horario de nuestro tren de retorno, dispondremos de tiempo libre para disfrutar del pueblo, almorzar por cuenta propia, conocer sus calles comerciales o adquirir algunos recuerdos de esta extraordinaria aventura.\nPosteriormente, nos dirigiremos a la estación ferroviaria para continuar nuestro viaje de regreso." },
      { title: "TREN DE RETORNO A OLLANTAYTAMBO", description: "Un último recorrido por los paisajes de los Andes.\nA la hora programada abordaremos nuestro tren turístico de retorno hacia Ollantaytambo.\nDurante el trayecto podremos contemplar nuevamente los hermosos paisajes naturales que acompañaron nuestra aventura, recordando los momentos vividos en la ciudad sagrada de los Incas." },
      { title: "TRASLADO DE OLLANTAYTAMBO A CUSCO", description: "Regresamos con una historia que contar.\nAl llegar a la estación ferroviaria de Ollantaytambo, nuestro transporte turístico estará esperándote para realizar el traslado de retorno hacia la ciudad del Cusco.\nLa hora de llegada dependerá del horario del tren confirmado y de las condiciones del trayecto.\nConcluiremos así una jornada extraordinaria llena de historia, cultura, naturaleza y descubrimientos." },
    ],
    faqs: [
      {
        question: "RECOMENDACIONES PARA EL VIAJERO",
        answer: "• Llevar pasaporte o documento de identidad original utilizado para la reserva.\n• Llevar ropa cómoda y zapatillas adecuadas para caminar.\n• Utilizar protector solar, gorra y repelente.\n• Llevar agua y algunos snacks.\n• Tener a mano los boletos de tren y de ingreso a Machu Picchu.",
      },
      {
        question: "IMPORTANTE",
        answer: "El ingreso a Machu Picchu está sujeto al circuito, fecha y horario asignados en el boleto oficial. Los horarios de tren y las conexiones terrestres se coordinan de acuerdo con la disponibilidad confirmada.",
      },
    ],
  }),
  makeExperience(5, {
    name: "Qoricancha + 4 ruinas",
    category: "Cultura",
    featured: true,
    shortDescription: "Descubre los secretos de la capital del Imperio Inca en una experiencia inolvidable.",
    fullDescription:
      "¿Te imaginas caminar por los mismos escenarios donde se desarrolló una de las civilizaciones más extraordinarias de América?\nDescubre Cusco desde una perspectiva diferente con nuestro City Tour Cusco, una experiencia cultural y arqueológica que te llevará a conocer los principales monumentos que conservan el legado de la civilización inca.\nDurante este recorrido de medio día visitaremos el majestuoso Qoricancha, el legendario Templo del Sol, considerado uno de los espacios religiosos más importantes del antiguo Tahuantinsuyo. Aquí descubrirás cómo los incas desarrollaron una arquitectura de extraordinaria precisión y cómo este recinto representaba el centro de su cosmovisión religiosa.\n\nMedio día de historia, cultura y descubrimiento por la antigua capital del Imperio Inca.\n\nUNA EXPERIENCIA QUE VA MÁS ALLÁ DE UNA VISITA TURÍSTICA\nEn pocas horas descubrirás cinco importantes testimonios del legado inca, conocerás sus técnicas constructivas, sus espacios ceremoniales y su extraordinaria relación con la naturaleza.\nNo te quedes solamente con las fotografías: descubre las historias que esconden las piedras de Cusco.\n\nQUSQUEANDO – TURISMO CON ALMA\nDescubre Cusco, conecta con su historia y vive la grandeza de los Incas.\n\n¿QUÉ INCLUYE NUESTRO CITY TOUR CUSCO?\nDisfruta de una experiencia cultural y arqueológica con transporte turístico, acompañamiento profesional y asistencia durante todo el recorrido.",
    duration: "Half Day",
    location: "Cusco",
    difficulty: "Moderado",
    modality: "Grupal o privado",
    priceFrom: 0,
    includes: [
      "Recojo desde su hotel o alojamiento ubicado cerca de la Plaza de Armas de Cusco.",
      "Transporte turístico durante todo el recorrido.",
      "Guía oficial de turismo profesional y acreditado.",
      "Coordinación y asistencia durante el servicio.",
    ],
    excludes: [
      "Boletos de ingreso a los atractivos turísticos (Qoricancha y Parque Arqueológico de Sacsayhuamán y sus sitios).",
      "Alimentación y bebidas.",
      "Gastos personales.",
      "Otros servicios o gastos no especificados en el programa.",
    ],
    itinerary: [
      { title: "RECOJO EN CUSCO – COMIENZA LA AVENTURA", description: "Iniciaremos nuestra experiencia con el recojo desde tu hotel en Cusco, según el horario reservado. Dejaremos atrás el centro histórico para descubrir los monumentos arqueológicos más importantes que rodean la antigua capital del Tahuantinsuyo.\nPrepárate para descubrir los secretos de una civilización que sorprendió al mundo con sus conocimientos de arquitectura, ingeniería y astronomía." },
      { title: "QORICANCHA – EL LEGENDARIO TEMPLO DEL SOL", description: "Nuestra primera parada será el impresionante Qoricancha, considerado uno de los centros religiosos más importantes del Imperio Inca.\nAcompañados por nuestro guía profesional, conoceremos la historia del recinto dedicado al culto del Sol y descubriremos la extraordinaria precisión de sus construcciones de piedra, que hoy conviven con la arquitectura colonial del Convento de Santo Domingo.\nUna visita imprescindible para comprender la espiritualidad y el poder religioso de la civilización inca." },
      { title: "SACSAYHUAMÁN Y QENQO – EL PODER DE LA ARQUITECTURA INCA", description: "Continuaremos hacia Sacsayhuamán, una de las construcciones monumentales más sorprendentes de los Andes.\nContemplaremos sus enormes bloques de piedra perfectamente ensamblados, sus impresionantes murallas y sus espacios ceremoniales. Descubriremos cómo los incas desarrollaron técnicas constructivas que continúan despertando admiración.\nNuestra siguiente parada será Qenqo, un fascinante centro ceremonial donde encontraremos formaciones rocosas talladas y espacios asociados a las antiguas prácticas rituales andinas.\nAquí descubrirás que para los incas las montañas, las piedras y la naturaleza tenían un profundo significado espiritual." },
      { title: "PUCA PUCARA – EL ENIGMÁTICO COMPLEJO DE PIEDRA", description: "Seguiremos nuestro recorrido hacia Puca Pucara, un conjunto arqueológico ubicado estratégicamente en las alturas de Cusco.\nConoceremos sus terrazas, recintos y construcciones de piedra, además de su posible función como punto de control y vigilancia dentro de la red de caminos del antiguo territorio inca.\nDesde este lugar también disfrutaremos de hermosos paisajes andinos." },
      { title: "TAMBOMACHAY – EL TEMPLO DEL AGUA", description: "Nuestra última visita arqueológica será Tambomachay, un extraordinario conjunto arquitectónico reconocido por sus fuentes, canales y caídas de agua.\nDescubriremos el avanzado conocimiento hidráulico de los incas y la importancia que tenía el agua dentro de su cosmovisión, donde este elemento representaba vida, purificación y conexión con la naturaleza.\nUn lugar perfecto para comprender la relación entre ingeniería, espiritualidad y paisaje en el mundo andino." },
      { title: "RETORNO AL CENTRO HISTÓRICO DE CUSCO", description: "Después de completar nuestro recorrido por los principales atractivos arqueológicos, retornaremos al centro histórico de Cusco, dando por finalizada esta enriquecedora experiencia de medio día." },
    ],
    faqs: [
      {
        question: "RECOMENDACIÓN",
        answer: "Se recomienda llevar efectivo para el pago de ingresos, documento de identidad, cámara fotográfica, ropa cómoda, zapatillas para caminar, gorra, protector solar y una casaca abrigadora.",
      },
    ],
  }),
  makeExperience(6, {
    name: "Tour Valle Sagrado VIP desde Cusco",
    category: "Valle Sagrado",
    featured: true,
    shortDescription:
      "El Valle Sagrado VIP es una experiencia diseñada para descubrir la riqueza histórica, cultural y paisajística de Cusco en una sola excursión de día completo.",
    fullDescription:
      "El Valle Sagrado VIP es una experiencia diseñada para descubrir la riqueza histórica, cultural y paisajística de Cusco en una sola excursión de día completo.\nA lo largo de esta ruta exploraremos algunos de los lugares más representativos del legado inca y de las tradiciones andinas. Visitaremos Chinchero, donde conoceremos el arte ancestral del tejido; Moray, con sus impresionantes terrazas circulares; y las famosas Salineras de Maras, un paisaje único donde las familias locales mantienen viva la tradición de extracción de sal.\nContinuaremos hacia Urubamba, donde disfrutaremos de un almuerzo buffet rodeados de los paisajes del Valle Sagrado. Posteriormente, conoceremos Ollantaytambo, una extraordinaria ciudad inca que conserva calles, canales y construcciones ancestrales.\nNuestra última visita será Pisac, reconocido por su impresionante complejo arqueológico, sus terrazas agrícolas y sus vistas panorámicas del valle.\nEsta experiencia combina arqueología, cultura viva, arquitectura, paisajes y gastronomía en un solo recorrido.\nEs una excelente alternativa para quienes disponen de poco tiempo en Cusco y desean descubrir los principales atractivos del Valle Sagrado aprovechando al máximo su jornada.\n\n¿Qué hace especial esta experiencia?\n• Cultura viva: conoce las técnicas tradicionales de tejido de Chinchero.\n• Ingeniería inca: descubre las extraordinarias terrazas circulares de Moray.\n• Tradición milenaria: contempla las miles de pozas de sal de Maras.\n• Gastronomía regional: disfruta de un almuerzo buffet en Urubamba.\n• Historia y arquitectura: explora la fortaleza y el pueblo tradicional de Ollantaytambo.\n• Paisajes arqueológicos: descubre las terrazas y construcciones incas de Pisac.\n\nVALLE SAGRADO VIP – FULL DAY\nChinchero – Moray – Maras – Urubamba – Ollantaytambo – Pisac\nUn viaje por la historia, la ingeniería inca y las tradiciones vivas de los Andes.\n\nQUSQUEANDO – TURISMO CON ALMA\nSeis destinos, un solo recorrido y miles de años de historia por descubrir.\n\nLos ingresos a los atractivos turísticos se pagan por separado. Nuestro guía te orientará durante el recorrido para que puedas adquirir los boleto",
    duration: "Full Day",
    location: "Chinchero – Moray – Maras – Urubamba – Ollantaytambo – Pisac",
    difficulty: "Moderado",
    modality: "Grupal o privado",
    priceFrom: 0,
    includes: [
      "Transporte turístico durante todo el recorrido.",
      "Recojo desde el hotel, si se encuentra cerca del centro histórico de Cusco, o desde un punto de encuentro previamente coordinado.",
      "Guía turístico profesional bilingüe (español e inglés).",
      "Almuerzo buffet en Urubamba.",
      "Coordinación y asistencia durante toda la excursión.",
    ],
    excludes: [
      "Boleto Turístico para ingresar a los complejos arqueológicos.",
      "Boleto de ingreso a las Salineras de Maras.",
      "Desayuno.",
      "Bebidas adicionales y snacks.",
      "Compras personales en los talleres artesanales.",
      "Propinas voluntarias.",
      "Otros gastos personales no especificados en los servicios incluidos.",
    ],
    itinerary: [
      { title: "Recojo en Cusco e inicio del recorrido", description: "Horario: 06:00 a 06:40 h\nIniciaremos nuestra experiencia con el recojo desde tu hotel, siempre que se encuentre cerca del centro histórico de Cusco. Si está fuera de esta zona, coordinaremos previamente un punto de encuentro.\nAcompañados por nuestro guía profesional, abordaremos el transporte turístico para emprender una jornada de descubrimiento por algunos de los lugares más representativos del Valle Sagrado de los Incas." },
      { title: "Chinchero: arqueología y tradición textil", description: "Nuestra primera parada será en Chinchero, un pueblo andino que conserva una extraordinaria herencia histórica y cultural.\nVisitaremos su complejo arqueológico, relacionado con el antiguo palacio de Túpac Inca Yupanqui, donde apreciaremos muros incas, terrazas y construcciones que reflejan la transición entre el mundo inca y la época colonial.\nPosteriormente, conoceremos un taller textil tradicional. Las artesanas locales nos mostrarán las técnicas ancestrales de tejido y teñido con pigmentos naturales, conocimientos transmitidos de generación en generación." },
      { title: "Moray: el conocimiento agrícola de los incas", description: "Continuaremos hacia Moray, uno de los complejos arqueológicos más sorprendentes de Cusco.\nSus impresionantes terrazas circulares, construidas a diferentes niveles, forman un paisaje arquitectónico único. Durante la visita conoceremos las interpretaciones sobre su posible función agrícola y cómo los antiguos habitantes de los Andes aprovecharon las características del terreno y sus diferentes condiciones ambientales.\nTendremos tiempo para apreciar este extraordinario escenario y tomar fotografías." },
      { title: "Salineras de Maras: un paisaje de tradición milenaria", description: "Nuestra siguiente visita serán las famosas Salineras de Maras, un impresionante conjunto de más de 3,000 pozas de sal distribuidas sobre la ladera de una montaña.\nDurante el recorrido descubriremos cómo el agua salada de un manantial alimenta las pozas y cómo, mediante la evaporación, se obtiene la reconocida sal de Maras.\nAdemás de contemplar este paisaje singular, conoceremos la importancia de esta actividad tradicional para las familias de la comunidad." },
      { title: "Urubamba: almuerzo buffet en el Valle Sagrado", description: "Después de nuestras visitas, nos dirigiremos hacia Urubamba, ubicada en el corazón del Valle Sagrado.\nAquí disfrutaremos de un delicioso almuerzo buffet, con tiempo aproximado de una hora para descansar, recuperar energías y disfrutar de la gastronomía regional antes de continuar nuestra aventura." },
      { title: "Ollantaytambo: fortaleza y Templo del Sol", description: "Continuaremos hacia Ollantaytambo, uno de los complejos arqueológicos más impresionantes del legado inca.\nRecorreremos sus extraordinarias terrazas, escalinatas y construcciones de piedra, mientras nuestro guía nos explicará la importancia estratégica, religiosa y ceremonial de este antiguo centro inca.\nEn la parte superior del complejo conoceremos el sector conocido como Templo del Sol, donde destacan sus enormes bloques de piedra y la impresionante vista de las montañas que rodean el valle." },
      { title: "Pisac: arqueología y tradición artesanal", description: "Nuestra última visita será al complejo arqueológico de Pisac, reconocido por sus extensas terrazas agrícolas, construcciones incas y extraordinaria ubicación sobre las montañas del Valle Sagrado.\nDurante el recorrido conoceremos sus principales sectores arqueológicos y la importancia de sus antiguos sistemas agrícolas y funerarios.\nPosteriormente, visitaremos un taller de orfebrería local, donde conoceremos diferentes técnicas artesanales utilizadas para trabajar metales y piedras ornamentales, una expresión del talento y la creatividad de los artesanos de la región." },
      { title: "Retorno a Cusco", description: "Después de completar nuestro recorrido por los principales atractivos del Valle Sagrado, emprenderemos el viaje de regreso hacia la ciudad de Cusco.\nFinalizaremos nuestra excursión cerca de la Plaza de Armas, con una hora aproximada de llegada entre las 18:30 y 19:00 h.\nRegresaremos con una experiencia llena de historia, cultura, paisajes y conocimientos ancestrales que nos permitirán comprender mejor la grandeza de la civilización inca." },
    ],
    faqs: [],
  }),
  makeExperience(7, {
    name: "Machupicchu vip en 2 dias 1 noche",
    category: "Machu Picchu",
    featured: true,
    shortDescription:
      "Una experiencia exclusiva entre historia, cultura viva y una de las 7 maravillas del mundo moderno.",
    fullDescription:
      "Descubre el legado de los Incas en un viaje extraordinario por el Valle Sagrado y Machu Picchu. Vive dos días de aventura, comodidad y descubrimiento, recorriendo paisajes impresionantes, centros arqueológicos milenarios y pueblos andinos donde las tradiciones ancestrales siguen vivas.\nEste programa VIP ha sido diseñado para quienes desean aprovechar al máximo su viaje, disfrutar de los principales atractivos del Cusco y conocer Machu Picchu con una experiencia organizada, cómoda y acompañada por un guía profesional.\n\n2 DÍAS / 1 NOCHE – CONEXIÓN INCA\nUna experiencia extraordinaria que conecta historia, cultura viva y la maravilla del mundo.\n\nFIN DE NUESTROS SERVICIOS\nDos días, una conexión con la historia y un recuerdo que permanecerá para toda la vida.\nQusqueando – Turismo con Alma\n¡No solamente visites el mundo inca, vive su historia!\n\n•  Idiomas disponibles: Español e inglés.\n•  Categoría: Arqueología, cultura, naturaleza y aventura.",
    duration: "2 días / 1 noche",
    location: "Cusco – Valle Sagrado – Machu Picchu",
    difficulty: "Moderado",
    modality: "Grupal o privado",
    priceFrom: 0,
    includes: [
      "Recojo desde su hotel o alojamiento ubicado cerca de la Plaza de Armas de Cusco.",
      "Transporte turístico durante el recorrido del Valle Sagrado.",
      "Asesoría y asistencia permanente durante el viaje.",
      "Almuerzo buffet en Urubamba.",
      "1 noche de alojamiento en hotel de 3 estrellas en Aguas Calientes.",
      "Guía oficial de turismo profesional y acreditado.",
      "Ingresos a los centros arqueológicos contemplados en el itinerario.",
      "Tren turístico de ida y retorno entre Ollantaytambo y Aguas Calientes.",
      "Ingreso a las Salineras de Maras.",
      "Boleto de ingreso al Santuario Histórico de Machu Picchu.",
    ],
    excludes: [
      "Gastos extras y consumos personales.",
      "Cena durante el recorrido.",
      "Bebidas adicionales durante los almuerzos.",
      "Servicios o actividades no especificados en el programa.",
      "Otros gastos no detallados en la sección de servicios incluidos.",
    ],
    itinerary: [
      { title: "DÍA 1: VALLE SAGRADO VIP – RUTA CULTURAL Y ARQUEOLÓGICA", description: "06:40 – 07:00 AM | Recojo desde su alojamiento en Cusco\nIniciaremos nuestra aventura con el recojo desde su hotel o alojamiento para descubrir los impresionantes paisajes del Valle Sagrado de los Incas." },
      { title: "CHINCHERO – TRADICIÓN TEXTIL Y HERENCIA INCA", description: "Nuestra primera parada será el pintoresco poblado de Chinchero, donde visitaremos su centro arqueológico y conoceremos su emblemática iglesia colonial desde el exterior.\nTambién visitaremos una casa artesanal tradicional, donde descubriremos los secretos de la textilería andina: el lavado, teñido con pigmentos naturales y procesamiento de las fibras de alpaca y otros camélidos sudamericanos." },
      { title: "MORAY – EL LABORATORIO AGRÍCOLA INCA", description: "Continuaremos hacia Moray, un impresionante conjunto de terrazas circulares que demuestra los avanzados conocimientos agrícolas de la civilización inca. Descubriremos cómo los antiguos habitantes experimentaban con diferentes condiciones climáticas para adaptar sus cultivos." },
      { title: "SALINERAS DE MARAS – EL TESORO BLANCO DE LOS ANDES", description: "Visitaremos las famosas minas de sal de Maras, un extraordinario conjunto de más de 3,000 pozas de evaporación construidas en las laderas de la montaña. Aquí conoceremos una tradición milenaria de extracción de sal que continúa siendo trabajada por las familias locales." },
      { title: "URUBAMBA – EXPERIENCIA GASTRONÓMICA ANDINA", description: "Llegaremos a Urubamba, considerado el corazón del Valle Sagrado, donde disfrutaremos de un delicioso almuerzo buffet en un reconocido restaurante turístico, con una variedad de sabores de la gastronomía peruana." },
      { title: "OLLANTAYTAMBO – LA GRAN FORTALEZA INCA", description: "Por la tarde visitaremos la majestuosa fortaleza de Ollantaytambo, uno de los complejos arqueológicos más impresionantes del mundo andino.\nAcompañados por nuestro guía profesional, descubriremos sus imponentes terrazas agrícolas, canales hidráulicos, templos y monumentales construcciones de piedra, vinculadas al desarrollo del Imperio Inca durante el gobierno de Pachacútec.\nAl finalizar la visita, nos dirigiremos a la estación ferroviaria para abordar nuestro tren hacia Aguas Calientes." },
      { title: "AGUAS CALIENTES – DESCANSO ANTES DE LA GRAN AVENTURA", description: "A nuestra llegada, nuestro representante estará esperándolos en la estación de trenes con un cartel identificatorio con su nombre para brindarles asistencia y acompañarlos hasta su hotel.\nDisfrutaremos de una noche de descanso en un acogedor hotel de 3 estrellas, preparándonos para el encuentro con una de las maravillas más extraordinarias del planeta.\nAlojamiento: Hotel de 3 estrellas en Aguas Calientes." },
      { title: "DÍA 2: MACHU PICCHU – LA MARAVILLA DEL MUNDO", description: "EL GRAN DÍA HA LLEGADO: DESCUBRE LA CIUDAD SAGRADA DE LOS INCAS.\nDe acuerdo con el horario asignado para el ingreso, nos dirigiremos a la estación de buses CONSETTUR para ascender hacia el Santuario Histórico de Machu Picchu." },
      { title: "ASCENSO EN BUS A MACHU PICCHU", description: "Disfrutaremos de un recorrido panorámico por las montañas que rodean este impresionante santuario, hasta llegar a la puerta de ingreso." },
      { title: "VISITA GUIADA A MACHU PICCHU – 2 HORAS Y 30 MINUTOS", description: "Acompañados por nuestro guía oficial de turismo, realizaremos una visita guiada por los principales sectores contemplados en el circuito de ingreso asignado.\nDescubriremos sus templos, recintos ceremoniales, terrazas agrícolas, miradores y sorprendentes estructuras arquitectónicas.\nConoceremos la historia, ingeniería, astronomía y cosmovisión andina que hicieron de Machu Picchu una de las expresiones más extraordinarias del conocimiento de la civilización inca.\nSerá una experiencia única para comprender el legado de nuestros antepasados y contemplar la grandeza de una de las siete maravillas del mundo moderno." },
      { title: "RETORNO A CUSCO", description: "Después de nuestra visita, descenderemos en bus hacia el pueblo de Aguas Calientes para dirigirnos a la estación ferroviaria y abordar nuestro tren de retorno hacia Ollantaytambo.\nA nuestra llegada, nuestro representante estará esperándolos a la salida de la estación con un cartel identificatorio para realizar el traslado terrestre de regreso hasta su hotel en Cusco." },
    ],
    faqs: [
      {
        question: "IMPORTANTE",
        answer: "Los servicios se brindan de acuerdo con los horarios, boletos y condiciones de operación establecidos para cada actividad. El ingreso a Machu Picchu está sujeto al circuito y horario asignados",
      },
    ],
  }),
  makeExperience(8, {
    name: "VACACIONES EN CUSCO – 8 DÍAS / 7 NOCHES",
    category: "Personalizados",
    featured: true,
    shortDescription: "Una aventura extraordinaria por la tierra de los Incas",
    fullDescription:
      "Historia, cultura viva, maravillas arqueológicas y paisajes naturales en un solo viaje.\n¿Te imaginas descubrir una de las civilizaciones más fascinantes del mundo, caminar entre montañas sagradas, contemplar paisajes impresionantes y conocer una de las siete maravillas del mundo moderno?\nCon nuestro programa Vacaciones en Cusco 8 días / 7 noches, vivirás una experiencia integral diseñada para descubrir lo mejor de los Andes peruanos. Una combinación perfecta de historia, arqueología, aventura, gastronomía y tradiciones ancestrales.\nDurante ocho días recorrerás escenarios extraordinarios, acompañado por profesionales del turismo que te ayudarán a comprender la riqueza cultural y natural de nuestra tierra.\n\nVACACIONES EN CUSCO – 8 DÍAS / 7 NOCHES\nCUSCO MÁGICO: HISTORIA, CULTURA Y AVENTURA\nOcho días descubriendo los tesoros del Imperio Inca, paisajes naturales extraordinarios y una de las maravillas del mundo.\n¿Estás preparado para vivir una experiencia que recordarás toda la vida?\nTe invitamos a descubrir Cusco a través de un viaje diseñado para combinar historia, arqueología, cultura viva, gastronomía y aventura. Desde los impresionantes templos incas hasta las montañas de colores y lagunas turquesas, cada día te permitirá conocer una nueva faceta de los Andes peruanos.\n\nFIN DE NUESTROS SERVICIOS\nOCHO DÍAS DE EXPERIENCIAS QUE CONECTAN CON EL ALMA DE LOS ANDES\nDesde las antiguas construcciones incas hasta las montañas de colores, desde la magia de Machu Picchu hasta las aguas turquesas de Humantay, este viaje reúne lo mejor de Cusco en una sola experiencia.\nNo vengas solamente a conocer Cusco. Ven a vivirlo.\n\nQUSQUEANDO – TURISMO CON ALMA\nConectamos corazones con culturas.",
    duration: "8 días / 7 noches",
    location: "Cusco",
    difficulty: "Moderado",
    modality: "Grupal o privado",
    priceFrom: 0,
    includes: [],
    excludes: [],
    itinerary: [
      { title: "DÍA 1 – BIENVENIDA A CUSCO | TRASLADO DEL AEROPUERTO AL HOTEL", description: "¡Tu aventura por la tierra de los Incas comienza aquí!\nA tu llegada al aeropuerto de Cusco, nuestro representante estará esperándote en la puerta de salida con un cartel identificatorio con tu nombre.\nTe brindaremos una cálida bienvenida y realizaremos el traslado privado hacia tu hotel de 3 estrellas.\nDurante el traslado recibirás información general sobre tu programa, recomendaciones para tu estadía y detalles de las actividades que disfrutarás durante los próximos días.\n\nServicios incluidos:\n• Recepción en el aeropuerto.\n• Traslado privado aeropuerto – hotel.\n• Movilidad privada.\n• Agente capacitado.\n• Orientación y recomendaciones sobre el itinerario." },
      { title: "DÍA 2 – CITY TOUR CUSCO | QORICANCHA Y 4 RUINAS", description: "Descubre los secretos de la antigua capital del Imperio Inca.\nDependiendo del horario reservado, iniciaremos nuestro recorrido con el recojo desde tu hotel.\nNuestra primera visita será el majestuoso Qoricancha, conocido como el Templo del Sol y considerado uno de los centros religiosos más importantes del Tahuantinsuyo.\nContinuaremos hacia Sacsayhuamán, una extraordinaria construcción monumental reconocida por sus enormes bloques de piedra perfectamente ensamblados. Aquí descubrirás los conocimientos de ingeniería que desarrollaron los antiguos incas.\nSeguiremos hacia Qenqo, un fascinante espacio ceremonial rodeado de formaciones rocosas y naturaleza. También disfrutaremos del entorno de sus bosques de eucaliptos.\nNuestra siguiente parada será Puca Pucara, conocido como la fortaleza roja, un conjunto arqueológico de carácter estratégico ubicado en las alturas de Cusco.\nFinalmente, visitaremos Tambomachay, conocido por sus impresionantes fuentes y canales hidráulicos que demuestran el avanzado conocimiento inca sobre el manejo del agua.\nAl terminar nuestra aventura retornaremos a la ciudad, con parada en la Plaza Regocijo, a media cuadra de la Plaza de Armas.\n\nServicios incluidos:\n• Transporte turístico.\n• Ingresos a los atractivos turísticos contemplados.\n• Guía y agente capacitado.\n• Recojo desde el hotel.\n• Retorno a la Plaza Regocijo." },
      { title: "DÍA 3 – VALLE SAGRADO DE LOS INCAS | CONEXIÓN A MACHU PICCHU", description: "Un viaje por los paisajes más impresionantes del legado inca.\nNuestra aventura comenzará aproximadamente a las 7:30 a. m. con el recojo desde tu hotel para descubrir el maravilloso Valle Sagrado de los Incas.\n\n1. Mirador de Taray\nNuestra primera parada será el mirador de Taray, desde donde contemplaremos una espectacular vista panorámica del Valle Sagrado, sus montañas y campos agrícolas.\n\n2. Pisac – La grandeza de la arquitectura inca\nVisitaremos el impresionante complejo arqueológico de Pisac, reconocido por sus enormes terrazas agrícolas, construcciones ceremoniales y antiguos espacios funerarios.\nAquí descubriremos cómo los incas aprovecharon las montañas para desarrollar una extraordinaria ingeniería agrícola y arquitectónica.\n\n3. Experiencia orfebre – El arte de la platería andina\nVisitaremos un taller artesanal de orfebrería, donde un maestro artesano nos enseñará a reconocer diferentes metales y piedras, además de mostrarnos técnicas tradicionales de elaboración de piezas de plata.\n\n4. Urubamba – Almuerzo buffet\nLlegaremos al corazón del Valle Sagrado para disfrutar de un delicioso almuerzo buffet en un reconocido restaurante turístico, donde degustaremos diferentes especialidades de la gastronomía peruana.\n\n5. Ollantaytambo – La fortaleza viva de los Incas\nContinuaremos hacia uno de los complejos arqueológicos más impresionantes del mundo andino.\nAcompañados por nuestro guía, conoceremos sus imponentes terrazas, templos ceremoniales y construcciones monumentales de piedra, destacando el sector conocido como el Templo del Sol.\n\n6. Viaje en tren hacia Aguas Calientes\nAl finalizar la visita, nos dirigiremos a la estación ferroviaria de Ollantaytambo para abordar nuestro tren turístico categoría The Voyager, con salida programada a las 4:36 p. m., sujeto al horario confirmado.\nDisfrutaremos de un recorrido panorámico entre montañas, ríos y exuberante vegetación hasta llegar a Aguas Calientes.\nA nuestra llegada, nuestro representante estará esperándote con un cartel identificatorio para acompañarte hasta tu hotel, donde podrás descansar antes del gran encuentro con Machu Picchu.\n\nServicios incluidos:\n• Recojo desde el hotel.\n• Transporte turístico.\n• Mirador de Taray.\n• Visitas arqueológicas contempladas.\n• Experiencia artesanal de orfebrería.\n• Almuerzo buffet.\n• Guía oficial de turismo.\n• Tren turístico The Voyager.\n• Coordinación de alojamiento en Aguas Calientes.\n• Boleto de ingreso a Machu Picchu y bus CONSETTUR, según la reserva y circuito confirmado." },
      { title: "DÍA 4 – MACHU PICCHU | EL ENCUENTRO CON UNA MARAVILLA DEL MUNDO", description: "El momento más esperado de tu viaje ha llegado.\nDe acuerdo con el horario asignado para nuestro ingreso, nos encontraremos con nuestro guía en la estación de buses CONSETTUR para iniciar el ascenso hacia el Santuario Histórico de Machu Picchu.\nDurante el recorrido contemplaremos los impresionantes paisajes montañosos que rodean esta maravilla del mundo moderno.\nUna vez en el ingreso, comenzaremos nuestra visita guiada por los sectores contemplados en nuestro circuito oficial.\nDescubriremos sus templos, terrazas agrícolas, recintos ceremoniales y extraordinarias construcciones de piedra.\nNuestro guía profesional nos explicará la historia, arquitectura, ingeniería y cosmovisión andina que hicieron de Machu Picchu una de las expresiones más fascinantes de la civilización inca.\nDespués de esta experiencia inolvidable, retornaremos en bus a Aguas Calientes, donde tendremos tiempo para almorzar por cuenta propia.\nPosteriormente abordaremos nuestro tren turístico The Voyager de retorno hacia Ollantaytambo.\nA nuestra llegada, nuestro representante estará esperándonos para realizar el traslado terrestre hacia tu hotel en Cusco.\n\nServicios incluidos:\n• Guía oficial de turismo acreditado.\n• Tren turístico The Voyager.\n• Boleto de ingreso a Machu Picchu, según circuito confirmado.\n• Buses CONSETTUR de subida y bajada.\n• Coordinación y asistencia durante el recorrido.\n• Traslado Ollantaytambo – Cusco." },
      { title: "DÍA 5 – LAGUNA HUMANTAY | UN PARAÍSO TURQUESA ENTRE MONTAÑAS", description: "Descubre uno de los paisajes naturales más impresionantes de los Andes.\nNuestra aventura comenzará aproximadamente a las 4:30 a. m. con el recojo desde tu hotel.\nPartiremos hacia el pintoresco poblado de Mollepata, donde disfrutaremos de un desayuno andino antes de continuar nuestro viaje.\nPosteriormente, nuestra movilidad nos llevará hasta Soraypampa, punto de inicio de nuestra caminata hacia la espectacular Laguna Humantay.\nRealizaremos una caminata de montaña de aproximadamente 1 hora y 30 minutos, dependiendo del ritmo y las condiciones físicas de cada visitante.\nDurante el ascenso contemplaremos impresionantes paisajes altoandinos y montañas nevadas.\nAl llegar a la laguna, seremos recibidos por sus extraordinarias aguas de tonalidades turquesas, rodeadas de montañas que convierten este lugar en uno de los escenarios naturales más fotografiados de Cusco.\nNuestro guía nos explicará las características naturales del lugar y tendremos tiempo para disfrutar del paisaje y tomar fotografías.\nDespués de la visita, descenderemos hacia Soraypampa para abordar nuestra movilidad y dirigirnos nuevamente a Mollepata, donde disfrutaremos de un reconfortante almuerzo.\nFinalmente, retornaremos a la ciudad del Cusco, llegando aproximadamente entre las 5:00 y 6:00 p. m., con parada en la Plaza Regocijo.\n\nServicios incluidos:\n• Recojo desde el hotel.\n• Transporte turístico.\n• Ingreso a la Laguna Humantay, según el programa contratado.\n• Guía profesional.\n• Desayuno andino.\n• Almuerzo.\n• Coordinación y asistencia durante la excursión." },
      { title: "DÍA 6 – VALLE SUR CUSCO | ARQUEOLOGÍA, ARTE Y CULTURA ANDINA", description: "Descubre una ruta diferente, donde las culturas preincas, incas y coloniales se encuentran.\nIniciaremos nuestro recorrido aproximadamente entre las 8:20 y 8:45 a. m. con el recojo desde tu hotel.\n\n1. Mirador de Cielo Punku – La puerta al cielo\nNuestra primera parada será el famoso mirador de Cielo Punku, ubicado en Huaro y conocido por su impresionante estructura en forma de mano, desde donde podremos disfrutar de hermosas vistas del paisaje andino.\n\n2. Andahuaylillas – La Capilla Sixtina de América\nContinuaremos hacia el extraordinario Templo de San Pedro Apóstol de Andahuaylillas.\nEste impresionante recinto religioso destaca por sus pinturas murales, decoración barroca y riqueza artística colonial. Una auténtica joya del patrimonio cultural cusqueño.\n\n3. Pikillaqta – El legado de la cultura Wari\nVisitaremos el complejo arqueológico de Pikillaqta, una antigua ciudad planificada perteneciente a la cultura Wari, anterior al desarrollo del Imperio Inca.\nSus calles, recintos y construcciones nos permitirán comprender la importancia de las civilizaciones preincas en la historia de los Andes.\n\n4. Tipón – La extraordinaria ingeniería hidráulica inca\nNuestra última visita será Tipón, un impresionante conjunto arqueológico reconocido por sus terrazas agrícolas, canales y fuentes de agua.\nDescubriremos el avanzado conocimiento hidráulico de los incas y su extraordinaria capacidad para integrar arquitectura, agricultura y naturaleza.\nAl finalizar el recorrido retornaremos a Cusco aproximadamente a las 3:30 p. m., con parada en la Plaza Regocijo.\n\nServicios incluidos:\n• Recojo desde el hotel.\n• Transporte turístico.\n• Ingresos a los atractivos contemplados.\n• Guía profesional especializado.\n• Desayuno.\n• Almuerzo.\n• Coordinación y asistencia durante el recorrido." },
      { title: "DÍA 7 – MONTAÑA DE 7 COLORES | VINICUNCA, EL ARCOÍRIS DE LOS ANDES", description: "Prepárate para descubrir uno de los paisajes geológicos más sorprendentes del planeta.\nNuestra aventura comenzará aproximadamente a las 4:30 a. m. con el recojo desde tu hotel.\nPartiremos hacia el poblado de Cusipata, donde disfrutaremos de un desayuno andino y recibiremos nuestro box lunch para la excursión.\nDespués continuaremos en transporte turístico hasta el punto de inicio de nuestra caminata, ubicado en una zona de alta montaña.\nDesde allí iniciaremos una caminata de aproximadamente 1 hora y 40 minutos, dependiendo del ritmo y las condiciones físicas de cada visitante.\nDurante el recorrido contemplaremos impresionantes paisajes altoandinos, extensas praderas y montañas que nos acercarán progresivamente a nuestro destino.\nEl gran momento: Montaña de los Siete Colores.\nAl llegar a Vinicunca, descubriremos sus sorprendentes franjas de colores naturales, resultado de procesos geológicos que han convertido este lugar en uno de los atractivos más emblemáticos del Perú.\nNuestro guía nos explicará el origen de sus tonalidades y tendremos tiempo para disfrutar del paisaje y tomar las fotografías de recuerdo.\nDespués iniciaremos el descenso para regresar a nuestra movilidad y dirigirnos a Cusipata, donde disfrutaremos de un almuerzo típico de la región.\nFinalmente, retornaremos a la ciudad del Cusco aproximadamente entre las 3:30 y 4:00 p. m., con parada cerca de la Plaza de Armas, en la zona de Plaza Regocijo.\n\nServicios incluidos:\n• Recojo desde el hotel.\n• Transporte turístico.\n• Ingreso a Montaña de 7 Colores.\n• Guía profesional especializado.\n• Desayuno.\n• Box lunch.\n• Almuerzo.\n• Bastones de trekking.\n• Coordinación y asistencia durante la excursión." },
      { title: "DÍA 8 – DESPEDIDA DE CUSCO | TRASLADO AL AEROPUERTO", description: "Toda gran aventura llega a su final, pero los recuerdos permanecen para siempre.\nDe acuerdo con el horario de tu vuelo, nuestro equipo pasará por tu alojamiento para realizar el traslado privado hacia el aeropuerto de Cusco.\nTe despediremos después de ocho días de historia, cultura, aventura y experiencias inolvidables por la tierra de los Incas.\n\nServicios incluidos:\n• Traslado privado hotel – aeropuerto.\n• Movilidad privada.\n• Agente capacitado.\n• Coordinación según horario de vuelo." },
    ],
    faqs: [],
  }),
];
