import { test, expect } from '@playwright/test';

// Surah 84, Al-Inshiqaq: a plain-English layer and a question for every verse, and the corrections made
// after reading each verse in al-Jadwal.
const URL = '/surahs/084-al-inshiqaq/';

test('Al-Inshiqaq: every verse has a question, a plain role for its first word, and the book’s parse', async ({ page }) => {
  await page.goto(URL);
  await expect(page.locator('section.vs')).toHaveCount(25);
  await expect(page.locator('section.vs .try')).toHaveCount(25);
  for (let n = 1; n <= 25; n++) {
    const box = page.locator(`#v${n} [data-detail]`);
    await expect(box.locator('.role')).toHaveCount(1);
    await expect(box).toContainText('For the grammar book');
  }
});

test('Al-Inshiqaq: the noun after idha is the subject of an unspoken verb, and verse 6 is the answer to the call', async ({ page }) => {
  await page.goto(URL);
  await page.locator('#v1 .verse .w').nth(1).click();
  await expect(page.locator('#v1 [data-detail]')).toContainText('of an unspoken verb');
  await expect(page.locator('#v1 .layer[data-key="nahw"]')).toContainText('tafsiriyyah');
  await expect(page.locator('#v3 .layer[data-key="nahw"]')).toContainText('tafsiriyyah');
  await expect(page.locator('#v6 .layer[data-key="nahw"]')).toContainText('is the answer to the call');
});

test('Al-Inshiqaq: man after amma is a conditional noun, and kitabahu stays accusative', async ({ page }) => {
  await page.goto(URL);
  await page.locator('#v7 .verse .w').nth(2).click();
  await expect(page.locator('#v7 [data-detail]')).toContainText('Conditional noun');
  await page.locator('#v7 .verse .w').nth(4).click();
  await expect(page.locator('#v7 [data-detail]')).toContainText('the thing that was given');
  await expect(page.locator('#v7 .layer[data-key="nahw"]')).toContainText('conditional noun (ism shart)');
  await page.locator('#v10 .verse .w').nth(5).click();
  await expect(page.locator('#v10 [data-detail]')).toContainText('Adverb of place');
});

test('Al-Inshiqaq: the wa in 84:17-18 joins, ma is a masdar particle, and idha in 84:18 is a plain word for time', async ({ page }) => {
  await page.goto(URL);
  await page.locator('#v17 .verse .w').nth(0).click();
  await expect(page.locator('#v17 [data-detail]')).toContainText('Joining wa');
  await page.locator('#v17 .verse .w').nth(3).click();
  await expect(page.locator('#v17 [data-detail]')).toContainText('Particle that makes a verbal noun');
  await page.locator('#v18 .verse .w').nth(2).click();
  await expect(page.locator('#v18 [data-detail]')).toContainText('Word for time, no condition');
  await expect(page.locator('#v18 .layer[data-key="nahw"]')).toContainText('stripped of conditional force');
});

test('Al-Inshiqaq: masruran in 84:13 is the khabar of kana, an in 84:14 is the light form of anna', async ({ page }) => {
  await page.goto(URL);
  await expect(page.locator('#v13 .layer[data-key="nahw"]')).toContainText('belongs to مَسْرُورًا');
  await page.locator('#v14 .verse .w').nth(2).click();
  await expect(page.locator('#v14 [data-detail]')).toContainText('Light form of anna');
  await expect(page.locator('#v14 .layer[data-key="nahw"]')).toContainText('two objects');
});

test('Al-Inshiqaq: bal moves on, yu\'una is Form IV, and the exception in 84:25 is disconnected', async ({ page }) => {
  await page.goto(URL);
  await page.locator('#v22 .verse .w').nth(0).click();
  await expect(page.locator('#v22 [data-detail]')).toContainText('Particle of moving on');
  await page.locator('#v23 .verse .w').nth(5).click();
  await expect(page.locator('#v23 [data-detail]')).toContainText('Form IV');
  await expect(page.locator('#v25 .layer[data-key="nahw"]')).toContainText('disconnected exception');
  const html = await page.content();
  expect(html).not.toContain('Corrective Escalation');
});
