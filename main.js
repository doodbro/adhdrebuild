/* Optional enhancement. Content, join links and native FAQs work without JS. */
(() => {
  const bar = document.querySelector('.mobile-join');
  if (!bar || !('IntersectionObserver' in window)) return;
  // The page has no fixed bar without JS. Enable only after initial observation.
  // Keep one join action visible. Do not cover a focused footer/FAQ link.
  const visible = new Set();
  const targets = document.querySelectorAll('.hero [data-cta], .offer-card [data-cta], .final-cta [data-cta], .footer');
  const update = () => {
    const focused = document.activeElement;
    const interactive = focused && focused.matches('a, summary, button, input, select, textarea');
    const rect = interactive ? focused.getBoundingClientRect() : null;
    const overlapsFocus = rect && !bar.contains(focused) && rect.top < innerHeight && rect.bottom > innerHeight - bar.offsetHeight - 8;
    const hidden = visible.size > 0 || overlapsFocus || innerWidth > 760;
    bar.classList.toggle('is-hidden', hidden);
  };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    update();
    bar.classList.add('is-enabled');
  }, {threshold: 0});
  targets.forEach(target => observer.observe(target));
  document.addEventListener('focusin', update);
  document.addEventListener('focusout', () => requestAnimationFrame(update));
  window.addEventListener('scroll', update, {passive: true});
  window.addEventListener('resize', update);
})();
