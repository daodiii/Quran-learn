---
phase: 04-dark-mode-polish
plan: 02
subsystem: ui
tags: [dark-mode, arabic-typography, accessibility, visual-regression, UthmanicHafs]

# Dependency graph
requires:
  - phase: 04-01
    provides: "WCAG AAA accessibility testing infrastructure and axe-core integration"
provides:
  - "Dark mode font-weight optical compensation for Arabic text (.arabic classes)"
  - "Visual regression baselines for Arabic diacritical marks in dark mode"
  - "Font-weight verification tests ensuring dark mode styling applies"
affects: [05-breadcrumbs-navigation, 06-progress-tracking, 07-mobile-responsive, 08-screen-reader-audit]

# Tech tracking
tech-stack:
  added: []
  patterns: [optical-compensation-for-dark-mode, visual-regression-for-arabic-text]

key-files:
  created:
    - tests/accessibility.spec.ts-snapshots/quran-text-dark-harakat.png
    - tests/accessibility.spec.ts-snapshots/surah-cards-dark-arabic.png
    - tests/accessibility.spec.ts-snapshots/lesson-cards-dark-arabic.png
  modified:
    - src/styles/global.css
    - tests/accessibility.spec.ts

key-decisions:
  - "Increased Arabic text font-weight from 400 to 500 in dark mode for optical compensation"
  - "Applied dark mode font-weight to all .arabic classes (.arabic, .arabic-lg, .arabic-xl)"
  - "Created visual regression baselines for harakat (diacritical marks) visibility"
  - "100 maxDiffPixels tolerance for Arabic text snapshots (font rendering variance)"

patterns-established:
  - "Dark mode optical compensation: [data-theme='dark'] .class { font-weight: 500 }"
  - "Visual regression for Arabic typography validates diacritical mark rendering"
  - "Font-weight verification via computed styles confirms CSS application"

# Metrics
duration: 14min
completed: 2026-02-06
---

# Phase 4 Plan 2: Arabic Dark Mode Readability Summary

**Font-weight optical compensation for Arabic text in dark mode with visual regression baselines for UthmanicHafs diacritical marks**

## Performance

- **Duration:** 14 min
- **Started:** 2026-02-06T00:56:58Z
- **Completed:** 2026-02-06T01:10:58Z
- **Tasks:** 3 (2 automated + 1 human verification)
- **Files modified:** 2

## Accomplishments
- Applied font-weight: 500 to all Arabic text classes in dark mode for optical compensation
- Created 4 visual regression baselines capturing Arabic text rendering in dark mode
- Font-weight verification test confirms computed styles match CSS rules
- Human verification confirmed diacritical marks (harakat) are clearly visible in dark mode
- No eye strain reported when reading Quranic text in dark mode

## Task Commits

Each task was committed atomically:

1. **Task 1: Add dark mode font weight adjustments for Arabic text** - `835665e` (feat)
2. **Task 2: Create visual regression tests for Arabic diacritical marks** - `ce3608b` (test)
3. **Task 3: Human verification of Arabic readability in dark mode** - Approved (no commit)

**Plan metadata:** Will be committed after this summary

## Files Created/Modified
- `src/styles/global.css` - Dark mode font-weight rules for .arabic, .arabic-lg, .arabic-xl classes
- `tests/accessibility.spec.ts` - Visual regression tests for Arabic diacritical marks and font-weight verification
- `tests/accessibility.spec.ts-snapshots/quran-text-dark-harakat.png` - Baseline for Quranic text with harakat
- `tests/accessibility.spec.ts-snapshots/quran-text-light-harakat.png` - Light mode comparison baseline
- `tests/accessibility.spec.ts-snapshots/surah-cards-dark-arabic.png` - SurahCard Arabic names in dark mode
- `tests/accessibility.spec.ts-snapshots/lesson-cards-dark-arabic.png` - LessonCard Arabic titles in dark mode

## Decisions Made

**Font-weight approach:**
- Increased Arabic text from font-weight: 400 to 500 in dark mode
- Rationale: Light-on-dark text appears thinner due to antialiasing; optical compensation prevents "washed out" appearance
- Applied to all .arabic classes (.arabic, .arabic-lg, .arabic-xl) universally
- Note: UthmanicHafs font may only support weight 400; browsers will synthesize or use closest available weight

**Visual regression strategy:**
- 100 maxDiffPixels tolerance for Arabic text snapshots (accounts for font rendering variance across platforms)
- Captured both light and dark mode baselines for comparison
- Tests cover Quranic text (/surahs/001-al-fatiha/) and card components (/test/cards/)
- Future CSS changes will be validated against these baselines to prevent regressions

**Verification approach:**
- Automated: Font-weight computed style verification confirms CSS rules apply
- Visual: Snapshot tests capture actual rendering for regression detection
- Human: Manual verification confirmed diacritical marks clearly visible, no eye strain

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - font-weight adjustment applied cleanly, visual regression baselines captured successfully, and human verification confirmed readability improvements.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Phase 4 Complete:** Dark mode and accessibility polish is now complete. The application has:
- WCAG AAA compliant color system (7:1 contrast ratios)
- Automated accessibility testing preventing regressions
- Dark mode font-weight optical compensation for Arabic text
- Visual regression baselines for Arabic typography

**Ready for Phase 5:** Breadcrumbs and navigation can now be implemented with confidence that:
- Accessible color tokens are available for all UI states
- Arabic text rendering is optimized for both light and dark modes
- Visual regression tests will catch any typography regressions introduced by new navigation components
- axe-core will validate navigation ARIA patterns automatically

**No blockers:** All Phase 4 deliverables complete.

---
*Phase: 04-dark-mode-polish*
*Completed: 2026-02-06*
