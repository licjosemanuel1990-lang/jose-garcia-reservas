"""Pruebas de la página Isla Saona. Uso: python3 -I test_saona.py <URL_BASE> <carpeta>"""
import sys, urllib.parse
from playwright.sync_api import sync_playwright
BASE = sys.argv[1].rstrip("/") + "/saona/"; OUT = sys.argv[2]; DATE = "2026-10-23"
res = []
def check(n, c, d=""):
    res.append(bool(c)); print(("PASA " if c else "FALLA") + " | " + n + (" | " + d if d else ""))
with sync_playwright() as p:
    br = p.chromium.launch()
    ctx = br.new_context(**p.devices["iPhone 13"], timezone_id="America/Santo_Domingo", locale="es-DO")
    pg = ctx.new_page(); pg.add_init_script("window.__JGT_CAPTURE__=function(u){window.__lastUrl=u;};")
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(BASE, wait_until="load")
    price = lambda: pg.locator("#quotePrice").inner_text().strip()
    check("Título de la landing", "Isla Saona" in pg.locator("h1").inner_text())
    check("Incluye 5 elementos (transporte, catamarán, piscina, isla, buffet)", pg.locator(".incl li").count() == 5)
    check("Galería con 5 fotos", pg.locator(".s-gallery img").count() == 5)
    check("Sin personas elegidas no hay precio", price() == "—")
    for n, exp in [("1", "US$135"), ("2", "US$170"), ("4", "US$240"), ("10", "US$450"), ("15", "US$625"), ("16+", "A cotizar")]:
        pg.select_option("#people", n); check(f"{n} persona(s) = {exp}", price() == exp, price())
    pg.select_option("#people", "2")
    check("Barra inferior muestra el total", "US$170" in pg.locator("#barPrice").inner_text())
    check("Muestra precio por persona en grupo", "US$85 por persona" in pg.locator("#quoteNote").inner_text())
    pg.select_option("#pickupZone", "otra"); check("Otra zona = A cotizar", price() == "A cotizar"); pg.select_option("#pickupZone", "boca")
    pg.click("#submitBtn"); pg.wait_for_timeout(300)
    check("Formulario incompleto no abre la ventana", not pg.locator("#confirmBox").is_visible())
    pg.fill("#date", "2026-10-01"); pg.fill("#pickup", "Hotel Don Juan"); pg.fill("#name", "Cliente de Prueba"); pg.fill("#phone", "+1 809 555 1234")
    pg.click("#submitBtn"); pg.wait_for_timeout(300)
    check("Fecha pasada bloqueada", not pg.locator("#confirmBox").is_visible())
    pg.fill("#date", DATE); pg.click("#submitBtn"); pg.wait_for_timeout(300)
    check("Ventana muestra US$170 antes de WhatsApp", pg.locator("#confirmBox").is_visible() and pg.locator("#cPrice").inner_text() == "US$170")
    pg.screenshot(path=f"{OUT}/saona-ventana.png")
    pg.click("#waLink"); pg.wait_for_timeout(600)
    u = pg.evaluate("window.__lastUrl") or ""; msg = urllib.parse.unquote(u.split("?text=", 1)[-1])
    check("Enlace a wa.me/18298182426", u.startswith("https://wa.me/18298182426?text="))
    for f in ["Nombre: Cliente de Prueba", "WhatsApp: +1 809 555 1234", "Tour: Isla Saona (todo incluido)", "Recogida: Hotel Don Juan (Boca Chica)", "Fecha: 23/10/2026", "Personas: 2", "Precio estimado: US$170"]:
        check(f"Mensaje contiene «{f}»", f in msg)
    check("Sin desbordes horizontales", not pg.evaluate("document.documentElement.scrollWidth > window.innerWidth"))
    check("Sin errores de JavaScript", not errs, "; ".join(errs))
    pg.goto(BASE, wait_until="load"); pg.wait_for_timeout(300)
    pg.screenshot(path=f"{OUT}/saona-full.png", full_page=True)
    br.close()
print(f"\nRESULTADO: {sum(res)}/{len(res)} pruebas superadas"); sys.exit(0 if all(res) else 1)
