/*
 * ============================================================
 *  TOUR EN FOUR WHEEL POR COMATILLO — PRECIOS
 *  El precio de Comatillo es POR FOUR WHEEL (1 o 2 personas).
 *  Precio = transporte (US$, por grupo)
 *         + plan por cada four wheel (usd: precio de venta en dólares;
 *           si un plan no tiene "usd", se calcula: (rd + margenRD) ÷ tasa)
 *         + 300cc opcional por four wheel (RD$)
 *         + comida opcional por persona (RD$)
 *  Todo se convierte a dólares con la tasa de cambio.
 * ============================================================
 */
window.JGT_BUGGIES = {
  nombre: "Tour en Four Wheel por Comatillo",
  tasaCambio: 62,          // RD$ por cada US$
  transporte: 100,         // US$ por grupo (ida y vuelta desde Boca Chica)
  margenRD: 1000,          // RD$ que sumamos a cada plan (por four wheel)
                           // Básico 3,500 + 1,000 = RD$4,500 · Plus 4,000 + 1,000 = RD$5,000
  planes: {
    basico:  { nombre: "Tour Básico",  usd: 70, rd: 3500, detalle: "Loma de Managua y río Salto Alto" },
    plus:    { nombre: "Tour Plus",    usd: 80, rd: 4000, detalle: "Básico + río La Jorqueta" },
    premium: { nombre: "Tour Premium", rd: 4050, detalle: "Básico + río privado, piscina y tobogán", minPersonas: 10 }
  },
  extra300ccRD: 300,       // RD$ por four wheel de 300cc
  deposito: 0.50,          // 50 % para reservar; el resto al abordar
  comidaRD: 375,           // RD$ por persona (opcional)
  maxPersonas: 15          // más personas → "A cotizar"
};
