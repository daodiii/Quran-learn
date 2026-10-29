import { test, expect } from '@playwright/test';

// The nine surahs read after Level 4 have a plain-English layer and a question for every verse.
const LEVEL_4: [string, number][] = [
  ['086-at-tariq', 17],
  ['087-al-ala', 19],
  ['089-al-fajr', 30],
  ['090-al-balad', 20],
  ['091-ash-shams', 15],
  ['092-al-layl', 21],
  ['093-ad-duha', 11],
  ['096-al-alaq', 19],
  ['098-al-bayyinah', 8],
];

for (const [slug, verses] of LEVEL_4) {
  test(`${slug}: every verse has a question, a plain role for its first word, and the book's parse`, async ({ page }) => {
    await page.goto(`/surahs/${slug}/`);
    await expect(page.locator('section.vs')).toHaveCount(verses);
    await expect(page.locator('section.vs .try')).toHaveCount(verses);
    for (let n = 1; n <= verses; n++) {
      const box = page.locator(`#v${n} [data-detail]`);
      await expect(box.locator('.role')).toHaveCount(1);
      await expect(box).toContainText('For the grammar book');
    }
  });
}

// Claims that were wrong against al-Jadwal and were removed from the files.
const REMOVED: [string, string][] = [
  ['091-ash-shams', 'longest oath sequence'],
  ['090-al-balad', 'damir al-fasl'],
  ['093-ad-duha', 'only Allah swears'],
  ['096-al-alaq', 'Humiliation in Arab'],
];

for (const [slug, text] of REMOVED) {
  test(`${slug}: no longer says "${text}"`, async ({ page }) => {
    await page.goto(`/surahs/${slug}/`);
    expect((await page.content()).toLowerCase()).not.toContain(text.toLowerCase());
  });
}
