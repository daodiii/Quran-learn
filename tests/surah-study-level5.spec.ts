import { test, expect } from '@playwright/test';

// The nine surahs read after Level 5 have a plain-English layer and a question for every verse.
const LEVEL_5: [string, number][] = [
  ['078-an-naba', 40],
  ['079-an-naziat', 46],
  ['080-abasa', 42],
  ['081-at-takwir', 29],
  ['082-al-infitar', 19],
  ['083-al-mutaffifin', 36],
  ['084-al-inshiqaq', 25],
  ['085-al-buruj', 22],
  ['088-al-ghashiyah', 26],
];

for (const [slug, verses] of LEVEL_5) {
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
