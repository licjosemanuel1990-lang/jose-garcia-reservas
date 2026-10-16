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
  //  historia     → breve historia que ve el cliente en la tarjeta
  // ---------------------------------------------------------
  paradas: [
    {
      id: "tresojos",
      nombre: "Parque Nacional Los Tres Ojos",
      descripcion: "Cuevas y lagos subterráneos de agua cristalina. Incluye el cruce en barquito al lago escondido.",
      historia: "Formado por cavernas de piedra caliza con cuatro lagos: tres bajo tierra, que dan nombre al parque, y un cuarto al aire libre al que se llega en un pequeño bote. Los taínos, primeros habitantes de la isla, usaban estas cuevas para sus ceremonias.",
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
      historia: "Inaugurado en 1992 para los 500 años de la llegada de Cristóbal Colón a América. Tiene forma de cruz, mide más de 200 metros de largo y guarda un mausoleo que, según la tradición dominicana, contiene los restos de Colón. De noche proyecta una cruz de luz en el cielo.",
      opciones: [
        { id: "entrar", nombre: "Con entrada al interior", porPersonaRD: 200 },
        { id: "foto",   nombre: "Solo vista panorámica y fotos (gratis)", porPersonaRD: 0 }
      ],
      foto: "Santo_Domingo_-_Faro_a_Colon.JPG",
      credito: "Martin Falbisoner, CC BY-SA 4.0",
      marcada: true
    },
    {
      id: "guia",
      nombre: "Tour guiado en la Zona Colonial",
      descripcion: "Un guía turístico certificado te acompaña por la Zona Colonial y te cuenta su historia, incluyendo la Calle Las Damas y el Panteón Nacional.",
      historia: "La Ciudad Colonial fue fundada en 1498 por Bartolomé Colón y es Patrimonio de la Humanidad por la UNESCO desde 1990. Con el guía recorrerás la Calle Las Damas, la primera calle trazada en América, y el Panteón Nacional, antigua iglesia jesuita del siglo XVIII donde descansan héroes de la patria.",
      grupoUSD: 40,                   // por grupo
      foto: "img/guia.jpg",
      marcada: true
    },
    {
      id: "alcazar",
      nombre: "Alcázar de Colón",
      descripcion: "Palacio de Diego Colón, hijo de Cristóbal Colón, en la Zona Colonial.",
      historia: "Construido entre 1510 y 1514 en piedra coralina para Diego Colón, hijo de Cristóbal Colón, y su esposa María de Toledo. Fue la primera residencia virreinal de América y hoy es un museo con muebles y objetos de la época.",
      porPersonaRD: 200,              // parte de los RD$600 de entradas en Zona Colonial
      foto: "img/alcazar.jpg",
      marcada: true
    },
    {
      id: "fortaleza",
      nombre: "Fortaleza Ozama",
      descripcion: "La fortaleza militar más antigua de América, junto al río Ozama.",
      historia: "Levantada a partir de 1502 a orillas del río Ozama para defender la ciudad, es la fortaleza militar europea más antigua de América. Destaca la Torre del Homenaje y, en la explanada, la estatua del cronista Gonzalo Fernández de Oviedo.",
      porPersonaRD: 200,
      foto: "img/fortaleza-ozama.jpg",
      marcada: true
    },
    {
      id: "catedral",
      nombre: "Catedral Primada de América",
      descripcion: "La primera catedral construida en América.",
      historia: "La Catedral de Santa María de la Encarnación se construyó entre 1512 y 1540 y es la primera catedral de América. Combina estilos gótico, renacentista y barroco, y en 1546 el papa Pablo III la nombró Primada de América.",
      porPersonaRD: 200,
      foto: "img/catedral.jpg",
      marcada: true
    },
    {
      id: "comida",
      nombre: "Almuerzo típico dominicano",
      descripcion: "Comida criolla en un restaurante local.",
      historia: "Disfruta la comida criolla dominicana, como la tradicional «bandera»: arroz blanco, habichuelas guisadas y carne, acompañados de ensalada y jugos naturales.",
      porPersonaRD: 700,
      foto: "img/comida.jpg",
      icono: "🍽️",
      marcada: true
    },
    {
      id: "malecon",
      nombre: "Letrero «♥ SD» en el Malecón",
      descripcion: "Parada fotográfica en el famoso letrero frente al mar Caribe.",
      historia: "El Malecón de Santo Domingo, a lo largo de la avenida George Washington, es el gran paseo de la ciudad frente al mar Caribe. El letrero «♥ SD» es uno de los puntos favoritos de visitantes para tomarse fotos.",
      foto: "img/malecon.jpg",
      icono: "📸",
      marcada: true
    },
    {
      id: "palacio",
      nombre: "Palacio Nacional",
      descripcion: "Parada frente al Palacio Nacional para tomarse fotos.",
      historia: "Sede del Gobierno dominicano, construido entre 1944 y 1947 en estilo neoclásico por el arquitecto italiano Guido D'Alessandro. Su cúpula y fachada de mármol rosado lo hacen uno de los edificios más elegantes del país.",
      foto: "Palacio_Nacional_SD_RD_02_2017_2005.jpg",
      credito: "Mariordo, CC BY-SA 4.0",
      marcada: true
    },
    {
      id: "plaza",
      nombre: "Sambil Santo Domingo",
      descripcion: "Tiempo para compras y descanso en el centro comercial Sambil.",
      historia: "Uno de los centros comerciales más grandes de Santo Domingo, con tiendas, restaurantes, cafeterías y cine. Ideal para hacer compras o descansar al final del recorrido.",
      cambiaTransporte: true,
      foto: "img/sambil.jpg",
      icono: "🛍️",
      marcada: false
    }
  ]
};
