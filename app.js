/* José García Transporte — lógica del formulario de reservas.
 * Los destinos y precios NO se editan aquí: están en routes.js. */
(function () {
  "use strict";

  var CFG = window.JGT_CONFIG;
  var OTHER = "__otro__";
  var MAX_PAX_LIST = 15;

  var $ = function (id) { return document.getElementById(id); };
  var form = $("booking");
  var els = {
    origin: $("origin"), destination: $("destination"),
    originOther: $("originOther"), destinationOther: $("destinationOther"),
    date: $("date"), time: $("time"), returnDate: $("returnDate"), returnTime: $("returnTime"),
    passengers: $("passengers"), bags: $("bags"), carry: $("carry"),
    flight: $("flight"), airline: $("airline"),
    name: $("name"), phone: $("phone")
  };

  /* ---------- Datos (única fuente: routes.js) ---------- */
  var places = (CFG.lugares || []).filter(function (p) { return p && p.id && p.nombre && p.activo !== false; });
  var placeById = {};
  places.forEach(function (p) { placeById[p.id] = p; });
  var rates = {};
  (CFG.tarifas || []).forEach(function (t) {
    if (!t || !placeById[t.a] || !placeById[t.b] || t.a === t.b) return;
    if (typeof t.usd !== "number" || !isFinite(t.usd) || t.usd <= 0) return;
    rates[routeKey(t.a, t.b)] = t.usd;
  });
  function routeKey(a, b) { return [a, b].sort().join("|"); }
  function rateFor(a, b) { var r = rates[routeKey(a, b)]; return typeof r === "number" ? r : null; }
  function money(n) { return "US$" + (Math.round(n * 100) % 100 === 0 ? String(Math.round(n)) : n.toFixed(2)); }
  function round2(n) { return Math.round(n * 100) / 100; }

  /* ---------- Construcción de menús ---------- */
  function fillPlaces(sel) {
    sel.innerHTML = "";
    sel.appendChild(new Option("Selecciona una ubicación", ""));
    places.forEach(function (p) { sel.appendChild(new Option(p.nombre, p.id)); });
    sel.appendChild(new Option("Otra ubicación — escribir dirección", OTHER));
  }
  function fillCount(sel, from, to, placeholder, moreLabel) {
    sel.innerHTML = "";
    if (placeholder) sel.appendChild(new Option(placeholder, ""));
    for (var i = from; i <= to; i++) sel.appendChild(new Option(String(i), String(i)));
    if (moreLabel) sel.appendChild(new Option(moreLabel, (to + 1) + "+"));
  }
  fillPlaces(els.origin);
  fillPlaces(els.destination);
  fillCount(els.passengers, 1, MAX_PAX_LIST, "Elige", "Más de " + MAX_PAX_LIST);
  fillCount(els.bags, 0, 10, null, "Más de 10");
  fillCount(els.carry, 0, 10, null, "Más de 10");
  $("waitHours").textContent = String(CFG.esperaMaximaHoras);

  /* ---------- Fechas ---------- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function todayISO() { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function toDate(d, t) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d || "") || !/^\d{2}:\d{2}/.test(t || "")) return null;
    var p = d.split("-").map(Number), q = t.split(":").map(Number);
    return new Date(p[0], p[1] - 1, p[2], q[0], q[1], 0, 0);
  }
  function fmtDate(d) { var p = d.split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }
  function fmtTime(t) {
    var q = t.split(":").map(Number), h = q[0], m = q[1];
    var suf = h < 12 ? "a. m." : "p. m.";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ":" + pad(m) + " " + suf;
  }
  function setMins() {
    var t = todayISO();
    els.date.min = t;
    els.returnDate.min = els.date.value && els.date.value > t ? els.date.value : t;
  }
  setMins();

  /* ---------- Estado ---------- */
  function trip() { var r = form.querySelector('input[name="trip"]:checked'); return r ? r.value : "one"; }
  function placeLabel(sel, other) {
    if (sel.value === OTHER) return other.value.trim();
    return placeById[sel.value] ? placeById[sel.value].nombre : "";
  }
  function readState() {
    return {
      o: els.origin.value, d: els.destination.value,
      oText: placeLabel(els.origin, els.originOther), dText: placeLabel(els.destination, els.destinationOther),
      trip: trip(), date: els.date.value, time: els.time.value,
      rDate: els.returnDate.value, rTime: els.returnTime.value,
      pax: els.passengers.value
    };
  }

  /* ---------- Cálculo de tarifa ---------- */
  function computeQuote(s) {
    if (!s.o || !s.d) return { kind: "empty" };
    var custom = s.o === OTHER || s.d === OTHER;
    if (!custom && s.o === s.d) return { kind: "same" };
    if (custom && s.oText && s.dText && s.oText.toLowerCase() === s.dText.toLowerCase()) return { kind: "same" };
    if (custom) return { kind: "pending", reason: "custom" };
    var base = rateFor(s.o, s.d);
    if (base === null) return { kind: "pending", reason: "noRate" };
    if (s.pax && !/^\d+$/.test(s.pax)) return { kind: "pending", reason: "group", base: base };
    var pax = Number(s.pax) || 0;
    var extraPax = Math.max(0, pax - CFG.pasajerosIncluidos);
    var oneWay = base + extraPax * CFG.cargoPasajeroAdicional;
    var info = { base: base, extraPax: extraPax, oneWay: oneWay };
    if (s.trip === "one") return mix({ kind: "price", amount: oneWay, trip: "one" }, info);

    var roundAmount = round2(oneWay * 2 * CFG.factorIdaYVuelta);
    var dep = toDate(s.date, s.time), ret = toDate(s.rDate, s.rTime);
    if (!dep || !ret) return mix({ kind: "price", amount: roundAmount, trip: "round", provisional: true }, info);
    if (ret <= dep) return { kind: "invalidReturn" };
    var hours = (ret - dep) / 36e5;
    if (s.rDate !== s.date) return mix({ kind: "price", amount: round2(oneWay * 2), trip: "round", otherDay: true }, info);
    if (hours > CFG.esperaMaximaHoras) return { kind: "pending", reason: "longWait", base: base };
    return mix({ kind: "price", amount: roundAmount, trip: "round" }, info);
  }
  function mix(a, b) { for (var k in b) a[k] = b[k]; return a; }
  function extraText(q) {
    if (!q.extraPax) return "Tarifa para hasta " + CFG.pasajerosIncluidos + " pasajeros.";
    return "Tarifa base " + money(q.base) + " (hasta " + CFG.pasajerosIncluidos + " pasajeros) + " + q.extraPax +
      (q.extraPax === 1 ? " pasajero adicional" : " pasajeros adicionales") + " × " + money(CFG.cargoPasajeroAdicional) + " = " + money(q.oneWay) + " por trayecto.";
  }

  var REASONS = {
    custom: "Ubicación fuera del tarifario: te enviaremos la cotización por WhatsApp.",
    noRate: "Esta ruta aún no tiene tarifa publicada: te cotizaremos por WhatsApp.",
    group: "Para grupos de más de 15 pasajeros confirmamos vehículo y precio por WhatsApp.",
    longWait: "La espera supera " + CFG.esperaMaximaHoras + " horas: requiere cotización personalizada (sin descuento automático)."
  };

  function renderQuote() {
    var q = computeQuote(readState());
    var label = "Tarifa estimada", price = "—", note = "", pending = false;
    switch (q.kind) {
      case "empty": note = "Selecciona origen y destino."; break;
      case "same": price = "—"; note = "El origen y el destino deben ser diferentes."; break;
      case "invalidReturn": label = "Revisa el regreso"; note = "El regreso debe ser posterior a la salida."; break;
      case "pending": label = "Tarifa pendiente de cotización"; price = "A cotizar"; pending = true; note = REASONS[q.reason]; break;
      case "price":
        price = money(q.amount);
        if (q.trip === "round") {
          label = "Tarifa estimada · ida y vuelta";
          note = q.otherDay ? "Ida " + money(q.oneWay) + " + vuelta " + money(q.oneWay) + "." : (q.extraPax ? extraText(q) + " " : "") + ("2 trayectos de " + money(q.oneWay) + " con 22 % de descuento por regresar el mismo día. Incluye hasta " + CFG.esperaMaximaHoras + " h de espera.");
        } else {
          label = "Tarifa estimada · solo ida";
          note = extraText(q) + " Sujeto a confirmación de disponibilidad.";
        }
        break;
    }
    $("quoteLabel").textContent = label;
    $("quotePrice").textContent = price;
    $("quotePrice").classList.toggle("pending", pending);
    $("quoteNote").textContent = note;
    return q;
  }

  /* ---------- Campos dinámicos ---------- */
  function syncUI() {
    els.originOther.classList.toggle("hidden", els.origin.value !== OTHER);
    els.destinationOther.classList.toggle("hidden", els.destination.value !== OTHER);
    $("returnBlock").classList.toggle("hidden", trip() !== "round");
    var airport = (placeById[els.origin.value] && placeById[els.origin.value].aeropuerto) ||
                  (placeById[els.destination.value] && placeById[els.destination.value].aeropuerto) ||
                  /aeropuerto|airport/i.test(els.originOther.value + " " + els.destinationOther.value);
    $("flightBlock").classList.toggle("hidden", !airport);
    if (trip() === "round" && els.date.value && !els.returnDate.value) els.returnDate.value = els.date.value;
    setMins();
    renderQuote();
    if (submitted) validate();
  }

  /* ---------- Validación ---------- */
  var submitted = false;
  function phoneDigits() { return els.phone.value.replace(/\D/g, ""); }

  function validate() {
    var e = {}, s = readState(), now = new Date();
    if (!s.o) e.origin = "Selecciona el origen.";
    else if (s.o === OTHER && s.oText.length < 3) e.origin = "Escribe la dirección o lugar de origen.";
    if (!s.d) e.destination = "Selecciona el destino.";
    else if (s.d === OTHER && s.dText.length < 3) e.destination = "Escribe la dirección o lugar de destino.";
    if (!e.origin && !e.destination && computeQuote(s).kind === "same") e.destination = "El destino no puede ser igual al origen.";

    if (!s.date) e.date = "Elige la fecha.";
    else if (s.date < todayISO()) e.date = "La fecha no puede ser anterior a hoy.";
    if (!s.time) e.time = "Elige la hora.";
    var dep = toDate(s.date, s.time);
    if (!e.date && !e.time && dep && dep < now) e.time = "Esa hora ya pasó. Elige una hora futura.";

    if (s.trip === "round") {
      if (!s.rDate) e.returnDate = "Elige la fecha de regreso.";
      else if (s.date && s.rDate < s.date) e.returnDate = "El regreso no puede ser antes de la salida.";
      if (!s.rTime) e.returnTime = "Elige la hora de regreso.";
      var ret = toDate(s.rDate, s.rTime);
      if (!e.returnDate && !e.returnTime && dep && ret && ret <= dep) e.returnTime = "El regreso debe ser posterior a la salida.";
    }

    if (!/^(\d{1,2}|\d{2}\+)$/.test(s.pax) || s.pax === "0") e.passengers = "Elige la cantidad de pasajeros.";
    ["bags", "carry"].forEach(function (k) { if (!/^(\d{1,2}|\d{2}\+)$/.test(els[k].value)) e[k] = "Cantidad no válida."; });

    var nm = els.name.value.trim();
    if (nm.length < 3 || !/[a-zA-ZÀ-ÿ]/.test(nm)) e.name = "Escribe tu nombre completo.";
    var pd = phoneDigits();
    if (!pd) e.phone = "Escribe tu número de WhatsApp.";
    else if (pd.length < 10 || pd.length > 15) e.phone = "Número incompleto. Incluye el código de país (ej.: +1 809 555 1234).";

    showErrors(e);
    return e;
  }

  var fieldIds = ["origin", "destination", "date", "time", "returnDate", "returnTime", "passengers", "name", "phone"];
  function showErrors(e) {
    fieldIds.forEach(function (k) {
      var box = form.querySelector('.err[data-for="' + k + '"]');
      if (box) box.textContent = e[k] || "";
      var bad = !!e[k];
      els[k].classList.toggle("invalid", bad);
      els[k].setAttribute("aria-invalid", bad ? "true" : "false");
    });
    els.originOther.classList.toggle("invalid", !!e.origin && els.origin.value === OTHER);
    els.destinationOther.classList.toggle("invalid", !!e.destination && els.destination.value === OTHER);
    $("formError").classList.toggle("hidden", Object.keys(e).length === 0);
  }

  /* ---------- Mensaje de WhatsApp (solo datos esenciales) ---------- */
  function buildMessage() {
    var s = readState();
    var L = [];
    L.push("Nombre: " + els.name.value.trim());
    L.push("WhatsApp: " + els.phone.value.trim());
    L.push("Origen: " + s.oText);
    L.push("Destino: " + s.dText);
    L.push("Servicio: " + (s.trip === "round" ? "Ida y vuelta" : "Solo ida"));
    L.push("Fecha: " + fmtDate(s.date));
    L.push("Hora: " + fmtTime(s.time));
    if (s.trip === "round") L.push("Regreso: " + fmtDate(s.rDate) + " a las " + fmtTime(s.rTime));
    L.push("Pasajeros: " + els.passengers.options[els.passengers.selectedIndex].text);
    L.push("Maletas grandes: " + els.bags.options[els.bags.selectedIndex].text);
    L.push("Equipaje de mano: " + els.carry.options[els.carry.selectedIndex].text);
    if (!$("flightBlock").classList.contains("hidden")) {
      if (els.flight.value.trim()) L.push("Vuelo: " + els.flight.value.trim().toUpperCase());
      if (els.airline.value.trim()) L.push("Aerolínea: " + els.airline.value.trim());
    }
    return L.join("\n");
  }
  function whatsappUrl() { return "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(buildMessage()); }

  /* ---------- Eventos ---------- */
  ["change", "input"].forEach(function (ev) {
    form.addEventListener(ev, function (e) {
      if (e.target === els.date && els.returnDate.value && els.returnDate.value < els.date.value) els.returnDate.value = els.date.value;
      syncUI();
    });
  });
  $("swap").addEventListener("click", function () {
    var o = els.origin.value, ot = els.originOther.value;
    els.origin.value = els.destination.value; els.originOther.value = els.destinationOther.value;
    els.destination.value = o; els.destinationOther.value = ot;
    syncUI();
  });
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    submitted = true;
    syncUI();
    var e = validate();
    var first = fieldIds.filter(function (k) { return e[k]; })[0];
    if (first) {
      var target = els[first];
      if (first === "origin" && els.origin.value === OTHER) target = els.originOther;
      if (first === "destination" && els.destination.value === OTHER) target = els.destinationOther;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      try { target.focus({ preventScroll: true }); } catch (x) { target.focus(); }
      return;
    }
    openConfirm();
  });

  /* ---------- Ventana previa con el precio ---------- */
  var box = $("confirmBox"), waLink = $("waLink");
  function openConfirm() {
    var s = readState(), q = computeQuote(s);
    $("cRoute").textContent = s.oText + " → " + s.dText + " · " + (s.trip === "round" ? "Ida y vuelta" : "Solo ida");
    var priceEl = $("cPrice");
    if (q.kind === "price") {
      $("cLabel").textContent = "Precio del servicio";
      priceEl.textContent = money(q.amount);
      priceEl.classList.remove("pending");
      $("cNote").textContent = q.otherDay ? "Ida " + money(q.oneWay) + " + vuelta " + money(q.oneWay) + "." : (q.extraPax ? extraText(q) + " " : "") + (q.trip === "round"
        ? ("Ida y vuelta el mismo día, con hasta " + CFG.esperaMaximaHoras + " h de espera incluidas.")
        : "Sujeto a confirmación de disponibilidad.");
    } else {
      $("cLabel").textContent = "Precio del servicio";
      priceEl.textContent = "A cotizar";
      priceEl.classList.add("pending");
      $("cNote").textContent = (REASONS[q.reason] || "Te enviaremos el precio por WhatsApp.");
    }
    waLink.href = whatsappUrl();
    box.classList.remove("hidden");
    document.body.classList.add("modal-open");
    waLink.focus();
  }
  function closeConfirm() { box.classList.add("hidden"); document.body.classList.remove("modal-open"); }
  $("editBtn").addEventListener("click", closeConfirm);
  box.addEventListener("click", function (e) { if (e.target === box) closeConfirm(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeConfirm(); });
  waLink.addEventListener("click", function (e) {
    if (typeof window.__JGT_CAPTURE__ === "function") { e.preventDefault(); window.__JGT_CAPTURE__(waLink.href); } // solo pruebas
    setTimeout(closeConfirm, 400); // al volver de WhatsApp, el formulario queda visible
  });

  // Acceso para pruebas automáticas
  window.JGT = { computeQuote: computeQuote, buildMessage: buildMessage, whatsappUrl: whatsappUrl, OTHER: OTHER };

  // Valores iniciales útiles: ruta más solicitada
  els.origin.value = "sdq";
  syncUI();
})();
