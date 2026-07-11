// Anatomy Lab chrome: reveal-on-scroll, station rail scrollspy/progress,
// and the "words touched" telemetry counter fed by ArabicExample's
// `lab:word-touched` events (see ArabicExample.astro's inline script).
// No innerHTML anywhere in this file — createElement/textContent only.

let scrollBound = false;

function initLabLesson() {
  const root = document.documentElement;
  root.classList.add('js');
  const rmq = matchMedia('(prefers-reduced-motion: reduce)');

  // ---------- reveal-on-scroll ----------
  const revealables = document.querySelectorAll<HTMLElement>('.lab [data-reveal]');
  if (revealables.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('on');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.05 }
    );
    revealables.forEach((el) => io.observe(el));
  }

  // ---------- station rail ----------
  const rail = document.querySelector<HTMLElement>('.lab .rail[data-lesson-toc]');
  if (!rail) return;

  // Stations are real <a href="#slug"> anchors (works with JS disabled);
  // when JS is on, intercept for a smooth/instant scroll per reduced-motion.
  // Pair each station link with its resolved target element up front, dropping
  // any station whose target id doesn't exist. Keeping them paired (rather than
  // two parallel arrays filtered independently) guarantees the scrollspy can
  // never highlight the wrong station if a target ever fails to resolve.
  const allStations = Array.from(rail.querySelectorAll<HTMLAnchorElement>('.station[data-station-target]'));
  const pairs = allStations
    .map((station) => ({ station, target: document.getElementById(station.dataset.stationTarget || '') }))
    .filter((p): p is { station: HTMLAnchorElement; target: HTMLElement } => !!p.target);
  const stations = pairs.map((p) => p.station);
  const targets = pairs.map((p) => p.target);

  pairs.forEach(({ station, target }) => {
    station.addEventListener('click', (e) => {
      e.preventDefault();
      target.scrollIntoView({ behavior: rmq.matches ? 'auto' : 'smooth' });
    });
  });

  const pctEl = rail.querySelector<HTMLElement>('[data-rail-pct]');
  const fillEl = rail.querySelector<HTMLElement>('[data-rail-fill]');
  const touchEl = rail.querySelector<HTMLElement>('[data-rail-touch]');

  function updateRail() {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - innerHeight;
    const pct = scrollable > 0 ? Math.max(0, Math.min(1, scrollY / scrollable)) : 0;
    const label = `${Math.round(pct * 100)}%`;
    if (pctEl) pctEl.textContent = label;
    if (fillEl) fillEl.style.width = label;

    const y = scrollY + innerHeight * 0.38;
    let litIdx = 0;
    for (let i = 0; i < targets.length; i++) {
      if (targets[i].offsetTop <= y) litIdx = i;
    }
    stations.forEach((s, i) => {
      s.classList.toggle('lit', i === litIdx);
      s.classList.toggle('past', i < litIdx);
      if (i === litIdx) s.setAttribute('aria-current', 'location');
      else s.removeAttribute('aria-current');
    });
  }

  if (!scrollBound) {
    scrollBound = true;
    addEventListener('scroll', updateRail, { passive: true });
    addEventListener('resize', updateRail, { passive: true });
    let touched = 0;
    document.addEventListener('lab:word-touched', () => {
      touched++;
      if (touchEl) touchEl.textContent = String(touched);
    });
  }
  updateRail();
}

initLabLesson();
document.addEventListener('astro:page-load', initLabLesson);
document.addEventListener('astro:after-swap', () => {
  document.documentElement.dataset.theme = 'dark';
});
