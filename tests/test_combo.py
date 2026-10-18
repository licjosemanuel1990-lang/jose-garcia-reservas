"""Pruebas del combo (precios de combo con 2 o más servicios) y preguntas frecuentes.
Uso: python3 -I test_combo.py <URL_BASE> <carpeta>"""
import sys, urllib.parse, re
from playwright.sync_api import sync_playwright
AUTOFILL = """document.addEventListener('submit', function (e) {
  if (e.target.id !== 'booking' || window.__noAutofill) return;
  ['originPlace', 'destinationPlace', 'flight'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el && el.offsetParent !== null && !el.value) el.value = id === 'flight' ? 'AA1234' : 'Hotel Prueba';
  });
}, true);"""
ROOT = sys.argv[1].rstrip("/") + "/"; BASE = ROOT + "tours/"; OUT = sys.argv[2]; DATE = "2026-10-23"
res = []
def check(n, c, d=""):
    res.append(bool(c)); print(("PASA " if c else "FALLA") + " | " + n + (" | " + d if d else ""))
def datos(pg, p, pickup=True):
    pg.fill(f"#{p}Date", DATE)
    if pickup: pg.fill(f"#{p}Pickup", "Hotel Don Juan")
    pg.fill(f"#{p}Name", "Cliente Combo"); pg.fill(f"#{p}Phone", "+1 809 555 1234")
def bar(pg): return pg.locator("#comboBar").inner_text()
def calc(pg): return pg.evaluate("JGT_COMBOAPI.calc(JGT_COMBOAPI.load())")
def traslado(pg, o, d, pax, r):
    pg.goto(ROOT + f"?r={r}", wait_until="load")
    pg.select_option("#origin", o); pg.select_option("#destination", d); pg.fill("#date", DATE); pg.fill("#time", "14:00")
    pg.select_option("#passengers", pax); pg.fill("#name", "Cliente Combo"); pg.fill("#phone", "+1 809 555 1234")
    pg.click("#submitBtn"); pg.wait_for_timeout(300); pg.click("#confirmBoxCombo"); pg.wait_for_timeout(300)
with sync_playwright() as p:
    br = p.chromium.launch()
    ctx = br.new_context(**p.devices["iPhone 13"], timezone_id="America/Santo_Domingo", locale="es-DO")
    pg = ctx.new_page(); pg.add_init_script("window.__JGT_CAPTURE__=function(u){window.__lastUrl=u;};"); pg.add_init_script(AUTOFILL)
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))

    pg.goto(ROOT, wait_until="load"); pg.evaluate("localStorage.clear()"); pg.reload(wait_until="load")
    check("Sin combo no se ve la barra", not pg.locator("#comboBar").is_visible())
    check("Tarjeta del combo con 5 precios", pg.locator(".combo-card .combo-levels li").count() == 5)

    # 1) Recogida SDQ → Boca Chica, 2 personas: US$25 (combo US$20)
    traslado(pg, "sdq", "boca", "2", 1)
    check("1 servicio: sin precios de combo", "1 servicio" in bar(pg) and "ahorras" not in bar(pg), bar(pg))
    pg.click("#comboOpen"); check("Pista: agrega 2 servicios más", "Agrega 2 servicios más" in pg.locator("#comboHint").inner_text()); pg.click("#comboClose")

    # 2) Saona 2 personas: US$180 (sin cambio)
    pg.goto(BASE + "?r=2#saona", wait_until="load")
    pg.select_option("#sPeople", "2"); datos(pg, "s"); pg.click("#sSubmitBtn"); pg.wait_for_timeout(300); pg.click("#sConfirmBoxCombo"); pg.wait_for_timeout(300)
    check("2 servicios: todavía sin precios de combo", "2 servicios" in bar(pg) and "ahorras" not in bar(pg), bar(pg))
    pg.click("#comboOpen"); check("Pista: agrega 1 servicio más", "Agrega 1 servicio más" in pg.locator("#comboHint").inner_text()); pg.click("#comboClose")

    # 3) Comatillo 2 personas, 1 four wheel: US$170 → combo US$162 (US$8 menos)
    pg.goto(BASE + "?r=3#buggies", wait_until="load")
    pg.select_option("#bPeople", "2"); datos(pg, "b"); pg.click("#bSubmitBtn"); pg.wait_for_timeout(300); pg.click("#bConfirmBoxCombo"); pg.wait_for_timeout(300)
    check("3 servicios: se activa el combo (recogida US$5 + Comatillo US$8) → ahorras US$13", "US$13" in bar(pg), bar(pg))

    # 4) Four Wheel Boca Chica 2 personas: US$70 → US$65
    pg.goto(BASE + "?r=4#fwboca", wait_until="load")
    pg.select_option("#fPeople", "2"); datos(pg, "f"); pg.click("#fSubmitBtn"); pg.wait_for_timeout(300); pg.click("#fConfirmBoxCombo"); pg.wait_for_timeout(300)
    check("4 servicios: +US$5 Boca Chica → ahorras US$18", "US$18" in bar(pg), bar(pg))

    # 5) Regreso Boca Chica → SDQ, 6 personas: US$45 → combo US$25 (15 + 2×5)
    traslado(pg, "boca", "sdq", "6", 5)
    check("5 servicios: regreso 6 personas US$45 → US$25 → ahorras US$38", "US$38" in bar(pg), bar(pg))

    # 6) City Tour: US$10 menos
    pg.goto(BASE + "?r=6#city", wait_until="load"); pg.locator("#stops .stop").first.click(); pg.select_option("#people", "2")
    city = int(re.search(r"US\$(\d+)", pg.locator("#quotePrice").inner_text()).group(1))
    pg.fill("#pickup", "Hotel Don Juan"); pg.fill("#date", DATE); pg.fill("#name", "Cliente Combo"); pg.fill("#phone", "+1 809 555 1234")
    pg.click("#submitBtn"); pg.wait_for_timeout(300); pg.click("#confirmBoxCombo"); pg.wait_for_timeout(300)
    check("6 servicios: City Tour −US$10 → ahorras US$48", "US$48" in bar(pg), bar(pg))

    r = calc(pg)
    check(f"Subtotal 25+180+170+70+45+{city}", r["sub"] == 490 + city, str(r["sub"]))
    check("Total = subtotal − US$48", r["total"] == 490 + city - 48, str(r["total"]))
    import math
    dep = math.ceil((490 + city - 48) / 2)
    check("El combo se reserva con el 50 % del total", r["dep"] == dep and r["rest"] == 490 + city - 48 - dep, f'{r["dep"]} / {r["rest"]}')

    pg.click("#comboOpen"); pg.wait_for_timeout(300)
    check("Ventana lista 6 servicios", pg.locator("#comboList li").count() == 6)
    check("Precio tachado en 5 servicios (Saona no)", pg.locator("#comboList s").count() == 5)
    check("Ventana muestra reserva del 50 % y pago al abordar", "Para reservar el combo (50 %)" in pg.locator("#comboSum").inner_text() and "Al abordar" in pg.locator("#comboSum").inner_text())
    check("Pista: precios de combo activados", "Precios de combo activados" in pg.locator("#comboHint").inner_text())
    check("Sin desbordes con la ventana abierta", not pg.evaluate("document.documentElement.scrollWidth > window.innerWidth"))
    pg.screenshot(path=f"{OUT}/combo-ventana.png")
    pg.click("#comboWa"); pg.wait_for_timeout(300)
    msg = urllib.parse.unquote((pg.evaluate("window.__lastUrl") or "").split("?text=", 1)[-1])
    for f in ["🎁 COMBO · 6 servicios", "Nombre: Cliente Combo", "1) Traslado: Aeropuerto de Santo Domingo (SDQ) → Boca Chica", "Precio: US$25 − US$5 combo = US$20",
              "2) Tour Isla Saona (todo incluido)", "Precio: US$180\n", "Precio: US$170 − US$8 combo = US$162", "Precio: US$70 − US$5 combo = US$65",
              "5) Traslado: Boca Chica (Hotel Prueba) → Aeropuerto de Santo Domingo (SDQ)", "Precio: US$45 − US$20 combo = US$25", "Descuento combo: −US$48",
              "Reserva del combo (50 %): US$", "Resto al abordar: US$"]:
        check(f"Mensaje contiene «{f.strip()}»", f in msg)
    check("El nombre aparece una sola vez", msg.count("Nombre:") == 1)
    pg.wait_for_timeout(800)
    check("Tras enviar, el combo se vacía", not pg.locator("#comboBar").is_visible())

    # Traslado que no es SDQ ↔ Boca Chica: precio normal
    traslado(pg, "boca", "colonial", "2", 7)
    pg.goto(BASE + "?r=8#saona", wait_until="load"); pg.select_option("#sPeople", "2"); datos(pg, "s"); pg.click("#sSubmitBtn"); pg.wait_for_timeout(300); pg.click("#sConfirmBoxCombo")
    check("Boca Chica → Zona Colonial + Saona: sin ahorro", calc(pg)["disc"] == 0, str(calc(pg)["disc"]))
    pg.click("#comboOpen"); pg.click("#comboClear"); pg.wait_for_timeout(200)
    check("Vaciar combo oculta la barra", not pg.locator("#comboBar").is_visible())

    check("Preguntas: pago al abordar y combo con 50 %", "al abordar el vehículo" in pg.locator(".faq").inner_text(include_hidden=True) if False else pg.evaluate("document.querySelector('.faq').textContent.includes('al abordar el vehículo') && document.querySelector('.faq').textContent.includes('los combos se reservan con el 50 %')"))
    check("Preguntas frecuentes en tours (6)", pg.locator(".faq details").count() == 6)
    check("Aviso del combo en el selector", "Arma tu combo" in pg.locator(".chooser").inner_text())
    check("Sin errores de JavaScript", not errs, "; ".join(errs))

    pg.goto(ROOT + "?lang=en", wait_until="load")
    t = pg.locator(".faq").inner_text() + pg.locator(".combo-card").inner_text()
    check("EN: preguntas y combo traducidos", "Frequently asked questions" in t and "Build your combo" in t and "¿" not in t and " menos" not in t and "persona adicional" not in t, t[:200])
    pg.goto(BASE + "?lang=en#saona", wait_until="load"); pg.select_option("#sPeople", "2"); datos(pg, "s"); pg.click("#sSubmitBtn"); pg.wait_for_timeout(300)
    check("EN: botón del combo en inglés", "Add to my combo" in pg.locator("#sConfirmBoxCombo").inner_text())
    pg.click("#sConfirmBoxCombo"); pg.wait_for_timeout(200)
    check("EN: barra en inglés", "Your combo: 1 service" in bar(pg), bar(pg))
    check("Sin errores de JavaScript (EN)", not errs, "; ".join(errs))
    br.close()
print(f"\nRESULTADO: {sum(res)}/{len(res)} pruebas superadas"); sys.exit(0 if all(res) else 1)
