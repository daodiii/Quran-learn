// scripts/lib/group-words.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCorpusRows, groupWords } from './group-words.ts';

const FIXTURE = [
  'LOCATION\tFORM\tTAG\tFEATURES',
  '(1:1:1:1)\tbi\tP\tPREFIX|bi+',
  '(1:1:1:2)\tsomi\tN\tSTEM|POS:N|LEM:{som|ROOT:smw|M|GEN',
  '(1:1:2:1)\t{ll~ahi\tPN\tSTEM|POS:PN|LEM:{ll~ah|ROOT:Alh|GEN',
  '(2:1:1:1)\tAl^m^\tINL\tSTEM|POS:INL',
  '(2:3:2:1)\tyu&ominu\tV\tSTEM|POS:V|IMPF|(IV)|LEM:\'aAmana|ROOT:Amn|3MP',
  '(2:3:2:2)\twna\tPRON\tSUFFIX|PRON:3MP',
  '(2:4:4:1)\t>unzila\tV\tSTEM|POS:V|PERF|PASS|(IV)|LEM:>anzala|ROOT:nzl|3MS',
  '(2:137:11:1)\tfa\tRSLT\tPREFIX|f:RSLT+',
  '(2:137:11:2)\t<in~a\tACC\tSTEM|POS:ACC|LEM:<in~|SP:<in~',
  '(2:137:11:3)\tmaA\tPREV\tSTEM|POS:PREV|LEM:maA',
  '(12:2:2:1)\t>anzalo\tV\tSTEM|POS:V|PERF|(IV)|LEM:>anzala|ROOT:nzl|1P',
  '(12:2:2:2)\tna`\tPRON\tSUFFIX|PRON:1P',
  '(12:2:2:3)\thu\tPRON\tSUFFIX|PRON:3MS',
].join('\n');

test('parseCorpusRows skips headers and parses locations', () => {
  const rows = parseCorpusRows(FIXTURE);
  assert.equal(rows.length, 13);
  assert.deepEqual(rows[0], {
    surah: 1, ayah: 1, word: 1, segment: 1,
    formBw: 'bi', tag: 'P', features: ['PREFIX', 'bi+'],
  });
});

test('groupWords: prefix + stem concatenate into one word', () => {
  const w = groupWords(parseCorpusRows(FIXTURE));
  assert.equal(w[0].surfaceBw, 'bisomi');
  assert.deepEqual(w[0].prefixes, [{ formBw: 'bi', feature: 'bi+' }]);
  assert.equal(w[0].stems.length, 1);
  assert.deepEqual(w[0].stems[0], {
    lemmaBw: '{som', rootBw: 'smw', pos: 'N', formNo: 0, featureTokens: ['M', 'GEN'],
  });
  assert.equal(w[0].location, '1:1');
});

test('groupWords: verb form number, subject-ending suffix, features', () => {
  const w = groupWords(parseCorpusRows(FIXTURE));
  const yuminuna = w.find(x => x.key === '2:3:2')!;
  assert.equal(yuminuna.surfaceBw, 'yu&ominuwna');
  assert.equal(yuminuna.stems[0].formNo, 4);
  assert.deepEqual(yuminuna.stems[0].featureTokens, ['IMPF', '3MP']);
  assert.deepEqual(yuminuna.suffixes, [{ formBw: 'wna', feature: 'PRON:3MP' }]);
});

test('groupWords: passive marker stays in featureTokens', () => {
  const w = groupWords(parseCorpusRows(FIXTURE));
  const unzila = w.find(x => x.key === '2:4:4')!;
  assert.ok(unzila.stems[0].featureTokens.includes('PASS'));
});

test('groupWords: two-stem word keeps both stems', () => {
  const w = groupWords(parseCorpusRows(FIXTURE));
  const fainnama = w.find(x => x.key === '2:137:11')!;
  assert.equal(fainnama.surfaceBw, 'fa<in~amaA');
  assert.equal(fainnama.stems.length, 2);
  assert.equal(fainnama.stems[0].pos, 'ACC');
  assert.equal(fainnama.stems[1].pos, 'PREV');
});

test('groupWords: two pronoun suffixes kept in order (anzalna-hu)', () => {
  const w = groupWords(parseCorpusRows(FIXTURE));
  const anzalnahu = w.find(x => x.key === '12:2:2')!;
  assert.deepEqual(anzalnahu.suffixes.map(s => s.formBw), ['na`', 'hu']);
});

test('groupWords: untagged stem (muqattaat) gets empty lemma/root, pos INL', () => {
  const w = groupWords(parseCorpusRows(FIXTURE));
  const alm = w.find(x => x.key === '2:1:1')!;
  assert.deepEqual(alm.stems[0],
    { lemmaBw: '', rootBw: '', pos: 'INL', formNo: 0, featureTokens: [] });
});

test('groupWords: verb without roman numeral defaults to form 1', () => {
  const rows = parseCorpusRows(
    '(9:9:9:1)\tkataba\tV\tSTEM|POS:V|PERF|LEM:kataba|ROOT:ktb|3MS');
  assert.equal(groupWords(rows)[0].stems[0].formNo, 1);
});
