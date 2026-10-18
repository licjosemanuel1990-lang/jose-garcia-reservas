"""20 reservas de clientes ficticios: traslados, tours y combos.
Calcula cada precio por su cuenta y lo compara con lo que muestra la página.
Uso: python3 -I test_20_reservas.py <URL_BASE> <carpeta>"""
import sys, re, math, json, urllib.parse
from playwright.sync_api import sync_playwright
AUTOFILL = """document.addEventListener('submit', function (e) {
  if (e.target.id !== 'booking' || window.__noAutofill) return;
  ['originPlace', 'destinationPlace', 'flight'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el && el.offsetParent !== null && !el.value) el.value = id === 'flight' ? 'AA1234' : 'Hotel Prueba';
  });
}, true);"""
ROOT = sys.argv[1].rstrip("/") + "/"; BASE = ROOT + "tours/"; OUT = sys.argv[2]
rows = []

def num(t):
    m = re.search(r"US\$([\d.,]+)", t or ""); return float(m.group(1).replace(",", "")) if m else None
LAST = {"url": ""}
def wa(pg):
    LAST["url"] = pg.evaluate("window.__lastUrl") or ""
    return urllib.parse.unquote(LAST["url"].split("?text=", 1)[-1])
def add(n, cliente, servicio, esperado, mostrado, msg_ok, nota=""):
    ok = (esperado == mostrado) and msg_ok
    rows.append(dict(n=n, cliente=cliente, servicio=servicio, esperado=esperado, mostrado=mostrado, msg=msg_ok, ok=ok, nota=nota, url=LAST["url"]))
    LAST["url"] = ""
    print(("PASA " if ok else "FALLA") + f" | {n:>2}. {cliente} · {servicio} | esperado {esperado} · página {mostrado} · mensaje {'ok' if msg_ok else 'MAL'} {nota}")

def traslado(pg, o, d, pax, fecha, hora, nombre, tel, rt=None, otro=None, combo=False, lang=""):
    pg.goto(ROOT + "?r=" + nombre.replace(" ", "") + lang, wait_until="load")
    pg.select_option("#origin", o)
    if otro: pg.select_option("#destination", pg.evaluate("JGT.OTHER")); pg.fill("#destinationOther", otro)
    else: pg.select_option("#destination", d)
    if rt: pg.check('input[name="trip"][value="round"]')
    pg.fill("#date", fecha); pg.fill("#time", hora)
    if rt: pg.fill("#returnDate", rt[0]); pg.fill("#returnTime", rt[1])
    pg.select_option("#passengers", pax); pg.fill("#name", nombre); pg.fill("#phone", tel)
    pg.click("#submitBtn"); pg.wait_for_timeout(250)
    shown = pg.locator("#cPrice").inner_text()
    if combo: pg.click("#confirmBoxCombo"); pg.wait_for_timeout(250); return shown, ""
    pg.click("#waLink"); pg.wait_for_timeout(300); return shown, wa(pg)

def datos(pg, p, fecha, nombre, tel, zona="boca"):
    pg.fill(f"#{p}Date", fecha); pg.select_option(f"#{p}PickupZone", zona)
    pg.fill(f"#{p}Pickup", "Hotel Don Juan" if zona == "boca" else "Hotel en Bávaro")
    pg.fill(f"#{p}Name", nombre); pg.fill(f"#{p}Phone", tel)

def simple(pg, tab, p, setup, fecha, nombre, tel, zona="boca", combo=False, lang=""):
    pg.goto(BASE + f"?r={nombre.replace(' ', '')}{tab}{lang}#{tab}", wait_until="load")
    setup(pg); datos(pg, p, fecha, nombre, tel, zona)
    pg.click(f"#{p}SubmitBtn"); pg.wait_for_timeout(250)
    if not pg.locator(f"#{p}ConfirmBox").is_visible():
        errs = [e.inner_text() for e in pg.locator(f"#{tab}Tour .err, #{p}Form .err").all() if e.inner_text().strip()] if False else \
               [t for t in pg.locator(".err").all_inner_texts() if t.strip()]
        return None, "BLOQUEADO: " + " / ".join(errs)
    shown = pg.locator(f"#{p}CPrice").inner_text()
    if combo: pg.click(f"#{p}ConfirmBoxCombo"); pg.wait_for_timeout(250); return shown, ""
    pg.click(f"#{p}WaLink"); pg.wait_for_timeout(300); return shown, wa(pg)

def city(pg, personas, fecha, nombre, tel, combo=False):
    pg.goto(BASE + f"?r={nombre.replace(' ', '')}#city", wait_until="load")
    pg.locator('#stops .stop[data-id="tresojos"]').click(); pg.select_option("#people", personas)
    pg.fill("#pickup", "Hotel Don Juan"); pg.fill("#date", fecha); pg.fill("#time", "09:00")
    pg.fill("#name", nombre); pg.fill("#phone", tel)
    pg.click("#submitBtn"); pg.wait_for_timeout(250)
    shown = pg.locator("#cPrice").inner_text()
    if combo: pg.click("#confirmBoxCombo"); pg.wait_for_timeout(250); return shown, ""
    pg.click("#waLink"); pg.wait_for_timeout(300); return shown, wa(pg)

def city_price(n):  # transporte 70 (+10 desde la 5.ª persona) + Tres Ojos RD$300 c/u ÷ 61, +10 %
    return math.ceil((70 + max(0, n - 4) * 10 + 300 * n / 61) * 1.10)
def comatillo(fw, plan_usd, s300=False, comida=0, combo=False):
    rd = fw * (300 if s300 else 0) + 375 * comida
    return math.ceil(100 + fw * plan_usd + rd / 62) - (8 * fw if combo else 0)

def combo_open(pg):
    pg.click("#comboOpen"); pg.wait_for_timeout(250)
    r = pg.evaluate("JGT_COMBOAPI.calc(JGT_COMBOAPI.load())")
    pg.click("#comboWa"); pg.wait_for_timeout(300); m = wa(pg); pg.wait_for_timeout(700)
    return r, m

with sync_playwright() as p:
    br = p.chromium.launch()
    ctx = br.new_context(**p.devices["iPhone 13"], timezone_id="America/Santo_Domingo", locale="es-DO")
    pg = ctx.new_page(); pg.add_init_script("window.__JGT_CAPTURE__=function(u){window.__lastUrl=u;};"); pg.add_init_script(AUTOFILL)
    jserr = []; pg.on("pageerror", lambda e: jserr.append(str(e)))
    pg.goto(ROOT, wait_until="load"); pg.evaluate("localStorage.clear()")

    # ---------- Traslados ----------
    s, m = traslado(pg, "sdq", "boca", "2", "2026-10-25", "15:30", "Laura Méndez", "+1 809 555 0101")
    add(1, "Laura Méndez", "Traslado SDQ → Boca Chica, 2 pers.", 25, num(s), "Origen: Aeropuerto de Santo Domingo (SDQ)" in m and "Pasajeros: 2" in m)
    s, m = traslado(pg, "sdq", "punta", "3", "2026-10-26", "11:00", "John Carter", "+1 305 555 0102")
    add(2, "John Carter", "Traslado SDQ → Punta Cana, 3 pers.", 150, num(s), "Destino: Punta Cana" in m)
    s, m = traslado(pg, "boca", "sdq", "6", "2026-10-27", "06:00", "Familia Rosario", "+1 829 555 0103")
    add(3, "Familia Rosario", "Traslado Boca Chica → SDQ, 6 pers.", 45, num(s), "Pasajeros: 6" in m, "(25 + 2 × 10)")
    s, m = traslado(pg, "sdq", "colonial", "2", "2026-10-28", "09:00", "Ana Gómez", "+1 809 555 0104", rt=("2026-10-28", "12:00"))
    add(4, "Ana Gómez", "SDQ ↔ Zona Colonial, ida y vuelta mismo día", 62.4, num(s), "Servicio: Ida y vuelta" in m, "(40 × 2 × 0.78)")
    s, m = traslado(pg, "boca", "juan", "4", "2026-10-29", "10:00", "Pedro Núñez", "+1 849 555 0105", rt=("2026-10-31", "16:00"))
    add(5, "Pedro Núñez", "Boca Chica ↔ Juan Dolio, regreso otro día", 60, num(s), "Regreso: 31/10/2026" in m, "(dos trayectos a tarifa normal)")
    s, m = traslado(pg, "boca", None, "2", "2026-10-30", "08:00", "Carla Díaz", "+1 809 555 0106", otro="Hotel en Samaná")
    add(6, "Carla Díaz", "Boca Chica → Samaná (lugar escrito)", "A cotizar", "A cotizar" if "cotizar" in s else num(s), "Destino: Hotel en Samaná" in m)

    # ---------- City Tour ----------
    s, m = city(pg, "2", "2026-11-02", "Miguel Torres", "+1 809 555 0107")
    add(7, "Miguel Torres", "City Tour (Tres Ojos), 2 pers.", city_price(2), num(s), "Tour: City Tour Santo Domingo" in m and "Parque Nacional Los Tres Ojos" in m)
    s, m = city(pg, "6", "2026-11-03", "Grupo Amigos", "+1 809 555 0108")
    add(8, "Grupo Amigos", "City Tour (Tres Ojos), 6 pers.", city_price(6), num(s), "Personas: 6" in m)

    # ---------- Isla Saona ----------
    s, m = simple(pg, "saona", "s", lambda pg: pg.select_option("#sPeople", "1"), "2026-11-04", "Sofía Reyes", "+1 809 555 0109")
    add(9, "Sofía Reyes", "Isla Saona, 1 pers.", 140, num(s), "Excursión: Tour Isla Saona (todo incluido)" in m and "Reserva (" not in m)
    s, m = simple(pg, "saona", "s", lambda pg: pg.select_option("#sPeople", "8"), "2026-11-05", "Familia Pérez", "+1 809 555 0110")
    add(10, "Familia Pérez", "Isla Saona, 8 pers.", 420, num(s), "Personas: 8" in m, "(100 + 8 × 40 = US$52.50 c/u)")
    s, m = simple(pg, "saona", "s", lambda pg: pg.select_option("#sPeople", "2"), "2026-11-06", "Luis Batista", "+1 809 555 0111", zona="otra")
    add(11, "Luis Batista", "Isla Saona desde otra zona", "A cotizar", "A cotizar" if s and "cotizar" in s else num(s), "Precio estimado: A cotizar" in m)

    # ---------- Four Wheel Comatillo ----------
    def b(plan, ppl, fw, size="std", food="no"):
        def f(pg):
            pg.select_option("#bPlan", plan); pg.select_option("#bPeople", ppl); pg.select_option("#bCount", fw)
            pg.select_option("#bSize", size); pg.select_option("#bFood", food); pg.select_option("#bShift", "manana")
        return f
    s, m = simple(pg, "buggies", "b", b("basico", "2", "1"), "2026-11-07", "Jorge Castillo", "+1 809 555 0112")
    add(12, "Jorge Castillo", "Comatillo Básico, 2 pers., 1 four wheel", 170, num(s), "Reserva (50 %): US$85" in m)
    exp = comatillo(2, 80, s300=True, comida=4)
    s, m = simple(pg, "buggies", "b", b("plus", "4", "2", "300", "si"), "2026-11-08", "Valeria Cruz", "+1 809 555 0113")
    add(13, "Valeria Cruz", "Comatillo Plus, 4 pers., 2 four wheels 300cc + comida", exp, num(s), f"Reserva (50 %): US${math.ceil(exp/2)}" in m and "Comida: Sí" in m)
    exp = comatillo(5, (4050 + 1000) / 62)
    s, m = simple(pg, "buggies", "b", b("premium", "10", "5"), "2026-11-09", "Empresa Caribe", "+1 809 555 0114")
    add(14, "Empresa Caribe", "Comatillo Premium, 10 pers., 5 four wheels", exp, num(s), f"Reserva (50 %): US${math.ceil(exp/2)}" in m)
    s, m = simple(pg, "buggies", "b", b("premium", "6", "3"), "2026-11-10", "Diego Martínez", "+1 809 555 0115")
    add(15, "Diego Martínez", "Comatillo Premium con solo 6 pers.", "Bloqueado", "Bloqueado" if s is None and "mínimo 10" in m else s, True, "(Premium pide mínimo 10)")

    # ---------- Four Wheel Boca Chica ----------
    def f(ppl, fw):
        def g(pg): pg.select_option("#fPeople", ppl); pg.select_option("#fCount", fw); pg.select_option("#fShift", "tarde")
        return g
    s, m = simple(pg, "fwboca", "f", f("3", "2"), "2026-11-11", "Paola Herrera", "+1 809 555 0116")
    add(16, "Paola Herrera", "Four Wheel Boca Chica, 3 pers., 2 four wheels", 140, num(s), "Four wheels: 2" in m and "Horario: Tarde" in m)
    s, m = simple(pg, "fwboca", "f", f("5", "2"), "2026-11-12", "Ramón Vargas", "+1 809 555 0117")
    add(17, "Ramón Vargas", "Four Wheel Boca Chica, 5 pers. en 2 four wheels", "Bloqueado", "Bloqueado" if s is None and "al menos 3" in m else s, True, "(máx. 2 por four wheel)")

    # ---------- Combos ----------
    pg.goto(ROOT, wait_until="load"); pg.evaluate("localStorage.clear()")
    traslado(pg, "sdq", "boca", "2", "2026-11-13", "14:00", "Isabel Soto", "+1 809 555 0118", combo=True)
    simple(pg, "saona", "s", lambda pg: pg.select_option("#sPeople", "2"), "2026-11-14", "Isabel Soto", "+1 809 555 0118", combo=True)
    r, m = combo_open(pg)
    add(18, "Isabel Soto", "Combo de 2: recogida + Saona (aún sin precio de combo)", 205, r["total"], "COMBO · 2 servicios" in m and "Descuento combo" not in m and "Reserva del combo" not in m)

    traslado(pg, "sdq", "boca", "2", "2026-11-15", "13:00", "Andrés Peña", "+1 809 555 0119", combo=True)
    city(pg, "2", "2026-11-16", "Andrés Peña", "+1 809 555 0119", combo=True)
    traslado(pg, "boca", "sdq", "2", "2026-11-18", "07:00", "Andrés Peña", "+1 809 555 0119", combo=True)
    r, m = combo_open(pg)
    exp = 20 + (city_price(2) - 10) + 15
    add(19, "Andrés Peña", "Combo de 3: recogida + City Tour + regreso", exp, r["total"],
        f"Total estimado: US${exp}" in m and f"Reserva del combo (50 %): US${math.ceil(exp/2)}" in m, f"(normal US${25 + city_price(2) + 25})")

    L = "&lang=en"
    traslado(pg, "sdq", "boca", "5", "2026-11-20", "16:00", "Emily Johnson", "+1 212 555 0120", combo=True, lang=L)
    simple(pg, "buggies", "b", b("basico", "2", "1"), "2026-11-21", "Emily Johnson", "+1 212 555 0120", combo=True, lang=L)
    simple(pg, "fwboca", "f", f("2", "1"), "2026-11-22", "Emily Johnson", "+1 212 555 0120", combo=True, lang=L)
    simple(pg, "saona", "s", lambda pg: pg.select_option("#sPeople", "2"), "2026-11-23", "Emily Johnson", "+1 212 555 0120", combo=True, lang=L)
    traslado(pg, "boca", "sdq", "5", "2026-11-25", "08:00", "Emily Johnson", "+1 212 555 0120", combo=True, lang=L)
    r, m = combo_open(pg)
    exp = 25 + comatillo(1, 70, combo=True) + 65 + 180 + 20
    add(20, "Emily Johnson (inglés)", "Combo de 5: recogida + Comatillo + Boca Chica + Saona + regreso", exp, r["total"],
        "COMBO · 5 servicios" in m and "Idioma del cliente: inglés" in m and f"Reserva del combo (50 %): US${math.ceil(exp/2)}" in m, f"(normal US${35 + 170 + 70 + 180 + 35})")
    pg.screenshot(path=f"{OUT}/reserva20.png")
    br.close()

ok = sum(r["ok"] for r in rows)
print(f"\nRESULTADO: {ok}/{len(rows)} reservas correctas · errores de JavaScript: {len(jserr)}")
json.dump(rows, open(f"{OUT}/reservas.json", "w"), ensure_ascii=False, indent=1)
sys.exit(0 if ok == len(rows) and not jserr else 1)
