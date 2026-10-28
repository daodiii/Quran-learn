/**
 * Builds src/data/home-tools.json, the small dataset behind the live tools on the home page.
 * Generated, never hand-edited. Run: npm run home:data
 *
 * Sources (both already in the repo):
 *  - public/data/word-lookup.json        word counts, lemmas and glosses (Quranic Arabic Corpus v0.4)
 *  - src/data/morphology/quranic-corpus-morphology-0.4.txt   roots per word, for the surah-by-surah line
 *  - data/quran/surah-metadata.json      surah names
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';

type Analysis = [string, string, string, string, string, number, string, string[], string[], string, number, string[]];

const lookup = JSON.parse(readFileSync('public/data/word-lookup.json', 'utf8')) as { words: Record<string, Analysis[]> };
const all = Object.values(lookup.words).flat();

// Some lemmas carry a doubled first letter from the word before them (رَّحِيم); show the plain form.
const plain = (s: string) => s.replace(/^(.[ً-ِْ]*)ّ/, '$1');
const spaced = (root: string) => [...root].join(' ');

/** The English words the lookup demo knows, each tied to one lemma. */
const LOOKUP: Record<string, string> = { knowledge: 'عِلْم', mercy: 'رَحْمَة', guidance: 'هُدًى', book: 'كِتَٰب' };
const TRANSLIT: Record<string, string> = { knowledge: 'ʿilm', mercy: 'raḥma', guidance: 'hudā', book: 'kitāb' };
const GLOSS: Record<string, string> = { 'عَلِمَ': 'to know', 'عَلِيم': 'all-knowing', 'عِلْم': 'knowledge', 'عَلَّمَ': 'to teach', 'رَّحِيم': 'most merciful', 'رَحْمَة': 'mercy', 'رَّحْمَٰن': 'the Most Gracious', 'رَّحِمَ': 'to show mercy', 'هَدَى': 'to guide', 'هُدًى': 'guidance', 'اهْتَدَىٰ': 'to be guided', 'مُّهْتَدُون': 'the guided', 'كِتَٰب': 'book, scripture', 'كَتَبَ': 'to write', 'كَاتِب': 'scribe', 'مَكْتُوب': 'written' };

const lookupOut = Object.fromEntries(
  Object.entries(LOOKUP).map(([en, lemma]) => {
    const forms = all.filter((a) => a[3] === lemma);
    const root = forms[0][2];
    const fam = new Map<string, number>();
    for (const a of all) if (a[2] === root) fam.set(a[3], (fam.get(a[3]) ?? 0) + a[10]);
    const family = [...fam.entries()]
      .filter(([l]) => l !== 'عَٰلَمِين') // "worlds": a true Corpus root member, but a confusing first example
      .sort((x, y) => y[1] - x[1])
      .slice(0, 4)
      .map(([l, n]) => [plain(l), GLOSS[l] ?? all.find((a) => a[3] === l)![9].split(',')[0], n]);
    return [en, {
      ar: plain(lemma), tr: TRANSLIT[en], gloss: en, root: spaced(root),
      count: forms.reduce((s, a) => s + a[10], 0),
      rootCount: [...fam.values()].reduce((s, n) => s + n, 0),
      family,
    }];
  }),
);

/** Roots for the surah-by-surah line, as Buckwalter roots in the Corpus file. */
const ROOTS: Record<string, [string, string, string]> = {
  knowledge: ['Elm', 'ع ل م', 'to know'],
  mercy: ['rHm', 'ر ح م', 'mercy'],
  guidance: ['hdy', 'ه د ي', 'to guide'],
  patience: ['Sbr', 'ص ب ر', 'patience'],
};
const perRoot: Record<string, number[]> = Object.fromEntries(Object.keys(ROOTS).map((k) => [k, Array(114).fill(0)]));
const bw = Object.fromEntries(Object.entries(ROOTS).map(([k, v]) => [v[0], k]));
const seen = new Set<string>();
for (const line of readFileSync('src/data/morphology/quranic-corpus-morphology-0.4.txt', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\((\d+):(\d+):(\d+):\d+\)\t[^\t]*\t[^\t]*\t.*ROOT:([^|]+)/);
  if (!m || !(m[4] in bw)) continue;
  const word = `${m[1]}:${m[2]}:${m[3]}`;
  if (seen.has(word)) continue; // one word, counted once
  seen.add(word);
  perRoot[bw[m[4]]][+m[1] - 1]++;
}
const roots = Object.fromEntries(Object.entries(ROOTS).map(([k, [, ar, gloss]]) => [k, { ar, gloss, perSurah: perRoot[k] }]));

const meta = JSON.parse(readFileSync('data/quran/surah-metadata.json', 'utf8')) as { surahs: { number: number; name: string }[] };
const surahNames = meta.surahs.sort((a, b) => a.number - b.number).map((s) => s.name);

writeFileSync('src/data/home-tools.json', JSON.stringify({ lookup: lookupOut, roots, surahNames }) + '\n');
console.log('home-tools.json:', Object.keys(lookupOut).length, 'lookup words,', Object.entries(roots).map(([k, r]) => `${k} ${r.perSurah.reduce((a, b) => a + b, 0)}`).join(', '));

/**
 * The surah reader on the home page: the opening ayahs of each surah page, word by word, one small
 * file per surah in public/data/home-reader/, fetched when a visitor picks that surah.
 * Source: the "Word-by-Word Breakdown" tables and ArabicExample blocks in src/content/surahs/*.mdx.
 */
const READER_AYAHS = 5;
const SURAH_DIR = 'src/content/surahs';
const OUT_DIR = 'public/data/home-reader';
mkdirSync(OUT_DIR, { recursive: true });

/** Noun, verb or particle, read from the start of the table's morphology note. */
function wordType(morph: string): 'noun' | 'verb' | 'little' {
  if (/^verb/i.test(morph)) return 'verb';
  if (/^(particle|preposition|conjunction|negat|vocative|interrog|condition|emphatic|future|definite article|exception|answer|inceptive)/i.test(morph)) return 'little';
  return 'noun';
}
const firstSense = (en: string) => en.split(/[,;(]/)[0].trim();

let readerWords = 0;
for (const file of readdirSync(SURAH_DIR).filter((f) => f.endsWith('.mdx'))) {
  const src = readFileSync(`${SURAH_DIR}/${file}`, 'utf8');
  const field = (k: string) => src.match(new RegExp(`^${k}:\\s*"?([^"\\r\\n]*)"?`, 'm'))![1];
  const number = Number(field('surahNumber'));
  const parts = src.split(/^### Verse (\d+)/m);
  const ayahs = [];
  for (let i = 1; i < parts.length && ayahs.length < READER_AYAHS; i += 2) {
    const body = parts[i + 1];
    const example = body.match(/<ArabicExample([\s\S]*?)\/>/)?.[1] ?? '';
    const en = example.match(/translation="([^"]*)"/)?.[1] ?? '';
    const table = body.split('Word-by-Word Breakdown')[1]?.split('</GrammarTable>')[0] ?? '';
    // Table columns: # | Arabic | Transliteration | Root | Morphology | I'rab | Meaning
    const words = table.split(/\r?\n/).filter((l) => /^\|\s*\d+\s*\|/.test(l)).map((l) => {
      const [ar, tr, root, morph, irab, meaning] = l.split('|').slice(2, -1).map((c) => c.trim());
      return { ar, tr, t: wordType(morph), root: root === '-' ? '' : root, job: irab.split(' - ')[0], form: morph, m: meaning, s: firstSense(meaning) };
    });
    readerWords += words.length;
    ayahs.push({ n: Number(parts[i]), en, words });
  }
  const id = file.replace(/\.mdx$/, ''); // the surah page's collection id, as in /surahs/<id>/
  writeFileSync(`${OUT_DIR}/${number}.json`, JSON.stringify({ number, id, name: field('name'), ar: field('nameArabic'), count: Number(field('verseCount')), ayahs }) + '\n');
}
console.log(`home-reader: ${readdirSync(OUT_DIR).length} surahs, ${readerWords} words`);
