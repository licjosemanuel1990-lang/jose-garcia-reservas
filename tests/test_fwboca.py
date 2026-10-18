"""Pruebas del Four Wheel Boca Chica. Uso: python3 -I test_fwboca.py <URL_BASE> <carpeta>"""
import sys, urllib.parse, re
from playwright.sync_api import sync_playwright
BASE = sys.argv[1].rstrip("/") + "/tours/"; OUT = sys.argv[2]; DATE = "2026-10-23"
res = []
def check(n, c, d=""):
    res.append(bool(c)); print(("PASA " if c else "FALLA") + " | " + n + (" | " + d if d else ""))
with sync_playwright() as p:
    br = p.chromium.launch()
    ctx = br.new_context(**p.devices["iPhone 13"], timezone_id="America/Santo_Domingo", locale="es-DO")
    pg = ctx.new_page(); pg.add_init_script("window.__JGT_CAPTURE__=function(u){window.__lastUrl=u;};")
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(BASE, wait_until="load")
    check("El selector tiene 4 tours", pg.locator(".choice").count() == 4)
    check("Selector dice «Four Wheel Boca Chica» sin precio", "Four Wheel Boca Chica" in pg.locator('.choice[data-tour="fwboca"]').inner_text() and "US$" not in pg.locator('.choice[data-tour="fwboca"]').inner_text())
    pg.click('.choice[data-tour="fwboca"]'); pg.wait_for_timeout(300)
    check("Abre Four Wheel Boca Chica y no Comatillo", pg.locator("#fwbocaTour").is_visible() and not pg.locator("#buggiesTour").is_visible())
    check("La presentación no muestra el precio", "US$" not in pg.locator("#fwbocaTour .b-intro").inner_text())
    check("Sin tarjeta de reserva", pg.locator("#fwbocaTour .deposit-card").count() == 0)
    check("Galería con 6 fotos", pg.locator("#fwbocaTour .s-gallery img[src^='img/fb-']").count() == 6)
    check("Todas las fotos cargan", pg.evaluate("[...document.querySelectorAll('#fwbocaTour img')].every(i=>i.complete&&i.naturalWidth>0)"))
    price = lambda: pg.locator("#fQuotePrice").inner_text().strip()
    check("Sin personas no hay precio", price() == "—")
    for n, exp in [("1", "US$70"), ("2", "US$70"), ("3", "US$140"), ("4", "US$140"), ("15", "US$560"), ("16+", "A cotizar")]:
        pg.select_option("#fPeople", n); check(f"{n} persona(s) = {exp} (four wheels sugeridos)", price() == exp, price())
    pg.select_option("#fPeople", "2"); pg.select_option("#fCount", "2")
    check("2 personas en 2 four wheels = US$140", price() == "US$140", price())
    check("No pide reserva", "Reserva" not in pg.locator("#fQuoteNote").inner_text(), pg.locator("#fQuoteNote").inner_text())
    pg.select_option("#fCount", "1")
    check("Barra inferior muestra el total", "US$70" in pg.locator("#fBarPrice").inner_text())
    pg.select_option("#fPickupZone", "otra"); check("Otra zona = A cotizar", price() == "A cotizar"); pg.select_option("#fPickupZone", "boca")
    pg.select_option("#fPeople", "5"); pg.select_option("#fCount", "2")
    pg.fill("#fDate", DATE); pg.fill("#fPickup", "Hotel Don Juan"); pg.fill("#fName", "Cliente de Prueba"); pg.fill("#fPhone", "+1 809 555 1234")
    pg.click("#fSubmitBtn"); pg.wait_for_timeout(300)
    check("5 personas en 2 four wheels se bloquea", not pg.locator("#fConfirmBox").is_visible() and "al menos 3" in pg.locator('.err[data-for="fCount"]').inner_text())
    pg.select_option("#fCount", "3"); pg.select_option("#fShift", "tarde")
    pg.click("#fSubmitBtn"); pg.wait_for_timeout(300)
    check("Ventana: US$210 sin reserva", pg.locator("#fConfirmBox").is_visible() and pg.locator("#fCPrice").inner_text() == "US$210" and not pg.locator("#fCDeposit").is_visible())
    pg.screenshot(path=f"{OUT}/fwboca-ventana.png")
    pg.click("#fWaLink"); pg.wait_for_timeout(600)
    u = pg.evaluate("window.__lastUrl") or ""; msg = urllib.parse.unquote(u.split("?text=", 1)[-1])
    for f in ["Excursión: Four Wheel Boca Chica", "Four wheels: 3", "Horario: Tarde", "Recogida: Hotel Don Juan (Boca Chica)", "Fecha: 23/10/2026", "Personas: 5", "Precio estimado: US$210"]:
        check(f"Mensaje contiene «{f}»", f in msg)
    check("Mensaje sin reserva", "Reserva (" not in msg)
    for f in []:
        check(f"Mensaje contiene «{f}»", f in msg)
    check("Sin desbordes horizontales", not pg.evaluate("document.documentElement.scrollWidth > window.innerWidth"))
    check("Sin errores de JavaScript", not errs, "; ".join(errs))
    pg.goto(BASE + "#fwboca", wait_until="load"); pg.wait_for_timeout(300)
    check("Enlace directo /tours/#fwboca abre el tour", pg.locator("#fwbocaTour").is_visible())
    pg.screenshot(path=f"{OUT}/fwboca.png", full_page=True)
    # Inglés: no deben quedar textos en español en este tour
    pg.goto(BASE + "?lang=en#fwboca", wait_until="load"); pg.select_option("#fPeople", "3"); pg.wait_for_timeout(300)
    t = pg.locator("#fwbocaTour").inner_text()
    left = [w for w in ["Personas", "Fecha", "Horario", "Mañana", "Calcula", "incluye", "llevar", "reserva", "por four wheel", "Caminos"] if w in t]
    check("En inglés no quedan textos en español", not left, ", ".join(left))
    check("En inglés: precio US$140", pg.locator("#fQuotePrice").inner_text().strip() == "US$140")
    pg.goto(BASE, wait_until="load"); pg.wait_for_timeout(300); pg.screenshot(path=f"{OUT}/hub4.png")
    br.close()
print(f"\nRESULTADO: {sum(res)}/{len(res)} pruebas superadas"); sys.exit(0 if all(res) else 1)
