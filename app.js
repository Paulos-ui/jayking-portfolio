(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const body = document.body;
  const gate = $('#gate');
  const enter = $('#enterSite');
  const nav = $('#siteNav');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

  // --- Entry / fallback-safe gate -------------------------------------------------
  let entered = false;
  function enterPortfolio(event) {
    if (event) event.preventDefault();
    if (entered) return;
    entered = true;

    if (gate) {
      gate.classList.add('is-entering');
      gate.setAttribute('aria-hidden', 'true');
      window.setTimeout(() => gate.classList.add('is-gone'), reduceMotion ? 0 : 420);
    }
    body.classList.remove('gate-open');
    body.classList.add('entered');

    // Always move the visitor to the portfolio even if the transition is interrupted.
    window.setTimeout(() => {
      const home = $('#home');
      if (home) home.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      $$('.hero .reveal').forEach(el => el.classList.add('in'));
    }, reduceMotion ? 0 : 520);
  }

  if (enter) {
    enter.addEventListener('click', enterPortfolio, { passive: false });
    enter.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') enterPortfolio(e);
    });
  }
  window.enterJaykingPortfolio = enterPortfolio;

  // Escape is a small accessibility shortcut to enter the portfolio.
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !entered) enterPortfolio(e);
  });

  // --- Pointer light / custom cursor ----------------------------------------------
  const dot = $('.cursor-dot');
  const ring = $('.cursor-ring');
  let mx = innerWidth * .58;
  let my = innerHeight * .34;
  let rx = mx;
  let ry = my;

  function updatePointer(x, y) {
    mx = x;
    my = y;
    document.documentElement.style.setProperty('--mx', `${mx}px`);
    document.documentElement.style.setProperty('--my', `${my}px`);
    if (dot) {
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
    }

    // The gate portrait reacts to the cursor anywhere on the opening scene.
    const pfp = $('#gatePfp');
    if (pfp && !coarsePointer) {
      const nx = (mx / innerWidth) - .5;
      const ny = (my / innerHeight) - .5;
      pfp.style.setProperty('--king-ry', `${nx * 10}deg`);
      pfp.style.setProperty('--king-rx', `${ny * -8}deg`);
      pfp.style.setProperty('--king-tx', `${nx * 12}px`);
      pfp.style.setProperty('--king-ty', `${ny * 9}px`);
    }
  }

  window.addEventListener('pointermove', e => updatePointer(e.clientX, e.clientY), { passive: true });
  window.addEventListener('touchmove', e => {
    const t = e.touches && e.touches[0];
    if (t) updatePointer(t.clientX, t.clientY);
  }, { passive: true });

  function cursorLoop() {
    rx += (mx - rx) * .14;
    ry += (my - ry) * .14;
    if (ring) {
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
    }
    requestAnimationFrame(cursorLoop);
  }
  if (!coarsePointer) cursorLoop();

  $$('a,button').forEach(el => {
    el.addEventListener('mouseenter', () => ring?.classList.add('is-link'));
    el.addEventListener('mouseleave', () => ring?.classList.remove('is-link'));
  });

  // --- Local 3D portrait response --------------------------------------------------
  $$('.interactive-king').forEach(el => {
    el.addEventListener('pointermove', e => {
      if (coarsePointer) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      el.style.setProperty('--king-ry', `${x * 12}deg`);
      el.style.setProperty('--king-rx', `${y * -10}deg`);
      el.style.setProperty('--king-tx', `${x * 8}px`);
      el.style.setProperty('--king-ty', `${y * 6}px`);
    });
    el.addEventListener('pointerleave', () => {
      if (el.id === 'gatePfp') return; // gate keeps following the global pointer
      el.style.setProperty('--king-ry', '0deg');
      el.style.setProperty('--king-rx', '0deg');
      el.style.setProperty('--king-tx', '0px');
      el.style.setProperty('--king-ty', '0px');
    });
  });

  // --- Reveal system ---------------------------------------------------------------
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in');
    }), { threshold: .10, rootMargin: '0px 0px -5% 0px' });
    $$('.reveal').forEach(el => revealObserver.observe(el));

    const railLinks = $$('.rail a');
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        railLinks.forEach(a => a.classList.toggle('active', a.dataset.section === entry.target.id));
      }
    }), { threshold: .32 });
    $$('.observe').forEach(s => sectionObserver.observe(s));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in'));
  }

  window.addEventListener('scroll', () => nav?.classList.toggle('scrolled', scrollY > 25), { passive: true });

  // --- Card tilt -------------------------------------------------------------------
  $$('.tilt-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      if (coarsePointer) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.setProperty('--ry', `${x * 5.5}deg`);
      card.style.setProperty('--rx', `${y * -5.5}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--rx', '0deg');
    });
  });

  // --- Magnetic actions ------------------------------------------------------------
  $$('.magnetic').forEach(el => {
    el.addEventListener('pointermove', e => {
      if (coarsePointer) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate3d(${x * .075}px,${y * .075}px,0)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });

  // --- Ambient signal field --------------------------------------------------------
  const canvas = $('#signalField');
  const ctx = canvas?.getContext?.('2d');
  let points = [];
  let dpr = Math.min(devicePixelRatio || 1, 1.5);

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = coarsePointer
      ? Math.min(34, Math.max(20, Math.floor(innerWidth / 15)))
      : Math.min(78, Math.max(36, Math.floor(innerWidth / 22)));
    points = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      vx: (Math.random() - .5) * .12,
      vy: (Math.random() - .5) * .12,
      r: Math.random() * 1.25 + .3,
      gold: i % 4 === 0
    }));
  }
  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();

  function drawField() {
    if (!ctx) return;
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (const p of points) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10 || p.x > innerWidth + 10) p.vx *= -1;
      if (p.y < -10 || p.y > innerHeight + 10) p.vy *= -1;

      const dx = mx - p.x;
      const dy = my - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 220 && !coarsePointer) {
        p.x -= dx * .00045;
        p.y -= dy * .00045;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold ? 'rgba(233,195,77,.44)' : 'rgba(104,240,79,.28)';
      ctx.fill();
    }

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i], b = points[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 105) {
          const alpha = (1 - d / 105) * .075;
          ctx.strokeStyle = `rgba(220,194,105,${alpha})`;
          ctx.lineWidth = .55;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // A restrained cursor constellation makes the entry feel responsive.
    if (!coarsePointer) {
      const near = points.filter(p => Math.hypot(p.x - mx, p.y - my) < 155).slice(0, 5);
      near.forEach(p => {
        ctx.strokeStyle = 'rgba(217,183,77,.10)';
        ctx.lineWidth = .65;
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      });
    }

    requestAnimationFrame(drawField);
  }
  if (ctx && !reduceMotion) drawField();

  // --- GitHub live site sync -------------------------------------------------------
  const liveBuilds = $('#liveBuilds');
  const ghStatus = $('#githubStatus');
  const ghPulse = $('.github-state');
  const fallback = [
    { name: 'lp-copilot', homepage: 'https://lp-copilot.vercel.app', html_url: 'https://github.com/Paulos-ui/lp-copilot', description: 'AI-powered LP portfolio dashboard for Solana.', language: 'JavaScript' },
    { name: 'umbra', homepage: 'https://umbra.vercel.app', html_url: 'https://github.com/Paulos-ui/umbra', description: 'Confidential batch router built around iExec Nox and Uniswap.', language: 'TypeScript' }
  ];

  function safeText(value = '') {
    return String(value).replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  }

  function renderBuilds(items, live = false) {
    if (!liveBuilds) return;
    liveBuilds.innerHTML = items.map(r => `
      <a class="live-build" href="${safeText(r.homepage)}" target="_blank" rel="noreferrer">
        <div><h4>${safeText(String(r.name).replaceAll('-', ' '))}</h4><p>${safeText(r.description || 'Live Web3 build from the Paulos-ui GitHub profile.')}</p></div>
        <div class="live-build-foot"><span>${safeText(r.language || 'WEB')}</span><span>LIVE ↗</span></div>
      </a>`).join('');
    if (ghStatus) ghStatus.textContent = live ? `${items.length} live sites synced` : 'Showing curated live sites';
    ghPulse?.classList.toggle('live', live);
  }

  async function syncGithub() {
    if (!liveBuilds) return;
    try {
      const cache = JSON.parse(localStorage.getItem('jayking-live-repos') || 'null');
      if (cache && Date.now() - cache.at < 30 * 60 * 1000) {
        renderBuilds(cache.items, true);
        return;
      }
      const response = await fetch('https://api.github.com/users/Paulos-ui/repos?per_page=100&sort=updated', {
        headers: { Accept: 'application/vnd.github+json' }
      });
      if (!response.ok) throw new Error('GitHub rate limit');
      const repos = await response.json();
      const items = repos
        .filter(x => !x.fork && x.homepage && /^https?:\/\//.test(x.homepage))
        .map(x => ({ name: x.name, homepage: x.homepage, html_url: x.html_url, description: x.description, language: x.language }));
      if (!items.length) throw new Error('No live sites');
      localStorage.setItem('jayking-live-repos', JSON.stringify({ at: Date.now(), items }));
      renderBuilds(items, true);
    } catch (_) {
      renderBuilds(fallback, false);
    }
  }
  syncGithub();

  // --- Horizontal role deck wheel assist -----------------------------------------
  const deck = $('#roleDeck');
  if (deck) {
    deck.addEventListener('wheel', e => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && deck.scrollWidth > deck.clientWidth) {
        deck.scrollLeft += e.deltaY * .65;
        e.preventDefault();
      }
    }, { passive: false });
  }
})();
