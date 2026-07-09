import { test } from 'node:test';
import assert from 'node:assert/strict';
import { READING_TRACK } from './reading-track.ts';

test('every entry has a slug, note, and valid level; no surah assigned twice', () => {
  const seen = new Set<string>();
  for (const entry of READING_TRACK) {
    assert.match(entry.slug, /^\d{3}-[a-z-]+$/);
    assert.ok(entry.afterLevel >= 1 && entry.afterLevel <= 5, `${entry.slug}: bad level`);
    assert.ok(
      entry.note.length > 15 && entry.note.length < 160,
      `${entry.slug}: note length ${entry.note.length} out of range`,
    );
    assert.ok(!seen.has(entry.slug), `${entry.slug} assigned twice`);
    seen.add(entry.slug);
  }
  assert.equal(seen.size, 38, 'all 38 analyses are placed');
});

test('every level gets a readable batch (5-9 surahs)', () => {
  for (let level = 1; level <= 5; level++) {
    const count = READING_TRACK.filter(e => e.afterLevel === level).length;
    assert.ok(count >= 5 && count <= 9, `level ${level} has ${count} entries`);
  }
});

test('checkpoint surahs sit at their checkpoint level', () => {
  const byLevel = Object.fromEntries(READING_TRACK.map(e => [e.slug, e.afterLevel]));
  assert.equal(byLevel['112-al-ikhlas'], 1);
  assert.equal(byLevel['108-al-kawthar'], 2);
  assert.equal(byLevel['103-al-asr'], 3);
  assert.equal(byLevel['093-ad-duha'], 4);
});
