/* Idiomas: español (predeterminado) e inglés.
 * - Se elige con el botón ES / EN (se recuerda en el navegador).
 * - ?lang=en o ?lang=es en el enlace fuerza el idioma.
 * - Si el teléfono del cliente está en inglés, abre en inglés.
 * Para traducir un texto nuevo: agrega "texto en español": "English text" en EN.
 * El mensaje de WhatsApp al propietario siempre sale en español. */
(function () {
  "use strict";
  var KEY = "jgt_lang";
  function pick() {
    var q = (location.search.match(/[?&]lang=(en|es)\b/) || [])[1];
    if (q) { try { localStorage.setItem(KEY, q); } catch (e) {} return q; }
    try { var s = localStorage.getItem(KEY); if (s === "en" || s === "es") return s; } catch (e) {}
    var n = (navigator.languages && navigator.languages[0]) || navigator.language || "es";
    return /^en\b/i.test(n) ? "en" : "es";
  }
  var LANG = pick();
  window.JGT_LANG = LANG;
  document.documentElement.lang = LANG;

  var EN = {
    /* ---- Comunes ---- */
    "Moviendo Personas. Creando Confianza.": "Moving People. Building Trust.",
    "· Moviendo Personas. Creando Confianza.": "· Moving People. Building Trust.",
    "🚐 Traslados": "🚐 Transfers",
    "🏝️ Tours y excursiones": "🏝️ Tours & excursions",
    "👇 ¿Qué quieres reservar? Elige una opción:": "👇 What would you like to book? Choose one:",
    "Servicios": "Services",
    "Idioma": "Language",
    "Tus datos": "Your details",
    "Nombre completo *": "Full name *",
    "WhatsApp con código de país *": "WhatsApp with country code *",
    "Nombre y apellido": "First and last name",
    "Ej.: +1 809 555 1234": "E.g.: +1 809 555 1234",
    "Revisa los campos marcados en rojo.": "Please check the fields marked in red.",
    "Elige": "Choose",
    "Más de 15": "More than 15",
    "Más de 10": "More than 10",
    "A cotizar": "Quote needed",
    "Precio: a cotizar": "Price: quote needed",
    "Precio del servicio": "Service price",
    "Modificar datos": "Edit details",
    "CONTINUAR EN WHATSAPP": "CONTINUE ON WHATSAPP",
    "Para completar tu reserva,": "To complete your booking,",
    "continúa por WhatsApp": "continue on WhatsApp",
    "y envía el mensaje. Te confirmaremos la disponibilidad personalmente.": "and send the message. We will confirm availability personally.",
    "y envía el mensaje. Te confirmaremos la disponibilidad y cómo hacer el pago de la reserva.": "and send the message. We will confirm availability and how to pay the deposit.",
    "Cualquier servicio, tiempo de espera o condición fuera de estos parámetros estará sujeto a negociación y acuerdo previo entre ambas partes.": "Any service, waiting time or condition outside these terms is subject to prior negotiation and agreement between both parties.",
    "Elige la fecha.": "Choose the date.",
    "La fecha no puede ser anterior a hoy.": "The date cannot be earlier than today.",
    "Elige la hora.": "Choose the time.",
    "Esa hora ya pasó. Elige una hora futura.": "That time has passed. Choose a later time.",
    "Escribe tu nombre completo.": "Enter your full name.",
    "Escribe tu número de WhatsApp.": "Enter your WhatsApp number.",
    "Número incompleto. Incluye el código de país (ej.: +1 809 555 1234).": "Incomplete number. Include the country code (e.g.: +1 809 555 1234).",
    "Escribe el hotel o la dirección de recogida.": "Enter the hotel or pickup address.",
    "Elige cuántas personas.": "Choose how many people.",
    "Ej.: Hotel Don Juan, Boca Chica": "E.g.: Hotel Don Juan, Boca Chica",
    "Hotel, barrio o ciudad": "Hotel, neighborhood or city",
    "Reservar un traslado": "Book a transfer",
    "Tours y excursiones": "Tours & excursions",
    "Sin pagos anticipados: pagas al finalizar el servicio. La reserva queda confirmada cuando te respondamos por WhatsApp.": "No prepayment: you pay at the end of the service. Your booking is confirmed once we reply on WhatsApp.",

    /* ---- Traslados ---- */
    "Reservas | José García Transporte": "Bookings | José García Transporte",
    "Reserva tu traslado privado de forma rápida, segura y sin pagos anticipados.": "Book your private transfer quickly, safely and with no prepayment.",
    "Atención personalizada": "Personal service",
    "Pago al finalizar": "Pay at the end",
    "Traslados aeroportuarios": "Airport transfers",
    "Servicio privado": "Private service",
    "Cotización por WhatsApp": "Quotes on WhatsApp",
    "Tu traslado": "Your transfer",
    "Origen *": "Pickup *",
    "Destino *": "Drop-off *",
    "Selecciona una ubicación": "Select a location",
    "Aeropuerto Las Américas (SDQ)": "Las Américas Airport (SDQ)",
    "Santo Domingo Centro": "Santo Domingo (downtown)",
    "San Pedro de Macorís Centro": "San Pedro de Macorís (downtown)",
    "Otra ubicación — escribir dirección": "Other location — type the address",
    "Hotel, aeropuerto, barrio, ciudad o dirección": "Hotel, airport, neighborhood, city or address",
    "Escribe el origen": "Type the pickup location",
    "Escribe el destino": "Type the drop-off location",
    "Intercambiar origen y destino": "Swap pickup and drop-off",
    "Tipo de servicio *": "Service type *",
    "Tipo de servicio": "Service type",
    "Solo ida": "One way",
    "Ida y vuelta": "Round trip",
    "Fecha del traslado *": "Transfer date *",
    "Hora del traslado *": "Transfer time *",
    "Fecha de regreso *": "Return date *",
    "Hora de regreso *": "Return time *",
    "Pasajeros *": "Passengers *",
    "Maletas grandes": "Large suitcases",
    "Equipaje de mano": "Carry-on bags",
    "Número de vuelo": "Flight number",
    "Aerolínea (opcional)": "Airline (optional)",
    "Ej.: AA1234": "E.g.: AA1234",
    "Ej.: American Airlines": "E.g.: American Airlines",
    "Tarifa estimada": "Estimated fare",
    "Tarifa estimada · ida y vuelta": "Estimated fare · round trip",
    "Tarifa estimada · solo ida": "Estimated fare · one way",
    "Tarifa pendiente de cotización": "Fare to be quoted",
    "Revisa el regreso": "Check the return",
    "Selecciona origen y destino.": "Select pickup and drop-off.",
    "El origen y el destino deben ser diferentes.": "Pickup and drop-off must be different.",
    "El regreso debe ser posterior a la salida.": "The return must be after the departure.",
    "SOLICITAR RESERVA POR WHATSAPP": "REQUEST BOOKING ON WHATSAPP",
    "Importante:": "Important:",
    "este formulario prepara tu solicitud por WhatsApp. La reserva queda confirmada solo cuando te respondamos con disponibilidad y precio final.": "this form prepares your request on WhatsApp. Your booking is confirmed only when we reply with availability and the final price.",
    "Sin pagos anticipados: pagas al finalizar el servicio. Atención 24/7, sujeta a disponibilidad.": "No prepayment: you pay at the end of the service. Available 24/7, subject to availability.",
    "Tarifas para hasta 4 pasajeros. A partir del quinto pasajero se suman US$10 por persona en cada trayecto.": "Fares for up to 4 passengers. From the 5th passenger on, add US$10 per person per leg.",
    "Ida y vuelta: 22 % de descuento solo si el regreso es el mismo día y la espera no pasa de 4 horas desde la hora de salida. Si el regreso es otro día, se cobran los dos trayectos a tarifa normal.": "Round trip: 22% off only if you return the same day and the wait is no more than 4 hours from the departure time. If you return on another day, both legs are charged at the regular fare.",
    "Tu solicitud está lista": "Your request is ready",
    "Sin pagos anticipados · Pagas al finalizar el servicio.": "No prepayment · You pay at the end of the service.",
    "¿Quieres pasear?": "Want to explore?",
    "Tours: City Tour e Isla Saona": "Tours: City Tour, Saona Island and Four Wheel",
    "Selecciona el origen.": "Select the pickup location.",
    "Escribe la dirección o lugar de origen.": "Type the pickup address or place.",
    "Selecciona el destino.": "Select the drop-off location.",
    "Escribe la dirección o lugar de destino.": "Type the drop-off address or place.",
    "El destino no puede ser igual al origen.": "Drop-off cannot be the same as pickup.",
    "Elige la fecha de regreso.": "Choose the return date.",
    "El regreso no puede ser antes de la salida.": "The return cannot be before the departure.",
    "Elige la hora de regreso.": "Choose the return time.",
    "Elige la cantidad de pasajeros.": "Choose the number of passengers.",
    "Cantidad no válida.": "Invalid quantity.",
    "Te enviaremos el precio por WhatsApp.": "We will send you the price on WhatsApp.",
    "Sujeto a confirmación de disponibilidad.": "Subject to availability.",

    /* ---- Tours: portada y selector ---- */
    "Tours y excursiones | José García Transporte": "Tours & excursions | José García Transporte",
    "Saliendo desde Boca Chica": "Departing from Boca Chica",
    "Elige tu aventura: City Tour por Santo Domingo, Tour Isla Saona todo incluido, Tour en Four Wheel o Four Wheel Boca Chica. Transporte privado desde tu hotel; City Tour e Isla Saona sin pagos anticipados.": "Choose your adventure: Santo Domingo City Tour, all-inclusive Saona Island Tour, Four Wheel Tour or Four Wheel Boca Chica. Private transportation from your hotel; no prepayment for the City Tour and Saona Island.",
    "¿Qué tour quieres hacer?": "Which tour would you like?",
    "Elige tu tour": "Choose your tour",
    "Arma tu recorrido: Tres Ojos, Zona Colonial, Malecón y más.": "Build your route: Tres Ojos, Colonial Zone, Malecón and more.",
    "Ver opciones →": "See options →",
    "Tour Isla Saona": "Saona Island Tour",
    "Todo incluido: catamarán, piscina natural y buffet dominicano.": "All inclusive: catamaran, natural pool and Dominican buffet.",
    "Tour en Four Wheel": "Four Wheel Tour",
    "Aventura en Comatillo: bosque, ríos, barro y la cascada Salto Alto.": "Adventure in Comatillo: forest, rivers, mud and the Salto Alto waterfall.",
    "Calcula tu precio": "Get your price",
    "Reservar": "Book",
    "Continuar": "Continue",
    "Fecha *": "Date *",
    "Personas *": "People *",
    "Recogida en *": "Pickup in *",
    "Otra zona — escribir": "Other area — type it",
    "Hotel o dirección *": "Hotel or address *",
    "Incluye:": "Includes:",
    "Precio total": "Total price",
    "Precio total del tour": "Total tour price",
    "Elige cuántas personas son.": "Choose how many people.",
    "Transporte privado": "Private transportation",
    "Te recogemos": "We pick you up",
    "Te llevamos de vuelta": "We take you back",
    "a tu hotel.": "to your hotel.",
    "Calcula tu precio y reserva": "Get your price and book",
    "Fotos de": "Photos from",
    "licencia": "license",
    ": Martin Falbisoner (Faro a Colón), Mariordo (Palacio Nacional y portada), licencia": ": Martin Falbisoner (Columbus Lighthouse), Mariordo (National Palace and cover), license",

    /* ---- City Tour ---- */
    "Arma tu tour a tu gusto": "Build your own tour",
    "Tú decides qué visitar 👇": "You decide what to visit 👇",
    "Toca": "Tap",
    "«+ Agregar»": "«+ Add»",
    "en los lugares que quieras conocer.": "on the places you want to visit.",
    "Mira tu precio en la barra de abajo: cambia con cada lugar que agregas o quitas.": "See your price in the bar below: it changes with every place you add or remove.",
    "Cuando te guste, completa tus datos y reserva por WhatsApp.": "When you're happy, fill in your details and book on WhatsApp.",
    "Pagas solo lo que eliges · Sin pagos anticipados": "Pay only for what you choose · No prepayment",
    "Cuevas y lagos subterráneos de agua cristalina. Incluye el cruce en barquito al lago escondido.": "Caves and crystal-clear underground lakes. Includes the small boat ride to the hidden lake.",
    "Entradas y servicios incluidos": "Tickets and services included",
    "+ Agregar al tour": "+ Add to tour",
    "✓ Agregado · tocar para quitar": "✓ Added · tap to remove",
    "Faro a Colón": "Columbus Lighthouse",
    "Monumental faro en memoria de Cristóbal Colón.": "Monumental lighthouse in memory of Christopher Columbus.",
    "Con entrada al interior": "With entrance inside",
    "Solo vista panorámica y fotos (gratis)": "Outside view and photos only (free)",
    "Tour guiado en la Zona Colonial": "Guided tour of the Colonial Zone",
    "Un guía turístico certificado te acompaña por la Zona Colonial y te cuenta su historia, incluyendo la Calle Las Damas y el Panteón Nacional.": "A certified tour guide walks you through the Colonial Zone and tells you its history, including Calle Las Damas and the National Pantheon.",
    "Alcázar de Colón": "Alcázar de Colón (Columbus Palace)",
    "Palacio de Diego Colón, hijo de Cristóbal Colón, en la Zona Colonial.": "Palace of Diego Columbus, son of Christopher Columbus, in the Colonial Zone.",
    "Fortaleza Ozama": "Ozama Fortress",
    "La fortaleza militar más antigua de América, junto al río Ozama.": "The oldest military fortress in the Americas, by the Ozama River.",
    "Catedral Primada de América": "Cathedral of Santa María la Menor",
    "La primera catedral construida en América.": "The first cathedral built in the Americas.",
    "Almuerzo típico dominicano": "Typical Dominican lunch",
    "Comida criolla en un restaurante local.": "Creole food at a local restaurant.",
    "Letrero «♥ SD» en el Malecón": "«♥ SD» sign on the Malecón",
    "Parada fotográfica en el famoso letrero frente al mar Caribe.": "Photo stop at the famous sign facing the Caribbean Sea.",
    "Parada gratuita": "Free stop",
    "Palacio Nacional": "National Palace",
    "Parada frente al Palacio Nacional para tomarse fotos.": "Stop in front of the National Palace to take photos.",
    "Tiempo para compras y descanso en el centro comercial Sambil.": "Time for shopping and a break at the Sambil mall.",
    "Opcional": "Optional",
    "Fecha y recogida": "Date and pickup",
    "Fecha del tour *": "Tour date *",
    "Hora de recogida *": "Pickup time *",
    "Precio del tour": "Tour price",
    "Agrega tu primer lugar para ver el precio.": "Add your first place to see the price.",
    "SOLICITAR TOUR POR WHATSAPP": "REQUEST TOUR ON WHATSAPP",
    "transporte privado ida y vuelta desde Boca Chica y las entradas y servicios de las paradas elegidas. El precio es para todo el grupo.": "private round-trip transportation from Boca Chica and the tickets and services for the stops you choose. The price is for the whole group.",
    "Toca «+ Agregar» en los lugares": "Tap «+ Add» on the places",
    "y mira tu precio aquí": "and see your price here",
    "Tu tour está listo": "Your tour is ready",
    "Modificar tour": "Edit tour",
    "Agrega al menos un lugar a tu tour.": "Add at least one place to your tour.",
    "Precio total del grupo, con transporte privado incluido.": "Total price for the group, private transportation included.",
    "Recogida fuera de Boca Chica: te cotizaremos el transporte por WhatsApp.": "Pickup outside Boca Chica: we will quote the transportation on WhatsApp.",
    "Recogida fuera de Boca Chica: te cotizaremos el precio por WhatsApp.": "Pickup outside Boca Chica: we will quote the price on WhatsApp.",

    /* ---- Isla Saona ---- */
    "Todo esto está incluido": "All of this is included",
    "Ida y vuelta desde tu hotel.": "Round trip from your hotel.",
    "Catamarán": "Catamaran",
    "Navega por el Caribe con música y buen ambiente.": "Sail the Caribbean with music and a great vibe.",
    "Piscina natural": "Natural pool",
    "Agua cristalina a la altura de la cintura, en medio del mar.": "Waist-deep crystal-clear water in the middle of the sea.",
    "Isla Saona": "Saona Island",
    "Tiempo libre en una de las playas más bellas del país.": "Free time on one of the most beautiful beaches in the country.",
    "Buffet dominicano": "Dominican buffet",
    "Comida criolla servida en la isla.": "Creole food served on the island.",
    "Playa de Isla Saona": "Saona Island beach",
    "Palmeras y arena blanca": "Palm trees and white sand",
    "Diversión en el agua": "Fun in the water",
    "Música y baile a bordo": "Music and dancing on board",
    "Playas del Caribe": "Caribbean beaches",
    "Fotos de la excursión": "Excursion photos",
    "Así será tu día": "Your day",
    "en tu hotel en vehículo privado.": "at your hotel in a private vehicle.",
    "Subes al catamarán": "You board the catamaran",
    "y navegas rumbo a la isla.": "and sail to the island.",
    "Te bañas en la piscina natural": "You swim in the natural pool",
    ", en medio del mar.": ", in the middle of the sea.",
    "Disfrutas la playa y el buffet": "You enjoy the beach and the buffet",
    "en Isla Saona.": "on Saona Island.",
    "RESERVAR TOUR ISLA SAONA POR WHATSAPP": "BOOK SAONA ISLAND TOUR ON WHATSAPP",
    "transporte privado ida y vuelta, catamarán, piscina natural, playa en Isla Saona y buffet dominicano. El precio es el total del grupo.": "private round-trip transportation, catamaran, natural pool, Saona Island beach and Dominican buffet. The price is the total for the group.",
    "Tu excursión está lista": "Your excursion is ready",
    "Todo incluido.": "All inclusive.",
    "Todo incluido: transporte, catamarán, piscina natural y buffet.": "All inclusive: transportation, catamaran, natural pool and buffet.",

    /* ---- Combo y preguntas frecuentes ---- */
    "Arma tu combo:": "Build your combo:",
    "con 2 o más servicios pagas precios de combo: recogida en el aeropuerto US$20, regreso US$15, City Tour US$10 menos y four wheels más baratos.": "with 2 or more services you pay combo prices: airport pickup US$20, return US$15, City Tour US$10 off and cheaper four wheels.",
    "🎁 Arma tu combo: traslados + tours": "🎁 Build your combo: transfers + tours",
    "Agrega 2 o más servicios con el botón «Agregar a mi combo» y paga precios de combo:": "Add 2 or more services with the “Add to my combo” button and pay combo prices:",
    "Recogida en el aeropuerto (SDQ → Boca Chica):": "Airport pickup (SDQ → Boca Chica):",
    "US$20 en vez de US$25, hasta 4 personas; +US$5 por persona adicional": "US$20 instead of US$25, up to 4 people; +US$5 per additional person",
    "Regreso al aeropuerto (Boca Chica → SDQ):": "Return to the airport (Boca Chica → SDQ):",
    "US$15, hasta 4 personas; +US$5 por persona adicional": "US$15, up to 4 people; +US$5 per additional person",
    "City Tour:": "City Tour:", "US$10 menos": "US$10 off",
    "Four Wheel en Comatillo:": "Four Wheel in Comatillo:", "RD$500 menos por four wheel": "RD$500 off per four wheel",
    "Four Wheel Boca Chica:": "Four Wheel Boca Chica:", "US$5 menos por four wheel": "US$5 off per four wheel",
    "Isla Saona también entra en el combo y suma como servicio, con su precio normal.": "Saona Island can also join the combo and counts as a service, at its regular price.",
    "Ver tours →": "See tours →",
    "Tours: City Tour, Isla Saona y Four Wheel": "Tours: City Tour, Saona Island and Four Wheel",
    "Tour Isla Saona (todo incluido)": "Saona Island Tour (all inclusive)",
    "Preguntas frecuentes": "Frequently asked questions",
    "¿Cómo se confirma mi reserva?": "How is my booking confirmed?",
    "Llenas el formulario y lo envías por WhatsApp. Te respondemos personalmente con la disponibilidad, y la reserva queda confirmada con nuestra respuesta.": "Fill in the form and send it on WhatsApp. We reply personally with availability, and your booking is confirmed with our reply.",
    "¿Tengo que pagar por adelantado?": "Do I have to pay in advance?",
    "No. Los traslados, el City Tour, Isla Saona y el Four Wheel Boca Chica se pagan al finalizar el servicio. Solo el Four Wheel en Comatillo se reserva con el 50 %, por su alta demanda.": "No. Transfers, the City Tour, Saona Island and Four Wheel Boca Chica are paid at the end of the service. Only the Four Wheel in Comatillo requires a 50% deposit, due to high demand.",
    "¿El precio es por persona o por grupo?": "Is the price per person or per group?",
    "Es el total del grupo. Los traslados incluyen hasta 4 pasajeros; desde el quinto se suman US$10 por persona en cada trayecto. En los four wheels el precio es por four wheel, con 1 o 2 personas en cada uno.": "It is the total for the group. Transfers include up to 4 passengers; from the fifth, US$10 per person is added on each leg. For four wheels the price is per four wheel, with 1 or 2 people on each.",
    "¿Recogen fuera de Boca Chica?": "Do you pick up outside Boca Chica?",
    "Sí. Elige «Otra zona» en el formulario y te enviamos el precio por WhatsApp.": "Yes. Choose \u201cOther area\u201d in the form and we will send you the price on WhatsApp.",
    "¿Cómo funciona el combo?": "How does the combo work?",
    "Agrega cada servicio con el botón «Agregar a mi combo» y al final envía todo junto por WhatsApp. Con 2 o más servicios pagas precios de combo: recogida en el aeropuerto US$20 y regreso US$15 (hasta 4 personas; +US$5 por persona adicional), City Tour US$10 menos, Four Wheel en Comatillo RD$500 menos por four wheel y Four Wheel Boca Chica US$5 menos por four wheel. Isla Saona mantiene su precio.": "Add each service with the \u201cAdd to my combo\u201d button and send everything together on WhatsApp at the end. With 2 or more services you pay combo prices: airport pickup US$20 and return US$15 (up to 4 people; +US$5 per additional person), City Tour US$10 off, Four Wheel in Comatillo RD$500 off per four wheel and Four Wheel Boca Chica US$5 off per four wheel. Saona Island keeps its price.",
    "¿Puedo cambiar o cancelar mi reserva?": "Can I change or cancel my booking?",
    "Cancelación gratis hasta 24 horas antes del servicio.": "Free cancellation up to 24 hours before the service.",
    "Cambios de fecha u hora sin costo, avisando con al menos 24 horas y sujetos a disponibilidad.": "Date or time changes at no cost with at least 24 hours' notice, subject to availability.",
    "Four Wheel en Comatillo: si cancelas con menos de 24 horas o no te presentas, la reserva del 50 % no se devuelve.": "Four Wheel in Comatillo: if you cancel less than 24 hours before or do not show up, the 50% deposit is not refunded.",
    "Si nosotros cancelamos por mal tiempo u otra causa, cambiamos la fecha o te devolvemos todo lo pagado.": "If we cancel due to bad weather or another reason, we will change the date or refund everything you paid.",
    "¿Otra pregunta?": "Another question?",
    "Escríbenos por WhatsApp": "Message us on WhatsApp",
    /* ---- Four Wheel Boca Chica ---- */
    "Four Wheel Boca Chica": "Four Wheel Boca Chica",
    "Aventura aquí mismo: caminos de barro, la cantera, el lago y senderos de bosque.": "Adventure right here: muddy roads, the quarry, the lake and forest trails.",
    "Aquí mismo en Boca Chica": "Right here in Boca Chica",
    "Maneja tu propio four wheel por caminos de barro entre palmeras, una antigua cantera de roca, la orilla del lago y senderos de bosque, siempre con guía. Sin viajes largos: la aventura empieza en Boca Chica.": "Drive your own four wheel along muddy palm-lined roads, an old rock quarry, the lakeshore and forest trails, always with a guide. No long drives: the adventure starts in Boca Chica.",
    "por four wheel · 1 o 2 personas en cada uno": "per four wheel · 1 or 2 people on each",
    "Fotos del tour": "Tour photos",
    "Four wheels frente a la cantera": "Four wheels in front of the quarry",
    "La cantera": "The quarry",
    "Caravana de four wheels por un camino de barro con palmeras": "Four wheel convoy on a muddy road lined with palms",
    "Caminos de barro": "Muddy roads",
    "Grupo en four wheels a la orilla del lago": "Group on four wheels by the lake",
    "Parada en el lago": "Stop at the lake",
    "Dos four wheels en un sendero de bosque": "Two four wheels on a forest trail",
    "Senderos de bosque": "Forest trails",
    "Grupo grande listo para salir": "Large group ready to ride",
    "Ideal para grupos": "Great for groups",
    "Pareja en four wheel junto al lago": "Couple on a four wheel by the lake",
    "Fotos junto al agua": "Photos by the water",
    "Se reserva con el": "Book with",
    "del valor total. El": "of the total price. You pay the",
    "resto lo pagas al llegar": "rest when you arrive",
    "el día del tour.": "on the day of the tour.",
    "Lo que incluye": "What's included",
    "Cada uno lleva 1 o 2 personas. Si van 2, pagan un solo four wheel.": "Each one carries 1 or 2 people. If 2 ride together, you pay for one four wheel.",
    "Casco y guía": "Helmet and guide",
    "Charla de seguridad antes de salir y guía durante toda la ruta.": "Safety briefing before you start and a guide for the whole ride.",
    "Barro, cantera, lago y bosque con paradas para fotos.": "Mud, quarry, lake and forest with photo stops.",
    "Ropa que se pueda ensuciar y zapatos cerrados.": "Clothes that can get dirty and closed shoes.",
    "Pañuelo o pasamontañas y gafas para el polvo y el barro.": "A bandana or balaclava and goggles for the dust and mud.",
    "Protector solar, agua y funda impermeable para el celular.": "Sunscreen, water and a waterproof phone case.",
    "Mañana": "Morning",
    "Tarde": "Afternoon",
    "Te confirmamos la hora exacta por WhatsApp.": "We will confirm the exact time on WhatsApp.",
    "Hotel en *": "Hotel in *",
    "RESERVAR FOUR WHEEL BOCA CHICA POR WHATSAPP": "BOOK FOUR WHEEL BOCA CHICA ON WHATSAPP",
    "Precio:": "Price:",
    "US$70 por four wheel, con 1 o 2 personas en cada uno. El precio es el total del grupo.": "US$70 per four wheel, with 1 or 2 people on each. The price is the total for the group.",
    "se reserva con el 50 % del valor total y el resto se paga al llegar. La reserva queda confirmada cuando te respondamos por WhatsApp.": "book with 50% of the total price and pay the rest when you arrive. Your booking is confirmed when we reply on WhatsApp.",
    "US$70 por four wheel, con 1 o 2 personas en cada uno.": "US$70 per four wheel, with 1 or 2 people on each.",
    "Se reserva con el 50 % · El resto lo pagas al llegar.": "Book with 50% · Pay the rest when you arrive.",
    /* ---- Four Wheel ---- */
    "A 1 hora de Boca Chica": "1 hour from Boca Chica",
    "Four Wheel en Comatillo": "Four Wheel in Comatillo",
    "Bosque, agua y barro en una sola salida. Maneja tu four wheel unas 3 horas por senderos de tierra, sube a la Loma de Managua y báñate en el río Salto Alto. Una aventura en plena naturaleza, lejos de la playa.": "Forest, water and mud in one trip. Ride your four wheel for about 3 hours on dirt trails, climb Loma de Managua and swim in the Salto Alto river. An adventure in the middle of nature, away from the beach.",
    "Elige tu plan": "Choose your plan",
    "Más elegido": "Most popular",
    "Tour Básico": "Basic Tour",
    "Unas 3 horas de ruta por la Loma de Managua con tiempo de baño en el río Salto Alto. Ideal para tu primera aventura.": "About 3 hours on the Loma de Managua trail with time to swim in the Salto Alto river. Ideal for your first adventure.",
    "Río Salto Alto": "Salto Alto river",
    "Todo lo del Básico más una visita al río La Jorqueta.": "Everything in the Basic plus a visit to La Jorqueta river.",
    "Río La Jorqueta": "La Jorqueta river",
    "Todo lo del Básico más río privado, piscina y tobogán. Para grupos de 10 personas o más, sujeto a disponibilidad.": "Everything in the Basic plus a private river, pool and water slide. For groups of 10 people or more, subject to availability.",
    "Río privado, piscina y tobogán": "Private river, pool and water slide",
    "Senderos en el bosque": "Forest trails",
    "Cruce de río": "River crossing",
    "Cascada Salto Alto": "Salto Alto waterfall",
    "Mucho barro": "Lots of mud",
    "Agua de coco en la ruta": "Coconut water on the way",
    "Paradas en el campo": "Countryside stops",
    "Refréscate en el río": "Cool off in the river",
    "Fotos de la aventura": "Adventure photos",
    "Four wheel en el bosque de Comatillo": "Four wheel in the Comatillo forest",
    "Mirador Loma de Managua": "Loma de Managua viewpoint",
    "Four wheel lleno de barro": "Four wheel covered in mud",
    "Parada en el camino": "Stop along the way",
    "Disfrutando el río": "Enjoying the river",
    "Cómo reservar": "How to book",
    "Este tour tiene": "This tour is in",
    "alta demanda": "high demand",
    ", por eso se reserva con el": ", so you book it with",
    "del valor total. El": "of the total price. The",
    "resto lo pagas al abordar": "rest is paid when you board",
    "el vehículo el día del tour.": "the vehicle on the day of the tour.",
    "Lo que incluye tu aventura": "What your adventure includes",
    "Ida y vuelta desde tu hotel hasta Comatillo.": "Round trip from your hotel to Comatillo.",
    "Cada uno lleva 1 o 2 personas. Si van 2, pagan un solo four wheel. Opción de 300cc, más grande y cómodo.": "Each one carries 1 or 2 people. If 2 ride together, you pay for one four wheel. 300cc option, bigger and more comfortable.",
    "Ruta natural": "Nature trail",
    "Bosque, ríos y barro con guía local.": "Forest, rivers and mud with a local guide.",
    "Comida criolla (opcional)": "Creole food (optional)",
    "Arroz, habichuelas, moro de guandules, pollo frito, cerdo guisado y ensalada.": "Rice, beans, rice with pigeon peas, fried chicken, stewed pork and salad.",
    "Así será tu aventura": "Your adventure",
    "en tu hotel (7:30 a.m. o 12:30 p.m., según el horario) y viajamos cerca de 1 hora hasta Comatillo.": "at your hotel (7:30 a.m. or 12:30 p.m., depending on the schedule) and we drive about 1 hour to Comatillo.",
    "Llegas a la base en Comatillo": "You arrive at the base in Comatillo",
    ", recibes tu four wheel y una charla de seguridad.": ", get your four wheel and a safety briefing.",
    "Arranca la ruta": "The ride begins",
    "de 3 a 3 horas y media por senderos de tierra, barro y bosque.": "3 to 3½ hours on dirt, mud and forest trails.",
    ": vista panorámica del campo.": ": panoramic view of the countryside.",
    ": tiempo para bañarte.": ": time to swim.",
    ": visita al río La Jorqueta.": ": visit to La Jorqueta river.",
    ": río privado, piscina y tobogán.": ": private river, pool and water slide.",
    "Comida criolla": "Creole food",
    "si la agregaste, y regreso a tu hotel.": "if you added it, and return to your hotel.",
    "Horario mañana": "Morning schedule",
    "Horario tarde": "Afternoon schedule",
    "Te recogemos a las": "We pick you up at",
    "Ruta de 9:00 a.m. a 12:00 p.m.": "Ride from 9:00 a.m. to 12:00 p.m.",
    "Ruta de 2:00 p.m. a 5:00 p.m.": "Ride from 2:00 p.m. to 5:00 p.m.",
    "El clima fresco para entrar con energía.": "Cool weather to start with energy.",
    "La luz de la tarde para vivir barro, río y bosque.": "Afternoon light for mud, river and forest.",
    "Recomendación: salimos 1 hora y media antes de cada ruta para llegar a tiempo a Comatillo. Si te recogemos fuera de Boca Chica, te confirmamos la hora por WhatsApp.": "Tip: we leave 1½ hours before each ride to reach Comatillo on time. If we pick you up outside Boca Chica, we will confirm the time on WhatsApp.",
    "Qué llevar": "What to bring",
    "Ropa que se pueda ensuciar (mejor licra o ropa deportiva) y zapatos cerrados o de agua.": "Clothes that can get dirty (lycra or sportswear is best) and closed-toe or water shoes.",
    "Pasamontañas o pañuelo y gafas para el polvo y el barro. Si no tienes, en la base hay: gafas en alquiler RD$150, pasamontañas RD$200, pañuelos RD$100 y protector de celular RD$200.": "Balaclava or bandana and goggles for dust and mud. If you don't have them, the base has: goggle rental RD$150, balaclavas RD$200, bandanas RD$100 and phone protectors RD$200.",
    "Traje de baño, toalla y una muda de ropa para el regreso.": "Swimsuit, towel and a change of clothes for the ride back.",
    "Funda impermeable para el celular, protector solar y repelente.": "Waterproof phone pouch, sunscreen and insect repellent.",
    "No recomendado para embarazadas ni para personas con problemas de espalda o del corazón.": "Not recommended for pregnant women or people with back or heart problems.",
    "Plan *": "Plan *",
    "Tour Básico (Loma de Managua + río Salto Alto)": "Basic Tour (Loma de Managua + Salto Alto river)",
    "Tour Plus (+ río La Jorqueta)": "Plus Tour (+ La Jorqueta river)",
    "Tour Premium (+ río privado, piscina y tobogán · mín. 10 personas)": "Premium Tour (+ private river, pool and slide · min. 10 people)",
    "Tour Plus": "Plus Tour",
    "Tour Premium": "Premium Tour",
    "Cantidad de four wheels *": "Number of four wheels *",
    "Cada four wheel lleva 1 o 2 personas.": "Each four wheel carries 1 or 2 people.",
    "Tipo de four wheel *": "Four wheel type *",
    "Estándar": "Standard",
    "300cc, más grande y cómodo (+US$4.84 c/u)": "300cc, bigger and more comfortable (+US$4.84 each)",
    "Comida criolla *": "Creole food *",
    "No, gracias": "No, thanks",
    "Sí, agregar comida": "Yes, add food",
    "Horario *": "Schedule *",
    "Mañana · te recogemos 7:30 a.m. (ruta 9:00 – 12:00)": "Morning · pickup 7:30 a.m. (ride 9:00 – 12:00)",
    "Tarde · te recogemos 12:30 p.m. (ruta 2:00 – 5:00)": "Afternoon · pickup 12:30 p.m. (ride 2:00 – 5:00)",
    "Salimos 1 hora y media antes para llegar a tiempo a Comatillo.": "We leave 1½ hours early to reach Comatillo on time.",
    "RESERVAR TOUR EN FOUR WHEEL POR WHATSAPP": "BOOK FOUR WHEEL TOUR ON WHATSAPP",
    "transporte privado ida y vuelta y la ruta del plan elegido en four wheel. La comida criolla es opcional. El precio es el total del grupo.": "private round-trip transportation and the four wheel ride for the chosen plan. Creole food is optional. The price is the total for the group.",
    "Reserva:": "Deposit:",
    "por la alta demanda de este tour, se reserva con el 50 % del valor total. El resto lo pagas al abordar el vehículo. La reserva queda confirmada cuando te respondamos por WhatsApp.": "due to high demand, this tour is booked with 50% of the total price. You pay the rest when you board the vehicle. Your booking is confirmed once we reply on WhatsApp.",
    "Tu aventura está lista": "Your adventure is ready",
    "Este tour se reserva con el 50 % por su alta demanda · El resto lo pagas al abordar.": "This tour is booked with a 50% deposit due to high demand · You pay the rest when you board.",
    "Elige cuántos four wheels.": "Choose how many four wheels.",
    "No puede haber más four wheels que personas.": "There can't be more four wheels than people.",
    "Incluye transporte privado ida y vuelta y la ruta en four wheel.": "Includes private round-trip transportation and the four wheel ride."
  };

  function norm(s) { return s.replace(/\s+/g, " ").trim(); }
  /* T: traduce un texto exacto. L: elige entre dos versiones. */
  window.T = function (s) { if (LANG !== "en" || s == null) return s; var k = norm(String(s)); return EN.hasOwnProperty(k) ? EN[k] : s; };
  window.L = function (es, en) { return LANG === "en" ? en : es; };

  var ATTRS = ["placeholder", "aria-label", "alt", "title"];
  function trText(n) {
    var v = n.nodeValue, k = norm(v);
    if (!k || !EN.hasOwnProperty(k)) return;
    var m = v.match(/^(\s*)[\s\S]*?(\s*)$/);
    n.nodeValue = m[1] + EN[k] + m[2];
  }
  function trEl(el) {
    ATTRS.forEach(function (a) {
      var v = el.getAttribute && el.getAttribute(a);
      if (v && EN.hasOwnProperty(norm(v))) el.setAttribute(a, EN[norm(v)]);
    });
    if (el.tagName === "OPTION" && !el.dataset.es) el.dataset.es = el.text;
  }
  function walk(root) {
    if (root.nodeType === 3) { trText(root); return; }
    if (root.nodeType !== 1 || root.tagName === "SCRIPT" || root.tagName === "STYLE") return;
    trEl(root);
    root.querySelectorAll("*").forEach(trEl);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n, list = [];
    while ((n = w.nextNode())) list.push(n);
    list.forEach(function (t) { var p = t.parentElement; if (p && p.tagName !== "SCRIPT" && p.tagName !== "STYLE") trText(t); });
  }

  /* Las opciones guardan su texto en español para el mensaje al propietario */
  window.esText = function (sel) {
    var o = sel.options[sel.selectedIndex];
    return o ? (o.dataset.es || o.text) : "";
  };

  function setupSwitch() {
    if (LANG === "en") document.querySelectorAll(".svc-switch a").forEach(function (a) {
      var h = a.getAttribute("href"); if (h.indexOf("lang=") < 0) a.setAttribute("href", h + "?lang=en");
    });
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      b.classList.toggle("on", b.dataset.lang === LANG);
      b.setAttribute("aria-pressed", b.dataset.lang === LANG ? "true" : "false");
      b.addEventListener("click", function () {
        if (b.dataset.lang === LANG) return;
        try { localStorage.setItem(KEY, b.dataset.lang); } catch (e) {}
        var u = new URL(location.href);
        u.searchParams.set("lang", b.dataset.lang);
        location.href = u.toString();
      });
    });
  }

  function start() {
    setupSwitch();
    if (LANG !== "en") return;
    if (EN.hasOwnProperty(norm(document.title))) document.title = EN[norm(document.title)];
    walk(document.body);
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        if (m.type === "characterData") trText(m.target);
        else if (m.type === "attributes") trEl(m.target);
        else m.addedNodes.forEach(walk);
      });
    }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["placeholder", "aria-label", "alt", "title"] });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
