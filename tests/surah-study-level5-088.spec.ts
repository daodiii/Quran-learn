import { test, expect } from '@playwright/test';

// Al-Ghashiyah (88) has a plain-English layer and a question for every verse, and the parses al-Jadwal corrected stay corrected.
test('Al-Ghashiyah: every verse has a question, a plain role for its first word, and the book’s parse', async ({ page }) => {
  await page.goto('/surahs/088-al-ghashiyah/');
  await expect(page.locator('section.vs')).toHaveCount(26);
  await expect(page.locator('section.vs .try')).toHaveCount(26);
  for (let n = 1; n <= 26; n++) {
    const box = page.locator(`#v${n} [data-detail]`);
    await expect(box.locator('.role')).toHaveCount(1);
    await expect(box).toContainText('For the grammar book');
  }
});

test('Al-Ghashiyah: khashi’ah is an adjective of wujuh and the khabar only arrives in verse 4', async ({ page }) => {
  await page.goto('/surahs/088-al-ghashiyah/');
  await page.locator('#v2 .verse .w').nth(2).click();
  await expect(page.locator('#v2 [data-detail]')).toContainText('Adjective (naʿt)');
  await expect(page.locator('#v2 .layer[data-key="nahw"]')).toContainText('explanatory new sentence');
  await page.locator('#v4 .verse .w').nth(0).click();
  await expect(page.locator('#v4 [data-detail]')).toContainText('the predicate (khabar)');
  const html = await page.content();
  expect(html).not.toContain('intercalated adverbial');
});

test('Al-Ghashiyah: illa in verse 6 is restriction, and min dari’in is not a badal', async ({ page }) => {
  await page.goto('/surahs/088-al-ghashiyah/');
  await page.locator('#v6 .verse .w').nth(3).click();
  await expect(page.locator('#v6 [data-detail]')).toContainText('Particle of restriction');
  await expect(page.locator('#v6 .layer[data-key="nahw"]')).toContainText('particle of restriction (hasr)');
  await expect(page.locator('#v6 .layer[data-key="nahw"]')).toContainText('In neither case');
});

test('Al-Ghashiyah: the nouns of verses 14-16 are joined to sururun, not new subjects with their own khabar', async ({ page }) => {
  await page.goto('/surahs/088-al-ghashiyah/');
  await page.locator('#v14 .verse .w').nth(1).click();
  await expect(page.locator('#v14 [data-detail]')).toContainText('Joined to');
  await expect(page.locator('#v14 .layer[data-key="nahw"]')).toContainText('not a new sentence with its own khabar');
});

test('Al-Ghashiyah: the kayfa clause is a badal ishtimal of the noun before it, and kayfa is a hal', async ({ page }) => {
  await page.goto('/surahs/088-al-ghashiyah/');
  await page.locator('#v17 .verse .w').nth(7).click();
  await expect(page.locator('#v17 [data-detail]')).toContainText('badal ishtimāl');
  await expect(page.locator('#v17 .layer[data-key="nahw"]')).toContainText('inclusion substitute');
  await page.locator('#v18 .verse .w').nth(3).click();
  await expect(page.locator('#v18 [data-detail]')).toContainText('ḥāl');
});

test('Al-Ghashiyah: the fa in verse 21 answers an unspoken condition and the fa in verse 24 joins an unspoken sentence', async ({ page }) => {
  await page.goto('/surahs/088-al-ghashiyah/');
  await page.locator('#v21 .verse .w').nth(0).click();
  await expect(page.locator('#v21 [data-detail]')).toContainText('unspoken condition');
  await expect(page.locator('#v21 .layer[data-key="nahw"]')).toContainText('unspoken condition');
  await page.locator('#v24 .verse .w').nth(0).click();
  await expect(page.locator('#v24 [data-detail]')).toContainText('unspoken sentence');
  const html = await page.content();
  expect(html).not.toContain('fa al-jaza');
});
