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

test('arabic: root substring with hamza-variant collapse', () => {
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
test('cap respected', () => {
  assert.ok(searchVerbs(P, 'a', 12).length <= 12);
});
