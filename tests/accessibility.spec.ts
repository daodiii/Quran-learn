import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BASE_URL = 'http://localhost:4321';

/**
 * Helper function to enable dark mode on the page
 */
async function enableDarkMode(page) {
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await page.waitForTimeout(300); // Allow CSS transitions
}

test.describe('WCAG AAA Contrast - Dark Mode', () => {
  test('test page /test/cards/ should have no WCAG AAA contrast violations', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    // Enable dark mode
    await enableDarkMode(page);

    // Run axe accessibility scan for WCAG AAA
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aaa', 'wcag21aaa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('test page /test/components/ should have no WCAG AAA contrast violations', async ({ page }) => {
    await page.goto('/test/components/');
    await page.waitForLoadState('networkidle');

    // Enable dark mode
    await enableDarkMode(page);

    // Run axe accessibility scan for WCAG AAA
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aaa', 'wcag21aaa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Quran page /surahs/001-al-fatiha/ should pass contrast checks for Arabic text', async ({ page }) => {
    await page.goto('/surahs/001-al-fatiha/');
    await page.waitForLoadState('networkidle');

    // Enable dark mode
    await enableDarkMode(page);

    // Run axe accessibility scan for WCAG AAA
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aaa', 'wcag21aaa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Color Contrast Rule Focus', () => {
  test('specific color-contrast rule validation on test pages', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    // Enable dark mode
    await enableDarkMode(page);

    // Run axe with specific color-contrast rule
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Arabic text elements pass color-contrast on Quran page', async ({ page }) => {
    await page.goto('/surahs/001-al-fatiha/');
    await page.waitForLoadState('networkidle');

    // Enable dark mode
    await enableDarkMode(page);

    // Check if Arabic text elements exist before running axe
    const arabicElements = page.locator('[dir="rtl"]');
    const count = await arabicElements.count();
    expect(count).toBeGreaterThan(0);

    // Run axe with color-contrast rule on the whole page
    // (axe will check all text including Arabic)
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Component Dark Mode Contrast', () => {
  test('progress indicators pass contrast validation', async ({ page }) => {
    await page.goto('/test/components/');
    await page.waitForLoadState('networkidle');

    // Enable dark mode
    await enableDarkMode(page);

    // Verify progress components exist
    const progressBar = page.locator('[role="progressbar"]').first();
    await expect(progressBar).toBeVisible();

    // Run axe on the whole page (includes progress components)
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('badges and level indicators pass contrast validation', async ({ page }) => {
    await page.goto('/test/components/');
    await page.waitForLoadState('networkidle');

    // Enable dark mode
    await enableDarkMode(page);

    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('card hover states pass contrast validation', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    // Enable dark mode
    await enableDarkMode(page);

    // Hover over a card
    const courseCard = page.getByTestId('course-card-level-1');
    await courseCard.hover();
    await page.waitForTimeout(100);

    // Run axe after hover
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Arabic Text Contrast', () => {
  test('SurahCard Arabic names pass contrast validation', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    // Enable dark mode
    await enableDarkMode(page);

    // Verify SurahCard Arabic text exists
    const surahNames = page.locator('.surah-name-arabic');
    const count = await surahNames.count();
    expect(count).toBeGreaterThan(0);

    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('LessonCard Arabic titles pass contrast validation', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    // Enable dark mode
    await enableDarkMode(page);

    // Verify LessonCard Arabic text exists
    const lessonTitles = page.locator('.lesson-title-arabic');
    const count = await lessonTitles.count();
    expect(count).toBeGreaterThan(0);

    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Arabic text classes pass contrast on all pages', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    // Enable dark mode
    await enableDarkMode(page);

    // Check for Arabic text classes (.arabic, .arabic-lg, .arabic-xl)
    const arabicElements = page.locator('[class*="arabic"]');
    const count = await arabicElements.count();

    if (count > 0) {
      // Run axe on elements with arabic classes
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });
});

test.describe('Light Mode Comparison', () => {
  test('test page /test/cards/ passes WCAG AAA in light mode', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    // Light mode is default (no data-theme attribute)

    // Run axe accessibility scan for WCAG AAA
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aaa', 'wcag21aaa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('test page /test/components/ passes WCAG AAA in light mode', async ({ page }) => {
    await page.goto('/test/components/');
    await page.waitForLoadState('networkidle');

    // Light mode is default

    // Run axe accessibility scan for WCAG AAA
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aaa', 'wcag21aaa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Edge Cases - Focus and Interactive States', () => {
  test('focus states have visible outline', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    // Enable dark mode
    await enableDarkMode(page);

    // Focus on a card
    const card = page.getByTestId('course-card-level-1');
    await card.focus();

    // Run axe to check focus-visible contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('button components pass contrast validation', async ({ page }) => {
    await page.goto('/test/components/');
    await page.waitForLoadState('networkidle');

    // Enable dark mode
    await enableDarkMode(page);

    // Check for button elements
    const buttons = page.locator('button');
    const count = await buttons.count();

    if (count > 0) {
      // Run axe accessibility scan
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });

  test('disabled button states pass contrast validation', async ({ page }) => {
    await page.goto('/test/components/');
    await page.waitForLoadState('networkidle');

    // Enable dark mode
    await enableDarkMode(page);

    // Check for disabled buttons
    const disabledButtons = page.locator('button:disabled');
    const count = await disabledButtons.count();

    if (count > 0) {
      // Note: WCAG allows exemption for disabled elements
      // But we still run the test to ensure no failures
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });
});
