// src/lib/lookup-search.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prepareIndex, search } from './lookup-search.ts';
import type { ArabicResult, LatinResult, KeyRef, MeaningRef } from './lookup-search.ts';

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
  const r = search(P, 'يُؤْمِنُونَ') as ArabicResult;
  assert.equal(r.kind, 'arabic');
  assert.equal(r.exact!.key, 'يؤمنون');
});
test('arabic: bare typed input matches', () => {
  assert.equal((search(P, 'يؤمنون') as ArabicResult).exact!.key, 'يؤمنون');
});
test('arabic: modern spelling resolves through altKeys', () => {
  assert.equal((search(P, 'الصلاة') as ArabicResult).exact!.key, 'الصلوة');
});
test('arabic: prefix suggestions when no exact hit', () => {
  const r = search(P, 'يؤم') as ArabicResult;
  assert.equal(r.exact, null);
  assert.deepEqual(r.suggestions.map((s: KeyRef) => s.key), ['يؤمنون']);
});
test('arabic: did-you-mean on dead end', () => {
  const r = search(P, 'يؤمنونا') as ArabicResult;
  assert.equal(r.exact, null);
  assert.ok(r.didYouMean.some((s: KeyRef) => s.key === 'يؤمنون'));
});
test('latin: sound matches fold macrons/hamza', () => {
  const r = search(P, 'yuminuna') as LatinResult;
  assert.equal(r.kind, 'latin');
  assert.deepEqual(r.sound.map((s: KeyRef) => s.key), ['يؤمنون']);
});
test('latin: sound prefix matches', () => {
  assert.ok((search(P, 'assal') as LatinResult).sound.some((s: KeyRef) => s.key === 'الصلوة'));
});
test('latin: meaning substring matches', () => {
  const r = search(P, 'believe') as LatinResult;
  assert.deepEqual(r.meaning.map((m: MeaningRef) => m.key), ['يؤمنون']);
});
test('latin: a query can hit both groups without duplication inside one group', () => {
  const r = search(P, 'know') as LatinResult;
  assert.deepEqual(r.meaning.map((m: MeaningRef) => m.key), ['يعلمون']);
});
test('suggestion entries expose display fields', () => {
  const s = (search(P, 'يؤم') as ArabicResult).suggestions[0];
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
test('latin: meaning result carries matched gloss, ranges, tier', () => {
  const r = search(P, 'believed');
  assert.equal(r.kind, 'latin');
  const m = (r as any).meaning[0];
  assert.equal(m.key, 'يؤمنون');
  assert.equal(m.gloss, 'to believe');
  assert.equal(m.tier, 1);
  assert.deepEqual(m.ranges, [[3, 10]]);
});
test('latin: tier ranks above frequency', () => {
  // 'know' whole-word-matches 'to know' (tier 1, total 85). The decoy gloss
  // must be TRUE tier 3: 'unknown' — stem stays 'unknown' (no irregular, no
  // suffix strip), doesn't start with 'know', so only the mid-token substring
  // hits. (NOT 'well-known': 'known' is an IRREGULAR entry stemming to 'know',
  // which would be tier 1 — caught during execution.)
  const p3 = prepareIndex({
    meta: { source: 't', words: 2, analyses: 2, version: 1 },
    words: {
      'يعلمون': [['يَعْلَمُونَ', 'yaʿlamūna', 'علم', 'عَلِمَ', 'V', 1, 'IMPF|3MP',
                  [], [], 'to know', 85, ['2:13']]],
      'مجهول': [['مَجْهُول', 'majhūl', 'جهل', 'مَجْهُول', 'N', 0, 'M',
                  [], [], 'unknown, obscure', 999, ['2:178']]],
    }, altKeys: {},
  } as any);
  const r = search(p3, 'know') as any;
  assert.equal(r.meaning[0].key, 'يعلمون');   // tier 1 beats total 999
  assert.equal(r.meaning[0].tier, 1);
  assert.equal(r.meaning[1].key, 'مجهول');    // tier 3 mid-token substring
  assert.equal(r.meaning[1].tier, 3);
});
test('latin: two-char whole-word query matches (go)', () => {
  const p4 = prepareIndex({
    meta: { source: 't', words: 1, analyses: 1, version: 1 },
    words: { 'ذهب': [['ذَهَبَ', 'dhahaba', 'ذهب', 'ذَهَبَ', 'V', 1, 'PERF',
                     [], [], 'to go, take away', 35, ['2:17']]] }, altKeys: {},
  } as any);
  assert.equal((search(p4, 'go') as any).meaning[0].key, 'ذهب');
});
test('suggestion refs expose translit + pos for row rendering', () => {
  const s = (search(P, 'يؤم') as ArabicResult).suggestions[0];
  assert.equal((s as any).translit, 'yuʾminūna');
  assert.equal((s as any).pos, 'V');
  assert.equal((s as any).form, 4);
});
