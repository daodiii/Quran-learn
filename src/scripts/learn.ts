/**
 * /learn behaviour. The page is complete HTML without this; this adds saved progress, the filter,
 * the level rail's "you are here", and the phone fold. Pure logic lives in src/lib/learn.ts.
 */
import { getCompletedLessons } from '../lib/progress';
import { levelProgress, matchesQuery, nextLesson, queryWords } from '../lib/learn';

function span(className: string, text: string) {
  const el = document.createElement('span');
  el.className = className;
  el.textContent = text;
  return el;
}

const list = document.querySelector<HTMLElement>('#list')!;
const rows = [...list.querySelectorAll<HTMLAnchorElement>('.row')];
const levels = [...list.querySelectorAll<HTMLElement>('.lvl')];
const railLinks = [...document.querySelectorAll<HTMLAnchorElement>('.lv')];
const phone = matchMedia('(max-width:760px)');

const course = rows.map((el) => ({ id: el.dataset.id!, level: +el.dataset.level!, el }));
const done = new Set(getCompletedLessons());
const next = nextLesson(course, done);

// ---- saved progress ----
function showProgress() {
  for (const r of course) {
    if (!done.has(r.id)) continue;
    r.el.classList.add('done');
    r.el.querySelector('.t b')?.append(span('vh', ', done'));
  }
  const perLevel = levelProgress(course, done);
  for (const section of levels) {
    const n = +section.dataset.level!;
    const p = perLevel.get(n)!;
    const pct = Math.round((100 * p.done) / p.total);
    const complete = p.done === p.total;
    section.classList.toggle('complete', complete);
    section.querySelector('.ptxt')!.textContent = complete ? `All ${p.total} done` : `${p.done} of ${p.total} done`;
    (section.querySelector('.prog') as HTMLElement).style.setProperty('--p', `${pct}%`);
    const link = railLinks.find((a) => +a.dataset.level! === n);
    if (link) {
      link.classList.toggle('done', complete);
      link.querySelector('.lcount')!.textContent = `${p.done} of ${p.total}`;
      (link.querySelector('small') as HTMLElement).style.setProperty('--p', `${pct}%`);
      if (complete) link.querySelector('.ln')!.replaceChildren(list.querySelector('.tick svg')!.cloneNode(true));
    }
  }
}

function showNext() {
  const resume = document.querySelector<HTMLElement>('#resume')!;
  if (done.size === 0) return; // first visit: "Start here" stays on lesson 1
  list.querySelector('[data-start]')?.remove();
  if (!next) {
    document.querySelector('#resume-title')!.textContent = 'All lessons complete. Revisit any time.';
    document.querySelector<HTMLElement>('#resume-link')!.hidden = true;
    resume.hidden = false;
    return;
  }
  next.el.classList.add('next');
  next.el.querySelector('.tags')?.prepend(span('tag next', 'Up next'));
  const levelTotal = course.filter((r) => r.level === next.level).length;
  const order = next.el.querySelector('.n')!.textContent;
  document.querySelector('#resume-title')!.textContent = `Level ${next.level} · Lesson ${order} of ${levelTotal}: ${next.el.querySelector('.t b')!.firstChild!.textContent}`;
  document.querySelector<HTMLAnchorElement>('#resume-link')!.href = next.el.getAttribute('href')!;
  resume.hidden = false;
}

// ---- filter ----
const input = document.querySelector<HTMLInputElement>('#q')!;
const form = document.querySelector<HTMLElement>('#find')!;
const count = document.querySelector<HTMLElement>('#count')!;
const empty = document.querySelector<HTMLElement>('#empty')!;
const total = +count.dataset.total!;
const levelCount = +count.dataset.levels!;

function applyFilter() {
  const words = queryWords(input.value);
  const filtering = words.length > 0;
  list.classList.toggle('filtering', filtering);
  document.body.classList.toggle('filtering', filtering);
  form.classList.toggle('has', input.value.length > 0);
  let shown = 0;
  for (const r of rows) {
    const ok = matchesQuery(r.dataset.q!, words);
    r.hidden = !ok;
    if (ok) shown++;
  }
  list.querySelectorAll<HTMLElement>('.grp').forEach((g) => { g.hidden = !g.querySelector('.row:not([hidden])'); });
  levels.forEach((s) => { s.hidden = !s.querySelector('.row:not([hidden])'); });
  count.textContent = filtering ? `${shown} of ${total} lessons` : `${total} lessons in ${levelCount} levels`;
  empty.hidden = shown !== 0;
}

input.addEventListener('input', applyFilter);
form.querySelector('.clear')!.addEventListener('click', () => { input.value = ''; applyFilter(); input.focus(); });
addEventListener('keydown', (e) => {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement as HTMLElement | null)?.tagName ?? '');
  if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey) { e.preventDefault(); input.focus(); }
  if (e.key === 'Escape' && document.activeElement === input) { input.value = ''; applyFilter(); }
});

// ---- phone fold: open only the level that holds the next lesson ----
function setOpen(section: HTMLElement, open: boolean) {
  section.dataset.collapsed = String(!open);
  section.querySelector('.fold')!.setAttribute('aria-expanded', String(open));
}
levels.forEach((s) => s.querySelector('.fold')!.addEventListener('click', () => setOpen(s, s.dataset.collapsed === 'true')));
const current = next ? next.level : 1;
const hashed = /^#level-(\d)$/.exec(location.hash)?.[1];
levels.forEach((s) => setOpen(s, !phone.matches || +s.dataset.level! === (hashed ? +hashed : current)));
// A rail link to a folded level opens it first.
railLinks.forEach((a) => a.addEventListener('click', () => {
  const s = levels.find((x) => +x.dataset.level! === +a.dataset.level!);
  if (s) setOpen(s, true);
}));

// ---- rail: mark the level being read ----
function markLevel(n: number) {
  railLinks.forEach((a) => (+a.dataset.level! === n ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
}
markLevel(hashed ? +hashed : 1);
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) markLevel(+(e.target as HTMLElement).dataset.level!);
}, { rootMargin: '-20% 0px -70% 0px' });
levels.forEach((s) => io.observe(s));

showProgress();
showNext();
applyFilter();
