import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { wordType, parseSurahBody, md, inline, withArabic, plainNote, wordSize } from './surah-study.ts';

const DIR = join(import.meta.dirname, '..', 'content', 'surahs');
const files = readdirSync(DIR).filter((f) => f.endsWith('.mdx')).sort();

test('wordType reads the stem: the last part before the dash decides', () => {
  assert.equal(wordType('Verb - Form I, imperative, 2nd person masculine singular'), 'verb');
  assert.equal(wordType('Pronoun - detached, 3rd person masculine singular'), 'noun');
  assert.equal(wordType('Particle - negation and jussive'), 'little');
  assert.equal(wordType('Conjunction + particle - negation and jussive'), 'little');
  assert.equal(wordType('Preposition + noun - masculine singular'), 'noun');
  assert.equal(wordType('Preposition + attached pronoun 3rd person masculine singular'), 'noun');
  assert.equal(wordType('Particle + Verb - sequential'), 'verb');
});

test('wordSize shrinks as the verse gets longer', () => {
  assert.ok(wordSize(3).size > wordSize(6).size && wordSize(6).size > wordSize(9).size && wordSize(9).size > wordSize(14).size);
});

test('withArabic wraps each run of Arabic and escapes the rest', () => {
  assert.equal(withArabic('say قُلْ <now>'), 'say <span class="ar" lang="ar" dir="rtl">قُلْ</span> &lt;now&gt;');
  assert.equal(withArabic('a لَمْ يَلِدْ b'), 'a <span class="ar" lang="ar" dir="rtl">لَمْ يَلِدْ</span> b');
});

test('inline handles bold and only relative or https links', () => {
  assert.equal(inline('**x** and [us](/about/#feedback)'), '<b>x</b> and <a href="/about/#feedback">us</a>');
  assert.equal(inline('[bad](javascript:alert(1))'), '[bad](javascript:alert(1))');
});

test('md makes paragraphs, lists and tables', () => {
  assert.equal(md('one\n\ntwo'), '<p>one</p><p>two</p>');
  assert.equal(md('- a\n- b'), '<ul><li>a</li><li>b</li></ul>');
  assert.equal(md('1. a\n2. b'), '<ol><li>a</li><li>b</li></ol>');
  assert.match(md('| a | b |\n|---|---|\n| 1 | 2 |'), /<table><thead><tr><th>a<\/th><th>b<\/th><\/tr><\/thead><tbody><tr><td>1<\/td><td>2<\/td><\/tr><\/tbody><\/table>/);
});

test('plainNote turns a long dash into a full stop', () => {
  assert.equal(plainNote('Idafah everywhere — watch the chain'), 'Idafah everywhere. Watch the chain');
});

test('all 38 surah files parse: every verse has a layer, and every part is present', () => {
  assert.equal(files.length, 38);
  let verses = 0;
  const noLayer: string[] = [];
  for (const f of files) {
    const raw = readFileSync(join(DIR, f), 'utf8');
    const want = +/^verseCount: (\d+)/m.exec(raw)![1];
    const t = parseSurahBody(raw);
    assert.equal(t.verses.length, want, `${f}: ${t.verses.length} verse sections, file says ${want}`);
    t.verses.forEach((v, i) => {
      assert.equal(v.n, i + 1, `${f}: verse sections out of order at ${i + 1}`);
      if (!v.layers.length) noLayer.push(`${f} v${v.n}`);
    });
    assert.ok(t.exercises.length >= 1, `${f}: no exercises`);
    assert.ok(t.vocab.length >= 1 && t.vocab.every((r) => r.length >= 4), `${f}: vocabulary table`);
    assert.ok(t.summary.length > 40 && !/<\/?Callout/.test(t.summary), `${f}: no grammar summary`);
    assert.ok(t.overview.some((o) => /theme/i.test(o.label)), `${f}: no theme in the overview`);
    assert.ok(t.glance.table.split('\n').length >= 3, `${f}: no overview table`);
    verses += t.verses.length;
  }
  assert.equal(verses, 571);
  assert.deepEqual(noLayer, [], 'verses with no explanation layers');
});

test('Al-Ikhlas: layers, notes and the sources section', () => {
  const t = parseSurahBody(readFileSync(join(DIR, '112-al-ikhlas.mdx'), 'utf8'));
  assert.deepEqual(t.verses[0].layers.map((l) => l.key), ['nahw', 'sarf', 'balagha']);
  assert.match(t.verses[3].callouts[0].title, /Taqdīm/);
  assert.equal(t.exercises.length, 2);
  assert.match(t.sources, /al-Jadwal/);
  assert.ok(!t.verses[3].layers[2].body.includes('## '), 'the last verse must stop at the next section');
});

test('080 keeps its surah-level synthesis out of the last verse', () => {
  const t = parseSurahBody(readFileSync(join(DIR, '080-abasa.mdx'), 'utf8'));
  assert.ok(t.surahLayers.length >= 1);
  assert.ok(!t.verses[41].layers.some((l) => /Surah-Level/.test(l.body)));
});

test('detailHTML shows the plain line, root, case and word form when they exist, and only the parse when not', async () => {
  const { detailHTML } = await import('./surah-study.ts');
  const full = detailHTML({ ar: 'قُلْ', tr: 'qul', en: 'Say', root: 'ق و ل', irab: 'Command verb', morph: 'Verb - Form I, imperative', cs: 'verb', lens: 'verb', t: 'verb', role: 'Command', say: 'A command.' });
  assert.match(full, /Verb <em>fiʿl<\/em>/);
  assert.match(full, /class="role">Command</);
  assert.match(full, /class="case">Verb · fiʿl</);
  assert.match(full, /qul: Say\. A command\./);
  assert.match(full, /Root <span class="ar"/);
  assert.match(full, /Word form: Verb - Form I, imperative/);
  assert.match(full, /For the grammar book: Command verb/);
  const bare = detailHTML({ ar: 'لَمْ', tr: 'lam', en: 'Not', root: '-', irab: 'Negative particle', morph: 'Particle - negation', cs: 'none', lens: '', t: 'little' });
  assert.ok(!bare.includes('class="role"') && !bare.includes('Root') && !bare.includes('class="case"') && bare.includes('Grammar: Negative particle'));
  assert.ok(!detailHTML({ ar: 'x', tr: '<b>', en: '&', root: '', irab: '"', morph: '<i>', cs: 'none', lens: '', t: 'noun' }).includes('<b>'));
});

test('every verse of all 38 files names its key grammar word, and the lens list covers what the decoder uses', async () => {
  const { LENSES } = await import('./surah-study.ts');
  assert.deepEqual(LENSES.map((l) => l.key), ['particle', 'gen', 'acc', 'nom', 'verb']);
  for (const f of files) {
    const t = parseSurahBody(readFileSync(join(DIR, f), 'utf8'));
    t.verses.forEach((v) => assert.ok(v.highlight.length >= 1, `${f} verse ${v.n}: no highlight`));
  }
});
