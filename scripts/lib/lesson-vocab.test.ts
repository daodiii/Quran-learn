import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractArabicProps, selectLessonVocab } from './lesson-vocab.ts';

test('extractArabicProps pulls every ArabicExample arabic prop', () => {
  const mdx = `
intro text
<ArabicExample arabic="بِسْمِ اللَّهِ" translation="In the name of Allah" reference="1:1" />
<ArabicExample
  arabic="الْحَمْدُ لِلَّهِ"
  translation="Praise be to Allah"
/>
<Callout type="note">not this</Callout>`;
  assert.deepEqual(extractArabicProps(mdx), ['بِسْمِ اللَّهِ', 'الْحَمْدُ لِلَّهِ']);
});

test('selectLessonVocab joins glosses, dedupes, respects registry and cap', () => {
  // minimal fake index: two glossed words, one glossless, one repeated
  const index = {
    words: {
      'كتاب': [['كِتَابٌ', 'kitābun', 'كتب', '', 'N', 0, '', [], [], 'book, scripture', 250, ['2:2']]],
      'قلم': [['قَلَمٌ', 'qalamun', 'قلم', '', 'N', 0, '', [], [], 'pen', 4, ['68:1']]],
      'الم': [['الم', 'alif-lām-mīm', null, '', 'INL', 0, '', [], [], null, 6, ['2:1']]],
    },
    altKeys: {},
  } as any;
  const registry = new Set<string>(['قلم']); // taught earlier
  const picked = selectLessonVocab(['كِتَابٌ قَلَمٌ الم كِتَابٌ'], index, registry, 10);
  assert.equal(picked.length, 1);            // qalam in registry, alm glossless, kitab deduped
  assert.equal(picked[0].gloss, 'book, scripture');
  assert.equal(picked[0].arabic, 'كِتَابٌ');
  assert.ok(registry.has('كتاب'));           // registry updated in place
});

test('selectLessonVocab ranks by count and caps at max', () => {
  const mk = (surface: string, gloss: string, count: number) =>
    [[surface, 't', null, '', 'N', 0, '', [], [], gloss, count, ['1:1']]];
  const index = { words: { 'ا': mk('ا', 'g1', 5), 'ب': mk('ب', 'g2', 50), 'ت': mk('ت', 'g3', 20) }, altKeys: {} } as any;
  const picked = selectLessonVocab(['ا ب ت'], index, new Set(), 2);
  assert.deepEqual(picked.map(p => p.gloss), ['g2', 'g3']);
});
