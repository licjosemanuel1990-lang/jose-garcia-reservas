"""Pruebas del combo aeropuerto y preguntas frecuentes. Uso: python3 -I test_combo.py <URL_BASE> <carpeta>"""
import sys, urllib.parse, re
from playwright.sync_api import sync_playwright
ROOT = sys.argv[1].rstrip("/") + "/"; BASE = ROOT + "tours/"; OUT = sys.argv[2]; DATE = "2026-10-23"
res = []
def check(n, c, d=""):
    res.append(bool(c)); print(("PASA " if c else "FALLA") + " | " + n + (" | " + d if d else ""))
def num(s): m = re.search(r"US\$(\d+)", s); return int(m.group(1)) if m else None
with sync_playwright() as p:
    br = p.chromium.launch()
    ctx = br.new_context(**p.devices["iPhone 13"], timezone_id="America/Santo_Domingo", locale="es-DO")
    pg = ctx.new_page(); pg.add_init_script("window.__JGT_CAPTURE__=function(u){window.__lastUrl=u;};")
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(BASE, wait_until="load")
    check("Aviso del combo en el selector", "Combo aeropuerto" in pg.locator(".chooser").inner_text())
    # Saona
    pg.click('.choice[data-tour="saona"]'); pg.select_option("#sPeople", "2")
    check("Saona 2 personas sin combo = US$170", pg.locator("#sQuotePrice").inner_text() == "US$170")
    pg.check("#sCombo")
    check("Saona 2 personas con combo = US$155", pg.locator("#sQuotePrice").inner_text() == "US$155", pg.locator("#sQuotePrice").inner_text())
    check("Nota menciona el combo", "combo aeropuerto" in pg.locator("#sQuoteNote").inner_text())
    pg.fill("#sDate", DATE); pg.fill("#sPickup", "Hotel Don Juan"); pg.fill("#sName", "Cliente de Prueba"); pg.fill("#sPhone", "+1 809 555 1234")
    pg.click("#sSubmitBtn"); pg.wait_for_timeout(300); pg.click("#sWaLink"); pg.wait_for_timeout(500)
    msg = urllib.parse.unquote((pg.evaluate("window.__lastUrl") or "").split("?text=", 1)[-1])
    check("Mensaje Saona dice combo y precio US$155", "Combo aeropuerto: sí" in msg and "Precio estimado: US$155" in msg)
    # Comatillo: el 50 % se calcula sobre el precio con descuento
    pg.goto(BASE + "?r=2#buggies", wait_until="load"); pg.select_option("#bPeople", "2")
    pg.check("#bCombo")
    check("Comatillo 2 personas con combo = US$155", pg.locator("#bQuotePrice").inner_text() == "US$155", pg.locator("#bQuotePrice").inner_text())
    check("Reserva 50 % sobre US$155 = US$78", "US$78 (50 %)" in pg.locator("#bQuoteNote").inner_text(), pg.locator("#bQuoteNote").inner_text())
    # Four Wheel Boca Chica no tiene combo
    pg.goto(BASE + "?r=3#fwboca", wait_until="load")
    check("Four Wheel Boca Chica sin casilla de combo", pg.locator("#fCombo").count() == 0)
    # City Tour
    pg.goto(BASE + "?r=4#city", wait_until="load"); pg.locator("#stops .stop").first.click(); pg.select_option("#people", "2")
    a = num(pg.locator("#quotePrice").inner_text()); pg.check("#combo"); b = num(pg.locator("#quotePrice").inner_text())
    check("City Tour: combo resta US$15", a and b and a - b == 15, f"{a} → {b}")
    # Preguntas frecuentes
    check("Preguntas frecuentes en tours (6)", pg.locator(".faq details").count() == 6)
    pg.locator(".faq summary", has_text="cancelar").click()
    check("Política: cancelación gratis 24 h", "Cancelación gratis hasta 24 horas" in pg.locator(".faq").inner_text())
    check("Sin errores de JavaScript (tours)", not errs, "; ".join(errs))
    check("Sin desbordes (tours)", not pg.evaluate("document.documentElement.scrollWidth > window.innerWidth"))
    pg.goto(ROOT, wait_until="load")
    check("Traslados: tarjeta del combo y enlace a tours", pg.locator(".combo-card a[href='tours/']").count() == 1)
    check("Traslados: preguntas frecuentes", pg.locator(".faq details").count() == 6)
    check("Sin desbordes (traslados)", not pg.evaluate("document.documentElement.scrollWidth > window.innerWidth"))
    pg.locator(".combo-card").scroll_into_view_if_needed(); pg.screenshot(path=f"{OUT}/combo-traslados.png")
    # Inglés
    pg.goto(ROOT + "?lang=en", wait_until="load")
    t = pg.locator(".faq").inner_text() + pg.locator(".combo-card").inner_text()
    check("EN: preguntas y combo traducidos", "Frequently asked questions" in t and "Airport + tour combo" in t and "¿" not in t, t[:120])
    pg.goto(BASE + "?lang=en#saona", wait_until="load")
    check("EN: casilla del combo traducida", "Airport combo: save US$15" in pg.locator("#saonaForm").inner_text())
    check("Sin errores de JavaScript", not errs, "; ".join(errs))
    br.close()
print(f"\nRESULTADO: {sum(res)}/{len(res)} pruebas superadas"); sys.exit(0 if all(res) else 1)
