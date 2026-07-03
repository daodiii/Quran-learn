import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCorpus, groupVerbs } from './extract-verbs.ts';

const raw = readFileSync('tests/fixtures/corpus-verbs-sample.txt', 'utf8');

test('parseCorpus keeps only V-tagged tokens with root/form/lemma/location', () => {
  const tokens = parseCorpus(raw);
  assert.ok(tokens.length > 0);
  for (const t of tokens) {
    assert.match(t.location, /^\d+:\d+$/);
    assert.ok(t.root.length >= 2);
    assert.ok(t.form >= 1 && t.form <= 12);
    assert.ok(t.lemma.length > 0);
  }
  // fixture contains non-V rows (e.g. noun gafuwr) that must be dropped
  const rawVCount = raw.split('\n').filter(l => l.split('\t')[2] === 'V').length;
  assert.equal(tokens.length, rawVCount);
});

test('groupVerbs aggregates count and first occurrence per root/form/lemma', () => {
  const grouped = groupVerbs(parseCorpus(raw));
  const qwl = grouped.find(r => r.root === 'qwl');
  assert.ok(qwl, 'root qwl present');
  const f1 = qwl!.forms['1'];
  assert.ok(f1 && f1.some(e => e.lemma === 'qaAla'), 'qwl form I lemma qaAla');
  const nzl = grouped.find(r => r.root === 'nzl');
  assert.ok(nzl!.forms['4']?.some(e => e.lemma === '>anzala'), 'nzl form IV lemma >anzala');
  for (const r of grouped) for (const list of Object.values(r.forms))
    for (const e of list) {
      assert.ok(e.count >= 1);
      assert.match(e.example, /^\d+:\d+$/);
    }
});

test('first occurrence is kept as example, counts accumulate', () => {
  const grouped = groupVerbs(parseCorpus(raw));
  const nzl = grouped.find(r => r.root === 'nzl')!;
  const anzala = nzl.forms['4'].find(e => e.lemma === '>anzala')!;
  assert.equal(anzala.example, '2:4'); // first (IV) >anzala row in fixture
  assert.ok(anzala.count >= 2);
});

test('quadriliteral roots are flagged', () => {
  const grouped = groupVerbs(parseCorpus(raw));
  const zlzl = grouped.find(r => r.root === 'zlzl');
  assert.ok(zlzl?.quad === true);
});
