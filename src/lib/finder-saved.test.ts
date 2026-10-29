// src/lib/finder-saved.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { add, remove, has, due, answer, parse, serialize, GAPS } from './finder-saved.ts';

const T = 1_000_000_000_000;
test('add: saving twice keeps one entry', () => {
  const l = add(add([], 'a|N', T), 'a|N', T + 5);
  assert.equal(l.length, 1);
  assert.ok(has(l, 'a|N'));
});
test('remove: takes the word out', () => {
  assert.deepEqual(remove(add([], 'a|N', T), 'a|N'), []);
});
test('due: a new word is due now, oldest first, and the list is capped', () => {
  let l = add(add(add([], 'a', T), 'b', T + 1), 'c', T + 2);
  assert.deepEqual(due(l, T + 10).map(w => w.k), ['a', 'b', 'c']);
  assert.equal(due(l, T + 10, 2).length, 2);
  assert.equal(due(l, T - 1).length, 0);
});
test('answer: knowing a word moves it up a box and later', () => {
  let l = answer(add([], 'a', T), 'a', true, T);
  assert.equal(l[0].box, 1);
  assert.equal(l[0].due, T + GAPS[1]);
  l = answer(l, 'a', true, T);
  assert.equal(l[0].box, 2);
});
test('answer: not knowing sends it back to the first box, soon', () => {
  let l = answer(answer(add([], 'a', T), 'a', true, T), 'a', true, T);
  l = answer(l, 'a', false, T);
  assert.equal(l[0].box, 0);
  assert.equal(l[0].due, T + GAPS[0]);
});
test('answer: the top box is the ceiling', () => {
  let l = add([], 'a', T);
  for (let i = 0; i < 10; i++) l = answer(l, 'a', true, T);
  assert.equal(l[0].box, GAPS.length - 1);
});
test('parse: bad or old data gives an empty list, never a crash', () => {
  assert.deepEqual(parse(null), []);
  assert.deepEqual(parse('not json'), []);
  assert.deepEqual(parse('{"v":2,"words":[]}'), []);
  assert.deepEqual(parse(serialize(add([], 'a', T))).map(w => w.k), ['a']);
});
