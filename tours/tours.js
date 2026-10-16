/* City Tour — menú armable, precio en vivo y envío por WhatsApp.
 * Precios y paradas: tour-config.js */
(function () {
  "use strict";
  var T = window.JGT_TOUR;
  var WA = (window.JGT_CONFIG && window.JGT_CONFIG.whatsapp) || "18298182426";
  var $ = function (id) { return document.getElementById(id); };
  var form = $("tourForm");
  var els = { pickupZone: $("pickupZone"), pickup: $("pickup"), date: $("date"), time: $("time"),
              people: $("people"), name: $("name"), phone: $("phone") };
  var M = 1 + T.margen;

  function photo(file, w) { return "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(file) + "?width=" + (w || 640); }
  function filePage(file) { return "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(file); }
  function usd(n, dec) {
    var whole = Math.round(n * 100) % 100 === 0;
    return "US$" + (whole && !dec ? String(Math.round(n)) : n.toFixed(2));
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function todayISO() { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function fmtDate(d) { var p = d.split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }
  function fmtTime(t) { var q = t.split(":").map(Number); return (q[0] % 12 || 12) + ":" + pad(q[1]) + " " + (q[0] < 12 ? "a. m." : "p. m."); }

  /* ---------- Portada ---------- */
  if (T.portada) $("tourHero").style.backgroundImage = "url('" + photo(T.portada, 1280) + "')";

  /* ---------- Personas ---------- */
  els.people.appendChild(new Option("Elige", ""));
  for (var i = 1; i <= T.maxPersonas; i++) els.people.appendChild(new Option(String(i), String(i)));
  els.people.appendChild(new Option("Más de " + T.maxPersonas, (T.maxPersonas + 1) + "+"));
  els.date.min = todayISO();

  /* ---------- Tarjetas de paradas ---------- */
  var state = {};   // id -> { on: bool, opt: id }
  function stopCostLabel(p) {
    var parts = [];
    var rd = p.porPersonaRD || 0;
    if (p.opciones) {
      var o = optionOf(p);
      rd = o.porPersonaRD || 0;
    }
    if (p.grupoUSD) parts.push("+" + usd(p.grupoUSD * M) + " por grupo");
    if (rd) parts.push("+" + usd(rd / T.tasaCambio * M, true) + " por persona");
    if (p.cambiaTransporte) parts.push("+" + usd((T.transporteConPlaza - T.transporte) * M) + " al transporte");
    return parts.length ? parts.join(" · ") : "Gratis";
  }
  function optionOf(p) {
    var id = state[p.id].opt;
    for (var k = 0; k < p.opciones.length; k++) if (p.opciones[k].id === id) return p.opciones[k];
    return p.opciones[0];
  }

  var stopsBox = $("stops");
  T.paradas.forEach(function (p) {
    state[p.id] = { on: !!p.marcada, opt: p.opciones ? p.opciones[0].id : null };
    var card = document.createElement("div");
    card.className = "stop";
    card.setAttribute("role", "checkbox");
    card.setAttribute("tabindex", "0");
    card.dataset.id = p.id;

    var pic = document.createElement("div");
    pic.className = "pic";
    pic.textContent = p.icono || "📍";
    if (p.foto) {
      var img = document.createElement("img");
      img.alt = p.nombre; img.loading = "lazy"; img.src = photo(p.foto);
      img.onerror = function () { img.remove(); };
      img.title = "Foto: Wikimedia Commons — " + filePage(p.foto);
      pic.appendChild(img);
    }
    var check = document.createElement("span");
    check.className = "check"; check.textContent = "✓"; check.setAttribute("aria-hidden", "true");
    pic.appendChild(check);

    var body = document.createElement("div");
    body.className = "body";
    var h = document.createElement("h3"); h.textContent = p.nombre;
    var d = document.createElement("p"); d.textContent = p.descripcion;
    body.appendChild(h); body.appendChild(d);

    if (p.opciones) {
      var opts = document.createElement("div");
      opts.className = "opts";
      p.opciones.forEach(function (o, idx) {
        var lab = document.createElement("label");
        var r = document.createElement("input");
        r.type = "radio"; r.name = "opt_" + p.id; r.value = o.id; r.checked = idx === 0;
        r.addEventListener("change", function () { state[p.id].opt = o.id; state[p.id].on = true; refresh(); });
        lab.appendChild(r); lab.appendChild(document.createTextNode(o.nombre));
        opts.appendChild(lab);
      });
      body.appendChild(opts);
    }
    var cost = document.createElement("div");
    cost.className = "cost";
    body.appendChild(cost);

    card.appendChild(pic); card.appendChild(body);
    card.addEventListener("click", function (e) {
      if (e.target.closest(".opts")) { state[p.id].on = true; refresh(); return; }
      state[p.id].on = !state[p.id].on; refresh();
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); state[p.id].on = !state[p.id].on; refresh(); }
    });
    stopsBox.appendChild(card);
  });

  function selected() { return T.paradas.filter(function (p) { return state[p.id].on; }); }

  /* ---------- Cálculo ---------- */
  function computeQuote() {
    var sel = selected();
    if (!sel.length) return { kind: "empty" };
    var ppl = els.people.value;
    if (ppl && !/^\d+$/.test(ppl)) return { kind: "pending", reason: "Para grupos de más de " + T.maxPersonas + " personas te enviaremos el precio por WhatsApp." };
    if (els.pickupZone.value !== "boca") return { kind: "pending", reason: "Recogida fuera de Boca Chica: te cotizaremos el transporte por WhatsApp." };
    var n = Number(ppl) || 1;
    var plaza = sel.some(function (p) { return p.cambiaTransporte; });
    var transport = (plaza ? T.transporteConPlaza : T.transporte) + Math.max(0, n - T.pasajerosIncluidos) * T.cargoPasajeroAdicional;
    var groupUSD = 0, perPersonRD = 0;
    sel.forEach(function (p) {
      groupUSD += p.grupoUSD || 0;
      perPersonRD += p.opciones ? (optionOf(p).porPersonaRD || 0) : (p.porPersonaRD || 0);
    });
    var cost = transport + groupUSD + perPersonRD * n / T.tasaCambio;
    var total = Math.ceil(cost * M);
    return { kind: "price", total: total, perPerson: total / n, people: n, assumed: !ppl };
  }

  function refresh() {
    T.paradas.forEach(function (p) {
      var card = stopsBox.querySelector('[data-id="' + p.id + '"]');
      card.classList.toggle("on", state[p.id].on);
      card.setAttribute("aria-checked", state[p.id].on ? "true" : "false");
      var c = card.querySelector(".cost");
      var label = stopCostLabel(p);
      c.textContent = label;
      c.classList.toggle("free", label === "Gratis");
    });
    els.pickup.placeholder = els.pickupZone.value === "boca" ? "Ej.: Hotel Don Juan, Boca Chica" : "Hotel, barrio o ciudad";
    var q = computeQuote();
    var price = "—", note = "", label = "Precio del tour";
    if (q.kind === "empty") note = "Elige al menos una parada.";
    else if (q.kind === "pending") { price = "A cotizar"; note = q.reason; }
    else {
      price = usd(q.total);
      note = q.assumed ? "Precio para 1 persona. Elige cuántas personas son para calcular el total."
                       : "Total para " + q.people + (q.people === 1 ? " persona" : " personas") + " (≈ " + usd(q.perPerson, true) + " por persona). Incluye transporte privado.";
    }
    $("quoteLabel").textContent = label;
    $("quotePrice").textContent = price;
    $("quotePrice").classList.toggle("pending", price === "A cotizar");
    $("quoteNote").textContent = note;
    if (submitted) validate();
    return q;
  }

  /* ---------- Validación ---------- */
  var submitted = false;
  function validate() {
    var e = {};
    if (!selected().length) e.stops = "Elige al menos una parada.";
    if (els.pickup.value.trim().length < 3) e.pickup = "Escribe el hotel o la dirección de recogida.";
    if (!els.date.value) e.date = "Elige la fecha.";
    else if (els.date.value < todayISO()) e.date = "La fecha no puede ser anterior a hoy.";
    if (!els.time.value) e.time = "Elige la hora.";
    else if (els.date.value === todayISO()) {
      var q = els.time.value.split(":").map(Number), now = new Date();
      if (q[0] * 60 + q[1] <= now.getHours() * 60 + now.getMinutes()) e.time = "Esa hora ya pasó. Elige una hora futura.";
    }
    if (!els.people.value) e.people = "Elige cuántas personas.";
    var nm = els.name.value.trim();
    if (nm.length < 3 || !/[a-zA-ZÀ-ÿ]/.test(nm)) e.name = "Escribe tu nombre completo.";
    var pd = els.phone.value.replace(/\D/g, "");
    if (!pd) e.phone = "Escribe tu número de WhatsApp.";
    else if (pd.length < 10 || pd.length > 15) e.phone = "Número incompleto. Incluye el código de país (ej.: +1 809 555 1234).";
    ["stops", "pickup", "date", "time", "people", "name", "phone"].forEach(function (k) {
      var box = form.querySelector('.err[data-for="' + k + '"]');
      if (box) box.textContent = e[k] || "";
      if (els[k]) els[k].classList.toggle("invalid", !!e[k]);
    });
    $("formError").classList.toggle("hidden", !Object.keys(e).length);
    return e;
  }

  /* ---------- Mensaje ---------- */
  function stopLine(p) { return "• " + p.nombre + (p.opciones ? " (" + optionOf(p).nombre.replace(/ \(gratis\)$/, "") + ")" : ""); }
  function buildMessage() {
    var q = computeQuote();
    var L = [];
    L.push("Nombre: " + els.name.value.trim());
    L.push("WhatsApp: " + els.phone.value.trim());
    L.push("Tour: " + T.nombre);
    L.push("Recogida: " + els.pickup.value.trim() + (els.pickupZone.value === "boca" ? " (Boca Chica)" : ""));
    L.push("Fecha: " + fmtDate(els.date.value));
    L.push("Hora: " + fmtTime(els.time.value));
    L.push("Personas: " + els.people.options[els.people.selectedIndex].text);
    L.push("Paradas:");
    selected().forEach(function (p) { L.push(stopLine(p)); });
    L.push("Precio estimado: " + (q.kind === "price" ? usd(q.total) : "A cotizar"));
    return L.join("\n");
  }
  function whatsappUrl() { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(buildMessage()); }

  /* ---------- Ventana previa ---------- */
  var box = $("confirmBox"), waLink = $("waLink");
  function openConfirm() {
    var q = computeQuote();
    $("cRoute").textContent = T.nombre + " · " + selected().length + " paradas · " + els.people.options[els.people.selectedIndex].text + " personas";
    $("cPrice").textContent = q.kind === "price" ? usd(q.total) : "A cotizar";
    $("cPrice").classList.toggle("pending", q.kind !== "price");
    $("cNote").textContent = q.kind === "price" ? "Precio total del grupo, con transporte privado incluido." : q.reason;
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
    var first = ["stops", "pickup", "date", "time", "people", "name", "phone"].filter(function (k) { return e[k]; })[0];
    if (first) {
      var t = els[first] || stopsBox;
      t.scrollIntoView({ behavior: "smooth", block: "center" });
      if (els[first]) { try { t.focus({ preventScroll: true }); } catch (x) { t.focus(); } }
      return;
    }
    openConfirm();
  });

  window.JGT_TOURAPI = { computeQuote: computeQuote, buildMessage: buildMessage };
  refresh();
})();
