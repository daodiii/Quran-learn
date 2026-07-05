import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bwToArabic, bwToTranslit, bwLemmaToArabic } from './buckwalter.ts';

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

// bwToArabic must stay annotation-naive: build-verb-dataset's draftPast path
// depends on it and the shipped verb-forms.json rendering must not drift.
test('bwToArabic: annotation marks pass through raw (pinned)', () => {
  assert.equal(bwToArabic("samaA^'"), 'سَمَا^ء');
});

test('bwLemmaToArabic: alif + maddah compose to آ', () => {
  assert.equal(bwLemmaToArabic("samaA^'"), 'سَمَآء');
});
test('bwLemmaToArabic: word-initial alif maddah', () => {
  assert.equal(bwLemmaToArabic('A^xir'), 'آخِر');
});
test('bwLemmaToArabic: maddah after dagger alif stays combining', () => {
  // NFC keeps ascending mark order: fatha (31), dagger alif (35), maddah (230)
  assert.equal(bwLemmaToArabic('>uwla`^}ik'), 'أُولَٰٓئِك');
});
test('bwLemmaToArabic: hamza-above rides the tatweel seat', () => {
  // NFC orders kasra (ccc 32) before hamza-above (ccc 230) on the seat
  assert.equal(bwLemmaToArabic('ba_#iys'), 'بَـِٔيس');
});
test('bwLemmaToArabic: small-ya and maddah marks', () => {
  assert.equal(bwLemmaToArabic('yasotaHoYi.^'), 'يَسْتَحْىِۦٓ');
});
test('bwLemmaToArabic: homograph digit suffix is kept (join-meaningful)', () => {
  assert.equal(bwLemmaToArabic('huwd2'), 'هُود2');
});
test('bwLemmaToArabic: plain lemmas identical to bwToArabic', () => {
  assert.equal(bwLemmaToArabic('kataba'), bwToArabic('kataba'));
  assert.equal(bwLemmaToArabic('{isotagofara'), bwToArabic('{isotagofara'));
});
