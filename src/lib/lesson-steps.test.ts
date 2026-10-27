import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wrapArabic, tightHyphens, clampStep, stepIndexFromHash, parseResume, serializeResume, omitResume, safeInline, inlineHtml, groupParts, partOf } from './lesson-steps';

test('groupParts groups steps by part name and carries a name forward to unnamed steps', () => {
  assert.deepEqual(groupParts(['Meet it', undefined, 'Two parts', 'Two parts', undefined]), [
    { name: 'Meet it', start: 0, end: 1 },
    { name: 'Two parts', start: 2, end: 4 },
  ]);
  assert.deepEqual(groupParts([undefined, 'A', 'A']), [
    { name: '', start: 0, end: 0 },
    { name: 'A', start: 1, end: 2 },
  ]);
});

test('groupParts returns no parts when no step names one', () => {
  assert.deepEqual(groupParts([undefined, undefined]), []);
  assert.deepEqual(groupParts([]), []);
});

test('partOf finds the part that holds a step', () => {
  const parts = groupParts(['A', 'A', 'B']);
  assert.equal(partOf(parts, 0), 0);
  assert.equal(partOf(parts, 2), 1);
  assert.equal(partOf(parts, 5), -1);
});

test('safeInline escapes stray markup characters but keeps the few inline tags authors use', () => {
  assert.equal(safeInline('A < B & C > D'), 'A &lt; B &amp; C &gt; D');
  assert.equal(safeInline('end in <b>-u</b> or <i>-un</i>'), 'end in <b>-u</b> or <i>-un</i>');
  assert.equal(safeInline('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
  assert.equal(safeInline('<b onclick="x()">no</b>'), '&lt;b onclick="x()"&gt;no</b>');
});

test('inlineHtml escapes first, then wraps Arabic', () => {
  assert.equal(inlineHtml('R&D هُوَ'), 'R&amp;D <span class="ar-inline" lang="ar" dir="rtl">هُوَ</span>');
});

test('omitResume drops one lesson from the saved map', () => {
  assert.equal(omitResume({ a: 'rule', b: 'try' }, 'a'), JSON.stringify({ b: 'try' }));
  assert.equal(omitResume({}, 'a'), '{}');
});

test('tightHyphens joins a leading dash to its letters and leaves other hyphens alone', () => {
  assert.equal(tightHyphens('The rule: both end in -u'), 'The rule: both end in ‑u');
  assert.equal(tightHyphens('-un or -u'), '‑un or ‑u');
  assert.equal(tightHyphens('wa-llahu and al-awwal'), 'wa-llahu and al-awwal');
});

test('wrapArabic wraps an Arabic run, spaces and marks included, and leaves Latin alone', () => {
  const out = wrapArabic('Pick ٱللَّهُ غَفُورٌ رَّحِيمٌ, then go.');
  assert.equal(out, 'Pick <span class="ar-inline" lang="ar" dir="rtl">ٱللَّهُ غَفُورٌ رَّحِيمٌ</span>, then go.');
});

test('wrapArabic wraps separate runs separately', () => {
  const out = wrapArabic('هُوَ and ٱلْأَوَّلُ');
  assert.equal(
    out,
    '<span class="ar-inline" lang="ar" dir="rtl">هُوَ</span> and <span class="ar-inline" lang="ar" dir="rtl">ٱلْأَوَّلُ</span>',
  );
});

test('wrapArabic returns plain text unchanged', () => {
  assert.equal(wrapArabic('He is the First'), 'He is the First');
});

test('clampStep keeps the index inside the lesson', () => {
  assert.equal(clampStep(-3, 9), 0);
  assert.equal(clampStep(4, 9), 4);
  assert.equal(clampStep(99, 9), 8);
  assert.equal(clampStep(2, 0), 0);
});

test('stepIndexFromHash finds a step by its id, with or without the step- prefix', () => {
  const ids = ['start', 'see', 'rule'];
  assert.equal(stepIndexFromHash('#rule', ids), 2);
  assert.equal(stepIndexFromHash('#step-see', ids), 1);
  assert.equal(stepIndexFromHash('#nope', ids), -1);
  assert.equal(stepIndexFromHash('', ids), -1);
});

test('parseResume reads a saved map and survives bad data', () => {
  assert.deepEqual(parseResume('{"level-2/01-nominal-sentence":"rule"}'), { 'level-2/01-nominal-sentence': 'rule' });
  assert.deepEqual(parseResume('not json'), {});
  assert.deepEqual(parseResume(null), {});
  assert.deepEqual(parseResume('[1,2]'), {});
  assert.deepEqual(parseResume('{"a":5,"b":"ok"}'), { b: 'ok' });
});

test('serializeResume round-trips', () => {
  const s = serializeResume({ 'level-2/01-nominal-sentence': 'rule' }, 'level-2/01-nominal-sentence', 'try');
  assert.deepEqual(parseResume(s), { 'level-2/01-nominal-sentence': 'try' });
});
