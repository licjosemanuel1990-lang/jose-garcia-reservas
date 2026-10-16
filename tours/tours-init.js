/* Activa los tours de precio fijo de esta página. */
window.JGT_SAONAAPI = JGTSimpleTour({
  prefix: "s", form: "saonaForm", cfg: window.JGT_SAONA,
  short: "Tour Isla Saona", msgTour: "Tour Isla Saona (todo incluido)",
  priceNote: "Todo incluido.",
  included: "Todo incluido: transporte, catamarán, piscina natural y buffet."
});
window.JGT_BUGGIESAPI = JGTSimpleTour({
  prefix: "b", form: "buggiesForm", cfg: window.JGT_BUGGIES,
  short: "Tour de Buggies", msgTour: "Buggies y Four Wheel en Comatillo",
  extras: [{ key: "vehicle", label: "Vehículo" }, { key: "shift", label: "Tanda" }],
  priceNote: "Incluye transporte y tu buggy o four wheel.",
  included: "Incluye transporte privado ida y vuelta y tu buggy o four wheel."
});
