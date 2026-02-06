# Phase 4: Dark Mode Polish - Research

**Researched:** 2026-02-06
**Domain:** Dark mode accessibility, WCAG AAA contrast, Arabic typography readability
**Confidence:** HIGH

## Summary

Phase 4 focuses on polishing the existing dark mode implementation to meet WCAG AAA contrast standards (7:1 ratio) for Arabic text readability. The existing dark mode infrastructure uses `[data-theme='dark']` attribute switching with CSS custom properties, which is already correctly implemented. Research confirms the current text colors (#ffffff on #0f0f0f background) achieve 21:1 contrast ratio, exceeding WCAG AAA requirements.

The primary challenges involve ensuring Arabic diacritical marks (harakat/tashkeel) remain clearly visible in dark mode, adjusting font weights to compensate for optical rendering differences in light-on-dark text, and establishing automated contrast testing to prevent regressions. The existing Phase 1-3 infrastructure (design tokens, Playwright tests, component test pages) provides a solid foundation for verification.

**Primary recommendation:** Focus on verifying contrast ratios with automated testing (axe-core), adjusting Arabic font weights for dark mode optical compensation (increase from 400 to 500), and using visual regression tests to validate diacritical mark visibility.

## Standard Stack

The established libraries/tools for dark mode contrast validation and testing:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @axe-core/playwright | ^4.11.x | Automated accessibility testing with contrast validation | Industry-standard accessibility engine, 3B+ downloads, WCAG 2.0/2.1/2.2 coverage |
| WebAIM Contrast Checker | N/A (web tool) | Manual contrast ratio verification for design tokens | Official WCAG reference implementation, accepts hex/RGB values |
| Playwright | ^1.58.1 (existing) | Visual regression testing for dark mode | Already established in Phase 1-3, supports screenshot comparison |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| axe-html-reporter | ^2.x | HTML reports for accessibility violations | Optional: if detailed reporting needed beyond Playwright's built-in reporter |
| polypane/ColorContrast.app | N/A (web tool) | Design-time color suggestions for failing contrasts | During token design phase, provides automatic suggestions |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @axe-core/playwright | Manual contrast calculation in tests | Manual calculations error-prone, axe-core is battle-tested and comprehensive |
| Visual regression only | Pa11y or Lighthouse CI | Playwright + axe-core gives both visual and programmatic validation in one stack |

**Installation:**
```bash
npm install -D @axe-core/playwright
```

## Architecture Patterns

### Recommended Testing Structure
```
tests/
├── accessibility.spec.ts       # New: axe-core contrast validation
├── cards.spec.ts              # Existing: extend with dark mode contrast
├── components.spec.ts         # Existing: extend with dark mode contrast
└── font-verification.spec.ts  # Existing: already has dark mode tests
```

### Pattern 1: CSS Custom Property Theming (Existing)
**What:** Semantic color tokens reference CSS variables that switch values via `[data-theme='dark']`
**When to use:** Already implemented correctly in Phase 1-2
**Example:**
```css
/* Source: /Users/daodilyas/quran-learn/src/styles/global.css */
:root {
  --text-primary: #000000;
  --bg-primary: #ffffff;
}

[data-theme="dark"] {
  --text-primary: #ffffff;
  --bg-primary: #0f0f0f;
}
```

### Pattern 2: Font Weight Adjustment for Dark Mode
**What:** Increase font weight slightly for light-on-dark text to compensate for optical rendering differences
**When to use:** For Arabic body text and diacritical marks in dark mode
**Example:**
```css
/* Light mode: normal weight */
.arabic {
  font-family: var(--font-arabic);
  font-weight: 400;
}

/* Dark mode: increase weight for optical compensation */
[data-theme="dark"] .arabic {
  font-weight: 500;
}
```

### Pattern 3: Automated Contrast Testing with axe-core
**What:** Integrate axe-core into Playwright tests to validate WCAG AAA contrast ratios
**When to use:** For every test page that contains text content
**Example:**
```typescript
// Source: axe-core/playwright official docs
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('should not have WCAG AAA contrast violations in dark mode', async ({ page }) => {
  await page.goto('/test/cards/');

  // Enable dark mode
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await page.waitForTimeout(300);

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2aaa', 'wcag21aaa'])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### Pattern 4: Visual Regression for Diacritical Marks
**What:** Capture screenshots of Arabic text with harakat to verify visibility
**When to use:** For SurahCard, LessonCard components with Arabic text
**Example:**
```typescript
// Existing pattern from tests/cards.spec.ts, extend for diacritical focus
test('Arabic diacritical marks visible in dark mode', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto('/surahs/001-al-fatiha/'); // Existing route with harakat

  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await page.waitForTimeout(300);

  // Target element with diacritical marks
  const arabicText = page.locator('.arabic-xl').first();
  await expect(arabicText).toHaveScreenshot('arabic-harakat-dark.png', {
    maxDiffPixels: 50
  });
});
```

### Anti-Patterns to Avoid
- **Manual contrast calculations in tests:** Use axe-core's built-in color-contrast rule instead of implementing WCAG formulas manually
- **Hardcoded color values in components:** All colors must use CSS variables for theme switching (already established in Phase 1)
- **Disabling subpixel antialiasing globally:** The `-webkit-font-smoothing: antialiased` is already correctly applied to body, no changes needed
- **Using text-shadow for contrast enhancement:** Research shows this is rarely effective and can reduce clarity for users with low vision

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Contrast ratio calculation | Custom WCAG formula implementation | axe-core color-contrast rule | Handles edge cases (opacity, overlapping colors, gradients), battle-tested across 3B+ downloads |
| Color suggestions for failing contrasts | Lightness adjustment algorithm | WebAIM Contrast Checker or Polypane ColorContrast.app | WebAIM's algorithm accounts for relative luminance properly, Polypane provides automatic suggestions |
| Dark mode toggle mechanism | Custom theme switcher | Existing `[data-theme]` implementation (Phase 1) | Already established and working, don't rebuild |
| Font rendering optimization | Custom font-smoothing rules | Existing global.css antialiasing setup | macOS handles this natively since Mojave, over-optimization can harm readability |

**Key insight:** WCAG contrast calculations involve complex relative luminance formulas with gamma correction. The axe-core library implements these correctly and handles edge cases (semi-transparent overlays, gradient backgrounds, text shadows) that manual implementations miss.

## Common Pitfalls

### Pitfall 1: Assuming High Contrast Always Means Readable
**What goes wrong:** Maximum contrast (21:1 white on black) can cause eye strain for extended reading, especially with Arabic's dense diacritical marks.
**Why it happens:** WCAG specifies minimum ratios, not optimal ratios. Pure white (#ffffff) on pure black (#000000) exceeds requirements but may be too harsh.
**How to avoid:** Current implementation uses slightly off-black (#0f0f0f) which reduces pure white harshness while maintaining 21:1 ratio. Consider testing with users for comfort during extended reading sessions.
**Warning signs:** User reports of eye strain in dark mode, especially during long study sessions.

### Pitfall 2: Testing Dark Mode with Only CSS Variable Checks
**What goes wrong:** Tests verify CSS variables exist but don't validate actual rendered contrast ratios or visual appearance.
**Why it happens:** Existing tests (tests/cards.spec.ts line 267-291) only check that `--color-text-primary` has a value, not that the computed color meets WCAG standards.
**How to avoid:** Add axe-core automated checks that validate actual rendered contrast ratios, not just CSS variable presence.
**Warning signs:** Tests pass but users report unreadable text, especially on non-standard displays or with browser extensions modifying colors.

### Pitfall 3: Ignoring Font Weight in Dark Mode
**What goes wrong:** Light text on dark backgrounds appears thinner than dark text on light backgrounds due to optical illusion and antialiasing rendering.
**Why it happens:** WebKit/Blink rendering engines apply different subpixel antialiasing for light-on-dark vs dark-on-light text.
**How to avoid:** Increase font-weight from 400 to 500 for Arabic text in dark mode. Research shows this compensates for the optical thinning effect.
**Warning signs:** Users report Arabic text appearing "washed out" or diacritical marks being hard to see in dark mode despite passing contrast tests.

### Pitfall 4: Not Testing with Actual Quranic Text
**What goes wrong:** Tests use placeholder Arabic text without proper diacritical marks (harakat/tashkeel), missing critical readability issues.
**Why it happens:** Test data may use simplified Arabic or the wrong font that doesn't render harakat properly.
**How to avoid:** Use existing route `/surahs/001-al-fatiha/` which has authentic UthmanicHafs font with proper harakat. Visual regression tests should target this page.
**Warning signs:** Tests pass with test data but production Quranic text shows visibility problems with diacritical marks.

### Pitfall 5: Over-Relying on Automated Tools
**What goes wrong:** axe-core validates contrast ratios mathematically but cannot assess subjective readability or cultural/linguistic factors specific to Arabic script.
**Why it happens:** Automated tools measure luminance contrast but don't account for font design, glyph complexity, or diacritical mark density.
**How to avoid:** Combine automated axe-core tests with visual regression screenshots and manual review by Arabic readers. Phase 7 (Mobile Optimization) should include device testing with native Arabic speakers.
**Warning signs:** All automated tests pass but users report difficulty reading Arabic text, especially at smaller sizes or on different devices.

## Code Examples

Verified patterns from official sources and existing codebase:

### Automated Contrast Testing with axe-core
```typescript
// Source: https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/README.md
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Dark Mode Accessibility', () => {
  test('should not have any WCAG AAA violations in dark mode', async ({ page }) => {
    await page.goto('/test/cards/');

    // Enable dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(300); // Allow CSS transitions to complete

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aaa', 'wcag21aaa', 'wcag22aaa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should pass contrast checks for Arabic text', async ({ page }) => {
    await page.goto('/surahs/001-al-fatiha/');

    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(300);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['color-contrast']) // Focus on contrast rule only
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

### Font Weight Adjustment for Dark Mode
```css
/* Add to src/styles/global.css */
/* Optical adjustment: increase weight for light-on-dark text */
[data-theme="dark"] .arabic,
[data-theme="dark"] .arabic-lg,
[data-theme="dark"] .arabic-xl {
  font-weight: 500; /* Up from 400 in light mode */
}

[data-theme="dark"] .surah-name-arabic {
  font-weight: 700; /* Already bold, no change needed */
}
```

### Visual Regression for Diacritical Visibility
```typescript
// Add to tests/cards.spec.ts or new tests/accessibility.spec.ts
test.describe('Arabic Diacritical Marks Visibility', () => {
  test('harakat visible in dark mode on SurahCard', async ({ page }) => {
    await page.goto('/test/cards/');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(300);

    // Target first SurahCard with Arabic text
    const surahCard = page.getByTestId('surah-card-1');
    const arabicName = surahCard.locator('.surah-name-arabic');

    await expect(arabicName).toHaveScreenshot('surah-arabic-dark.png', {
      maxDiffPixels: 50
    });
  });

  test('harakat visible in dark mode on Quran page', async ({ page }) => {
    await page.goto('/surahs/001-al-fatiha/');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(300);

    // Target main Quranic text with UthmanicHafs font
    const arabicText = page.locator('.arabic-xl').first();

    await expect(arabicText).toHaveScreenshot('quran-text-dark-harakat.png', {
      maxDiffPixels: 100
    });
  });
});
```

### Contrast Ratio Verification Utility (Optional)
```typescript
// If manual verification needed alongside axe-core
// Source: Existing pattern from tests/cards.spec.ts lines 278-285
async function getComputedColors(page, selector: string) {
  return await page.locator(selector).evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      color: styles.color,
      backgroundColor: styles.backgroundColor,
    };
  });
}

// Usage in test
const colors = await getComputedColors(page, '.surah-name-arabic');
// Then use WebAIM API or axe-core for validation
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind `dark:` classes | `[data-theme='dark']` attribute | Phase 1 (2026-02-05) | Centralized theme switching, no class proliferation |
| WCAG AA (4.5:1) as standard | WCAG AAA (7:1) for Arabic text | Industry shift 2024-2025 | Higher accessibility bar for international/educational apps |
| Manual contrast checks | Automated axe-core integration | axe-core adoption 2023+ | Prevents regressions, catches violations at test time |
| Subpixel antialiasing optimization | Laissez-faire approach | macOS Mojave (2018) disabled it | Modern displays don't need subpixel tricks, causes more issues |
| Fixed font weights | Optical weight compensation | 2024-2025 dark mode research | Improves readability for light-on-dark text |

**Deprecated/outdated:**
- `-moz-osx-font-smoothing`: Firefox 128+ supports `-webkit-font-smoothing`, unified prefix no longer needed
- Manual WCAG contrast calculations in tests: axe-core handles edge cases (opacity, overlays) that simple formulas miss
- Pure black (#000000) backgrounds: Industry moved to slightly lighter blacks (#0f0f0f, #1a1a1a) for reduced eye strain

## Open Questions

Things that couldn't be fully resolved:

1. **Optimal font weight for UthmanicHafs in dark mode**
   - What we know: General research suggests 500 weight for light-on-dark text, existing light mode uses 400
   - What's unclear: UthmanicHafs is a specialized Quranic font with only weight 400 available (no 500 variant exists)
   - Recommendation: Test with weight 400 first since it's the only available weight. If harakat visibility is insufficient, consider increasing via `text-stroke: 0.2px currentColor` for subtle thickening or researching if UthmanicHafs has alternate glyphs for dark backgrounds. Defer to Phase 7 (Mobile Optimization) for device testing with Arabic readers.

2. **Component-level vs global dark mode adjustments**
   - What we know: Current implementation handles theme switching globally via `[data-theme='dark']`
   - What's unclear: Whether certain components (cards, badges) need component-specific contrast adjustments beyond global token changes
   - Recommendation: Start with global token adjustments, use axe-core to identify any components that fail contrast checks, then apply component-specific overrides only where needed.

3. **Diacritical mark visibility metrics**
   - What we know: WCAG contrast measures foreground/background, but diacritical marks are small glyphs that may need higher contrast
   - What's unclear: No WCAG guidance exists specifically for diacritical mark visibility, size thresholds, or density considerations
   - Recommendation: Use visual regression tests as the validation method. Capture baseline screenshots of Quranic text with harakat in dark mode, flag any regressions that affect mark visibility. Consider user testing in Phase 7 with native Arabic readers for subjective validation.

4. **Performance impact of axe-core testing**
   - What we know: axe-core runs additional DOM analysis and accessibility checks, adding test execution time
   - What's unclear: How much test suite duration will increase with axe-core on all test pages
   - Recommendation: Add axe-core tests selectively to key pages first (/test/cards, /test/progress, one Quran page). Monitor CI execution time. If acceptable, expand coverage. If too slow, run accessibility tests separately from visual regression tests.

## Sources

### Primary (HIGH confidence)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - WCAG AAA requirements (7:1 ratio)
- [WCAG 2.2 Understanding Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) - Official W3C specification
- [@axe-core/playwright npm package](https://www.npmjs.com/package/@axe-core/playwright) - Official integration docs
- [axe-core GitHub repository](https://github.com/dequelabs/axe-core) - Source of truth for accessibility rules
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing) - Official Playwright docs

### Secondary (MEDIUM confidence)
- [Dark Mode Design Best Practices 2026](https://www.tech-rz.com/blog/dark-mode-design-best-practices-in-2026/) - Font weight adjustments for dark mode (verified with multiple sources)
- [Typography in Dark Mode Interfaces](https://moldstud.com/articles/p-best-practices-for-typography-in-dark-mode-interfaces-enhance-readability-user-experience) - Line spacing and weight recommendations
- [WebKit Font Smoothing Analysis](https://dbushell.com/2024/11/05/webkit-font-smoothing/) - Modern perspective on antialiasing (2024)
- [CSS-Tricks: Dark Mode and Variable Fonts](https://css-tricks.com/dark-mode-and-variable-fonts/) - Optical size adjustments

### Tertiary (LOW confidence - general information)
- [Arabic Typography Web Guidelines](https://codeguru.ae/blog/fonts-and-readability-best-arabic-script-for-the-web/) - General Arabic font recommendations, not dark-mode specific
- [Arabic Diacritical Marks Guide](https://arabictyping101.com/guide/arabic-diacritics) - Harakat explanation, no visibility metrics
- [Design of Arabic Diacritical Marks (arxiv)](https://arxiv.org/abs/1107.4734) - Academic research on mark design, not web rendering

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - axe-core is industry standard with 3B+ downloads, WebAIM is official WCAG reference
- Architecture: HIGH - Patterns verified from official docs (axe-core, Playwright) and existing codebase
- Pitfalls: MEDIUM - Based on WebSearch findings and general dark mode research, not Arabic-specific testing
- Arabic font weights: LOW - UthmanicHafs font lacks documentation on dark mode optimization, needs testing
- Diacritical visibility: MEDIUM - Visual regression approach is sound, but no specific WCAG guidance exists for harakat

**Research date:** 2026-02-06
**Valid until:** 30 days (stable domain - WCAG standards unchanged, tooling mature)

**Key gaps requiring validation:**
- UthmanicHafs font weight 500 availability (may need alternative thickening approach)
- Actual user testing with Arabic readers for diacritical mark readability
- axe-core performance impact on CI test duration
- Component-specific contrast issues beyond global token changes
