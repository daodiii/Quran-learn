---
phase: 03-card-components-arabic-typography
plan: 02
subsystem: testing
tags: [playwright, visual-regression, accessibility, arabic-typography, responsive-design]

# Dependency graph
requires:
  - phase: 03-01
    provides: Five card components with Arabic typography support
  - phase: 02-03
    provides: Component testing patterns and Playwright configuration
provides:
  - Comprehensive test page showcasing all 5 card components
  - 20 Playwright tests covering responsive layout, Arabic text, progress, dark mode, accessibility
  - Visual regression baselines for card components
  - data-testid attribute passthrough in all card components
affects: [04-navigation, testing, accessibility-audit]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Card component data-testid passthrough via rest spread
    - Astro dev toolbar h1 conflict handling with .first() selector
    - Visual regression testing at multiple viewports (1200px, 700px, 400px, 320px)

key-files:
  created:
    - src/pages/test/cards.astro
    - tests/cards.spec.ts
    - tests/cards.spec.ts-snapshots/card-grid-section-1200px-chromium-darwin.png
    - tests/cards.spec.ts-snapshots/lesson-card-section-arabic-chromium-darwin.png
    - tests/cards.spec.ts-snapshots/cards-dark-mode-chromium-darwin.png
  modified:
    - src/components/primitives/Card.astro
    - src/components/cards/CourseCard.astro
    - src/components/cards/LessonCard.astro
    - src/components/cards/SurahCard.astro
    - src/components/cards/ResourceCard.astro

key-decisions:
  - "data-testid attributes pass through card components via rest spread operator"
  - "Test page includes 20+ data-testid attributes for precise Playwright targeting"
  - "Arabic text overflow testing validates overflow-wrap: break-word at 320px viewport"
  - "Visual regression uses 100 maxDiffPixels tolerance for anti-aliasing variance"
  - "Accessibility tests verify keyboard focus, ARIA roles, and external link indicators"

patterns-established:
  - "Card test page pattern: 5 sections with responsive grids and various states"
  - "Playwright test structure: 6 describe blocks (responsive, arabic, progress, dark, visual, a11y)"
  - "Astro dev toolbar workaround: use .first() on ambiguous selectors like h1"

# Metrics
duration: 14min
completed: 2026-02-06
---

# Phase 03 Plan 02: Card Component Testing Summary

**Playwright test suite with 20 passing tests validating responsive grids, Arabic text wrapping, progress integration, dark mode styling, and accessibility across all 5 card components**

## Performance

- **Duration:** 14 min
- **Started:** 2026-02-05T23:47:20Z
- **Completed:** 2026-02-06T00:01:38Z
- **Tasks:** 3
- **Files modified:** 11

## Accomplishments
- Created comprehensive test page at /test/cards with all 5 card component types
- Built 20 Playwright tests covering 6 critical areas: responsive layout, Arabic typography, progress integration, dark mode, visual regression, accessibility
- Captured 3 visual regression baselines (card grid at 1200px, lesson section with Arabic text, full dark mode page)
- Fixed blocking issue: added data-testid passthrough to all card components for precise test targeting
- All tests pass green with proper Arabic text wrapping validation at narrow viewports (320px)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create card components test page** - `0f2b003` (feat)
2. **Task 2: Create Playwright tests for cards** - `0387e2a` (test)
3. **Task 3: Run tests and capture baselines** - `7ea5b8b` (test)

**Deviation fix:** `9e3a1c4` (fix: data-testid passthrough support)

## Files Created/Modified
- `src/pages/test/cards.astro` - Test page with 5 sections showcasing all card variants
- `tests/cards.spec.ts` - 20 Playwright tests across 6 describe blocks
- `tests/cards.spec.ts-snapshots/` - 3 visual regression baseline images
- `src/components/primitives/Card.astro` - Added rest spread for arbitrary HTML attributes
- `src/components/cards/*.astro` - All 5 card components pass through data-testid

## Decisions Made

**1. data-testid passthrough via rest spread**
- Card primitive accepts arbitrary HTML attributes via `...rest`
- All specialized card components (Course, Lesson, Surah, Resource) propagate attributes
- Enables test targeting without breaking component encapsulation

**2. Astro dev toolbar conflict handling**
- Dev toolbar injects multiple h1 elements causing strict mode violations
- Solution: use `.first()` selector on ambiguous elements in tests
- Alternative considered: disable dev toolbar, rejected (useful during development)

**3. Arabic text overflow testing at 320px**
- Narrowest realistic mobile viewport (iPhone SE)
- Validates overflow-wrap: break-word prevents mid-word breaks
- Confirms no horizontal scroll on Arabic text elements

**4. Visual regression tolerance**
- 100 maxDiffPixels tolerance for full page snapshots (consistent with Phase 2 pattern)
- Accounts for font anti-aliasing variance across environments
- Lower tolerance (50 pixels) for section-specific snapshots

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added data-testid passthrough to card components**
- **Found during:** Task 3 (Running Playwright tests)
- **Issue:** Card components didn't accept or propagate data-testid attributes, causing all card-level tests to fail with "element(s) not found"
- **Fix:** Modified Card primitive and all 5 specialized card components to accept arbitrary HTML attributes via rest spread operator and propagate them to rendered elements
- **Files modified:**
  - src/components/primitives/Card.astro
  - src/components/cards/CourseCard.astro
  - src/components/cards/LessonCard.astro
  - src/components/cards/SurahCard.astro
  - src/components/cards/ResourceCard.astro
- **Verification:** Curl request showed data-testid attributes rendering on card elements, all 20 tests passed after fix
- **Committed in:** `9e3a1c4` (standalone fix commit)

**2. [Rule 3 - Blocking] Fixed Astro dev toolbar h1 selector conflict**
- **Found during:** Task 3 (Running Playwright tests)
- **Issue:** Test "test page loads and displays all card sections" failed with strict mode violation - locator('h1') resolved to 5 elements (dev toolbar injects 4 additional h1s)
- **Fix:** Changed `page.locator('h1')` to `page.locator('h1').first()` to target only the page h1
- **Files modified:** tests/cards.spec.ts
- **Verification:** Test passed after fix
- **Committed in:** `7ea5b8b` (Task 3 commit)

**3. [Rule 3 - Blocking] Restarted dev server to pick up new page**
- **Found during:** Task 3 (Running initial test)
- **Issue:** src/pages/test/cards.astro created but dev server returned 404 (Astro doesn't hot-reload new pages)
- **Fix:** Killed old dev server process and started fresh instance
- **Verification:** curl showed page loading correctly
- **Impact:** No code changes, operational fix only

---

**Total deviations:** 3 auto-fixed (3 blocking issues)
**Impact on plan:** All auto-fixes necessary for test execution. No scope creep - only infrastructure adjustments for planned testing.

## Issues Encountered

**Dev server hot-reload limitation:**
- Astro dev server doesn't automatically detect new page files
- Solution: restart dev server after creating new pages
- Future consideration: document this in GSD patterns for Astro projects

**Test execution dependencies:**
- Tests depend on running dev server
- Tests depend on components supporting data-testid propagation
- Both issues resolved during Task 3 execution

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Phase 3 complete:**
- All 5 card components validated with comprehensive test coverage
- Responsive layout verified at 3 viewports (1200px, 700px, 400px)
- Arabic typography validated with no overflow at 320px narrow viewport
- Progress integration confirmed (ProgressBar in CourseCard, LessonCheckmark in LessonCard)
- Dark mode hover states verified with box-shadow changes
- Accessibility validated: keyboard focus, ARIA roles, external link indicators
- Visual regression baselines captured for future regression detection

**Ready for Phase 4 (Navigation Components):**
- Card composition patterns established and tested
- Test page pattern can be replicated for navigation components
- data-testid passthrough pattern can be applied to new components

**No blockers or concerns.**

---
*Phase: 03-card-components-arabic-typography*
*Completed: 2026-02-06*
