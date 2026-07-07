// src/lib/verb-search.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prepareVerbs, searchVerbs } from './verb-search.ts';

const ROOTS = [
  { root: 'نزل', translit: 'n-z-l', quad: false, totalCount: 293, forms: {
    '1': [{ past: 'نَزَلَ', present: 'يَنزِلُ', translit: 'nazala / yanzilu',
            meaning: 'to come down, descend', count: 25, example: '26:4' }],
    '4': [{ past: 'أَنزَلَ', present: 'يُنزِلُ', translit: 'anzala / yunzilu',
            meaning: 'to send down, reveal', count: 190, example: '2:22' }],
  } },
  { root: 'غفر', translit: 'gh-f-r', quad: false, totalCount: 234, forms: {
    '1': [{ past: 'غَفَرَ', present: 'يَغْفِرُ', translit: 'ghafara / yaghfiru',
            meaning: 'to forgive', count: 95, example: '2:58' }],
  } },
] as any;
const P = prepareVerbs(ROOTS);

test('arabic: root substring match', () => {
  const m = searchVerbs(P, 'نز');
  assert.equal(m[0].root.root, 'نزل');
  assert.equal(m[0].reason, 'root');
  assert.equal(m[0].meaning, 'to send down, reveal'); // most frequent entry
});
test('latin: translit matches fold separators (gh-f-r ≡ ghfr)', () => {
  const m = searchVerbs(P, 'ghfr');
  assert.equal(m[0].root.root, 'غفر');
  assert.equal(m[0].reason, 'translit');
  assert.equal(m[0].meaning, 'to forgive'); // context meaning, no ranges
  assert.equal(m[0].ranges, null);
});
test('latin: meaning match carries matched gloss + ranges (stemmed)', () => {
  const m = searchVerbs(P, 'sent down');
  assert.equal(m[0].root.root, 'نزل');
  assert.equal(m[0].reason, 'meaning');
  assert.equal(m[0].meaning, 'to send down, reveal');
  assert.deepEqual(m[0].ranges, [[3, 12]]);
  assert.equal(m[0].formNo, '4');
});
test('latin: forgave finds forgive via irregular map', () => {
  assert.equal(searchVerbs(P, 'forgave')[0].root.root, 'غفر');
});
const DUAL = [{ root: 'مسس', translit: 'm-s-s', quad: false, totalCount: 11, forms: {
  '1': [{ past: 'مَسَّ', present: 'يَمَسُّ', translit: 'massa / yamassu',
          meaning: 'to touch, mass against', count: 11, example: '1:1' }] } }] as any;

test('precedence: whole-word/prefix meaning wins over a simultaneous translit hit', () => {
  // 'mas' fold-substring-hits the translit AND stem-matches gloss token 'mass'
  const m = searchVerbs(prepareVerbs(DUAL), 'mas');
  assert.equal(m.length, 1);            // one row per root, never two
  assert.equal(m[0].reason, 'meaning');
  assert.ok(m[0].ranges);               // meaning rows carry ranges
});

test('precedence: tier-3 substring loses to the translit interpretation', () => {
  // 'ass' substring-hits gloss 'mass against' mid-token AND fold-hits 'massa'
  const m = searchVerbs(prepareVerbs(DUAL), 'ass');
  assert.equal(m.length, 1);
  assert.equal(m[0].reason, 'translit');
  assert.equal(m[0].ranges, null);
});

test('arabic: hamza-carrier query collapses to hamza root', () => {
  const r = [{ root: 'ءمن', translit: 'a-m-n', quad: false, totalCount: 5, forms: {
    '4': [{ past: 'آمَنَ', present: 'يُؤْمِنُ', translit: 'amana / yuminu',
            meaning: 'to believe', count: 5, example: '2:3' }] } }] as any;
  assert.equal(searchVerbs(prepareVerbs(r), 'أمن')[0].reason, 'root');
});

test('cap keeps the highest-ranked matches', () => {
  const many = Array.from({ length: 15 }, (_, i) => ({
    root: `ر${i}`, translit: `r-${i}`, quad: false, totalCount: i + 1,
    forms: { '1': [{ past: 'فَعَلَ', present: 'يَفْعَلُ', translit: 'faala / yafalu',
                     meaning: 'to test', count: i + 1, example: '1:1' }] },
  }));
  const m = searchVerbs(prepareVerbs(many as any), 'test', 12);
  assert.equal(m.length, 12);
  assert.equal(m[0].root.totalCount, 15); // frequency-ordered within equal rank
  assert.equal(m[11].root.totalCount, 4); // 15..4 kept; 3..1 dropped by the cap
});
