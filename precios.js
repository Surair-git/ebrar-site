/* Ebrar — página de precios. Sin dependencias.
 * Los montos salen de config.js (precios.planes). Si un monto es null se muestra "Consultar":
 * nunca se inventa un valor. */
(function () {
  'use strict';
  var E = window.Ebrar, cfg = E.cfg, P = cfg.precios || { planes: {} };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var ico = function (n) { return '<svg class="i" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; };
  var root = $('#pricing'), aud = 'a', selected = {};
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  E.wireDirectLinks();

  /* ---------- Datos (recomendación de planes por solución) ---------- */
  var DATA = {
    a: {
      cols: 'p4',
      plans: [
        { id: 'sitio', icon: 'globe', name: 'Sitio web', who: 'Para comercios y emprendimientos que necesitan presencia propia.',
          inc: ['Diseño y desarrollo de un sitio a tu medida', 'Adaptado a celulares y computadoras', 'Contacto directo por formulario y WhatsApp', 'Optimización básica de rendimiento', 'Entrega con explicación de cómo usarlo'] },
        { id: 'tienda', icon: 'cart', name: 'Tienda online', who: 'Para quienes quieren vender por internet.',
          inc: ['Creación o mejora de tu tienda online', 'Catálogo y medios de pago según la plataforma elegida', 'Pruebas antes de publicar', 'Herramientas elegidas según tu presupuesto y tu situación'] },
        { id: 'mantenimiento', icon: 'wrench', name: 'Mantenimiento', rec: true, who: 'Para webs y tiendas que ya funcionan y tienen que mantenerse al día.',
          inc: ['Revisión técnica periódica', 'Actualizaciones planificadas con comprobación posterior', 'Copias de seguridad y verificación de su disponibilidad', 'Corrección de errores', 'Consultas técnicas dentro del alcance acordado'] },
        { id: 'automatizacion', icon: 'bolt', name: 'Automatización', who: 'Para quienes repiten tareas a mano y quieren simplificarlas.',
          inc: ['Análisis del proceso antes de proponer nada', 'Solución viable con alcance acordado', 'Conexión entre herramientas compatibles', 'Presupuesto cerrado antes de empezar'],
          note: 'Algunas automatizaciones requieren investigación previa para confirmar su viabilidad.' }
      ],
      addons: [
        { id: 'publicidad', icon: 'megaphone', name: 'Publicidad digital', who: 'Campañas en Facebook e Instagram.',
          inc: ['Revisión de campañas existentes', 'Configuración y organización de anuncios', 'Seguimiento de métricas', 'Recomendaciones de presupuesto publicitario'],
          note: 'La inversión publicitaria se abona por separado. No se prometen ventas ni resultados.' },
        { id: 'redes', icon: 'share', name: 'Redes sociales', who: 'Planificación y contenidos para tus redes.',
          inc: ['Calendario de contenidos', 'Redacción de publicaciones', 'Piezas gráficas, según acuerdo', 'Planificación de publicaciones'],
          note: 'Producción audiovisual, atención de mensajes y moderación no están incluidas salvo acuerdo.' },
        { id: 'consultoria', icon: 'compass', name: 'Consultoría digital', who: 'Para cuando no sabés qué necesitás.',
          inc: ['Conversación para entender tu situación', 'Alternativas para tu presencia y tus procesos', 'Próximos pasos recomendados'],
          note: 'No es una auditoría técnica gratuita: el alcance se define antes.' }
      ],
      situ: [
        ['Quiero tener mi sitio web', 'sitio'], ['Quiero vender online', 'tienda'], ['Ya tengo web o tienda y quiero que esté al día', 'mantenimiento'],
        ['Hago tareas repetitivas a mano', 'automatizacion'], ['Tengo anuncios y no sé si están bien', 'publicidad'], ['Necesito ordenar mis redes', 'redes'], ['No sé por dónde empezar', 'consultoria']
      ],
      mods: [
        ['sitio', 'globe', 'Sitio web'], ['tienda', 'cart', 'Tienda online'], ['mantenimiento', 'wrench', 'Mantenimiento'], ['automatizacion', 'bolt', 'Automatización'],
        ['publicidad', 'megaphone', 'Publicidad digital'], ['redes', 'share', 'Redes sociales'], ['consultoria', 'compass', 'Consultoría digital']
      ],
      lead: 'Marcá lo que te interesa y recibís una propuesta armada para tu caso.',
      note: P.nota
    },
    b: {
      cols: 'p3',
      plans: [
        { id: 'sesion', icon: 'calendar', name: 'Sesión individual', who: 'Para resolver una duda o aprender algo puntual.',
          inc: ['Una sesión sobre lo que necesitás', 'Trabajamos con tu propio dispositivo', 'Contenido adaptado a tu ritmo'] },
        { id: 'pack', icon: 'layers', name: 'Pack de sesiones', rec: true, who: 'Para aprender paso a paso, con continuidad.',
          inc: ['Varias sesiones con continuidad', 'Temario armado según tus necesidades', 'Tiempo para practicar entre sesión y sesión'] },
        { id: 'seguimiento', icon: 'user', name: 'Acompañamiento mensual', who: 'Para tener a alguien de confianza a quien consultar con regularidad.',
          inc: ['Sesiones regulares acordadas de antemano', 'Consultas de seguimiento dentro del alcance acordado', 'Siempre con la misma persona'] }
      ],
      addons: [],
      situ: [
        ['Quiero aprender algo puntual', 'sesion'], ['Quiero aprender con calma y continuidad', 'pack'], ['Quiero tener a quién consultar con regularidad', 'seguimiento'], ['Tengo una necesidad distinta', '#armar']
      ],
      mods: [
        ['celular', 'phone', 'Celular y aplicaciones'], ['comunicacion', 'chat', 'WhatsApp, correo y videollamadas'], ['archivos', 'folder', 'Fotos, archivos y contactos'],
        ['tramites', 'doc', 'Trámites y servicios digitales'], ['seguridad', 'shield', 'Seguridad digital']
      ],
      lead: 'Marcá los temas que te interesan y te armo una propuesta de sesiones a tu medida.',
      note: P.nota + ' Nunca te voy a pedir contraseñas bancarias ni códigos de verificación.'
    }
  };

  /* ---------- Precios ---------- */
  var money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: P.moneda || 'ARS', maximumFractionDigits: 0 });
  function perLabel(p) {
    switch (p.periodo) {
      case 'unico': return 'pago único';
      case 'mensual': return 'por mes';
      case 'sesion': return 'por sesión' + (P.duracionSesion ? ' · ' + P.duracionSesion : '');
      case 'pack': return P.packSesiones ? 'pack de ' + P.packSesiones : 'pack de sesiones (cantidad a acordar)';
      default: return 'se cotiza según el caso';
    }
  }
  function priceOf(id) { return (P.planes || {})[id] || null; }
  function amount(p) {
    if (!p) return 'Consultar';
    if (typeof p.monto === 'number') return (p.desde ? 'Desde ' : '') + money.format(p.monto);
    return p.periodo === 'cotizar' ? 'A cotizar' : 'Consultar';
  }

  /* ---------- Render ---------- */
  function planCard(pl, i) {
    var p = priceOf(pl.id);
    return '<article class="plan rv' + (pl.rec ? ' plan--rec' : '') + '" id="plan-' + pl.id + '" style="--d:' + (i * .07) + 's">' +
      (pl.rec ? '<span class="badge">Recomendación de Ebrar</span>' : '') +
      '<span class="ic">' + ico(pl.icon) + '</span><h3>' + pl.name + '</h3><p class="who">' + pl.who + '</p>' +
      '<ul>' + pl.inc.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' +
      (pl.note ? '<p class="note" style="font-size:.92rem">' + pl.note + '</p>' : '') +
      '<div class="price"><span class="amt">' + amount(p) + '</span><span class="per">' + (p ? perLabel(p) : '') + '</span></div>' +
      '<button type="button" class="btn" data-plan="' + pl.id + '">Quiero este plan</button></article>';
  }
  function render() {
    var d = DATA[aud];
    root.dataset.aud = aud;
    $$('.atabs [role=tab]').forEach(function (t) { var on = t.id === 'tab-' + aud; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    $('#situ').innerHTML = d.situ.map(function (s, i) { return '<button type="button" class="chip" data-target="' + s[1] + '" aria-pressed="false">' + s[0] + '</button>'; }).join('');
    $('#plans').innerHTML = '<div class="plans ' + d.cols + '">' + d.plans.map(planCard).join('') + '</div>';
    var hasAdd = d.addons.length; $('#addons-wrap').hidden = !hasAdd;
    $('#addons').innerHTML = hasAdd ? '<div class="plans p3">' + d.addons.map(planCard).join('') + '</div>' : '';
    $('#pnote').textContent = d.note || '';
    $('#build-lead').textContent = d.lead;
    selected = {};
    $('#mods').innerHTML = d.mods.map(function (m) {
      return '<li class="mod"><input type="checkbox" id="m-' + m[0] + '" value="' + m[0] + '"><label for="m-' + m[0] + '">' + ico(m[1]) + '<span>' + m[2] + '</span><span class="tick" aria-hidden="true">✓</span></label></li>';
    }).join('');
    summary();
    observe();
  }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12 });
  function observe() { $$('.rv').forEach(function (el) { if (reduce) el.classList.add('in'); else io.observe(el); }); }

  /* ---------- Recomendador ---------- */
  document.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (chip) {
      var on = chip.getAttribute('aria-pressed') !== 'true';
      $$('.chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      $$('.plan').forEach(function (p) { p.classList.remove('dim', 'flash'); });
      if (!on) return;
      chip.setAttribute('aria-pressed', 'true');
      var t = chip.dataset.target;
      if (t === '#armar') { $('#armar').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); return; }
      var card = $('#plan-' + t);
      $$('.plan').forEach(function (p) { if (p !== card) p.classList.add('dim'); });
      if (card) { card.classList.remove('dim'); void card.offsetWidth; card.classList.add('flash'); card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); }
      return;
    }
    var plan = e.target.closest('[data-plan]');
    if (plan) { var id = plan.dataset.plan, cb = $('#m-' + id); if (cb) { cb.checked = true; selected[id] = true; summary(); } $('#armar').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
  });

  /* ---------- Pestañas Empresas / Personas ---------- */
  var tabs = $$('.atabs [role=tab]');
  function setAud(k, focus) { aud = k; render(); history.replaceState(null, '', k === 'b' ? '#personas' : location.pathname + location.search); if (focus) $('#tab-' + k).focus(); }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { setAud(t.id.replace('tab-', '')); });
    t.addEventListener('keydown', function (e) {
      var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null; if (j === null) return;
      e.preventDefault(); setAud(tabs[(j + tabs.length) % tabs.length].id.replace('tab-', ''), true);
    });
  });

  /* ---------- Plan a medida ---------- */
  function modName(id) { var m = DATA[aud].mods.filter(function (x) { return x[0] === id; })[0]; return m ? m[2] : id; }
  function chosen() { return $$('#mods input:checked').map(function (i) { return i.value; }); }
  function lineValue(id) { var p = priceOf(id); if (aud === 'b' || !p) return 'A definir en la propuesta'; return amount(p) + ' · ' + perLabel(p); }
  function summary() {
    var ids = chosen(), list = $('#sum-list');
    if (!ids.length) { list.innerHTML = '<p class="empty">Todavía no marcaste nada. Elegí uno o más ítems, o contanos tu caso abajo.</p>'; return; }
    var html = '<ul>' + ids.map(function (id) { return '<li><span>' + modName(id) + '</span><span>' + (aud === 'a' && priceOf(id) && typeof priceOf(id).monto === 'number' ? amount(priceOf(id)) : 'A confirmar') + '</span></li>'; }).join('') + '</ul>';
    if (aud === 'a') {
      var all = ids.every(function (id) { var p = priceOf(id); return p && typeof p.monto === 'number' && (p.periodo === 'unico' || p.periodo === 'mensual'); });
      if (all) {
        var u = 0, m = 0; ids.forEach(function (id) { var p = priceOf(id); if (p.periodo === 'unico') u += p.monto; else m += p.monto; });
        html += '<p class="tot">' + (u ? 'Pago único: ' + money.format(u) + '. ' : '') + (m ? 'Por mes: ' + money.format(m) + '. ' : '') + 'Valores de referencia.</p>';
      } else html += '<p class="note" style="margin:0">El valor total se define en la propuesta, según el alcance.</p>';
    } else html += '<p class="note" style="margin:0">La cantidad de sesiones y su valor se definen en la propuesta.</p>';
    list.innerHTML = html;
  }
  $('#mods').addEventListener('change', summary);

  var form = $('#form-sum'), statusEl = $('#s-status'), btn = $('button[type=submit]', form), guard = E.touchGuard(form);
  function setStatus(state, text) { statusEl.textContent = text || ''; if (state) statusEl.setAttribute('data-state', state); else statusEl.removeAttribute('data-state'); statusEl.setAttribute('role', state === 'error' ? 'alert' : 'status'); }
  function fieldError(name, msg) {
    var input = form.elements[name], out = $('#s-e-' + name); if (!input || !out) return;
    if (msg) { out.textContent = msg; out.hidden = false; input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', out.id); }
    else { out.hidden = true; out.textContent = ''; input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); }
  }
  if (E.mode === 'none') { btn.disabled = true; setStatus('', 'El formulario todavía no tiene un destino configurado.'); }
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (E.mode === 'none' || form.elements.web.value) return;
    var d = { name: E.clean(form.elements.name.value), contact: E.clean(form.elements.contact.value), message: E.clean(form.elements.message.value) }, ids = chosen(), first = null;
    function check(n, bad, m) { fieldError(n, bad ? m : ''); if (bad && !first) first = form.elements[n]; }
    check('name', d.name.length < 2, 'Escribí tu nombre.');
    check('contact', !E.validContact(d.contact), 'Dejame un correo o un número de WhatsApp válido para responderte.');
    check('message', !ids.length && d.message.length < 10, 'Marcá al menos un ítem o contanos tu caso (mínimo 10 caracteres).');
    if (first) { first.focus(); setStatus('error', 'Revisá los campos marcados.'); return; }
    if (!guard.ok()) { setStatus('error', 'Esperá unos segundos y volvé a enviar.'); return; }
    var names = ids.map(modName), who = aud === 'a' ? 'empresa' : 'persona';
    var lines = ['Nombre: ' + d.name, 'Quiero una propuesta a medida (' + who + '): ' + (names.length ? names.join(', ') : 'sin ítems marcados')];
    if (d.message) lines.push('Mi caso: ' + d.message);
    lines.push('Contacto: ' + d.contact);
    E.deliver({
      title: 'propuesta a medida', lines: lines, button: btn, setStatus: setStatus,
      json: { tipo: 'Propuesta a medida', recorrido: aud === 'a' ? 'Empresa' : 'Persona', nombre: d.name, items: names, mensaje: d.message, contacto: d.contact },
      onDone: function () { form.reset(); selected = {}; summary(); guard.reset(); }
    });
  });

  var h = location.hash, q = new URLSearchParams(location.search).get('aud');
  if (h === '#personas' || q === 'b') aud = 'b';
  render();
})();
