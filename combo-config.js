/*
 * ============================================================
 *  COMBO — PRECIOS ESPECIALES
 *  Con 2 o más servicios en el combo, cada servicio pasa a su
 *  precio de combo:
 *
 *  Recogida en el aeropuerto (SDQ → Boca Chica)  US$20 hasta 4 personas, +US$5 por persona adicional
 *  Regreso al aeropuerto (Boca Chica → SDQ)      US$15 hasta 4 personas, +US$5 por persona adicional
 *  Four Wheel Comatillo                           RD$500 menos por four wheel
 *  Four Wheel Boca Chica                          US$5 menos por four wheel
 *  City Tour                                      US$10 menos
 *  Isla Saona                                     precio normal (suma como servicio)
 *
 *  Otros traslados suman como servicio, con su precio normal.
 *  El combo se reserva con el 50 % del total; el resto se paga al abordar.
 * ============================================================
 */
window.JGT_COMBO = {
  minServicios: 2,
  deposito: 0.50,          // el combo se reserva con el 50 %; el resto se paga al abordar
  traslado: {
    aeropuerto: "sdq", hotel: "boca",
    recogida: 20,          // SDQ → Boca Chica
    regreso: 15,           // Boca Chica → SDQ
    pasajerosIncluidos: 4,
    adicional: 5           // US$ por persona desde la quinta
  },
  comatilloRDporFourWheel: 500,
  fwbocaPorFourWheel: 5,
  cityTour: 10,
  maxServicios: 8
};
