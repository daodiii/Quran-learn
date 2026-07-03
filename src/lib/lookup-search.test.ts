// src/lib/lookup-search.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prepareIndex, search } from './lookup-search.ts';

const INDEX = {
  meta: { source: 't', words: 3, analyses: 4, version: 1 },
  words: {
    'يؤمنون': [['يُؤْمِنُونَ', 'yuʾminūna', 'ءمن', 'آمَنَ', 'V', 4, 'IMPF|3MP',
                [], ['ونَ|PRON:3MP'], 'to believe', 87, ['2:3']]],
    'يعلمون': [['يَعْلَمُونَ', 'yaʿlamūna', 'علم', 'عَلِمَ', 'V', 1, 'IMPF|3MP',
                [], ['ونَ|PRON:3MP'], 'to know', 85, ['2:13']]],
    'الصلوة': [['ٱلصَّلَوٰةَ', 'aṣ-ṣalāta', 'صلو', 'صَلَوٰة', 'N', 0, 'F|ACC',
                ['ٱل|Al+'], [], null, 55, ['2:3']]],
  },
  altKeys: { 'الصلاة': 'الصلوة' },
} as any;

const P = prepareIndex(INDEX);

test('arabic: exact vocalized paste', () => {
  const r = search(P, 'يُؤْمِنُونَ');
  assert.equal(r.kind, 'arabic');
  assert.equal(r.exact!.key, 'يؤمنون');
});
test('arabic: bare typed input matches', () => {
  assert.equal(search(P, 'يؤمنون').exact!.key, 'يؤمنون');
});
test('arabic: modern spelling resolves through altKeys', () => {
  assert.equal(search(P, 'الصلاة').exact!.key, 'الصلوة');
});
test('arabic: prefix suggestions when no exact hit', () => {
  const r = search(P, 'يؤم');
  assert.equal(r.exact, null);
  assert.deepEqual(r.suggestions.map(s => s.key), ['يؤمنون']);
});
test('arabic: did-you-mean on dead end', () => {
  const r = search(P, 'يؤمنونا');
  assert.equal(r.exact, null);
  assert.ok(r.didYouMean.some(s => s.key === 'يؤمنون'));
});
test('latin: sound matches fold macrons/hamza', () => {
  const r = search(P, 'yuminuna');
  assert.equal(r.kind, 'latin');
  assert.deepEqual(r.sound.map(s => s.key), ['يؤمنون']);
});
test('latin: sound prefix matches', () => {
  assert.ok(search(P, 'assal').sound.some(s => s.key === 'الصلوة'));
});
test('latin: meaning substring matches', () => {
  const r = search(P, 'believe');
  assert.deepEqual(r.meaning.map(m => m.key), ['يؤمنون']);
});
test('latin: a query can hit both groups without duplication inside one group', () => {
  const r = search(P, 'know');
  assert.deepEqual(r.meaning.map(m => m.key), ['يعلمون']);
});
test('suggestion entries expose display fields', () => {
  const s = search(P, 'يؤم').suggestions[0];
  assert.equal(s.surface, 'يُؤْمِنُونَ');
  assert.equal(s.total, 87);
  assert.equal(s.hint, 'to believe');
});
test('latin: sound results are the true top-N by frequency, not first-encountered', () => {
  const words: Record<string, any[]> = {};
  for (let i = 0; i < 25; i++) {
    words[`كلمة${i}`] = [[`كَلِمَة${i}`, `taword${i}`, null, '', 'N', 0, '', [], [], null, i + 1, ['1:1']]];
  }
  words['تعملون'] = [['تَعْمَلُونَ', 'taʿmalūna', 'عمل', 'عَمِلَ', 'V', 1, 'IMPF|2MP',
    [], [], 'to do', 999, ['2:1']]];
  const p2 = prepareIndex({ meta: { source: 't', words: 26, analyses: 26, version: 1 },
    words, altKeys: {} } as any);
  const r = search(p2, 'ta');
  assert.equal(r.kind, 'latin');
  assert.equal((r as any).sound[0].key, 'تعملون'); // total 999 wins despite being inserted last
  assert.equal((r as any).sound.length, 20);       // cap applied after sorting
});
