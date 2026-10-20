// Textos legales del sitio. Las marcas {email}, {whatsapp} y {address} se
// reemplazan con la configuración editable desde el admin.
//
// IMPORTANTE: completar `legalEntity` con los datos reales de la empresa.
// Los campos vacíos no se muestran en la web.
export const legalEntity = {
  razonSocial: "", // p. ej. "Qusqueando Travel E.I.R.L."
  ruc: "",
  direccionFiscal: "",
  // Constancia de inscripción en el Directorio Nacional de Prestadores de
  // Servicios Turísticos Calificados (GERCETUR Cusco / MINCETUR).
  registroGercetur: "",
  updatedAt: "20 de octubre de 2026",
};

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

export type LegalDocument = {
  title: string;
  description: string;
  sections: LegalSection[];
};

const privacy: LegalDocument = {
  title: "Política de Privacidad",
  description:
    "Explica qué información recoge este sitio web, para qué la usamos y cómo puedes controlarla cuando navegas, consultas o reservas con Qusqueando Travel.",
  sections: [
    {
      title: "Alcance",
      paragraphs: [
        "Esta política se aplica al sitio web qusqueandotravel.com y a los canales de contacto enlazados desde él (WhatsApp, correo electrónico y formularios). El tratamiento detallado de datos personales, conforme a la Ley N.° 29733, se describe en nuestra Política de Protección de Datos Personales, que forma parte integrante de este documento.",
      ],
    },
    {
      title: "Información que recopilamos",
      items: [
        "Datos que nos envías voluntariamente: nombre, correo electrónico, teléfono, país, fechas tentativas de viaje, número de viajeros y el contenido de tu mensaje.",
        "Datos necesarios para reservar: nombres completos tal como figuran en el documento de identidad, tipo y número de documento o pasaporte, nacionalidad, fecha de nacimiento y, cuando el servicio lo requiera, información de salud relevante (alergias, restricciones alimentarias o condiciones médicas).",
        "Datos del Libro de Reclamaciones: los exigidos por la normativa de protección al consumidor para registrar y atender tu reclamo o queja.",
        "Datos técnicos mínimos: los registros que generan automáticamente los servidores de alojamiento (dirección IP, navegador, fecha y hora) con fines de seguridad y funcionamiento.",
      ],
    },
    {
      title: "Cómo usamos la información",
      items: [
        "Responder tus consultas y elaborar cotizaciones o itinerarios.",
        "Gestionar reservas, emitir boletos, permisos y comprobantes de pago.",
        "Coordinar los servicios con guías, transportistas, hoteles y demás proveedores.",
        "Atender reclamos, quejas y solicitudes de derechos.",
        "Cumplir obligaciones legales, tributarias y requerimientos de autoridades competentes.",
        "Enviarte información comercial solo si lo autorizas expresamente; puedes retirar esa autorización en cualquier momento.",
      ],
    },
    {
      title: "Canales de terceros",
      paragraphs: [
        "Al escribirnos por WhatsApp o correo electrónico, la comunicación también se rige por las políticas de privacidad de esos servicios (por ejemplo, WhatsApp/Meta o tu proveedor de correo). El mapa de la página de contacto es provisto por Google Maps, que puede recopilar datos según sus propias políticas.",
      ],
    },
    {
      title: "Con quién compartimos tu información",
      paragraphs: [
        "No vendemos ni alquilamos tus datos personales. Solo los compartimos cuando es necesario para prestar el servicio que contratas o cumplir la ley:",
      ],
      items: [
        "Proveedores turísticos que ejecutan tu viaje (transporte, trenes, hoteles, restaurantes, guías).",
        "Entidades públicas que emiten boletos o permisos nominativos, como el Ministerio de Cultura (ingreso a Machu Picchu, Camino Inca y sitios arqueológicos) o el SERNANP.",
        "Autoridades administrativas, judiciales, tributarias o el INDECOPI, cuando lo exija la normativa.",
      ],
    },
    {
      title: "Seguridad",
      paragraphs: [
        "Aplicamos medidas técnicas y organizativas razonables para proteger la información contra pérdida, acceso no autorizado o alteración, como conexiones cifradas (HTTPS), accesos restringidos y uso de la información solo por personal autorizado. Ningún sistema es infalible; si detectamos un incidente que afecte tus datos, actuaremos conforme a la normativa vigente.",
      ],
    },
    {
      title: "Menores de edad",
      paragraphs: [
        "Este sitio no está dirigido a menores de 14 años. Los datos de menores que viajen con nosotros deben ser proporcionados por sus padres o tutores, quienes otorgan el consentimiento correspondiente.",
      ],
    },
    {
      title: "Tus derechos",
      paragraphs: [
        "Puedes solicitar el acceso, rectificación, cancelación u oposición al tratamiento de tus datos, así como revocar tu consentimiento, escribiendo a {email}. El procedimiento se detalla en nuestra Política de Protección de Datos Personales.",
      ],
    },
    {
      title: "Cambios a esta política",
      paragraphs: [
        "Podemos actualizar esta política para reflejar cambios normativos u operativos. La versión vigente es siempre la publicada en esta página, con su fecha de última actualización.",
      ],
    },
  ],
};

const personalData: LegalDocument = {
  title: "Política de Protección de Datos Personales",
  description:
    "Política de tratamiento de datos personales de Qusqueando Travel, elaborada conforme a la Ley N.° 29733, Ley de Protección de Datos Personales, y su Reglamento aprobado por Decreto Supremo N.° 016-2024-JUS.",
  sections: [
    {
      title: "Titular del banco de datos",
      paragraphs: [
        "El titular del banco de datos personales de clientes y contactos es Qusqueando Travel (en adelante, «la Agencia»), cuyos datos de identificación figuran al inicio de este documento. Para cualquier asunto relacionado con tus datos puedes escribir a {email}.",
      ],
    },
    {
      title: "Principios",
      paragraphs: [
        "Tratamos los datos personales respetando los principios de legalidad, consentimiento, finalidad, proporcionalidad, calidad, seguridad, disposición de recurso y nivel de protección adecuado establecidos en la Ley N.° 29733.",
      ],
    },
    {
      title: "Datos que tratamos",
      items: [
        "Datos de identificación: nombres, apellidos, tipo y número de documento de identidad o pasaporte, nacionalidad y fecha de nacimiento.",
        "Datos de contacto: correo electrónico, teléfono y país de residencia.",
        "Datos del viaje: fechas, servicios contratados, preferencias e historial de reservas.",
        "Datos de salud (datos sensibles), solo cuando el viajero los proporcione para su seguridad: alergias, restricciones alimentarias o condiciones médicas. Se tratan con consentimiento expreso y únicamente para la prestación segura del servicio.",
        "Datos de pago necesarios para validar transacciones. La Agencia no almacena números completos de tarjetas: los pagos con tarjeta se procesan a través de pasarelas de pago de terceros.",
      ],
    },
    {
      title: "Finalidades",
      paragraphs: ["Los datos se tratan para las siguientes finalidades necesarias para la relación contractual:"],
      items: [
        "Atender consultas, cotizar y gestionar reservas.",
        "Adquirir boletos, permisos y servicios a nombre del viajero.",
        "Coordinar la ejecución del viaje con proveedores.",
        "Emitir comprobantes de pago y cumplir obligaciones tributarias y legales.",
        "Atender reclamos, quejas y solicitudes de derechos.",
      ],
    },
    {
      title: "Finalidades adicionales (opcionales)",
      paragraphs: [
        "Solo con tu consentimiento previo, libre, expreso e inequívoco, podremos enviarte promociones, novedades o encuestas de satisfacción. Negarte o retirar este consentimiento no afecta los servicios que contrataste.",
      ],
    },
    {
      title: "Transferencias y encargados",
      paragraphs: [
        "Para cumplir las finalidades indicadas, los datos pueden ser comunicados a proveedores turísticos (transporte, trenes, hoteles, guías), a entidades públicas emisoras de boletos y permisos (Ministerio de Cultura, SERNANP) y a proveedores tecnológicos que actúan como encargados del tratamiento (alojamiento web, correo electrónico, mensajería y pasarelas de pago).",
        "Algunos de estos proveedores tecnológicos pueden ubicarse fuera del Perú, lo que constituye un flujo transfronterizo de datos. En esos casos la Agencia procura que el receptor garantice un nivel de protección adecuado, conforme a la normativa.",
      ],
    },
    {
      title: "Plazo de conservación",
      paragraphs: [
        "Los datos se conservan mientras dure la relación comercial y, luego, durante el plazo necesario para cumplir obligaciones legales, tributarias y de atención de reclamos. Cumplido ese plazo, se eliminan o anonimizan de forma segura.",
      ],
    },
    {
      title: "Derechos del titular (ARCO)",
      paragraphs: [
        "Como titular de los datos puedes ejercer en cualquier momento tus derechos de información, acceso, rectificación, cancelación y oposición, así como revocar tu consentimiento.",
        "Para hacerlo, envía una solicitud a {email} indicando tu nombre completo, una copia de tu documento de identidad (o del representante con poder suficiente), el derecho que deseas ejercer y una dirección de correo para notificaciones. Atenderemos la solicitud dentro de los plazos previstos en la normativa vigente.",
        "Si consideras que tu solicitud no fue atendida adecuadamente, puedes presentar una reclamación ante la Autoridad Nacional de Protección de Datos Personales del Ministerio de Justicia y Derechos Humanos.",
      ],
    },
    {
      title: "Seguridad de la información",
      paragraphs: [
        "La Agencia adopta medidas de seguridad técnicas, organizativas y legales para garantizar la confidencialidad e integridad de los datos, incluyendo control de accesos, conexiones cifradas y compromisos de confidencialidad con el personal y los proveedores.",
      ],
    },
    {
      title: "Consentimiento",
      paragraphs: [
        "Al enviarnos tus datos por nuestros formularios o canales de contacto y aceptar esta política, otorgas tu consentimiento para el tratamiento descrito. Los datos de menores de 14 años solo se tratan con el consentimiento de sus padres o tutores.",
      ],
    },
  ],
};

const terms: LegalDocument = {
  title: "Términos y Condiciones",
  description:
    "Condiciones generales que regulan el uso de este sitio web y la contratación de tours, paquetes y servicios turísticos con Qusqueando Travel. Te recomendamos leerlas antes de confirmar tu reserva.",
  sections: [
    {
      title: "Identificación y marco legal",
      paragraphs: [
        "Qusqueando Travel (en adelante, «la Agencia») es una agencia de viajes y turismo con sede en Cusco, Perú, que opera conforme al Reglamento de Agencias de Viajes y Turismo aprobado por Decreto Supremo N.° 005-2020-MINCETUR, al Código de Protección y Defensa del Consumidor (Ley N.° 29571) y demás normas aplicables. Sus datos de identificación figuran al inicio de este documento.",
      ],
    },
    {
      title: "Aceptación",
      paragraphs: [
        "Al realizar una reserva o efectuar un pago, el viajero declara haber leído y aceptado estos Términos y Condiciones, la Política de Privacidad y las condiciones particulares de cada servicio (itinerario, inclusiones y exclusiones) informadas antes de la confirmación. Quien reserva en nombre de un grupo garantiza que los demás viajeros conocen y aceptan estas condiciones.",
      ],
    },
    {
      title: "Precios",
      items: [
        "Los precios publicados son referenciales, se expresan en dólares estadounidenses (USD) o soles (PEN) e indican el monto «desde» por persona, salvo indicación distinta.",
        "El precio final se confirma por escrito en la cotización y puede variar según temporada, número de viajeros, disponibilidad y tipo de servicio (privado o compartido).",
        "Cada servicio detalla lo que incluye y lo que no incluye. Todo lo no mencionado expresamente como incluido (propinas, comidas no indicadas, gastos personales, seguros, vuelos) corre por cuenta del viajero.",
        "Las tarifas de ingreso fijadas por entidades públicas (Ministerio de Cultura, SERNANP, municipalidades) pueden cambiar por disposición de dichas entidades; cualquier variación anterior a la emisión del boleto se trasladará al viajero, informándolo previamente.",
      ],
    },
    {
      title: "Reservas y confirmación",
      items: [
        "Las reservas se solicitan por WhatsApp, correo electrónico o los formularios del sitio web y están sujetas a disponibilidad.",
        "Para bloquear los servicios se requiere un adelanto, cuyo monto se indica en la cotización. El saldo debe pagarse en la fecha acordada, antes del inicio del servicio.",
        "La reserva queda confirmada únicamente cuando la Agencia valida el pago y envía la confirmación escrita con el detalle del servicio.",
        "El viajero debe enviar sus datos exactamente como figuran en el pasaporte o documento de identidad con el que viajará. Los errores en los datos proporcionados por el viajero que impidan el uso de boletos o permisos son de su exclusiva responsabilidad.",
      ],
    },
    {
      title: "Boletos y permisos nominativos",
      paragraphs: [
        "Los boletos de ingreso a Machu Picchu, los permisos del Camino Inca, los boletos de tren y otros ingresos regulados son nominativos, tienen cupos limitados y se emiten a nombre del viajero una vez recibido el pago. Por disposición de las entidades emisoras y de los operadores ferroviarios, una vez emitidos, en general no son reembolsables, transferibles ni modificables. Estos montos no son recuperables en caso de cancelación, cambio de fecha o inasistencia del viajero.",
      ],
    },
    {
      title: "Cancelaciones solicitadas por el viajero",
      paragraphs: [
        "Las cancelaciones deben comunicarse por escrito (WhatsApp o correo). Salvo que la cotización indique condiciones particulares, se aplican las siguientes penalidades sobre el monto total del servicio:",
      ],
      items: [
        "Con más de 30 días de anticipación: se reembolsa el monto pagado, descontando boletos y permisos ya emitidos, servicios no reembolsables de terceros y comisiones bancarias o de la pasarela de pago.",
        "Entre 30 y 8 días de anticipación: se retiene el 50 % del monto total, además de los conceptos no reembolsables indicados.",
        "Con 7 días o menos de anticipación, o en caso de no presentarse (no show): no corresponde reembolso.",
        "Para tours de un día, la cancelación sin penalidad debe comunicarse con al menos 72 horas de anticipación, descontando los conceptos no reembolsables.",
      ],
    },
    {
      title: "Cambios de fecha",
      paragraphs: [
        "Los cambios de fecha se atienden según disponibilidad y deben solicitarse por escrito con la mayor anticipación posible. Pueden generar costos adicionales, en especial cuando involucran boletos o permisos ya emitidos, que podrían requerir una nueva compra.",
      ],
    },
    {
      title: "Cambios o cancelaciones por la Agencia y fuerza mayor",
      items: [
        "La Agencia puede modificar el orden del itinerario, horarios o proveedores por razones operativas o de seguridad, manteniendo servicios de calidad equivalente.",
        "Ante situaciones de fuerza mayor o caso fortuito —condiciones climáticas adversas, desastres naturales, huelgas, bloqueos de vías, cierres o restricciones dispuestos por autoridades, emergencias sanitarias, cancelaciones de trenes o vuelos—, la Agencia ofrecerá una alternativa razonable o la reprogramación del servicio.",
        "Si el servicio no puede prestarse por causas atribuibles a la Agencia, esta reembolsará íntegramente lo pagado por los servicios no prestados.",
        "En casos de fuerza mayor, se reembolsarán los montos que la Agencia logre recuperar de los proveedores; los gastos ya ejecutados o no recuperables no serán reembolsables.",
      ],
    },
    {
      title: "Responsabilidades del viajero",
      items: [
        "Portar un pasaporte o documento de identidad vigente y cumplir los requisitos migratorios y sanitarios para ingresar al Perú.",
        "Informar antes del viaje cualquier condición médica, alergia o limitación física relevante, y evaluar con su médico la aptitud para actividades en altura. Cusco se ubica a más de 3 300 m s. n. m. y algunas rutas superan los 4 000 m s. n. m.; se recomienda aclimatarse adecuadamente.",
        "Contar con un seguro de viaje con cobertura médica y de evacuación. Recomendamos que también cubra cancelaciones.",
        "Respetar los horarios, las indicaciones del guía y las normas de los sitios visitados, incluidas las del Santuario Histórico de Machu Picchu y las de protección del patrimonio cultural y natural.",
        "Los menores de edad deben viajar acompañados de sus padres o tutores, o portar la autorización de viaje que exija la normativa peruana.",
        "El viajero responde por los daños que cause por su conducta a terceros, a los bienes de los proveedores o al patrimonio.",
      ],
    },
    {
      title: "Responsabilidad de la Agencia",
      paragraphs: [
        "La Agencia responde por la correcta prestación de los servicios contratados, conforme a lo ofrecido y confirmado por escrito. Cuando actúa como intermediaria de servicios prestados por terceros (hoteles, trenes, transporte aéreo, entidades públicas), coordina y vela por su cumplimiento, sin perjuicio de la responsabilidad directa de dichos proveedores conforme a sus propias condiciones.",
        "La Agencia no se responsabiliza por pérdidas de objetos personales no confiados a su custodia, ni por retrasos o cambios originados en causas ajenas a su control.",
      ],
    },
    {
      title: "Uso del sitio web y propiedad intelectual",
      paragraphs: [
        "Los textos, logotipos, fotografías y diseños de este sitio pertenecen a la Agencia o se usan con autorización, y no pueden reproducirse sin permiso previo. La información publicada es referencial y puede actualizarse sin previo aviso.",
      ],
    },
    {
      title: "Uso de imágenes durante los tours",
      paragraphs: [
        "Durante los servicios, la Agencia podría tomar fotografías o videos con fines de difusión. Solo se publicarán imágenes en las que el viajero sea identificable si este lo autoriza; puedes negarte en cualquier momento comunicándolo a tu guía o a {email}.",
      ],
    },
    {
      title: "Reclamos y quejas",
      paragraphs: [
        "Ponemos a tu disposición nuestro Libro de Reclamaciones virtual, conforme al Código de Protección y Defensa del Consumidor y su reglamento. La Agencia responderá los reclamos y quejas en un plazo máximo de quince (15) días hábiles. Si no estás conforme con la respuesta, puedes acudir al INDECOPI.",
      ],
    },
    {
      title: "Turismo responsable y ESNNA",
      paragraphs: [
        "La Agencia rechaza toda forma de explotación sexual de niñas, niños y adolescentes en el ámbito del turismo. La explotación sexual de menores de edad es un delito severamente sancionado por la legislación peruana. Cualquier conducta de este tipo será denunciada ante las autoridades competentes.",
      ],
    },
    {
      title: "Ley aplicable y jurisdicción",
      paragraphs: [
        "Estos Términos y Condiciones se rigen por las leyes de la República del Perú. Cualquier controversia se someterá a los jueces y tribunales de la ciudad del Cusco, sin perjuicio del derecho del consumidor de acudir al INDECOPI u otras vías previstas en la ley.",
      ],
    },
  ],
};

const payments: LegalDocument = {
  title: "Medios de Pago",
  description:
    "Formas de pago disponibles para confirmar tours y paquetes con Qusqueando Travel, y condiciones aplicables a cada una.",
  sections: [
    {
      title: "Métodos disponibles",
      paragraphs: ["Según disponibilidad operativa y el lugar desde donde pagues, podrás usar:"],
      items: [
        "Transferencia o depósito bancario en cuentas a nombre de la empresa.",
        "Billeteras digitales disponibles en el Perú.",
        "Enlaces de pago con tarjeta de crédito o débito, procesados por pasarelas de pago seguras.",
        "Transferencias internacionales, para viajeros que pagan desde el extranjero.",
      ],
    },
    {
      title: "Cuentas oficiales",
      paragraphs: [
        "Los datos de pago se envían únicamente por nuestros canales oficiales ({whatsapp} y {email}). Las cuentas siempre están a nombre de la empresa. Si recibes datos de pago por otro medio o a nombre de terceros, no realices el pago y comunícate con nosotros para verificar.",
      ],
    },
    {
      title: "Moneda y tipo de cambio",
      paragraphs: [
        "Los precios se expresan en dólares estadounidenses (USD) o soles (PEN). Cuando pagues en una moneda distinta a la de la cotización, se aplicará el tipo de cambio informado antes del pago.",
      ],
    },
    {
      title: "Comisiones",
      paragraphs: [
        "Las comisiones de transferencias internacionales, de los bancos intermediarios y, cuando corresponda, de las pasarelas de pago con tarjeta corren por cuenta del cliente, salvo que la cotización indique lo contrario. Se informarán antes de que realices el pago.",
      ],
    },
    {
      title: "Confirmación y comprobantes",
      paragraphs: [
        "La reserva se confirma cuando validamos la recepción del pago y te enviamos la confirmación escrita con el detalle del servicio. Por cada pago emitimos el comprobante electrónico correspondiente (boleta o factura), conforme a las normas tributarias vigentes. Indícanos tus datos de facturación antes de pagar.",
      ],
    },
    {
      title: "Seguridad",
      paragraphs: [
        "Nunca te pediremos por chat o correo el número completo, la fecha de vencimiento ni el código de seguridad de tu tarjeta. Los pagos con tarjeta se realizan solo a través de enlaces de pasarelas de pago reconocidas.",
      ],
    },
    {
      title: "Reembolsos",
      paragraphs: [
        "Los reembolsos que correspondan según nuestros Términos y Condiciones se realizan por el mismo medio de pago utilizado, descontando las comisiones no recuperables. Los plazos de acreditación dependen de cada banco o pasarela.",
      ],
    },
  ],
};

const cookies: LegalDocument = {
  title: "Política de Cookies",
  description:
    "Qué son las cookies, cuáles usa este sitio web y cómo puedes gestionarlas desde tu navegador.",
  sections: [
    {
      title: "Qué son las cookies",
      paragraphs: [
        "Las cookies son pequeños archivos que un sitio web guarda en tu navegador para recordar información sobre tu visita, como una sesión iniciada o tus preferencias.",
      ],
    },
    {
      title: "Cookies que usa este sitio",
      items: [
        "Cookies técnicas o estrictamente necesarias: este sitio solo utiliza una cookie propia de sesión para el acceso al panel de administración interno. No se instala en los navegadores de los visitantes que no acceden a dicho panel.",
        "Actualmente no utilizamos cookies analíticas, publicitarias ni de seguimiento propias.",
      ],
    },
    {
      title: "Cookies de terceros",
      paragraphs: [
        "Algunas páginas incluyen contenido de terceros que puede instalar sus propias cookies, regidas por sus políticas:",
      ],
      items: [
        "Google Maps, en el mapa de la página de contacto.",
        "WhatsApp (Meta), solo cuando haces clic en un enlace para escribirnos, ya fuera de este sitio.",
      ],
    },
    {
      title: "Cómo gestionar las cookies",
      paragraphs: [
        "Puedes permitir, bloquear o eliminar las cookies desde la configuración de tu navegador (Chrome, Safari, Firefox, Edge u otros). Bloquear las cookies de terceros puede impedir que el mapa de contacto se muestre correctamente.",
      ],
    },
    {
      title: "Cambios en esta política",
      paragraphs: [
        "Si en el futuro incorporamos herramientas de analítica o publicidad, actualizaremos esta política y, cuando corresponda, solicitaremos tu consentimiento antes de instalar cookies no esenciales.",
      ],
    },
  ],
};

const esnna: LegalDocument = {
  title: "Afiche ESNNA MINCETUR",
  description:
    "Qusqueando Travel promueve un turismo responsable y rechaza toda forma de explotación sexual de niñas, niños y adolescentes (ESNNA) en el ámbito del turismo.",
  sections: [
    {
      title: "Nuestro compromiso",
      paragraphs: [
        "Nos sumamos a las acciones de prevención de la ESNNA impulsadas por el Ministerio de Comercio Exterior y Turismo (MINCETUR) y difundimos el afiche oficial en nuestros canales de atención.",
      ],
      items: [
        "No prestamos servicios a quienes pretendan explotar sexualmente a niñas, niños o adolescentes.",
        "Capacitamos a nuestro equipo y a nuestros guías para identificar y reportar situaciones de riesgo.",
        "Exigimos a nuestros proveedores el mismo compromiso.",
      ],
    },
    {
      title: "Es un delito",
      paragraphs: [
        "La explotación sexual de niñas, niños y adolescentes es un delito severamente sancionado por la legislación peruana. Ninguna costumbre, pago o consentimiento la justifica. En esta agencia no promovemos ni permitimos la ESNNA ni cualquier otro ilícito penal del que tomemos conocimiento en el desarrollo de nuestra actividad, conforme a:",
      ],
      items: [
        "Ley N.° 29408, Ley General de Turismo, y su Reglamento aprobado por Decreto Supremo N.° 003-2010-MINCETUR.",
        "Ley N.° 30963, que modifica el Código Penal respecto a las sanciones del delito de explotación sexual en sus diversas modalidades y delitos conexos.",
        "Ley N.° 30802, que establece condiciones para el ingreso de niñas, niños y adolescentes a establecimientos de hospedaje a fin de garantizar su protección e integridad.",
      ],
    },
    {
      title: "Cómo denunciar",
      paragraphs: [
        "Si conoces o sospechas de un caso, denúncialo de inmediato:",
      ],
      items: [
        "Línea 1818 (gratuita, las 24 horas). La denuncia puede ser anónima.",
        "Línea 100 del Ministerio de la Mujer y Poblaciones Vulnerables (gratuita, las 24 horas).",
        "Policía Nacional del Perú: línea 105 o la comisaría más cercana.",
        "Ministerio Público: la fiscalía más cercana.",
        "También puedes comunicarlo a nuestro equipo en {email}; derivaremos el caso a las autoridades competentes.",
      ],
    },
  ],
};

export const legalPages = { privacy, personalData, terms, payments, cookies, esnna };
