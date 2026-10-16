"""Pruebas del City Tour. Uso: python3 -I test_tours.py <URL_BASE> <carpeta_capturas>
No envía nada a WhatsApp: captura el enlace generado."""
import sys, urllib.parse
from playwright.sync_api import sync_playwright

BASE = sys.argv[1].rstrip("/") + "/tours/"
OUT = sys.argv[2]
DATE = "2026-10-23"
results = []
def check(name, cond, detail=""):
    results.append((name, bool(cond)))
    print(("PASA " if cond else "FALLA") + " | " + name + (" | " + detail if detail else ""))

with sync_playwright() as p:
    br = p.chromium.launch()
    def page(device=None):
        ctx = br.new_context(**(device or {"viewport": {"width": 390, "height": 844}}), timezone_id="America/Santo_Domingo", locale="es-DO")
        pg = ctx.new_page()
        pg.add_init_script("window.__JGT_CAPTURE__=function(u){window.__lastUrl=u;};")
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(BASE, wait_until="load")
        return pg, errs
    def price(pg): return pg.locator("#quotePrice").inner_text().strip()
    def toggle(pg, sid): pg.click(f'.stop[data-id="{sid}"] h3')
    def is_on(pg, sid): return "on" in pg.get_attribute(f'.stop[data-id="{sid}"]', "class")

    pg, errs = page()
    check("Menú muestra 7 paradas", pg.locator(".stop").count() == 7)
    check("Por defecto: todas marcadas salvo plaza comercial",
          all(is_on(pg, s) for s in ["tresojos", "faro", "colonial", "palacio", "malecon", "comida"]) and not is_on(pg, "plaza"))
    pg.select_option("#people", "2")
    check("2 personas, todo incluido (Faro con entrada) = US$186", price(pg) == "US$186", price(pg))
    pg.click('.stop[data-id="faro"] .opts label:nth-child(2)')
    check("Faro solo foto (gratis) = US$179", price(pg) == "US$179", price(pg))
    check("Elegir opción del Faro no lo desmarca", is_on(pg, "faro"))
    pg.click('.stop[data-id="faro"] .opts label:nth-child(1)')
    toggle(pg, "plaza")
    check("Añadir plaza comercial (transporte US$110) = US$230", price(pg) == "US$230", price(pg))
    toggle(pg, "plaza")
    toggle(pg, "tresojos")
    check("Quitar Los Tres Ojos = US$176", price(pg) == "US$176", price(pg))
    check("Tarjeta desmarcada se ve desactivada", not is_on(pg, "tresojos"))
    toggle(pg, "tresojos")
    pg.select_option("#people", "6")
    check("6 personas (2 adicionales × US$10 en transporte) = US$338", price(pg) == "US$338", price(pg))
    for s in ["tresojos", "faro", "colonial", "comida"]: toggle(pg, s)
    pg.select_option("#people", "2")
    check("Solo paradas gratis (Palacio + Malecón) = transporte + 10 % = US$77", price(pg) == "US$77", price(pg))
    for s in ["palacio", "malecon"]: toggle(pg, s)
    check("Sin paradas: no hay precio", price(pg) == "—")
    for s in ["tresojos", "faro", "colonial", "palacio", "malecon", "comida"]: toggle(pg, s)
    check("Costo visible en tarjeta: Tres Ojos +US$5.41 por persona",
          "+US$5.41 por persona" in pg.locator('.stop[data-id="tresojos"] .cost').inner_text(), pg.locator('.stop[data-id="tresojos"] .cost').inner_text())
    check("Costo visible en tarjeta: Zona Colonial guía +US$44 por grupo",
          "+US$44 por grupo" in pg.locator('.stop[data-id="colonial"] .cost').inner_text())
    pg.select_option("#people", "16+")
    check("Más de 15 personas = A cotizar", price(pg) == "A cotizar")
    pg.select_option("#people", "2")
    pg.select_option("#pickupZone", "otra")
    check("Recogida fuera de Boca Chica = A cotizar", price(pg) == "A cotizar")
    pg.select_option("#pickupZone", "boca")

    # Validaciones
    pg.click("#submitBtn"); pg.wait_for_timeout(300)
    check("Formulario incompleto no abre la ventana", not pg.locator("#confirmBox").is_visible())
    check("Se marcan errores (recogida, fecha, nombre, WhatsApp)", pg.locator(".err:not(:empty)").count() >= 4, str(pg.locator(".err:not(:empty)").count()))
    pg.fill("#pickup", "Hotel Don Juan"); pg.fill("#date", "2026-10-01")
    pg.fill("#name", "Cliente de Prueba"); pg.fill("#phone", "+1 809 555 1234")
    pg.click("#submitBtn"); pg.wait_for_timeout(300)
    check("Fecha pasada bloqueada", not pg.locator("#confirmBox").is_visible())
    pg.fill("#date", DATE)
    pg.click("#submitBtn"); pg.wait_for_timeout(300)
    check("Ventana muestra el precio US$186 antes de WhatsApp", pg.locator("#confirmBox").is_visible() and pg.locator("#cPrice").inner_text() == "US$186")
    pg.screenshot(path=f"{OUT}/tour-ventana.png")
    pg.click("#waLink"); pg.wait_for_timeout(600)
    u = pg.evaluate("window.__lastUrl") or ""
    msg = urllib.parse.unquote(u.split("?text=", 1)[-1])
    check("Enlace a wa.me/18298182426", u.startswith("https://wa.me/18298182426?text="))
    for frag in ["Nombre: Cliente de Prueba", "WhatsApp: +1 809 555 1234", "Tour: City Tour Santo Domingo",
                 "Recogida: Hotel Don Juan (Boca Chica)", "Fecha: 23/10/2026", "Hora: 8:00 a. m.", "Personas: 2",
                 "• Parque Nacional Los Tres Ojos", "• Faro a Colón (Con entrada al interior)", "• Zona Colonial con guía autorizado",
                 "Precio estimado: US$186"]:
        check(f"Mensaje contiene «{frag}»", frag in msg)
    check("Plaza comercial no aparece si no se eligió", "Plaza comercial" not in msg)
    check("Sin errores de JavaScript", not errs, "; ".join(errs))

    for name in ["iPhone 13", "Pixel 7"]:
        pg, errs = page(dict(p.devices[name]))
        overflow = pg.evaluate("document.documentElement.scrollWidth > window.innerWidth")
        toggle(pg, "plaza"); ok = is_on(pg, "plaza")
        check(f"{name}: tarjetas tocables y sin desbordes", ok and not overflow and not errs)
        pg.screenshot(path=f"{OUT}/tour-{name.replace(' ', '-')}.png", full_page=True)
    br.close()

ok = sum(r[1] for r in results)
print(f"\nRESULTADO: {ok}/{len(results)} pruebas superadas")
sys.exit(0 if ok == len(results) else 1)
