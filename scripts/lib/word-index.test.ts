// scripts/lib/word-index.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCorpusRows, groupWords } from './group-words.ts';
import { buildGlossMap, buildIndex, buildNounGlossMap } from './word-index.ts';

// Minimal but REAL slice of verb-forms.json shape (values from the shipped dataset).
const VERB_FORMS = {
  roots: [
    { root: 'ءمن', translit: 'ʾ-m-n', quad: false, totalCount: 879, forms: {
      '4': [{ past: 'آمَنَ', present: 'يُؤْمِنُ', translit: 'āmana / yuʾminu',
              meaning: 'to believe', count: 782, example: '2:3' }] } },
    { root: 'نزل', translit: 'n-z-l', quad: false, totalCount: 293, forms: {
      '4': [{ past: 'أَنْزَلَ', present: 'يُنْزِلُ', translit: 'anzala / yunzilu',
              meaning: 'to send down', count: 190, example: '2:22' }] } },
  ],
};

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

test('buildIndex: noun analysis — no gloss, prefix stored with arabic segment', () => {
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

test('buildIndex: meta counts', () => {
  const idx = makeIndex();
  assert.equal(idx.meta.words, Object.keys(idx.words).length);
  assert.equal(idx.meta.analyses,
    Object.values(idx.words).reduce((n, l) => n + l.length, 0));
  assert.match(idx.meta.source, /Quranic Arabic Corpus/);
});
