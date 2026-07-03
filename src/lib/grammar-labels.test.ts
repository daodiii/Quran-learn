// src/lib/grammar-labels.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { posLabel, grammarLine, affixLabel, ROMAN_FORMS } from './grammar-labels.ts';

test('posLabel: known and unknown codes', () => {
  assert.equal(posLabel('V'), 'verb');
  assert.equal(posLabel('INL'), 'Quranic initials (muqattaat)');
  assert.equal(posLabel('XYZ'), 'XYZ'); // unknown → raw code, never dropped
});
test('grammarLine: verb with form, tense, person', () => {
  assert.equal(grammarLine('V', 4, 'IMPF|3MP'),
    'verb, Form IV — present (imperfect), 3rd person masculine plural');
});
test('grammarLine: passive + mood', () => {
  assert.equal(grammarLine('V', 4, 'PERF|PASS|3MS'),
    'verb, Form IV — past (perfect), passive, 3rd person masculine singular');
});
test('grammarLine: noun with case', () => {
  assert.equal(grammarLine('N', 0, 'M|GEN'), 'noun — masculine, genitive');
});
test('grammarLine: unknown token shown raw', () => {
  assert.equal(grammarLine('N', 0, 'M|WEIRD'), 'noun — masculine, WEIRD');
});
test('grammarLine: bare single-letter number token is NOT misread as plural', () => {
  assert.equal(grammarLine('T', 0, 'P'), 'time adverb — P');
});
test('affixLabel: prefixes and pronoun suffixes', () => {
  assert.equal(affixLabel('w:CONJ+'), 'wa- (and)');
  assert.equal(affixLabel('Al+'), 'al- (the)');
  assert.equal(affixLabel('PRON:3MS'), 'him / his / it');
  assert.equal(affixLabel('PRON:1P'), 'we / us / our');
  assert.equal(affixLabel('+n:EMPH'), 'emphasis -nna');
  assert.equal(affixLabel('??'), '??'); // unknown → raw
});
test('ROMAN_FORMS spans I..XII', () => {
  assert.equal(ROMAN_FORMS[0], 'I');
  assert.equal(ROMAN_FORMS[11], 'XII');
});
