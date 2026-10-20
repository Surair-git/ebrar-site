/*
 * Configuración de contacto de Ebrar.
 * Completá solo lo que vayas a usar. Lo que quede vacío no se muestra.
 * Este archivo es público: no pongas claves ni datos privados acá.
 */
window.EBRAR_CONFIG = {
  // WhatsApp: solo dígitos, con código de país. Para Argentina: 54 + 9 + código de área + número.
  whatsapp: "5492915717759",

  // Mensaje inicial que se abre en WhatsApp desde el botón principal.
  whatsappMessage: "Hola Emi, vi la web de Ebrar y quería consultarte por una necesidad de mi negocio.",

  // Correo de contacto (opcional). Se muestra en el pie y sirve como respaldo del formulario.
  email: "braianramirez@gmail.com.ar",

  // Destino del formulario (opcional): una URL https que reciba un POST con JSON.
  // Funciona con servicios como Formspree o con tu propio endpoint.
  // Si queda vacío, el formulario usa WhatsApp o correo como destino.
  formEndpoint: "",

  // Modalidades de acompañamiento para personas que ya podés prestar de verdad.
  // Valores posibles: "presencial", "remota". Vacío = no se muestra ninguna modalidad.
  personasModalidades: [],

  // Dirección final del sitio, por ejemplo "https://ebrar.com.ar" (opcional).
  siteUrl: ""
};
