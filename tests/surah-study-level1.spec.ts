import { test, expect } from '@playwright/test';

// The five surahs read after Level 1 have a plain-English layer and a question for every verse.
const LEVEL_1: [string, number][] = [
  ['001-al-fatiha', 7],
  ['106-quraysh', 4],
  ['112-al-ikhlas', 4],
  ['113-al-falaq', 5],
  ['114-an-nas', 6],
];

for (const [slug, verses] of LEVEL_1) {
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

test('Al-Fatiha: rabbi and the repeated names are adjectives of Allah, as al-Jadwal says, not badal', async ({ page }) => {
  await page.goto('/surahs/001-al-fatiha/');
  await page.locator('#v2 .verse .w').nth(2).click();
  await expect(page.locator('#v2 [data-detail]')).toContainText("Adjective (na't) of");
  await expect(page.locator('#v3 [data-detail]')).toContainText("Adjective (na't)");
  await page.locator('#v7 .verse .w').nth(4).click();
  await expect(page.locator('#v7 [data-detail]')).toContainText('Badal of');
  await page.locator('#v7 .verse .w').nth(7).click();
  await expect(page.locator('#v7 [data-detail]')).toContainText('strengthens the negation');
});

test('Quraysh: fa opens the answer to an unspoken condition, and al-bayt is a badal of hadha', async ({ page }) => {
  await page.goto('/surahs/106-quraysh/');
  await expect(page.locator('#v3 .layer[data-key="nahw"]')).toContainText('unspoken condition');
  await page.locator('#v3 .verse .w').nth(5).click();
  await expect(page.locator('#v3 [data-detail]')).toContainText('Badal of');
  await expect(page.locator('#v3 .layer[data-key="nahw"]')).not.toContainText('three-level');
});

test('Al-Falaq: idha only gives the time here, and its clause is a muḍāf ilayhi', async ({ page }) => {
  await page.goto('/surahs/113-al-falaq/');
  await page.locator('#v3 .verse .w').nth(3).click();
  await expect(page.locator('#v3 [data-detail]')).toContainText('no condition');
  await page.locator('#v3 .verse .w').nth(4).click();
  await expect(page.locator('#v3 [data-detail]')).toContainText('muḍāf ilayhi of إِذَا');
});

test('An-Nas: min al-jinna is a hal of the whisperer, and the page does not claim the other reading is the most accepted', async ({ page }) => {
  await page.goto('/surahs/114-an-nas/');
  await expect(page.locator('#v6 .layer[data-key="nahw"]')).toContainText('ḥāl');
  await expect(page.locator('#v6')).not.toContainText('most widely accepted');
});

test('Level 1 pages carry the corrected, sourced parse: no stale claims left in the text', async ({ page }) => {
  for (const [slug, , stale] of [
    ['001-al-fatiha', 0, 'badal of الصِّرَاطَ - genitive'],
    ['113-al-falaq', 0, 'verb of the condition'],
    ['106-quraysh', 0, 'لَمْ al-amr'],
  ] as const) {
    await page.goto(`/surahs/${slug}/`);
    expect(await page.content()).not.toContain(stale);
  }
});
