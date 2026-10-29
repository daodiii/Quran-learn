import { test, expect } from '@playwright/test';

// Al-Buruj (85) has a plain-English layer and a question for every verse.
test('Al-Buruj: every verse has a question, a plain role for its first word, and the book\'s parse', async ({ page }) => {
  await page.goto('/surahs/085-al-buruj/');
  await expect(page.locator('section.vs')).toHaveCount(22);
  await expect(page.locator('section.vs .try')).toHaveCount(22);
  for (let n = 1; n <= 22; n++) {
    const box = page.locator(`#v${n} [data-detail]`);
    await expect(box.locator('.role')).toHaveCount(1);
    await expect(box).toContainText('For the grammar book');
  }
});

test('Al-Buruj: the answer to the oath is left unspoken, and al-nar in verse 5 is a badal ishtimal', async ({ page }) => {
  await page.goto('/surahs/085-al-buruj/');
  await expect(page.locator('#v4 .layer[data-key="nahw"]')).toContainText('left unspoken');
  await page.locator('#v5 .verse .w').nth(0).click();
  await expect(page.locator('#v5 [data-detail]')).toContainText('Badal ishtimāl');
});

test('Al-Buruj: idh in verse 6 is an adverb tied to qutila, and ma in verse 7 is a masdar particle', async ({ page }) => {
  await page.goto('/surahs/085-al-buruj/');
  await page.locator('#v6 .verse .w').nth(0).click();
  await expect(page.locator('#v6 [data-detail]')).toContainText('Adverb of time');
  await expect(page.locator('#v6 .layer[data-key="nahw"]')).toContainText('mudaf ilayhi');
  await page.locator('#v7 .verse .w').nth(3).click();
  await expect(page.locator('#v7 [data-detail]')).toContainText('Masdar particle');
  await expect(page.locator('#v7 .layer[data-key="nahw"]')).toContainText('masdar particle');
});

test('Al-Buruj: the fa in 85:10 is extra and opens no result clause, and jannatun in 85:11 is not the noun of inna', async ({ page }) => {
  await page.goto('/surahs/085-al-buruj/');
  await page.locator('#v10 .verse .w').nth(9).click();
  await expect(page.locator('#v10 [data-detail]')).toContainText('Extra fāʾ');
  await expect(page.locator('#v10 .layer[data-key="nahw"]')).toContainText('does not open a result clause');
  await page.locator('#v11 .verse .w').nth(7).click();
  await expect(page.locator('#v11 [data-detail]')).toContainText('Subject (mubtadaʾ)');
  await expect(page.locator('#v11 .layer[data-key="nahw"]')).toContainText('khabar muqaddam');
});

test('Al-Buruj: huwa in 85:13 is a subject, the lam in 85:16 is extra, and al-Majidu describes dhu', async ({ page }) => {
  await page.goto('/surahs/085-al-buruj/');
  await page.locator('#v13 .verse .w').nth(1).click();
  await expect(page.locator('#v13 [data-detail]')).toContainText('Subject (mubtadaʾ)');
  await expect(page.locator('#v13 .layer[data-key="nahw"]')).toContainText('whose predicate is the clause');
  await page.locator('#v16 .verse .w').nth(1).click();
  await expect(page.locator('#v16 [data-detail]')).toContainText('Extra lām');
  await page.locator('#v15 .verse .w').nth(2).click();
  await expect(page.locator('#v15 [data-detail]')).toContainText('Adjective (naʿt) of ذُو');
});

test('Al-Buruj: Fir\'awn and Thamud are diptotes, not indeclinable, and the wa in 85:20 is not a circumstantial wa', async ({ page }) => {
  await page.goto('/surahs/085-al-buruj/');
  await page.locator('#v18 .verse .w').nth(0).click();
  await expect(page.locator('#v18 [data-detail]')).toContainText('diptote');
  await expect(page.locator('#v18 .layer[data-key="nahw"]')).toContainText('diptotes');
  await expect(page.locator('#v20 .layer[data-key="nahw"]')).toContainText('not a circumstantial wa');
});
