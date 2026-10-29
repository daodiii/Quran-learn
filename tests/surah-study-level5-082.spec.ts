import { test, expect } from '@playwright/test';

// Al-Infitar: read against al-Jadwal, with a plain-English line for every word and a question for every verse.
test('Al-Infitar: every verse has a question and the book parse', async ({ page }) => {
  await page.goto('/surahs/082-al-infitar/');
  await expect(page.locator('section.vs')).toHaveCount(19);
  await expect(page.locator('section.vs .try')).toHaveCount(19);
  for (let n = 1; n <= 19; n++) {
    const box = page.locator(`#v${n} [data-detail]`);
    await expect(box.locator('.role')).toHaveCount(1);
    await expect(box).toContainText('For the grammar book');
  }
});

test('Al-Infitar: the noun after idha is the subject of an unspoken verb, not a mubtada', async ({ page }) => {
  await page.goto('/surahs/082-al-infitar/');
  await page.locator('#v1 .verse .w').nth(1).click();
  await expect(page.locator('#v1 [data-detail]')).toContainText('Subject of an unspoken verb');
  await expect(page.locator('#v1 .layer[data-key="nahw"]')).toContainText('unspoken verb');
  await expect(page.locator('#v1 .layer[data-key="nahw"]')).toContainText('mudaf ilayhi');
  expect(await page.content()).not.toContain('Nominal sentence structure with verbal predicate');
});

test('Al-Infitar: in 82:8 ayy is a conditional noun, ma is extra, and rakkabaka is the answer without fa', async ({ page }) => {
  await page.goto('/surahs/082-al-infitar/');
  await page.locator('#v8 .verse .w').nth(3).click();
  await expect(page.locator('#v8 [data-detail]')).toContainText('Extra word');
  await expect(page.locator('#v8 .layer[data-key="nahw"]')).toContainText('extra particle');
  await expect(page.locator('#v8 .layer[data-key="nahw"]')).toContainText('answer of the condition');
  expect(await page.content()).not.toContain('Relative clause modifying suurah');
});

test('Al-Infitar: the ma in 82:12 is a masdar particle', async ({ page }) => {
  await page.goto('/surahs/082-al-infitar/');
  await page.locator('#v12 .verse .w').nth(1).click();
  await expect(page.locator('#v12 [data-detail]')).toContainText('masdar particle');
  await expect(page.locator('#v12 .layer[data-key="nahw"]')).toContainText('masdar particle');
  await expect(page.locator('#v12 .layer[data-key="nahw"]')).toContainText('further adjective');
});

test('Al-Infitar: the ma in 82:16 works like laysa and the khabar is accusative in place', async ({ page }) => {
  await page.goto('/surahs/082-al-infitar/');
  await page.locator('#v16 .verse .w').nth(1).click();
  await expect(page.locator('#v16 [data-detail]')).toContainText('works like');
  await expect(page.locator('#v16 .layer[data-key="nahw"]')).toContainText('accusative');
  expect(await page.content()).not.toContain('which would otherwise be nominative as khabar');
});

test('Al-Infitar: yawma in 82:19 takes a clause as its mudaf ilayhi and is not a badal; yawmu in 82:17 is a khabar', async ({ page }) => {
  await page.goto('/surahs/082-al-infitar/');
  await page.locator('#v19 .verse .w').nth(0).click();
  await expect(page.locator('#v19 [data-detail]')).toContainText('Time word, first part of a possession');
  await expect(page.locator('#v19 .layer[data-key="nahw"]')).toContainText('mudaf ilayhi');
  await page.locator('#v17 .verse .w').nth(4).click();
  await expect(page.locator('#v17 [data-detail]')).toContainText('Predicate (khabar) of the second');
  const html = await page.content();
  expect(html).not.toContain('Badal (appositive) explaining');
  expect(html).not.toContain('direct object marker');
});
