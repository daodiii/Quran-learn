// src/lib/finder-card.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { howBuilt, plainPerson, groupByLemma, rootKey } from './finder-card.ts';
import type { Row } from './finder-card.ts';

const WALLADHINA: Row = ['وَٱلَّذِينَ', 'walladhīna', null, 'الَّذِى', 'REL', 0, 'MP', ['وَ|w:CONJ+'], [],
  'who, which, that (relative pronoun)', 137, ['2:4']];
const YUMINUNA: Row = ['يُؤْمِنُونَ', 'yuʾminūna', 'ءمن', 'ءَامَنَ', 'V', 4, 'IMPF|3MP', [], ['ونَ|PRON:3MP'],
  'to believe, have faith', 86, ['2:3']];
const FABASHSHIRHUM: Row = ['فَبَشِّرْهُم', 'fabashshirhum', 'بشر', 'بُشِّرَ', 'V', 2, 'IMPV|2MS', ['فَ|f:REM+'], ['هُم|PRON:3MP'],
  'to give glad tidings', 2, ['3:21']];

test('howBuilt: "and" + the base word, with no grammar words', () => {
  const b = howBuilt(WALLADHINA, 'those who');
  assert.deepEqual(b.parts.map(p => p.say), ['and', 'those who']);
  assert.equal(b.line, 'and · those who');
  assert.equal(b.who, null);
});
test('howBuilt: a verb says who and when in plain words', () => {
  const b = howBuilt(YUMINUNA, 'to believe');
  assert.equal(b.who, 'they (several men)');
  assert.equal(b.when, 'now or later');
  assert.deepEqual(b.parts.map(p => p.role), ['stem', 'ending']);
  assert.equal(b.parts[1].say, 'they, them, their');
});
test('howBuilt: prefix, base word and attached ending together', () => {
  const b = howBuilt(FABASHSHIRHUM, 'to give good news');
  assert.deepEqual(b.parts.map(p => p.role), ['prefix', 'stem', 'ending']);
  assert.equal(b.parts[0].say, 'then, so');
  assert.equal(b.when, 'as a command');
  assert.equal(b.who, 'you (one man)');
});
test('plainPerson: unknown tags give null, never a raw code', () => {
  assert.equal(plainPerson('IMPF|3FS'), 'she');
  assert.equal(plainPerson('M|GEN'), null);
});
test('groupByLemma: forms group under one base word, most used first', () => {
  const g = groupByLemma({ a: [YUMINUNA], b: [{ ...YUMINUNA, 10: 5 } as Row], c: [WALLADHINA] });
  assert.deepEqual(g.get('ءَامَنَ|V'), ['a', 'b']);
  assert.deepEqual(g.get('الَّذِى|REL'), ['c']);
});
test('rootKey: hamza carriers and marks collapse', () => {
  assert.equal(rootKey('أمن'), rootKey('ءمن'));
  assert.equal(rootKey('ك·ت·ب'), 'كتب');
});
