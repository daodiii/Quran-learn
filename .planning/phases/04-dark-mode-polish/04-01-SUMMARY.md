---
phase: 04-dark-mode-polish
plan: 01
subsystem: testing
tags: [accessibility, wcag, axe-core, playwright, dark-mode, contrast, a11y]

# Dependency graph
requires:
  - phase: 03-card-components-arabic-typography
    provides: Card components and test pages for accessibility validation
  - phase: 02-progress-primitive-components
    provides: Primitive components (Badge, Button, etc.) requiring contrast validation
  - phase: 01-design-foundation
    provides: Design tokens and dark mode implementation
provides:
  - Automated WCAG AAA accessibility testing infrastructure
  - axe-core integration for contrast validation
  - WCAG AAA compliant dark mode colors
  - Accessible component color system
affects: [05-lesson-cards-navigation, 06-progress-tracking, 07-mobile-native-polish, 08-accessibility-final]

# Tech tracking
tech-stack:
  added: ["@axe-core/playwright@4.11.1"]
  patterns:
    - "Automated accessibility testing with axe-core"
    - "WCAG AAA color contrast validation"
    - "Design token-based color system for theme accessibility"

key-files:
  created:
    - tests/accessibility.spec.ts
  modified:
    - package.json
    - src/styles/global.css
    - src/components/AuthButton.astro
    - src/layouts/SurahLayout.astro
    - tests/cards.spec.ts-snapshots/cards-dark-mode-chromium-darwin.png

key-decisions:
  - "WCAG AAA (7:1 contrast ratio) chosen over AA (4.5:1) for superior accessibility"
  - "Design tokens used throughout for theme-aware colors instead of Tailwind utilities"
  - "Automated testing prevents contrast regressions in future CSS changes"
  - "Dark mode text-tertiary adjusted to #b3b3b3 for 7:1 ratio on tertiary backgrounds"
  - "Light mode accent colors darkened for sufficient contrast with light backgrounds"

patterns-established:
  - "axe-core AxeBuilder integration with Playwright for automated a11y testing"
  - "Test structure: WCAG tag-based tests + specific color-contrast rule tests"
  - "Helper function pattern (enableDarkMode) for theme testing"
  - "Replace Tailwind utility classes with CSS custom properties for accessible theming"

# Metrics
duration: 26min
completed: 2026-02-06
---

# Phase 04 Plan 01: Accessibility Testing Infrastructure Summary

**Automated WCAG AAA contrast testing with axe-core, achieving 7:1 contrast ratios across all components in both light and dark modes**

## Performance

- **Duration:** 26 min
- **Started:** 2026-02-06T00:24:20Z
- **Completed:** 2026-02-06T00:50:22Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments
- Installed and configured @axe-core/playwright for automated accessibility testing
- Created comprehensive accessibility test suite with 16 tests covering WCAG AAA compliance
- Fixed all WCAG AAA contrast violations in dark and light modes
- Established automated testing infrastructure to prevent future accessibility regressions

## Task Commits

Each task was committed atomically:

1. **Task 1: Install axe-core and create accessibility test file** - `9b026ae` (test)
2. **Task 2: Run accessibility tests and validate existing dark mode contrast** - `154776a` (fix)
3. **Task 3: Add component-level contrast tests and edge cases** - `019f7fa` (test)
4. **Visual regression baseline update** - `fd4ea7c` (test)

## Files Created/Modified
- `tests/accessibility.spec.ts` - Comprehensive WCAG AAA accessibility test suite (16 tests)
- `package.json` - Added @axe-core/playwright dependency and test:a11y script
- `src/styles/global.css` - Adjusted dark and light mode colors for WCAG AAA compliance
- `src/components/AuthButton.astro` - Fixed button text to use --text-inverse design token
- `src/layouts/SurahLayout.astro` - Replaced Tailwind classes with design tokens, added prose styles
- `tests/cards.spec.ts-snapshots/cards-dark-mode-chromium-darwin.png` - Updated visual baseline

## Decisions Made

**Color adjustments for WCAG AAA (7:1 ratio):**
- Dark mode `--accent-primary`: #5EEAD4 (lighter teal for better contrast)
- Dark mode `--accent-secondary`: #93C5FD (lighter blue)
- Dark mode `--accent-gold`: #FDE68A (lighter gold)
- Dark mode `--accent-coral`: #FCA5A5 (lighter coral)
- Dark mode `--text-tertiary`: #b3b3b3 (from #a3a3a3 for 7:1 on tertiary bg)
- Light mode `--accent-primary`: #084B4D (darker teal)
- Light mode `--accent-gold`: #5C4A0F (darker gold)
- Light mode level badge colors darkened for 7:1 ratio

**Design token migration:**
- Breadcrumb links use inline styles with CSS variables instead of Tailwind classes
- Surah page badges use design tokens (--text-tertiary, --bg-tertiary)
- Prose content styles use design tokens for headings, links, paragraphs
- AuthButton uses --text-inverse for theme-aware text color

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed WCAG AAA contrast violations in Badge components**
- **Found during:** Task 2 (Running accessibility tests)
- **Issue:** Badge variants (success, info, warning, error) had insufficient contrast ratios (4.81:1 to 5.82:1, needed 7:1)
- **Fix:** Adjusted dark mode accent colors to lighter values (#5EEAD4, #93C5FD, #FDE68A, #FCA5A5)
- **Files modified:** src/styles/global.css
- **Verification:** All badge tests pass with axe-core
- **Committed in:** 154776a (Task 2 commit)

**2. [Rule 1 - Bug] Fixed light mode button and badge contrast**
- **Found during:** Task 2 (Running light mode tests)
- **Issue:** Light mode AuthButton (#ffffff on #0d7377 = 5.62:1) and badges failed WCAG AAA
- **Fix:** Darkened light mode accent-primary to #084B4D, accent-gold to #5C4A0F, adjusted level colors
- **Files modified:** src/styles/global.css
- **Verification:** Light mode tests pass
- **Committed in:** 154776a (Task 2 commit)

**3. [Rule 1 - Bug] Fixed Surah page breadcrumb and content contrast**
- **Found during:** Task 2 (Quran page accessibility test)
- **Issue:** Tailwind utility classes (text-gray-500, text-primary-600) didn't respect dark mode and failed contrast
- **Fix:** Replaced Tailwind classes with design tokens (--text-tertiary, --accent-primary) in SurahLayout
- **Files modified:** src/layouts/SurahLayout.astro
- **Verification:** Quran page test passes in both modes
- **Committed in:** 154776a (Task 2 commit)

**4. [Rule 1 - Bug] Fixed AuthButton text color for theme switching**
- **Found during:** Task 2 (Button contrast validation)
- **Issue:** Button used hardcoded `color: white` and dark mode override, not theme-aware
- **Fix:** Changed to `color: var(--text-inverse)` which adapts to theme (white in light, dark in dark)
- **Files modified:** src/components/AuthButton.astro
- **Verification:** Button passes contrast in both modes
- **Committed in:** 154776a (Task 2 commit)

**5. [Rule 1 - Bug] Fixed tertiary text on tertiary background contrast**
- **Found during:** Task 2 (Final Quran page test)
- **Issue:** --text-tertiary (#a3a3a3) on --bg-tertiary (#1f1f1f) = 6.53:1 (just below 7:1)
- **Fix:** Lightened --text-tertiary to #b3b3b3 for 7:1+ ratio
- **Files modified:** src/styles/global.css
- **Verification:** All tertiary text tests pass
- **Committed in:** 154776a (Task 2 commit)

---

**Total deviations:** 5 auto-fixed (5 Rule 1 bugs)
**Impact on plan:** All auto-fixes were necessary to achieve WCAG AAA compliance. Color adjustments were inevitable when implementing 7:1 contrast requirement. No scope creep - all changes directly support the plan's must-have of "All existing pages pass WCAG AAA contrast validation in dark mode".

## Issues Encountered

**Visual regression baseline update needed:**
- Color changes caused visual regression test to fail (expected)
- Updated snapshot with `--update-snapshots` flag
- New baseline captures WCAG AAA compliant colors
- All 39 tests now pass (16 accessibility + 20 cards + 3 font)

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for subsequent plans:**
- Automated accessibility testing infrastructure in place
- All existing components and pages WCAG AAA compliant
- Future CSS changes will be validated automatically via test:a11y script
- Color system fully documented in global.css with WCAG AAA annotations

**Foundation established:**
- 16 automated accessibility tests prevent regressions
- Design token system proven effective for theme accessibility
- Pattern established for replacing Tailwind utilities with theme-aware tokens

**No blockers for Phase 4 Plan 2 (Dark Mode Visual Polish)**

---
*Phase: 04-dark-mode-polish*
*Completed: 2026-02-06*
