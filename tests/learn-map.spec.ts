import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PROGRESS_KEY = 'quran-learn-progress';

async function saveProgress(page: Page, count: number) {
  const ids = await page.locator('.row').evaluateAll((rows) => rows.map((r) => (r as HTMLElement).dataset.id!));
  await page.evaluate(([key, done]) => localStorage.setItem(key, JSON.stringify({ completedLessons: done, lastUpdated: new Date().toISOString() })), [PROGRESS_KEY, ids.slice(0, count)] as const);
  await page.reload();
}

test('renders all 81 lessons in 32 topic groups under 5 levels', async ({ page }) => {
  await page.goto('/learn/');
  await expect(page.locator('.row')).toHaveCount(81);
  await expect(page.locator('section.lvl')).toHaveCount(5);
  await expect(page.locator('.grp')).toHaveCount(32);
});

test('checkpoints are tagged, one per level', async ({ page }) => {
  await page.goto('/learn/');
  await expect(page.locator('.row .tag.chk')).toHaveCount(5);
});

test('every level ends with quiz and vocabulary links, review for levels 2-5, and surahs to read now', async ({ page }) => {
  await page.goto('/learn/');
  for (const n of [1, 2, 3, 4, 5]) {
    const more = page.locator(`#level-${n} .more`);
    await expect(more.locator(`a[href="/learn/level-${n}/quiz/"]`)).toBeVisible();
    await expect(more.locator(`a[href="/learn/level-${n}/vocabulary/"]`)).toBeVisible();
    await expect(more.locator(`a[href="/learn/level-${n}/review/"]`)).toHaveCount(n === 1 ? 0 : 1);
    await expect(more.locator('.read a[href^="/surahs/"]').first()).toHaveAttribute('href', /^\/surahs\/(\d{3}-|$)/);
  }
});

test('heading hierarchy has no skips and starts at the h1', async ({ page }) => {
  await page.goto('/learn/');
  const levels = await page.locator('h1, h2, h3').evaluateAll((hs) => hs.map((h) => Number(h.tagName[1])));
  expect(levels[0]).toBe(1);
  levels.reduce((prev, cur) => { expect(cur - prev).toBeLessThanOrEqual(1); return Math.max(prev, cur); }, 1);
});

test('first visit: "Start here" on lesson 1 and no resume band', async ({ page }) => {
  await page.goto('/learn/');
  await expect(page.locator('#resume')).toBeHidden();
  await expect(page.locator('[data-start]')).toHaveCount(1);
  await expect(page.locator('.row.done')).toHaveCount(0);
});

test('returning visitor: resume band targets the first lesson not done, and progress shows', async ({ page }) => {
  await page.goto('/learn/');
  await saveProgress(page, 2);
  await expect(page.locator('#resume')).toBeVisible();
  await expect(page.locator('#resume-title')).toContainText('Lesson 3 of 11');
  await expect(page.locator('#resume-link')).toHaveAttribute('href', /03-reading-bismillah/);
  await expect(page.locator('.row.done')).toHaveCount(2);
  await expect(page.locator('.row.next')).toHaveCount(1);
  await expect(page.locator('[data-start]')).toHaveCount(0);
  await expect(page.locator('#level-1 .ptxt')).toHaveText('2 of 11 done');
});

test('finishing a whole level marks it complete', async ({ page }) => {
  await page.goto('/learn/');
  await saveProgress(page, 11);
  await expect(page.locator('#level-1')).toHaveClass(/complete/);
  await expect(page.locator('#level-1 .ptxt')).toHaveText('All 11 done');
  await expect(page.locator('#resume-title')).toContainText('Level 2');
});

test('filter narrows the list, folds apostrophes, and shows an empty state', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/learn/');
  await page.fill('#q', 'verb');
  const shown = await page.locator('.row:not([hidden])').count();
  expect(shown).toBeGreaterThan(0);
  expect(shown).toBeLessThan(81);
  await expect(page.locator('#count')).toHaveText(`${shown} of 81 lessons`);
  await page.fill('#q', 'raf');
  await expect(page.locator('.row:not([hidden]) .t b', { hasText: 'Nominative' })).toHaveCount(1);
  await page.fill('#q', 'zzzzqq');
  await expect(page.locator('#empty')).toBeVisible();
  await page.fill('#q', '');
  await expect(page.locator('.row:not([hidden])')).toHaveCount(81);
});

test('the list is complete HTML without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/learn/');
  await expect(page.locator('.row')).toHaveCount(81);
  await expect(page.locator('.row').first()).toBeVisible();
  await expect(page.locator('#find')).toBeHidden();
  await context.close();
});

test('phone: only the level holding the next lesson is open, and a fold opens another', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/learn/');
  await saveProgress(page, 14);
  await expect(page.locator('#level-2')).toHaveAttribute('data-collapsed', 'false');
  await expect(page.locator('#level-3')).toHaveAttribute('data-collapsed', 'true');
  await expect(page.locator('#level-3-body')).toBeHidden();
  await page.locator('#level-3 .fold').click();
  await expect(page.locator('#level-3-body')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBe(0);
});

test('no axe violations, first visit and returning, desktop and phone', async ({ page }) => {
  const scan = async () => { await page.waitForTimeout(900); return new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze(); };
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/learn/');
  expect((await scan()).violations).toEqual([]);
  await saveProgress(page, 14);
  expect((await scan()).violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  expect((await scan()).violations).toEqual([]);
});
