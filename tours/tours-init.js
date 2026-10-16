/* Activa los tours de precio fijo de esta página. */
window.JGT_SAONAAPI = JGTSimpleTour({
  prefix: "s", form: "saonaForm", cfg: window.JGT_SAONA,
  short: "Tour Isla Saona", msgTour: "Tour Isla Saona (todo incluido)",
  priceNote: "Todo incluido.",
  included: "Todo incluido: transporte, catamarán, piscina natural y buffet."
});
window.JGT_BUGGIESAPI = (function () {
  var B = window.JGT_BUGGIES;
  function vehicles(n, els) { return els.ride.value === "solo" ? n : Math.ceil(n / 2); }
  function plan(els) { return B.planes[els.plan.value] || B.planes.basico; }
  return JGTSimpleTour({
    prefix: "b", form: "buggiesForm", cfg: B,
    short: "Tour de Buggies", msgTour: "Buggies y Four Wheel en Comatillo",
    extras: [{ key: "plan", label: "Plan" }, { key: "ride", label: "Four wheel" }, { key: "food", label: "Comida" }, { key: "shift", label: "Tanda" }],
    calc: function (n, els) {
      var rd = n * plan(els).rd + (els.food.value === "si" ? B.comidaRD * n : 0);
      return Math.ceil(B.transporte + rd / B.tasaCambio);
    },
    detail: function (n, els) {
      var v = vehicles(n, els);
      return plan(els).nombre + " · " + v + (v === 1 ? " four wheel" : " four wheels") +
        (els.food.value === "si" ? " · con comida criolla" : "") + ". Incluye transporte privado.";
    },
    included: "Incluye transporte privado ida y vuelta y la ruta en four wheel."
  });
})();
/* Las tarjetas de plan y el selector del formulario van sincronizados */
(function () {
  var sel = document.getElementById("bPlan");
  var radios = document.querySelectorAll('input[name="bPlanPick"]');
  radios.forEach(function (r) {
    r.addEventListener("change", function () { sel.value = r.value; sel.dispatchEvent(new Event("change", { bubbles: true })); });
  });
  sel.addEventListener("change", function () { radios.forEach(function (r) { r.checked = r.value === sel.value; }); });
})();
