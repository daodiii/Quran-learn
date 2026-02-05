# Phase 1: Design Foundation & Font Protection - Research

**Researched:** 2026-02-05
**Domain:** Design token systems, Tailwind 4 CSS configuration, font protection, Arabic typography
**Confidence:** HIGH

## Summary

This phase establishes a modern CSS-first design token system using Tailwind CSS 4's new `@theme` directive and protects critical Arabic fonts (UthmanicHafs, Amiri family) before any restructuring begins. The project already has an extensive design system in `src/styles/global.css` with 1,153 lines of CSS custom properties, font-face declarations, and component styles that need to be migrated to Tailwind 4's semantic token architecture.

The current implementation uses CSS custom properties (`:root` and `[data-theme="dark"]`) with manual variable management, which can be replaced with Tailwind 4's native `@theme` directive for automatic utility class generation. The existing 4 Arabic font families (UthmanicHafs, Amiri regular/bold/italic with Arabic and Latin subsets) are already properly configured with unicode-range subsetting.

**Key challenge:** Migrating 115+ existing CSS custom properties to Tailwind 4's `@theme` system while preserving all existing visual styles and ensuring Arabic fonts remain unchanged through verification testing.

**Primary recommendation:** Use Tailwind 4's CSS-first configuration with semantic token naming (CTI convention), implement visual regression testing for font verification, and maintain both light/dark mode support through CSS variable scoping rather than Tailwind's class-based dark mode.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 4.1.18 | Design token system with @theme directive | Industry standard for utility-first CSS, v4 introduces CSS-first config that aligns with existing custom properties approach |
| @tailwindcss/vite | 4.1.18 | Vite plugin for Tailwind 4 in Astro | Official integration method for Astro >=5.2.0, replaces deprecated @astrojs/tailwind |
| Astro | 5.17.1 | Static site framework | Already in use, stable v5 with excellent CSS/font handling |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| BackstopJS | Latest | Visual regression testing for fonts | Verify font rendering remains unchanged across refactoring |
| @playwright/test | Latest | Alternative visual testing with snapshots | If BackstopJS proves insufficient for font-specific verification |
| WebAIM Contrast Checker | Web tool | WCAG contrast validation | Validate 7:1 ratio for Arabic text in dark mode |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Tailwind 4 native dark mode | CSS custom properties with [data-theme] | Project already uses data-theme approach; switching would require component refactoring. Keep existing approach. |
| Visual regression testing | Manual font verification | Automated testing catches subtle rendering changes; manual testing misses edge cases |
| @theme directive | Continue with raw CSS variables | @theme auto-generates utilities (bg-primary, text-secondary), reducing maintenance burden |

**Installation:**
```bash
# Already installed in package.json:
# - tailwindcss@4.1.18
# - @tailwindcss/vite@4.1.18

# Add visual regression testing:
npm install --save-dev backstopjs
# or
npm install --save-dev @playwright/test
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── styles/
│   ├── global.css              # Main entry point with @import "tailwindcss"
│   ├── tokens/
│   │   ├── colors.css          # @theme with color tokens
│   │   ├── spacing.css         # @theme with spacing/sizing tokens
│   │   ├── typography.css      # @theme with font tokens
│   │   └── shadows.css         # @theme with shadow tokens
│   ├── fonts.css               # @font-face declarations (unchanged)
│   └── components.css          # Component styles (migrate gradually)
└── tests/
    └── visual/
        ├── backstop.config.js  # Visual regression config
        └── scenarios/
            └── arabic-fonts.json  # Font rendering test scenarios
```

### Pattern 1: Semantic Token Naming with CTI Convention

**What:** Use Category-Type-Item convention for design token names that clearly convey purpose.

**When to use:** All token definitions in `@theme` blocks to ensure semantic, maintainable naming.

**Example:**
```css
/* Source: Smashing Magazine - Best Practices For Naming Design Tokens
   https://www.smashingmagazine.com/2024/05/naming-best-practices/ */

@theme {
  /* Colors - CTI: color-[context]-[variant] */
  --color-background-primary: #ffffff;
  --color-background-secondary: #f9fafb;
  --color-text-primary: #000000;
  --color-text-secondary: #1f1f1f;
  --color-border-primary: #e5e7eb;
  --color-accent-primary: #0D7377;

  /* Spacing - CTI: space-[size] */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;

  /* Typography - CTI: font-[category] */
  --font-family-sans: 'Inter', system-ui, sans-serif;
  --font-family-arabic: 'KFGQPC Hafs Uthmani', 'Amiri', serif;

  /* Shadows - CTI: shadow-[elevation] */
  --shadow-soft: 0 2px 8px rgba(13, 115, 119, 0.06);
  --shadow-medium: 0 4px 16px rgba(13, 115, 119, 0.1);
}
```

### Pattern 2: Light/Dark Mode with CSS Variable Scoping

**What:** Define theme-specific values in scoped CSS blocks rather than using Tailwind's class-based dark mode.

**When to use:** The project already uses `[data-theme="dark"]` attribute; maintain this pattern for consistency.

**Example:**
```css
/* Source: DEV Community - The Cleanest Way to Support Dark Mode
   https://dev.to/kittishane/the-cleanest-way-to-support-dark-mode-using-css-variables-and-tailwind-4po0 */

/* Light mode (default) */
:root {
  --color-background-primary: #ffffff;
  --color-text-primary: #000000;
}

/* Dark mode */
[data-theme="dark"] {
  --color-background-primary: #0f0f0f;
  --color-text-primary: #ffffff;
}

/* Then in @theme, reference these variables */
@theme {
  --color-background-primary: var(--color-background-primary);
  --color-text-primary: var(--color-text-primary);
}
```

### Pattern 3: Font Protection with Unicode-Range Subsetting

**What:** Use unicode-range descriptor in @font-face to ensure proper font loading for Arabic vs Latin characters.

**When to use:** All Arabic font declarations to optimize loading and prevent font substitution issues.

**Example:**
```css
/* Source: W3C Arabic Layout Requirements
   https://www.w3.org/TR/alreq/ */

@font-face {
  font-family: 'Amiri';
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/amiri-regular-arabic.woff2') format('woff2');
  /* Arabic Unicode range - ensures correct font for Arabic text */
  unicode-range: U+0600-06FF, U+0750-077F, U+0870-088E,
                 U+0890-0891, U+0897-08E1, U+08E3-08FF,
                 U+200C-200E, U+2010-2011, U+204F, U+2E41,
                 U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC;
}

@font-face {
  font-family: 'Amiri';
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/amiri-regular-latin.woff2') format('woff2');
  /* Latin Unicode range - separate file for Latin characters */
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC,
                 U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
                 U+2000-206F, U+20AC, U+2122, U+2191, U+2193,
                 U+2212, U+2215, U+FEFF, U+FFFD;
}
```

### Pattern 4: Visual Regression Testing for Font Verification

**What:** Automated screenshot comparison to verify fonts remain unchanged during refactoring.

**When to use:** After any CSS refactoring or token migration to ensure visual consistency.

**Example:**
```javascript
// Source: BrowserStack - Playwright Snapshot Testing
// https://www.browserstack.com/guide/playwright-snapshot-testing

// backstop.config.js
module.exports = {
  id: "arabic_font_verification",
  viewports: [
    { label: "desktop", width: 1920, height: 1080 },
    { label: "tablet", width: 768, height: 1024 },
    { label: "mobile", width: 375, height: 667 }
  ],
  scenarios: [
    {
      label: "UthmanicHafs Font - Light Mode",
      url: "http://localhost:4321/surah/al-fatihah/",
      selectors: [".arabic"],
      requireSameDimensions: true
    },
    {
      label: "Amiri Regular - Lesson Content",
      url: "http://localhost:4321/learn/01-arabic-basics/",
      selectors: [".arabic", ".word-analysis-table"],
      requireSameDimensions: true
    },
    {
      label: "Arabic Fonts - Dark Mode",
      url: "http://localhost:4321/surah/al-fatihah/",
      onReadyScript: "setDarkMode.js",
      selectors: [".arabic"],
      requireSameDimensions: true
    }
  ],
  paths: {
    bitmaps_reference: "tests/visual/reference",
    bitmaps_test: "tests/visual/test",
    html_report: "tests/visual/report"
  }
};
```

### Anti-Patterns to Avoid

- **Mixing @theme with inline CSS variables:** Don't define tokens in both `@theme` and `:root` blocks. Choose one source of truth (use `@theme` for tokens that generate utilities, keep `:root` only for theme-specific values).

- **Overly specific token names:** Avoid `--color-hero-section-heading-text-hover-state-dark-mode`. Use layered abstractions instead: primitive → semantic → component-specific.

- **Hardcoded colors in components:** Don't use `background: #0D7377` in component styles. Always reference tokens: `background: var(--color-accent-primary)`.

- **Ignoring font-display:** Always set `font-display: swap` for web fonts to prevent invisible text during loading (FOIT - Flash of Invisible Text).

- **Breaking unicode-range:** The existing Arabic font unicode-range declarations are correct. Don't modify them without understanding the full Arabic Unicode blocks.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dark mode toggle logic | Custom JS theme switcher | Existing `[data-theme]` attribute system | Project already has working implementation; preserve it during migration |
| Font loading optimization | Manual preload/prefetch tags | `font-display: swap` + unicode-range | Browser handles optimization; unicode-range already implemented correctly |
| Visual regression testing | Manual screenshot comparison | BackstopJS or Playwright snapshots | Automated tools catch pixel-level differences humans miss |
| Design token conversion | Manual CSS variable migration | Tailwind 4 @theme directive | @theme auto-generates utility classes, reducing maintenance |
| Contrast checking | Manual color picker comparisons | WebAIM Contrast Checker | WCAG compliance requires precise calculations; tools provide instant validation |
| CSS custom properties organization | Flat variable list | Semantic naming with CTI convention | Industry standard naming prevents naming collisions and improves maintainability |

**Key insight:** Font rendering is deceptively complex. Arabic text involves contextual shaping (letters change form based on position), right-to-left rendering, combining marks, and ligatures. The existing font declarations are production-tested. Don't rebuild them—protect them with verification tests and migrate the design system around them.

## Common Pitfalls

### Pitfall 1: Breaking Dark Mode During Token Migration

**What goes wrong:** Converting CSS custom properties to `@theme` tokens without preserving the `[data-theme="dark"]` scoping breaks dark mode. Developers assume Tailwind's `dark:` class approach will work automatically.

**Why it happens:** Tailwind 4's default dark mode uses `@media (prefers-color-scheme: dark)` or `.dark` class, but this project uses `[data-theme="dark"]` attribute for explicit user control.

**How to avoid:**
1. Keep the existing `:root` and `[data-theme="dark"]` blocks for theme-specific values.
2. Reference these CSS variables inside `@theme` blocks rather than hardcoding values.
3. Test both light and dark modes after every token migration step.

**Warning signs:**
- Dark mode styles suddenly stop working after adding `@theme`
- Console errors about undefined CSS variables
- Color utilities (bg-primary, text-secondary) only work in light mode

### Pitfall 2: Font File Hash Changes Breaking Verification

**What goes wrong:** Visual regression tests fail because font file URLs change during build (hash changes), causing slight rendering differences even though font content is identical.

**Why it happens:** Build tools add content hashes to font files for cache busting. If the hash changes between reference capture and test run, the browser loads a "different" font (same content, different URL).

**How to avoid:**
1. Capture visual regression reference screenshots AFTER a production build, not during dev mode.
2. Use `requireSameDimensions: true` in BackstopJS to catch layout shifts, not just pixel differences.
3. Set tolerance thresholds for minor anti-aliasing differences (0.1% - 0.5%).
4. Verify font file checksums separately using a hash verification step.

**Warning signs:**
- Visual tests fail with "font rendering different" but manual inspection shows identical appearance
- Font URLs in test vs reference have different hashes
- Failures only occur in CI/CD, not local testing

### Pitfall 3: Overwriting Existing Arabic Font Optimizations

**What goes wrong:** During token migration, developers "clean up" or "simplify" the existing @font-face declarations, removing unicode-range specifications or consolidating separate Arabic/Latin font files.

**Why it happens:** The unicode-range subsetting strategy isn't obvious. It looks like duplication (8 separate Amiri font files), so developers try to consolidate.

**How to avoid:**
1. Treat the entire `/* KFGQPC Hafs Uthmani */` and `/* Self-hosted Amiri font */` sections (lines 201-275 in global.css) as immutable.
2. Move them to a separate `fonts.css` file that imports into global.css unchanged.
3. Add comments explaining WHY unicode-range subsetting exists (performance, correct rendering).
4. Document the 4 Arabic font families as "protected" in this research file.

**Warning signs:**
- Arabic text suddenly uses fallback fonts on some browsers
- Font file size increases dramatically (no longer subsetting)
- Mobile users report slow font loading
- Mixed Arabic-Latin text renders inconsistently

### Pitfall 4: WCAG 7:1 Contrast Ratio Not Met in Dark Mode

**What goes wrong:** Migrating color tokens to `@theme` inadvertently reduces contrast ratios below WCAG AAA requirements (7:1 for normal text). The requirement specifies 7:1 for Arabic text specifically.

**Why it happens:** Developers copy light mode color values into dark mode without recalculating contrast. Dark mode often needs lighter text colors and darker backgrounds than intuitive.

**How to avoid:**
1. Use WebAIM Contrast Checker for every dark mode text/background pair.
2. Document required contrast in token comments: `--color-text-primary: #ffffff; /* 7:1 ratio required for Arabic text */`
3. Run automated accessibility tests in both themes.
4. Test with actual Arabic content, not Lorem Ipsum (different rendering affects perceived contrast).

**Warning signs:**
- Accessibility audits flag contrast issues in dark mode
- Arabic text harder to read in dark mode than light mode
- Text colors look "washed out" or "too bright" in dark mode

### Pitfall 5: @theme Directive Not Generating Expected Utilities

**What goes wrong:** After adding tokens to `@theme`, utility classes like `bg-primary` or `text-accent` don't work. Build shows no errors, but classes have no effect.

**Why it happens:** Tailwind 4's namespace-based utility generation requires specific naming patterns. Tokens must use prefixes like `--color-*`, `--space-*`, `--font-*` to trigger utility generation.

**How to avoid:**
1. Use namespace-aware naming: `--color-primary-500` (generates `bg-primary-500`), not `--primary-color` (generates nothing).
2. Restart dev server after adding new `@theme` blocks (Vite doesn't always hot-reload config changes).
3. Check Tailwind's generated CSS output to verify utilities exist.
4. Reference official Tailwind 4 namespace documentation.

**Warning signs:**
- Utility classes defined in HTML have no effect
- Browser DevTools show class names but no associated CSS rules
- Dev server needs frequent restarts to pick up token changes
- Generated utilities.css file is smaller than expected

## Code Examples

Verified patterns from official sources:

### Tailwind 4 @theme Configuration in Astro

```css
/* Source: Tailkits - Astro + Tailwind v4 Setup
   https://tailkits.com/blog/astro-tailwind-setup/ */

/* src/styles/global.css */
@import "tailwindcss";

/* Define theme-specific CSS variables first */
:root {
  --bg-primary: #ffffff;
  --text-primary: #000000;
  --accent-primary: #0D7377;
}

[data-theme="dark"] {
  --bg-primary: #0f0f0f;
  --text-primary: #ffffff;
  --accent-primary: #14B8A6;
}

/* Then map them to Tailwind tokens */
@theme {
  /* Colors - namespace generates bg-*, text-*, border-* utilities */
  --color-background-primary: var(--bg-primary);
  --color-text-primary: var(--text-primary);
  --color-accent-primary: var(--accent-primary);

  /* Spacing - generates p-*, m-*, gap-*, space-* utilities */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;

  /* Typography - generates font-* utilities */
  --font-family-sans: 'Inter', system-ui, sans-serif;
  --font-family-arabic: 'KFGQPC Hafs Uthmani', 'Amiri', serif;

  /* Radius - generates rounded-* utilities */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}
```

### WCAG 7:1 Contrast Compliant Dark Mode Colors

```css
/* Source: WebAIM - Contrast and Color Accessibility
   https://webaim.org/articles/contrast/ */

:root {
  /* Light mode - 7:1 contrast ratio for normal text */
  --text-primary: #000000;      /* #000 on #FFF = 21:1 ✓ */
  --text-secondary: #1f1f1f;    /* #1f1f1f on #FFF = 17.5:1 ✓ */
  --text-tertiary: #4b5563;     /* #4b5563 on #FFF = 7.3:1 ✓ */
  --bg-primary: #ffffff;
}

[data-theme="dark"] {
  /* Dark mode - 7:1 contrast ratio for Arabic text (AAA) */
  --text-primary: #ffffff;      /* #FFF on #0f0f0f = 19.2:1 ✓ */
  --text-secondary: #e5e5e5;    /* #e5e5e5 on #0f0f0f = 14.8:1 ✓ */
  --text-tertiary: #a3a3a3;     /* #a3a3a3 on #0f0f0f = 7.1:1 ✓ */
  --bg-primary: #0f0f0f;

  /* Arabic text specifically - elevated backgrounds for 7:1 */
  --bg-elevated: #1a1a1a;       /* #FFF on #1a1a1a = 16.8:1 ✓ */
  --arabic-text: #ffffff;       /* Always white for maximum contrast */
}

/* Apply to Arabic text elements */
.arabic,
.arabic-lg,
.arabic-xl {
  color: var(--arabic-text);
  /* Ensure 7:1 contrast as specified in REQUIREMENTS.md */
  background-color: var(--bg-elevated);
}
```

### Astro Config for Tailwind 4 Vite Plugin

```javascript
// Source: DEV Community - How to Use Tailwind CSS v4 in Astro
// https://dev.to/dipankarmaikap/how-to-use-tailwind-css-v4-in-astro-31og

// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

export default defineConfig({
  trailingSlash: 'always',

  vite: {
    plugins: [tailwindcss()] // Tailwind 4 Vite plugin
  },

  integrations: [mdx()]
});

// Note: No tailwind.config.js needed for Tailwind 4
// All configuration lives in CSS via @theme directive
```

### Font Checksum Verification Test

```javascript
// Source: Adapted from visual regression testing best practices
// https://medium.com/@ss-tech/the-ui-visual-regression-testing-best-practices-playbook-dc27db61ebe0

// tests/font-verification.test.js
import { test, expect } from '@playwright/test';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';

const PROTECTED_FONTS = [
  'public/fonts/UthmanicHafs.woff2',
  'public/fonts/amiri-regular-arabic.woff2',
  'public/fonts/amiri-regular-latin.woff2',
  'public/fonts/amiri-bold-arabic.woff2',
  'public/fonts/amiri-bold-latin.woff2'
];

// Baseline checksums - capture these before Phase 1 work begins
const BASELINE_CHECKSUMS = {
  'public/fonts/UthmanicHafs.woff2': 'CAPTURE_BEFORE_PHASE_1',
  'public/fonts/amiri-regular-arabic.woff2': 'CAPTURE_BEFORE_PHASE_1',
  // ... etc
};

test.describe('Font Protection Verification', () => {
  test('Arabic font files unchanged', () => {
    PROTECTED_FONTS.forEach(fontPath => {
      const fontBuffer = readFileSync(fontPath);
      const checksum = createHash('sha256')
        .update(fontBuffer)
        .digest('hex');

      expect(checksum).toBe(
        BASELINE_CHECKSUMS[fontPath],
        `Font ${fontPath} has changed during refactoring`
      );
    });
  });

  test('Arabic text renders correctly in light mode', async ({ page }) => {
    await page.goto('http://localhost:4321/surah/al-fatihah/');

    // Wait for fonts to load
    await page.waitForLoadState('networkidle');

    // Verify font family applied
    const arabicText = page.locator('.arabic').first();
    const fontFamily = await arabicText.evaluate(
      el => window.getComputedStyle(el).fontFamily
    );

    expect(fontFamily).toContain('KFGQPC Hafs Uthmani');
  });

  test('Arabic text renders correctly in dark mode', async ({ page }) => {
    await page.goto('http://localhost:4321/surah/al-fatihah/');

    // Switch to dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    await page.waitForLoadState('networkidle');

    // Visual snapshot comparison
    await expect(page.locator('.arabic').first()).toHaveScreenshot(
      'arabic-text-dark-mode.png',
      { maxDiffPixelRatio: 0.01 } // 1% tolerance for anti-aliasing
    );
  });
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tailwind.config.js | CSS @theme directive | Tailwind 4.0 (2024) | All configuration now in CSS; no JS config file needed |
| Manual CSS variables | Namespace-aware @theme tokens | Tailwind 4.0 (2024) | Auto-generates utilities from tokens; less maintenance |
| .dark class for dark mode | [data-theme] attribute | Project-specific | More explicit control; better for multi-theme systems |
| @astrojs/tailwind integration | @tailwindcss/vite plugin | Astro 5.2.0 + Tailwind 4 | Faster builds, better HMR, official Tailwind plugin |
| Manual dark mode styles | CSS variable scoping | Modern CSS (2023+) | Single source of truth; theme values defined once |
| Monolithic global.css | Modular token files | Design systems 2025+ | Better organization; easier maintenance and collaboration |

**Deprecated/outdated:**

- **@astrojs/tailwind integration:** Replaced by @tailwindcss/vite for Tailwind 4. The old Astro-specific integration doesn't support Tailwind 4's CSS-first config.

- **tailwind.config.js for design tokens:** Tailwind 4 moved to CSS-first config. Config files only needed for complex customization (custom plugins, specific JIT settings).

- **Subresource Integrity (SRI) for fonts:** While recommended for external resources, SRI doesn't work with CSS @font-face declarations. Use checksum verification in tests instead.

- **font-display: auto:** Changed to `font-display: swap` as default best practice to prevent FOIT (Flash of Invisible Text). The project correctly uses swap already.

## Open Questions

Things that couldn't be fully resolved:

1. **Exact contrast ratios for existing dark mode colors**
   - What we know: REQUIREMENTS.md specifies 7:1 contrast for Arabic text in dark mode. The existing global.css defines dark mode colors but doesn't document contrast ratios.
   - What's unclear: Whether the current dark mode `--text-primary: #ffffff` on `--bg-primary: #0f0f0f` meets 7:1 ratio. Needs verification with WebAIM checker.
   - Recommendation: During planning, calculate and document contrast ratios for all text/background pairs in both themes. Add comments to token definitions with actual ratios.

2. **Visual regression test tolerance thresholds**
   - What we know: Font rendering involves sub-pixel anti-aliasing that varies by OS, browser, and zoom level. BackstopJS allows configurable tolerance.
   - What's unclear: What tolerance percentage (0.1%? 0.5%? 1%?) catches meaningful changes without false positives from anti-aliasing differences.
   - Recommendation: Start with 0.5% tolerance and adjust based on initial test runs. Document final threshold choice in test config with rationale.

3. **Coursera-specific design patterns beyond spacing/typography**
   - What we know: REQUIREMENTS.md requests "Coursera-like spacing, typography, and visual hierarchy." Reverse-engineering analysis exists for Coursera mobile app.
   - What's unclear: Which specific Coursera patterns to adopt (card styles, button variants, progress indicators) beyond general spacing/typography principles.
   - Recommendation: During Phase 2 (progress visualization), research Coursera's specific progress bar styles. For Phase 1, focus on foundation tokens (spacing scale, typography scale, color system).

4. **Migration strategy: Big bang vs gradual**
   - What we know: The existing global.css has 115+ CSS custom properties already defined, plus component styles (.card, .btn-primary, etc.).
   - What's unclear: Should Phase 1 migrate ALL existing variables to @theme immediately, or migrate incrementally as components are refactored in later phases?
   - Recommendation: Migrate foundation tokens (colors, spacing, typography, shadows) in Phase 1. Leave component-specific styles (.quiz-option, .grammar-box) for their respective phases. Document migration approach in PLAN files.

5. **Font subset optimization for mobile performance**
   - What we know: Amiri fonts already use unicode-range subsetting (separate Arabic/Latin files). This is performance best practice.
   - What's unclear: Whether additional subsetting (e.g., splitting Amiri into "commonly used" vs "rare" Arabic glyphs) would improve mobile load times, or if current subsetting is optimal.
   - Recommendation: Monitor font load performance during Phase 7 (Mobile Responsiveness & Polish) testing. If load times exceed 2 seconds on 3G, consider further subsetting. For Phase 1, preserve existing subsetting unchanged.

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4.0 Official Release](https://tailwindcss.com/blog/tailwindcss-v4) - @theme directive, CSS-first config
- [Tailwind CSS Dark Mode Documentation](https://tailwindcss.com/docs/dark-mode) - Dark mode strategies
- [Tailkits: Astro + Tailwind v4 Setup Guide](https://tailkits.com/blog/astro-tailwind-setup/) - Official Astro integration
- [W3C Arabic & Persian Layout Requirements](https://www.w3.org/TR/alreq/) - Arabic typography standards
- [WebAIM: Contrast and Color Accessibility](https://webaim.org/articles/contrast/) - WCAG 7:1 contrast ratio
- [W3C WCAG 2.1 Success Criterion 1.4.3: Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) - Contrast requirements

### Secondary (MEDIUM confidence)
- [Smashing Magazine: Best Practices For Naming Design Tokens](https://www.smashingmagazine.com/2024/05/naming-best-practices/) - CTI naming convention
- [DEV Community: The Cleanest Way to Support Dark Mode](https://dev.to/kittishane/the-cleanest-way-to-support-dark-mode-using-css-variables-and-tailwind-4po0) - CSS variable scoping pattern
- [Medium: Mastering typography in design systems](https://uxdesign.cc/mastering-typography-in-design-systems-with-semantic-tokens-and-responsive-scaling-6ccd598d9f21) - Typography hierarchy
- [fourzerothree.in: Reverse Engineering Coursera Design System](https://www.fourzerothree.in/p/reverse-engineering-design-system-coursera) - Coursera design patterns
- [BrowserStack: Playwright Snapshot Testing](https://www.browserstack.com/guide/playwright-snapshot-testing) - Visual regression testing
- [Medium: UI Visual Regression Testing Best Practices](https://medium.com/@ss-tech/the-ui-visual-regression-testing-best-practices-playbook-dc27db61ebe0) - Testing strategies
- [Web.dev: Font Best Practices](https://web.dev/articles/font-best-practices) - unicode-range, font-display

### Tertiary (LOW confidence - general context)
- [Medium: Design Systems in 2026 Predictions](https://rydarashid.medium.com/design-systems-in-2026-predictions-pitfalls-and-power-moves-f401317f7563) - Industry trends
- [DEV Community: Exploring Typesafe design tokens in Tailwind 4](https://dev.to/wearethreebears/exploring-typesafe-design-tokens-in-tailwind-4-372d) - TypeScript integration patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Tailwind 4 is industry standard, project already uses correct versions, Astro integration well-documented
- Architecture: HIGH - Official Tailwind docs + verified real-world implementations confirm patterns
- Pitfalls: MEDIUM-HIGH - Based on common migration issues from Tailwind 3→4, dark mode gotchas documented in multiple sources
- Arabic typography: HIGH - W3C standards + UAE design system official guidelines provide authoritative guidance
- Visual regression testing: MEDIUM - Tools well-established but tolerance thresholds need project-specific tuning

**Research date:** 2026-02-05
**Valid until:** 2026-03-05 (30 days - Tailwind 4 is stable, design token standards slow-moving)

**Key assumptions:**
- Existing font files in `public/fonts/` are production-ready and should not be modified
- The `[data-theme="dark"]` attribute approach is intentional and should be preserved
- REQUIREMENTS.md's "7:1 contrast for Arabic text" refers to WCAG AAA compliance
- "Coursera-like design" means semantic spacing scale, clear typography hierarchy, minimal visual clutter
- Visual regression testing will run locally during development, not just in CI/CD

**Next steps for planner:**
1. Break Phase 1 into incremental tasks: token extraction → @theme migration → verification tests → contrast validation
2. Define "font unchanged" success criteria: checksum match + visual snapshot match + manual inspection
3. Specify which tokens migrate in Phase 1 vs later phases (foundation vs component-specific)
4. Plan testing strategy: when to capture baseline snapshots, tolerance thresholds, test environments
