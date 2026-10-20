/* Ebrar — comportamiento de la página principal. Sin dependencias. */
(function () {
  'use strict';
  var E = window.Ebrar, cfg = E.cfg;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var ico = function (n) { return '<svg class="i" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; };
  var rev = $('#reveal'), cover = $('#inicio'), wipe = $('#wipe'), current = null, busy = false;

  E.wireDirectLinks();

  /* ---------- Contenido dinámico ---------- */
  var STEPS_A = [
    ['ear', 'Escuchar', 'Entender qué necesita tu empresa o tu emprendimiento.'],
    ['search', 'Evaluar', 'Identificar posibles soluciones y ver si son viables.'],
    ['doc', 'Acordar', 'Definir el alcance, las condiciones y el presupuesto.'],
    ['bolt', 'Resolver', 'Realizar el trabajo acordado.'],
    ['check', 'Verificar', 'Comprobar el resultado y explicar los próximos pasos.']
  ];
  var STEPS_B = [
    ['chat', 'Contame', 'Me contás qué querés resolver, con tus palabras.'],
    ['calendar', 'Coordinamos', 'Acordamos qué vamos a ver y cómo vamos a trabajar.'],
    ['phone', 'Practicamos', 'Aprendés con tu propio dispositivo, a tu ritmo y sin apuro.'],
    ['check', 'Repasamos', 'Vemos qué aprendiste y cómo seguir por tu cuenta.']
  ];
  var PEOPLE = [
    ['phone', 'Celular y aplicaciones', 'Configurar el dispositivo, aprender funciones y resolver dudas del día a día.'],
    ['chat', 'Comunicación digital', 'WhatsApp, correo electrónico y videollamadas, para estar siempre en contacto.'],
    ['folder', 'Fotos, archivos y contactos', 'Ordenar todo para encontrarlo cuando lo necesitás.'],
    ['doc', 'Trámites y servicios digitales', 'Aprender a usar páginas y aplicaciones de organismos y servicios.'],
    ['shield', 'Seguridad digital', 'Reconocer mensajes sospechosos, proteger tus cuentas y evitar estafas.']
  ];
  $('#pg').innerHTML = PEOPLE.map(function (p, i) {
    var big = i === 0;
    return '<article class="pc rv' + (big ? ' big' : '') + '" style="--d:' + (i * .08) + 's"><span class="ic">' + ico(p[0]) + '</span><h3>' + p[1] + '</h3><p>' + p[2] + '</p>' +
      (big ? '<div class="mock" aria-hidden="true"><span>' + ico('chat') + '</span><span>' + ico('folder') + '</span><span>' + ico('shield') + '</span></div>' : '') + '</article>';
  }).join('') +
    '<article class="pc pc--cta wide rv" style="--d:.4s"><span class="ic">' + ico('chat') + '</span><div class="txt"><h3>¿Empezamos?</h3><p>Contame qué te gustaría resolver y lo vemos a tu ritmo.</p></div><a class="btn" href="#contacto-b">Contame en qué necesitás ayuda</a></article>';

  /* Pasos: paneles que se expanden; avanzan solos hasta que la persona interactúa */
  function initSteps(sg, bar, data) {
    sg.innerHTML = data.map(function (s, i) {
      return '<button type="button" class="st rv" style="--d:' + (i * .08) + 's"><span class="sn" aria-hidden="true">0' + (i + 1) + '</span><span class="ic">' + ico(s[0]) + '</span><div><h3>' + s[1] + '</h3><p>' + s[2] + '</p></div></button>';
    }).join('');
    var st = $$('.st', sg), act = -1, timer = null, hold = false;
    function set(i) { act = i; st.forEach(function (s, k) { s.classList.toggle('on', k === i); s.classList.toggle('cur', k === i); }); bar.style.setProperty('--p', ((i + 1) / st.length * 100) + '%'); }
    st.forEach(function (s, i) {
      ['mouseenter', 'focus', 'click'].forEach(function (ev) { s.addEventListener(ev, function () { hold = true; set(i); }); });
      s.addEventListener('mouseleave', function () { hold = false; });
    });
    sg.addEventListener('scroll', function () {
      if (innerWidth >= 900) return;
      var c = sg.scrollLeft + sg.clientWidth / 2, b = 0, bd = 1e9;
      st.forEach(function (s, k) { var d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - c); if (d < bd) { bd = d; b = k; } });
      set(b);
    }, { passive: true });
    return {
      play: function () { clearInterval(timer); set(0); if (reduce) return; timer = setInterval(function () { if (hold || innerWidth < 900) return; set((act + 1) % st.length); }, 2600); },
      reset: function () { clearInterval(timer); act = -1; st.forEach(function (s) { s.classList.remove('on', 'cur'); }); bar.style.setProperty('--p', '0%'); }
    };
  }
  var stepsA = initSteps($('#sg-a'), $('#pbar-a'), STEPS_A), stepsB = initSteps($('#sg-b'), $('#pbar-b'), STEPS_B);
  var stepIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { (e.target.id === 'sg-a' ? stepsA : stepsB).play(); stepIO.unobserve(e.target); } });
  }, { threshold: .35 });

  /* Palabras rotativas */
  var W = ['tu tienda online', 'tu empresa', 'tu celular', 'tu WhatsApp', 'tu emprendimiento', 'tus trámites'], box = $('#rollbox');
  box.innerHTML = W.concat([W[0]]).map(function (w) { return '<span>' + w + '</span>'; }).join('');
  var ri = 0;
  if (!reduce) setInterval(function () {
    ri++; box.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1)'; box.style.transform = 'translateY(-' + (ri * 1.3) + 'em)';
    if (ri === W.length) setTimeout(function () { box.style.transition = 'none'; box.style.transform = 'none'; ri = 0; }, 650);
  }, 2200);
  var mk = $('#mark');
  addEventListener('pointermove', function (e) { mk.style.setProperty('--px', ((e.clientX / innerWidth - .5) * -26) + 'px'); mk.style.setProperty('--py', ((e.clientY / innerHeight - .5) * -26) + 'px'); });

  /* Vista previa al enfocar un botón de la portada */
  var PV = { a: 'Sitios web, tiendas online, integraciones, publicidad y redes.', b: 'Celular, WhatsApp, fotos, trámites y seguridad, a tu ritmo.' }, pv = $('#preview'), def = pv.textContent;
  $$('.pick').forEach(function (b) {
    var k = b.dataset.pick;
    function on() { pv.textContent = PV[k]; cover.dataset.hov = k; }
    function off() { pv.textContent = def; delete cover.dataset.hov; }
    b.addEventListener('mouseenter', on); b.addEventListener('focus', on); b.addEventListener('mouseleave', off); b.addEventListener('blur', off);
  });

  /* ---------- Elegir recorrido ---------- */
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .15 });
  function observe() {
    $$('#reveal .rv').forEach(function (el) { el.classList.remove('in'); io.observe(el); });
    stepsA.reset(); stepsB.reset();
    var sg = rev.dataset.aud === 'a' ? $('#sg-a') : $('#sg-b'); stepIO.observe(sg);
  }
  function pills() {
    $$('[data-sw]').forEach(function (sw) {
      var b = $('[aria-pressed=true]', sw), p = $('.pill', sw);
      if (!b || !sw.getClientRects().length) return;
      p.style.cssText = 'left:3px;right:3px;top:' + b.offsetTop + 'px;height:' + b.offsetHeight + 'px';
    });
  }
  function apply(k) {
    current = k; rev.dataset.aud = k; document.body.dataset.aud = k; rev.classList.add('on');
    $$('#rail [data-pick],#pop [data-pick]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.pick === k)); });
    $('#chip').innerHTML = ico(k === 'a' ? 'store' : 'user');
    $('#nav-contacto').setAttribute('href', k === 'a' ? '#contacto-a' : '#contacto-b');
    $('.foot-about').hidden = false;
    $('#rail').classList.add('show'); $('#chip').classList.add('show');
    observe(); requestAnimationFrame(pills); setTimeout(pills, 60);
  }
  function pick(k, x, y) {
    if (busy || (k === current && rev.classList.contains('on'))) return;
    var top = function () { return rev.getBoundingClientRect().top + scrollY; };
    if (reduce || x == null) { apply(k); scrollTo({ top: top(), behavior: 'instant' }); return; }
    busy = true;
    wipe.className = 'wipe'; wipe.style.background = k === 'a' ? '#1C1D1F' : '#F26A1B'; wipe.style.opacity = 1;
    wipe.style.clipPath = 'circle(0 at ' + x + 'px ' + y + 'px)'; void wipe.offsetWidth;
    wipe.classList.add('run'); wipe.style.clipPath = 'circle(150vmax at ' + x + 'px ' + y + 'px)';
    setTimeout(function () {
      apply(k); scrollTo({ top: top(), behavior: 'instant' });
      wipe.classList.add('fade'); wipe.style.opacity = 0;
      setTimeout(function () { wipe.className = 'wipe'; wipe.style.clipPath = 'circle(0 at 50% 50%)'; busy = false; }, 550);
    }, 820);
  }
  $$('[data-pick]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      var r = b.getBoundingClientRect(), inCover = !!b.closest('.cover');
      var x = inCover ? (e.clientX || r.left + r.width / 2) : r.left + r.width / 2, y = inCover ? (e.clientY || r.top + r.height / 2) : r.top + r.height / 2;
      pick(b.dataset.pick, x, y);
      $('#pop').classList.remove('open'); $('#chip').classList.remove('open'); $('#chip').setAttribute('aria-expanded', 'false');
    });
  });
  $('#chip').addEventListener('click', function () { var o = $('#pop').classList.toggle('open'); this.classList.toggle('open', o); this.setAttribute('aria-expanded', String(o)); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { $('#pop').classList.remove('open'); $('#chip').classList.remove('open'); } });

  /* Enlaces "Consultar por…" preseleccionan el tipo de necesidad */
  $$('[data-need]').forEach(function (a) { a.addEventListener('click', function () { $('#a-need').value = a.getAttribute('data-need'); }); });

  /* Rail/botón y tarjetas apiladas según el scroll */
  addEventListener('scroll', function () {
    var on = rev.classList.contains('on') && scrollY > cover.offsetHeight - 120;
    $('#rail').classList.toggle('show', on); $('#chip').classList.toggle('show', on);
    if (!on) { $('#pop').classList.remove('open'); $('#chip').classList.remove('open'); }
    var cs = $$('.card');
    cs.forEach(function (c, i) {
      var n = cs[i + 1]; if (!n || !c.offsetParent) return;
      var t = Math.max(0, Math.min(1, 1 - (n.getBoundingClientRect().top - c.getBoundingClientRect().top) / c.offsetHeight));
      c.style.transform = 'scale(' + (1 - t * .06) + ')';
    });
  }, { passive: true });
  addEventListener('resize', pills);

  /* ---------- Modalidades confirmadas (solo las configuradas) ---------- */
  var MODES = { presencial: 'Presencial', remota: 'Remota' };
  var confirmed = (cfg.personasModalidades || []).filter(function (m) { return MODES[m]; });
  if (confirmed.length) {
    var sel = $('#b-mode');
    confirmed.forEach(function (m) { var o = document.createElement('option'); o.value = m; o.textContent = MODES[m]; sel.appendChild(o); });
    $('#modalidad-field').hidden = false;
    var info = $('#modalidad-info'); info.textContent = 'Modalidades disponibles: ' + confirmed.map(function (m) { return MODES[m].toLowerCase(); }).join(' y ') + '.'; info.hidden = false;
  }

  /* ---------- Formularios ---------- */
  var NEEDS = { web: 'Sitio web o tienda online', integraciones: 'Integraciones y automatización', publicidad: 'Publicidad digital', redes: 'Redes sociales', consultoria: 'Consultoría digital', otra: 'Otra necesidad' };
  $$('form[data-kind]').forEach(function (form) {
    var kind = form.dataset.kind, statusEl = $('#' + kind + '-status'), btn = $('button[type=submit]', form), guard = E.touchGuard(form);
    function setStatus(state, text) {
      statusEl.textContent = text || ''; if (state) statusEl.setAttribute('data-state', state); else statusEl.removeAttribute('data-state');
      statusEl.setAttribute('role', state === 'error' ? 'alert' : 'status');
    }
    function fieldError(name, msg) {
      var input = form.elements[name], out = $('#' + kind + '-e-' + name); if (!input || !out) return;
      if (msg) { out.textContent = msg; out.hidden = false; input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', out.id); }
      else { out.hidden = true; out.textContent = ''; input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); }
    }
    function validate(d) {
      var first = null;
      function check(n, bad, m) { fieldError(n, bad ? m : ''); if (bad && !first) first = form.elements[n]; }
      check('name', d.name.length < 2, 'Escribí tu nombre.');
      check('contact', !E.validContact(d.contact), 'Dejame un correo o un número de WhatsApp válido para responderte.');
      if (kind === 'a') check('need', !NEEDS[d.need], 'Elegí un tipo de necesidad.');
      check('message', d.message.length < 10, 'Contame un poco más (al menos 10 caracteres).');
      if (first) first.focus();
      return !first;
    }
    if (E.mode === 'none') { btn.disabled = true; setStatus('', 'El formulario todavía no tiene un destino configurado.'); }
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (E.mode === 'none' || form.elements.web.value) return; /* campo trampa: no se envía ni se confirma nada */
      var d = { name: E.clean(form.elements.name.value), contact: E.clean(form.elements.contact.value), message: E.clean(form.elements.message.value), need: form.elements.need ? form.elements.need.value : '', mode: form.elements.mode ? form.elements.mode.value : '' };
      if (!validate(d)) { setStatus('error', 'Revisá los campos marcados.'); return; }
      if (!guard.ok()) { setStatus('error', 'Esperá unos segundos y volvé a enviar.'); return; }
      var lines = ['Nombre: ' + d.name];
      if (kind === 'a') lines.push('Necesidad: ' + NEEDS[d.need]);
      if (d.mode) lines.push('Modalidad preferida: ' + MODES[d.mode]);
      lines.push((kind === 'a' ? 'Proyecto: ' : 'Dificultad: ') + d.message, 'Contacto: ' + d.contact);
      E.deliver({
        title: kind === 'a' ? 'consulta de empresa' : 'consulta personal', lines: lines, button: btn, setStatus: setStatus,
        json: { tipo: kind === 'a' ? 'Empresa' : 'Persona', nombre: d.name, necesidad: kind === 'a' ? NEEDS[d.need] : '', modalidad: d.mode ? MODES[d.mode] : '', mensaje: d.message, contacto: d.contact },
        onDone: function () { form.reset(); guard.reset(); }
      });
    });
  });

  /* Deep link: ?aud=a|b o #personas / #empresas abre directamente ese recorrido */
  var q = new URLSearchParams(location.search).get('aud'), h = location.hash;
  var start = q === 'a' || q === 'b' ? q : (h === '#personas' ? 'b' : (h === '#empresas' ? 'a' : null));
  if (start) { apply(start); setTimeout(function () { scrollTo({ top: rev.getBoundingClientRect().top + scrollY, behavior: 'instant' }); }, 60); }
})();
