# Ebrar — landing (v2)

Sitio estático: HTML, CSS y JavaScript sin dependencias ni paso de compilación. Parte de la web anterior (mismo logo, paleta, tipografías, `config.js` y lógica de formulario) y suma los dos recorridos: **Negocios** y **Personas**.

## Archivos
| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | Estructura y textos |
| `styles.css` | Diseño (colores y fuentes en `:root`) |
| `main.js` | Menú móvil, pestañas de contacto, validación y envío |
| `config.js` | **Tus datos** (WhatsApp, correo, endpoint, modalidades) |
| `logo.svg` | Logo original (sin modificar) y favicon |
| `og.png` | Vista previa para redes (actualizada al nuevo mensaje) |

## Configuración (`config.js`)
- `whatsapp`, `email`, `whatsappMessage`: ya estaban cargados; se muestran solo si tienen valor.
- `formEndpoint`: URL `https://` que reciba un POST con JSON (Formspree, etc.).
- `personasModalidades`: **vacío a propósito**. Cuando confirmes qué podés ofrecer, poné `["presencial"]`, `["remota"]` o ambas; recién ahí se muestra el selector y el aviso en la sección Personas.
- `siteUrl`: dominio final (agregá también el `canonical` en `index.html`).

## Cómo envía el formulario (ambos formularios)
1. Con `formEndpoint`: envía y confirma solo si el servicio responde bien; si falla, muestra el error.
2. Sin endpoint y con `whatsapp`: abre WhatsApp con la consulta escrita (la persona la envía desde ahí).
3. Sin endpoint ni WhatsApp y con `email`: abre el correo con la consulta lista.
4. Sin nada: el botón queda desactivado.
Protección: campo trampa (honeypot) y tiempo mínimo de interacción. Para spam real, activá la protección del servicio de destino.

## Publicar
Subí todos los archivos a la raíz de cualquier hosting estático (Netlify: arrastrar la carpeta). Después probá en el celular.

## Pendientes
- Tipografías desde Google Fonts (igual que antes); podés servirlas desde tu sitio si preferís.
- Sin analítica ni cookies. Si agregás medición, sumá aviso y consentimiento.
- Sin testimonios, clientes ni casos de éxito, porque todavía no son reales.
