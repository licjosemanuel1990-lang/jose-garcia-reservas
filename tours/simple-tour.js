/* Tours de precio fijo (Isla Saona, Buggies): transporte por grupo + precio por persona.
 * Cada tour usa un prefijo en sus ids (ej. "s" → sPeople, sDate...). */
window.JGTSimpleTour = function (o) {
  "use strict";
  var C = o.cfg;
  var WA = (window.JGT_CONFIG && window.JGT_CONFIG.whatsapp) || "18298182426";
  function id(k) { return o.prefix + k.charAt(0).toUpperCase() + k.slice(1); }
  function $(k) { return document.getElementById(id(k)); }
  var form = document.getElementById(o.form);
  var keys = ["people"].concat(o.extraKeys || []).concat(["date", "pickup", "name", "phone"]);
  var els = {};
  ["people", "date", "pickupZone", "pickup", "name", "phone"].concat((o.extras || []).map(function (e) { return e.key; }))
    .forEach(function (k) { els[k] = $(k); });

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function todayISO() { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function fmtDate(d) { var p = d.split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }
  function usd(n) { return "US$" + (Math.round(n * 100) % 100 === 0 ? String(Math.round(n)) : n.toFixed(2)); }
  function txt(sel) { return sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : ""; }

  els.people.appendChild(new Option("Elige", ""));
  for (var i = 1; i <= C.maxPersonas; i++) els.people.appendChild(new Option(String(i), String(i)));
  els.people.appendChild(new Option("Más de " + C.maxPersonas, (C.maxPersonas + 1) + "+"));
  els.date.min = todayISO();

  function computeQuote() {
    var p = els.people.value;
    if (!p) return { kind: "empty" };
    if (!/^\d+$/.test(p)) return { kind: "pending", reason: L("Para grupos de más de " + C.maxPersonas + " personas te enviaremos el precio por WhatsApp.", "For groups of more than " + C.maxPersonas + " people we will send you the price on WhatsApp.") };
    if (els.pickupZone.value !== "boca") return { kind: "pending", reason: T("Recogida fuera de Boca Chica: te cotizaremos el precio por WhatsApp.") };
    var n = Number(p);
    var total = o.calc ? o.calc(n, els) : C.transporte + C.porPersona * n;
    var cb = $("combo"), combo = !!(cb && cb.checked && window.JGT_COMBO);
    if (combo) total = Math.max(0, total - window.JGT_COMBO.descuentoUSD);
    var q = { kind: "price", total: total, people: n, perPerson: total / n, combo: combo };
    if (C.deposito) { q.deposit = Math.ceil(total * C.deposito); q.rest = total - q.deposit; }
    return q;
  }

  var submitted = false;
  function refresh() {
    var q = computeQuote(), price = "—", note = "Elige cuántas personas son.";
    if (q.kind === "pending") { price = "A cotizar"; note = q.reason; }
    if (q.kind === "price") {
      price = usd(q.total);
      var pct = C.deposito ? Math.round(C.deposito * 100) : 0;
      note = L("Total para " + q.people + (q.people === 1 ? " persona" : " personas") +
        (q.people > 1 ? " (" + usd(q.perPerson) + " por persona)" : "") + ". ",
        "Total for " + q.people + (q.people === 1 ? " person" : " people") +
        (q.people > 1 ? " (" + usd(q.perPerson) + " per person)" : "") + ". ") +
        (o.detail ? o.detail(q.people, els) : T(o.priceNote)) +
        (q.combo ? L(" Incluye combo aeropuerto: −US$" + window.JGT_COMBO.descuentoUSD + ".", " Includes airport combo: −US$" + window.JGT_COMBO.descuentoUSD + ".") : "") +
        (q.deposit ? L(" Reserva con " + usd(q.deposit) + " (" + pct + " %) y paga " + usd(q.rest) + " al abordar.",
                       " Book with " + usd(q.deposit) + " (" + pct + "%) and pay " + usd(q.rest) + " when you board.") : "");
    }
    $("quotePrice").textContent = price;
    $("quotePrice").classList.toggle("pending", price === "A cotizar");
    $("quoteNote").textContent = note;
    $("barCount").textContent = T(o.short) + (q.kind === "price" ? " · " + q.people + L(q.people === 1 ? " persona" : " personas", q.people === 1 ? " person" : " people") : "");
    $("barPrice").textContent = q.kind === "price" ? "Total: " + price : (q.kind === "pending" ? "Precio: a cotizar" : "Calcula tu precio");
    els.pickup.placeholder = els.pickupZone.value === "boca" ? "Ej.: Hotel Don Juan, Boca Chica" : "Hotel, barrio o ciudad";
    if (submitted) validate();
    return q;
  }

  function validate() {
    var e = {};
    if (!els.people.value) e.people = "Elige cuántas personas.";
    if (!els.date.value) e.date = "Elige la fecha.";
    else if (els.date.value < todayISO()) e.date = "La fecha no puede ser anterior a hoy.";
    if (els.pickup.value.trim().length < 3) e.pickup = "Escribe el hotel o la dirección de recogida.";
    var nm = els.name.value.trim();
    if (nm.length < 3 || !/[a-zA-ZÀ-ÿ]/.test(nm)) e.name = "Escribe tu nombre completo.";
    if (o.extraValidate) { var x = o.extraValidate(els); for (var k in x) if (!e[k]) e[k] = x[k]; }
    var pd = els.phone.value.replace(/\D/g, "");
    if (!pd) e.phone = "Escribe tu número de WhatsApp.";
    else if (pd.length < 10 || pd.length > 15) e.phone = "Número incompleto. Incluye el código de país (ej.: +1 809 555 1234).";
    keys.forEach(function (k) {
      var box = form.querySelector('.err[data-for="' + id(k) + '"]');
      if (box) box.textContent = e[k] || "";
      els[k].classList.toggle("invalid", !!e[k]);
    });
    $("formError").classList.toggle("hidden", !Object.keys(e).length);
    return e;
  }

  function buildMessage() {
    var q = computeQuote();
    var L = ["Nombre: " + els.name.value.trim(), "WhatsApp: " + els.phone.value.trim(), "Excursión: " + o.msgTour];
    (o.extras || []).forEach(function (e) { L.push(e.label + ": " + esText(els[e.key])); });
    L.push("Recogida: " + els.pickup.value.trim() + (els.pickupZone.value === "boca" ? " (Boca Chica)" : ""));
    L.push("Fecha: " + fmtDate(els.date.value));
    L.push("Personas: " + esText(els.people));
    if ($("combo") && $("combo").checked) L.push("Combo aeropuerto: sí, también reserva traslado del aeropuerto" + (q.kind === "price" ? " (−US$" + window.JGT_COMBO.descuentoUSD + " incluido)" : " (descuento de US$" + window.JGT_COMBO.descuentoUSD + ")"));
    L.push("Precio estimado: " + (q.kind === "price" ? usd(q.total) : "A cotizar"));
    if (q.deposit) { L.push("Reserva (" + Math.round(C.deposito * 100) + " %): " + usd(q.deposit)); L.push("Resto al abordar: " + usd(q.rest)); }
    if (window.JGT_LANG === "en") L.push("Idioma del cliente: inglés");
    return L.join("\n");
  }
  function whatsappUrl() { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(buildMessage()); }

  var box = $("confirmBox"), waLink = $("waLink");
  function openConfirm() {
    var q = computeQuote();
    $("cRoute").textContent = T(o.short) + " · " + fmtDate(els.date.value) + " · " + txt(els.people) + L(" personas", " people");
    $("cPrice").textContent = q.kind === "price" ? usd(q.total) : "A cotizar";
    $("cPrice").classList.toggle("pending", q.kind !== "price");
    $("cNote").textContent = q.kind === "price" ? T(o.included) : q.reason;
    var dep = $("cDeposit");
    if (dep) {
      dep.classList.toggle("hidden", !q.deposit);
      if (q.deposit) dep.innerHTML = L("Para reservar: <b>" + usd(q.deposit) + "</b> (" + Math.round(C.deposito * 100) + " %) · Al abordar: <b>" + usd(q.rest) + "</b>",
        "To book: <b>" + usd(q.deposit) + "</b> (" + Math.round(C.deposito * 100) + "%) · When you board: <b>" + usd(q.rest) + "</b>");
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

  refresh();
  return { computeQuote: computeQuote, buildMessage: buildMessage };
};
