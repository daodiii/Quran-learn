# Phase 8: Performance & Accessibility - Research

**Researched:** 2026-02-06
**Domain:** Web Performance Optimization, Accessibility (WCAG AAA), Screen Reader Compatibility, Mobile App Performance
**Confidence:** HIGH

## Summary

Phase 8 focuses on final polish to achieve production-ready performance and comprehensive accessibility. Research reveals that the project is already well-positioned with WCAG AAA contrast compliance, axe-core testing infrastructure, and mobile optimization from Phase 7. The primary areas requiring attention are: (1) font loading optimization to eliminate FOIT, (2) ARIA live regions for progress announcements, (3) keyboard navigation completeness, (4) Capacitor launch time optimization, and (5) production build verification for Lighthouse scores.

Key findings indicate that Astro's built-in optimizations handle most performance concerns automatically, fonts already use `font-display: swap`, and the 50KB JavaScript bundle target is highly achievable given current build size of ~4.4KB. The main gap is implementing ARIA live regions for screen reader progress announcements and conducting comprehensive screen reader testing with NVDA/JAWS.

**Primary recommendation:** Leverage existing infrastructure. Add font preloading for critical fonts, implement ARIA live regions using `aria-live="polite"` with `role="status"`, verify keyboard navigation completeness, optimize Capacitor splash screen behavior, and run production Lighthouse audits to confirm 90+ scores.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @axe-core/playwright | 4.11.1 | Automated accessibility testing | Industry-standard accessibility engine by Deque Systems, already integrated in Phase 4 |
| @playwright/test | 1.58.1 | End-to-end testing with a11y | Best-in-class browser automation with full ARIA support |
| Lighthouse CLI | Latest | Performance and accessibility auditing | Google's official performance measurement tool, industry standard |
| rollup-plugin-visualizer | Latest | Bundle size analysis | Recommended by Astro docs for visualizing bundle composition |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| NVDA | Latest | Windows screen reader testing | Required for comprehensive screen reader testing (free, widely used) |
| JAWS | Latest | Windows screen reader testing | Professional screen reader, tests enterprise accessibility |
| @capacitor/splash-screen | 8.0.0 | Mobile app splash screen control | Already installed, needed for launch time optimization |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| axe-core | Pa11y, Wave | axe-core has deepest WCAG coverage and best Playwright integration |
| Lighthouse CLI | WebPageTest, GTmetrix | Lighthouse is official Google tool, directly measures Core Web Vitals |
| rollup-plugin-visualizer | webpack-bundle-analyzer | Astro uses Vite/Rollup, not webpack |

**Installation:**
```bash
# Bundle analyzer (only tool not yet installed)
npm install --save-dev rollup-plugin-visualizer
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── scripts/
│   ├── navigation.ts          # Already has keyboard nav logic
│   ├── progress-announcer.ts  # NEW: ARIA live region management
│   └── capacitor-init.ts      # Stub - needs splash screen control
├── components/
│   └── AriaLiveRegion.astro   # NEW: Reusable live region component
└── layouts/
    └── BaseLayout.astro       # Add font preload links
```

### Pattern 1: Font Preloading with font-display: swap
**What:** Preload critical fonts to avoid render-blocking while using swap to show fallback text immediately
**When to use:** For above-the-fold fonts (Amiri for body text, UthmanicHafs for Quranic text)
**Example:**
```html
<!-- Source: https://web.dev/articles/font-best-practices -->
<head>
  <!-- Preload critical fonts only (1-2 files max) -->
  <link
    rel="preload"
    href="/fonts/amiri-regular-arabic.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />
  <link
    rel="preload"
    href="/fonts/UthmanicHafs.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />
</head>
```

**Note:** fonts.css already uses `font-display: swap` for all fonts (verified in src/styles/fonts.css lines 28, 39, 49, 59, 69, 79, 89, 99, 109). This eliminates FOIT by showing fallback text immediately.

### Pattern 2: ARIA Live Regions for Progress Announcements
**What:** Use `aria-live="polite"` with `role="status"` for maximum screen reader compatibility
**When to use:** When progress state changes (lesson completion, quiz score, level progress)
**Example:**
```typescript
// Source: https://adrianroselli.com/2026/01/live-region-support.html
// Best practice: aria-live="polite" with role="status"

// Component: AriaLiveRegion.astro
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  class="sr-only"
  data-announcer
>
  {/* Announcements inserted here via JavaScript */}
</div>

// Usage in progress-announcer.ts
function announceProgress(message: string) {
  const announcer = document.querySelector('[data-announcer]');
  if (announcer) {
    announcer.textContent = message;
    // Clear after announcement to allow re-announcement
    setTimeout(() => announcer.textContent = '', 1000);
  }
}

// Examples:
announceProgress('Lesson 3 completed. 5 of 15 lessons finished.');
announceProgress('Quiz passed with 80%. Level 1 progress: 60%.');
```

**IMPORTANT:** Avoid `aria-live="assertive"` - JAWS converts all live regions to polite behavior, making assertive unreliable (source: Adrian Roselli live region testing, January 2026).

### Pattern 3: Keyboard Navigation Focus Management
**What:** Ensure all interactive elements are keyboard accessible with visible focus indicators
**When to use:** For all buttons, links, form controls, custom widgets (sidebar, quiz navigation)
**Example:**
```css
/* Source: https://www.w3.org/WAI/WCAG22/Techniques/css/C45 */
/* Use :focus-visible for keyboard-only focus indicators */

/* WCAG 2.4.7: Focus must be visible with 3:1 contrast */
button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--color-accent-primary);
  outline-offset: 2px;
}

/* Ensure focus trap in modal/sidebar */
.sidebar[aria-hidden="false"] {
  /* Focus trap already implemented in navigation.ts */
}
```

**Verification checklist:**
- [ ] Tab order matches visual order (WCAG 2.4.3)
- [ ] No keyboard traps except modals with Escape exit (WCAG 2.1.2)
- [ ] All interactive elements reachable via keyboard
- [ ] Focus indicators have 3:1 contrast ratio (WCAG 2.4.7)
- [ ] Skip links present for main content navigation

### Pattern 4: Capacitor Launch Time Optimization
**What:** Control splash screen visibility and optimize initial bundle for sub-2-second launch
**When to use:** Mobile app initialization (iOS/Android)
**Example:**
```typescript
// Source: https://capacitorjs.com/docs/apis/splash-screen
// In capacitor-init.ts (currently a stub)

import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';

export async function initCapacitor() {
  if (!Capacitor.isNativePlatform()) return;

  // Keep splash screen visible during critical initialization
  await SplashScreen.show({
    autoHide: false,
  });

  // Perform critical initialization
  // - Load localStorage progress data
  // - Initialize theme preference
  // - Preload critical fonts (already in HTML)

  // Hide splash screen when app is ready
  await SplashScreen.hide({
    fadeOutDuration: 300,
  });
}

// Call in BaseLayout after DOM ready
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initCapacitor();
  });
}
```

**Performance targets:**
- iOS: < 2 seconds from tap to interactive
- Android: < 3 seconds (acceptable on mid-range devices)
- Key: Minimize blocking JavaScript, use code splitting

### Anti-Patterns to Avoid

- **Anti-pattern: Using font-display: block** - Creates FOIT. Current code correctly uses `swap` (verified in fonts.css).
- **Anti-pattern: Preloading all fonts** - Degrades performance. Preload max 1-2 critical fonts only.
- **Anti-pattern: Using aria-live="assertive"** - Unreliable across screen readers. Use `polite` instead.
- **Anti-pattern: Removing :focus outline without replacement** - WCAG 2.4.7 violation. Always provide visible indicator.
- **Anti-pattern: Large third-party dependencies** - Check Bundlephobia before adding. A date library can add 50KB+.
- **Anti-pattern: Assuming Lighthouse 100 = fully accessible** - Lighthouse only catches ~30-40% of issues. Manual testing required.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Bundle size analysis | Custom webpack stats parser | rollup-plugin-visualizer | Official Astro recommendation, handles Vite/Rollup bundles |
| Accessibility testing | Custom DOM traversal | axe-core (already installed) | Covers WCAG 2.1 Level A/AA/AAA, industry-vetted rules |
| Screen reader announcements | Custom polling logic | ARIA live regions | Native browser support, tested across all screen readers |
| Font loading strategy | Custom JavaScript loader | font-display CSS + preload | Native browser optimization, no JavaScript overhead |
| Keyboard focus trap | Custom Tab key handler | navigation.ts focus trap (existing) | Already handles edge cases (first/last element cycling) |
| Performance metrics | Custom timing API | Lighthouse CLI | Measures real Core Web Vitals, industry standard |

**Key insight:** Modern browsers provide robust APIs for font loading (font-display), accessibility (ARIA), and performance monitoring (Core Web Vitals). Custom solutions introduce bugs and maintenance burden.

## Common Pitfalls

### Pitfall 1: Lighthouse 100 Doesn't Mean Accessible
**What goes wrong:** Team celebrates Lighthouse 100 and ships, but keyboard navigation is broken and screen readers can't navigate
**Why it happens:** Lighthouse automated tests only catch ~30-40% of accessibility issues. Keyboard-only testing and screen reader testing are manual processes that automated tools cannot verify.
**How to avoid:** Use Lighthouse as baseline, then manually test:
- Complete keyboard-only navigation session (no mouse)
- NVDA screen reader test (Windows, free)
- JAWS screen reader test (Windows, professional)
- VoiceOver test (macOS/iOS, built-in)
**Warning signs:** "We have Lighthouse 100, so we're accessible" statements in team discussions

### Pitfall 2: Font Preloading Too Many Fonts
**What goes wrong:** Team preloads all 9 font variants (Amiri regular/bold/italic, UthmanicHafs), degrading performance instead of improving it
**Why it happens:** Misunderstanding that preload makes fonts load faster. Actually, it shifts priority - too many preloads delay initial render.
**How to avoid:**
- Preload max 1-2 fonts used above the fold
- For this project: Amiri Regular Arabic (body text) and UthmanicHafs (Quranic text on homepage hero)
- Let other variants load on-demand via font-display: swap
**Warning signs:** Lighthouse flags "Preload key requests" but LCP/FCP scores get worse

### Pitfall 3: Dev Server Lighthouse Scores Are Misleading
**What goes wrong:** Lighthouse scores are 76/100 on dev server, team spends hours optimizing, but production build would already score 95+
**Why it happens:** Dev server includes HMR (Hot Module Replacement), source maps, and Astro dev toolbar - all blocking JavaScript not present in production
**How to avoid:**
- Run Lighthouse against production build: `npm run build && npm run preview`
- Phase 7 documented this: TBT (Total Blocking Time) of 1,110-1,480ms on dev server is expected
- Only optimize after measuring production build
**Warning signs:** Lighthouse mobile scores from 07-04-PLAN.md show 76/73 - these are dev server scores

### Pitfall 4: ARIA Live Regions Announce Too Frequently
**What goes wrong:** Every progress bar animation frame announces "Progress: 42%... 43%... 44%..." flooding screen readers
**Why it happens:** ARIA live regions are placed on animated elements instead of state change events
**How to avoid:**
- Only announce on discrete state changes (lesson completed, quiz submitted)
- Use `aria-live="polite"` so announcements don't interrupt current reading
- Clear announcement text after 1 second to allow re-announcement of same message
**Warning signs:** Screen reader users report "too much noise" or "can't focus on content"

### Pitfall 5: RTL Mode Breaks Keyboard Navigation
**What goes wrong:** Arrow key navigation works in LTR but breaks in RTL - left arrow expands instead of collapses
**Why it happens:** Navigation logic hardcodes left/right instead of checking text direction
**How to avoid:**
- Already handled in navigation.ts (Phase 5) - uses `dir` attribute detection
- When adding keyboard shortcuts, always check `document.dir` or element `dir` attribute
- Test thoroughly in RTL mode with Arabic UI language
**Warning signs:** Keyboard navigation tests fail only when dir="rtl" is set

### Pitfall 6: Capacitor Mobile App Loads Slowly Despite Good Lighthouse Scores
**What goes wrong:** Web version scores 95+ on Lighthouse, but Capacitor app takes 5+ seconds to launch
**Why it happens:** Splash screen hides immediately, showing blank WebView while fonts/assets load
**How to avoid:**
- Manually control splash screen with SplashScreen.show({ autoHide: false })
- Hide splash screen only after critical assets loaded (fonts, localStorage data)
- Target: < 2s iOS, < 3s Android
**Warning signs:** User reports "white screen after splash" or "app freezes on startup"

## Code Examples

Verified patterns from official sources:

### Font Preloading Pattern
```astro
---
// Source: https://web.dev/articles/font-best-practices
// BaseLayout.astro - Add to <head>
---
<head>
  <!-- Preload ONLY critical fonts (1-2 max) -->
  <!-- MUST include crossorigin even for same-origin fonts -->
  <link
    rel="preload"
    href="/fonts/amiri-regular-arabic.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />
  <link
    rel="preload"
    href="/fonts/UthmanicHafs.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />

  <!-- Existing font stylesheet -->
  <link rel="stylesheet" href="/styles/fonts.css" />
</head>
```

### ARIA Live Region Component
```astro
---
// Source: https://adrianroselli.com/2026/01/live-region-support.html
// components/AriaLiveRegion.astro
---
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  class="sr-only"
  data-progress-announcer
>
  <!-- Screen reader announcements inserted here -->
</div>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
```

### Progress Announcement Script
```typescript
// Source: https://www.w3.org/WAI/GL/wiki/Using_ARIA_role=alert_or_Live_Regions_to_Identify_Errors
// src/scripts/progress-announcer.ts

/**
 * Announce progress changes to screen readers
 * Uses ARIA live region pattern for NVDA/JAWS compatibility
 */
export function announceProgress(message: string): void {
  const announcer = document.querySelector('[data-progress-announcer]');
  if (!announcer) {
    console.warn('ARIA live region not found');
    return;
  }

  // Set announcement text
  announcer.textContent = message;

  // Clear after 1 second to allow re-announcement of same message
  setTimeout(() => {
    announcer.textContent = '';
  }, 1000);
}

// Usage examples:
// announceProgress('Lesson 3 completed. 5 of 15 lessons finished.');
// announceProgress('Quiz passed with 80%. Level 1 progress: 60%.');
// announceProgress('All Level 1 lessons complete. Level 2 unlocked.');
```

### Bundle Size Analysis Configuration
```javascript
// Source: https://docs.astro.build/en/recipes/analyze-bundle-size/
// astro.config.mjs

import { defineConfig } from 'astro/config';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  vite: {
    plugins: [
      visualizer({
        emitFile: true,
        filename: 'stats.html',
      })
    ]
  }
});

// After running `npm run build`, view dist/stats.html
// Interactive sunburst chart shows bundle composition
```

### Capacitor Splash Screen Control
```typescript
// Source: https://capacitorjs.com/docs/apis/splash-screen
// src/scripts/capacitor-init.ts (replace stub)

import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';

export async function initCapacitor(): Promise<void> {
  // Only run on native platforms
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  // Keep splash screen visible during initialization
  await SplashScreen.show({
    autoHide: false,
  });

  try {
    // Critical initialization tasks
    // 1. Fonts already preloaded via <link rel="preload">
    // 2. Load progress data from localStorage
    const progress = localStorage.getItem('lesson-progress');

    // 3. Initialize theme preference
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);

    // 4. Wait for fonts to load (FOUT acceptable with font-display: swap)
    await document.fonts.ready;

    // Hide splash screen with smooth transition
    await SplashScreen.hide({
      fadeOutDuration: 300, // 300ms fade out
    });
  } catch (error) {
    console.error('Capacitor initialization error:', error);
    // Hide splash screen even on error to prevent user stuck on splash
    await SplashScreen.hide();
  }
}

// Initialize on app load
if (typeof window !== 'undefined' && Capacitor.isNativePlatform()) {
  document.addEventListener('DOMContentLoaded', initCapacitor);
}
```

### Keyboard Navigation Focus Trap (Already Implemented)
```typescript
// Source: Existing src/scripts/navigation.ts (Phase 5)
// Pattern reference for other focus trap implementations

function setupFocusTrap(container: HTMLElement): () => void {
  const focusableSelector =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  function handleKeydown(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return;

    const focusableElements = Array.from(
      container.querySelectorAll(focusableSelector)
    ) as HTMLElement[];

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Shift + Tab on first element -> focus last
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    }
    // Tab on last element -> focus first
    else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  container.addEventListener('keydown', handleKeydown);

  // Return cleanup function
  return () => container.removeEventListener('keydown', handleKeydown);
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| font-display: block (FOIT) | font-display: swap (FOUT) | 2018-2019 | Text visible immediately, better UX than blank screen |
| Preload all fonts | Preload 1-2 critical fonts | 2020-2021 | Prevents network congestion, faster initial render |
| aria-live="assertive" everywhere | aria-live="polite" default | 2024-2026 | Screen reader testing revealed JAWS treats all as polite anyway |
| :focus only | :focus-visible pseudo-class | 2020+ | Keyboard-only focus indicators, better mouse UX |
| Lighthouse 5.x | Lighthouse 10+ (Core Web Vitals) | 2023+ | FCP, LCP, TBT, CLS are official metrics, align with field data |
| WCAG 2.0 | WCAG 2.1 (mobile-focused) | 2018 | Adds mobile touch targets, orientation, pointer gestures |
| Bundle size ignored | 50KB budget for mobile | 2024+ | 3G network still common globally, performance = accessibility |

**Deprecated/outdated:**
- **font-display: auto** - Browser decides, unpredictable. Use `swap` or `optional` explicitly.
- **outline: none without replacement** - WCAG violation since 2.1 (2018). Use `:focus-visible` with custom outline.
- **aria-live on animated elements** - Announces too frequently. Use discrete state changes only.
- **Capacitor autoHide: true (default)** - Causes white screen. Manually control splash screen.

## Open Questions

Things that couldn't be fully resolved:

1. **iOS Device Testing Timeline**
   - What we know: Phase 7 (07-04-PLAN.md) documents that iOS device testing was skipped per user choice
   - What's unclear: Whether Phase 8 should include this as a blocking requirement or remain deferred
   - Recommendation: Document as optional verification step. Lighthouse scores and iOS simulator testing cover most cases. Real device testing recommended before production but not blocking for Phase 8 completion.

2. **Optimal Bundle Size Target**
   - What we know: Success criteria states "under 50KB" for JavaScript bundle. Current build is ~4.4KB (single file in dist/_astro/)
   - What's unclear: Whether target includes all JavaScript (including third-party if any) or just application code
   - Recommendation: Measure total JavaScript payload using rollup-plugin-visualizer. Current size (4.4KB) is well under target. Focus on preventing regression (no large dependencies like moment.js, lodash).

3. **Production Lighthouse Score Baseline**
   - What we know: Phase 7 documented dev server scores (76/100 homepage, 73/100 quiz). Production scores expected to be 90+.
   - What's unclear: Exact production scores since no production Lighthouse audit has been run
   - Recommendation: First task in Phase 8 should be production build + Lighthouse audit to establish baseline. If already 90+, optimization is complete. If below 90, identify specific bottlenecks.

4. **Screen Reader Testing Coverage**
   - What we know: Success criteria requires NVDA/JAWS testing. Adrian Roselli's research shows significant differences between screen readers.
   - What's unclear: Whether testing should cover all major screen readers (NVDA, JAWS, VoiceOver, Narrator) or focus on NVDA + JAWS only
   - Recommendation: Test with NVDA (free, Windows) and VoiceOver (free, macOS/iOS). JAWS testing optional (commercial license). Narrator (Windows) has lower market share. Focus on NVDA + VoiceOver for comprehensive coverage.

5. **RTL Mode Screen Reader Announcements**
   - What we know: Success criteria states "RTL mode screen reader announcements work correctly"
   - What's unclear: Specific verification criteria - what constitutes "correct" announcements in RTL?
   - Recommendation: Verify that (1) ARIA live regions announce in RTL mode, (2) reading order follows visual RTL layout, (3) navigation commands (previous/next) map correctly to RTL direction. Use VoiceOver on macOS with Arabic language setting for testing.

## Sources

### Primary (HIGH confidence)
- [Astro Fonts Documentation](https://docs.astro.build/en/guides/fonts/) - Official Astro font optimization guide
- [Astro Bundle Size Analysis Recipe](https://docs.astro.build/en/recipes/analyze-bundle-size/) - Official rollup-plugin-visualizer integration
- [Adrian Roselli - Live Region Support (January 2026)](https://adrianroselli.com/2026/01/live-region-support.html) - Recent screen reader testing of ARIA live regions with NVDA/JAWS
- [web.dev - Font Best Practices](https://web.dev/articles/font-best-practices) - Google's official font loading optimization guide
- [web.dev - Preload Fonts](https://web.dev/articles/preload-critical-assets) - Official preload strategy documentation
- [Capacitor Splash Screen API](https://capacitorjs.com/docs/apis/splash-screen) - Official Capacitor documentation
- [W3C WCAG 2.1.2 - No Keyboard Trap](https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html) - Official WCAG understanding document
- [W3C C45 Technique - :focus-visible](https://www.w3.org/WAI/WCAG22/Techniques/css/C45) - Official CSS technique for focus indicators
- [W3C - Using ARIA role=alert or Live Regions](https://www.w3.org/WAI/GL/wiki/Using_ARIA_role=alert_or_Live_Regions_to_Identify_Errors) - Official ARIA pattern
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing) - Official Playwright + axe-core integration docs
- [Chrome for Developers - Lighthouse Accessibility Scoring](https://developer.chrome.com/docs/lighthouse/accessibility/scoring) - Official Lighthouse methodology

### Secondary (MEDIUM confidence)
- [Complete Guide to Astro Performance Optimization (December 2025)](https://eastondev.com/blog/en/posts/dev/20251202-astro-performance-optimization/) - Recent comprehensive guide, 8 practical tips
- [DebugBear - Preload Web Fonts](https://www.debugbear.com/blog/preload-web-fonts) - Detailed performance impact analysis with metrics
- [Talent500 - Optimizing Web Fonts: FOIT vs FOUT](https://talent500.com/blog/optimizing-fonts-foit-fout-font-display-strategies/) - Comprehensive font-display comparison
- [TheLinuxCode - CSS @font-face Production Guide (2026)](https://thelinuxcode.com/css-font-face-rule-a-practical-production-ready-guide-2026/) - Recent production best practices
- [UXPin - NVDA vs JAWS Comparison](https://www.uxpin.com/studio/blog/nvda-vs-jaws-screen-reader-testing-comparison/) - Screen reader testing strategy
- [Sarthak Mishra - Optimizing Astro Bundle Size (2026)](https://sarthakmishra.com/blog/optimizing-astro-bundle-size) - Recent practical optimization case study
- [NexT Native - Improve Mobile App Performance in Capacitor](https://nextnative.dev/blog/improve-mobile-app-performance) - Capacitor-specific optimization guide
- [WCAG Dock - 2.4.7 Focus Visible](https://wcag.dock.codes/documentation/wcag247/) - Practical WCAG implementation guide
- [Accessibility Test - RTL Website Accessibility](https://accessibility-test.org/blog/support/rtl-right-to-left-website-accessibility-considerations/) - RTL-specific accessibility patterns

### Tertiary (LOW confidence)
- [Medium - Arabic RTL Support in Web Apps](https://medium.com/@sanjeevanibhandari3/how-to-add-rtl-right-to-left-support-to-your-website-for-arabic-users-ae4f94b1190e) - Community guide, not officially vetted
- WebSearch results on Capacitor launch time optimization (no 2026-specific benchmarks found, generic optimization advice)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All tools already installed except bundle visualizer, official Astro/Playwright documentation verified
- Architecture patterns: HIGH - Font preloading, ARIA live regions, and keyboard navigation patterns verified against W3C/web.dev sources
- Pitfalls: HIGH - Based on official documentation warnings and Adrian Roselli's January 2026 testing
- Capacitor optimization: MEDIUM - Official API docs verified, but performance targets (2s iOS) based on community reports not official benchmarks
- RTL screen reader behavior: MEDIUM - General patterns verified, but Arabic-specific testing not documented in sources

**Research date:** 2026-02-06
**Valid until:** 2026-03-06 (30 days - stable domain, no fast-moving changes expected)
