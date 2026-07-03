// scripts/validate-word-lookup.ts
// Gate: every word in the Quran must find itself through the REAL lookup path
// (surface → normalize → words/altKeys → analysis matching its own stem).
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { parseCorpusRows, groupWords } from './lib/group-words.ts';
import { buildGlossMap, analysisFieldsForStem } from './lib/word-index.ts';
import { bwToArabicSurface } from './lib/bw-surface.ts';
import { normalizeArabic, foldLatin } from '../src/lib/arabic-normalize.ts';

const CORPUS = 'src/data/morphology/quranic-corpus-morphology-0.4.txt';
const INDEX = JSON.parse(readFileSync('public/data/word-lookup.json', 'utf8'));
const VERB_FORMS = JSON.parse(readFileSync('public/data/verb-forms.json', 'utf8'));
const glosses = buildGlossMap(VERB_FORMS);

let failures = 0;
const fail = (msg: string) => { failures++; if (failures <= 20) console.error(`FAIL ${msg}`); };

// 1. Full round-trip.
const words = groupWords(parseCorpusRows(readFileSync(CORPUS, 'utf8')));
for (const w of words) {
  const surfaceAr = bwToArabicSurface(w.surfaceBw);
  const k0 = normalizeArabic(surfaceAr);
  const key = INDEX.words[k0] ? k0 : INDEX.altKeys[k0];
  const list = key ? INDEX.words[key] : undefined;
  if (!list) { fail(`${w.key} ${surfaceAr}: no index entry`); continue; }
  for (const stem of w.stems) {
    const f = analysisFieldsForStem(stem, glosses);
    const hit = list.some((a: any[]) =>
      a[0] === surfaceAr && a[3] === f.lemma && a[4] === f.pos && a[5] === f.form);
    if (!hit) fail(`${w.key} ${surfaceAr}: no analysis for ${f.pos}/${f.lemma}`);
  }
}

// 2. Spot checks (spec).
const q = (s: string) => {
  const k = normalizeArabic(s);
  return INDEX.words[INDEX.words[k] ? k : INDEX.altKeys[k]];
};
if (!q('ٱلصَّلَوٰةَ')) fail('spot: uthmani paste الصلوة');
if (!q('الصلاة')) fail('spot: modern typed الصلاة');
if (q('الصلاة') !== q('ٱلصَّلَوٰةَ')) fail('spot: both spellings must resolve to one entry');
if (!q('انزل')?.some((a: any[]) => a[5] === 4 && a[9])) fail('spot: انزل → Form IV with gloss');
if (!(q('من')?.length >= 4)) fail('spot: من homographs');
if (!q('الم')?.some((a: any[]) => a[4] === 'INL')) fail('spot: الم muqattaat'); // key shared with أَلَمْ — INL is not row 0
if (!q('يؤمنون')?.some((a: any[]) => a[9] === 'to believe, have faith')) fail('spot: يؤمنون gloss'); // exact curated string from verb-forms.json

// 3. Every transliteration folds to plain ASCII (locks the LATIN_FOLD table).
for (const list of Object.values<any[]>(INDEX.words)) {
  for (const a of list) {
    const folded = foldLatin(a[1]);
    if (!/^[a-z0-9]*$/.test(folded)) fail(`translit unfoldable: "${a[1]}" → "${folded}"`);
  }
}

// 4. Size guard.
const gz = gzipSync(JSON.stringify(INDEX)).length;
if (gz > 800 * 1024) fail(`gzip ${gz} over budget`);

const glossless = Object.values<any[]>(INDEX.words).flat()
  .filter((a: any[]) => a[4] === 'V' && a[9] === null);
console.log(`round-trip words=${words.length} keys=${Object.keys(INDEX.words).length}`);
console.log(`verbs without gloss: ${glossless.length}`);
if (glossless.length) console.log(glossless.slice(0, 20)
  .map((a: any[]) => `  ${a[0]} (${a[2]} form ${a[5]})`).join('\n'));
console.log(failures ? `FAILURES: ${failures}` : 'OK');
process.exit(failures ? 1 : 0);
