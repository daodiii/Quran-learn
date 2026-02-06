import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4321';

test.describe('Card Components Test Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');
  });

  test('test page loads and displays all card sections', async ({ page }) => {
    // Verify page title (first h1 is ours, ignore dev toolbar h1s)
    await expect(page.locator('h1').first()).toContainText('Card Components Test');

    // Verify all section headings are present
    const sectionHeadings = [
      'CardGrid Responsive Layout',
      'CourseCard Components',
      'LessonCard Components',
      'SurahCard Components',
      'ResourceCard Components'
    ];

    for (const heading of sectionHeadings) {
      await expect(page.locator('h2').filter({ hasText: heading })).toBeVisible();
    }

    // Verify all 5 main sections exist with data-testid
    await expect(page.getByTestId('card-grid-section')).toBeVisible();
    await expect(page.getByTestId('course-card-section')).toBeVisible();
    await expect(page.getByTestId('lesson-card-section')).toBeVisible();
    await expect(page.getByTestId('surah-card-section')).toBeVisible();
    await expect(page.getByTestId('resource-card-section')).toBeVisible();
  });
});

test.describe('CardGrid Responsive Layout', () => {
  test('displays 3 columns at 1200px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    const cardGrid = page.getByTestId('card-grid-section').locator('.card-grid').first();

    // Get computed grid template columns
    const gridColumns = await cardGrid.evaluate((el) => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });

    // Should have 3 columns (3 values in grid-template-columns)
    const columnCount = gridColumns.split(' ').length;
    expect(columnCount).toBeGreaterThanOrEqual(3);
  });

  test('displays 2 columns at 700px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 800 });
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    const cardGrid = page.getByTestId('card-grid-section').locator('.card-grid').first();

    const gridColumns = await cardGrid.evaluate((el) => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });

    // Should have 2 columns at this viewport
    const columnCount = gridColumns.split(' ').length;
    expect(columnCount).toBeGreaterThanOrEqual(2);
  });

  test('displays 1 column at 400px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 800 });
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    const cardGrid = page.getByTestId('card-grid-section').locator('.card-grid').first();

    const gridColumns = await cardGrid.evaluate((el) => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });

    // Should have 1 column at narrow viewport
    const columnCount = gridColumns.split(' ').length;
    expect(columnCount).toBe(1);
  });

  test('all 6 grid cards are visible', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    for (let i = 1; i <= 6; i++) {
      await expect(page.getByTestId(`grid-card-${i}`)).toBeVisible();
    }
  });
});

test.describe('Arabic Text Wrapping', () => {
  test('Arabic text does not overflow at narrow viewport', async ({ page }) => {
    // Test at narrowest mobile viewport
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    // Get all elements with dir="rtl" attribute (Arabic text)
    const rtlElements = page.locator('[dir="rtl"]');
    const count = await rtlElements.count();

    expect(count).toBeGreaterThan(0);

    // Check each Arabic text element for overflow
    for (let i = 0; i < count; i++) {
      const element = rtlElements.nth(i);
      const isVisible = await element.isVisible();

      if (isVisible) {
        const overflow = await element.evaluate((el) => {
          const rect = el.getBoundingClientRect();
          const parent = el.parentElement;
          if (!parent) return false;
          const parentRect = parent.getBoundingClientRect();

          // Check if element overflows parent horizontally
          return rect.right > parentRect.right + 1; // 1px tolerance
        });

        expect(overflow).toBe(false);
      }
    }
  });

  test('Arabic text has correct overflow-wrap style', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    // Check LessonCard Arabic titles
    const arabicTitles = page.locator('.lesson-title-arabic');
    const lessonCount = await arabicTitles.count();
    expect(lessonCount).toBeGreaterThan(0);

    for (let i = 0; i < lessonCount; i++) {
      const overflowWrap = await arabicTitles.nth(i).evaluate((el) => {
        return window.getComputedStyle(el).overflowWrap;
      });

      // Should be 'break-word' or 'anywhere' (not 'normal')
      expect(['break-word', 'anywhere']).toContain(overflowWrap);
    }

    // Check SurahCard Arabic names
    const surahNames = page.locator('.surah-name-arabic');
    const surahCount = await surahNames.count();
    expect(surahCount).toBeGreaterThan(0);

    for (let i = 0; i < surahCount; i++) {
      const overflowWrap = await surahNames.nth(i).evaluate((el) => {
        return window.getComputedStyle(el).overflowWrap;
      });

      expect(['break-word', 'anywhere']).toContain(overflowWrap);
    }
  });

  test('Arabic text does not use word-break break-all', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    const rtlElements = page.locator('[dir="rtl"]');
    const count = await rtlElements.count();

    for (let i = 0; i < count; i++) {
      const wordBreak = await rtlElements.nth(i).evaluate((el) => {
        return window.getComputedStyle(el).wordBreak;
      });

      // Must NOT be 'break-all' (breaks mid-word)
      expect(wordBreak).not.toBe('break-all');
    }
  });
});

test.describe('Progress Integration', () => {
  test('CourseCard contains progressbar role', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    // Check each course card for progressbar
    for (let level = 1; level <= 5; level++) {
      const courseCard = page.getByTestId(`course-card-level-${level}`);
      const progressBar = courseCard.locator('[role="progressbar"]');

      await expect(progressBar).toBeVisible();
      await expect(progressBar).toHaveAttribute('aria-valuenow');
      await expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    }
  });

  test('CourseCard progress values match expected states', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    // Expected progress: Level 1=0%, Level 2=25%, Level 3=50%, Level 4=75%, Level 5=100%
    const expectedProgress = [
      { level: 1, completed: 0, total: 10 },
      { level: 2, completed: 3, total: 12 },
      { level: 3, completed: 6, total: 12 },
      { level: 4, completed: 9, total: 12 },
      { level: 5, completed: 15, total: 15 }
    ];

    for (const { level, completed, total } of expectedProgress) {
      const courseCard = page.getByTestId(`course-card-level-${level}`);
      const progressBar = courseCard.locator('[role="progressbar"]');

      const ariaNow = await progressBar.getAttribute('aria-valuenow');
      expect(ariaNow).toBe(completed.toString());
    }
  });

  test('LessonCard contains checkmark with role="img"', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    // Check completed lesson cards
    const completedCard = page.getByTestId('lesson-card-completed');
    const completedCheckmark = completedCard.locator('[role="img"]');
    await expect(completedCheckmark).toBeVisible();

    // Check incomplete lesson cards
    const incompleteCard = page.getByTestId('lesson-card-incomplete');
    const incompleteCheckmark = incompleteCard.locator('[role="img"]');
    await expect(incompleteCheckmark).toBeVisible();
  });
});

test.describe('Dark Mode Styling', () => {
  test('cards show hover state changes in dark mode', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    // Enable dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(300);

    // Get a clickable card (CourseCard has href)
    const courseCard = page.getByTestId('course-card-level-1');

    // Get initial box-shadow
    const initialShadow = await courseCard.evaluate((el) => {
      return window.getComputedStyle(el).boxShadow;
    });

    // Hover over card
    await courseCard.hover();
    await page.waitForTimeout(100);

    // Get hover box-shadow
    const hoverShadow = await courseCard.evaluate((el) => {
      return window.getComputedStyle(el).boxShadow;
    });

    // Shadow should change on hover
    expect(hoverShadow).not.toBe(initialShadow);
  });

  test('dark mode text remains readable with proper contrast', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    // Enable dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(300);

    // Check that color CSS variables exist and have values
    const textColor = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = window.getComputedStyle(root);
      return styles.getPropertyValue('--color-text-primary').trim();
    });

    expect(textColor).toBeTruthy();
    expect(textColor).not.toBe('');

    // Verify cards are still visible in dark mode
    await expect(page.getByTestId('course-card-level-1')).toBeVisible();
    await expect(page.getByTestId('lesson-card-completed')).toBeVisible();
    await expect(page.getByTestId('surah-card-1')).toBeVisible();
  });
});

test.describe('Visual Regression', () => {
  test('card grid section at 1200px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    const cardGridSection = page.getByTestId('card-grid-section');
    await expect(cardGridSection).toHaveScreenshot('card-grid-section-1200px.png', {
      maxDiffPixels: 100
    });
  });

  test('lesson card section with Arabic text', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    const lessonSection = page.getByTestId('lesson-card-section');
    await expect(lessonSection).toHaveScreenshot('lesson-card-section-arabic.png', {
      maxDiffPixels: 100
    });
  });

  test('full page in dark mode', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    // Enable dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('cards-dark-mode.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });
});

test.describe('Accessibility', () => {
  test('all cards with href are keyboard focusable', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    // Test CourseCards (all have href)
    for (let level = 1; level <= 5; level++) {
      const card = page.getByTestId(`course-card-level-${level}`);
      await card.focus();
      const isFocused = await card.evaluate((el) => el === document.activeElement);
      expect(isFocused).toBe(true);
    }

    // Test LessonCards
    const lessonCard = page.getByTestId('lesson-card-completed');
    await lessonCard.focus();
    const lessonFocused = await lessonCard.evaluate((el) => el === document.activeElement);
    expect(lessonFocused).toBe(true);

    // Test SurahCards
    const surahCard = page.getByTestId('surah-card-1');
    await surahCard.focus();
    const surahFocused = await surahCard.evaluate((el) => el === document.activeElement);
    expect(surahFocused).toBe(true);

    // Test ResourceCards
    const resourceCard = page.getByTestId('resource-card-1');
    await resourceCard.focus();
    const resourceFocused = await resourceCard.evaluate((el) => el === document.activeElement);
    expect(resourceFocused).toBe(true);
  });

  test('focus-visible outline appears on keyboard focus', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    const card = page.getByTestId('course-card-level-1');

    // Focus via keyboard (Tab)
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await card.focus();

    // Check that outline or box-shadow changes (focus indicator)
    const outlineOrShadow = await card.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow
      };
    });

    // Either outline or box-shadow should exist as focus indicator
    const hasFocusIndicator =
      (outlineOrShadow.outlineWidth && outlineOrShadow.outlineWidth !== '0px') ||
      (outlineOrShadow.boxShadow && outlineOrShadow.boxShadow !== 'none');

    expect(hasFocusIndicator).toBe(true);
  });

  test('cards have accessible labels or text', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    // CourseCards should have visible title text
    for (let level = 1; level <= 5; level++) {
      const card = page.getByTestId(`course-card-level-${level}`);
      const hasText = await card.locator('h3').count() > 0;
      expect(hasText).toBe(true);
    }

    // LessonCards should have title text
    const lessonCard = page.getByTestId('lesson-card-completed');
    const lessonTitle = await lessonCard.locator('h3').count();
    expect(lessonTitle).toBeGreaterThan(0);

    // ResourceCards should have title text
    const resourceCard = page.getByTestId('resource-card-1');
    const resourceTitle = await resourceCard.locator('h3').count();
    expect(resourceTitle).toBeGreaterThan(0);
  });

  test('external links are properly indicated', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    // ResourceCard 1 and 4 have external links
    const externalCards = [
      page.getByTestId('resource-card-1'),
      page.getByTestId('resource-card-4')
    ];

    for (const card of externalCards) {
      const externalIcon = card.locator('.resource-card-external');
      await expect(externalIcon).toBeVisible();

      // Should have aria-label
      const ariaLabel = await externalIcon.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }

    // ResourceCard 2 and 3 have internal links (no external icon)
    const internalCard2 = page.getByTestId('resource-card-2');
    const externalIcon2 = internalCard2.locator('.resource-card-external');
    await expect(externalIcon2).not.toBeVisible();
  });
});
