// Tiny behaviour for the mockups: tab groups, bottom sheets, rail dots.
document.querySelectorAll('[data-tabs]').forEach((g) => {
  const btns = g.querySelectorAll('[data-t]'), panels = g.querySelectorAll('[data-p]');
  btns.forEach((b) => b.addEventListener('click', () => {
    btns.forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    panels.forEach((p) => (p.hidden = p.dataset.p !== b.dataset.t));
  }));
});
document.querySelectorAll('[data-sheet]').forEach((b) => b.addEventListener('click', () => {
  document.getElementById(b.dataset.sheet).classList.add('open');
}));
document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => b.closest('.sheet').classList.remove('open')));
document.querySelectorAll('[data-dots]').forEach((r) => {
  const d = document.getElementById(r.dataset.dots)?.children;
  if (!d) return;
  r.addEventListener('scroll', () => {
    const i = Math.round(r.scrollLeft / (r.scrollWidth / r.children.length));
    [...d].forEach((x, k) => x.classList.toggle('on', k === i));
  }, { passive: true });
});
document.querySelectorAll('.chips-pick').forEach((g) => g.addEventListener('click', (e) => {
  const c = e.target.closest('.chip'); if (!c) return;
  g.querySelectorAll('.chip').forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
}));
