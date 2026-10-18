/* Combo: el cliente agrega varios servicios (traslados y tours) y los
 * envía juntos en un solo mensaje de WhatsApp con descuento por cantidad.
 * Cada formulario registra su servicio en window.JGT_COMBO_ITEMS
 * (id de la ventana previa → función que devuelve el servicio). */
(function () {
  "use strict";
  var C = window.JGT_COMBO;
  var PROV = window.JGT_COMBO_ITEMS || {};
  if (!C) return;
  var KEY = "jgt_combo", mem = [];
  var WA = (window.JGT_CONFIG && window.JGT_CONFIG.whatsapp) || "18298182426";
  var inTours = /\/tours\//.test(location.pathname);
  var hrefTransfers = inTours ? "../" : "./", hrefTours = inTours ? "./" : "tours/";
  if (window.JGT_LANG === "en") { hrefTransfers += "?lang=en"; hrefTours += "?lang=en"; }

  function load() { try { var v = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(v) ? v : mem; } catch (e) { return mem; } }
  function save(list) { mem = list; try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }
  function usd(n) { return "US$" + (Math.round(n * 100) % 100 === 0 ? String(Math.round(n)) : n.toFixed(2)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  /* Cada servicio trae su precio normal (total) y su precio de combo (totalCombo) */
  function active(n) { return n >= C.minServicios; }
  /* Cálculo del combo */
  function calc(list) {
    var on = active(list.length), sub = 0, disc = 0, dep = 0, pending = 0;
    var rows = list.map(function (it) {
      var d = 0;
      if (it.total == null) pending++;
      else {
        sub += it.total;
        if (on && it.totalCombo != null) d = Math.max(0, it.total - it.totalCombo);
        disc += d;
        if (it.deposito) dep += Math.ceil((it.total - d) * it.deposito);
      }
      return { it: it, d: d };
    });
    return { rows: rows, on: on, sub: sub, disc: disc, total: sub - disc, dep: dep, pending: pending };
  }

  /* Mensaje único para el propietario (siempre en español) */
  var SKIP = /^(Nombre|WhatsApp|Idioma del cliente|Precio estimado|Reserva \(|Resto al abordar)/;
  function message(list) {
    var r = calc(list), last = list[list.length - 1] || {}, L = [];
    L.push("🎁 COMBO · " + list.length + " servicios");
    L.push("Nombre: " + (last.nombre || "")); L.push("WhatsApp: " + (last.whatsapp || ""));
    r.rows.forEach(function (x, i) {
      L.push(""); L.push((i + 1) + ") " + x.it.titulo);
      x.it.msg.split("\n").forEach(function (l) { if (l && !SKIP.test(l)) L.push(l); });
      L.push("Precio: " + (x.it.total == null ? "A cotizar" : usd(x.it.total) + (x.d ? " − US$" + x.d + " combo = " + usd(x.it.total - x.d) : "")));
    });
    L.push("");
    L.push("Subtotal: " + usd(r.sub) + (r.pending ? " + " + r.pending + " a cotizar" : ""));
    if (r.disc) L.push("Descuento combo: −" + usd(r.disc));
    L.push("Total estimado: " + usd(r.total) + (r.pending ? " + servicios a cotizar" : ""));
    if (r.dep) L.push("Reserva Four Wheel Comatillo (50 %): " + usd(r.dep));
    if (window.JGT_LANG === "en") L.push("Idioma del cliente: inglés");
    return L.join("\n");
  }

  /* ---------- Interfaz ---------- */
  var css = document.createElement("style");
  css.textContent = [
    ".combo-bar{position:fixed;top:0;left:0;right:0;z-index:60;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 16px;padding-top:calc(10px + env(safe-area-inset-top));background:var(--gold,#c9a24b);color:var(--navy,#0b1f3a);font-weight:700;font-size:14px;box-shadow:0 4px 14px rgba(0,0,0,.18)}",
    ".combo-bar button{background:var(--navy,#0b1f3a);color:#fff;border:0;border-radius:10px;padding:8px 14px;font:inherit;font-weight:800;cursor:pointer;white-space:nowrap}",
    "body.has-combo{padding-top:56px}",
    ".combo-add{display:block;width:100%;margin-top:10px;padding:14px;border:2px solid var(--gold,#c9a24b);border-radius:14px;background:#fffaf0;color:var(--navy,#0b1f3a);font:inherit;font-weight:800;font-size:15px;cursor:pointer}",
    ".combo-toast{position:fixed;left:16px;right:16px;bottom:90px;z-index:80;margin:0 auto;max-width:460px;background:var(--navy,#0b1f3a);color:#fff;border-radius:14px;padding:14px 16px;font-size:14px;box-shadow:0 8px 24px rgba(0,0,0,.25)}",
    ".combo-toast a{color:var(--gold,#c9a24b);font-weight:800;margin-right:14px}",
    ".combo-list{list-style:none;margin:12px 0;padding:0}",
    ".combo-list li{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--line,#e3e7ee);font-size:14px}",
    ".combo-list b{display:block;color:var(--navy,#0b1f3a)}",
    ".combo-list small{color:var(--muted,#667085)}",
    ".combo-list .cp{text-align:right;white-space:nowrap;font-weight:700}",
    ".combo-list .cp s{display:block;font-weight:400;color:var(--muted,#667085);font-size:12px}",
    ".combo-list .rm{border:0;background:none;color:#b42318;font-size:13px;cursor:pointer;padding:4px 0 0}",
    ".combo-sum{background:#f6f8fb;border-radius:12px;padding:12px 14px;font-size:14px}",
    ".combo-sum div{display:flex;justify-content:space-between;margin:3px 0}",
    ".combo-sum .tot{font-size:18px;font-weight:800;color:var(--navy,#0b1f3a)}",
    ".combo-sum .save{color:#067647;font-weight:700}",
    ".combo-hint{margin:10px 0 0;padding:10px 12px;border-radius:10px;background:#fffaf0;border:1px dashed var(--gold,#c9a24b);font-size:13px;color:var(--navy,#0b1f3a)}",
    ".combo-more{display:flex;gap:8px;margin-top:10px}.combo-more a{flex:1;text-align:center;padding:11px;border-radius:12px;border:2px solid var(--navy,#0b1f3a);color:var(--navy,#0b1f3a);font-weight:800;text-decoration:none;font-size:14px}",
    ".combo-clear{display:block;margin:12px auto 0;border:0;background:none;color:var(--muted,#667085);text-decoration:underline;cursor:pointer;font:inherit;font-size:13px}"
  ].join("\n");
  document.head.appendChild(css);

  var bar = document.createElement("div");
  bar.className = "combo-bar hidden"; bar.id = "comboBar"; bar.setAttribute("aria-live", "polite");
  bar.innerHTML = '<span id="comboBarText"></span><button type="button" id="comboOpen"></button>';
  document.body.appendChild(bar);

  var box = document.createElement("div");
  box.className = "overlay hidden"; box.id = "comboBox";
  box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-labelledby", "comboTitle");
  box.innerHTML = '<div class="sheet"><h3 id="comboTitle"></h3><ul class="combo-list" id="comboList"></ul>' +
    '<div class="combo-sum" id="comboSum"></div><p class="combo-hint" id="comboHint"></p>' +
    '<a class="cta" id="comboWa" href="#" rel="noopener"></a>' +
    '<div class="combo-more"><a id="comboMoreT" href="' + hrefTransfers + '"></a><a id="comboMoreR" href="' + hrefTours + '"></a></div>' +
    '<button type="button" class="back" id="comboClose"></button><button type="button" class="combo-clear" id="comboClear"></button></div>';
  document.body.appendChild(box);
  var $ = function (id) { return document.getElementById(id); };
  $("comboTitle").textContent = L("🎁 Tu combo", "🎁 Your combo");
  $("comboWa").textContent = L("ENVIAR COMBO POR WHATSAPP", "SEND COMBO ON WHATSAPP");
  $("comboMoreT").textContent = L("+ Traslado", "+ Transfer");
  $("comboMoreR").textContent = L("+ Tour", "+ Tour");
  $("comboClose").textContent = L("Seguir eligiendo", "Keep choosing");
  $("comboClear").textContent = L("Vaciar combo", "Empty combo");
  $("comboOpen").textContent = L("Ver combo", "View combo");

  function render() {
    var list = load(), r = calc(list), n = list.length;
    bar.classList.toggle("hidden", !n);
    document.body.classList.toggle("has-combo", !!n);
    $("comboBarText").textContent = "🎁 " + L("Tu combo: ", "Your combo: ") + n + L(n === 1 ? " servicio" : " servicios", n === 1 ? " service" : " services") +
      (r.disc ? L(" · ahorras ", " · you save ") + usd(r.disc) : "");
    $("comboList").innerHTML = r.rows.map(function (x, i) {
      var p = x.it.total == null ? T("A cotizar") : (x.d ? "<s>" + usd(x.it.total) + "</s>" + usd(x.it.total - x.d) : usd(x.it.total));
      return '<li><div><b>' + esc(T(x.it.titulo)) + '</b><small>' + esc(x.it.resumen || "") + '</small><br><button type="button" class="rm" data-i="' + i + '">' +
        L("Quitar", "Remove") + '</button></div><div class="cp">' + p + '</div></li>';
    }).join("");
    $("comboSum").innerHTML =
      '<div><span>Subtotal</span><span>' + usd(r.sub) + (r.pending ? L(" + a cotizar", " + quote") : "") + '</span></div>' +
      (r.disc ? '<div class="save"><span>' + L("Descuento combo", "Combo discount") + '</span><span>−' + usd(r.disc) + '</span></div>' : "") +
      '<div class="tot"><span>Total</span><span>' + usd(r.total) + '</span></div>' +
      (r.dep ? '<div><span>' + L("Para reservar (Four Wheel Comatillo 50 %)", "To book (Four Wheel Comatillo 50%)") + '</span><span>' + usd(r.dep) + '</span></div>' : "");
    var hint = !r.on
      ? L("Agrega 1 servicio más y activa los precios de combo: recogida en el aeropuerto US$20, regreso US$15, City Tour −US$10, four wheels más baratos.",
          "Add 1 more service to unlock combo prices: airport pickup US$20, return US$15, City Tour −US$10, cheaper four wheels.")
      : (r.disc ? L("¡Precios de combo activados! Ahorras " + usd(r.disc) + ".", "Combo prices unlocked! You save " + usd(r.disc) + ".")
                : L("Precios de combo activados. Isla Saona mantiene su precio; agrega un traslado del aeropuerto, City Tour o four wheel para ahorrar.",
                    "Combo prices unlocked. Saona Island keeps its price; add an airport transfer, City Tour or four wheel to save."));
    $("comboHint").textContent = hint;
    $("comboWa").href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(message(list));
  }
  function open() {
    render(); box.classList.remove("hidden"); bar.classList.add("hidden"); document.body.classList.add("modal-open");
    var t = $("comboToast"); if (t) t.classList.add("hidden");
  }
  function close() { box.classList.add("hidden"); document.body.classList.remove("modal-open"); render(); }
  $("comboOpen").addEventListener("click", open);
  $("comboClose").addEventListener("click", close);
  box.addEventListener("click", function (e) { if (e.target === box) close(); });
  $("comboList").addEventListener("click", function (e) {
    var b = e.target.closest(".rm"); if (!b) return;
    var list = load(); list.splice(Number(b.dataset.i), 1); save(list); render();
    if (!list.length) close();
  });
  $("comboClear").addEventListener("click", function () { save([]); render(); close(); });
  $("comboWa").addEventListener("click", function (e) {
    if (typeof window.__JGT_CAPTURE__ === "function") { e.preventDefault(); window.__JGT_CAPTURE__($("comboWa").href); } // solo pruebas
    setTimeout(function () { save([]); render(); close(); }, 600);
  });

  var toastT;
  function toast(n) {
    var t = $("comboToast");
    if (!t) { t = document.createElement("div"); t.className = "combo-toast"; t.id = "comboToast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.innerHTML = "✓ " + L("Agregado a tu combo (" + n + "). ", "Added to your combo (" + n + "). ") +
      (n < C.minServicios ? L("Agrega otro servicio para activar los precios de combo. ", "Add another service to unlock combo prices. ") : L("Precios de combo activados. ", "Combo prices unlocked. ")) +
      '<br><a href="' + hrefTransfers + '">' + L("+ Traslado", "+ Transfer") + '</a><a href="' + hrefTours + '">' + L("+ Tour", "+ Tour") + '</a>';
    t.classList.remove("hidden"); clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.add("hidden"); }, 7000);
  }

  /* Botón «Agregar al combo» en cada ventana previa */
  Object.keys(PROV).forEach(function (boxId) {
    var modal = $(boxId); if (!modal) return;
    var wa = modal.querySelector("a.cta");
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "combo-add"; btn.id = boxId + "Combo";
    btn.textContent = L("🎁 Agregar a mi combo y seguir eligiendo", "🎁 Add to my combo and keep choosing");
    wa.parentNode.insertBefore(btn, wa.nextSibling);
    btn.addEventListener("click", function () {
      var it = PROV[boxId](), list = load();
      if (list.length >= C.maxServicios) { alert(L("Máximo " + C.maxServicios + " servicios por combo.", "Maximum " + C.maxServicios + " services per combo.")); return; }
      list.push(it); save(list); render();
      var back = modal.querySelector(".back"); if (back) back.click(); else modal.classList.add("hidden");
      document.body.classList.remove("modal-open");
      toast(list.length);
    });
  });

  window.JGT_COMBOAPI = { load: load, calc: calc, message: message, render: render, open: open };
  render();
})();
