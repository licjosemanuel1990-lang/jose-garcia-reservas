/* Isla Saona — precio en vivo y reserva por WhatsApp. Precios: saona-config.js */
(function () {
  "use strict";
  var S = window.JGT_SAONA;
  var WA = (window.JGT_CONFIG && window.JGT_CONFIG.whatsapp) || "18298182426";
  var $ = function (id) { return document.getElementById(id); };
  var form = $("saonaForm");
  var els = { people: $("sPeople"), date: $("sDate"), pickupZone: $("sPickupZone"), pickup: $("sPickup"), name: $("sName"), phone: $("sPhone") };

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function todayISO() { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function fmtDate(d) { var p = d.split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }
  function usd(n) { return "US$" + (Math.round(n * 100) % 100 === 0 ? String(Math.round(n)) : n.toFixed(2)); }

  els.people.appendChild(new Option("Elige", ""));
  for (var i = 1; i <= S.maxPersonas; i++) els.people.appendChild(new Option(String(i), String(i)));
  els.people.appendChild(new Option("Más de " + S.maxPersonas, (S.maxPersonas + 1) + "+"));
  els.date.min = todayISO();

  function computeQuote() {
    var p = els.people.value;
    if (!p) return { kind: "empty" };
    if (!/^\d+$/.test(p)) return { kind: "pending", reason: "Para grupos de más de " + S.maxPersonas + " personas te enviaremos el precio por WhatsApp." };
    if (els.pickupZone.value !== "boca") return { kind: "pending", reason: "Recogida fuera de Boca Chica: te cotizaremos el precio por WhatsApp." };
    var n = Number(p);
    var total = S.transporte + S.porPersona * n;
    return { kind: "price", total: total, people: n, perPerson: total / n };
  }

  var submitted = false;
  function refresh() {
    var q = computeQuote(), price = "—", note = "Elige cuántas personas son.";
    if (q.kind === "pending") { price = "A cotizar"; note = q.reason; }
    if (q.kind === "price") {
      price = usd(q.total);
      note = "Total para " + q.people + (q.people === 1 ? " persona" : " personas") +
        (q.people > 1 ? " (" + usd(q.perPerson) + " por persona)" : "") + ". Todo incluido.";
    }
    $("sQuotePrice").textContent = price;
    $("sQuotePrice").classList.toggle("pending", price === "A cotizar");
    $("sQuoteNote").textContent = note;
    $("sBarCount").textContent = q.kind === "price" ? "Isla Saona · " + q.people + (q.people === 1 ? " persona" : " personas") : "Isla Saona · todo incluido";
    $("sBarPrice").textContent = q.kind === "price" ? "Total: " + price : (q.kind === "pending" ? "Precio: a cotizar" : "Calcula tu precio");
    els.pickup.placeholder = els.pickupZone.value === "boca" ? "Ej.: Hotel Don Juan, Boca Chica" : "Hotel, barrio o ciudad";
    if (submitted) validate();
    return q;
  }

  var keys = ["people", "date", "pickup", "name", "phone"];
  function validate() {
    var e = {};
    if (!els.people.value) e.people = "Elige cuántas personas.";
    if (!els.date.value) e.date = "Elige la fecha.";
    else if (els.date.value < todayISO()) e.date = "La fecha no puede ser anterior a hoy.";
    if (els.pickup.value.trim().length < 3) e.pickup = "Escribe el hotel o la dirección de recogida.";
    var nm = els.name.value.trim();
    if (nm.length < 3 || !/[a-zA-ZÀ-ÿ]/.test(nm)) e.name = "Escribe tu nombre completo.";
    var pd = els.phone.value.replace(/\D/g, "");
    if (!pd) e.phone = "Escribe tu número de WhatsApp.";
    else if (pd.length < 10 || pd.length > 15) e.phone = "Número incompleto. Incluye el código de país (ej.: +1 809 555 1234).";
    keys.forEach(function (k) {
      var box = form.querySelector('.err[data-for="' + k + '"]');
      if (box) box.textContent = e[k] || "";
      els[k].classList.toggle("invalid", !!e[k]);
    });
    $("sFormError").classList.toggle("hidden", !Object.keys(e).length);
    return e;
  }

  function buildMessage() {
    var q = computeQuote();
    return [
      "Nombre: " + els.name.value.trim(),
      "WhatsApp: " + els.phone.value.trim(),
      "Tour: Isla Saona (todo incluido)",
      "Recogida: " + els.pickup.value.trim() + (els.pickupZone.value === "boca" ? " (Boca Chica)" : ""),
      "Fecha: " + fmtDate(els.date.value),
      "Personas: " + els.people.options[els.people.selectedIndex].text,
      "Precio estimado: " + (q.kind === "price" ? usd(q.total) : "A cotizar")
    ].join("\n");
  }
  function whatsappUrl() { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(buildMessage()); }

  var box = $("sConfirmBox"), waLink = $("sWaLink");
  function openConfirm() {
    var q = computeQuote();
    $("sCRoute").textContent = "Isla Saona · " + fmtDate(els.date.value) + " · " + els.people.options[els.people.selectedIndex].text + " personas";
    $("sCPrice").textContent = q.kind === "price" ? usd(q.total) : "A cotizar";
    $("sCPrice").classList.toggle("pending", q.kind !== "price");
    $("sCNote").textContent = q.kind === "price" ? "Todo incluido: transporte, catamarán, piscina natural y buffet." : q.reason;
    waLink.href = whatsappUrl();
    box.classList.remove("hidden");
    document.body.classList.add("modal-open");
    waLink.focus();
  }
  function closeConfirm() { box.classList.add("hidden"); document.body.classList.remove("modal-open"); }
  $("sEditBtn").addEventListener("click", closeConfirm);
  box.addEventListener("click", function (e) { if (e.target === box) closeConfirm(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeConfirm(); });
  waLink.addEventListener("click", function (e) {
    if (typeof window.__JGT_CAPTURE__ === "function") { e.preventDefault(); window.__JGT_CAPTURE__(waLink.href); } // solo pruebas
    setTimeout(closeConfirm, 400);
  });

  ["change", "input"].forEach(function (ev) { form.addEventListener(ev, refresh); });
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    submitted = true;
    var e = validate();
    var first = keys.filter(function (k) { return e[k]; })[0];
    if (first) {
      els[first].scrollIntoView({ behavior: "smooth", block: "center" });
      try { els[first].focus({ preventScroll: true }); } catch (x) { els[first].focus(); }
      return;
    }
    openConfirm();
  });

  window.JGT_SAONAAPI = { computeQuote: computeQuote, buildMessage: buildMessage };
  refresh();
})();
