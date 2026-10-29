// Builds surahs-data.js for the Surahs mockups from the real surah files and data modules.
//   node docs/redesign/mockups/surahs/build-data.mjs
// Node 24 strips the types in surah-openings.ts and reading-track.ts on import.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..', '..', '..');
const { SURAH_OPENINGS } = await import(pathToFileURL(join(root, 'src/data/surah-openings.ts')).href);
const { READING_TRACK } = await import(pathToFileURL(join(root, 'src/data/reading-track.ts')).href);
const { default: DECODER } = await import(pathToFileURL(join(root, 'src/data/surah-decoder.ts')).href);

// The site teaches three word types and keeps one colour for each: noun (ism), verb (fi'l), little word (harf).
// A word's morph line reads like "Preposition + noun - masculine singular"; the stem (the last part) decides.
function wordType(w) {
  const head = w.morph.split(' - ')[0].toLowerCase();
  const stem = head.split('+').pop().trim();
  if (/^verb/.test(stem)) return 'verb';
  if (/^(particle|preposition|conjunction)/.test(stem) || stem.includes("particle")) return 'little';
  return 'noun';
}

function front(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    out[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
  }
  return out;
}

// Verse count of every surah in mushaf order (the map needs all 114 positions).
// Two checks below guard it: 114 entries that sum to 6,236, and a match with each analysed surah's own file.
const QURAN_VERSES = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
  54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
  14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
  29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11,
  11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
];
if (QURAN_VERSES.length !== 114) throw new Error(`expected 114 verse counts, got ${QURAN_VERSES.length}`);
const QURAN_TOTAL = QURAN_VERSES.reduce((a, b) => a + b, 0);
if (QURAN_TOTAL !== 6236) throw new Error(`verse counts sum to ${QURAN_TOTAL}, expected 6236`);

const levels = [
  { n: 1, title: 'Foundation', ar: 'الأساسيات', blurb: 'Letters, vowels, word types and the first sentences.' },
  { n: 2, title: 'Core Grammar', ar: 'القواعد الأساسية', blurb: 'The three cases, possession and how a sentence is built.' },
  { n: 3, title: 'Intermediate', ar: 'القواعد المتوسطة', blurb: 'Verbs, roots, all ten forms and the pronouns.' },
  { n: 4, title: 'Advanced', ar: 'القواعد المتقدمة', blurb: 'Conditionals, exceptions, weak verbs and rhetoric.' },
  { n: 5, title: 'Applied Study', ar: 'التطبيق القرآني', blurb: 'Read whole passages with everything you have learned.' },
];

// The reading notes use long dashes; the new design does not. Turn each one into a full stop.
const plain = s => s.replace(/\s+—\s+(\S)/g, (_, c) => '. ' + c.toUpperCase());

const dir = join(root, 'src/content/surahs');
const surahs = [];
for (const f of readdirSync(dir).filter(n => n.endsWith('.mdx'))) {
  const slug = f.replace(/\.mdx$/, '');
  const fm = front(readFileSync(join(dir, f), 'utf8'));
  const num = +fm.surahNumber;
  const open = SURAH_OPENINGS[num];
  const track = READING_TRACK.find(e => e.slug === slug);
  if (!open) throw new Error(`no opening for surah ${num}`);
  if (!track) throw new Error(`no reading-track entry for ${slug}`);
  if (+fm.verseCount !== QURAN_VERSES[num - 1]) throw new Error(`${slug}: file says ${fm.verseCount} verses, table says ${QURAN_VERSES[num - 1]}`);
  const verses = DECODER[slug];
  if (!verses || verses.length !== +fm.verseCount) throw new Error(`${slug}: decoder has ${verses && verses.length} verses, file says ${fm.verseCount}`);
  const comp = { noun: 0, verb: 0, little: 0, words: 0 };
  verses.forEach(v => v.words.forEach(w => { comp[wordType(w)]++; comp.words++; }));
  surahs.push({
    num, slug, href: `/surahs/${slug}/`, comp,
    name: fm.name, ar: fm.nameArabic, verses: +fm.verseCount, diff: fm.difficulty,
    rev: open.rev, open: open.open, level: track.afterLevel, note: plain(track.note),
  });
}
surahs.sort((a, b) => a.num - b.num);
if (READING_TRACK.length !== surahs.length) throw new Error('reading track and surah files disagree');

// Every word of every verse, for the mockup that decodes a verse on the page (surahs-words.js).
const words = Object.fromEntries(surahs.map(s => [s.slug, DECODER[s.slug].map(v => ({
  n: v.ayah, ar: v.arabic, tr: v.transliteration, en: v.translation,
  w: v.words.map(w => ({ ar: w.ar, tr: w.tr, en: w.en, root: w.root, t: wordType(w), role: w.irab })),
}))]));
writeFileSync(join(here, 'surahs-words.js'), `// Generated by build-data.mjs. Do not edit.
window.SURAH_WORDS = ${JSON.stringify(words)};
`);

const versesAvailable = surahs.reduce((a, s) => a + s.verses, 0);
const data = {
  total: surahs.length,
  quran: { surahs: 114, verses: QURAN_TOTAL, versesBySurah: QURAN_VERSES },
  versesAvailable,
  levels,
  surahs,
};
writeFileSync(join(here, 'surahs-data.js'), `// Generated by build-data.mjs. Do not edit.\nwindow.SURAH_DATA = ${JSON.stringify(data, null, 1)};\n`);

const by = k => surahs.reduce((m, s) => ((m[s[k]] = (m[s[k]] || 0) + 1), m), {});
const tot = surahs.reduce((a, s) => ({ noun: a.noun + s.comp.noun, verb: a.verb + s.comp.verb, little: a.little + s.comp.little, words: a.words + s.comp.words }), { noun: 0, verb: 0, little: 0, words: 0 });
console.log(`${surahs.length} surahs, ${versesAvailable} of ${QURAN_TOTAL} verses, words`, tot);
console.log('by level', by('level'), 'by difficulty', by('diff'), 'by place', by('rev'));
const cross = {};
surahs.forEach(s => { const k = `L${s.level}/${s.diff}`; cross[k] = (cross[k] || 0) + 1; });
console.log('level x difficulty', cross);
