"""Pruebas funcionales del formulario con clientes ficticios.
Uso: python3 -I test_form.py <URL> <carpeta_capturas>
No envía nada a WhatsApp: captura el enlace generado en lugar de abrirlo."""
import sys, urllib.parse, json
from playwright.sync_api import sync_playwright

URL = sys.argv[1]
OUT = sys.argv[2]
DATE = "2026-10-23"
results = []

def check(name, cond, detail=""):
    results.append((name, bool(cond), detail))
    print(("PASA " if cond else "FALLA") + " | " + name + (" | " + detail if detail else ""))

CAPTURE = "window.__JGT_CAPTURE__ = function(u){ window.__lastUrl = u; };"

def new_page(browser, device=None):
    ctx = browser.new_context(**(device or {"viewport": {"width": 390, "height": 844}}),
                              timezone_id="America/Santo_Domingo", locale="es-DO")
    pg = ctx.new_page()
    pg.add_init_script(CAPTURE)
    errors = []
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.goto(URL, wait_until="networkidle")
    return pg, errors

def price(pg): return pg.locator("#quotePrice").inner_text().strip()
def label(pg): return pg.locator("#quoteLabel").inner_text().strip()

def fill_client(pg, pax="2"):
    pg.select_option("#passengers", pax)
    pg.fill("#name", "Cliente de Prueba")
    pg.fill("#phone", "+1 809 555 1234")

def submit(pg, shot=None):
    pg.evaluate("window.__lastUrl = null")
    if pg.locator("#confirmBox").is_visible(): pg.click("#editBtn")
    pg.click("#submitBtn")
    pg.wait_for_timeout(300)
    if not pg.locator("#confirmBox").is_visible(): return None
    if shot: pg.screenshot(path=shot)
    pg.click("#waLink")
    pg.wait_for_timeout(600)
    return pg.evaluate("window.__lastUrl")

def modal_price(pg): return pg.locator("#cPrice").text_content().strip()

def decode(u): return urllib.parse.unquote(u.split("?text=", 1)[1]) if u else ""

with sync_playwright() as p:
    br = p.chromium.launch()

    # --- Menús cargados ---
    pg, errs = new_page(br)
    n_o = pg.locator("#origin option").count()
    n_d = pg.locator("#destination option").count()
    check("Menús de origen/destino con opciones", n_o == 12 and n_d == 12, f"origen={n_o} destino={n_d}")
    check("Opción 'Otra ubicación — escribir dirección' presente",
          pg.locator("#origin option", has_text="Otra ubicación — escribir dirección").count() == 1)
    check("Selector de pasajeros con opciones", pg.locator("#passengers option").count() == 17)

    # --- Caso A ---
    pg.select_option("#origin", "sdq"); pg.select_option("#destination", "boca")
    pg.fill("#date", DATE); pg.fill("#time", "10:00"); fill_client(pg, "2")
    check("Caso A: solo ida SDQ→Boca Chica = US$25", price(pg) == "US$25.00", price(pg))
    u = submit(pg); msg = decode(u)
    check("Caso G: enlace a wa.me/18298182426", bool(u) and u.startswith("https://wa.me/18298182426?text="), (u or "")[:45])
    for frag in ["Nombre: Cliente de Prueba", "WhatsApp: +1 809 555 1234", "Origen: Aeropuerto Las Américas (SDQ)",
                 "Destino: Boca Chica", "Fecha: 23/10/2026", "Hora: 10:00 a. m.", "Pasajeros: 2",
                 "Servicio: Solo ida", "Maletas grandes: 0", "Equipaje de mano: 0"]:
        check(f"Caso G: mensaje contiene «{frag}»", frag in msg)
    check("Mensaje corto: empieza en 'Nombre:' y sin tarifa/textos extra",
          msg.startswith("Nombre:") and "Tarifa" not in msg and "Hola" not in msg and "Entiendo" not in msg, msg.replace(chr(10)," | "))
    check("Ventana previa muestra el precio US$25.00 antes de WhatsApp", modal_price(pg) == "US$25.00", modal_price(pg))
    check("Ventana indica continuar por WhatsApp, sin confirmación falsa",
          "continúa por WhatsApp" in pg.locator("#confirmBox").text_content() and "confirmada" not in pg.locator("#confirmBox").text_content())
    check("La ventana se cierra sola tras pulsar WhatsApp", not pg.locator("#confirmBox").is_visible())
    pg.screenshot(path=f"{OUT}/movil-caso-A.png", full_page=True)

    # --- Caso D (intercambiar) ---
    pg.click("#swap")
    check("Caso D: botón intercambiar invierte la ruta",
          pg.input_value("#origin") == "boca" and pg.input_value("#destination") == "sdq")
    check("Caso D: Boca Chica→SDQ = US$25", price(pg) == "US$25.00", price(pg))
    pg.select_option("#origin", "juan"); pg.select_option("#destination", "boca")
    check("Ruta invertida Juan Dolio→Boca Chica = US$30", price(pg) == "US$30.00", price(pg))
    pg.select_option("#origin", "colonial"); pg.select_option("#destination", "punta")
    check("Ruta sin tarifa (Zona Colonial→Punta Cana) = A cotizar", price(pg) == "A cotizar", price(pg))

    # --- Caso B ---
    pg.select_option("#origin", "sdq"); pg.select_option("#destination", "boca")
    pg.click(".toggle label:has(input[value=round]) span")
    pg.fill("#returnDate", DATE); pg.fill("#returnTime", "13:30")
    check("Caso B: ida y vuelta mismo día, 3,5 h = US$39", price(pg) == "US$39.00", price(pg))
    msg = decode(submit(pg))
    check("Caso B: mensaje con regreso; ventana muestra US$39", "Regreso: 23/10/2026 a las 1:30 p. m." in msg and modal_price(pg) == "US$39.00", modal_price(pg))

    # --- Caso E ---
    pg.fill("#returnTime", "15:30")
    check("Caso E: espera > 4 h → A cotizar (sin descuento)", price(pg) == "A cotizar" and "4 horas" in pg.locator("#quoteNote").inner_text(), price(pg))
    pg.fill("#returnDate", "2026-10-24"); pg.fill("#returnTime", "11:00")
    check("Caso E: regreso otro día → A cotizar (sin descuento)", price(pg) == "A cotizar" and "otro día" in pg.locator("#quoteNote").inner_text(), price(pg))
    msg = decode(submit(pg))
    check("Caso E: ventana muestra 'A cotizar' con motivo", modal_price(pg) == "A cotizar" and "otro día" in pg.locator("#cNote").text_content())
    pg.click(".toggle label:has(input[value=one]) span")

    # --- Caso C ---
    pg.select_option("#destination", "__otro__")
    check("Caso C: aparece campo para escribir destino", pg.locator("#destinationOther").is_visible())
    pg.fill("#destinationOther", "Hotel Nuevo, Miches")
    check("Caso C: destino personalizado = A cotizar", price(pg) == "A cotizar", price(pg))
    msg = decode(submit(pg))
    check("Caso C: mensaje conserva «Hotel Nuevo, Miches»; ventana 'A cotizar'", "Destino: Hotel Nuevo, Miches" in msg and modal_price(pg) == "A cotizar")
    pg.select_option("#origin", "__otro__"); pg.fill("#originOther", "Villa Particular, Bávaro")
    msg = decode(submit(pg))
    check("Origen y destino personalizados a la vez", "Origen: Villa Particular, Bávaro" in msg and "Destino: Hotel Nuevo, Miches" in msg)

    # Grupo grande
    pg.select_option("#origin", "sdq"); pg.select_option("#destination", "boca"); pg.select_option("#passengers", "8")
    check("Grupo de 8 pasajeros → A cotizar (sin inventar suplementos)", price(pg) == "A cotizar", price(pg))
    check("Sin errores de JavaScript", not errs, "; ".join(errs))

    # --- Caso F: validaciones ---
    pg, errs = new_page(br)
    pg.click("#submitBtn"); pg.wait_for_timeout(300)
    check("Caso F: formulario vacío no se envía", pg.evaluate("window.__lastUrl") is None)
    n_err = pg.locator(".err:not(:empty)").count()
    check("Caso F: se marcan campos obligatorios vacíos", n_err >= 5, f"{n_err} mensajes")
    pg.screenshot(path=f"{OUT}/movil-validaciones.png", full_page=True)

    pg.select_option("#origin", "sdq"); pg.select_option("#destination", "boca")
    pg.fill("#date", "2026-10-01"); pg.fill("#time", "10:00"); fill_client(pg)
    check("Caso F: fecha pasada bloqueada", submit(pg) is None and "anterior a hoy" in pg.locator('.err[data-for=date]').inner_text())
    pg.fill("#date", DATE)
    pg.select_option("#destination", "sdq")
    check("Caso F: destino igual al origen bloqueado", submit(pg) is None and "igual al origen" in pg.locator('.err[data-for=destination]').inner_text())
    pg.select_option("#destination", "boca")
    pg.evaluate("document.getElementById('passengers').add(new Option('0','0')); document.getElementById('passengers').value='0'")
    check("Caso F: número de pasajeros inválido bloqueado", submit(pg) is None and pg.locator('.err[data-for=passengers]').inner_text() != "")
    pg.select_option("#passengers", "2")
    pg.fill("#phone", "809 555")
    check("Caso F: WhatsApp incompleto bloqueado", submit(pg) is None and "incompleto" in pg.locator('.err[data-for=phone]').inner_text())
    pg.fill("#phone", "+1 809 555 1234")
    pg.select_option("#destination", "__otro__")
    check("Caso F: destino personalizado vacío bloqueado", submit(pg) is None and "Escribe" in pg.locator('.err[data-for=destination]').inner_text())
    pg.fill("#destinationOther", "Hotel Nuevo, Miches")
    pg.click(".toggle label:has(input[value=round]) span")
    pg.fill("#returnDate", DATE); pg.fill("#returnTime", "08:00")
    check("Caso F: regreso antes de la salida bloqueado", submit(pg) is None and "posterior" in pg.locator('.err[data-for=returnTime]').inner_text())
    pg.fill("#returnTime", "12:00")
    check("Caso F: con todo corregido sí se envía", submit(pg) is not None)
    check("Caso F: sin errores de JavaScript", not errs, "; ".join(errs))

    # --- Caso H: dispositivos ---
    for name in ["iPhone 13", "Pixel 7", "Desktop Chrome"]:
        dev = dict(p.devices[name])
        if name.startswith("Desktop"): dev["viewport"] = {"width": 1280, "height": 900}
        pg, errs = new_page(br, dev)
        pg.select_option("#origin", "sdq"); pg.select_option("#destination", "punta")
        pg.fill("#date", DATE); pg.fill("#time", "09:15"); fill_client(pg, "3")
        ok_price = price(pg) == "US$150.00"
        overflow = pg.evaluate("document.documentElement.scrollWidth > window.innerWidth")
        u = submit(pg, f"{OUT}/ventana-{name.replace(' ', '-')}.png")
        check(f"Caso H ({name}): selectores, precio US$150, botón y sin desbordes", ok_price and u and not overflow and not errs,
              f"precio={price(pg)} desborde={overflow}")
        pg.screenshot(path=f"{OUT}/{name.replace(' ', '-')}.png", full_page=True)
    br.close()

passed = sum(1 for r in results if r[1])
print(f"\nRESULTADO: {passed}/{len(results)} pruebas superadas")
json.dump(results, open(f"{OUT}/resultados.json", "w"), ensure_ascii=False, indent=1)
sys.exit(0 if passed == len(results) else 1)
