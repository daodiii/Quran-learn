// scripts/lib/word-index.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCorpusRows, groupWords } from './group-words.ts';
import { buildGlossMap, buildIndex, buildNounGlossMap, buildSurfaceGlossMap } from './word-index.ts';
import type { VerbFormsData } from './word-index.ts';

// Minimal but REAL slice of verb-forms.json shape (values from the shipped dataset).
const VERB_FORMS = {
  roots: [
    { root: 'ءمن', translit: 'ʾ-m-n', quad: false, totalCount: 879, forms: {
      '4': [{ past: 'آمَنَ', present: 'يُؤْمِنُ', translit: 'āmana / yuʾminu',
              meaning: 'to believe', count: 782, example: '2:3' }] } },
    { root: 'نزل', translit: 'n-z-l', quad: false, totalCount: 293, forms: {
      '4': [{ past: 'أَنْزَلَ', present: 'يُنْزِلُ', translit: 'anzala / yunzilu',
              meaning: 'to send down', count: 190, example: '2:22' }] } },
    { root: 'شيء', translit: 'sh-y-ʾ', quad: false, totalCount: 519, forms: {
      '1': [{ past: 'شَاءَ', present: 'يَشَاءُ', translit: 'shāʾa / yashāʾu',
              meaning: 'to will, wish', count: 236, example: '2:20' }] } },
  ],
} as unknown as VerbFormsData;

const ROWS = [
  '(2:3:2:1)\tyu&ominu\tV\tSTEM|POS:V|IMPF|(IV)|LEM:\'aAmana|ROOT:Amn|3MP',
  '(2:3:2:2)\twna\tPRON\tSUFFIX|PRON:3MP',
  '(8:2:9:1)\tyu&ominu\tV\tSTEM|POS:V|IMPF|(IV)|LEM:\'aAmana|ROOT:Amn|3MP',
  '(8:2:9:2)\twna\tPRON\tSUFFIX|PRON:3MP',
  '(24:47:11:1)\tyu&ominu\tV\tSTEM|POS:V|IMPF|(IV)|LEM:\'aAmana|ROOT:Amn|3MP',
  '(24:47:11:2)\twna\tPRON\tSUFFIX|PRON:3MP',
  '(31:8:8:1)\tyu&ominu\tV\tSTEM|POS:V|IMPF|(IV)|LEM:\'aAmana|ROOT:Amn|3MP',
  '(31:8:8:2)\twna\tPRON\tSUFFIX|PRON:3MP',
  '(2:4:4:1)\t>unzila\tV\tSTEM|POS:V|PERF|PASS|(IV)|LEM:>anzala|ROOT:nzl|3MS',
  '(1:1:1:1)\tbi\tP\tPREFIX|bi+',
  '(1:1:1:2)\tsomi\tN\tSTEM|POS:N|LEM:{som|ROOT:smw|M|GEN',
  '(2:1:1:1)\tAl^m^\tINL\tSTEM|POS:INL',
  // Annotation-mark lemmas (real corpus rows): maddah ^, dagger alif `, small zero @
  "(2:19:4:1)\t{l\tDET\tPREFIX|Al+",
  "(2:19:4:2)\ts~amaA^'i\tN\tSTEM|POS:N|LEM:samaA^'|ROOT:smw|F|GEN",
  '(2:5:1:1)\t>uw@la`^}ika\tDEM\tSTEM|POS:DEM|LEM:>uwla`^}ik|P',
  "(2:20:15:1)\t$aA^'a\tV\tSTEM|POS:V|PERF|LEM:$aA^'a|ROOT:$yA|3MS",
].join('\n');

function makeIndex() {
  return buildIndex(groupWords(parseCorpusRows(ROWS)), VERB_FORMS);
}

test('buildGlossMap: unambiguous root|form key plus per-citation key', () => {
  const m = buildGlossMap(VERB_FORMS);
  assert.equal(m.get('ءمن|4'), 'to believe');
  assert.equal(m.get('ءمن|4|آمَنَ'), 'to believe');
});

test('buildIndex: identical occurrences aggregate — count and ≤3 refs', () => {
  const idx = makeIndex();
  const list = idx.words['يؤمنون'];
  assert.equal(list.length, 1);
  const a = list[0];
  assert.equal(a[0], 'يُؤْمِنُونَ');       // vocalized surface
  assert.equal(a[10], 4);                 // count: 4 occurrences in fixture
  assert.deepEqual(a[11], ['2:3', '8:2', '24:47']); // first 3 refs only
});

test('buildIndex: verb analysis carries root, form, gloss, suffix segment', () => {
  const [a] = makeIndex().words['يؤمنون'];
  assert.equal(a[2], 'ءمن');              // root (corpus Amn → hamza display)
  assert.equal(a[4], 'V');
  assert.equal(a[5], 4);
  assert.equal(a[6], 'IMPF|3MP');
  assert.deepEqual(a[8], ['ونَ|PRON:3MP']); // real arabic segment + feature
  assert.equal(a[9], 'to believe');
});

test('buildIndex: passive verb keeps PASS token and gets same lemma gloss', () => {
  const [a] = makeIndex().words['انزل'];
  assert.equal(a[0], 'أُنزِلَ');
  assert.ok(a[6].includes('PASS'));
  assert.equal(a[9], 'to send down');
});

test('buildIndex: noun analysis — no gloss without a curated map, prefix stored with arabic segment', () => {
  const [a] = makeIndex().words['بسم'];
  assert.equal(a[4], 'N');
  assert.equal(a[9], null);
  assert.deepEqual(a[7], ['بِ|bi+']);
  assert.equal(a[2], 'سمو');              // root smw
});

test('buildNounGlossMap: keys batches by lemma|pos', () => {
  const m = buildNounGlossMap([
    { batch: 'batch-01', glosses: [{ lemma: 'اسْم', pos: 'N', meaning: 'name' }] },
  ]);
  assert.equal(m.get('اسْم|N'), 'name');
  assert.equal(m.size, 1);
});

test('buildIndex: noun analysis picks up curated gloss via lemma|pos', () => {
  const nounGlosses = new Map([['اسْم|N', 'name']]);
  const idx = buildIndex(groupWords(parseCorpusRows(ROWS)), VERB_FORMS, nounGlosses);
  const [noun] = idx.words['بسم'];
  assert.equal(noun[9], 'name');
  // verbs keep their verb-forms.json gloss and never read the noun map
  const [verb] = idx.words['يؤمنون'];
  assert.equal(verb[9], 'to believe');
  // rootless INL has lemma '' — must stay unglossed even if map is present
  const [inl] = idx.words['الم'];
  assert.equal(inl[9], null);
});

test('buildIndex: rootless INL analysis', () => {
  const [a] = makeIndex().words['الم'];
  assert.equal(a[2], null);
  assert.equal(a[4], 'INL');
  assert.equal(a[3], '');                 // no lemma
});

test('buildIndex: altKeys derived for uthmani spellings', () => {
  const rows = parseCorpusRows(
    '(2:3:5:1)\t{l\tDET\tPREFIX|Al+\n' +
    '(2:3:5:2)\tS~alaw`pa\tN\tSTEM|POS:N|LEM:Salaw`p|ROOT:Slw|F|ACC');
  const idx = buildIndex(groupWords(rows), { roots: [] });
  assert.equal(idx.altKeys['الصلاة'], 'الصلوة');
  assert.ok(idx.words['الصلوة']);
});

test('buildIndex: annotation-mark lemmas render as Uthmani marks, not raw BW', () => {
  const all = Object.values(makeIndex().words).flat();
  const sky = all.find(a => a[0] === 'ٱلسَّمَآءِ');
  assert.equal(sky?.[3], 'سَمَآء');
  const dem = all.find(a => a[4] === 'DEM');
  assert.equal(dem?.[3], 'أُولَٰٓئِك');
  for (const a of all) assert.doesNotMatch(a[3], /[\^#:@"\[\];,.!+%-]/);
});

test('buildIndex: verb with annotation lemma still glossed via root|form fallback', () => {
  const v = Object.values(makeIndex().words).flat().find(a => a[2] === 'شيء');
  assert.equal(v?.[3], 'شَآءَ');
  assert.equal(v?.[9], 'to will, wish');
});

test('buildIndex: noun gloss joins on the Uthmani-mark lemma key', () => {
  const nounGlosses = new Map([['سَمَآء|N', 'sky, heaven']]);
  const idx = buildIndex(groupWords(parseCorpusRows(ROWS)), VERB_FORMS, nounGlosses);
  const sky = Object.values(idx.words).flat().find(a => a[0] === 'ٱلسَّمَآءِ');
  assert.equal(sky?.[9], 'sky, heaven');
});

test('buildIndex: meta counts', () => {
  const idx = makeIndex();
  assert.equal(idx.meta.words, Object.keys(idx.words).length);
  assert.equal(idx.meta.analyses,
    Object.values(idx.words).reduce((n, l) => n + l.length, 0));
  assert.match(idx.meta.source, /Quranic Arabic Corpus/);
});

test('buildSurfaceGlossMap keys surface|pos, NFC-normalized', () => {
  const map = buildSurfaceGlossMap([
    { batch: 'batch-s01', glosses: [{ surface: 'وَيْكَأَنَّ', pos: 'INT', meaning: 'ah, as if' }] },
  ]);
  assert.equal(map.get('وَيْكَأَنَّ'.normalize('NFC') + '|INT'), 'ah, as if');
});

// Real corpus row for هُوَ (huwa, 3MS pronoun, standalone stem, no LEM: field):
// (2:29:1:1)	huwa	PRON	STEM|POS:PRON|3MS
const HUWA_ROW = '(2:29:1:1)\thuwa\tPRON\tSTEM|POS:PRON|3MS';

test('buildIndex: surface gloss fills lemmaless non-INL analyses only', () => {
  // Rows include the existing INL fixture (Al^m^) and the real huwa PRON row.
  const rows = parseCorpusRows(
    '(2:1:1:1)\tAl^m^\tINL\tSTEM|POS:INL\n' +
    HUWA_ROW + '\n' +
    '(1:1:1:1)\tbi\tP\tPREFIX|bi+\n' +
    '(1:1:1:2)\tsomi\tN\tSTEM|POS:N|LEM:{som|ROOT:smw|M|GEN',
  );
  const inlSurface = 'الٓمٓ';   // bwToArabicSurface('Al^m^')
  const pronSurface = 'هُوَ';   // bwToArabicSurface('huwa')
  const surfaceGlosses = new Map([
    [`${inlSurface.normalize('NFC')}|INL`, 'mysterious letters'],
    [`${pronSurface.normalize('NFC')}|PRON`, 'he'],
  ]);
  const idx = buildIndex(groupWords(rows), { roots: [] }, new Map(), surfaceGlosses);

  // INL must stay unglossed even when its surface|pos is in the map
  const [inl] = idx.words['الم'];
  assert.equal(inl[9], null);

  // PRON (lemmaless) picks up the surface gloss
  const allAnalyses = Object.values(idx.words).flat();
  const pron = allAnalyses.find(a => a[4] === 'PRON' && a[0] === pronSurface);
  assert.ok(pron, 'huwa PRON analysis must exist in index');
  assert.equal(pron![9], 'he');

  // Lemma-carrying analysis (the noun بسم) must NOT pick up a surface gloss
  const noun = allAnalyses.find(a => a[4] === 'N');
  assert.ok(noun, 'noun analysis must exist');
  assert.equal(noun![9], null);
});
