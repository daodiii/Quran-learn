import { test } from 'node:test';
import assert from 'node:assert/strict';
import { REVIEW_QUESTIONS } from './index.ts';

test('each review level has 10 well-formed questions sourced from earlier levels', () => {
  const levels = Object.keys(REVIEW_QUESTIONS);
  assert.deepEqual(levels, ['2', '3', '4', '5']);
  for (const [level, questions] of Object.entries(REVIEW_QUESTIONS)) {
    assert.equal(questions.length, 10, `level ${level}`);
    const ids = new Set(questions.map(q => q.id));
    assert.equal(ids.size, 10, `level ${level} question ids must be unique`);
    for (const q of questions) {
      assert.ok(q.question.length > 10, `level ${level} q${q.id}: question too short`);
      assert.equal(q.options.length, 4, `level ${level} q${q.id}: needs 4 options`);
      assert.equal(new Set(q.options).size, 4, `level ${level} q${q.id}: options must be distinct`);
      assert.ok(
        q.correctAnswer >= 0 && q.correctAnswer < 4,
        `level ${level} q${q.id}: correctAnswer out of range`,
      );
      assert.ok(q.explanation && q.explanation.length > 0, `level ${level} q${q.id}: missing explanation`);
      assert.match(q.source, /^level-\d\/\d{2}-[a-z0-9-]+$/, `level ${level} q${q.id}: bad source id`);
      const srcLevel = Number(q.source.split('/')[0].replace('level-', ''));
      assert.ok(
        srcLevel < Number(level),
        `level ${level} q${q.id}: ${q.source} must be from an earlier level`,
      );
    }
  }
});

test('correct answers are spread across option positions, not clustered', () => {
  for (const [level, questions] of Object.entries(REVIEW_QUESTIONS)) {
    const positions = new Set(questions.map(q => q.correctAnswer));
    assert.ok(positions.size >= 3, `level ${level}: correct answers use only ${positions.size} positions`);
  }
});
