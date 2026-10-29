// src/scripts/finder.ts: the /resources/find/ page. DOM glue over src/lib/finder-english.ts (English),
// src/lib/lookup-search.ts (Arabic and sound) and src/lib/finder-card.ts (plain "how it is built").
// Built with real DOM nodes only; the repo blocks innerHTML.
import { prepareLayer, findConcepts } from '../lib/finder-english';
import type { Layer, LayerEntry, PreparedLayer, Concept } from '../lib/finder-english';
import { prepareIndex, search } from '../lib/lookup-search';
import type { Prepared, ArabicResult, LatinResult, KeyRef } from '../lib/lookup-search';
import { howBuilt, groupByLemma, rootKey } from '../lib/finder-card';
import type { Row } from '../lib/finder-card';
import { ROMAN_FORMS } from '../lib/grammar-labels';

interface VerbEntry { past: string; present: string | null; translit: string; meaning: string | null; count: number; example: string }
interface VerbRoot { root: string; translit: string; quad: boolean; totalCount: number; forms: Record<string, VerbEntry[]> }
interface Data {
  layer: Layer; LP: PreparedLayer; WP: Prepared;
  lemmas: Map<string, string[]>;               // "lemma|pos" → written forms, most used first
  byRoot: Map<string, string[]>;               // root letters → "lemma|pos" keys
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
const findForm = $('find');

let DATA: Data | null = null, loading: Promise<Data> | null = null;
function load(): Promise<Data> {
  loading ??= (async () => {
    status.textContent = 'Loading the word list…';
    const get = (u: string) => fetch(u).then(r => { if (!r.ok) throw new Error(`${u}: ${r.status}`); return r.json(); });
    const [layer, lookup, verbs] = await Promise.all([get('/data/finder-layer.json'), get('/data/word-lookup.json'), get('/data/verb-forms.json')]);
    const byRoot = new Map<string, string[]>();
    for (const [k, e] of Object.entries(layer as Layer))
      for (const r of e.r) { const rk = rootKey(r); const l = byRoot.get(rk); if (l) l.push(k); else byRoot.set(rk, [k]); }
    DATA = {
      layer, LP: prepareLayer(layer), WP: prepareIndex(lookup),
      lemmas: groupByLemma(lookup.words),
      byRoot,
      verbs: new Map((verbs.roots as VerbRoot[]).map(r => [rootKey(r.root), r])),
    };
    status.textContent = '';
    return DATA;
  })().catch(err => { status.textContent = 'The word list did not load. Check your connection and try again.'; loading = null; throw err; });
  return loading;
}
input.addEventListener('focus', () => { load().catch(() => {}); }, { once: true });

// ---------- small renderers ----------
// The part of a plain meaning before the first colon, for tight spaces ("who, which, that: points to..." -> "who, which, that").
const shortMeaning = (easy: string) => easy.split(':')[0].trim();
// The form to say for a base word: the plain "he did it" form for verbs, else the most used form.
function sayForm(keys: string[], D: Data): Row | undefined {
  for (const k of keys) { const a = D.WP.data.words[k]?.[0] as Row | undefined; if (a && a[4] === 'V' && a[6].startsWith('PERF|3MS') && !a[7].length && !a[8].length) return a; }
  return D.WP.data.words[keys[0]]?.[0] as Row | undefined;
}
const KIND_ORDER = ['action', 'thing', 'person or being', 'describing word', 'place or time', 'name', 'small word'];
const timesText = (n: number) => n >= 100 ? `about ${Math.round(n / 10) * 10} times` : n === 1 ? 'once' : `${n} times`;
const lemmaOf = (key: string) => key.split('|')[0];

function conceptRow(key: string, e: LayerEntry, why: string | null, onPick: () => void): HTMLElement {
  const b = h('button', { type: 'button', class: 'fd-row' },
    ar(lemmaOf(key) || '…', 'fd-row-ar'),
    h('span', { class: 'fd-row-t' },
      h('b', {}, e.easy),
      h('small', {}, [e.kind, why].filter(Boolean).join(' · '))));
  b.addEventListener('click', onPick);
  return b;
}

function formRow(key: string, D: Data): HTMLElement | null {
  const a = D.WP.data.words[key]?.[0];
  if (!a) return null;
  const lk = `${a[3]}|${a[4]}`;
  const e = D.layer[lk];
  const b = h('button', { type: 'button', class: 'fd-row' },
    ar(a[0], 'fd-row-ar'),
    h('span', { class: 'fd-row-t' },
      h('b', {}, e ? e.easy : a[9] ?? ''),
      h('small', {}, `${a[1]} · written form`)));
  b.addEventListener('click', () => openWord(lk, key));
  return b;
}

// ---------- search ----------
const isArabic = (q: string) => /[؀-ۿ]/.test(q);
let seq = 0;
async function run(raw: string, { fromHash = false } = {}) {
  const q = raw.trim();
  const mine = ++seq;
  findForm.classList.toggle('has', !!raw);
  if (!q) { clearAll(); return; }
  let D: Data;
  try { D = await load(); } catch { return; }
  if (mine !== seq) return;
  tryRow.hidden = true;
  results.replaceChildren();
  card.hidden = true;
  grid.hidden = false;
  grid.classList.remove('has-card');
  if (!fromHash) history.replaceState(null, '', `#q=${encodeURIComponent(q)}`);

  if (isArabic(q)) {
    const r = search(D.WP, q) as ArabicResult;
    if (r.exact) {
      const a = r.exact.analyses[0];
      status.textContent = '';
      openWord(`${a[3]}|${a[4]}`, r.exact.key);
      return;
    }
    const list = [...r.suggestions, ...r.didYouMean];
    heading(list.length ? (r.suggestions.length ? 'Words that start like that' : 'Did you mean') : '');
    list.forEach(k => { const row = formRow(k.key, D); if (row) results.append(row); });
    if (!list.length) empty(q);
    status.textContent = list.length ? `${list.length} words found.` : '';
    return;
  }

  const { concepts, understood } = findConcepts(D.LP, q, 12);
  const sound = (search(D.WP, q) as LatinResult).sound.slice(0, 6);
  if (understood.corrected) results.append(h('p', { class: 'fd-fix' }, 'Showing results for ', h('b', {}, understood.corrected), '.'));
  if (concepts.length) {
    heading('By meaning');
    concepts.forEach((c: Concept) => results.append(conceptRow(c.key, c.entry,
      c.tier === 2 ? null : `matched “${c.via}”`, () => openWord(c.key))));
  }
  if (sound.length) {
    heading(concepts.length ? 'Or by sound' : 'By sound');
    sound.forEach((k: KeyRef) => { const row = formRow(k.key, D); if (row) results.append(row); });
  }
  if (!concepts.length && !sound.length) empty(q);
  status.textContent = `${concepts.length + sound.length} results.`;
}
function heading(t: string) { if (t) results.append(h('p', { class: 'fd-group' }, t)); }
function empty(q: string) {
  results.append(h('div', { class: 'empty' }, h('b', {}, 'No word found for that.'),
    h('p', {}, 'Try a simpler word, such as “help”, or how it sounds, such as “rahma”. Still nothing? ',
      h('a', { href: `/about/#feedback` }, 'Tell us what you were looking for'), ', and we will add it.')));
}
function clearAll() {
  seq++;
  tryRow.hidden = false; grid.hidden = true; card.hidden = true; status.textContent = '';
  history.replaceState(null, '', location.pathname);
}

// ---------- the word card ----------
function openWord(lk: string, formKey?: string) {
  const D = DATA!;
  const e = D.layer[lk];
  const keys = D.lemmas.get(lk) ?? [];
  const top = sayForm(keys, D);
  grid.hidden = false;
  card.hidden = false;
  grid.classList.add('has-card');
  card.replaceChildren();

  if (!e) { card.append(h('p', {}, 'No details for this word yet.')); return; }
  const total = e.n;
  const back = h('button', { type: 'button', class: 'fd-back' }, '← Back to results');
  back.addEventListener('click', () => { grid.classList.remove('has-card'); (results.querySelector('button') as HTMLElement | null)?.focus(); });

  card.append(back,
    h('header', { class: 'fd-head' },
      ar(lemmaOf(lk) || top?.[0] || '', 'fd-big'),
      h('div', {},
        h('h2', { class: 'fd-easy' }, e.easy),
        h('p', { class: 'fd-meta' },
          h('span', { class: 'tag' }, e.kind),
          top ? h('span', {}, `say it: ${top[1]}`) : null,
          e.check ? h('span', { class: 'tag next', title: 'A reader has not confirmed this meaning yet' }, 'meaning being checked') : null))));
  if (e.note) card.append(h('p', { class: 'fd-noteline' }, e.note));

  // How each written form is built
  const shown = formKey ? [formKey, ...keys.filter(k => k !== formKey)] : keys;
  const forms = h('section', { class: 'fd-sec' }, h('h3', {}, formKey ? 'The form you typed' : 'Forms you will see'));
  shown.slice(0, formKey ? 5 : 6).forEach((k, i) => {
    const analyses = D.WP.data.words[k] as Row[] | undefined;
    if (!analyses) return;
    const a = analyses[0];
    const built = howBuilt(a, shortMeaning(e.easy));
    const row = h('div', { class: `fd-form${formKey && i === 0 ? ' is-typed' : ''}` },
      ar(a[0], 'fd-form-ar'),
      h('div', { class: 'fd-form-t' },
        h('div', { class: 'fd-parts' }, ...built.parts.flatMap((p, j) => [
          j ? h('span', { class: 'fd-plus', 'aria-hidden': 'true' }, '+') : null,
          h('span', { class: `fd-part fd-${p.role}` }, ar(p.ar), h('small', {}, p.say))])),
        built.who || built.when
          ? h('p', { class: 'fd-who' }, [built.who && `who: ${built.who}`, built.when && `when: ${built.when}`].filter(Boolean).join(' · '))
          : null,
        h('p', { class: 'fd-say' }, `${a[1]} · ${analyses.reduce((n, x) => n + x[10], 0)}×`)));
    forms.append(row);
  });
  card.append(forms);

  // The family, by root
  const roots = e.r.map(rootKey).filter((r, i, all) => all.indexOf(r) === i);
  const kin = roots.flatMap(r => D.byRoot.get(r) ?? []).filter((k, i, all) => k !== lk && all.indexOf(k) === i);
  if (kin.length) {
    const fam = h('section', { class: 'fd-sec' },
      h('h3', {}, 'Same root, same family'),
      h('p', { class: 'fd-sub' }, 'Words built from the same three letters share one idea. ',
        ar(e.r[0].split('').join(' '))));
    for (const kind of KIND_ORDER) {
      const group = kin.filter(k => D.layer[k].kind === kind).sort((a, b) => D.layer[b].n - D.layer[a].n).slice(0, 5);
      if (!group.length) continue;
      const list = h('ul', { class: 'fd-kin' });
      group.forEach(k => {
        const b = h('button', { type: 'button', class: 'fd-chipword' }, ar(lemmaOf(k)), h('small', {}, D.layer[k].easy));
        b.addEventListener('click', () => { openWord(k); card.focus(); });
        list.append(h('li', {}, b));
      });
      fam.append(h('p', { class: 'fd-kind' }, kind), list);
    }
    card.append(fam);
  }

  // Verb forms, when the root has verbs
  const vroot = roots.map(r => D.verbs.get(r)).find(Boolean);
  if (vroot) {
    const used = Object.keys(vroot.forms).map(Number).filter(n => n <= 10).sort((a, b) => a - b);
    const det = h('details', { class: 'fd-sec fd-verbs' }, h('summary', {}, `All verb forms of this root (${used.length} of 10 used in the Quran)`));
    const table = h('div', { class: 'fd-vtable' });
    used.forEach(n => (vroot.forms[String(n)] as VerbEntry[]).forEach(v => {
      table.append(h('div', { class: 'fd-vrow' },
        h('span', { class: 'fd-vform' }, ROMAN_FORMS[n - 1]),
        ar(v.present ? `${v.past} · ${v.present}` : v.past, 'fd-var'),
        h('span', { class: 'fd-vmean' }, v.meaning ?? 'meaning coming soon', h('small', {}, `${v.translit} · ${v.count}×`))));
    }));
    det.append(table, h('p', { class: 'fd-sub' }, 'What the forms usually add to the meaning: ', h('a', { href: '/resources/verb-forms-master-reference/' }, 'the verb forms sheet'), '.'));
    card.append(det);
  }

  // Where to see it, and the small facts last
  const ref = top?.[11]?.[0];
  const foot = h('footer', { class: 'fd-foot' },
    ref ? h('a', { href: `https://quran.com/${ref.replace(':', '/')}`, rel: 'noopener' }, `See it in the Quran: ${ref}`) : null,
    h('span', {}, `Appears ${timesText(total)} in the Quran.`),
    h('a', { href: '/about/#feedback' }, 'Report a mistake'));
  card.append(foot);

  if (matchMedia('(max-width: 900px)').matches) card.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', `#w=${encodeURIComponent(lk)}${formKey ? '&f=' + encodeURIComponent(formKey) : ''}`);
}

// ---------- wiring ----------
input.addEventListener('input', () => run(input.value));
findForm.querySelector('.clear')!.addEventListener('click', () => { input.value = ''; findForm.classList.remove('has'); clearAll(); input.focus(); });
tryRow.addEventListener('click', ev => {
  const chip = (ev.target as HTMLElement).closest('.chip') as HTMLElement | null;
  if (!chip) return;
  input.value = chip.dataset.q!; run(input.value);
});
document.addEventListener('keydown', ev => {
  if (ev.key === '/' && document.activeElement !== input && !(ev.target as HTMLElement).matches('input,textarea')) { ev.preventDefault(); input.focus(); }
});

// A shared link: #q=forgive or #w=<lemma|pos>&f=<written form>
(async () => {
  const p = new URLSearchParams(location.hash.slice(1));
  const q = p.get('q'), w = p.get('w'), f = p.get('f');
  if (q) { input.value = q; findForm.classList.add('has'); run(q, { fromHash: true }); }
  else if (w) { try { await load(); openWord(w, f ?? undefined); } catch { /* status already set */ } }
})();
