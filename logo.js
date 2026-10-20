/* Ebrar — logo animado de la portada (solo móvil). Sin dependencias.
   Cuatro líneas del grosor del logo (negro, gris y naranja) cruzan el recuadro y cada una deja una parte del logo.
   Ciclo: construir → pausa → borrar. Arrastrar el dedo sobre el logo recorre la construcción. */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var box = $('#logobox'), sv = $('#sv'), sv2 = $('#sv2'), cover = $('#inicio'), desc = $('.desc');
  if (!box || !sv || !sv2 || !cover || !desc) return;
  var NS = 'http://www.w3.org/2000/svg';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var l1 = $('.l:nth-child(1)'), l2 = $('.l:nth-child(2)');

  /* Cuatro tramos del logo; cada línea entra desde fuera, recorre su tramo y sale */
  var K = 350, U = [32 / 49.68, 38 / 49.68];
  var SEG = [
    { d: 'M56 98H48A38 38 0 0 1 48 22', a: [56 + K, 98], e: [48 + K, 22], c: '#1C1D1F' },
    { d: 'M48 22H78A19 19 0 0 1 78 60', a: [48 - K, 22], e: [78 - K, 60], c: '#8D8C86' },
    { d: 'M78 60H12', a: [78 + K, 60], e: [12 - K, 60], c: '#F26A1B' },
    { d: 'M60 60L92 98', a: [60 - K * U[0], 60 - K * U[1]], e: [92 + K * U[0], 98 + K * U[1]], c: '#1C1D1F' }
  ];
  var SG = .35, D = 1.7, LD = 120, pcs = $('#pieces'), runs = $('#runs');
  function mk(tag, at, par) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); par.appendChild(e); return e; }
  SEG.forEach(function (s) {
    var body = s.d.replace(/^M[\d.\- ]+/, ''), st0 = s.d.match(/^M([\d.\-]+) ([\d.\-]+)/);
    s.piece = mk('path', { d: s.d }, pcs);
    s.ls = s.piece.getTotalLength();
    s.la = Math.hypot(st0[1] - s.a[0], st0[2] - s.a[1]);
    s.run = mk('path', { d: 'M' + s.a[0] + ' ' + s.a[1] + 'L' + st0[1] + ' ' + st0[2] + body + 'L' + s.e[0] + ' ' + s.e[1], stroke: s.c }, runs);
    s.tot = s.run.getTotalLength();
    s.piece.setAttribute('stroke-dasharray', s.ls + ' ' + s.ls * 2);
    s.run.setAttribute('stroke-dasharray', LD + ' ' + (s.tot + LD + 60));
  });

  var Tb = D + 3 * SG, HOLD = 1.7, Te = Tb, GAP = .4, CYC = Tb + HOLD + Te + GAP;
  var T = 0, drag = false, resumeAt = 0, last = performance.now(), raf = 0;
  function phase(t, i) {
    if (t < Tb) return ['b', Math.max(0, Math.min(1, (t - i * SG) / D))];
    if (t < Tb + HOLD) return ['b', 1];
    if (t < Tb + HOLD + Te) return ['e', Math.max(0, Math.min(1, (t - Tb - HOLD - i * SG) / D))];
    return ['e', 1];
  }
  function ease(x) { return .5 - Math.cos(Math.PI * x) / 2; }
  function render(t) {
    SEG.forEach(function (s, i) {
      var ph = phase(t, i), m = ph[0], u = ph[1], pos = ease(u) * (s.tot + LD), rel = Math.max(0, Math.min(s.ls, pos - s.la)), vis;
      s.run.style.visibility = (u > 0 && u < 1) ? 'visible' : 'hidden';
      s.run.setAttribute('stroke-dashoffset', LD - pos);
      if (m === 'b') { s.piece.setAttribute('stroke-dashoffset', s.ls - rel); vis = rel > .05; }
      else { s.piece.setAttribute('stroke-dashoffset', -rel); vis = rel < s.ls - .05; }
      s.piece.style.visibility = vis ? 'visible' : 'hidden';
    });
  }
  function loop(now) {
    var dt = Math.min(.05, (now - last) / 1000); last = now;
    if (!drag && now > resumeAt) { T += dt; if (T >= CYC) T -= CYC; }
    render(T); raf = requestAnimationFrame(loop);
  }
  function start() { if (!raf && !reduce) { last = performance.now(); raf = requestAnimationFrame(loop); } }
  function stop() { cancelAnimationFrame(raf); raf = 0; }

  /* Interacción: arrastrar recorre la construcción; al soltar sigue sola */
  function frac(e) { var r = box.getBoundingClientRect(); return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); }
  box.addEventListener('pointerdown', function (e) { drag = true; box.setPointerCapture(e.pointerId); T = frac(e) * Tb; });
  box.addEventListener('pointermove', function (e) { if (drag) T = frac(e) * Tb; });
  function up() { if (!drag) return; drag = false; resumeAt = performance.now() + 600; }
  box.addEventListener('pointerup', up); box.addEventListener('pointercancel', up);

  /* El recuadro se ajusta al hueco que deja el texto del título, sea cual sea la tipografía */
  function rects(l, key) {
    var t = l.querySelector('span').firstChild, r = document.createRange(); r.selectNodeContents(t);
    var rs = r.getClientRects(), m = key === 'right' ? 0 : 0, i;
    for (i = 0; i < rs.length; i++) m = Math.max(m, rs[i][key]);
    return m;
  }
  function fit() {
    if (innerWidth >= 760) { box.style.display = 'none'; stop(); return; }
    box.style.display = 'block'; start();
    var cr = cover.getBoundingClientRect(), g = parseFloat(getComputedStyle(cover).paddingLeft) || 20;
    desc.style.maxWidth = '';
    var left = Math.max(rects(l1, 'right'), rects(l2, 'right')) + 14 - cr.left, w = cr.width - left;
    desc.style.maxWidth = Math.max(120, left - g - 6) + 'px';
    var top = desc.getBoundingClientRect().top - cr.top, h = rects(l2, 'bottom') - cr.top - top - 10;
    if (w < 60 || h < 60) { box.style.display = 'none'; return; }
    box.style.left = left + 'px'; box.style.top = top + 'px'; box.style.width = w + 'px'; box.style.height = h + 'px';
    var sc = Math.min(w * .88 / 103, h * .94 / 92), vw = w / sc, vh = h / sc;
    var vb = (53.5 - vw / 2) + ' ' + (60 - vh / 2) + ' ' + vw + ' ' + vh;
    sv.setAttribute('viewBox', vb); sv2.setAttribute('viewBox', vb);
  }
  fit(); addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  setTimeout(fit, 300); setTimeout(fit, 1300);
  if (reduce) { T = Tb + .1; render(T); }
})();
