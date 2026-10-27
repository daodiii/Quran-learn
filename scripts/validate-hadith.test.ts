import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateHadithFile, validateHadithSet, diacriticRatio } from './validate-hadith';

const good = (over: { number?: number; ibn?: boolean; arabic?: string; table?: string } = {}) => `---
title: "Actions Are by Intentions"
titleArabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ"
number: ${over.number ?? 1}
narrator: "Umar ibn al-Khattab"
recordedBy: "Bukhari and Muslim"
ibnRajabAddition: ${over.ibn ?? false}
---

## The Hadith

<ArabicExample
  arabic="${over.arabic ?? 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ'}"
  translation="Actions are judged only by intentions."
/>

## Word by Word

<GrammarTable>
${over.table ?? `| # | Arabic | Transliteration | Meaning | Why it is written this way |
|---|--------|----------------|---------|----------------------------|
| 1 | إِنَّمَا | innamā | only | Because. |
| 2 | الْأَعْمَالُ | al-aʿmālu | the actions | Nominative. |`}
</GrammarTable>
`;

test('a complete file has no issues', () => {
  assert.deepEqual(validateHadithFile(good(), '01-actions-by-intentions.mdx'), []);
});

test('CRLF line endings are accepted', () => {
  assert.deepEqual(validateHadithFile(good().replace(/\n/g, '\r\n'), '01-x.mdx'), []);
});

test('filename prefix must match the frontmatter number', () => {
  const issues = validateHadithFile(good({ number: 2 }), '01-actions-by-intentions.mdx');
  assert.ok(issues.some((i) => /number/.test(i.message)));
});

test('hadith 41 and 42 must be flagged as Ibn Rajab additions, and no others', () => {
  assert.ok(validateHadithFile(good({ number: 41, ibn: false }), '41-x.mdx').some((i) => /Ibn Rajab/.test(i.message)));
  assert.ok(validateHadithFile(good({ number: 5, ibn: true }), '05-x.mdx').some((i) => /Ibn Rajab/.test(i.message)));
  assert.deepEqual(validateHadithFile(good({ number: 41, ibn: true }), '41-x.mdx'), []);
});

test('Arabic without vowel marks is an error', () => {
  const issues = validateHadithFile(good({ arabic: 'انما الاعمال بالنيات' }), '01-x.mdx');
  assert.ok(issues.some((i) => /vowel/.test(i.message)));
});

test('a word row with an empty cell is an error', () => {
  const table = `| # | Arabic | Transliteration | Meaning | Why it is written this way |
|---|---|---|---|---|
| 1 | إِنَّمَا | innamā | only |  |`;
  const issues = validateHadithFile(good({ table }), '01-x.mdx');
  assert.ok(issues.some((i) => /empty/.test(i.message)));
});

test('a word row with the wrong number of cells is an error', () => {
  const table = `| # | Arabic | Transliteration | Meaning | Why it is written this way |
|---|---|---|---|---|
| 1 | إِنَّمَا | innamā | only |`;
  const issues = validateHadithFile(good({ table }), '01-x.mdx');
  assert.ok(issues.some((i) => /has 4 cells, expected 5/.test(i.message)));
});

test('row numbers must run 1..n with no gaps', () => {
  const table = `| # | Arabic | Transliteration | Meaning | Why it is written this way |
|---|---|---|---|---|
| 1 | إِنَّمَا | innamā | only | Because. |
| 3 | الْأَعْمَالُ | al-aʿmālu | the actions | Nominative. |`;
  const issues = validateHadithFile(good({ table }), '01-x.mdx');
  assert.ok(issues.some((i) => /row number/.test(i.message)));
});

test('a file with no word table is an error', () => {
  const issues = validateHadithFile(good().replace(/<GrammarTable>[\s\S]*<\/GrammarTable>/, ''), '01-x.mdx');
  assert.ok(issues.some((i) => /word table/.test(i.message)));
});

test('a long hadith may have several tables, each numbered from 1, and each is checked', () => {
  const head = `| # | Arabic | Transliteration | Meaning | Why it is written this way |
|---|---|---|---|---|`;
  const row = (n: number, why = 'Because.') => `| ${n} | إِنَّمَا | innamā | only | ${why} |`;
  const two = (second: string) => good().replace(
    '</GrammarTable>',
    `</GrammarTable>\n\n<ArabicExample arabic="إِنَّمَا" translation="x" />\n\n<GrammarTable>\n${head}\n${second}\n</GrammarTable>`,
  );
  assert.deepEqual(validateHadithFile(two(row(1)), '01-x.mdx'), []);
  assert.ok(validateHadithFile(two(row(1, '')), '01-x.mdx').some((i) => /table 2, word row 1 has an empty cell/.test(i.message)));
  assert.ok(validateHadithFile(two(row(2)), '01-x.mdx').some((i) => /table 2, word row number 2 should be 1/.test(i.message)));
});

test('every Arabic block needs vowel marks, not just the first', () => {
  const content = good().replace('</GrammarTable>', '</GrammarTable>\n\n<ArabicExample arabic="انما" translation="x" />');
  assert.ok(validateHadithFile(content, '01-x.mdx').some((i) => /Arabic block 2 is missing vowel marks/.test(i.message)));
});

test('set check: numbers must be unique and contiguous from 1', () => {
  assert.deepEqual(validateHadithSet([1, 2, 3], false), []);
  assert.ok(validateHadithSet([1, 3], false).some((i) => /missing/.test(i.message)));
  assert.ok(validateHadithSet([1, 1, 2], false).some((i) => /duplicate/.test(i.message)));
});

test('set check: --complete demands exactly 42', () => {
  const all = Array.from({ length: 42 }, (_, i) => i + 1);
  assert.deepEqual(validateHadithSet(all, true), []);
  assert.ok(validateHadithSet([1, 2, 3], true).some((i) => /42/.test(i.message)));
});

test('diacriticRatio counts vowel marks per letter', () => {
  assert.ok(diacriticRatio('إِنَّمَا') > 0.5);
  assert.equal(diacriticRatio('انما'), 0);
});
