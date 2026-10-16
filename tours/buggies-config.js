/*
 * ============================================================
 *  TOUR DE BUGGIES Y FOUR WHEEL EN COMATILLO — PRECIOS
 *  Precio = transporte (US$, por grupo)
 *         + plan por persona (RD$, ya con nuestro margen)
 *         + comida opcional por persona (RD$)
 *  Todo se convierte a dólares con la tasa de cambio.
 *  Cada four wheel lleva 1 o 2 personas (no cambia el precio).
 * ============================================================
 */
window.JGT_BUGGIES = {
  nombre: "Tour de Buggies y Four Wheel en Comatillo",
  tasaCambio: 62,          // RD$ por cada US$
  transporte: 80,          // US$ por grupo (ida y vuelta desde Boca Chica)
  planes: {
    // costo Comatillo + RD$1,000 de margen, por persona
    basico: { nombre: "Tour Básico", rd: 3500 + 1000, detalle: "1er río y cascada Salto Alto" },
    plus:   { nombre: "Tour Plus",   rd: 4000 + 1000, detalle: "2 ríos, cascada Salto Alto y La Orqueta" }
  },
  comidaRD: 375,           // RD$ por persona (opcional)
  maxPersonas: 15          // más personas → "A cotizar"
};
