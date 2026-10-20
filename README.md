# Ebrar — sitio web

Sitio estático (HTML, CSS y JavaScript, sin dependencias ni compilación). Se publica tal cual en Vercel, Netlify o cualquier hosting estático.

## Archivos
| Archivo | Para qué sirve |
| --- | --- |
| `index.html` / `main.js` | Portada de 1 viewport + recorridos Empresas / Personas |
| `precios.html` / `precios.js` | Planes de referencia y "Armá tu plan" (a medida) |
| `styles.css` | Estilos (colores y tipografías en `:root`) |
| `config.js` | **Tus datos**: contacto, modalidades y precios |
| `common.js` | Lógica compartida de contacto y envío de formularios |
| `logo.svg`, `og.png` | Logo (sin modificar) e imagen para compartir |

## Cargar precios (`config.js` → `precios.planes`)
Mientras `monto` sea `null`, la web muestra **"Consultar"** (o "A cotizar"): no se inventa ningún valor.
Para publicar un precio, poné un número sin puntos ni símbolo: `monto: 150000`.
- `periodo`: `unico`, `mensual`, `sesion`, `pack` o `cotizar`.
- `desde: true` muestra "Desde $X" (recomendado cuando el alcance varía).
- `duracionSesion` y `packSesiones` completan el detalle de las sesiones.
Si todos los ítems de "Armá tu plan" tienen precio numérico (único o mensual), el resumen muestra un total de referencia; si no, indica que el valor se define en la propuesta.

## Formularios y envío
Destino, en orden: `formEndpoint` (POST JSON, confirma solo si responde bien) → WhatsApp (abre el chat con el mensaje listo) → correo. Con WhatsApp o correo se avisa que falta enviar desde ahí. Sin nada configurado, el botón queda desactivado.
Anti-spam: campo trampa (honeypot) y tiempo mínimo de interacción.

## Antes de publicar
- Completar `personasModalidades` en `config.js` con lo que realmente podés prestar (hoy vacío: no se muestra).
- Agregar el `canonical` en `index.html` cuando tengas el dominio.
- Tipografías desde Google Fonts; podés servirlas desde tu propio sitio si preferís.
- Sin analítica ni cookies. Si agregás medición, sumá aviso y consentimiento.
