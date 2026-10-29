/**
 * Surah study page behaviour. The page is complete HTML without this; this adds the word box, the tabs, the questions,
 * the rail's "you are here" and "mark studied". Pure logic and HTML for the word box live in src/lib/surah-study.ts.
 */
import { detailHTML, withArabic, type StudyWord } from '../lib/surah-study';
import { isLessonComplete, markLessonComplete } from '../lib/progress';

const data = JSON.parse(document.getElementById('study-data')!.textContent!) as {
  words: Record<string, StudyWord[]>;
  quiz: Record<string, { answer: number; why: string }>;
};

// ---- the word box: tap a word, or walk the words with the arrow keys (Arabic runs right to left) ----
function showWord(section: HTMLElement, i: number) {
  const words = data.words[section.dataset.verse!];
  const w = words[i];
  if (!w) return;
  section.querySelectorAll<HTMLElement>('.verse .w').forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
  const box = section.querySelector<HTMLElement>('[data-detail]')!;
  box.className = `detail ${w.t}`;
  box.innerHTML = detailHTML(w);
}
document.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLElement>('.verse .w');
  if (b) showWord(b.closest<HTMLElement>('.vs')!, +b.dataset.i!);
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  const b = (e.target as HTMLElement).closest<HTMLElement>('.verse .w');
  if (!b) return;
  e.preventDefault();
  const section = b.closest<HTMLElement>('.vs')!;
  const buttons = [...section.querySelectorAll<HTMLElement>('.verse .w')];
  const n = Math.min(buttons.length - 1, Math.max(0, +b.dataset.i! + (e.key === 'ArrowLeft' ? 1 : -1)));
  showWord(section, n);
  buttons[n].focus();
});

// ---- why it is written this way: Syntax, Word forms, Style ----
document.addEventListener('click', (e) => {
  const t = (e.target as HTMLElement).closest<HTMLElement>('.tab');
  if (!t) return;
  const why = t.closest<HTMLElement>('.why')!;
  why.querySelectorAll('.tab').forEach((x) => x.setAttribute('aria-selected', String(x === t)));
  why.querySelectorAll<HTMLElement>('.layer').forEach((p) => {
    if (p.dataset.key === t.dataset.key) p.removeAttribute('data-off');
    else p.setAttribute('data-off', '');
  });
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  const t = (e.target as HTMLElement).closest<HTMLElement>('.tab');
  if (!t) return;
  e.preventDefault();
  const tabs = [...t.parentElement!.querySelectorAll<HTMLElement>('.tab')];
  const n = (tabs.indexOf(t) + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  tabs[n].focus();
  tabs[n].click();
});

// ---- the question under each verse ----
document.addEventListener('click', (e) => {
  const o = (e.target as HTMLElement).closest<HTMLElement>('.try .opt');
  if (!o) return;
  const box = o.closest<HTMLElement>('.try')!;
  const q = data.quiz[box.closest<HTMLElement>('.vs')!.dataset.verse!];
  const ok = +o.dataset.i! === q.answer;
  box.querySelectorAll<HTMLElement>('.opt').forEach((x) => {
    x.setAttribute('aria-pressed', 'false');
    x.classList.remove('right', 'wrong');
    x.querySelector('.mark')!.textContent = '';
  });
  o.setAttribute('aria-pressed', 'true');
  o.classList.add(ok ? 'right' : 'wrong');
  o.querySelector('.mark')!.textContent = ok ? 'Correct' : 'Not this one';
  box.querySelector('.fb')!.innerHTML = ok ? withArabic(q.why) : 'Look at the word again and read its role in the box above, then try another answer.';
});

// ---- the rail follows what is being read ----
const links = [...document.querySelectorAll<HTMLAnchorElement>('#nav a[data-id]')];
const nav = document.getElementById('nav')!;
function mark(id: string) {
  let active: HTMLAnchorElement | undefined;
  links.forEach((a) => {
    if (a.dataset.id === id) { a.setAttribute('aria-current', 'true'); active = a; } else a.removeAttribute('aria-current');
  });
  if (!active) return;
  // keep the link in view inside the rail without moving the page
  const horizontal = nav.scrollWidth > nav.clientWidth + 1 && getComputedStyle(nav).flexDirection === 'row';
  if (horizontal) nav.scrollLeft = active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2;
  else if (active.offsetTop < nav.scrollTop || active.offsetTop + active.offsetHeight > nav.scrollTop + nav.clientHeight) nav.scrollTop = active.offsetTop - nav.clientHeight / 2;
}
const io = new IntersectionObserver((entries) => {
  for (const en of entries) if (en.isIntersecting) mark(en.target.id);
}, { rootMargin: '-20% 0px -70% 0px' });
links.forEach((a) => { const s = document.getElementById(a.dataset.id!); if (s) io.observe(s); });

// ---- mark studied ----
async function initComplete() {
  const section = document.getElementById('complete-section');
  const btn = document.getElementById('complete-btn') as HTMLButtonElement | null;
  const text = document.getElementById('complete-btn-text');
  const status = document.getElementById('complete-status');
  if (!section || !btn || !text || !status) return;
  const slug = section.dataset.lessonSlug ?? '';
  const done = () => { btn.hidden = true; status.hidden = false; };
  if (await isLessonComplete(slug)) { done(); return; }
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    text.textContent = 'Saving…';
    if (await markLessonComplete(slug)) done();
    else { btn.disabled = false; text.textContent = 'Mark surah studied'; }
  });
}
initComplete();
