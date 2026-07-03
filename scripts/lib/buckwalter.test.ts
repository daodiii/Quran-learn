import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bwToArabic, bwToTranslit } from './buckwalter.ts';

test('bwToArabic: sound Form I', () => {
  assert.equal(bwToArabic('kataba'), 'كَتَبَ');
});
test('bwToArabic: hollow root', () => {
  assert.equal(bwToArabic('qaAla'), 'قَالَ');
});
test('bwToArabic: Form IV hamza prefix', () => {
  assert.equal(bwToArabic('>anzala'), 'أَنْزَلَ');
});
test('bwToArabic: Form X with wasla', () => {
  assert.equal(bwToArabic('{isotagofara'), 'اِسْتَغْفَرَ');
});
test('bwToArabic: shadda', () => {
  assert.equal(bwToArabic('Eal~ama'), 'عَلَّمَ');
});
test('bwToArabic: madda', () => {
  assert.equal(bwToArabic('|mana'), 'آمَنَ');
});
test('bwToArabic: hamza-fatha-alif (corpus spelling of āmana)', () => {
  assert.equal(bwToArabic("'aAmana"), 'ءَامَنَ');
});
test('bwToArabic: long-vowel waw takes no sukun', () => {
  assert.equal(bwToArabic('yaquwlu'), 'يَقُولُ');
});
test('bwToArabic: explicit sukun not doubled', () => {
  assert.equal(bwToArabic('yasotagofiru'), 'يَسْتَغْفِرُ');
});
test('bwToTranslit: sound', () => {
  assert.equal(bwToTranslit('kataba'), 'kataba');
});
test('bwToTranslit: long vowel', () => {
  assert.equal(bwToTranslit('qaAla'), 'qāla');
});
test('bwToTranslit: initial hamza dropped, emphatics kept', () => {
  assert.equal(bwToTranslit('>anzala'), 'anzala');
  assert.equal(bwToTranslit('{isotagofara'), 'istaghfara');
});
test('bwToTranslit: shadda doubles, ʿayn mapped', () => {
  assert.equal(bwToTranslit('Eal~ama'), 'ʿallama');
});
test('bwToTranslit: iy/uw collapse to ī/ū', () => {
  assert.equal(bwToTranslit('yaquwlu'), 'yaqūlu');
  assert.equal(bwToTranslit('yastaEiynu'), 'yastaʿīnu');
});
test('bwToTranslit: medial hamza retained', () => {
  assert.equal(bwToTranslit("sa>ala"), 'saʾala');
});
