"""Pruebas de idiomas (ES/EN) y del aviso «elige una opción».
Uso: python3 -I test_i18n.py <URL_BASE>  · No envía nada a WhatsApp."""
import sys, urllib.parse
from playwright.sync_api import sync_playwright
AUTOFILL = """document.addEventListener('submit', function (e) {
  if (e.target.id !== 'booking' || window.__noAutofill) return;
  ['originPlace', 'destinationPlace', 'flight'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el && el.offsetParent !== null && !el.value) el.value = id === 'flight' ? 'AA1234' : 'Hotel Prueba';
  });
}, true);"""
BASE = sys.argv[1].rstrip("/"); DATE = "2026-10-23"; res = []
def check(n, c, d=""):
    res.append(bool(c)); print(("PASA " if c else "FALLA") + " | " + n + (" | " + d if d else ""))
def msg(pg):
    u = pg.evaluate("window.__lastUrl") or ""; return urllib.parse.unquote(u.split("?text=", 1)[-1])
with sync_playwright() as p:
    br = p.chromium.launch()
    def page(locale="es-DO", url="/"):
        ctx = br.new_context(viewport={"width": 390, "height": 844}, locale=locale, timezone_id="America/Santo_Domingo")
        pg = ctx.new_page(); pg.add_init_script("window.__JGT_CAPTURE__=function(u){window.__lastUrl=u;};"); pg.add_init_script(AUTOFILL)
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(BASE + url, wait_until="load"); pg.wait_for_timeout(300); return pg, errs
    # Español
    pg, errs = page()
    check("ES: aviso «¿Qué quieres reservar? Elige una opción»", "Elige una opción" in pg.locator(".pick-cta").inner_text())
    check("ES: botones ES/EN visibles, ES activo", pg.locator('[data-lang="es"].on').count() == 1 and pg.locator('[data-lang="en"]').is_visible())
    check("ES: título en español", "Reserva tu traslado" in pg.locator("h1").inner_text())
    # Inglés por botón
    pg.click('[data-lang="en"]'); pg.wait_for_load_state("load"); pg.wait_for_timeout(300)
    check("EN: el botón cambia a inglés", "Book your private transfer" in pg.locator("h1").inner_text() and "lang=en" in pg.url)
    check("EN: aviso en inglés", "Choose one" in pg.locator(".pick-cta").inner_text())
    check("EN: botones Transfers / Tours", "Transfers" in pg.locator(".svc-switch").inner_text() and "Tours & excursions" in pg.locator(".svc-switch").inner_text())
    check("EN: el enlace a tours conserva el idioma", "lang=en" in pg.get_attribute(".svc-switch a", "href"))
    pg.select_option("#destination", "boca"); pg.select_option("#passengers", "2")
    check("EN: solo ida US$25 con nota en inglés", pg.locator("#quotePrice").inner_text() == "US$25" and "Fare for up to 4 passengers" in pg.locator("#quoteNote").inner_text())
    pg.click(".toggle label:has(input[value=round]) span"); pg.fill("#date", DATE); pg.fill("#time", "10:00"); pg.fill("#returnDate", "2026-10-24"); pg.fill("#returnTime", "11:00")
    check("EN: regreso otro día US$50 «Outbound + return»", pg.locator("#quotePrice").inner_text() == "US$50" and pg.locator("#quoteNote").inner_text() == "Outbound US$25 + return US$25.")
    pg.click("#submitBtn"); pg.wait_for_timeout(300)
    check("EN: errores de validación en inglés", "Enter your full name." in pg.locator('.err[data-for="name"]').inner_text())
    pg.fill("#name", "Test Client"); pg.fill("#phone", "+1 809 555 1234"); pg.click("#submitBtn"); pg.wait_for_timeout(300)
    check("EN: ventana en inglés", "Your request is ready" in pg.locator("#confirmBox").inner_text())
    pg.click("#waLink"); pg.wait_for_timeout(500); m = msg(pg)
    check("EN: mensaje al propietario en español + idioma del cliente", "Servicio: Ida y vuelta" in m and "Pasajeros: 2" in m and "Idioma del cliente: inglés" in m, m.replace("\n", " / "))
    check("EN: sin errores de JavaScript (traslados)", not errs, "; ".join(errs))
    # Recordado al volver
    pg.goto(BASE + "/tours/", wait_until="load"); pg.wait_for_timeout(300)
    check("EN: el idioma se recuerda en tours", "Which tour would you like?" in pg.locator(".chooser").inner_text())
    pg.click('.choice[data-tour="buggies"]'); pg.select_option("#bPeople", "2")
    check("EN: Four Wheel en inglés con depósito 50 %", "Book with US$85 (50%) and pay US$85 when you board." in pg.locator("#bQuoteNote").inner_text(), pg.locator("#bQuoteNote").inner_text())
    pg.fill("#bPickup", "Hotel X"); pg.fill("#bDate", DATE); pg.fill("#bName", "Test Client"); pg.fill("#bPhone", "+1 809 555 1234")
    pg.click("#bSubmitBtn"); pg.wait_for_timeout(300); pg.click("#bWaLink"); pg.wait_for_timeout(500); m = msg(pg)
    check("EN: mensaje Four Wheel en español", "Plan: Tour Básico (Loma de Managua + río Salto Alto)" in m and "Tipo: Estándar" in m and "Reserva (50 %): US$85" in m, m.replace("\n", " / "))
    pg.click('[data-lang="es"]'); pg.wait_for_load_state("load"); pg.wait_for_timeout(300)
    check("ES: volver a español", "¿Qué tour quieres hacer?" in pg.locator(".chooser").inner_text())
    # Detección automática
    pg2, errs2 = page(locale="en-US")
    check("Teléfono en inglés abre en inglés", "Book your private transfer" in pg2.locator("h1").inner_text())
    pg3, _ = page(locale="en-US", url="/?lang=es")
    check("?lang=es fuerza español", "Reserva tu traslado" in pg3.locator("h1").inner_text())
    check("Sin errores de JavaScript", not errs2)
    br.close()
print(f"\nRESULTADO: {sum(res)}/{len(res)} pruebas superadas"); sys.exit(0 if all(res) else 1)
