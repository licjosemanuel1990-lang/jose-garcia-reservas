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
  //  foto         → nombre del archivo en Wikimedia Commons
  //  icono        → se usa si no hay foto
  // ---------------------------------------------------------
  paradas: [
    {
      id: "tresojos",
      nombre: "Parque Nacional Los Tres Ojos",
      descripcion: "Cuevas y lagos subterráneos de agua cristalina. Incluye el cruce en barquito al lago escondido.",
      porPersonaRD: 300,              // entrada RD$200 + barquito RD$100
      detalleCosto: "Entrada y barquito incluidos",
      foto: "Santo_Domingo_Este_-_Los_Tres_Ojos_0941.JPG",
      credito: "Phyrexian, CC BY-SA 4.0",
      marcada: true
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
      marcada: true
    },
    {
      id: "colonial",
      nombre: "Zona Colonial",
      descripcion: "La primera ciudad de América, con entrada a monumentos: Fortaleza Ozama, Panteón Nacional, Catedral Primada de América, Alcázar de Colón, Museo de las Casas Reales y Calle Las Damas.",
      porPersonaRD: 600,              // entradas a monumentos (por persona)
      opciones: [
        { id: "guia",   nombre: "Con guía turístico certificado", grupoUSD: 40 },
        { id: "libre",  nombre: "Sin guía (recorrido libre)",      grupoUSD: 0 }
      ],
      foto: "Catedral_Primada_CCSD_09_2018_1234.jpg",
      credito: "Mariordo, CC BY-SA 4.0",
      marcada: true
    },
    {
      id: "palacio",
      nombre: "Palacio Nacional",
      descripcion: "Parada frente al Palacio Nacional para tomarse fotos.",
      foto: "Palacio_Nacional_SD_RD_02_2017_2005.jpg",
      credito: "Mariordo, CC BY-SA 4.0",
      marcada: true
    },
    {
      id: "malecon",
      nombre: "Letrero «Santo Domingo» en el Malecón",
      descripcion: "Parada fotográfica junto al mar Caribe en el Malecón.",
      icono: "📸",
      marcada: true
    },
    {
      id: "comida",
      nombre: "Almuerzo típico dominicano",
      descripcion: "Comida criolla en un restaurante local.",
      porPersonaRD: 700,
      icono: "🍽️",
      marcada: true
    },
    {
      id: "plaza",
      nombre: "Sambil Santo Domingo",
      descripcion: "Tiempo para compras y descanso en el centro comercial Sambil.",
      cambiaTransporte: true,
      icono: "🛍️",
      marcada: false
    }
  ]
};
