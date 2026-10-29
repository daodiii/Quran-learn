import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lessonRefs, makeLessonLookup, scoreOf, hasPassed, revisitList, type RawQuestion } from './quiz';

const lessons = [
  { id: 'level-5/13-rhetorical-questions', level: 5, order: 13, title: 'Rhetorical Questions in the Quran' },
  { id: 'level-5/02-surah-al-fatiha', level: 5, order: 2, title: 'Analyzing Surah Al-Fatiha' },
  { id: 'level-1/06-definite-article', level: 1, order: 6, title: 'The Definite Article' },
];
const q = (id: number, explanation: string, source?: string): RawQuestion => ({
  id, question: 'q', options: ['a', 'b', 'c', 'd'], correctAnswer: 1, explanation, source,
});

test('lessonRefs finds each lesson reference once, in order', () => {
  assert.deepEqual(lessonRefs('See L5.13 and L5.02, then L5.13 again (L1.06).'), ['L5.13', 'L5.02', 'L1.06']);
  assert.deepEqual(lessonRefs('No reference here. Level 5.13 is not one.'), []);
  assert.deepEqual(lessonRefs(undefined), []);
});

test('attach gives each question the lessons its explanation and source name', () => {
  const attach = makeLessonLookup(lessons);
  const [a, b, c] = attach([
    q(1, 'It leads the listener to agree (L5.13).'),
    q(2, 'No lesson named here.'),
    q(3, 'Also see L5.02.', 'level-1/06-definite-article'),
  ]);
  assert.deepEqual(a.lessons, [{ href: '/learn/level-5/13-rhetorical-questions/', label: 'L5.13 Rhetorical Questions in the Quran' }]);
  assert.deepEqual(b.lessons, []);
  assert.deepEqual(c.lessons.map((l) => l.label), ['L1.06 The Definite Article', 'L5.02 Analyzing Surah Al-Fatiha']);
});

test('attach fails loudly on a reference or source that is not a lesson', () => {
  const attach = makeLessonLookup(lessons);
  assert.throws(() => attach([q(1, 'See L5.99.')]), /L5\.99/);
  assert.throws(() => attach([q(1, 'x', 'level-9/01-none')]), /level-9/);
});

test('scoreOf counts right answers and rounds the percent as the old quiz did', () => {
  const qs = [{ correctAnswer: 1 }, { correctAnswer: 0 }, { correctAnswer: 2 }];
  assert.deepEqual(scoreOf([1, 0, 0], qs), { right: 2, total: 3, percent: 67 });
  assert.deepEqual(scoreOf([null, null, null], qs), { right: 0, total: 3, percent: 0 });
  assert.deepEqual(scoreOf([], []), { right: 0, total: 0, percent: 0 });
});

test('the pass mark is inclusive: 70 percent passes', () => {
  assert.equal(hasPassed(70, 70), true);
  assert.equal(hasPassed(69, 70), false);
  // 7 right of 10 is exactly 70
  assert.equal(hasPassed(scoreOf([1, 1, 1, 1, 1, 1, 1, 0, 0, 0], new Array(10).fill({ correctAnswer: 1 })).percent, 70), true);
});

test('revisitList groups missed questions by lesson and keeps the ones with no lesson last', () => {
  const attach = makeLessonLookup(lessons);
  const questions = attach([
    q(1, 'See L5.13.'),
    q(2, 'See L5.13 and L5.02.'),
    q(3, 'No lesson.'),
    q(4, 'See L5.02.'),
  ]);
  // right answer is index 1 everywhere: question 4 is answered right
  const list = revisitList([0, 0, 0, 1], questions);
  assert.deepEqual(list.map((r) => [r.lesson?.label ?? null, r.questions]), [
    ['L5.13 Rhetorical Questions in the Quran', [1, 2]],
    ['L5.02 Analyzing Surah Al-Fatiha', [2]],
    [null, [3]],
  ]);
  assert.deepEqual(revisitList([1, 1, 1, 1], questions), []);
});
