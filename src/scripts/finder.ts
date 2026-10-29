// src/scripts/finder.ts: the /resources/find/ page. DOM glue over src/lib/finder-english.ts (English),
// src/lib/lookup-search.ts (Arabic and sound), src/lib/finder-card.ts (plain "how it is built") and
// src/lib/finder-saved.ts (My words and review).
// Built with real DOM nodes only; the repo blocks innerHTML.
// Data loads in two steps: the plain-English layer first (English answers need only that), then the word
// and verb data (sound, Arabic, the card's forms and verb table).
import { prepareLayer, findConcepts } from '../lib/finder-english';
import type { Layer, LayerEntry, PreparedLayer, Concept } from '../lib/finder-english';
import { prepareIndex, search } from '../lib/lookup-search';
import type { Prepared, ArabicResult, LatinResult, KeyRef } from '../lib/lookup-search';
import { howBuilt, groupByLemma, rootKey } from '../lib/finder-card';
import type { Row } from '../lib/finder-card';
import { ROMAN_FORMS, grammarLine } from '../lib/grammar-labels';
import { foldLatin } from '../lib/arabic-normalize';
import * as saved from '../lib/finder-saved';

interface VerbEntry { past: string; present: string | null; translit: string; meaning: string | null; count: number; example: string }
interface VerbRoot { root: string; translit: string; quad: boolean; totalCount: number; forms: Record<string, VerbEntry[]> }
interface Core { layer: Layer; LP: PreparedLayer; byRoot: Map<string, string[]> }
interface Rest {
  WP: Prepared;
  lemmas: Map<string, string[]>;               // "lemma|pos" → written forms, most used first
  verbs: Map<string, VerbRoot>;
}

type Kid = Node | string | null | undefined | false;
function h(tag: string, attrs: Record<string, string> = {}, ...kids: Kid[]): HTMLElement {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  for (const k of kids) if (k) n.append(k);
  return n;
}
const ar = (text: string, extra = ''): HTMLElement => h('span', { class: `ar ${extra}`.trim(), lang: 'ar', dir: 'rtl' }, text);

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const input = $<HTMLInputElement>('q'), status = $('status'), grid = $('grid'), results = $('results'), card = $('card'), tryRow = $('try');
const browse = $<HTMLDetailsElement>('browse'), browseBody = $('browse-body');
const findForm = $('find'), mineBtn = $<HTMLButtonElement>('mine-btn'), minePanel = $('mine');

// ---------- loading ----------
const get = (u: string) => fetch(u).then(r => { if (!r.ok) throw new Error(`${u}: ${r.status}`); return r.json(); });
let CORE: Core | null = null, REST: Rest | null = null;
let coreP: Promise<Core> | null = null, restP: Promise<Rest> | null = null;
const fail = () => { status.textContent = 'The word list did not load. Check your connection and try again.'; };

function loadCore(): Promise<Core> {
  coreP ??= get('/data/finder-layer.json').then((layer: Layer) => {
    const byRoot = new Map<string, string[]>();
    for (const [k, e] of Object.entries(layer))
      for (const r of e.r) { const rk = rootKey(r); const l = byRoot.get(rk); if (l) l.push(k); else byRoot.set(rk, [k]); }
    CORE = { layer, LP: prepareLayer(layer), byRoot };
    return CORE;
  }).catch(e => { coreP = null; fail(); throw e; });
  return coreP;
}
function loadRest(): Promise<Rest> {
  restP ??= Promise.all([get('/data/finder-words.json'), get('/data/verb-forms.json')]).then(([lookup, verbs]) => {
    REST = {
      WP: prepareIndex(lookup), lemmas: groupByLemma(lookup.words),
      verbs: new Map((verbs.roots as VerbRoot[]).map(r => [rootKey(r.root), r])),
    };
    return REST;
  }).catch(e => { restP = null; fail(); throw e; });
  return restP;
}
input.addEventListener('focus', () => { loadCore().catch(() => {}); loadRest().catch(() => {}); }, { once: true });

// ---------- small helpers ----------
const shortMeaning = (easy: string) => easy.split(':')[0].trim();
const KIND_ORDER = ['action', 'thing', 'person or being', 'describing word', 'place or time', 'name', 'small word'];
const timesText = (n: number) => n >= 100 ? `about ${Math.round(n / 10) * 10} times` : n === 1 ? 'once' : `${n} times`;
const lemmaOf = (key: string) => key.split('|')[0];
const arOf = (key: string, e: LayerEntry) => e.ph?.ar ?? lemmaOf(key);
// The form to say for a base word: the plain "he did it" form for verbs, else the most used form.
function sayForm(keys: string[], R: Rest): Row | undefined {
  for (const k of keys) { const a = R.WP.data.words[k]?.[0] as Row | undefined; if (a && a[4] === 'V' && a[6].startsWith('PERF|3MS') && !a[7].length && !a[8].length) return a; }
  return R.WP.data.words[keys[0]]?.[0] as Row | undefined;
}

function conceptRow(key: string, e: LayerEntry, why: string | null, onPick: () => void): HTMLElement {
  const b = h('button', { type: 'button', class: 'fd-row' },
    ar(arOf(key, e) || '…', `fd-row-ar${e.ph ? ' is-phrase' : ''}`),
    h('span', { class: 'fd-row-t' },
      h('b', {}, e.easy),
      h('small', {}, [e.kind, why].filter(Boolean).join(' · '))));
  b.addEventListener('click', onPick);
  return b;
}
function formRow(key: string, C: Core, R: Rest): HTMLElement | null {
  const a = R.WP.data.words[key]?.[0];
  if (!a) return null;
  const lk = `${a[3]}|${a[4]}`;
  const e = C.layer[lk];
  const b = h('button', { type: 'button', class: 'fd-row' },
    ar(a[0], 'fd-row-ar'),
    h('span', { class: 'fd-row-t' }, h('b', {}, e ? e.easy : ''), h('small', {}, `${a[1]} · written form`)));
  b.addEventListener('click', () => { void openWord(lk, key); });
  return b;
}

// ---------- search ----------
const isArabic = (q: string) => /[؀-ۿ]/.test(q);
let seq = 0;
const setHome = (on: boolean) => { tryRow.hidden = !on; browse.hidden = !on; };
function showResults() { minePanel.hidden = true; mineBtn.setAttribute('aria-expanded', 'false'); setHome(false); card.hidden = true; grid.hidden = false; grid.classList.remove('has-card'); }

async function run(raw: string, { fromHash = false } = {}) {
  const q = raw.trim();
  const mine = ++seq;
  findForm.classList.toggle('has', !!raw);
  if (!q) { clearAll(); return; }
  let C: Core;
  try { C = await loadCore(); } catch { return; }
  if (mine !== seq) return;
  showResults();
  results.replaceChildren();
  if (!fromHash) history.replaceState(null, '', `#q=${encodeURIComponent(q)}`);

  if (isArabic(q)) {
    let R: Rest;
    try { status.textContent = 'Loading words…'; R = await loadRest(); } catch { return; }
    if (mine !== seq) return;
    const r = search(R.WP, q) as ArabicResult;
    const asRoot = rootFromArabic(q, C, R);
    if (asRoot) {
      heading('As a root');
      results.append(rootRow(asRoot, C, R));
      if (r.exact) { heading('As a word'); const row = formRow(r.exact.key, C, R); if (row) results.append(row); }
      status.textContent = r.exact ? '2 results.' : '1 result.';
      if (!r.exact) void openRoot(asRoot);
      return;
    }
    if (r.exact) { const a0 = r.exact.analyses[0]; status.textContent = ''; void openWord(`${a0[3]}|${a0[4]}`, r.exact.key); return; }
    const list = [...r.suggestions, ...r.didYouMean];
    if (list.length) heading(r.suggestions.length ? 'Words that start like that' : 'Did you mean');
    list.forEach(k => { const row = formRow(k.key, C, R); if (row) results.append(row); });
    if (!list.length) empty();
    status.textContent = list.length ? `${list.length} words found.` : '';
    return;
  }

  // English: answer at once from the plain-English layer, then add sound matches when the word data is in.
  const { concepts, understood } = findConcepts(C.LP, q, 12);
  if (understood.corrected) results.append(h('p', { class: 'fd-fix' }, 'Showing results for ', h('b', {}, understood.corrected), '.'));
  if (concepts.length) {
    heading('By meaning');
    concepts.forEach((c: Concept) => results.append(conceptRow(c.key, c.entry, c.tier === 2 ? null : `matched “${c.via}”`, () => { void openWord(c.key); })));
  }
  status.textContent = concepts.length ? `${concepts.length} results.` : '';
  loadRest().then(R => {
    if (mine !== seq) return;
    const sound = (search(R.WP, q) as LatinResult).sound.slice(0, 6);
    const rows = sound.map((k: KeyRef) => formRow(k.key, C, R)).filter(Boolean) as HTMLElement[];
    results.querySelector('.empty')?.remove();
    const roots = rootsFromLatin(q, R);
    if (roots.length) results.prepend(h('p', { class: 'fd-group' }, 'As a root'), ...roots.map(rk => rootRow(rk, C, R)));
    if (rows.length) { heading(concepts.length ? 'Or by sound' : 'By sound'); rows.forEach(r => results.append(r)); }
    if (!concepts.length && !rows.length && !roots.length) empty();
    status.textContent = `${concepts.length + rows.length + roots.length} results.`;
  }).catch(() => {});
}
function heading(t: string) { results.append(h('p', { class: 'fd-group' }, t)); }
function empty() {
  results.append(h('div', { class: 'empty' }, h('b', {}, 'No word found for that.'),
    h('p', {}, 'Try a simpler word, such as “help”, or how it sounds, such as “rahma”. Still nothing? ',
      h('a', { href: '/about/#feedback' }, 'Tell us what you were looking for'), ', and we will add it.')));
}
function clearAll() {
  seq++;
  setHome(true); grid.hidden = true; card.hidden = true; status.textContent = '';
  history.replaceState(null, '', location.pathname);
}

// ---------- My words ----------
let mineList = saved.readList();
const persist = () => { if (!saved.writeList(mineList)) status.textContent = 'Your browser did not let us save. My words will not stay after you leave.'; renderMineBtn(); };
function renderMineBtn() { mineBtn.replaceChildren(document.createTextNode(`My words${mineList.length ? ` (${mineList.length})` : ''}`)); }
renderMineBtn();

function saveButton(key: string): HTMLElement {
  const b = h('button', { type: 'button', class: 'fd-save' });
  const paint = () => { const on = saved.has(mineList, key); b.setAttribute('aria-pressed', String(on)); b.replaceChildren(document.createTextNode(on ? '✓ In My words' : '+ Save to My words')); };
  paint();
  b.addEventListener('click', () => {
    mineList = saved.has(mineList, key) ? saved.remove(mineList, key) : saved.add(mineList, key, Date.now());
    persist(); paint();
  });
  return b;
}

function openMine() {
  grid.hidden = true; setHome(false); status.textContent = ''; minePanel.hidden = false; mineBtn.setAttribute('aria-expanded', 'true');
  history.replaceState(null, '', '#mine');
  void renderMine();
}
mineBtn.addEventListener('click', () => {
  if (minePanel.hidden) openMine();
  else { minePanel.hidden = true; mineBtn.setAttribute('aria-expanded', 'false'); if (input.value.trim()) void run(input.value); else clearAll(); }
});

async function renderMine(view: 'list' | 'review' = 'list') {
  let C: Core;
  try { C = await loadCore(); } catch { return; }
  minePanel.replaceChildren();
  const now = Date.now();
  const dueNow = saved.due(mineList, now, 10);
  const head = h('header', { class: 'fd-mine-head' },
    h('h2', {}, 'My words'),
    h('p', { class: 'fd-sub' }, 'Words you saved. They stay on this device only, and nobody else can see them.'));
  minePanel.append(head);
  if (!mineList.length) {
    minePanel.append(h('div', { class: 'empty' }, h('b', {}, 'No saved words yet.'), h('p', {}, 'Open any word and choose “Save to My words”. Then come back here to go over them.')));
    return;
  }
  if (view === 'review') { startReview(C, dueNow.map(w => w.k)); return; }
  const go = h('button', { type: 'button', class: 'btn fd-go' }, dueNow.length ? `Go over ${dueNow.length} word${dueNow.length === 1 ? '' : 's'}` : 'Nothing to go over right now');
  if (!dueNow.length) go.setAttribute('disabled', ''); else go.addEventListener('click', () => { void renderMine('review'); });
  minePanel.append(h('div', { class: 'fd-mine-actions' }, go,
    h('span', { class: 'fd-sub' }, dueNow.length ? 'A short round: see the Arabic, think of the meaning, then check.' : 'Saved words come back after a few minutes, a day, or longer, depending on how well you knew them.')));
  const list = h('div', { class: 'fd-mine-list' });
  [...mineList].sort((a, b) => b.added - a.added).forEach(w => {
    const e = C.layer[w.k];
    if (!e) return;
    const row = conceptRow(w.k, e, null, () => { void openWord(w.k); });
    const rm = h('button', { type: 'button', class: 'fd-rm', 'aria-label': `Remove ${e.easy} from My words` }, 'Remove');
    rm.addEventListener('click', () => { mineList = saved.remove(mineList, w.k); persist(); void renderMine(); });
    list.append(h('div', { class: 'fd-mine-item' }, row, rm));
  });
  minePanel.append(list);
}

function startReview(C: Core, keys: string[]) {
  let i = 0, knew = 0;
  const stage = h('div', { class: 'fd-review', 'aria-live': 'polite' });
  minePanel.append(stage);
  const done = () => {
    stage.replaceChildren(h('div', { class: 'fd-rev-card' },
      h('h3', {}, 'Done for now'),
      h('p', {}, `You knew ${knew} of ${keys.length}. The others come back soon; the ones you knew come back later.`),
      (() => { const b = h('button', { type: 'button', class: 'btn' }, 'Back to My words'); b.addEventListener('click', () => { void renderMine(); }); return b; })()));
  };
  const show = () => {
    if (i >= keys.length) { done(); return; }
    const key = keys[i], e = C.layer[key];
    if (!e) { i++; show(); return; }
    const reveal = h('button', { type: 'button', class: 'btn' }, 'Show the meaning');
    const front = h('div', { class: 'fd-rev-card' },
      h('p', { class: 'fd-sub' }, `Word ${i + 1} of ${keys.length}`),
      ar(arOf(key, e), e.ph ? 'fd-big fd-big-phrase' : 'fd-big'),
      reveal);
    stage.replaceChildren(front);
    reveal.focus();
    reveal.addEventListener('click', async () => {
      let say = e.ph?.translit ?? '';
      if (!say) { try { const R = await loadRest(); const a = sayForm(R.lemmas.get(key) ?? [], R); say = a?.[1] ?? ''; } catch { /* the meaning still shows */ } }
      const rate = (ok: boolean) => { mineList = saved.answer(mineList, key, ok, Date.now()); persist(); if (ok) knew++; i++; show(); };
      const yes = h('button', { type: 'button', class: 'btn' }, 'I knew it');
      const no = h('button', { type: 'button', class: 'pill' }, 'Not yet');
      yes.addEventListener('click', () => rate(true)); no.addEventListener('click', () => rate(false));
      reveal.replaceWith(h('div', { class: 'fd-rev-back' },
        h('h3', { class: 'fd-easy' }, e.easy),
        h('p', { class: 'fd-meta' }, h('span', { class: 'tag' }, e.kind), say ? h('span', {}, `say it: ${say}`) : null),
        e.note ? h('p', { class: 'fd-noteline' }, e.note) : null,
        h('div', { class: 'fd-rev-actions' }, yes, no)));
      yes.focus();
    });
  };
  show();
}

// ---------- the word card ----------
async function openWord(lk: string, formKey?: string) {
  let C: Core;
  try { C = await loadCore(); } catch { return; }
  const e = C.layer[lk];
  showResults();
  card.hidden = false;
  grid.classList.add('has-card');
  card.replaceChildren();
  if (!e) { card.append(h('p', {}, 'No details for this word yet.')); return; }

  const back = h('button', { type: 'button', class: 'fd-back' }, '← Back to results');
  back.addEventListener('click', () => { grid.classList.remove('has-card'); (results.querySelector('button') as HTMLElement | null)?.focus(); });
  card.append(back);

  if (e.ph) { renderPhrase(lk, e); setHash(lk); return; }

  let R: Rest;
  try { R = await loadRest(); } catch { card.append(h('p', {}, 'The word data did not load.')); return; }
  const keys = R.lemmas.get(lk) ?? [];
  const top = sayForm(keys, R);

  card.append(
    h('header', { class: 'fd-head' },
      ar(lemmaOf(lk) || top?.[0] || '', 'fd-big'),
      h('div', {},
        h('h2', { class: 'fd-easy' }, e.easy),
        h('p', { class: 'fd-meta' },
          h('span', { class: 'tag' }, e.kind),
          top ? h('span', {}, `say it: ${top[1]}`) : null,
          e.r.length ? rootLink(e.r[0]) : null,
          e.check ? h('span', { class: 'tag next', title: 'A reader has not confirmed this meaning yet' }, 'meaning being checked') : null),
        saveButton(lk))));
  if (e.note) card.append(h('p', { class: 'fd-noteline' }, e.note));
  const roots = e.r.map(rootKey).filter((r, i, all) => all.indexOf(r) === i);

  // How each written form is built
  const shown = formKey ? [formKey, ...keys.filter(k => k !== formKey)] : keys;
  const forms = h('section', { class: 'fd-sec' }, h('h3', {}, formKey ? 'The form you typed' : 'Forms you will see'));
  shown.slice(0, formKey ? 5 : 6).forEach((k, i) => {
    const analyses = R.WP.data.words[k] as Row[] | undefined;
    if (!analyses) return;
    const typed = !!formKey && i === 0;
    // A typed form can be read in more than one way: show each reading.
    if (typed && analyses.length > 1) forms.append(h('p', { class: 'fd-sub' }, `This written form can be read ${Math.min(analyses.length, 4)} ways.`));
    (typed ? analyses.slice(0, 4) : analyses.slice(0, 1)).forEach((a, j) =>
      forms.append(formBlock(a, typed ? a[10] : analyses.reduce((n, x) => n + x[10], 0), C, e, typed && j === 0, `${a[3]}|${a[4]}` !== lk)));
  });
  card.append(forms);
  card.append(familySection(C, roots, lk, e.r[0] ?? ''));
  const vroot = roots.map(r => R.verbs.get(r)).find(Boolean);
  if (vroot) card.append(verbSection(vroot, false));

  // Where to see it, and the small facts last
  const ref = top?.[11]?.[0];
  card.append(h('footer', { class: 'fd-foot' },
    ref ? h('a', { href: `https://quran.com/${ref.replace(':', '/')}`, rel: 'noopener' }, `See it in the Quran: ${ref}`) : null,
    h('span', {}, `Appears ${timesText(e.n)} in the Quran.`),
    h('a', { href: '/about/#feedback' }, 'Report a mistake')));
  scrollToCard();
  setHash(lk, formKey);
}

// ---------- shared pieces of the cards ----------
const FORMS = [
  { n: 1, past: 'فَعَلَ', present: 'يَفْعَلُ', shift: 'basic action' },
  { n: 2, past: 'فَعَّلَ', present: 'يُفَعِّلُ', shift: 'intensify, cause' },
  { n: 3, past: 'فَاعَلَ', present: 'يُفَاعِلُ', shift: 'do with or toward someone' },
  { n: 4, past: 'أَفْعَلَ', present: 'يُفْعِلُ', shift: 'cause something' },
  { n: 5, past: 'تَفَعَّلَ', present: 'يَتَفَعَّلُ', shift: 'reflexive of II' },
  { n: 6, past: 'تَفَاعَلَ', present: 'يَتَفَاعَلُ', shift: 'mutual, gradual' },
  { n: 7, past: 'اِنْفَعَلَ', present: 'يَنْفَعِلُ', shift: 'passive result' },
  { n: 8, past: 'اِفْتَعَلَ', present: 'يَفْتَعِلُ', shift: 'do for oneself' },
  { n: 9, past: 'اِفْعَلَّ', present: 'يَفْعَلُّ', shift: 'colours and defects' },
  { n: 10, past: 'اِسْتَفْعَلَ', present: 'يَسْتَفْعِلُ', shift: 'seek, request' },
];
const spaced = (root: string) => [...root].join(' ');
const quran = (ref: string) => `https://quran.com/${ref.replace(':', '/')}`;

function rootLink(root: string): HTMLElement {
  const b = h('button', { type: 'button', class: 'fd-rootlink' }, 'root ', ar(spaced(root)));
  b.addEventListener('click', () => { void openRoot(rootKey(root)); });
  return b;
}

function formBlock(a: Row, count: number, C: Core, e: LayerEntry, typed: boolean, other: boolean): HTMLElement {
  const own = C.layer[`${a[3]}|${a[4]}`] ?? e;
  const built = howBuilt(a, shortMeaning(own.easy));
  return h('div', { class: `fd-form${typed ? ' is-typed' : ''}` },
    ar(a[0], 'fd-form-ar'),
    h('div', { class: 'fd-form-t' },
      other ? h('p', { class: 'fd-reads' }, 'Read as: ', h('b', {}, own.easy)) : null,
      h('div', { class: 'fd-parts' }, ...built.parts.flatMap((p, j) => [
        j ? h('span', { class: 'fd-plus', 'aria-hidden': 'true' }, '+') : null,
        h('span', { class: `fd-part fd-${p.role}` }, ar(p.ar), h('small', {}, p.say))])),
      built.who || built.when
        ? h('p', { class: 'fd-who' }, [built.who && `who: ${built.who}`, built.when && `when: ${built.when}`].filter(Boolean).join(' · '))
        : null,
      h('p', { class: 'fd-say' }, `${a[1]} · ${count}×`),
      h('details', { class: 'fd-gram' },
        h('summary', {}, 'Grammar details'),
        h('p', {}, grammarLine(a[4], a[5], a[6])),
        a[2] ? h('p', {}, 'Root: ', ar(spaced(a[2]))) : null,
        a[3] ? h('p', {}, 'Base word: ', ar(a[3])) : null)));
}

// Words that share a root, grouped by kind.
function familySection(C: Core, roots: string[], exclude: string | null, rootLetters: string): HTMLElement {
  const kin = roots.flatMap(r => C.byRoot.get(r) ?? []).filter((k, i, all) => k !== exclude && all.indexOf(k) === i);
  const fam = h('section', { class: 'fd-sec' });
  if (!kin.length) return fam;
  fam.append(h('h3', {}, exclude ? 'Same root, same family' : 'The family'),
    h('p', { class: 'fd-sub' }, 'Words built from the same letters share one idea. ', ar(spaced(rootLetters))));
  for (const kind of KIND_ORDER) {
    const group = kin.filter(k => C.layer[k].kind === kind).sort((a, b) => C.layer[b].n - C.layer[a].n).slice(0, exclude ? 5 : 8);
    if (!group.length) continue;
    const list = h('ul', { class: 'fd-kin' });
    group.forEach(k => {
      const b = h('button', { type: 'button', class: 'fd-chipword' }, ar(lemmaOf(k)), h('small', {}, C.layer[k].easy));
      b.addEventListener('click', () => { void openWord(k).then(() => card.focus()); });
      list.append(h('li', {}, b));
    });
    fam.append(h('p', { class: 'fd-kind' }, kind), list);
  }
  return fam;
}

// The ten verb forms of a root: used forms with meanings, unused forms greyed, rare forms after.
function verbSection(vroot: VerbRoot, open: boolean): HTMLElement {
  const keys = Object.keys(vroot.forms);
  const usedN = keys.map(Number).filter(n => n >= 1 && n <= 10);
  const det = h('details', { class: 'fd-sec fd-verbs', ...(open ? { open: '' } : {}) },
    h('summary', {}, `All verb forms of this root (${usedN.length} of 10 used in the Quran)`));
  const table = h('div', { class: 'fd-vtable' });
  const entryRow = (label: string, v: VerbEntry) => h('div', { class: 'fd-vrow' },
    h('span', { class: 'fd-vform' }, label),
    ar(v.present ? `${v.past} · ${v.present}` : v.past, 'fd-var'),
    h('span', { class: 'fd-vmean' }, v.meaning ?? 'meaning coming soon',
      h('small', {}, `${v.translit} · ${v.count}× · `, h('a', { href: quran(v.example), rel: 'noopener' }, `see ${v.example}`))));
  for (const f of FORMS) {
    const list = vroot.forms[String(f.n)] as VerbEntry[] | undefined;
    if (list?.length) list.forEach(v => table.append(entryRow(ROMAN_FORMS[f.n - 1], v)));
    else table.append(h('div', { class: 'fd-vrow is-off' },
      h('span', { class: 'fd-vform' }, ROMAN_FORMS[f.n - 1]),
      ar(`${f.past} · ${f.present}`, 'fd-var'),
      h('span', { class: 'fd-vmean' }, 'Not used in the Quran for this root', h('small', {}, f.shift))));
  }
  keys.filter(k => Number(k) > 10).forEach(k => (vroot.forms[k] as VerbEntry[]).forEach(v => table.append(entryRow(ROMAN_FORMS[Number(k) - 1] ?? k, v))));
  det.append(table, h('p', { class: 'fd-sub' }, 'What the forms usually add to the meaning: ', h('a', { href: '/resources/verb-forms-master-reference/' }, 'the verb forms sheet'), '.'));
  return det;
}

// ---------- roots ----------
// Is a typed Arabic string a root (two to four bare letters that some word or verb is built from)?
function rootFromArabic(q: string, C: Core, R: Rest): string | null {
  const bare = q.replace(/[ً-ْٰ·\s.\-]/g, '');
  if (!/^[؀-ۿ]{2,4}$/.test(bare)) return null;
  const rk = rootKey(bare);
  return R.verbs.has(rk) || C.byRoot.has(rk) ? rk : null;
}
// "nzl", "n-z-l", "k t b": consonants only, compared with each root's letters.
function rootsFromLatin(q: string, R: Rest): string[] {
  const f = foldLatin(q);
  if (f.length < 2 || f.length > 5 || /^[aeiou]+$/.test(f)) return [];
  const out: string[] = [];
  for (const [rk, v] of R.verbs) if (foldLatin(v.translit) === f) out.push(rk);
  return out.slice(0, 3);
}
function rootCore(rk: string, C: Core, R: Rest): string {
  const v = R.verbs.get(rk);
  if (v) {
    const all = Object.values(v.forms).flat() as VerbEntry[];
    const top = all.reduce((a, b) => (b.count > a.count ? b : a), all[0]);
    if (top?.meaning) return top.meaning;
  }
  const keys = [...(C.byRoot.get(rk) ?? [])].sort((a, b) => C.layer[b].n - C.layer[a].n);
  return keys[0] ? C.layer[keys[0]].easy : '';
}
function rootLetters(rk: string, C: Core, R: Rest): string {
  return R.verbs.get(rk)?.root ?? C.layer[(C.byRoot.get(rk) ?? [])[0]]?.r[0] ?? rk;
}
function rootRow(rk: string, C: Core, R: Rest): HTMLElement {
  const n = (C.byRoot.get(rk) ?? []).length;
  const b = h('button', { type: 'button', class: 'fd-row' },
    ar(spaced(rootLetters(rk, C, R)), 'fd-row-ar'),
    h('span', { class: 'fd-row-t' }, h('b', {}, rootCore(rk, C, R)), h('small', {}, `root · ${n} word${n === 1 ? '' : 's'} in this family`)));
  b.addEventListener('click', () => { void openRoot(rk); });
  return b;
}

async function openRoot(rk: string) {
  let C: Core, R: Rest;
  try { C = await loadCore(); R = await loadRest(); } catch { return; }
  showResults();
  card.hidden = false; grid.classList.add('has-card'); card.replaceChildren();
  const back = h('button', { type: 'button', class: 'fd-back' }, '← Back to results');
  back.addEventListener('click', () => { grid.classList.remove('has-card'); (results.querySelector('button') as HTMLElement | null)?.focus(); });
  const v = R.verbs.get(rk);
  const letters = rootLetters(rk, C, R);
  card.append(back,
    h('header', { class: 'fd-head' },
      ar(spaced(letters), 'fd-big'),
      h('div', {},
        h('h2', { class: 'fd-easy' }, 'One root, one family of words'),
        h('p', { class: 'fd-meta' }, h('span', { class: 'tag' }, 'root'), h('span', {}, `main idea: ${rootCore(rk, C, R)}`)))));
  card.append(familySection(C, [rk], null, letters));
  if (v) card.append(verbSection(v, true));
  card.append(h('footer', { class: 'fd-foot' },
    v ? h('span', {}, `Its verbs appear ${timesText(v.totalCount)} in the Quran.`) : null,
    h('a', { href: '/about/#feedback' }, 'Report a mistake')));
  scrollToCard();
  history.replaceState(null, '', `#root=${encodeURIComponent(letters)}`);
}

// ---------- browse roots ----------
let browsed = false;
const LETTERS = [...'ءبتثجحخدذرزسشصضطظعغفقكلمنهوي'];
browse.addEventListener('toggle', async () => {
  if (!browse.open || browsed) return;
  let R: Rest;
  try { await loadCore(); R = await loadRest(); } catch { return; }
  browsed = true;
  browseBody.replaceChildren();
  const roots = [...R.verbs.values()];
  const tri = roots.filter(r => !r.quad), quad = roots.filter(r => r.quad);
  const chip = (r: VerbRoot, count: boolean) => {
    const b = h('button', { type: 'button', class: 'chip fd-rootchip' }, ar(spaced(r.root)), count ? h('small', {}, `${r.totalCount}×`) : null);
    b.addEventListener('click', () => { void openRoot(rootKey(r.root)); });
    return b;
  };
  browseBody.append(h('p', { class: 'fd-group' }, 'Most used roots'),
    h('div', { class: 'fd-rootchips' }, ...[...tri].sort((a, b) => b.totalCount - a.totalCount).slice(0, 18).map(r => chip(r, true))));
  browseBody.append(h('p', { class: 'fd-group' }, 'All roots by first letter'));
  for (const L of LETTERS) {
    const group = tri.filter(r => r.root.startsWith(L)).sort((a, b) => a.root.localeCompare(b.root, 'ar'));
    if (!group.length) continue;
    browseBody.append(h('details', { class: 'fd-letter' }, h('summary', {}, ar(L), h('small', {}, `${group.length} roots`)),
      h('div', { class: 'fd-rootchips' }, ...group.map(r => chip(r, false)))));
  }
  if (quad.length) browseBody.append(h('details', { class: 'fd-letter' }, h('summary', {}, ar('رباعي'), h('small', {}, `four-letter roots · ${quad.length}`)),
    h('div', { class: 'fd-rootchips' }, ...quad.map(r => chip(r, false)))));
});

function renderPhrase(lk: string, e: LayerEntry) {
  const ph = e.ph!;
  card.append(
    h('header', { class: 'fd-head' },
      ar(ph.ar, 'fd-big fd-big-phrase'),
      h('div', {},
        h('h2', { class: 'fd-easy' }, e.easy),
        h('p', { class: 'fd-meta' }, h('span', { class: 'tag' }, 'phrase'), h('span', {}, `say it: ${ph.translit}`)),
        saveButton(lk))));
  if (e.note) card.append(h('p', { class: 'fd-noteline' }, e.note));
  card.append(h('section', { class: 'fd-sec' }, h('h3', {}, 'Word by word'),
    h('div', { class: 'fd-parts fd-phparts' }, ...ph.parts.flatMap((p, j) => [
      j ? h('span', { class: 'fd-plus', 'aria-hidden': 'true' }, '+') : null,
      h('span', { class: 'fd-part fd-stem' }, ar(p.ar), h('small', {}, p.say))]))));
  card.append(h('footer', { class: 'fd-foot' },
    h('a', { href: `https://quran.com/${ph.ref.replace(':', '/')}`, rel: 'noopener' }, `See it in the Quran: ${ph.ref}`),
    h('a', { href: '/about/#feedback' }, 'Report a mistake')));
  scrollToCard();
}
function scrollToCard() {
  if (matchMedia('(max-width: 900px)').matches) card.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}
function setHash(lk: string, formKey?: string) {
  history.replaceState(null, '', `#w=${encodeURIComponent(lk)}${formKey ? '&f=' + encodeURIComponent(formKey) : ''}`);
}

// ---------- wiring ----------
input.addEventListener('input', () => { void run(input.value); });
findForm.querySelector('.clear')!.addEventListener('click', () => { input.value = ''; findForm.classList.remove('has'); minePanel.hidden = true; clearAll(); input.focus(); });
tryRow.addEventListener('click', ev => {
  const chip = (ev.target as HTMLElement).closest('.chip') as HTMLElement | null;
  if (!chip) return;
  input.value = chip.dataset.q!; void run(input.value);
});
document.addEventListener('keydown', ev => {
  if (ev.key === '/' && document.activeElement !== input && !(ev.target as HTMLElement).matches('input,textarea')) { ev.preventDefault(); input.focus(); }
});

// A shared link: #q=forgive, #w=<lemma|pos>&f=<written form>, or #mine
(() => {
  const p = new URLSearchParams(location.hash.slice(1));
  const q = p.get('q'), w = p.get('w'), f = p.get('f'), root = p.get('root');
  if (q) { input.value = q; findForm.classList.add('has'); void run(q, { fromHash: true }); }
  else if (w) { void openWord(w, f ?? undefined); }
  else if (root) { void openRoot(rootKey(root)); }
  else if (location.hash === '#mine') openMine();
})();
