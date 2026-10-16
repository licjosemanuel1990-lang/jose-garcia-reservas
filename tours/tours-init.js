/* Activa los tours de precio fijo de esta página. */
window.JGT_SAONAAPI = JGTSimpleTour({
  prefix: "s", form: "saonaForm", cfg: window.JGT_SAONA,
  short: "Tour Isla Saona", msgTour: "Tour Isla Saona (todo incluido)",
  priceNote: "Todo incluido.",
  included: "Todo incluido: transporte, catamarán, piscina natural y buffet."
});
window.JGT_BUGGIESAPI = (function () {
  var B = window.JGT_BUGGIES;
  var cnt = document.getElementById("bCount");
  cnt.appendChild(new Option("Elige", ""));
  for (var i = 1; i <= B.maxPersonas; i++) cnt.appendChild(new Option(String(i), String(i)));
  function plan(els) { return B.planes[els.plan.value] || B.planes.basico; }
  function vName(els, v) {
    var one = { four: "four wheel", buggy: "buggy", ambos: "vehículo" }[els.vehicle.value];
    var many = { four: "four wheels", buggy: "buggies", ambos: "vehículos (buggy y four wheel)" }[els.vehicle.value];
    return v + " " + (v === 1 ? one : many);
  }
  return JGTSimpleTour({
    prefix: "b", form: "buggiesForm", cfg: B,
    short: "Tour de Buggies", msgTour: "Buggies y Four Wheel en Comatillo",
    extras: [{ key: "plan", label: "Plan" }, { key: "vehicle", label: "Vehículo" }, { key: "count", label: "Cantidad de vehículos" }, { key: "food", label: "Comida" }, { key: "shift", label: "Tanda" }],
    extraKeys: ["count"],
    extraValidate: function (els) {
      var n = Number(els.people.value), v = Number(els.count.value), e = {};
      if (!els.count.value) e.count = "Elige cuántos vehículos.";
      else if (n && /^\d+$/.test(els.people.value)) {
        if (v > n) e.count = "No puede haber más vehículos que personas.";
        else if (v * 2 < n) e.count = "Cada vehículo lleva máximo 2 personas: necesitan al menos " + Math.ceil(n / 2) + ".";
        else if (els.vehicle.value === "ambos" && v < 2) e.count = "Para buggy y four wheel elige al menos 2 vehículos.";
      }
      return e;
    },
    calc: function (n, els) {
      var rd = n * plan(els).rd + (els.food.value === "si" ? B.comidaRD * n : 0);
      return Math.ceil(B.transporte + rd / B.tasaCambio);
    },
    detail: function (n, els) {
      var v = Number(els.count.value);
      return plan(els).nombre + (v ? " · " + vName(els, v) : "") +
        (els.food.value === "si" ? " · con comida criolla" : "") + ". Incluye transporte privado.";
    },
    included: "Incluye transporte privado ida y vuelta y la ruta en buggy o four wheel."
  });
})();
/* Sugiere la cantidad de vehículos según las personas (de 2 en 2) */
(function () {
  var ppl = document.getElementById("bPeople"), cnt = document.getElementById("bCount"), hint = document.getElementById("bCountHint");
  var touched = false;
  cnt.addEventListener("change", function () { touched = true; });
  ppl.addEventListener("change", function () {
    var n = Number(ppl.value);
    if (!n) { hint.textContent = "Cada vehículo lleva 1 o 2 personas."; return; }
    hint.textContent = "Para " + n + (n === 1 ? " persona" : " personas") + ": entre " + Math.ceil(n / 2) + " y " + n + (n === 1 ? " vehículo." : " vehículos.");
    if (!touched || !cnt.value) { cnt.value = String(Math.ceil(n / 2)); cnt.dispatchEvent(new Event("change", { bubbles: true })); touched = false; }
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
