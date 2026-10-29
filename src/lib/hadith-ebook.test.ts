import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseHadithBody, splitArabicRuns } from './hadith-ebook';

const DIR = 'src/content/hadith';
const read = (prefix: string) => {
  const file = readdirSync(DIR).find((f) => f.startsWith(prefix));
  assert.ok(file, `no file starting ${prefix}`);
  return readFileSync(join(DIR, file), 'utf-8');
};

test('a single-block hadith: the whole is its only section and it has all its word rows', () => {
  const doc = parseHadithBody(read('01-'));
  assert.equal(doc.hasSeparateWhole, false);
  assert.equal(doc.sections.length, 1);
  assert.equal(doc.whole, doc.sections[0]);
  assert.equal(doc.parts.length, 1);
  assert.equal(doc.parts[0].rows.length, 25);
  assert.ok(doc.whole.arabic.startsWith('إِنَّمَا'));
});

test('a split hadith: a separate whole block first, then the parts with their own rows', () => {
  const doc = parseHadithBody(read('02-'));
  assert.equal(doc.hasSeparateWhole, true);
  assert.equal(doc.whole.heading, 'The Whole Hadith');
  assert.equal(doc.whole.rows.length, 0);
  assert.equal(doc.parts.length, 6);
  assert.equal(doc.parts[0].heading, 'The Man Arrives');
  assert.equal(doc.parts.reduce((n, p) => n + p.rows.length, 0), 99);
});

test('prose before the first section is kept as the intro', () => {
  const doc = parseHadithBody(read('24-'));
  assert.match(doc.intro, /Abu Dharr reports/);
});

test('rows carry all four fields, even on the longest hadith', () => {
  const doc = parseHadithBody(read('24-'));
  for (const part of doc.parts) {
    for (const row of part.rows) {
      assert.ok(row.ar && row.tr && row.en && row.why, `incomplete row in "${part.heading}": ${row.ar}`);
    }
  }
});

test('every hadith page parses, and the PDF would hold every word row on the site', () => {
  const files = readdirSync(DIR).filter((f) => f.endsWith('.mdx')).sort();
  assert.equal(files.length, 42);
  for (const f of files) {
    const text = readFileSync(join(DIR, f), 'utf-8');
    const doc = parseHadithBody(text);
    const parsedRows = doc.parts.reduce((n, p) => n + p.rows.length, 0);
    // Independent count: every markdown row that starts with "| <number> |".
    const rawRows = [...text.replace(/\r\n/g, '\n').matchAll(/^\|\s*\d+\s*\|/gm)].length;
    assert.equal(parsedRows, rawRows, `${f}: parsed ${parsedRows} rows but the file has ${rawRows}`);
    assert.ok(doc.whole.arabic.length > 0, `${f}: no Arabic in the whole block`);
  }
});

test('splitArabicRuns separates Arabic from English so it can use its own font', () => {
  const runs = splitArabicRuns('Nominative (ـُ): the doer of فَعَلَ here');
  const arabic = runs.filter((r) => r.arabic).map((r) => r.text);
  assert.ok(arabic.some((t) => t.includes('فَعَلَ')));
  assert.equal(runs.map((r) => r.text).join(''), 'Nominative (ـُ): the doer of فَعَلَ here');
});
