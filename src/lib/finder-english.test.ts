// src/lib/finder-english.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { baseStem, damerau, prepareLayer, findConcepts, understand } from './finder-english.ts';
import type { Layer } from './finder-english.ts';

const mk = (easy: string, type: string[], n = 10, kind = 'action') =>
  ({ easy, kind, type, note: null, check: false, n, r: [] });
const SMALL: Layer = {
  'قَالَ|V': mk('to say, to speak', ['say', 'said', 'speak', 'he said', 'tell'], 1600),
  'ءَامَنَ|V': mk('to believe, to have faith', ['believe', 'believed', 'faith', 'iman', 'beleive'], 800),
  'كِتَٰب|N': mk('book, scripture, writing', ['book', 'scripture', 'the book'], 260, 'thing'),
  'صَبْر|N': mk('patience, staying steady in hard times', ['patience', 'sabr', 'endurance'], 100, 'thing'),
  'أَكَلَ|V': mk('to eat, to take food', ['eat', 'ate', 'food'], 100),
  'خَلَقَ|V': mk('to create, to make from nothing', ['create', 'make'], 250),
};
const P = prepareLayer(SMALL);
const top = (q: string) => findConcepts(P, q, 3).concepts.map(c => c.key.split('|')[0]);

test('stem: irregular English forms reduce to their base', () => {
  assert.equal(baseStem('ate'), baseStem('eat'));
  assert.equal(baseStem('said'), baseStem('say'));
  assert.equal(baseStem('forgave'), baseStem('forgive'));
});
test('damerau: a swap or a missing letter is one edit', () => {
  assert.equal(damerau('beleive', 'believe'), 1);
  assert.equal(damerau('fogive', 'forgive'), 1);
  assert.equal(damerau('abc', 'xyz', 1), 2);
});
test('phrases: filler words do not block a match', () => {
  assert.deepEqual(top('they believed'), ['ءَامَنَ']);
  assert.deepEqual(top('he said'), ['قَالَ']);
  assert.deepEqual(top('the book'), ['كِتَٰب']);
});
test('forms: past tense and -ing find the base word', () => {
  assert.deepEqual(top('ate'), ['أَكَلَ']);
  assert.deepEqual(top('eating'), ['أَكَلَ']);
});
test('loanword spellings find the word', () => {
  assert.deepEqual(top('sabr'), ['صَبْر']);
});
test('typos are corrected and reported', () => {
  const r = findConcepts(P, 'recieve patience');
  assert.ok(r.understood.tokens.length === 2);
  const t = findConcepts(P, 'beleive');
  assert.equal(t.concepts[0].key, 'ءَامَنَ|V');
  const c = findConcepts(P, 'patinece');
  assert.equal(c.concepts[0].key, 'صَبْر|N');
  assert.equal(c.understood.corrected, 'patience');
});
test('hint: pronoun and tense are read from the phrase', () => {
  assert.deepEqual(understand('they believed').hint, { person: '3', number: 'P', tense: 'past' });
  assert.deepEqual(understand('he said').hint, { person: '3', number: 'S', tense: 'past' });
  assert.deepEqual(understand('we eat').hint, { person: '1', number: 'P', tense: 'present' });
  assert.deepEqual(understand('book').hint, { person: null, number: null, tense: null });
});
test('a single filler word is still searched', () => {
  assert.ok(understand('the').tokens.length === 1);
});
test('words like "constructor" do not crash the stemmer', () => {
  assert.doesNotThrow(() => findConcepts(P, 'constructor'));
});
test('ranking: a more frequent word beats a rarer one for the same term', () => {
  const L: Layer = { 'a|V': mk('x', ['serve'], 5), 'b|V': mk('y', ['serve'], 500) };
  assert.equal(findConcepts(prepareLayer(L), 'serve').concepts[0].key, 'b|V');
});

// Acceptance: the searches that returned nothing, or noise, before the English layer.
const REAL: Layer = JSON.parse(readFileSync(new URL('../data/finder/plain-layer.json', import.meta.url), 'utf8'));
const RP = prepareLayer(REAL);
const easyOf = (q: string) => findConcepts(RP, q, 5).concepts.map(c => c.entry.easy.toLowerCase()).join(' | ');
for (const [q, expect] of [
  ['he said', /say|speak/], ['they believed', /believe|faith/], ['the book', /book/],
  ['day of judgement', /day/], ['come out', /come out|go out/], ['beleive', /believe/],
  ['fogive', /forgive/], ['ate', /eat/], ['saw', /see/], ['sabr', /patien/],
  ['jihad', /strive|struggle/], ['salah', /pray/], ['afterlife', /next life|hereafter/],
  ['bismillah', /in the name of god/], ['inshallah', /if god wills/], ['alhamdulillah', /all praise/],
  ['shukr', /thank|grateful/], ['jannah', /garden|paradise/], ['sadaqah', /charity|give/],
] as Array<[string, RegExp]>) {
  test(`real layer: "${q}" finds the right word`, () => assert.match(easyOf(q), expect));
}
