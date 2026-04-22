export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Language {
  id: string;
  name: string;
  nativeName: string;
  code: string;
}

export const LANGUAGES: Language[] = [
  { id: 'es', name: 'Spanish', nativeName: 'Español', code: 'es-ES' },
  { id: 'en-uk', name: 'English (UK)', nativeName: 'English (UK)', code: 'en-GB' },
  { id: 'en-us', name: 'English (USA)', nativeName: 'English (USA)', code: 'en-US' },
  { id: 'fr', name: 'French', nativeName: 'Français', code: 'fr-FR' },
  { id: 'de', name: 'German', nativeName: 'Deutsch', code: 'de-DE' },
  { id: 'it', name: 'Italian', nativeName: 'Italiano', code: 'it-IT' },
  { id: 'ru', name: 'Russian', nativeName: 'Русский', code: 'ru-RU' },
  { id: 'ca', name: 'Catalan', nativeName: 'Català', code: 'ca-ES' },
  { id: 'zh', name: 'Chinese', nativeName: '中文', code: 'zh-CN' },
  { id: 'el', name: 'Greek', nativeName: 'Ελληνικά', code: 'el-GR' },
];

export const TOPICS: Record<string, string[]> = {
  'A1-A2': [
    "Identificación personal",
    "Vivienda, hogar y entorno",
    "Actividades de la vida diaria",
    "Trabajo, tiempo libre y ocio",
    "Viajes",
    "Relaciones humanas y sociales",
    "Salud y cuidados físicos",
    "Aspectos cotidianos de la educación",
    "Compras y actividades comerciales",
    "Alimentación",
    "Bienes y servicios",
    "Lengua y comunicación",
    "Medio geográfico, físico y clima",
    "Uso cotidiano de la tecnología"
  ],
  'B1': [
    "Identificación personal",
    "Vivienda, hogar y entorno",
    "Actividades de la vida diaria",
    "Familia y amigos",
    "Relaciones humanas y sociales",
    "Trabajo y ocupaciones",
    "Educación y estudio",
    "Lengua y comunicación",
    "Tiempo libre y ocio",
    "Viajes y vacaciones",
    "Salud y cuidados físicos",
    "Compras y actividades comerciales",
    "Alimentación y restauración",
    "Transporte, bienes y servicios",
    "Clima, condiciones meteorológicas y entorno natural",
    "Tecnologías de la información y la comunicación",
    "Cultura, costumbres y valores"
  ],
  'B2': [
    "Identificación personal",
    "Vivienda, hogar y entorno",
    "Actividades de la vida diaria",
    "Familia y amigos",
    "Relaciones humanas y sociales",
    "Trabajo y ocupaciones",
    "Educación y estudio",
    "Lengua y comunicación",
    "Tiempo libre y ocio",
    "Viajes y vacaciones",
    "Salud y cuidados físicos",
    "Compras y actividades comerciales",
    "Alimentación y restauración",
    "Transporte, bienes y servicios",
    "Clima, condiciones meteorológicas y entorno natural",
    "Tecnologías de la información y la comunicación",
    "Cultura, costumbres y valores"
  ],
  'C1-C2': [
    "Identificación personal: dimensión física y anímica",
    "Vivienda, hogar y entorno",
    "Alimentación",
    "Salud, higiene y cuidados físicos",
    "Relaciones personales y sociales",
    "Trabajo y actividades profesionales",
    "Educación y actividades académicas",
    "Tiempo libre y ocio",
    "Viajes, alojamiento y transporte",
    "Compras y actividades comerciales",
    "Bienes y servicios",
    "Economía y empresa",
    "Industria y energía",
    "Gobierno, política y sociedad",
    "Información y medios de comunicación",
    "Cultura y actividades artísticas",
    "Religión y filosofía",
    "Geografía y naturaleza",
    "Ciencia y tecnología"
  ]
};

export const CYL_RUBRICS: Record<string, string> = {
  'A1': `
EFICACIA COMUNICATIVA (Nivel A1/A2):
- Banda 3: Desarrolla eficazmente las funciones comunicativas básicas con información relevante, mensaje muy claro y extensión adecuada. Se adecua siempre a la situación comunicativa y registro.
- Banda 2: Desarrolla en general eficazmente las funciones comunicativas básicas. Información en su mayor parte relevante, mensaje claro y extensión adecuada. Casi siempre se adecua a la situación.
- Banda 1: Desarrolla poco eficazmente las funciones básicas. Información poco relevante, mensaje poco claro y extensión poco adecuada. Se adecua poco a la situación.
- Banda 0: Desarrolla muy poco eficazmente las funciones básicas. Información muy poco relevante, mensaje muy poco claro y extensión muy poco adecuada. Se adecua muy poco a la situación.

COHERENCIA Y COHESIÓN (Nivel A1/A2):
- Banda 3: Estructura el discurso en oraciones cortas coherentes, con progresión de ideas lógica y secuencial. Usa mecanismos de cohesión sencillos (y, pero, porque, secuenciadores) de forma precisa.
- Banda 2: Estructura el discurso en oraciones cortas generalmente coherentes, con progresión generalmente lógica. Usa mecanismos de cohesión sencillos de forma generalmente precisa.
- Banda 1: Estructura el discurso en enunciados sencillos y oraciones cortas poco coherentes, con progresión de ideas poco lógica o repetitiva. Mecanismos de cohesión poco precisos.
- Banda 0: Estructura el discurso en enunciados muy poco coherentes, con progresión de ideas muy poco lógica o muy repetitiva. Mecanismos de cohesión muy poco precisos.

CORRECCIÓN (Nivel A1/A2):
- Banda 3: Muy buen control de estructuras morfosintácticas básicas y sencillas. Escasos errores que no afectan a la inteligibilidad.
- Banda 2: Buen control de estructuras morfosintácticas básicas. Errores afectan poco a la inteligibilidad. Queda generalmente claro lo que intenta decir.
- Banda 1: Escaso control de estructuras morfosintácticas básicas. Frecuentes errores que afectan significativamente a la inteligibilidad.
- Banda 0: Muy escaso control de estructuras básicas. Muy frecuentes errores que afectan muy significativamente a la inteligibilidad.

ALCANCE Y USO (Nivel A1/A2):
- Banda 3: Repertorio léxico-gramatical básico con muy escasas repeticiones. Uso consistente sobre temas conocidos con escasísimas imprecisiones.
- Banda 2: Repertorio léxico-gramatical básico con escasas repeticiones. Uso generalmente consistente con pocas imprecisiones.
- Banda 1: Limitado repertorio léxico con frecuentes repeticiones e imprecisiones. Poco consistente.
- Banda 0: Muy limitado repertorio léxico con repeticiones muy frecuentes e imprecisiones constantes. Muy poco consistente.

FONOLOGÍA Y FLUIDEZ (Nivel A1/A2):
- Banda 3: Pronunciación clara y comprensible. Errores de pronunciación escasos que no impiden la comunicación. Fluidez adecuada al nivel con pocas pausas.
- Banda 2: Pronunciación generalmente clara y comprensible, con acento extranjero evidente y algunos errores. Fluidez suficiente con pausas y reformulaciones.
- Banda 1: Pronunciación poco clara. Frecuentes errores que dificultan la comprensión. Fluidez limitada con pausas frecuentes.
- Banda 0: Pronunciación muy poco clara con errores constantes que impiden el mensaje. Fluidez mínima con pausas constantes.
  `,
  'A2': `
EFICACIA COMUNICATIVA:
- Banda 3: Desarrolla eficazmente las funciones comunicativas básicas con información relevante, mensaje muy claro y extensión adecuada. Se adecua siempre a la situación comunicativa y registro.
- Banda 2: Desarrolla en general eficazmente las funciones comunicativas básicas. Información en su mayor parte relevante, mensaje claro y extensión adecuada. Casi siempre se adecua a la situación.
- Banda 1: Desarrolla poco eficazmente las funciones básicas. Información poco relevante, mensaje poco claro y extensión poco adecuada. Se adecua poco a la situación.
- Banda 0: Desarrolla muy poco eficazmente las funciones básicas. Información muy poco relevante, mensaje muy poco claro y extensión muy poco adecuada. Se adecua muy poco a la situación.

COHERENCIA Y COHESIÓN:
- Banda 3: Estructura el discurso en oraciones cortas coherentes, con progresión de ideas lógica y secuencial. Usa mecanismos de cohesión sencillos (y, pero, porque, secuenciadores) de forma precisa.
- Banda 2: Estructura el discurso en oraciones cortas generalmente coherentes, con progresión generalmente lógica. Usa mecanismos de cohesión sencillos de forma generalmente precisa.
- Banda 1: Estructura el discurso en enunciados sencillos y oraciones cortas poco coherentes, con progresión de ideas poco lógica o repetitiva. Mecanismos de cohesión poco precisos.
- Banda 0: Estructura el discurso en enunciados muy poco coherentes, con progresión de ideas muy poco lógica o muy repetitiva. Mecanismos de cohesión muy poco precisos.

CORRECCIÓN:
- Banda 3: Muy buen control de estructuras morfosintácticas básicas y sencillas. Escasos errores que no afectan a la inteligibilidad.
- Banda 2: Buen control de estructuras morfosintácticas básicas. Errores afectan poco a la inteligibilidad. Queda generalmente claro lo que intenta decir.
- Banda 1: Escaso control de estructuras morfosintácticas básicas. Frecuentes errores que afectan significativamente a la inteligibilidad.
- Banda 0: Muy escaso control de estructuras básicas. Muy frecuentes errores que afectan muy significativamente a la inteligibilidad.

ALCANCE Y USO:
- Banda 3: Repertorio léxico-gramatical básico con muy escasas repeticiones. Uso consistente sobre temas conocidos con escasísimas imprecisiones.
- Banda 2: Repertorio léxico-gramatical básico con escasas repeticiones. Uso generalmente consistente con pocas imprecisiones.
- Banda 1: Limitado repertorio léxico con frecuentes repeticiones e imprecisiones. Poco consistente.
- Banda 0: Muy limitado repertorio léxico con repeticiones muy frecuentes e imprecisiones constantes. Muy poco consistente.

FONOLOGÍA Y FLUIDEZ:
- Banda 3: Pronunciación clara y comprensible. Errores de pronunciación escasos que no impiden la comunicación. Fluidez adecuada al nivel con pocas pausas.
- Banda 2: Pronunciación generalmente clara y comprensible, con acento extranjero evidente y algunos errores. Fluidez suficiente con pausas y reformulaciones.
- Banda 1: Pronunciación poco clara. Frecuentes errores que dificultan la comprensión. Fluidez limitada con pausas frecuentes.
- Banda 0: Pronunciación muy poco clara con errores constantes que impiden el mensaje. Fluidez mínima con pausas constantes.
  `,
  'B1': `
EFICACIA COMUNICATIVA:
- Banda 3: Desarrolla eficazmente las funciones demandadas, transmitiendo info relevante en un mensaje muy claro y extensión adecuada. Se adecua con facilidad (registro neutro) con escasas inconsistencias.
- Banda 2: Desarrolla en general eficazmente las funciones, con info generalmente relevante, mensaje claro y extensión adecuada. Se adecua en general con algunas inconsistencias.
- Banda 1: Desarrolla poco eficazmente, info poco relevante, mensaje poco claro o extensión poco adecuada. Se adecua con dificultad y frecuentes inconsistencias.
- Banda 0: Desarrolla muy poco eficazmente, info muy poco relevante, mensaje muy poco claro o extensión inadecuada. Mucha dificultad de adecuación y muy frecuentes inconsistencias.

COHERENCIA Y COHESIÓN:
- Banda 3: Discurso coherente con oraciones de cierta longitud, progresión lógica y bien organizada. Usa un número limitado de mecanismos de cohesión de forma precisa.
- Banda 2: Discurso coherente y sencillo, con progresión generalmente lógica. Mecanismos de cohesión sencillos de forma generalmente precisa.
- Banda 1: Discurso sencillo con oraciones simples y cortas, progresión poco lógica o repetitiva. Mecanismos de cohesión comunes poco precisos.
- Banda 0: Enunciados sencillos y oraciones muy cortas, progresión muy poco lógica o muy repetitiva. Mecanismos de cohesión muy básicos de forma poco precisa.

CORRECCIÓN:
- Banda 3: Control consistente de estructuras sencillas y algunas complejas. Errores escasos que afectan muy poco a la inteligibilidad y a menudo se autocorrigen.
- Banda 2: Control generalmente consistente de estructuras sencillas y conocidas. Errores afectan poco a la inteligibilidad.
- Banda 1: Cierto control de estructuras sencillas, presencia de errores básicos. Errores afectan con frecuencia a la inteligibilidad.
- Banda 0: Control poco consistente de estructuras sencillas, alta presencia de errores básicos. Errores afectan significativamente a la inteligibilidad.

ALCANCE Y USO:
- Banda 3: Repertorio sencillo pero amplio con escasas repeticiones. Emplea el repertorio de forma consistente con escasas imprecisiones.
- Banda 2: Repertorio sencillo y amplio con algunas repeticiones. Emplea el repertorio de forma generalmente consistente con algunas imprecisiones.
- Banda 1: Repertorio sencillo y básico con frecuentes repeticiones. Poco consistente con imprecisiones frecuentes.
- Banda 0: Repertorio muy básico y limitado con repeticiones muy frecuentes. Muy poco consistente con imprecisiones y omisiones muy frecuentes.

FONOLOGÍA Y FLUIDEZ:
- Banda 3: Pronunciación clara y natural con buen control de la entonación y acentuación. Se expresa con fluidez y naturalidad razonable.
- Banda 2: Pronunciación clara aunque el acento sea evidente. Se expresa con relativa fluidez aunque con pausas para planificar.
- Banda 1: Pronunciación comprensible pero con errores frecuentes y acento marcado. Fluidez limitada con pausas notables.
- Banda 0: Pronunciación deficiente que dificulta la inteligibilidad. Discurso fragmentado y poco fluido.
  `,
  'B2': `
EFICACIA COMUNICATIVA:
- Banda 3: Funciones requeridas con información relevante y elaborada, extensión adecuada. Capacidad para resolver inconsistencias.
- Banda 2: Funciones requeridas con información relevante, elaborada y extensión suficiente. Alguna inconsistencia ocasional.
- Banda 1: Mayor parte de funciones cumplidas, info no siempre relevante o elaborada, extensión poco adecuada. No siempre se adecua.
- Banda 0: Apenas desarrolla funciones, info no relevante, extensión inadecuada. Apenas se adecua.

COHERENCIA Y COHESIÓN:
- Banda 3: Discurso bien estructurado con progresión lógica y coherente. Rango variado de mecanismos de cohesión de forma precisa.
- Banda 2: Discurso claro y estructurado, progresión lógica. Mecanismos de cohesión precisos aunque algo limitados.
- Banda 1: Discurso no siempre claro, estructura simple, desarrollo a veces incoherente o repetitivo. Mecanismos de cohesión limitados o toscos.
- Banda 0: Discurso poco claro o poco estructurado, escaso desarrollo, numerosas incoherencias. Mecanismos de cohesión muy limitados.

CORRECCIÓN:
- Banda 3: Buen control de estructuras sencillas y complejas. Errores propios de la oralidad que no afectan a la inteligibilidad y se autocorrigen.
- Banda 2: Control adecuado de estructuras, aunque no siempre en las complejas. Errores poco frecuentes, no afectan a la inteligibilidad.
- Banda 1: Control poco adecuado de estructuras complejas. Errores frecuentes incluso en básicas, a veces afectan a la inteligibilidad.
- Banda 0: Escaso control morfosintáctico. Errores notables y muy frecuentes que dificultan la inteligibilidad.

ALCANCE Y USO:
- Banda 3: Repertorio amplio, adecuado y preciso con alguna imprecisión puntual.
- Banda 2: Repertorio amplio con alguna repetición. En general adecuado aunque con algunas imprecisiones.
- Banda 1: Repertorio limitado y/o repetitivo. Muestra falta de precisión.
- Banda 0: Repertorio muy elemental y/o repetitivo. Muy limitado y/o impreciso.

FONOLOGÍA Y FLUIDEZ:
- Banda 3: Pronunciación muy clara y natural, con control preciso de la entonación y el ritmo. Fluidez espontánea y eficaz.
- Banda 2: Pronunciación clara y entonación correcta. Se expresa con fluidez de forma natural sin pausas largas.
- Banda 1: Errores de pronunciación que a veces afectan a la inteligibilidad. Fluidez irregular con pausas estructurales.
- Banda 0: Pronunciación deficiente con errores constantes. Discurso entrecortado y muy poco fluido.
  `,
  'C1': `
EFICACIA COMUNICATIVA:
- Banda 3: Comprensible y natural, info relevante y elaborada, extensión adecuada. Sin inconsistencias.
- Banda 2: Comprensible y natural, info relevante y elaborada, extensión adecuada. Inconsistencias ocasionales que sabe resolver.
- Banda 1: Poco eficaz, parte de la info requerida no es clara o natural, extensión poco adecuada. Algunas inconsistencias.
- Banda 0: Apenas desarrolla funciones, info no siempre relevante, extensión inadecuada, no siempre comprensible. Muchas inconsistencias.

COHERENCIA Y COHESIÓN:
- Banda 3: Discurso muy claro y estructurado con progresión lógica. Amplio rango de mecanismos de cohesión de forma muy precisa.
- Banda 2: Discurso en general claro y estructurado con progresión lógica. Mecanismos de cohesión casi siempre precisos (alguna imprecisión esporádica).
- Banda 1: Discurso poco claro, estructura demasiado simple, desarrollo incoherente o repetitivo. Pocos mecanismos de cohesión (tosco o impreciso).
- Banda 0: Discurso poco claro y lógico, escaso desarrollo, numerosas incoherencias. Mecanismos de cohesión muy básicos o insuficientes.

CORRECCIÓN:
- Banda 3: Buen control de estructuras complejas. Apenas hay errores, no son significativos ni afectan a la inteligibilidad.
- Banda 2: Control adecuado de estructuras complejas. Errores poco frecuentes que no afectan a la inteligibilidad.
- Banda 1: Control no adecuado de estructuras básicas y complejas. Errores frecuentes que a veces afectan a la inteligibilidad.
- Banda 0: Control escaso. Errores notables y muy frecuentes que dificultan mucho la inteligibilidad.

ALCANCE Y USO:
- Banda 3: Repertorio muy amplio y variado. Adecuado, preciso y natural sin apenas imprecisiones.
- Banda 2: Repertorio amplio y variado. Adecuado, preciso y natural con imprecisiones no significativas.
- Banda 1: Repertorio bastante limitado con alguna repetición. No siempre adecuado, con imprecisiones significativas.
- Banda 0: Repertorio poco amplio y/o muy repetitivo. Falta de precisión y naturalidad.

FONOLOGÍA Y FLUIDEZ:
- Banda 3: Pronunciación y entonación muy claras y naturales (acento extranjero casi imperceptible). Fluidez total y espontánea sin esfuerzo.
- Banda 2: Pronunciación clara y natural (acento no distractor). Se expresa con fluidez constante y sin vacilaciones.
- Banda 1: Algunos errores de pronunciación o entonación. Fluidez buena pero con vacilaciones puntuales.
- Banda 0: Errores de pronunciación que afectan al ritmo natural. Fluidez inconsistente.
  `,
  'C2': `
EFICACIA COMUNICATIVA:
- Banda 3: Domina funciones de manera eficaz y natural, info relevante de forma clara y elaborada, extensión muy adecuada. Sin errores de adecuación.
- Banda 2: Desarrolla eficazmente las funciones, info clara y natural, extensión adecuada. Faltas de adecuación puntuales.
- Banda 1: Mayor parte de funciones cumplidas, info no siempre relevante o elaborada, extensión poco adecuada. Inconsistencias.
- Banda 0: No desarrolla funciones, info incomprensible o no natural, extensión inadecuada. Frecuentes inconsistencias.

COHERENCIA Y COHESIÓN:
- Banda 3: Discurso muy claro y complejo, bien estructurado y coherente. Gama muy amplia de mecanismos de cohesión de forma muy precisa.
- Banda 2: Discurso claro y complejo, bien estructurado y coherente (alguna imprecisión). Gama amplia de mecanismos de cohesión de forma generalmente precisa.
- Banda 1: Discurso no siempre claro o poco complejo/estructurado, desarrollo a veces incoherente. Pocos mecanismos de cohesión (toscos o imprecisos).
- Banda 0: Discurso poco claro o estructurado, progresión no suficientemente lógica. Numerosas incoherencias. Muy pocos mecanismos de cohesión.

CORRECCIÓN:
- Banda 3: Dominio casi total de estructuras complejas. Corrección y sin errores (algún desliz muy esporádico).
- Banda 2: Control consistente de estructuras complejas. Corrección y sin errores significativos.
- Banda 1: Control poco adecuado. Errores que afectan a la inteligibilidad.
- Banda 0: Control escaso o inadecuado. Errores notables muy frecuentes.

ALCANCE Y USO:
- Banda 3: Repertorio muy amplio y preciso, alto grado de complejidad sin ambigüedades. Incorpora expresiones idiomáticas.
- Banda 2: Repertorio amplio y preciso, con alguna inconsistencia no significativa. Incorpora algunas expresiones idiomáticas.
- Banda 1: Repertorio limitado y/o repetitivo e inapropiado. Imprecisiones significativas.
- Banda 0: Repertorio limitado y/o repetitivo y poco natural. Falta de precisión y naturalidad.

FONOLOGÍA Y FLUIDEZ:
- Banda 3: Pronunciación y entonación prácticamente nativas. Control total del ritmo y pausas. Fluidez total y natural sin esfuerzo alguno.
- Banda 2: Pronunciación y entonación muy claras y naturales. Se expresa con fluidez total y sin vacilaciones significativas.
- Banda 1: Errores esporádicos de pronunciación que delatan el nivel. Fluidez buena pero con vacilaciones en temas muy abstractos.
- Banda 0: Errores de pronunciación o entonación que afectan al ritmo. Fluidez irregular.
  `
};

