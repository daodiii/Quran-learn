import { test, expect } from '@playwright/test';

const SLUG = '083-al-mutaffifin';

test('Al-Mutaffifin: every verse has a question, a plain role for its first word, and the book’s parse', async ({ page }) => {
  await page.goto(`/surahs/${SLUG}/`);
  await expect(page.locator('section.vs')).toHaveCount(36);
  await expect(page.locator('section.vs .try')).toHaveCount(36);
  for (let n = 1; n <= 36; n++) {
    const box = page.locator(`#v${n} [data-detail]`);
    await expect(box.locator('.role')).toHaveCount(1);
    await expect(box).toContainText('For the grammar book');
  }
});

test('Al-Mutaffifin: yawma’idhin in 83:10 is a badal of yawma in verse 6, not a plain adverb', async ({ page }) => {
  await page.goto(`/surahs/${SLUG}/`);
  await page.locator('#v10 .verse .w').nth(1).click();
  await expect(page.locator('#v10 [data-detail]')).toContainText('Badal of يَوْمَ');
  await expect(page.locator('#v10 .layer[data-key="nahw"]')).toContainText('badal (replacement) of yawma yaqumu');
});

test('Al-Mutaffifin: adraka is from dara, and the second ma clause fills the place of the second object', async ({ page }) => {
  await page.goto(`/surahs/${SLUG}/`);
  await page.locator('#v8 .verse .w').nth(1).click();
  await expect(page.locator('#v8 [data-detail]')).toContainText('not of دَرَكَ');
  await expect(page.locator('#v8 .layer[data-key="nahw"]')).toContainText('fills the place of the second');
  expect(await page.content()).not.toContain('to perceive/reach');
});

test('Al-Mutaffifin: kalla is a particle of rebuke and the lam in la-fi is the moved lam of emphasis', async ({ page }) => {
  await page.goto(`/surahs/${SLUG}/`);
  await page.locator('#v7 .verse .w').nth(0).click();
  await expect(page.locator('#v7 [data-detail]')).toContainText('Rebuke');
  await page.locator('#v7 .verse .w').nth(4).click();
  await expect(page.locator('#v7 [data-detail]')).toContainText('muzaḥlaqa');
  await expect(page.locator('#v7 .layer[data-key="nahw"]')).toContainText('particle of rebuke');
  expect(await page.content()).not.toContain('strongest assertion pattern in Arabic');
});

test('Al-Mutaffifin: the wa in 83:33 is a state wa and the clause is a hal of the speakers in verse 32', async ({ page }) => {
  await page.goto(`/surahs/${SLUG}/`);
  await page.locator('#v33 .verse .w').nth(0).click();
  await expect(page.locator('#v33 [data-detail]')).toContainText('ḥāl');
  await expect(page.locator('#v33 .layer[data-key="nahw"]')).toContainText('The wa is circumstantial');
});

test('Al-Mutaffifin: ma in 83:36 is a masdar particle, and the fa in 83:34 answers an unspoken condition', async ({ page }) => {
  await page.goto(`/surahs/${SLUG}/`);
  await page.locator('#v36 .verse .w').nth(3).click();
  await expect(page.locator('#v36 [data-detail]')).toContainText('Masdar particle');
  await expect(page.locator('#v36 .layer[data-key="nahw"]')).toContainText('masdar particle');
  await expect(page.locator('#v34 .layer[data-key="nahw"]')).toContainText('unspoken condition');
  expect(await page.content()).not.toContain('fa al-fa');
});
