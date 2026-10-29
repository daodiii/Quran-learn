import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const IKHLAS = '/surahs/112-al-ikhlas/';

test('Al-Ikhlas: four verses with 4, 2, 4 and 5 words, and the first word already explained', async ({ page }) => {
  await page.goto(IKHLAS);
  await expect(page.locator('section.vs')).toHaveCount(4);
  for (const [n, words] of [[1, 4], [2, 2], [3, 4], [4, 5]] as const) {
    await expect(page.locator(`#v${n} .verse .w`)).toHaveCount(words);
  }
  await expect(page.locator('#v1 [data-detail]')).toContainText('A command');
  await expect(page.locator('h1')).toContainText('Al-Ikhlas');
});

test('tapping a word changes the box under the verse, and the arrow keys walk the words', async ({ page }) => {
  await page.goto(IKHLAS);
  const box = page.locator('#v1 [data-detail]');
  await page.locator('#v1 .verse .w').nth(3).click();
  await expect(box).toContainText('Predicate (khabar)');
  await expect(page.locator('#v1 .verse .w').nth(3)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#v1 .verse .w').nth(0)).toHaveAttribute('aria-pressed', 'false');
  // Arabic runs right to left, so Left Arrow goes to the next word
  await page.locator('#v1 .verse .w').nth(0).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(box).toContainText('Subject (mubtadaʾ)');
});

test('the three explanation layers are tabs, and a verse question marks right and wrong', async ({ page }) => {
  await page.goto(IKHLAS);
  const v3 = page.locator('#v3');
  await expect(v3.locator('.layer[data-key="nahw"]')).toBeVisible();
  await expect(v3.locator('.layer[data-key="sarf"]')).toBeHidden();
  await v3.locator('.tab', { hasText: 'Word forms' }).click();
  await expect(v3.locator('.layer[data-key="sarf"]')).toBeVisible();
  await expect(v3.locator('.layer[data-key="nahw"]')).toBeHidden();
  await expect(v3.locator('.layer[data-key="sarf"]')).toContainText('drops the');

  await v3.locator('.try .opt').nth(1).click();
  await expect(v3.locator('.try .opt').nth(1)).toHaveClass(/wrong/);
  await v3.locator('.try .opt').nth(0).click();
  await expect(v3.locator('.try .opt').nth(0)).toHaveClass(/right/);
  await expect(v3.locator('.try .fb')).toContainText('vowels change');
});

test('Al-Ikhlas shows the corrected parse, a sources section and a way to report a mistake', async ({ page }) => {
  await page.goto(IKHLAS);
  await expect(page.locator('#v4 .layer[data-key="nahw"]')).toContainText('This follows al-Jadwal');
  await expect(page.locator('#sources')).toContainText('al-Jadwal');
  await expect(page.locator('#sources a[href="/about/#feedback"]')).toBeVisible();
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('every layer is readable, the first word is explained and the JS-only parts are gone', async ({ page }) => {
    await page.goto(IKHLAS);
    await expect(page.locator('#v3 .layer')).toHaveCount(3);
    for (const l of await page.locator('#v3 .layer').all()) await expect(l).toBeVisible();
    await expect(page.locator('#v1 [data-detail]')).toContainText('A command');
    await expect(page.locator('#v1 .tabs')).toBeHidden();
    await expect(page.locator('#v1 .try')).toBeHidden();
    await expect(page.locator('#practice details.ex')).toHaveCount(2);
  });
});

test('a surah with no teaching layer still works: the box shows the parse and there is no question', async ({ page }) => {
  await page.goto('/surahs/001-al-fatiha/');
  await expect(page.locator('section.vs')).toHaveCount(7);
  await expect(page.locator('#v1 [data-detail]')).toContainText('Grammar:');
  await expect(page.locator('#v1 .try')).toHaveCount(0);
  await expect(page.locator('#sources')).toContainText('not yet been checked');
});

test('a long surah: 40 verses, a rail with 40 verse links, and the whole page reads', async ({ page }) => {
  await page.goto('/surahs/078-an-naba/');
  await expect(page.locator('section.vs')).toHaveCount(40);
  await expect(page.locator('#nav .many a')).toHaveCount(40);
  await page.locator('#nav .many a', { hasText: /^25$/ }).click();
  await expect(page).toHaveURL(/#v25$/);
});

test('surah 80 keeps its explanation for the whole surah', async ({ page }) => {
  await page.goto('/surahs/080-abasa/');
  await expect(page.locator('#across')).toBeVisible();
});

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  for (const slug of ['112-al-ikhlas', '078-an-naba', '001-al-fatiha']) {
    test(`no horizontal overflow on ${slug}`, async ({ page }) => {
      await page.goto(`/surahs/${slug}/`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    });
  }
  test('a verse of five words keeps all five on screen without a sideways scroll', async ({ page }) => {
    await page.goto(IKHLAS);
    const box = await page.locator('#v4 .verse').boundingBox();
    expect(box!.width).toBeLessThanOrEqual(390);
    for (const w of await page.locator('#v4 .verse .w').all()) {
      const b = (await w.boundingBox())!;
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.x + b.width).toBeLessThanOrEqual(390);
    }
  });
});

test('Al-Ikhlas passes axe (WCAG A and AA), before and after using it', async ({ page }) => {
  await page.goto(IKHLAS);
  const scan = () => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect((await scan()).violations).toEqual([]);
  await page.locator('#v4 .verse .w').nth(2).click();
  await page.locator('#v4 .tab').nth(1).click();
  await page.locator('#v4 .try .opt').nth(0).click();
  expect((await scan()).violations).toEqual([]);
});

test('the word colours keep their meaning: nouns, verbs and little words each have a text label', async ({ page }) => {
  await page.goto(IKHLAS);
  await expect(page.locator('#v3 .verse .w.little .wl').first()).toHaveText('Little word');
  await expect(page.locator('#v3 .verse .w.verb .wl').first()).toHaveText('Verb');
  await expect(page.locator('#v1 .verse .w.noun .wl').first()).toHaveText('Noun');
});
