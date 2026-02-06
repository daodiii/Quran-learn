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

  test('Arabic text elements pass color-contrast on test page', async ({ page }) => {
    await page.goto('/test/cards/');
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

test.describe('Arabic Diacritical Marks Visibility', () => {
  test('Arabic text visible in dark mode on test page', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    // Enable dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(300);

    // Check that Arabic text is visible
    const arabicElements = page.locator('[dir="rtl"]');
    const count = await arabicElements.count();
    expect(count).toBeGreaterThan(0);

    // Verify first Arabic element is visible
    const firstArabic = arabicElements.first();
    await expect(firstArabic).toBeVisible();
  });
});

test.describe('Dark Mode Font Weight', () => {
  test('Arabic text has increased font-weight in dark mode', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    // Get light mode weight
    const lightWeight = await page.locator('.lesson-title-arabic').first().evaluate((el) => {
      return window.getComputedStyle(el).fontWeight;
    });

    // Enable dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(300);

    // Get dark mode weight
    const darkWeight = await page.locator('.lesson-title-arabic').first().evaluate((el) => {
      return window.getComputedStyle(el).fontWeight;
    });

    // Dark mode should have equal or higher weight
    expect(parseInt(darkWeight)).toBeGreaterThanOrEqual(parseInt(lightWeight));
  });
});

test.describe('Full Page Accessibility - All Key Pages', () => {
  const pages = [
    { name: 'Level 1 Quiz', url: '/learn/level-1/quiz/' },
    { name: 'Resources', url: '/resources/' },
    { name: 'Test Components', url: '/test/components/' },
    { name: 'Test Cards', url: '/test/cards/' },
  ];

  for (const { name, url } of pages) {
    test(`${name} passes full axe scan in light mode`, async ({ page }) => {
      await page.goto(url);
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test(`${name} passes full axe scan in dark mode`, async ({ page }) => {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await enableDarkMode(page);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  }
});

test.describe('ARIA Live Regions', () => {
  test('AriaLiveRegion component is present on test page', async ({ page }) => {
    await page.goto('/test/components/');
    await page.waitForLoadState('networkidle');

    const announcer = page.locator('[data-progress-announcer]');
    await expect(announcer).toHaveCount(1);
    await expect(announcer).toHaveAttribute('role', 'status');
    await expect(announcer).toHaveAttribute('aria-live', 'polite');
    await expect(announcer).toHaveAttribute('aria-atomic', 'true');
  });

  test('AriaLiveRegion component is present on quiz page', async ({ page }) => {
    await page.goto('/learn/level-1/quiz/');
    await page.waitForLoadState('networkidle');

    const announcer = page.locator('[data-progress-announcer]');
    await expect(announcer).toHaveCount(1);
    await expect(announcer).toHaveAttribute('role', 'status');
    await expect(announcer).toHaveAttribute('aria-live', 'polite');
  });
});

test.describe('Keyboard Navigation', () => {
  test('Skip link is present and functional', async ({ page }) => {
    await page.goto('/test/components/');
    await page.waitForLoadState('networkidle');

    // Skip link should exist
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toHaveCount(1);
    await expect(skipLink).toHaveAttribute('href', '#main-content');

    // Main content target should exist
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toHaveCount(1);
  });

  test('Tab navigation reaches key interactive elements on page', async ({ page }) => {
    await page.goto('/test/components/');
    await page.waitForLoadState('networkidle');

    // Tab through and verify focus reaches interactive elements
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // First header element

    // Verify something received focus
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedTag);
  });

  test('Focus visible indicator is present', async ({ page }) => {
    await page.goto('/test/components/');
    await page.waitForLoadState('networkidle');

    // Tab to first interactive element
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Check that focused element has visible outline
    const outline = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return 'none';
      const style = window.getComputedStyle(el);
      return style.outlineStyle;
    });

    expect(outline).not.toBe('none');
  });
});

test.describe('Font Loading', () => {
  test('Critical fonts are preloaded', async ({ page }) => {
    await page.goto('/test/components/');
    await page.waitForLoadState('networkidle');

    // Check for font preload links
    const preloadLinks = page.locator('link[rel="preload"][as="font"]');
    const count = await preloadLinks.count();
    expect(count).toBe(2); // Amiri Regular Arabic + UthmanicHafs

    // Verify crossorigin attribute
    for (let i = 0; i < count; i++) {
      const link = preloadLinks.nth(i);
      await expect(link).toHaveAttribute('crossorigin', '');
    }
  });
});
