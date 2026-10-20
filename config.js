/*
 * Configuración de Ebrar.
 * Completá solo lo que vayas a usar. Lo que quede vacío no se muestra.
 * Este archivo es público: no pongas claves ni datos privados acá.
 */
window.EBRAR_CONFIG = {
  // WhatsApp: solo dígitos, con código de país. Para Argentina: 54 + 9 + código de área + número.
  whatsapp: "5492915717759",

  // Mensaje inicial que se abre en WhatsApp desde el botón principal.
  whatsappMessage: "Hola Emi, vi la web de Ebrar y quería hacer una consulta.",

  // Correo de contacto (opcional). Se muestra en el pie y sirve como respaldo del formulario.
  email: "braianramirez@gmail.com.ar",

  // Destino del formulario (opcional): una URL https que reciba un POST con JSON.
  // Funciona con servicios como Formspree o con tu propio endpoint.
  // Si queda vacío, el formulario usa WhatsApp o correo como destino.
  formEndpoint: "",

  // Modalidades de acompañamiento para personas que ya podés prestar de verdad.
  // Valores posibles: "presencial", "remota". Vacío = no se muestra ninguna modalidad.
  personasModalidades: ["presencial", "remota"],

  // Dirección final del sitio, por ejemplo "https://ebrar.com.ar" (opcional).
  siteUrl: "",

  /*
   * PRECIOS (página precios.html)
   * Mientras un monto sea null, la web muestra "Consultar": no se inventa ningún valor.
   * Completá `monto` con un número (sin puntos ni símbolo) para que se muestre.
   * periodo: "unico" (pago único), "mensual", "sesion", "pack" o "cotizar" (se cotiza según el caso).
   * desde: true muestra "Desde $X" (recomendado para servicios cuyo alcance varía).
   */
  precios: {
    moneda: "ARS",
    nota: "Los valores son orientativos. El alcance y el presupuesto final se acuerdan antes de empezar.",
    duracionSesion: "",   // Ej.: "60 minutos". Vacío = no se muestra.
    packSesiones: "",     // Ej.: "4 sesiones". Vacío = "cantidad a acordar".
    planes: {
      // Empresas y comercios
      sitio:         { monto: null, periodo: "unico",   desde: true },
      tienda:        { monto: null, periodo: "unico",   desde: true },
      mantenimiento: { monto: null, periodo: "mensual", desde: true },
      automatizacion:{ monto: null, periodo: "cotizar", desde: false },
      publicidad:    { monto: null, periodo: "mensual", desde: true },
      redes:         { monto: null, periodo: "mensual", desde: true },
      consultoria:   { monto: null, periodo: "sesion",  desde: false },
      // Personas
      sesion:        { monto: null, periodo: "sesion",  desde: false },
      pack:          { monto: null, periodo: "pack",    desde: false },
      seguimiento:   { monto: null, periodo: "mensual", desde: true }
    }
  }
};
