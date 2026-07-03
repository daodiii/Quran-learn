// src/lib/arabic-normalize.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeArabic, isArabicQuery, foldLatin, deriveAltKeys } from './arabic-normalize.ts';

test('normalizeArabic: strips harakat and quranic marks', () => {
  assert.equal(normalizeArabic('بِسْمِ'), 'بسم');
  assert.equal(normalizeArabic('يُؤْمِنُونَ'), 'يؤمنون');
  assert.equal(normalizeArabic('الٓمٓ'), 'الم');            // maddah U+0653
});
test('normalizeArabic: folds alif variants and wasla', () => {
  assert.equal(normalizeArabic('أَنزَلَ'), 'انزل');
  assert.equal(normalizeArabic('ٱللَّهِ'), 'الله');
  assert.equal(normalizeArabic('إِبْرَٰهِيم'), 'ابرهيم');    // dagger alif stripped
  assert.equal(normalizeArabic('آمَنَ'), 'امن');
});
test('normalizeArabic: alif maqsura and farsi chars fold', () => {
  assert.equal(normalizeArabic('عَلَىٰ'), 'علي');
  assert.equal(normalizeArabic('موسی'), 'موسي');             // farsi yeh U+06CC
  assert.equal(normalizeArabic('کتاب'), 'كتاب');             // farsi kaf U+06A9
});
test('normalizeArabic: keeps ta marbuta and hamza seats distinct', () => {
  assert.equal(normalizeArabic('رَحْمَة'), 'رحمة');
  assert.equal(normalizeArabic('سُئِلَ'), 'سئل');
});
test('normalizeArabic: idempotent', () => {
  const once = normalizeArabic('ٱلصَّلَوٰةَ');
  assert.equal(normalizeArabic(once), once);
});
test('isArabicQuery', () => {
  assert.equal(isArabicQuery('ملك'), true);
  assert.equal(isArabicQuery('malik'), false);
  assert.equal(isArabicQuery('  يؤمنون '), true);
});
test('foldLatin: macrons, dots, ayn/hamza, separators', () => {
  assert.equal(foldLatin('yunzilūna'), 'yunziluna');
  assert.equal(foldLatin('ʿallama'), 'allama');
  assert.equal(foldLatin('aṣ-ṣalāta'), 'assalata');
  assert.equal(foldLatin("yuʾminūna"), 'yuminuna');
  assert.equal(foldLatin('Istaghfara'), 'istaghfara');
});
test('deriveAltKeys: waw-seated dagger alif → modern alif spelling', () => {
  assert.deepEqual(deriveAltKeys('ٱلصَّلَوٰةَ'), ['الصلاة']);
});
test('deriveAltKeys: bare dagger alif → inserted alif', () => {
  assert.deepEqual(deriveAltKeys('كِتَٰب'), ['كتاب']);
});
test('deriveAltKeys: hamza-seated dagger alif → both modern spellings', () => {
  const alts = deriveAltKeys('قُرْءَٰن');
  assert.ok(alts.includes('قران'));
  assert.ok(alts.includes('قرءان'));
});
test('deriveAltKeys: small yeh → typed ya (ibrahim case)', () => {
  assert.ok(deriveAltKeys('إِبْرَٰهِۧمَ').includes('ابراهيم'));
});
test('deriveAltKeys: no alternates when spelling is already modern', () => {
  assert.deepEqual(deriveAltKeys('يُؤْمِنُونَ'), []);
  assert.deepEqual(deriveAltKeys('عَلَىٰ'), []); // alif-maqsura dagger is NOT a spelling gap
});
test('foldLatin: plain ascii passes through unchanged (idempotent)', () => {
  assert.equal(foldLatin('malik'), 'malik');
  assert.equal(foldLatin(foldLatin('yunzilūna')), 'yunziluna');
});
test('deriveAltKeys: quran case pins the exact alternate set', () => {
  assert.deepEqual(deriveAltKeys('قُرْءَٰن').sort(), ['قرءان', 'قران'].sort());
});
