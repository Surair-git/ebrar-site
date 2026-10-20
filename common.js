/* Ebrar — utilidades compartidas (contacto y envío). Sin dependencias. */
window.Ebrar = (function () {
  'use strict';
  var cfg = window.EBRAR_CONFIG || {};
  var phone = String(cfg.whatsapp || '').replace(/\D/g, '');
  var email = String(cfg.email || '').trim();
  var endpoint = String(cfg.formEndpoint || '').trim();
  var baseMessage = String(cfg.whatsappMessage || '').trim() || 'Hola Emi, vi la web de Ebrar y quería hacer una consulta.';
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var MIN_FILL_MS = 3000;

  /* Destino según lo configurado: endpoint > WhatsApp > correo. */
  var mode = 'none';
  if (/^https:\/\//i.test(endpoint)) mode = 'endpoint';
  else if (phone) mode = 'whatsapp';
  else if (email) mode = 'email';

  function waUrl(text) { return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(text); }
  function clean(s) { return String(s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim(); }
  function validContact(v) {
    if (EMAIL.test(v)) return true;
    return /^\d{8,15}$/.test(v.replace(/[\s()+\-.]/g, ''));
  }

  /* Enlaces de contacto directo (solo con datos configurados). */
  function wireDirectLinks() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-wa]'), function (a) {
      if (!phone) return;
      a.href = waUrl(baseMessage); a.target = '_blank'; a.rel = 'noopener'; a.hidden = false;
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-mail]'), function (a) {
      if (!EMAIL.test(email)) return;
      a.href = 'mailto:' + email; a.hidden = false;
    });
  }

  /* Protección anti-spam: el formulario debe haber tenido interacción unos segundos. */
  function touchGuard(form) {
    var t = { first: 0 };
    form.addEventListener('focusin', function () { if (!t.first) t.first = Date.now(); });
    t.ok = function () { return t.first && Date.now() - t.first >= MIN_FILL_MS; };
    t.reset = function () { t.first = 0; };
    return t;
  }

  /*
   * Entrega una consulta según el destino configurado.
   * opts: { title, lines:[texto,...], json:{...}, button, setStatus(state,text), onDone() }
   * Solo se confirma como "recibida" cuando el servicio responde bien; en WhatsApp y correo
   * se avisa que falta enviar el mensaje desde ahí.
   */
  function deliver(opts) {
    var text = ['Hola Emi, te escribo desde la web de Ebrar (' + opts.title + ').'].concat(opts.lines).join('\n');
    var s = opts.setStatus;
    if (mode === 'whatsapp') {
      window.open(waUrl(text), '_blank', 'noopener');
      s('success', 'Abrimos WhatsApp con tu consulta lista. Falta que la envíes desde ahí.');
      return;
    }
    if (mode === 'email') {
      window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Consulta desde la web de Ebrar') + '&body=' + encodeURIComponent(text);
      s('success', 'Abrimos tu programa de correo con la consulta lista. Falta que la envíes desde ahí.');
      return;
    }
    var btn = opts.button, label = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }
    s('', 'Enviando tu consulta.');
    fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(opts.json || {}) })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        s('success', 'Recibí tu consulta. Te respondo por el medio que dejaste.');
        if (opts.onDone) opts.onDone();
      })
      .catch(function () {
        s('error', 'No se pudo enviar la consulta. Probá de nuevo en unos minutos.' + (phone ? ' También podés escribirme por WhatsApp.' : ''));
      })
      .then(function () { if (btn) { btn.disabled = false; btn.textContent = label; } });
  }

  return { cfg: cfg, phone: phone, email: email, mode: mode, waUrl: waUrl, clean: clean, validContact: validContact, wireDirectLinks: wireDirectLinks, touchGuard: touchGuard, deliver: deliver, baseMessage: baseMessage };
})();
