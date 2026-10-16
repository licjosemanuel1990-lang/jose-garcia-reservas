/*
 * ============================================================
 *  CITY TOUR SANTO DOMINGO — PRECIOS Y PARADAS
 *  Único archivo a editar para cambiar costos del tour.
 *  Los costos se escriben SIN margen: la página suma el margen.
 * ============================================================
 */
window.JGT_TOUR = {
  nombre: "City Tour Santo Domingo",
  salida: "Boca Chica",

  // Pesos dominicanos por cada dólar (para convertir entradas a US$).
  // Referencia Banco Central, octubre 2026: ~61.2. Ajustar si cambia.
  tasaCambio: 61,

  // Margen de beneficio sobre todos los costos (0.10 = 10 %).
  margen: 0.10,

  // Transporte (US$, por vehículo, ida y vuelta desde Boca Chica)
  transporte: 70,
  transporteConPlaza: 110,      // si el cliente añade la plaza comercial
  pasajerosIncluidos: 4,        // el transporte incluye hasta 4 personas
  cargoPasajeroAdicional: 10,   // US$ por cada persona desde la quinta
  maxPersonas: 15,              // más personas → "A cotizar"

  // Imagen principal
  portada: "Aerial_view_Catedral_Primada_CCSD_09_2019_0074.jpg",

  // ---------------------------------------------------------
  // PARADAS del menú. El cliente elige las que quiera.
  //  porPersonaRD → costo por persona en pesos (entradas, comida)
  //  grupoUSD     → costo fijo del grupo en dólares (ej. guía)
  //  opciones     → variantes para elegir; pueden tener su propio
  //                 porPersonaRD o grupoUSD (ej. con o sin guía)
  //  foto         → "img/archivo.jpg" (foto propia en tours/img/)
  //                 o nombre del archivo en Wikimedia Commons
  //  icono        → se usa si no hay foto
  // ---------------------------------------------------------
  paradas: [
    {
      id: "tresojos",
      nombre: "Parque Nacional Los Tres Ojos",
      descripcion: "Cuevas y lagos subterráneos de agua cristalina. Incluye el cruce en barquito al lago escondido.",
      porPersonaRD: 300,              // entrada RD$200 + barquito RD$100
      detalleCosto: "Entrada y barquito incluidos",
      foto: "img/tres-ojos.jpg",
      marcada: false
    },
    {
      id: "faro",
      nombre: "Faro a Colón",
      descripcion: "Monumental faro en memoria de Cristóbal Colón.",
      opciones: [
        { id: "entrar", nombre: "Con entrada al interior", porPersonaRD: 200 },
        { id: "foto",   nombre: "Solo vista panorámica y fotos (gratis)", porPersonaRD: 0 }
      ],
      foto: "Santo_Domingo_-_Faro_a_Colon.JPG",
      credito: "Martin Falbisoner, CC BY-SA 4.0",
      marcada: false
    },
    {
      id: "guia",
      nombre: "Tour guiado en la Zona Colonial",
      descripcion: "Un guía turístico certificado te acompaña por la Zona Colonial y te cuenta su historia, incluyendo la Calle Las Damas y el Panteón Nacional.",
      grupoUSD: 40,                   // por grupo
      foto: "img/guia.jpg",
      marcada: false
    },
    {
      id: "alcazar",
      nombre: "Alcázar de Colón",
      descripcion: "Palacio de Diego Colón, hijo de Cristóbal Colón, en la Zona Colonial.",
      porPersonaRD: 200,              // parte de los RD$600 de entradas en Zona Colonial
      foto: "img/alcazar.jpg",
      marcada: false
    },
    {
      id: "fortaleza",
      nombre: "Fortaleza Ozama",
      descripcion: "La fortaleza militar más antigua de América, junto al río Ozama.",
      porPersonaRD: 200,
      foto: "img/fortaleza-ozama.jpg",
      marcada: false
    },
    {
      id: "catedral",
      nombre: "Catedral Primada de América",
      descripcion: "La primera catedral construida en América.",
      porPersonaRD: 200,
      foto: "img/catedral.jpg",
      marcada: false
    },
    {
      id: "comida",
      nombre: "Almuerzo típico dominicano",
      descripcion: "Comida criolla en un restaurante local.",
      porPersonaRD: 700,
      foto: "img/comida.jpg",
      icono: "🍽️",
      marcada: false
    },
    {
      id: "malecon",
      nombre: "Letrero «♥ SD» en el Malecón",
      descripcion: "Parada fotográfica en el famoso letrero frente al mar Caribe.",
      foto: "img/malecon.jpg",
      icono: "📸",
      marcada: false
    },
    {
      id: "palacio",
      nombre: "Palacio Nacional",
      descripcion: "Parada frente al Palacio Nacional para tomarse fotos.",
      foto: "Palacio_Nacional_SD_RD_02_2017_2005.jpg",
      credito: "Mariordo, CC BY-SA 4.0",
      marcada: false
    },
    {
      id: "plaza",
      nombre: "Sambil Santo Domingo",
      descripcion: "Tiempo para compras y descanso en el centro comercial Sambil.",
      cambiaTransporte: true,
      foto: "img/sambil.jpg",
      icono: "🛍️",
      marcada: false
    }
  ]
};
