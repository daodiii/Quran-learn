// src/lib/latin-match.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stem, prepareGloss, prepareQuery, matchGloss } from './latin-match.ts';

// The invariant that matters: query-form and gloss-form REDUCE TO THE SAME
// STEM. Absolute stem strings are internal; equality is the contract.
const EQUAL: [string, string][] = [
  ['believed', 'believe'], ['believes', 'believe'], ['believing', 'believe'],
  ['believers', 'believer'], ['merciful', 'mercy'], ['mercies', 'mercy'],
  ['sent', 'send'], ['sending', 'send'], ['gave', 'give'], ['made', 'make'],
  ['took', 'take'], ['sought', 'seek'], ['brought', 'bring'], ['said', 'say'],
  ['families', 'family'], ['stopped', 'stop'], ['stages', 'stage'],
  ['boxes', 'box'], ['guides', 'guide'], ['guided', 'guide'],
];
for (const [a, b] of EQUAL) {
  test(`stem: ${a} ≡ ${b}`, () => assert.equal(stem(a), stem(b)));
}

const NOT_EQUAL: [string, string][] = [
  ['guidance', 'guide'],   // documented limitation: -ance not stripped
  ['mercy', 'merciless'],  // -less not stripped
  ['sun', 'send'],
];
for (const [a, b] of NOT_EQUAL) {
  test(`stem: ${a} ≢ ${b}`, () => assert.notEqual(stem(a), stem(b)));
}

test('stem: short words survive un-mangled', () => {
  assert.equal(stem('go'), 'go');
  assert.equal(stem('is'), 'is');
  // -ss is not plural-stripped; the final double-s collapses to one.
  assert.equal(stem('bless'), 'bles');
});

test('stem: object-prototype property names are not irregulars', () => {
  assert.equal(stem('constructor'), 'constructor');
});

const g = (s: string) => prepareGloss(s);
const q = (s: string) => prepareQuery(s);

test('match: whole-word is tier 1 with the token range', () => {
  const m = matchGloss(q('believe'), g('to believe'))!;
  assert.equal(m.tier, 1);
  assert.deepEqual(m.ranges, [[3, 10]]);
});
test('match: stem equality is tier 1 (believed → believe)', () => {
  assert.equal(matchGloss(q('believed'), g('to believe'))!.tier, 1);
});
test('match: prefix is tier 2 (bel → believe)', () => {
  assert.equal(matchGloss(q('bel'), g('to believe'))!.tier, 2);
});
test('match: substring is tier 3 (eliev → believe)', () => {
  const m = matchGloss(q('eliev'), g('to believe'))!;
  assert.equal(m.tier, 3);
  assert.deepEqual(m.ranges, [[4, 9]]); // 'to believe'.slice(4,9) === 'eliev'
});
test('match: multi-word requires every token; adjacent ranges merge', () => {
  const m = matchGloss(q('send down'), g('to send down gradually'))!;
  assert.equal(m.tier, 1);
  assert.deepEqual(m.ranges, [[3, 12]]); // "send down" as one merged range
  assert.equal(matchGloss(q('send up'), g('to send down gradually')), null);
});
test('match: worst token tier wins (send + gradu → tier 2)', () => {
  assert.equal(matchGloss(q('send gradu'), g('to send down gradually'))!.tier, 2);
});
test('match: 2-char tokens are exact-only', () => {
  assert.equal(matchGloss(q('go'), g('to go astray'))!.tier, 1);
  assert.equal(matchGloss(q('gr'), g('to send down gradually')), null); // no prefix at 2 chars
});
test('match: 1-char and empty queries never match', () => {
  assert.equal(matchGloss(q('a'), g('a name')), null);
  assert.equal(matchGloss(q('  ·'), g('a name')), null);
});
test('match: irregular verb reaches the gloss (sent → send)', () => {
  assert.equal(matchGloss(q('sent'), g('to send down, reveal'))!.tier, 1);
});
test('match: ranges index into RAW for mixed-case glosses', () => {
  const m = matchGloss(q('god'), g('Allah, God'))!;
  assert.deepEqual(m.ranges, [[7, 10]]); // 'Allah, God'.slice(7,10) === 'God'
});
