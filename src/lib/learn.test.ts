import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, queryWords, matchesQuery, nextLesson, levelProgress } from './learn.ts';

test('normalize folds case, accents and apostrophes so "raf" finds "Raf\'"', () => {
  assert.equal(normalize("The Nominative Case (Raf')"), 'the nominative case (raf)');
  assert.equal(normalize('Mubtadaʾ and Khabar'), 'mubtada and khabar');
  assert.equal(normalize('  Fi’l   Harf '), 'fil harf');
  assert.equal(normalize('Maʿlūm'), 'malum');
});

test('queryWords splits on spaces and drops empties', () => {
  assert.deepEqual(queryWords('  Verb   forms '), ['verb', 'forms']);
  assert.deepEqual(queryWords('   '), []);
  assert.deepEqual(queryWords(''), []);
});

test('matchesQuery needs every word, anywhere in the text', () => {
  const text = normalize('Verb Form I (Fa\'ala) Conjugation & moods');
  assert.equal(matchesQuery(text, queryWords('verb')), true);
  assert.equal(matchesQuery(text, queryWords('moods verb')), true);
  assert.equal(matchesQuery(text, queryWords('verb passive')), false);
  assert.equal(matchesQuery(text, []), true);
});

const ordered = [
  { id: 'level-1/01-a', level: 1 },
  { id: 'level-1/02-b', level: 1 },
  { id: 'level-2/01-c', level: 2 },
  { id: 'level-2/02-d', level: 2 },
];

test('nextLesson is the first lesson in course order that is not done', () => {
  assert.equal(nextLesson(ordered, new Set())?.id, 'level-1/01-a');
  assert.equal(nextLesson(ordered, new Set(['level-1/01-a', 'level-1/02-b']))?.id, 'level-2/01-c');
  // A gap is not skipped: finishing lesson 3 first does not move "next" past lesson 1.
  assert.equal(nextLesson(ordered, new Set(['level-2/01-c']))?.id, 'level-1/01-a');
  assert.equal(nextLesson(ordered, new Set(ordered.map((l) => l.id))), null);
});

test('levelProgress counts done and total per level and ignores unknown ids', () => {
  const p = levelProgress(ordered, new Set(['level-1/01-a', 'level-2/02-d', 'level-9/99-gone']));
  assert.deepEqual(p.get(1), { done: 1, total: 2 });
  assert.deepEqual(p.get(2), { done: 1, total: 2 });
  assert.equal(p.size, 2);
});
