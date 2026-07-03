// scripts/lib/bw-surface.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bwToArabicSurface, bwToTranslitSurface } from './bw-surface.ts';

test('surface: bismi (explicit sukun preserved, none added)', () => {
  assert.equal(bwToArabicSurface('bisomi'), 'بِسْمِ');
});
test('surface: wasla kept (not stripped like lemmas)', () => {
  assert.equal(bwToArabicSurface('{ll~ahi'), 'ٱللَّهِ');
});
test('surface: muqattaat maddah marks', () => {
  assert.equal(bwToArabicSurface('Al^m^'), 'الٓمٓ');
});
test('surface: dagger alif suffix (na` = نَٰ of anzalna-hu)', () => {
  assert.equal(bwToArabicSurface('na`'), 'نَٰ');
});
test('surface: throws on unmapped char instead of passing it through', () => {
  assert.throws(() => bwToArabicSurface('naQ'), /unmapped Buckwalter/);
});
test('translit: basic word', () => {
  assert.equal(bwToTranslitSurface('bisomi'), 'bismi');
});
test('translit: moon-letter article gets hyphen', () => {
  assert.equal(bwToTranslitSurface('{loHamodu'), 'al-ḥamdu');
});
test('translit: sun-letter article assimilates with hyphen', () => {
  assert.equal(bwToTranslitSurface('{lS~alaw`pi'), 'aṣ-ṣalāti');
});
test('translit: ta marbuta voiced before case vowel, h finally', () => {
  assert.equal(bwToTranslitSurface('raHomapN'), 'raḥmatun');
  assert.equal(bwToTranslitSurface('raHomap'), 'raḥmah');
});
test('translit: tanwin fatha drops its seat alif', () => {
  assert.equal(bwToTranslitSurface('kitaAbFA'), 'kitāban');
});
test('translit: orthographic gemination not tripled (Allah)', () => {
  assert.equal(bwToTranslitSurface('{ll~ahi'), 'allahi');
});
test('translit: medial wasla silent in liaison', () => {
  assert.equal(bwToTranslitSurface('bi{logayobi'), 'bilghaybi');
});

test('surface: embedded space preserved (Ilyas, 37:130)', () => {
  assert.equal(bwToArabicSurface('<ilo yaAsiyna'), 'إِلْ يَاسِينَ');
});
