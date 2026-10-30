// The ADHD Rebuild
// Paste the Skool About page link here when the group is live.
// While it is empty, the join buttons scroll to the last section.
const SKOOL_URL = 'https://www.skool.com/adhd-rebuild-7856/about';

(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  // Join buttons
  document.querySelectorAll('.js-join').forEach((a) => {
    if (SKOOL_URL) {
      a.href = SKOOL_URL;
      a.target = '_blank';
      a.rel = 'noopener';
    }
  });
  const endBtn = document.querySelector('.door-copy .js-join');
  if (!SKOOL_URL && endBtn) {
    endBtn.textContent = 'Group opens soon';
    endBtn.classList.add('is-soon');
    endBtn.removeAttribute('href');
    endBtn.setAttribute('aria-disabled', 'true');
  } else {
    document.querySelector('.js-join-note')?.remove();
  }

  // Door bricks
  const g = document.querySelector('.door-bricks');
  if (g) {
    let out = '';
    for (let row = 0; row < 12; row++) {
      const y = 10 + row * 20;
      const off = row % 2 ? -20 : 0;
      for (let x = 10 + off; x < 210; x += 40) {
        const x0 = Math.max(10, x), x1 = Math.min(210, x + 40);
        if (x1 <= x0) continue;
        if (x1 > 60 && x0 < 160 && y + 20 > 60) continue;
        const red = (row * 7 + x) % 5 === 0 ? ' class="r"' : '';
        out += `<rect${red} x="${x0}" y="${y}" width="${x1 - x0}" height="20"/>`;
      }
    }
    g.innerHTML = out;
  }

  // Helper: add .is-on while a section is on screen
  const whenSeen = (el, cb, threshold = 0.3, once = false) => {
    if (!el) return;
    if (!hasIO) { cb(true); return; }
    const io = new IntersectionObserver(([e]) => {
      cb(e.isIntersecting);
      if (once && e.isIntersecting) io.disconnect();
    }, { threshold });
    io.observe(el);
  };

  // Reveal on scroll
  const items = document.querySelectorAll('.reveal');
  if (reduce || !hasIO) {
    items.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const sibs = [...e.target.parentElement.children].filter((c) => c.classList.contains('reveal'));
        e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 8) * 90}ms`;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  }

  // Stop 1: notifications and the gym clock ticking toward two hours
  const scene = document.querySelector('.phone-scene');
  const clock = document.querySelector('[data-clock]');
  let clockTimer = null, mins = 0;
  const fmt = (m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
  whenSeen(scene, (on) => {
    scene.classList.toggle('is-on', on);
    clearInterval(clockTimer);
    if (!on) return;
    if (reduce) { clock.textContent = fmt(118); return; }
    clockTimer = setInterval(() => {
      mins = mins >= 118 ? 0 : mins + 2;
      clock.textContent = fmt(mins);
    }, 120);
  }, 0.25);

  // Stop 2: old way vs the rebuild bars
  const versus = document.querySelector('[data-versus]');
  whenSeen(versus, (on) => on && versus.classList.add('is-on'), 0.5, true);

  // Stop 3: poke the bricks (tap on phones)
  document.querySelectorAll('.brick-step').forEach((b) => {
    b.addEventListener('click', () => {
      const was = b.classList.contains('is-poked');
      document.querySelectorAll('.brick-step.is-poked').forEach((x) => x.classList.remove('is-poked'));
      if (!was) b.classList.add('is-poked');
    });
    b.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); }
    });
  });
  // bricks wobble once as they land
  const wall = document.querySelector('.wall');
  whenSeen(wall, (on) => {
    if (!on || reduce) return;
    wall.querySelectorAll('.brick-step').forEach((b, i) => {
      setTimeout(() => { b.classList.add('wobble'); setTimeout(() => b.classList.remove('wobble'), 520); }, 700 + i * 160);
    });
  }, 0.4, true);

  // Anime to real swap: button, plus one automatic swap while scrolling past
  const swap = document.querySelector('[data-swap]');
  const btn = document.getElementById('swap-toggle');
  if (swap && btn) {
    const setReal = (on) => {
      swap.classList.toggle('is-real', on);
      btn.setAttribute('aria-pressed', String(on));
      btn.textContent = on ? 'Show anime me' : 'Show the real me';
    };
    btn.addEventListener('click', () => setReal(!swap.classList.contains('is-real')));
    if (!reduce) whenSeen(swap, (on) => on && setTimeout(() => setReal(true), 900), 0.7, true);
  }

  // Door opens when it comes into view
  const door = document.querySelector('.door-end');
  whenSeen(door, (on) => door.classList.toggle('is-open', on), 0.45);

  // Rebuild meter
  const hero = document.querySelector('.hero');
  const meter = document.querySelector('.rebuild-meter');
  const mwall = meter?.querySelector('.rm-wall');
  const BRICKS = 12;
  const order = [8, 9, 10, 11, 4, 5, 6, 7, 0, 1, 2, 3]; // bottom row first
  if (mwall) mwall.innerHTML = '<i></i>'.repeat(BRICKS);
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    if (!meter) return;
    meter.classList.toggle('is-on', scrollY > hero.offsetHeight - 80);
    const max = document.documentElement.scrollHeight - innerHeight;
    const n = Math.round((scrollY / Math.max(max, 1)) * BRICKS);
    [...mwall.children].forEach((c, i) => c.classList.toggle('on', order.indexOf(i) < n));
  };
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
})();
