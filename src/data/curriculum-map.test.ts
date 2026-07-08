import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CURRICULUM_MAP, clusterForLesson } from './curriculum-map.ts';

const LESSON_COUNTS: Record<number, number> = { 1: 11, 2: 12, 3: 22, 4: 19, 5: 16 };

test('every level covers exactly its lesson orders, no gaps or dupes', () => {
  for (const level of CURRICULUM_MAP) {
    const orders = level.clusters.flatMap(c => c.lessons);
    const expected = Array.from({ length: LESSON_COUNTS[level.level] }, (_, i) => i + 1);
    assert.deepEqual([...orders].sort((a, b) => a - b), expected, `level ${level.level}`);
    assert.equal(new Set(orders).size, orders.length, `level ${level.level} dupes`);
  }
});

test('clusters are contiguous ascending runs', () => {
  for (const level of CURRICULUM_MAP)
    for (const c of level.clusters)
      c.lessons.forEach((o, i) => i > 0 && assert.equal(o, c.lessons[i - 1] + 1, `${level.level}/${c.title}`));
});

test('each level with a checkpoint marks exactly one, as its last cluster', () => {
  for (const level of CURRICULUM_MAP) {
    const cps = level.clusters.filter(c => c.checkpoint);
    if (level.level === 5) { assert.equal(cps.length, 0); continue; }
    assert.equal(cps.length, 1, `level ${level.level}`);
    assert.equal(level.clusters.at(-1)?.checkpoint, true, `level ${level.level} checkpoint must be last`);
  }
});

test('clusterForLesson resolves and throws on unknown', () => {
  assert.equal(clusterForLesson(3, 14)?.title, 'Forms II–X');
  assert.throws(() => clusterForLesson(1, 99));
});
