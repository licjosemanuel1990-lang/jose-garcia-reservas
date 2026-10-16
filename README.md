# José García Transporte — Sistema de reservas

Formulario de reservas para clientes. El cliente elige su traslado, ve la tarifa y envía la solicitud por WhatsApp a **+1 829-818-2426**. El formulario **no confirma reservas**: la confirmación la da José Manuel García por WhatsApp.

- **Página pública:** https://jose-garcia-reservas.vercel.app/
- **Alojamiento:** Vercel (cuenta del propietario, proyecto `jose-garcia-reservas`)
- **QR:** `assets/qr-reservas.png` (solo QR) y `assets/qr-reservas-tarjeta.png` (con marca, para imprimir)

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura del formulario |
| `styles.css` | Diseño (azul marino, dorado, blanco; adaptado a móvil) |
| `routes.js` | **Destinos y tarifas — el único archivo que se edita para cambiar precios** |
| `app.js` | Cálculo de tarifas, validaciones y mensaje de WhatsApp |
| `assets/` | Logo, icono y códigos QR |
| `tests/test_form.py` | Pruebas automáticas con clientes ficticios |

## City Tour

- **Página:** https://jose-garcia-reservas.vercel.app/tours/ (City Tour, Tour Isla Saona y Tour de Buggies en el mismo enlace; precios en `tours/saona-config.js` y `tours/buggies-config.js`; Four Wheel: precio por four wheel (1 o 2 personas), se reserva con 30 % y el resto al abordar)
- **Precios y paradas:** `tours/tour-config.js` (costos sin margen; la página suma el 10 %).
- Los precios por parada NO se muestran al cliente; solo el total.
- Cálculo: (transporte US$70, o US$110 con Sambil; +US$10 por persona desde la quinta) + guía turístico certificado US$40 si lo elige + Alcázar, Fortaleza Ozama y Catedral RD$200 c/u por persona (los RD$600 repartidos) + entradas y comida en pesos × personas ÷ tasa de cambio → +10 % → redondeado hacia arriba.
- Tasa de cambio en `tasaCambio` (61 RD$ por US$).

## Cómo añadir un destino nuevo

Abrir `routes.js` y hacer dos cosas:

1. Añadir el lugar en `lugares`:
   ```js
   { id: "miches", nombre: "Miches", activo: true },
   ```
2. Añadir sus precios de solo ida en `tarifas` (valen en ambos sentidos):
   ```js
   { a: "sdq",  b: "miches", usd: 180 },
   { a: "boca", b: "miches", usd: 170 },
   ```

Reglas: el `id` va en minúsculas, sin espacios ni acentos. Si un lugar no tiene tarifa con otro, el formulario muestra «A cotizar». Para ocultar un destino sin borrarlo: `activo: false`. Para cambiar un precio basta con cambiar el número `usd`.

Después de editar, hay que **volver a publicar** (ver abajo); el cambio aparece en todos los teléfonos.

## Reglas de precio (en `routes.js`)

- `factorIdaYVuelta: 0.78` → ida y vuelta = ida × 2 × 0.78 (22 % de descuento).
- `esperaMaximaHoras: 4` → el descuento aplica si el regreso es el mismo día y hasta 4 h después de la hora de salida. Si se supera o el regreso es otro día: «A cotizar».
- `pasajerosIncluidos: 4` y `cargoPasajeroAdicional: 10` → la tarifa cubre hasta 4 pasajeros; desde el quinto se suman US$10 por persona en cada trayecto. Ejemplo: Aeropuerto → Boca Chica con 6 pasajeros = 25 + 2 × 10 = US$45. En ida y vuelta se aplica la fórmula sobre ese total: 45 × 2 × 0.78 = US$70.20. Más de 15 pasajeros: «A cotizar».

## Publicar cambios

La página está publicada en Vercel. Para publicar una nueva versión, pedirle a Claude: *«Publica los cambios del sistema de reservas en Vercel»*.
Opcional: conectar este repositorio de GitHub al proyecto de Vercel (Vercel → proyecto `jose-garcia-reservas` → Settings → Git) para que cada cambio en `main` se publique solo.

## Pruebas

`python3 tests/test_form.py <URL> <carpeta_capturas>` — ejecuta 47 comprobaciones (casos A–H del proyecto maestro) en Chromium con vistas de iPhone, Android y computadora. Las pruebas **no envían mensajes** a WhatsApp: capturan el enlace generado.

## Mejora futura: panel de administración

Un panel protegido para editar destinos sin tocar archivos necesita una base de datos y un inicio de sesión. No está incluido en esta versión.
