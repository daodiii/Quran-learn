/**
 * Home page behaviour. The page arrives with every tool already rendered (src/pages/index.astro);
 * this script makes them work, runs the tour, and offers returning learners their next lesson.
 * A tour step is a short scripted demo; any real input inside the window ends the tour for good.
 */
import { LESSON_STEPS, LESSON_FEEDBACK, ROOTS, LOOKUP, LOOKUP_KEYS, ROOT_KEYS, DUA, lookupResult, decoderReadout, rootStats, barHeight, surahLine, readerText, readerCard, verbCells, verbDetail, verbDefaultForm, type VerbRoot, type LookupKey, type RootKey, type ReaderSurah } from '../lib/home-tools';
import { parseResume } from '../lib/lesson-steps';
import { getCompletedLessons } from '../lib/progress';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector(sel) as T;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll(sel)] as T[];

/** A demo script: timed steps that a real visitor can cancel. */
function runner() {
  let ids: number[] = [];
  let off = false;
  return {
    at(ms: number, fn: () => void) { if (!off) ids.push(window.setTimeout(() => { if (!off) fn(); }, reduce ? 0 : ms)); },
    clear() { ids.forEach(clearTimeout); ids = []; },
    stop() { off = true; this.clear(); },
    resume() { off = false; },
  };
}
type Tool = { demo(done: () => void): void; stop(): void; resume(): void };

function lesson(root: HTMLElement): Tool {
  const ls = $('.ls', root), fb = $('.ls-fb', root), back = $<HTMLButtonElement>('.ls-back', root), next = $<HTMLButtonElement>('.ls-next', root);
  const bars = $$('.ls-bar i', root), tiles = $$<HTMLButtonElement>('button.tile', root);
  let i = 0, solved = false;
  function show(n: number) {
    i = Math.max(0, Math.min(LESSON_STEPS.length - 1, n));
    const s = LESSON_STEPS[i];
    $('.ls-step', root).textContent = `Step ${i + 1} of ${LESSON_STEPS.length}`;
    $('.ls-h', root).textContent = s.h;
    $('.ls-p', root).innerHTML = s.p;
    $('.ls-count', root).textContent = `${i + 1} / ${LESSON_STEPS.length}`;
    bars.forEach((b, k) => { b.className = k < i ? 'done' : k === i ? 'now' : ''; });
    ls.toggleAttribute('data-ghost', !!s.ghost);
    ls.toggleAttribute('data-check', !!s.check);
    tiles.forEach((t) => { t.tabIndex = s.check ? 0 : -1; t.classList.remove('right', 'wrong'); });
    fb.textContent = ''; fb.className = 'ls-fb'; solved = false;
    back.disabled = i === 0; next.disabled = i === LESSON_STEPS.length - 1;
  }
  function answer(k: string) {
    if (!LESSON_STEPS[i].check || solved) return;
    const t = tiles.find((x) => x.dataset.k === k)!;
    if (k === 'he') { t.classList.add('right'); fb.className = 'ls-fb ok'; fb.innerHTML = LESSON_FEEDBACK.right; solved = true; }
    else { t.classList.remove('wrong'); void t.offsetWidth; t.classList.add('wrong'); fb.className = 'ls-fb no'; fb.textContent = LESSON_FEEDBACK.wrong; }
  }
  const r = runner();
  back.addEventListener('click', () => { r.stop(); show(i - 1); });
  next.addEventListener('click', () => { r.stop(); show(i + 1); });
  tiles.forEach((t) => t.addEventListener('click', () => { r.stop(); answer(t.dataset.k!); }));
  show(1); // the step the server rendered
  return {
    demo(done) { r.clear(); show(0); r.at(2200, () => show(1)); r.at(4800, () => show(2)); r.at(6600, () => answer('first')); r.at(8000, () => answer('he')); r.at(10200, done); },
    stop: () => r.stop(), resume: () => r.resume(),
  };
}

function lookup(root: HTMLElement): Tool {
  const form = $<HTMLFormElement>('form', root), inp = $<HTMLInputElement>('input', root), out = $('.lk-out', root), chips = $$<HTMLButtonElement>('.chip', root);
  let last = 'knowledge';
  function go(v: string) {
    const q = v.trim().toLowerCase();
    const k = q ? LOOKUP_KEYS.find((x) => x.startsWith(q) || LOOKUP[x].gloss.startsWith(q)) ?? null : null;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.textContent === k)));
    // Redraw only when the result changes, so the live region speaks once per change.
    const state = k ?? (q ? '?' : '');
    if (state === last) return;
    last = state;
    if (k) out.innerHTML = lookupResult(k);
    else if (q) { out.innerHTML = '<p class="lk-none">Press Enter to look this word up in the full lookup, which covers every word of the Quran.</p>'; }
    else out.innerHTML = '';
  }
  const r = runner();
  inp.addEventListener('input', () => { r.stop(); go(inp.value); });
  form.addEventListener('submit', (e) => { e.preventDefault(); r.stop(); const q = inp.value.trim(); location.href = `/resources/find/${q ? `#q=${encodeURIComponent(q)}` : ''}`; });
  chips.forEach((c) => c.addEventListener('click', () => { r.stop(); inp.value = c.textContent!; go(inp.value); }));
  function type(word: string, start: number) { [...word].forEach((_, j) => r.at(start + j * 90, () => { inp.value = word.slice(0, j + 1); go(inp.value); })); return start + word.length * 90; }
  return {
    demo(done) { r.clear(); inp.value = ''; go(''); let t = type('mercy', 500); t = type('knowledge', t + 2200); r.at(t + 2200, done); },
    stop: () => r.stop(), resume: () => r.resume(),
  };
}

function decoder(root: HTMLElement): Tool {
  const ws = $$<HTMLButtonElement>('.dc-w', root), out = $('.dc-out', root);
  function pick(i: number) { ws.forEach((w, k) => w.setAttribute('aria-pressed', String(k === i))); out.innerHTML = decoderReadout(i); }
  const r = runner();
  ws.forEach((w, i) => w.addEventListener('click', () => { r.stop(); pick(i); }));
  return {
    demo(done) { r.clear(); pick(0); r.at(1600, () => pick(1)); r.at(3400, () => pick(2)); r.at(5400, done); },
    stop: () => r.stop(), resume: () => r.resume(),
  };
}

function roots(root: HTMLElement): Tool {
  const bars = $$('.rt-rib i', root), chips = $$<HTMLButtonElement>('.chip', root), read = $('.rt-read', root), num = $('.rt-n', root), rib = $('.rt-rib', root);
  let cur: RootKey = 'knowledge', sel = 1, frame = 0;
  function count(n: number) {
    cancelAnimationFrame(frame);
    const from = Number(num.textContent) || 0;
    if (reduce) { num.textContent = String(n); return; }
    const t0 = performance.now();
    const f = (t: number) => { const p = Math.min(1, (t - t0) / 700); num.textContent = String(Math.round(from + (n - from) * (1 - (1 - p) ** 3))); if (p < 1) frame = requestAnimationFrame(f); };
    frame = requestAnimationFrame(f);
  }
  function focus(s: number) { sel = s; bars.forEach((b, j) => b.classList.toggle('sel', j === s)); read.innerHTML = surahLine(cur, s); }
  function pick(k: RootKey) {
    cur = k; const st = rootStats(k);
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.textContent === k)));
    $('.rt-root', root).textContent = ROOTS[k].ar;
    $('.rt-s', root).textContent = `times · ${ROOTS[k].gloss} · in ${st.surahs} of 114 surahs`;
    count(st.total);
    bars.forEach((b, s) => { b.classList.toggle('z', !st.per[s]); b.style.height = barHeight(st.per[s], st.max); });
    rib.setAttribute('aria-label', `Where the root for ${k} appears, surah by surah, from Al-Fatiha on the right`);
    focus(sel);
  }
  const r = runner();
  chips.forEach((c) => c.addEventListener('click', () => { r.stop(); pick(c.textContent as RootKey); }));
  const barOf = (e: Event) => (e.target as Element).closest<HTMLElement>('i');
  // Hovering only reads a bar; it must not cancel the demo, or the tour would stall here.
  rib.addEventListener('pointermove', (e) => { const t = barOf(e); if (t) focus(Number(t.dataset.s)); });
  rib.addEventListener('click', (e) => { const t = barOf(e); if (t) { r.stop(); focus(Number(t.dataset.s)); } });
  return {
    demo(done) { r.clear(); pick(ROOT_KEYS[0]); r.at(1800, () => pick(ROOT_KEYS[1])); r.at(3600, () => pick(ROOT_KEYS[2])); r.at(5400, () => pick(ROOT_KEYS[0])); r.at(6600, done); },
    stop: () => r.stop(), resume: () => r.resume(),
  };
}

// ---------- the tour ----------
const W: Record<string, Tool> = { lesson: lesson($('#w-lesson')), lookup: lookup($('#w-lookup')), decoder: decoder($('#w-decoder')), roots: roots($('#w-roots')) };
const DUR: Record<string, number> = { lesson: 10200, lookup: 6160, decoder: 5400, roots: 6600 };
const ORDER = ['lesson', 'lookup', 'decoder', 'roots'];
const tabs = $$<HTMLButtonElement>('.tab'), panels = $$('.panel'), app = $('#app'), url = $('#url'), row = $('.tabs');
const lives = $$('[aria-live]', app), ctl = $<HTMLButtonElement>('#replay');
const all = (f: (w: Tool) => void) => Object.values(W).forEach(f);
let auto = !reduce, cur = 'lesson';

/** While the tour plays, screen readers stay quiet; the visitor's own changes are announced. */
function setAuto(on: boolean) {
  auto = on;
  lives.forEach((l) => l.setAttribute('aria-live', on ? 'off' : 'polite'));
  ctl.textContent = on ? 'Pause the tour' : 'Play the tour again';
}
function show(k: string) {
  cur = k;
  tabs.forEach((t) => { const on = t.dataset.k === k; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; t.classList.remove('playing'); });
  panels.forEach((p) => p.classList.toggle('on', p.dataset.k === k));
  const tab = tabs.find((t) => t.dataset.k === k)!;
  url.style.opacity = '0';
  window.setTimeout(() => { url.textContent = tab.dataset.url!; url.style.opacity = '1'; }, 150);
  if (row.scrollWidth > row.clientWidth) row.scrollTo({ left: tab.offsetLeft - 10, behavior: reduce ? 'auto' : 'smooth' });
}
function play(k: string) {
  show(k);
  if (!auto) return;
  const t = tabs.find((x) => x.dataset.k === k)!;
  t.style.setProperty('--dur', `${DUR[k]}ms`);
  void t.offsetWidth;
  t.classList.add('playing');
  W[k].demo(() => { if (auto) play(ORDER[(ORDER.indexOf(k) + 1) % ORDER.length]); });
}
function halt() {
  all((w) => w.stop());
  tabs.forEach((t) => t.classList.remove('playing'));
}
function pause() {
  if (!auto) return;
  setAuto(false);
  halt();
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => { pause(); show(t.dataset.k!); });
  t.addEventListener('keydown', (e) => {
    const d = ['ArrowDown', 'ArrowRight'].includes(e.key) ? 1 : ['ArrowUp', 'ArrowLeft'].includes(e.key) ? -1 : 0;
    const n = e.key === 'Home' ? tabs[0] : e.key === 'End' ? tabs[tabs.length - 1] : d ? tabs[(i + d + tabs.length) % tabs.length] : null;
    if (!n) return;
    e.preventDefault(); pause();
    n.focus(); show(n.dataset.k!);
  });
});
// Any touch, click or focus inside a tool hands it to the visitor.
panels.forEach((p) => { p.addEventListener('pointerdown', pause); p.addEventListener('focusin', pause); });
ctl.addEventListener('click', () => {
  if (auto) return pause();
  all((w) => w.resume()); setAuto(true); play('lesson');
});
show('lesson');
if (!reduce) {
  setAuto(true);
  app.classList.add('tour');
  // Start once the window is seen, and rest while it is scrolled away (cheap phones).
  let started = false, away = false;
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      if (!started) { started = true; window.setTimeout(() => { if (auto && !away) play('lesson'); }, 900); }
      else if (away) { away = false; if (auto) { all((w) => w.resume()); play(cur); } }
    } else if (started && auto && !away) { away = true; halt(); }
  }, { threshold: 0.25 }).observe(app);
}

// ---------- the surah reader ----------
// Al-Ikhlas arrives rendered, with its data inline; other surahs load from /data/home-reader/<n>.json.
{
  const read = $('#rd-read'), card = $('#rd-card'), list = $('.rd-list'), rdUrl = $('#rd-url');
  const cache = new Map<number, ReaderSurah>();
  const first: ReaderSurah = JSON.parse($('#rd-data').textContent || 'null');
  cache.set(first.number, first);
  let cur = first;
  let want = first.number;

  function pickWord(a: number, k: number) {
    $$('.rd-w', read).forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.a! === a && +b.dataset.k! === k)));
    card.innerHTML = readerCard(cur.ayahs[a].words[k]);
  }
  async function open(n: number, link: HTMLAnchorElement) {
    want = n;
    $$('a', list).forEach((x) => x.removeAttribute('aria-current'));
    link.setAttribute('aria-current', 'true');
    read.classList.add('loading');
    try {
      let s = cache.get(n);
      if (!s) {
        const r = await fetch(`/data/home-reader/${n}.json`);
        if (!r.ok) throw new Error(String(r.status));
        s = (await r.json()) as ReaderSurah;
        cache.set(n, s);
      }
      if (want !== n) return; // a later choice won
      cur = s;
      read.innerHTML = readerText(s);
      pickWord(0, 0);
      rdUrl.textContent = `quranic-grammar.com/surahs/${s.id}`;
    } catch {
      location.href = link.href; // offline or missing: open the surah page instead
    } finally {
      if (want === n) read.classList.remove('loading');
    }
  }
  list.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[data-n]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return; // let new-tab clicks through
    e.preventDefault();
    open(+a.dataset.n!, a);
  });
  read.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLElement>('.rd-w');
    if (b) pickWord(+b.dataset.a!, +b.dataset.k!);
  });
  const q = $<HTMLInputElement>('#rd-q');
  q.addEventListener('input', () => {
    const v = q.value.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    $$('li', list).forEach((li) => { li.hidden = !!v && !li.dataset.find!.toLowerCase().replace(/[^a-z0-9 ]/g, '').includes(v); });
  });
  // On a phone the list is a row; bring the open surah into view without moving the page.
  const on = $('[aria-current="true"]', list);
  if (on && list.scrollWidth > list.clientWidth) list.scrollLeft = on.parentElement!.offsetLeft - 12;
}

// ---------- the closing dua, word by word ----------
{
  const gloss = $('#gloss'), btns = $$<HTMLButtonElement>('.dua button');
  btns.forEach((b) => b.addEventListener('click', () => {
    btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    gloss.innerHTML = DUA[+b.dataset.g!].note;
  }));
}

// ---------- the library bench: the word lookup and the verb generator, running ----------
{
  // The word lookup is the hero's tool again; it types two words once, when the bench scrolls into view.
  const bench = $('#bench'), lk = lookup($('#w-bench'));
  let played = false;
  if (!reduce && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries, io) => { if (!played && entries.some((e) => e.isIntersecting)) { played = true; io.disconnect(); lk.demo(() => {}); } }, { threshold: 0.45 }).observe(bench);
  }
  // The verb generator: pick a root, pick a form the Quran uses.
  const roots: VerbRoot[] = JSON.parse($('#vf-data').textContent || '[]');
  const box = $('#w-verbs'), pick = $$<HTMLButtonElement>('.chipset button', box), cells = $('.cells', box), det = $('.det', box);
  let cur = 0;
  const show = (i: number, sel: number) => {
    cur = i;
    pick.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    cells.innerHTML = verbCells(roots[i], sel);
    det.innerHTML = verbDetail(roots[i], sel);
  };
  pick.forEach((b, i) => b.addEventListener('click', () => { if (roots[i]) show(i, verbDefaultForm(roots[i])); }));
  cells.addEventListener('click', (e) => {
    const c = (e.target as Element).closest<HTMLButtonElement>('.cell.on');
    if (c && roots[cur]) show(cur, +c.dataset.n!);
  });
}

// ---------- sources: a note lights up the part of the sample lesson it feeds ----------
{
  const les = $('#les'), notes = $$<HTMLButtonElement>('.fn button', les);
  const lit = () => notes.find((n) => n.getAttribute('aria-pressed') === 'true');
  const set = (n?: HTMLButtonElement) => { if (n && n.dataset.h !== '0') les.dataset.hl = n.dataset.h; else delete les.dataset.hl; };
  notes.forEach((n) => {
    n.addEventListener('click', () => {
      const wasOn = n.getAttribute('aria-pressed') === 'true';
      notes.forEach((x) => x.setAttribute('aria-pressed', 'false'));
      if (!wasOn) n.setAttribute('aria-pressed', 'true');
      set(wasOn ? undefined : n);
    });
    n.addEventListener('pointerenter', () => set(n));
    n.addEventListener('pointerleave', () => set(lit()));
  });
}

// ---------- mistakes: tap a word, say what is wrong, carry on to the feedback form ----------
{
  const fx = $('#fx'), words = $$<HTMLButtonElement>('.fx-w', fx), opts = $$<HTMLButtonElement>('.fx-opts button', fx), go = $<HTMLAnchorElement>('.fx-send', fx);
  let word = '';
  // The About form reads ?report= and puts it in the message box, so the reader only adds their name and email.
  const link = () => {
    const kind = opts.find((o) => o.getAttribute('aria-pressed') === 'true')?.textContent ?? '';
    go.href = `/about/?report=${encodeURIComponent(`Report from the home page: the word ${word} (${fx.dataset.ref}). Problem with: ${kind}.`)}#feedback`;
  };
  words.forEach((w) => w.addEventListener('click', () => {
    words.forEach((x) => x.setAttribute('aria-pressed', String(x === w)));
    word = w.dataset.ar!;
    fx.classList.add('pick');
    link();
  }));
  opts.forEach((o) => o.addEventListener('click', () => {
    opts.forEach((x) => x.setAttribute('aria-pressed', String(x === o)));
    link();
  }));
}

// ---------- returning learners: offer the next lesson ----------
try {
  const order: [string, string][] = JSON.parse($('#course-order').textContent || '[]');
  const titleOf = new Map(order);
  const resume = parseResume(localStorage.getItem('quran-learn-lesson-step'));
  let done: unknown = [];
  try { done = getCompletedLessons(); } catch { /* unreadable progress counts as none */ }
  const lessonsDone = Array.isArray(done) ? done.filter((s) => titleOf.has(s)) : [];
  // The lesson most recently left part-way wins (the resume map runs oldest first);
  // otherwise the first lesson after the furthest one finished.
  const started = Object.keys(resume).reverse().find((s) => titleOf.has(s) && !lessonsDone.includes(s));
  let nextId = started;
  if (!nextId && lessonsDone.length) {
    const furthest = Math.max(...lessonsDone.map((s) => order.findIndex(([id]) => id === s)));
    nextId = order.slice(furthest + 1).find(([id]) => !lessonsDone.includes(id))?.[0];
  }
  const nextHref = nextId && `/learn/${nextId}/${started && resume[nextId] ? `#${resume[nextId]}` : ''}`;
  if (nextId && nextHref) {
    const cta = $<HTMLAnchorElement>('#primary-cta');
    cta.href = nextHref;
    cta.textContent = 'Continue learning';
    $('#welcome-next').textContent = `Next up: ${titleOf.get(nextId)}.`;
    document.body.classList.add('returning');
  }
  // The course map: one segment per lesson, in course order, filled for each lesson finished.
  $$('.card').forEach((c) => {
    const ids = order.map(([id]) => id).filter((id) => id.startsWith(`level-${c.dataset.level}/`));
    const segs = $$('.segs i', c);
    ids.forEach((id, k) => segs[k]?.classList.toggle('d', lessonsDone.includes(id)));
    const n = ids.filter((id) => lessonsDone.includes(id)).length;
    if (n) $('.pct', c).textContent = `${n} of ${ids.length} done`;
    if (nextId && nextHref && ids.includes(nextId)) {
      c.classList.add('now');
      const cover = $<HTMLAnchorElement>('.cover', c);
      cover.href = nextHref;
      cover.firstElementChild!.textContent = `Level ${c.dataset.level}: continue with ${titleOf.get(nextId)}`;
    }
  });
} catch {
  // Storage blocked or unreadable: the page simply shows the first-visit buttons.
}
