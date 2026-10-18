"""Pruebas del combo (carrito de servicios) y preguntas frecuentes.
Uso: python3 -I test_combo.py <URL_BASE> <carpeta>"""
import sys, urllib.parse
from playwright.sync_api import sync_playwright
ROOT = sys.argv[1].rstrip("/") + "/"; BASE = ROOT + "tours/"; OUT = sys.argv[2]; DATE = "2026-10-23"
res = []
def check(n, c, d=""):
    res.append(bool(c)); print(("PASA " if c else "FALLA") + " | " + n + (" | " + d if d else ""))
def datos(pg, p, pickup=True):
    pg.fill(f"#{p}Date", DATE)
    if pickup: pg.fill(f"#{p}Pickup", "Hotel Don Juan")
    pg.fill(f"#{p}Name", "Cliente Combo"); pg.fill(f"#{p}Phone", "+1 809 555 1234")
with sync_playwright() as p:
    br = p.chromium.launch()
    ctx = br.new_context(**p.devices["iPhone 13"], timezone_id="America/Santo_Domingo", locale="es-DO")
    pg = ctx.new_page(); pg.add_init_script("window.__JGT_CAPTURE__=function(u){window.__lastUrl=u;};")
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))

    # 1) Traslado SDQ → Boca Chica (US$25)
    pg.goto(ROOT, wait_until="load"); pg.evaluate("localStorage.clear()"); pg.reload(wait_until="load")
    check("Sin combo no se ve la barra", not pg.locator("#comboBar").is_visible())
    check("Traslados: tarjeta del combo con niveles", pg.locator(".combo-card .combo-levels li").count() == 3)
    pg.select_option("#destination", "boca"); pg.fill("#date", DATE); pg.fill("#time", "14:00")
    pg.select_option("#passengers", "2"); pg.fill("#name", "Cliente Combo"); pg.fill("#phone", "+1 809 555 1234")
    pg.click("#submitBtn"); pg.wait_for_timeout(300)
    check("Ventana del traslado tiene «Agregar a mi combo»", pg.locator("#confirmBoxCombo").is_visible())
    pg.click("#confirmBoxCombo"); pg.wait_for_timeout(300)
    check("Barra: 1 servicio", "1 servicio" in pg.locator("#comboBar").inner_text(), pg.locator("#comboBar").inner_text())
    check("Aviso de agregado", pg.locator("#comboToast").is_visible())

    # 2) Saona 2 personas (US$170)
    pg.goto(BASE + "?r=1#saona", wait_until="load")
    check("El combo sigue al pasar a tours", "1 servicio" in pg.locator("#comboBar").inner_text())
    pg.select_option("#sPeople", "2"); datos(pg, "s"); pg.click("#sSubmitBtn"); pg.wait_for_timeout(300)
    pg.click("#sConfirmBoxCombo"); pg.wait_for_timeout(300)
    check("2 servicios: solo el traslado baja US$3 (Saona sin descuento)", "2 servicios" in pg.locator("#comboBar").inner_text() and "US$3" in pg.locator("#comboBar").inner_text(), pg.locator("#comboBar").inner_text())

    # 3) Comatillo 2 personas, 1 four wheel (US$170, reserva 50 %)
    pg.goto(BASE + "?r=2#buggies", wait_until="load")
    pg.select_option("#bPeople", "2"); datos(pg, "b"); pg.click("#bSubmitBtn"); pg.wait_for_timeout(300)
    pg.click("#bConfirmBoxCombo"); pg.wait_for_timeout(300)
    check("3 servicios: traslado US$4 + Comatillo US$4 = ahorras US$8", "US$8" in pg.locator("#comboBar").inner_text(), pg.locator("#comboBar").inner_text())

    # 4) Four Wheel Boca Chica 2 personas (US$70) — cuenta pero sin descuento
    pg.goto(BASE + "?r=3#fwboca", wait_until="load")
    pg.select_option("#fPeople", "2"); datos(pg, "f"); pg.click("#fSubmitBtn"); pg.wait_for_timeout(300)
    pg.click("#fConfirmBoxCombo"); pg.wait_for_timeout(300)
    check("4 servicios: US$5 × 3 (traslado, Comatillo, Boca Chica) = ahorras US$15", "4 servicios" in pg.locator("#comboBar").inner_text() and "US$15" in pg.locator("#comboBar").inner_text(), pg.locator("#comboBar").inner_text())

    r = pg.evaluate("JGT_COMBOAPI.calc(JGT_COMBOAPI.load())")
    check("Subtotal 25+170+170+70 = US$435", r["sub"] == 435, str(r["sub"]))
    check("Total con descuento = US$420", r["total"] == 420, str(r["total"]))
    check("Reserva Comatillo 50 % de US$165 = US$83", r["dep"] == 83, str(r["dep"]))

    pg.click("#comboOpen"); pg.wait_for_timeout(300)
    check("Ventana del combo lista 4 servicios", pg.locator("#comboList li").count() == 4)
    check("Precio tachado en 3 servicios (Saona no)", pg.locator("#comboList s").count() == 3)
    check("Dice que ya tiene el mayor descuento", "mayor descuento" in pg.locator("#comboHint").inner_text())
    check("Sin desbordes con la ventana abierta", not pg.evaluate("document.documentElement.scrollWidth > window.innerWidth"))
    pg.screenshot(path=f"{OUT}/combo-ventana.png")
    pg.click("#comboWa"); pg.wait_for_timeout(300)
    msg = urllib.parse.unquote((pg.evaluate("window.__lastUrl") or "").split("?text=", 1)[-1])
    for f in ["🎁 COMBO · 4 servicios", "Nombre: Cliente Combo", "1) Traslado: Aeropuerto Las Américas (SDQ) → Boca Chica", "2) Tour Isla Saona (todo incluido)",
              "Precio: US$25 − US$5 combo = US$20", "Precio: US$170\n", "3) Four Wheel en Comatillo", "Precio: US$170 − US$5 combo = US$165", "4) Four Wheel Boca Chica", "Precio: US$70 − US$5 combo = US$65",
              "Subtotal: US$435", "Descuento combo: −US$15", "Total estimado: US$420", "Reserva Four Wheel Comatillo (50 %): US$83"]:
        check(f"Mensaje contiene «{f}»", f in msg)
    check("El nombre aparece una sola vez", msg.count("Nombre:") == 1)
    pg.wait_for_timeout(800)
    check("Tras enviar, el combo se vacía", not pg.locator("#comboBar").is_visible())

    # Quitar servicios baja el descuento
    pg.goto(BASE + "?r=4#saona", wait_until="load")
    pg.select_option("#sPeople", "1"); datos(pg, "s"); pg.click("#sSubmitBtn"); pg.wait_for_timeout(300); pg.click("#sConfirmBoxCombo")
    check("Con 1 servicio no hay descuento", "ahorras" not in pg.locator("#comboBar").inner_text())
    pg.click("#comboOpen"); check("Pista: mientras más servicios, más ahorras", "Mientras más servicios" in pg.locator("#comboHint").inner_text())
    pg.click("#comboList .rm"); pg.wait_for_timeout(200)
    check("Quitar el último cierra y oculta la barra", not pg.locator("#comboBar").is_visible() and not pg.locator("#comboBox").is_visible())

    # Preguntas frecuentes
    check("Preguntas frecuentes en tours (6)", pg.locator(".faq details").count() == 6)
    check("Aviso del combo en el selector", "Arma tu combo" in pg.locator(".chooser").inner_text())
    check("Sin errores de JavaScript", not errs, "; ".join(errs))

    # Inglés
    pg.goto(ROOT + "?lang=en", wait_until="load")
    t = pg.locator(".faq").inner_text() + pg.locator(".combo-card").inner_text()
    check("EN: preguntas y combo traducidos", "Frequently asked questions" in t and "Build your combo" in t and "¿" not in t and "servicios" not in t, t[:160])
    pg.goto(BASE + "?lang=en#saona", wait_until="load"); pg.select_option("#sPeople", "2"); datos(pg, "s"); pg.click("#sSubmitBtn"); pg.wait_for_timeout(300)
    check("EN: botón del combo en inglés", "Add to my combo" in pg.locator("#sConfirmBoxCombo").inner_text())
    pg.click("#sConfirmBoxCombo"); pg.wait_for_timeout(200)
    check("EN: barra en inglés", "Your combo: 1 service" in pg.locator("#comboBar").inner_text(), pg.locator("#comboBar").inner_text())
    check("Sin errores de JavaScript (EN)", not errs, "; ".join(errs))
    br.close()
print(f"\nRESULTADO: {sum(res)}/{len(res)} pruebas superadas"); sys.exit(0 if all(res) else 1)
