/* Ebrar — comportamiento de la landing. Sin dependencias. */
(function () {
  'use strict';

  var cfg = window.EBRAR_CONFIG || {};
  var phone = String(cfg.whatsapp || '').replace(/\D/g, '');
  var email = String(cfg.email || '').trim();
  var endpoint = String(cfg.formEndpoint || '').trim();
  var baseMessage = String(cfg.whatsappMessage || '').trim() || 'Hola Emi, vi la web de Ebrar y quería hacer una consulta.';

  var NEEDS = {
    web: 'Sitio web o tienda online',
    integraciones: 'Integraciones y automatización',
    publicidad: 'Publicidad digital',
    redes: 'Redes sociales',
    consultoria: 'Consultoría digital',
    otra: 'Otra necesidad'
  };
  var MODES = { presencial: 'Presencial', remota: 'Remota' };
  var MIN_FILL_MS = 3000;

  function $(id) { return document.getElementById(id); }
  function waUrl(text) { return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(text); }

  /* Destino de los formularios, según lo configurado. */
  var mode = 'none';
  if (/^https:\/\//i.test(endpoint)) mode = 'endpoint';
  else if (phone) mode = 'whatsapp';
  else if (email) mode = 'email';

  /* ---------- Menú móvil ---------- */
  var menuBtn = $('menu-btn'), nav = $('nav');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
  });

  /* ---------- Enlaces de contacto (solo con datos configurados) ---------- */
  var cta = $('cta-contacto'), footWa = $('foot-wa'), footMail = $('foot-mail');
  if (phone) {
    if (cta) { cta.href = waUrl(baseMessage); cta.target = '_blank'; cta.rel = 'noopener'; cta.hidden = false; }
    if (footWa) { footWa.href = waUrl(baseMessage); footWa.hidden = false; }
  }
  if (email && footMail) { footMail.href = 'mailto:' + email; footMail.hidden = false; }

  /* ---------- Pestañas Negocios / Personas ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function selectTab(kind, focus) {
    tabs.forEach(function (t) {
      var on = t.id === 'tab-' + kind;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $(t.getAttribute('aria-controls')).hidden = !on;
      if (on && focus) t.focus();
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t.id.replace('tab-', '')); });
    t.addEventListener('keydown', function (e) {
      var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
      if (j === null) return;
      e.preventDefault();
      selectTab(tabs[(j + tabs.length) % tabs.length].id.replace('tab-', ''), true);
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-pick]'), function (a) {
    a.addEventListener('click', function () {
      if (a.getAttribute('href') !== '#contacto') return;
      selectTab(a.getAttribute('data-pick'));
      var need = a.getAttribute('data-need');
      if (need) $('negocios-need').value = need;
    });
  });

  /* ---------- Modalidades confirmadas (solo las configuradas) ---------- */
  var confirmed = (cfg.personasModalidades || []).filter(function (m) { return MODES[m]; });
  if (confirmed.length) {
    var sel = $('personas-mode');
    confirmed.forEach(function (m) {
      var o = document.createElement('option');
      o.value = m; o.textContent = MODES[m];
      sel.appendChild(o);
    });
    $('modalidad-field').hidden = false;
    var info = $('modalidad-info');
    info.textContent = 'Modalidades disponibles: ' + confirmed.map(function (m) { return MODES[m].toLowerCase(); }).join(' y ') + '.';
    info.hidden = false;
  }

  /* ---------- Formularios ---------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function validContact(v) {
    if (EMAIL.test(v)) return true;
    return /^\d{8,15}$/.test(v.replace(/[\s()+\-.]/g, ''));
  }
  function clean(s) { return String(s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim(); }

  Array.prototype.forEach.call(document.querySelectorAll('form[data-kind]'), function (form) {
    var kind = form.getAttribute('data-kind');
    var statusEl = $(kind + '-status');
    var submitBtn = form.querySelector('button[type="submit"]');
    var firstTouch = 0;

    function setStatus(state, text) {
      statusEl.textContent = text || '';
      if (state) statusEl.setAttribute('data-state', state); else statusEl.removeAttribute('data-state');
      statusEl.setAttribute('role', state === 'error' ? 'alert' : 'status');
    }
    function fieldError(name, message) {
      var input = form.elements[name], out = $(kind + '-e-' + name);
      if (!input || !out) return;
      if (message) {
        out.textContent = message; out.hidden = false;
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', out.id);
      } else {
        out.hidden = true; out.textContent = '';
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
      }
    }
    function validate(d) {
      var first = null;
      function check(name, bad, msg) {
        fieldError(name, bad ? msg : '');
        if (bad && !first) first = form.elements[name];
      }
      check('name', d.name.length < 2, 'Escribí tu nombre.');
      check('contact', !validContact(d.contact), 'Dejame un correo o un número de WhatsApp válido para responderte.');
      if (kind === 'negocios') check('need', !NEEDS[d.need], 'Elegí un tipo de necesidad.');
      check('message', d.message.length < 10, 'Contame un poco más (al menos 10 caracteres).');
      if (first) first.focus();
      return !first;
    }
    function composeText(d) {
      var lines = ['Hola Emi, te escribo desde la web de Ebrar (' + (kind === 'negocios' ? 'consulta de negocio' : 'consulta personal') + ').',
        'Nombre: ' + d.name];
      if (kind === 'negocios') lines.push('Necesidad: ' + NEEDS[d.need]);
      if (d.mode) lines.push('Modalidad preferida: ' + MODES[d.mode]);
      lines.push((kind === 'negocios' ? 'Proyecto: ' : 'Dificultad: ') + d.message, 'Contacto: ' + d.contact);
      return lines.join('\n');
    }

    if (mode === 'none') {
      submitBtn.disabled = true;
      setStatus('', 'El formulario todavía no tiene un destino configurado.');
    }
    form.addEventListener('focusin', function () { if (!firstTouch) firstTouch = Date.now(); });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (mode === 'none') return;
      if (form.elements.web.value) return; /* trampa para robots: no se envía ni se confirma nada */

      var d = {
        name: clean(form.elements.name.value),
        contact: clean(form.elements.contact.value),
        message: clean(form.elements.message.value),
        need: form.elements.need ? form.elements.need.value : '',
        mode: form.elements.mode ? form.elements.mode.value : ''
      };
      if (!validate(d)) { setStatus('error', 'Revisá los campos marcados.'); return; }
      if (!firstTouch || Date.now() - firstTouch < MIN_FILL_MS) { setStatus('error', 'Esperá unos segundos y volvé a enviar.'); return; }

      if (mode === 'whatsapp') {
        window.open(waUrl(composeText(d)), '_blank', 'noopener');
        setStatus('success', 'Abrimos WhatsApp con tu consulta lista. Falta que la envíes desde ahí.');
        return;
      }
      if (mode === 'email') {
        window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Consulta desde la web de Ebrar') +
          '&body=' + encodeURIComponent(composeText(d));
        setStatus('success', 'Abrimos tu programa de correo con la consulta lista. Falta que la envíes desde ahí.');
        return;
      }

      submitBtn.disabled = true; submitBtn.textContent = 'Enviando…';
      setStatus('', 'Enviando tu consulta.');
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          tipo: kind === 'negocios' ? 'Negocio' : 'Persona',
          nombre: d.name,
          necesidad: kind === 'negocios' ? NEEDS[d.need] : '',
          modalidad: d.mode ? MODES[d.mode] : '',
          mensaje: d.message,
          contacto: d.contact
        })
      }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        form.reset(); firstTouch = 0;
        setStatus('success', 'Recibí tu consulta. Te respondo por el medio que dejaste.');
      }).catch(function () {
        setStatus('error', 'No se pudo enviar la consulta. Probá de nuevo en unos minutos.' + (phone ? ' También podés escribirme por WhatsApp.' : ''));
      }).then(function () {
        submitBtn.disabled = false; submitBtn.textContent = 'Enviar consulta';
      });
    });
  });
})();
