// src/lib/latin-match.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stem } from './latin-match.ts';

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
  assert.equal(stem('bless'), stem('bless')); // -ss never plural-stripped
});
