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
  portada: "Aerial_view_Ciudad_Colonial_Santo_Domingo_09_2019_0067.jpg",

  // ---------------------------------------------------------
  // PARADAS del menú. El cliente elige las que quiera.
  //  porPersonaRD → costo por persona en pesos (entradas, comida)
  //  grupoUSD     → costo fijo del grupo en dólares (ej. guía)
  //  opciones     → variantes para elegir (ej. entrar o solo foto)
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
      foto: "LosTresOjos.JPG",
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
      foto: "Santo_Domingo.El_Faro_a_Colón.20170402.jpg",
      marcada: true
    },
    {
      id: "colonial",
      nombre: "Zona Colonial con guía autorizado",
      descripcion: "La primera ciudad de América. Recorrido con guía turístico autorizado y entrada a monumentos: Fortaleza Ozama, Panteón Nacional, Catedral Primada de América, Alcázar de Colón, Museo de las Casas Reales y Calle Las Damas.",
      porPersonaRD: 600,              // entradas a monumentos
      grupoUSD: 40,                   // guía turístico autorizado
      detalleCosto: "Guía y entradas incluidos",
      foto: "Catedral_Primada_SD_07_2017_4634.jpg",
      marcada: true
    },
    {
      id: "palacio",
      nombre: "Palacio Nacional",
      descripcion: "Parada frente al Palacio Nacional para tomarse fotos.",
      foto: "Palacio_Nacional_Republica_Dominicana_06_2018_8849.jpg",
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
      nombre: "Plaza comercial",
      descripcion: "Tiempo para compras en un centro comercial de la capital.",
      cambiaTransporte: true,
      icono: "🛍️",
      marcada: false
    }
  ]
};
