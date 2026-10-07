const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== Tarjetas: inclinación 3D, luz que sigue al cursor, onda al clic ===== */
if (!calm) {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', x * 100 + '%');
      card.style.setProperty('--my', y * 100 + '%');
      card.style.setProperty('--ry', (x - .5) * 12 + 'deg');
      card.style.setProperty('--rx', (.5 - y) * 12 + 'deg');
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
    card.addEventListener('pointerdown', e => {
      const r = card.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2;
      const rip = document.createElement('span');
      rip.className = 'ripple';
      rip.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
      card.append(rip);
      setTimeout(() => rip.remove(), 700);
    });
  });
}

/* ===== Chispas doradas flotando ===== */
(function sparkles() {
  if (calm) return;
  const cv = document.getElementById('sparkles'), ctx = cv.getContext('2d');
  let w, h, dots;
  const make = () => ({
    x: Math.random() * w, y: Math.random() * h,
    r: Math.random() * 1.8 + .4, vy: -(Math.random() * .3 + .08),
    vx: (Math.random() - .5) * .15, p: Math.random() * 6.28,
    c: Math.random() < .7 ? '232,185,74' : '190,150,255'
  });
  function resize() {
    const dpr = devicePixelRatio || 1;
    w = innerWidth; h = innerHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dots = Array.from({ length: Math.min(70, Math.floor(w / 16)) }, make);
  }
  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      d.x += d.vx; d.y += d.vy; d.p += .02;
      if (d.y < -10) { d.y = h + 10; d.x = Math.random() * w; }
      const a = .25 + Math.sin(d.p) * .25;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, 6.28);
      ctx.fillStyle = `rgba(${d.c},${a})`;
      ctx.shadowColor = `rgba(${d.c},.8)`; ctx.shadowBlur = 8;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  addEventListener('resize', resize);
  resize(); tick();
})();
