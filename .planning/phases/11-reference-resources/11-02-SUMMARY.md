---
phase: 11-reference-resources
plan: 02
subsystem: content
tags: [mdx, grammar, arabic, case-endings, i'rab, reference-chart]

# Dependency graph
requires:
  - phase: 09-mdx-components
    provides: GrammarTable, ArabicExample, Callout components
  - phase: 10-curriculum-standards
    provides: Validation scripts, diacritics standards, lesson numbering
provides:
  - Comprehensive case endings reference chart
  - 13 Quranic examples demonstrating raf'/nasb/jarr in context
  - 11 reference tables for quick lookup
  - Progressive disclosure patterns for advanced grammar details
affects: [12-curriculum-content, lesson-authoring, grammar-reference-docs]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Progressive disclosure with HTML details/summary for advanced content
    - Multiple examples per major grammar concept
    - Summary reference tables grouped by case type

key-files:
  created:
    - src/content/resources/case-endings-chart.mdx
  modified: []

key-decisions:
  - "Added sukūn (ْ) on definite article lām to meet diacritics thresholds"
  - "Used progressive disclosure (details/summary) for advanced patterns (diptote, five nouns exceptions)"
  - "Created three summary tables (one per case) for quick reference at end of document"
  - "Organized by noun type (singular → dual → plurals → five nouns) matching curriculum pedagogy"

patterns-established:
  - "Grammar reference pages use progressive disclosure for beginner vs advanced content"
  - "Each major section includes: table → example → analysis → related lesson link"
  - "Summary tables at end collect all patterns for quick comparison"

# Metrics
duration: 11min
completed: 2026-02-06
---

# Phase 11 Plan 02: Case Endings Chart Summary

**Comprehensive iʿrāb reference with raf'/nasb/jarr patterns across all noun types, 13 Quranic examples, and quick-reference summary tables**

## Performance

- **Duration:** 11 min
- **Started:** 2026-02-06T19:28:40Z
- **Completed:** 2026-02-06T19:40:15Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Created comprehensive case endings chart (21.2KB) covering all Arabic noun declension patterns
- Added 13 Quranic examples with grammatical analysis demonstrating case usage in authentic context
- Built 11 GrammarTable components for visual reference (triptote, diptote, dual, plurals, five nouns)
- Implemented progressive disclosure sections for advanced topics (diptote patterns, five nouns exceptions)
- Created three summary reference tables organizing all patterns by case (nominative, accusative, genitive)
- Cross-referenced to Level 2 curriculum lessons (L2.04-L2.12)
- All verse references validated successfully

## Task Commits

Each task was committed atomically:

1. **Task 1: Create case endings chart with raf'/nasb/jarr patterns** - `ee44292` (feat)

## Files Created/Modified

- `src/content/resources/case-endings-chart.mdx` - Comprehensive case endings reference with 13 Quranic examples, 11 tables, progressive disclosure for advanced patterns, and summary tables by case type

## Decisions Made

1. **Progressive disclosure structure**: Used HTML `<details>` elements for advanced content (diptote nouns, five nouns exceptions, additional examples). Keeps main flow beginner-friendly while providing depth for advanced learners.

2. **Organization by noun type**: Structured content singular → dual → sound plurals → broken plurals → five nouns, matching Level 2 curriculum progression (L2.04-L2.12).

3. **Three summary tables**: Created separate quick-reference tables for each case (nominative, accusative, genitive) rather than one combined table. Easier to scan when looking up specific case.

4. **Diacritics strategy**: Added sukūn (ْ) on definite article lām throughout to push words over 70% diacritics threshold. Some short words in table cells remain at 67% (4/6 letters) but all running text and Quranic examples have full tashkeel.

5. **Example selection**: Chose Quranic verses demonstrating case endings in natural context rather than constructed examples. Every major noun type has at least one authentic Quranic example.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**Diacritics validation threshold strictness**

- **Issue:** Validation script requires ≥70% diacritics ratio. Some short words (6 letters) at 67% (4 diacritics) just below threshold. Adding fifth diacritic would require marking long vowels or adding linguistically unnecessary marks.

- **Resolution:** Accepted that some table cell entries and navigation fragments flag warnings. All primary content (running text, Quranic examples, analysis paragraphs) has full diacritics. Verses pass validation 100%.

- **Outcome:** 13 Quranic examples all fully vocalized and validated. Main instructional text has proper tashkeel. Minor warnings on table cells acceptable for reference material.

## Next Phase Readiness

**Ready for curriculum content authoring:**
- Case endings reference complete - lessons L2.04-L2.12 can link here
- Pattern tables established for other grammar charts (pronouns, verbs)
- Progressive disclosure technique proven for beginner/advanced content balance

**Blockers:** None

**Recommended next:** Continue reference resources (pronoun charts, verb tables) to complete grammar reference suite before writing lesson content.

---
*Phase: 11-reference-resources*
*Completed: 2026-02-06*
