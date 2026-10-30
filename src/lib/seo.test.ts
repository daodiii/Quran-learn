import { test } from 'node:test';
import assert from 'node:assert/strict';
import { metaTitle, metaDescription } from './seo.ts';

test('a short title is left alone', () => {
  assert.equal(metaTitle('About | Quranic Grammar'), 'About | Quranic Grammar');
});

test('a long title loses the site name first', () => {
  const t = 'Hadith 12: Leaving what does not concern you is part of good Islam | Quranic Grammar';
  const out = metaTitle(t);
  assert.ok(out.length <= 60, out);
  assert.ok(!out.includes('| Quranic Grammar'));
});

test('a title still too long is cut at a word and ends with an ellipsis', () => {
  const out = metaTitle('The Complete and Detailed Guide to Every Single Case Ending in Quranic Arabic Grammar | Quranic Grammar');
  assert.ok(out.length <= 60, out);
  assert.ok(out.endsWith('…'));
  assert.ok(!/\s…$/.test(out));
});

test('a short description is left alone', () => {
  assert.equal(metaDescription('Learn the Arabic alphabet.'), 'Learn the Arabic alphabet.');
});

test('a long description keeps whole sentences', () => {
  const d = 'Meet the question words of the Quran and what each one does in its sentence. Then see how a question joins a negation in one word. After that, practise on verses from the last ten surahs, with the grammar explained under each.';
  const out = metaDescription(d);
  assert.ok(out.length <= 155, String(out.length));
  assert.ok(out.endsWith('.'));
  assert.ok(d.startsWith(out));
});

test('one very long sentence is cut at a word, never inside Arabic', () => {
  const d = 'Meet the question words of the Quran: أَ, هَلْ, مَا, مَن, كَيْفَ, أَيْنَ, أَيّ and the rest, with counts from the Corpus, what job each one does in its sentence, and how أَلَمْ joins a question to a negation in one word.';
  const out = metaDescription(d);
  assert.ok(out.length <= 155, String(out.length));
  assert.ok(out.endsWith('…'));
  const body = out.slice(0, -1);
  assert.ok(d.startsWith(body));
  assert.ok(/\s/.test(d[body.length]), 'cut falls on a space');
});

test('markup and markdown stars are removed', () => {
  assert.equal(metaDescription('A **bold** claim with <em>markup</em>.'), 'A bold claim with markup.');
});
