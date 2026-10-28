/**
 * Data and HTML for the live tools on the home page.
 * The page renders each tool's first state on the server with these builders, so it reads
 * without JavaScript; src/scripts/home.ts uses the same builders when the visitor changes it.
 * All text here is our own; nothing typed by the visitor is ever inserted as HTML.
 */
import data from '../data/home-tools.json';

export type LookupKey = keyof typeof data.lookup;
export type RootKey = keyof typeof data.roots;
export const LOOKUP = data.lookup;
export const ROOTS = data.roots;
export const SURAH_NAMES = data.surahNames;
export const LOOKUP_KEYS = Object.keys(LOOKUP) as LookupKey[];
export const ROOT_KEYS = Object.keys(ROOTS) as RootKey[];

/** Glosses come from generated data; escape them so nothing in it can become markup. */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const shape = (t: string) => `<i class="shape ${t}" aria-hidden="true"></i>`;

/** Three steps of lesson L2.01 on Al-Hadid 57:3, هُوَ ٱلْأَوَّلُ. */
export const LESSON_STEPS = [
  { h: 'Two words, one sentence', p: 'These two words come from Al-Hadid 57:3. One means “he”, the other “the First”.' },
  { h: 'Arabic leaves out “is”', p: 'English needs “is”: “He is the First.” Arabic puts the two words side by side. This is a nominal sentence, a <i>jumlah ismiyyah</i>.', ghost: true },
  { h: 'Check yourself', p: 'Which word is the starting point of the sentence, the <i>mubtadaʾ</i>? Tap it.', ghost: true, check: true },
];
export const LESSON_FEEDBACK = {
  right: 'Right. <b lang="ar">هُوَ</b>, “he”, is the starting point. <b lang="ar">ٱلْأَوَّلُ</b>, “the First”, is the news about it, the <i>khabar</i>.',
  wrong: 'Not this one. “The First” is what we learn about the starting point. Try the other word.',
};

/** The dua in Taha 20:114, word by word. */
export const DECODER = [
  { ar: 'رَبِّ', t: 'noun', type: 'Noun', job: 'The one called on', root: 'ر ب ب', m: 'my Lord' },
  { ar: '<span class="verb">زِدْ</span><span class="noun">نِى</span>', t: 'verb', type: 'Verb, a command', job: 'A request, with “me” attached', root: 'ز ي د', m: 'increase me' },
  { ar: 'عِلْمًا', t: 'noun', type: 'Noun', job: 'What is asked for, ends in -an', root: 'ع ل م', m: 'in knowledge' },
];

/** The closing dua, word by word, with a line on each word for visitors who tap it. */
export const DUA = [
  { ar: 'رَبِّ', en: 'my Lord', note: '<b lang="ar">رَبِّ</b>, “my Lord”: the one being called on. The “my” is there in the kasra under the bāʾ.' },
  { ar: 'زِدْنِى', en: 'increase me', note: '<b lang="ar">زِدْنِى</b>, “increase me”: a request, with “me” joined to the end of the verb.' },
  { ar: 'عِلْمًا', en: 'in knowledge', note: '<b lang="ar">عِلْمًا</b>, “in knowledge”: what is asked for. It ends in -an.' },
];

export function lookupResult(k: LookupKey): string {
  const d = LOOKUP[k];
  const max = d.family[0][2] as number;
  return `<div class="lk-res pop"><div class="lk-word"><span class="ar big" lang="ar" dir="rtl">${d.ar}</span><span class="gl">${esc(d.gloss)}</span> <span class="tr">${esc(d.tr)}</span>
    <p class="ct"><b>${d.count} times</b> in the Quran · root <bdi class="rootl" lang="ar" dir="rtl">${d.root}</bdi></p></div>
    <div class="lk-fam"><h3>Same root, ${d.rootCount} times in all</h3><ul>${d.family
      .map(([ar, g, n]) => `<li><span class="ar" lang="ar" dir="rtl">${ar}</span><span class="g">${esc(g as string)}<i style="width:${Math.round(((n as number) / max) * 100)}%"></i></span><span class="n">${n}</span></li>`)
      .join('')}</ul></div></div>`;
}

export function decoderReadout(i: number): string {
  const d = DECODER[i];
  return `<div class="pop"><dt>Word type</dt><dd><span class="tag-s ${d.t}">${shape(d.t)}${d.type}</span></dd></div><div class="pop"><dt>Its job</dt><dd>${d.job}</dd></div><div class="pop"><dt>Root</dt><dd><span class="ar" lang="ar" dir="rtl">${d.root}</span></dd></div><div class="pop"><dt>Meaning</dt><dd>${d.m}</dd></div>`;
}

/** One surah in the reader: its opening ayahs, word by word (public/data/home-reader/<n>.json). */
export type ReaderWord = { ar: string; tr: string; t: 'noun' | 'verb' | 'little'; root: string; job: string; form: string; m: string; s: string };
export type ReaderSurah = { number: number; id: string; name: string; ar: string; count: number; ayahs: { n: number; en: string; words: ReaderWord[] }[] };
const TYPE_NAME = { noun: 'Noun', verb: 'Verb', little: 'Particle' };
const arDigits = (n: number) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d]);

export function readerText(s: ReaderSurah): string {
  const ayahs = s.ayahs.map((a, i) => {
    const ws = a.words.map((w, k) => `<button class="rd-w ${w.t}" type="button" aria-pressed="${i === 0 && k === 0}" data-a="${i}" data-k="${k}"><span class="ar">${esc(w.ar)}</span><small lang="en">${esc(w.s)}</small></button>`);
    // The ayah number stays on the line with the last word.
    ws.push(`<span class="rd-end">${ws.pop() ?? ''}<span class="rd-num" aria-label="Ayah ${a.n}">${arDigits(a.n)}</span></span>`);
    return `<div class="rd-ayah"><div class="rd-words" lang="ar" dir="rtl">${ws.join('')}</div><p class="rd-en">${esc(a.en)}</p></div>`;
  }).join('');
  const more = s.count > s.ayahs.length ? `Read all ${s.count} ayahs of ${s.name}` : `Open ${s.name} with notes`;
  return `<div class="rd-title"><div><h3>${esc(s.name)}</h3><small>Surah ${s.number} · ${s.count} ayahs</small></div><span class="ar" lang="ar" dir="rtl">${esc(s.ar)}</span></div>
    <p class="rd-hint js-only">Tap a word.</p>${ayahs}<a class="rd-more" href="/surahs/${s.id}/">${more} →</a>`;
}

export function readerCard(w: ReaderWord): string {
  return `<div class="ar rd-big pop" lang="ar" dir="rtl">${esc(w.ar)}</div><p class="rd-tl">${esc(w.tr)}</p><p class="rd-mn">${esc(w.m)}</p>
    <dl class="pop"><div><dt>Word type</dt><dd><span class="tag-s ${w.t}">${shape(w.t)}${TYPE_NAME[w.t]}</span></dd></div>
    <div><dt>Root</dt><dd>${w.root ? `<bdi class="rootl" lang="ar" dir="rtl">${esc(w.root)}</bdi>` : 'None: a particle, a pronoun or a name'}</dd></div>
    ${w.job ? `<div><dt>Its job</dt><dd>${esc(w.job)}</dd></div>` : ''}${w.form ? `<div class="rd-form"><dt>Form</dt><dd>${esc(w.form)}</dd></div>` : ''}</dl>`;
}

export function rootStats(k: RootKey) {
  const per = ROOTS[k].perSurah;
  return { per, max: Math.max(...per), total: per.reduce((a, b) => a + b, 0), surahs: per.filter(Boolean).length };
}
export const barHeight = (c: number, max: number) => (c ? `${Math.max(5, (c / max) * 100)}%` : '3px');
export function surahLine(k: RootKey, s: number): string {
  const c = ROOTS[k].perSurah[s];
  return `<b>${s + 1}. ${SURAH_NAMES[s]}</b>: ${c ? `${c} ${c === 1 ? 'time' : 'times'}` : 'not in this surah'}`;
}
