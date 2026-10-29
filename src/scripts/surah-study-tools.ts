/**
 * Surah study page tools: lenses, the whole-surah reader, hide-meanings practice, listening and the reading position.
 * Loaded after src/scripts/surah-study.ts, whose word data and word box it shares.
 */
import { detailHTML } from '../lib/surah-study';
import { data, showWord } from './surah-study';

const col = document.getElementById('col')!;

// ---- lenses: mark one kind of word across the whole surah (the CSS does the marking from data-pick) ----
const lensDef = document.getElementById('lens-def');
const defs = JSON.parse(lensDef?.dataset.defs ?? '{}') as Record<string, string>;
document.querySelectorAll<HTMLElement>('.lens .chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    const k = chip.dataset.pick!;
    document.querySelectorAll('.lens .chip').forEach((x) => x.setAttribute('aria-pressed', String(x === chip)));
    if (k === 'all') delete col.dataset.pick; else col.dataset.pick = k;
    if (lensDef) lensDef.textContent = k === 'all' ? '' : defs[k] ?? '';
  });
});

// ---- practice: hide the meanings under the words and the translation; the word box still shows them ----
const hide = document.getElementById('hide-mean');
hide?.addEventListener('click', () => {
  const on = hide.getAttribute('aria-pressed') !== 'true';
  hide.setAttribute('aria-pressed', String(on));
  hide.textContent = on ? 'Show meanings' : 'Hide meanings';
  col.classList.toggle('nomean', on);
});

// ---- the whole-surah reader: tap a word, see its box right under the text ----
const readerWords = [...document.querySelectorAll<HTMLElement>('.rw')];
const readerBox = document.getElementById('reader-detail');
if (readerWords[0]) readerWords[0].tabIndex = 0;
function pickReaderWord(el: HTMLElement, focus = false) {
  readerWords.forEach((b) => { b.setAttribute('aria-pressed', String(b === el)); b.tabIndex = b === el ? 0 : -1; });
  const v = el.dataset.v!;
  const i = +el.dataset.i!;
  const w = data.words[v][i];
  if (readerBox) {
    readerBox.className = `detail ${w.t}`;
    readerBox.innerHTML = `${detailHTML(w)}<p class="goto"><a href="#v${v}">Go to verse ${v}</a></p>`;
  }
  showWord(document.getElementById(`v${v}`)!, i); // the same word is ready when you go to its verse
  if (focus) el.focus();
}
document.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLElement>('.rw');
  if (b) pickReaderWord(b);
});
document.addEventListener('keydown', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLElement>('.rw');
  if (!b) return;
  const at = readerWords.indexOf(b);
  // Arabic runs right to left, so Left Arrow is the next word
  const next = e.key === 'ArrowLeft' ? at + 1 : e.key === 'ArrowRight' ? at - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? readerWords.length - 1 : -1;
  if (next < 0) return;
  e.preventDefault();
  pickReaderWord(readerWords[Math.max(0, Math.min(readerWords.length - 1, next))], true);
});

// ---- listening: one verse, or the whole surah in order ----
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const playButtons = [...document.querySelectorAll<HTMLButtonElement>('.ayah-play')];
const playAll = document.getElementById('play-all');
let audio: HTMLAudioElement | null = null;
let current: HTMLButtonElement | null = null;
let queue: HTMLButtonElement[] = [];
function clearPlaying() {
  current?.classList.remove('playing');
  document.querySelector('.vs.playing')?.classList.remove('playing');
}
function stopAudio() {
  audio?.pause();
  clearPlaying();
  audio = null; current = null; queue = [];
  playAll?.setAttribute('aria-pressed', 'false');
  if (playAll) playAll.textContent = 'Listen to the whole surah';
}
function fail(btn: HTMLButtonElement) {
  btn.classList.add('unavailable');
  btn.setAttribute('disabled', '');
  stopAudio();
}
function play(btn: HTMLButtonElement, onEnd?: () => void) {
  audio?.pause();
  clearPlaying();
  const a = new Audio(btn.dataset.audioSrc!); // fetched when played, never preloaded
  audio = a; current = btn;
  btn.classList.add('playing');
  btn.closest('.vs')?.classList.add('playing');
  a.play().catch(() => fail(btn));
  a.addEventListener('error', () => fail(btn));
  a.addEventListener('ended', () => { btn.classList.remove('playing'); btn.closest('.vs')?.classList.remove('playing'); onEnd?.(); });
}
function playNext() {
  const btn = queue.shift();
  if (!btn) { stopAudio(); return; }
  btn.closest('.vs')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  play(btn, playNext);
}
document.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.ayah-play');
  if (!btn || btn.disabled) return;
  if (current === btn && audio) {
    if (audio.paused) { audio.play(); btn.classList.add('playing'); } else { audio.pause(); btn.classList.remove('playing'); }
    return;
  }
  if (queue.length > 0) stopAudio(); // a verse picked during "listen to the whole surah" ends the run
  play(btn);
});
playAll?.addEventListener('click', () => {
  if (playAll.getAttribute('aria-pressed') === 'true') { stopAudio(); return; }
  stopAudio();
  queue = playButtons.filter((b) => !b.disabled);
  playAll.setAttribute('aria-pressed', 'true');
  playAll.textContent = 'Stop listening';
  playNext();
});

// ---- reading position ----
const progText = document.getElementById('prog-text');
const progFill = document.getElementById('prog-fill');
let ticking = false;
function updateProgress() {
  ticking = false;
  const room = document.documentElement.scrollHeight - innerHeight;
  const pct = room > 0 ? Math.round(100 * Math.max(0, Math.min(1, scrollY / room))) : 0;
  if (progText) progText.textContent = `Reading position ${pct}%`;
  progFill?.style.setProperty('--p', `${pct}%`);
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); } }, { passive: true });
updateProgress();
