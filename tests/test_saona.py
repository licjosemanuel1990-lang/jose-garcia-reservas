"""Pruebas de la página Isla Saona. Uso: python3 -I test_saona.py <URL_BASE> <carpeta>"""
import sys, urllib.parse
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
    check("Al abrir, se ve el selector y ningún tour abierto", pg.locator(".chooser").is_visible() and not pg.locator("#saonaTour").is_visible() and not pg.locator("#cityTour").is_visible())
    pg.click('.choice[data-tour="saona"]'); pg.wait_for_timeout(300)
    check("Al tocar «Isla Saona» se abre Saona y no el City Tour", pg.locator("#saonaTour").is_visible() and not pg.locator("#cityTour").is_visible())
    price = lambda: pg.locator("#sQuotePrice").inner_text().strip()
    check("Título de la landing", "Isla Saona" in pg.locator("#saonaTour").inner_text())
    check("Incluye 5 elementos (transporte, catamarán, piscina, isla, buffet)", pg.locator("#saonaTour .incl li").count() == 5)
    check("Galería con 5 fotos", pg.locator("#saonaTour .s-gallery img").count() == 5)
    check("Se llama «Tour Isla Saona» en el selector", "Tour Isla Saona" in pg.locator('.choice[data-tour="saona"]').inner_text())
    check("Sin personas elegidas no hay precio", price() == "—")
    for n, exp in [("1", "US$135"), ("2", "US$170"), ("4", "US$240"), ("10", "US$450"), ("15", "US$625"), ("16+", "A cotizar")]:
        pg.select_option("#sPeople", n); check(f"{n} persona(s) = {exp}", price() == exp, price())
    pg.select_option("#sPeople", "2")
    check("Barra inferior muestra el total", "US$170" in pg.locator("#sBarPrice").inner_text())
    check("Muestra precio por persona en grupo", "US$85 por persona" in pg.locator("#sQuoteNote").inner_text())
    pg.select_option("#sPickupZone", "otra"); check("Otra zona = A cotizar", price() == "A cotizar"); pg.select_option("#sPickupZone", "boca")
    pg.click("#sSubmitBtn"); pg.wait_for_timeout(300)
    check("Formulario incompleto no abre la ventana", not pg.locator("#sConfirmBox").is_visible())
    pg.fill("#sDate", "2026-10-01"); pg.fill("#sPickup", "Hotel Don Juan"); pg.fill("#sName", "Cliente de Prueba"); pg.fill("#sPhone", "+1 809 555 1234")
    pg.click("#sSubmitBtn"); pg.wait_for_timeout(300)
    check("Fecha pasada bloqueada", not pg.locator("#sConfirmBox").is_visible())
    pg.fill("#sDate", DATE); pg.click("#sSubmitBtn"); pg.wait_for_timeout(300)
    check("Ventana muestra US$170 antes de WhatsApp", pg.locator("#sConfirmBox").is_visible() and pg.locator("#sCPrice").inner_text() == "US$170")
    pg.screenshot(path=f"{OUT}/saona-ventana.png")
    pg.click("#sWaLink"); pg.wait_for_timeout(600)
    u = pg.evaluate("window.__lastUrl") or ""; msg = urllib.parse.unquote(u.split("?text=", 1)[-1])
    check("Enlace a wa.me/18298182426", u.startswith("https://wa.me/18298182426?text="))
    for f in ["Nombre: Cliente de Prueba", "WhatsApp: +1 809 555 1234", "Excursión: Tour Isla Saona (todo incluido)", "Recogida: Hotel Don Juan (Boca Chica)", "Fecha: 23/10/2026", "Personas: 2", "Precio estimado: US$170"]:
        check(f"Mensaje contiene «{f}»", f in msg)
    check("Saona no pide reserva (sin depósito)", "Reserva (" not in msg)
    for f in []:
        check(f"Mensaje contiene «{f}»", f in msg)
    check("Sin desbordes horizontales", not pg.evaluate("document.documentElement.scrollWidth > window.innerWidth"))
    check("Sin errores de JavaScript", not errs, "; ".join(errs))
    pg.goto(BASE + "#saona", wait_until="load"); pg.wait_for_timeout(300)
    check("Enlace directo /tours/#saona abre Saona", pg.locator("#saonaTour").is_visible())
    pg.goto(BASE, wait_until="load"); pg.wait_for_timeout(300)
    pg.screenshot(path=f"{OUT}/hub.png")
    br.close()
print(f"\nRESULTADO: {sum(res)}/{len(res)} pruebas superadas"); sys.exit(0 if all(res) else 1)
