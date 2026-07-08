import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseAyahRef, ayahAudioUrl } from './ayah-ref.ts';

test('parses common reference shapes to first ayah', () => {
  assert.deepEqual(parseAyahRef('Surah Al-Fatiha 1:2'), { surah: 1, ayah: 2 });
  assert.deepEqual(parseAyahRef('Ad-Duha 93:1-3'), { surah: 93, ayah: 1 });
  assert.deepEqual(parseAyahRef('2:255'), { surah: 2, ayah: 255 });
  assert.deepEqual(parseAyahRef('Al-Baqarah 2:286, also 3:1'), { surah: 2, ayah: 286 });
});

test('rejects garbage and out-of-range', () => {
  assert.equal(parseAyahRef('no verse here'), null);
  assert.equal(parseAyahRef('115:1'), null);
  assert.equal(parseAyahRef('0:3'), null);
});

test('builds zero-padded everyayah url', () => {
  assert.equal(ayahAudioUrl({ surah: 1, ayah: 2 }),
    'https://everyayah.com/data/Alafasy_128kbps/001002.mp3');
});
