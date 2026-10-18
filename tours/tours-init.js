/* Activa los tours de precio fijo de esta página. */
window.JGT_SAONAAPI = JGTSimpleTour({
  prefix: "s", form: "saonaForm", tipo: "saona", cfg: window.JGT_SAONA,
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
  function fw(els, n) { return Number(els.count.value) || Math.ceil(n / 2); }
  function fwName(v) { return v + (v === 1 ? " four wheel" : " four wheels"); }
  return JGTSimpleTour({
    prefix: "b", form: "buggiesForm", tipo: "buggies", cfg: B,
    short: "Tour en Four Wheel", msgTour: "Four Wheel en Comatillo",
    extras: [{ key: "plan", label: "Plan" }, { key: "count", label: "Four wheels" }, { key: "size", label: "Tipo" }, { key: "food", label: "Comida" }, { key: "shift", label: "Horario" }],
    extraKeys: ["count"],
    extraValidate: function (els) {
      var n = Number(els.people.value), v = Number(els.count.value), e = {};
      if (!els.count.value) e.count = "Elige cuántos four wheels.";
      else if (n && /^\d+$/.test(els.people.value)) {
        if (v > n) e.count = "No puede haber más four wheels que personas.";
        else if (v * 2 < n) e.count = L("Cada four wheel lleva máximo 2 personas: necesitan al menos " + Math.ceil(n / 2) + ".", "Each four wheel carries at most 2 people: you need at least " + Math.ceil(n / 2) + ".");
      }
      var p = plan(els);
      if (p.minPersonas && n && n < p.minPersonas) e.people = L("El " + p.nombre + " requiere mínimo " + p.minPersonas + " personas.", "The " + T(p.nombre) + " requires at least " + p.minPersonas + " people.");
      return e;
    },
    calc: function (n, els) {
      var v = fw(els, n), p = plan(els);
      var planUSD = p.usd != null ? p.usd : (p.rd + B.margenRD) / B.tasaCambio;
      var extrasRD = v * (els.size.value === "300" ? B.extra300ccRD : 0) + (els.food.value === "si" ? B.comidaRD * n : 0);
      return Math.ceil(B.transporte + v * planUSD + extrasRD / B.tasaCambio);
    },
    detail: function (n, els) {
      var v = fw(els, n), p = plan(els);
      return L(p.nombre + " · " + fwName(v) + (els.size.value === "300" ? " de 300cc" : "") +
        (els.food.value === "si" ? " · con comida criolla" : "") + ". Incluye transporte privado." +
        (p.minPersonas ? " Mínimo " + p.minPersonas + " personas, sujeto a disponibilidad." : ""),
        T(p.nombre) + " · " + fwName(v) + (els.size.value === "300" ? " (300cc)" : "") +
        (els.food.value === "si" ? " · with Creole food" : "") + ". Includes private transportation." +
        (p.minPersonas ? " Minimum " + p.minPersonas + " people, subject to availability." : ""));
    },
    included: "Incluye transporte privado ida y vuelta y la ruta en four wheel."
  });
})();
/* Sugiere la cantidad de vehículos según las personas (de 2 en 2) */
(function () {
  var ppl = document.getElementById("bPeople"), cnt = document.getElementById("bCount"), hint = document.getElementById("bCountHint");
  var touched = false;
  cnt.addEventListener("change", function () { touched = true; });
  ppl.addEventListener("change", function () {
    var n = Number(ppl.value);
    if (!n) { hint.textContent = "Cada four wheel lleva 1 o 2 personas."; return; }
    hint.textContent = L("Para " + n + (n === 1 ? " persona" : " personas") + ": entre " + Math.ceil(n / 2) + " y " + n + (n === 1 ? " four wheel." : " four wheels.") + " Si van de 2 en 2, pagan menos.",
      "For " + n + (n === 1 ? " person" : " people") + ": between " + Math.ceil(n / 2) + " and " + n + (n === 1 ? " four wheel." : " four wheels.") + " Riding 2 per four wheel costs less.");
    var v = Number(cnt.value);
    if (!touched || !v || v > n || v * 2 < n) { cnt.value = String(Math.ceil(n / 2)); cnt.dispatchEvent(new Event("change", { bubbles: true })); touched = false; }
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
/* Four Wheel Boca Chica: US$70 por four wheel (1 o 2 personas) */
window.JGT_FWBOCAAPI = (function () {
  var F = window.JGT_FWBOCA;
  var cnt = document.getElementById("fCount"), ppl = document.getElementById("fPeople"), hint = document.getElementById("fCountHint");
  cnt.appendChild(new Option("Elige", ""));
  for (var i = 1; i <= F.maxPersonas; i++) cnt.appendChild(new Option(String(i), String(i)));
  function fw(els, n) { return Number(els.count.value) || Math.ceil(n / 2); }
  function fwName(v) { return v + (v === 1 ? " four wheel" : " four wheels"); }
  var api = JGTSimpleTour({
    prefix: "f", form: "fwbocaForm", tipo: "fwboca", cfg: F,
    short: "Four Wheel Boca Chica", msgTour: "Four Wheel Boca Chica",
    extras: [{ key: "count", label: "Four wheels" }, { key: "shift", label: "Horario" }],
    extraKeys: ["count"],
    extraValidate: function (els) {
      var n = Number(els.people.value), v = Number(els.count.value), e = {};
      if (!els.count.value) e.count = "Elige cuántos four wheels.";
      else if (n && /^\d+$/.test(els.people.value)) {
        if (v > n) e.count = "No puede haber más four wheels que personas.";
        else if (v * 2 < n) e.count = L("Cada four wheel lleva máximo 2 personas: necesitan al menos " + Math.ceil(n / 2) + ".", "Each four wheel carries at most 2 people: you need at least " + Math.ceil(n / 2) + ".");
      }
      return e;
    },
    calc: function (n, els) { return F.porFourWheel * fw(els, n); },
    detail: function (n, els) {
      var v = fw(els, n);
      return L(fwName(v) + " × US$" + F.porFourWheel + ".", fwName(v) + " × US$" + F.porFourWheel + ".");
    },
    included: "US$70 por four wheel, con 1 o 2 personas en cada uno."
  });
  var touched = false;
  cnt.addEventListener("change", function () { touched = true; });
  ppl.addEventListener("change", function () {
    var n = Number(ppl.value);
    if (!n) { hint.textContent = "Cada four wheel lleva 1 o 2 personas."; return; }
    hint.textContent = L("Para " + n + (n === 1 ? " persona" : " personas") + ": entre " + Math.ceil(n / 2) + " y " + n + (n === 1 ? " four wheel." : " four wheels.") + " Si van de 2 en 2, pagan menos.",
      "For " + n + (n === 1 ? " person" : " people") + ": between " + Math.ceil(n / 2) + " and " + n + (n === 1 ? " four wheel." : " four wheels.") + " Riding 2 per four wheel costs less.");
    var v = Number(cnt.value);
    if (!touched || !v || v > n || v * 2 < n) { cnt.value = String(Math.ceil(n / 2)); cnt.dispatchEvent(new Event("change", { bubbles: true })); touched = false; }
  });
  return api;
})();
