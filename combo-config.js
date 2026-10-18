/*
 * ============================================================
 *  COMBO — ARMA TU PAQUETE
 *  El cliente agrega traslados y tours a su combo.
 *  Mientras más servicios elige, más se descuenta en cada uno.
 *
 *  Servicios en el combo:      2     3     4 o más
 *  City Tour                 US$10 US$15 US$20
 *  Traslado con aeropuerto   US$3  US$4  US$5
 *  Four Wheel Comatillo      US$3  US$4  US$5
 *  Four Wheel Boca Chica     US$3  US$4  US$5
 *  Isla Saona                 —     —     —   (cuenta como servicio, sin descuento)
 *
 *  Los traslados que no tocan un aeropuerto cuentan como servicio,
 *  pero no tienen descuento.
 * ============================================================
 */
window.JGT_COMBO = {
  niveles: [2, 3, 4],            // servicios necesarios para cada nivel
  descuentos: {                  // US$ por servicio en cada nivel
    city:     [10, 15, 20],
    traslado: [3, 4, 5],         // solo si el traslado incluye un aeropuerto
    buggies:  [3, 4, 5],
    fwboca:   [3, 4, 5]
  },
  maxServicios: 8
};
