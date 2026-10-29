import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const IKHLAS = '/surahs/112-al-ikhlas/';

test('the whole surah is one text with every word, and a marker for every verse', async ({ page }) => {
  await page.goto(IKHLAS);
  await expect(page.locator('#reader .rw')).toHaveCount(15);
  await expect(page.locator('#reader .vno')).toHaveCount(4);
});

test('lenses: each chip names how many words it marks, and picking one marks them and greys the rest', async ({ page }) => {
  await page.goto('/surahs/001-al-fatiha/');
  const gen = page.locator('.lens .chip[data-pick="gen"]');
  await expect(gen).toContainText('Genitive');
  const n = Number((await gen.locator('.ct').textContent())!.trim());
  expect(n).toBeGreaterThan(0);
  await expect(page.locator('#reader .rw[data-lens="gen"]')).toHaveCount(n);

  await gen.click();
  await expect(page.locator('#col')).toHaveAttribute('data-pick', 'gen');
  await expect(gen).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#lens-def')).toContainText(`${n} words in this surah`);
  const matching = page.locator('#reader .rw[data-lens="gen"]').first();
  const other = page.locator('#reader .rw:not([data-lens="gen"])').first();
  const colour = (l: typeof matching) => l.evaluate((e) => getComputedStyle(e).color);
  expect(await colour(matching)).not.toBe(await colour(other));
  // it reaches the verse sheets too
  expect(await page.locator('#col .w[data-lens="gen"] .wa').first().evaluate((e) => getComputedStyle(e).color)).not.toBe(
    await page.locator('#col .w:not([data-lens="gen"]) .wa').first().evaluate((e) => getComputedStyle(e).color));

  await page.locator('.lens .chip[data-pick="all"]').click();
  await expect(page.locator('#col')).not.toHaveAttribute('data-pick', /.+/);
});

test('tapping a word in the reader opens its box under the text, with a way to its verse', async ({ page }) => {
  await page.goto(IKHLAS);
  await page.locator('#reader .rw[data-v="3"][data-i="1"]').click();
  await expect(page.locator('#reader-detail')).toContainText('yalid');
  await expect(page.locator('#reader-detail a[href="#v3"]')).toHaveText('Go to verse 3');
  await expect(page.locator('#v3 .verse .w').nth(1)).toHaveAttribute('aria-pressed', 'true');
  // the arrow keys walk the reader (Arabic runs right to left, so Left is next)
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#reader-detail')).toContainText('wa-lam');
});

test('the word box has the word form, the case and the root as well as the parse', async ({ page }) => {
  await page.goto(IKHLAS);
  await page.locator('#v3 .verse .w').nth(1).click();
  const box = page.locator('#v3 [data-detail]');
  await expect(box).toContainText('Word form: Verb - Form I, present tense');
  await expect(box).toContainText('Verb · fiʿl');
  await expect(box).toContainText('Root');
  await expect(box).toContainText('For the grammar book');
});

test('every verse has a Listen button wired to its recitation, and a play-through for the whole surah', async ({ page }) => {
  await page.goto(IKHLAS);
  const buttons = page.locator('.ayah-play');
  await expect(buttons).toHaveCount(4);
  await expect(buttons.nth(0)).toHaveAttribute('data-audio-src', 'https://everyayah.com/data/Alafasy_128kbps/112001.mp3');
  await expect(buttons.nth(3)).toHaveAttribute('data-audio-src', 'https://everyayah.com/data/Alafasy_128kbps/112004.mp3');
  await expect(page.locator('#play-all')).toBeVisible();
});

test('the key grammar word of each verse is marked, and hide-meanings clears the meanings for practice', async ({ page }) => {
  await page.goto(IKHLAS);
  await expect(page.locator('#v4 .w.key')).toHaveCount(2);
  await expect(page.locator('#v1 .w.key')).toHaveCount(1);
  await expect(page.locator('#v1 .trn')).toBeVisible();
  await page.locator('#hide-mean').click();
  await expect(page.locator('#hide-mean')).toHaveText('Show meanings');
  await expect(page.locator('#v1 .trn')).toBeHidden();
  await expect(page.locator('#v1 .w .wg').first()).toBeHidden();
  await page.locator('#v1 .verse .w').nth(1).click();
  await expect(page.locator('#v1 [data-detail]')).toContainText('He');
  await page.locator('#hide-mean').click();
  await expect(page.locator('#v1 .trn')).toBeVisible();
});

test('each verse keeps its table of every word, and the vocabulary keeps its pattern and frequency', async ({ page }) => {
  await page.goto(IKHLAS);
  await expect(page.locator('details.wt')).toHaveCount(4);
  await page.locator('#v4 details.wt summary').click();
  await expect(page.locator('#v4 details.wt tbody tr')).toHaveCount(5);
  await expect(page.locator('#v4 details.wt thead')).toContainText('Word form');
  await expect(page.locator('#words .vocab thead')).toContainText('Pattern');
  await expect(page.locator('#words .vocab thead')).toContainText('How often');
});

test('the header keeps the theme and the grammar focus', async ({ page }) => {
  await page.goto(IKHLAS);
  await expect(page.locator('.top')).toContainText('Theme.');
  await expect(page.locator('.top')).toContainText('Grammar focus.');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('the whole text is readable, and the tools that need JavaScript are not shown', async ({ page }) => {
    await page.goto(IKHLAS);
    await expect(page.locator('#reader .rw').first()).toBeVisible();
    await expect(page.locator('.lens')).toBeHidden();
    await expect(page.locator('.ayah-play').first()).toBeHidden();
  });
});

test('a long surah: the reader scrolls inside its own window and every verse still has a box', async ({ page }) => {
  await page.goto('/surahs/078-an-naba/');
  await expect(page.locator('#reader .rw')).toHaveCount(202);
  const scrolls = await page.locator('#reader-text').evaluate((e) => e.scrollHeight > e.clientHeight);
  expect(scrolls).toBe(true);
  await page.locator('#reader .rw').nth(150).click();
  await expect(page.locator('#reader-detail')).toContainText('Go to verse');
  await expect(page.locator('#reader-detail')).toBeInViewport();
});

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('lenses and the reader fit a phone without a sideways scroll', async ({ page }) => {
    await page.goto('/surahs/078-an-naba/');
    await page.locator('.lens .chip[data-pick="acc"]').click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });
});

test('axe finds nothing (WCAG A and AA) with a lens on, meanings hidden and a table open', async ({ page }) => {
  await page.goto(IKHLAS);
  await page.locator('.lens .chip[data-pick="verb"]').click();
  await page.locator('#hide-mean').click();
  await page.locator('#reader .rw').nth(3).click();
  await page.locator('#v2 details.wt summary').click();
  const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(r.violations).toEqual([]);
});
