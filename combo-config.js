/*
 * ============================================================
 *  COMBO — ARMA TU PAQUETE
 *  El cliente agrega traslados y tours a su combo.
 *  Mientras más servicios elige, más se descuenta en CADA tour
 *  con transporte propio (City Tour, Isla Saona, Four Wheel Comatillo).
 *
 *  Por qué no se pierde dinero: el descuento sale del transporte
 *  (vehículo propio, US$70–110 por tour). Nunca toca catamarán,
 *  buffet, entradas ni four wheels, que se pagan a terceros.
 *  Los traslados y el Four Wheel Boca Chica suman al conteo,
 *  pero no tienen descuento.
 * ============================================================
 */
window.JGT_COMBO = {
  // servicios en el combo → US$ de descuento en cada tour con transporte
  niveles: [
    { servicios: 2, descuento: 10 },
    { servicios: 3, descuento: 15 },
    { servicios: 4, descuento: 20 }   // 4 o más
  ],
  conDescuento: ["city", "saona", "buggies"],
  maxServicios: 8
};
