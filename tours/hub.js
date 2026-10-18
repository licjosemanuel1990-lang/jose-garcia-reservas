/* Selector de tours: muestra City Tour o Isla Saona en la misma página. */
(function () {
  "use strict";
  var panes = { city: document.getElementById("cityTour"), saona: document.getElementById("saonaTour"), buggies: document.getElementById("buggiesTour"), fwboca: document.getElementById("fwbocaTour") };
  var bars = { city: document.getElementById("tourBar"), saona: document.getElementById("sBar"), buggies: document.getElementById("bBar"), fwboca: document.getElementById("fBar") };
  var choices = document.querySelectorAll(".choice");
  function show(name, scroll) {
    Object.keys(panes).forEach(function (k) {
      panes[k].classList.toggle("hidden", k !== name);
      bars[k].classList.toggle("hidden", k !== name);
    });
    choices.forEach(function (c) { c.classList.toggle("active", c.dataset.tour === name); c.setAttribute("aria-pressed", c.dataset.tour === name ? "true" : "false"); });
    document.body.classList.toggle("has-bar", !!name);
    if (name && history.replaceState) history.replaceState(null, "", "#" + name);
    if (name && scroll) panes[name].scrollIntoView({ behavior: "smooth", block: "start" });
  }
  choices.forEach(function (c) { c.addEventListener("click", function () { show(c.dataset.tour, true); }); });
  var h = (location.hash || "").replace("#", "");
  if (panes[h]) show(h, false); else show(null, false);
})();
