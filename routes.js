/*
 * ============================================================
 *  JOSÉ GARCÍA TRANSPORTE — DESTINOS Y TARIFAS
 *  Este es el ÚNICO archivo que hay que editar para cambiar
 *  precios o añadir destinos. Instrucciones en README.md.
 * ============================================================
 */
window.JGT_CONFIG = {
  // Número que recibe las solicitudes (solo dígitos, con código de país)
  whatsapp: "18298182426",

  // Ida y vuelta: tarifa de ida × 2 × 0.78  (22 % de descuento)
  factorIdaYVuelta: 0.78,

  // Espera máxima incluida en ida y vuelta (horas). Se mide entre la
  // hora de salida y la hora de regreso del mismo día.
  esperaMaximaHoras: 4,
  // Más de 4 y hasta 5 horas: el regreso es otro viaje a tarifa normal (sin descuento).
  esperaSinCargoHoras: 5,
  // Desde la 6.ª hora, cada hora adicional de espera (o fracción) suma este cargo (US$).
  cargoHoraEspera: 10,

  // Las tarifas incluyen hasta este número de pasajeros...
  pasajerosIncluidos: 4,
  // ...y desde el siguiente se suma este cargo (US$) por cada pasajero
  // adicional, en cada trayecto.
  cargoPasajeroAdicional: 10,

  // ---------------------------------------------------------
  // LUGARES que aparecen en los menús de Origen y Destino.
  //  id      → código corto, sin espacios ni acentos (no cambiarlo
  //            una vez usado en las tarifas)
  //  nombre  → lo que ve el cliente
  //  aeropuerto → true si es un aeropuerto (pide número de vuelo)
  //  puntoFijo  → true si es un lugar exacto (no pide hotel ni dirección)
  //  activo  → false para ocultarlo sin borrarlo
  // ---------------------------------------------------------
  lugares: [
    { id: "sdq",      nombre: "Aeropuerto de Santo Domingo (SDQ)", aeropuerto: true, activo: true },
    { id: "boca",     nombre: "Boca Chica",                    activo: true },
    { id: "juan",     nombre: "Juan Dolio",                    activo: true },
    { id: "colonial", nombre: "Zona Colonial",                 activo: true },
    { id: "centro",   nombre: "Santo Domingo Centro",          activo: true },
    { id: "sanpedro", nombre: "San Pedro de Macorís Centro",   activo: true },
    { id: "romana",   nombre: "La Romana",                     activo: true },
    { id: "cruceroromana", nombre: "Terminal de Cruceros La Romana", puntoFijo: true, activo: true },
    { id: "bayahibe", nombre: "Bayahíbe",                      activo: true },
    { id: "punta",    nombre: "Punta Cana / Bávaro",           activo: true },
    { id: "uvero",    nombre: "Uvero Alto / Macao",            activo: true }
  ],

  // ---------------------------------------------------------
  // TARIFAS de solo ida en US$. Valen en ambos sentidos
  // (de A a B cuesta lo mismo que de B a A).
  // Una ruta que no esté aquí se muestra como "A cotizar".
  // ---------------------------------------------------------
  tarifas: [
    { a: "sdq",  b: "boca",     usd: 25 },
    { a: "sdq",  b: "juan",     usd: 40 },
    { a: "sdq",  b: "colonial", usd: 40 },
    { a: "sdq",  b: "centro",   usd: 45 },
    { a: "sdq",  b: "sanpedro", usd: 45 },
    { a: "sdq",  b: "romana",   usd: 90 },
    { a: "sdq",  b: "bayahibe", usd: 95 },
    { a: "sdq",  b: "punta",    usd: 150 },
    { a: "sdq",  b: "uvero",    usd: 165 },

    { a: "boca", b: "juan",     usd: 30 },
    { a: "boca", b: "colonial", usd: 40 },
    { a: "boca", b: "centro",   usd: 45 },
    { a: "boca", b: "sanpedro", usd: 35 },
    { a: "boca", b: "romana",   usd: 80 },
    { a: "boca", b: "cruceroromana", usd: 85 },
    { a: "boca", b: "bayahibe", usd: 90 },
    { a: "boca", b: "punta",    usd: 150 },
    { a: "boca", b: "uvero",    usd: 165 }
  ]
};
