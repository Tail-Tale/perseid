(function() {
  // Custom cursor
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursorTrail');
  let mx = 0, my = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = (mx - 3) + 'px';
    cursor.style.top = (my - 3) + 'px';
  });
  function animateTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = (tx - 15) + 'px';
    trail.style.top = (ty - 15) + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Stars
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [];
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({length: 180}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.1 + 0.2,
      alpha: Math.random() * 0.55 + 0.15,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.005 + 0.001
    }));
  }
  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      const a = s.alpha * (0.55 + 0.45 * Math.sin(t * s.speed * 60 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,255,${a})`;
      ctx.fill();
    }
    requestAnimationFrame(t2 => draw(t2 / 1000));
  }
  resize();
  draw(0);
  window.addEventListener('resize', resize);

  // Nav
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50));

  // Scroll reveal
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, {threshold: 0.12});
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // Character zoom
  const meruImg = document.getElementById('meruImg');
  const zoomOverlay = document.getElementById('zoomOverlay');
  if (meruImg && zoomOverlay) {
    meruImg.addEventListener('click', () => zoomOverlay.classList.add('active'));
    zoomOverlay.addEventListener('click', () => zoomOverlay.classList.remove('active'));
  }
})();

  // ===== LOADING SCREEN =====
  (function() {
    const loader  = document.getElementById('loader');
    const fill    = document.getElementById('loaderFill');
    const pct     = document.getElementById('loaderPercent');
    const logoEl  = document.getElementById('loaderLogo');

    // Mirror logo from nav
    const navLogo = document.querySelector('.nav-logo');
    if (navLogo) logoEl.src = navLogo.src;

    // Scatter twinkling bg stars
    const bg = document.getElementById('loaderBgStars');
    for (let i = 0; i < 100; i++) {
      const s = document.createElement('div');
      s.className = 'lstar';
      const sz = (Math.random() * 1.8 + 0.5).toFixed(1);
      s.style.cssText =
        `left:${(Math.random()*100).toFixed(1)}%;` +
        `top:${(Math.random()*100).toFixed(1)}%;` +
        `width:${sz}px;height:${sz}px;` +
        `--dur:${(Math.random()*3+1.8).toFixed(1)}s;` +
        `--delay:-${(Math.random()*5).toFixed(1)}s;`;
      bg.appendChild(s);
    }

    // Progress animation — eased, ~2.8s total
    const duration = 2800;
    const start = performance.now();
    document.body.style.overflow = 'hidden';

    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      // Ease in-out quad
      const e = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
      const v = Math.round(e * 100);
      fill.style.width = v + '%';
      pct.textContent  = v + '%';
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        setTimeout(() => {
          loader.classList.add('hidden');
          document.body.style.overflow = '';
        }, 350);
      }
    }
    requestAnimationFrame(step);
  })();

  // ===== COUNTDOWN =====
  (function() {
    var LAUNCH = new Date('2026-03-14T00:00:00+09:00');
    var cdEl = document.getElementById('countdown');
    if (!cdEl) return;

    // Already past launch date
    if (Date.now() >= LAUNCH.getTime()) {
      cdEl.remove();
      return;
    }

    // Hide main content behind countdown
    document.getElementById('loader').style.display = 'none';
    document.body.style.overflow = 'hidden';

    // Scatter stars
    var bg = document.getElementById('countdownStars');
    for (var i = 0; i < 120; i++) {
      var s = document.createElement('div');
      s.className = 'lstar';
      var sz = (Math.random() * 1.8 + 0.5).toFixed(1);
      s.style.cssText =
        'left:' + (Math.random()*100).toFixed(1) + '%;' +
        'top:' + (Math.random()*100).toFixed(1) + '%;' +
        'width:' + sz + 'px;height:' + sz + 'px;' +
        '--dur:' + (Math.random()*3+1.8).toFixed(1) + 's;' +
        '--delay:-' + (Math.random()*5).toFixed(1) + 's;';
      bg.appendChild(s);
    }

    var dEl = document.getElementById('cdDays');
    var hEl = document.getElementById('cdHours');
    var mEl = document.getElementById('cdMins');
    var sEl = document.getElementById('cdSecs');

    function tick() {
      var diff = LAUNCH.getTime() - Date.now();
      if (diff <= 0) {
        cdEl.classList.add('hidden');
        document.body.style.overflow = '';
        document.getElementById('loader').style.display = '';
        return;
      }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      dEl.textContent = String(d).padStart(2, '0');
      hEl.textContent = String(h).padStart(2, '0');
      mEl.textContent = String(m).padStart(2, '0');
      sEl.textContent = String(s).padStart(2, '0');
      requestAnimationFrame(tick);
    }
    tick();
  })();
