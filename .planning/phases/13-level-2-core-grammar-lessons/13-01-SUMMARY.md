---
phase: 13-level-2-core-grammar-lessons
plan: 01
subsystem: curriculum-content
tags: [arabic-grammar, mdx-lessons, level-2, nominal-sentence, nominative-case, irab-analysis, quran-examples]

# Dependency graph
requires:
  - phase: 12-level-1-foundation-lessons
    provides: L1.10 Simple Sentences and L1.11 Case Endings introducing sentence types and case recognition
provides:
  - L2.01 The Nominal Sentence (jumlah ismiyyah) with mubtadaʾ/khabar analysis
  - L2.04 The Nominative Case (rafʿ) with four nominative functions
  - Complete i'rab analysis methodology using three-part format (Function + Case marker + Reason)
  - Foundation for Level 2 sentence structure chain (L2.02, L2.03) and case system chain (L2.05, L2.06)
affects:
  - 13-02 through 13-11 (remaining Level 2 lessons depend on nominal sentence and nominative case foundations)
  - Level 5 full i'rab analysis lessons will build on three-part format established here

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Three-part i'rab format: Function + Case marker + Reason"
    - "Progressive example complexity: simple → word-by-word breakdown → advanced structures"
    - "Level 2 transition language: recognition → mastery"

key-files:
  created:
    - src/content/lessons/level-2/01-nominal-sentence.mdx
    - src/content/lessons/level-2/04-nominative-case.mdx
  modified: []

key-decisions:
  - "Three-part i'rab format (Function + Case marker + Reason) adopted as standard for all Level 2+ grammatical analysis"
  - "Level 2 lessons emphasize WHEN and WHY over WHAT (mastery over recognition)"
  - "Isolated morpheme forms (خَبَر, كَانَ, etc.) kept at <70% diacritics for pedagogical clarity per 12-03 decision"
  - "Al-Ikhlas chosen for L2.01 examples (theological precision through nominal sentences)"
  - "An-Nasr chosen for L2.04 examples (clear demonstration of four nominative functions)"

patterns-established:
  - "I'rab analysis structure: word → function → case marker → reason"
  - "Level 2 transition messaging: 'Level 1 was about RECOGNITION. Level 2 is about MASTERY.'"
  - "Advanced notes call forward to later lessons (L2.10, L2.11) without overloading current content"

# Metrics
duration: 7min
completed: 2026-02-06
---

# Phase 13 Plan 01: Level 2 Root Grammar Foundations Summary

**Two foundational Level 2 lessons establishing nominal sentence structure (mubtadaʾ/khabar) and nominative case mastery (four functions with i'rab analysis)**

## Performance

- **Duration:** 7 minutes
- **Started:** 2026-02-06T22:25:45Z
- **Completed:** 2026-02-06T22:32:46Z
- **Tasks:** 2
- **Files created:** 2

## Accomplishments

- Created L2.01 The Nominal Sentence with Al-Ikhlas examples demonstrating mubtadaʾ/khabar structure
- Created L2.04 The Nominative Case with An-Nasr examples showing all four nominative functions
- Established three-part i'rab analysis format (Function + Case marker + Reason) for Level 2+
- Provided 4 progressive ExerciseBox components per lesson with complete answer explanations
- Built pedagogical bridge from Level 1 recognition to Level 2 mastery

## Task Commits

Each task was committed atomically:

1. **Task 1: Create L2.01 The Nominal Sentence lesson** - `d7a4054` (feat)
   - Complete 5-part structure with introduction, concept explanation, Quran examples, rule, practice
   - Al-Ikhlas (112) examples with full i'rab analysis
   - 392 lines including bilingual terminology, transliteration, cross-references
   - GrammarTable for mubtadaʾ/khabar structure, Callout for rules and warnings

2. **Task 2: Create L2.04 The Nominative Case lesson** - `6672b02` (feat)
   - Complete 5-part structure focusing on WHEN and WHY nominative applies
   - An-Nasr (110) examples demonstrating four nominative functions
   - 488 lines including nominative markers table for all noun forms
   - Advanced i'rab analysis including iḍāfah case explanation

## Files Created/Modified

- `src/content/lessons/level-2/01-nominal-sentence.mdx` - Nominal sentence (jumlah ismiyyah) with mubtadaʾ/khabar components, no linking verb requirement, i'rab analysis methodology
- `src/content/lessons/level-2/04-nominative-case.mdx` - Four nominative functions (mubtadaʾ, khabar, fāʿil, coordinated nouns), nominative markers by noun type, mastery-focused pedagogy

## Decisions Made

**1. Three-part i'rab analysis format**
- Established "Function + Case marker + Reason" as standard format
- Rationale: Mirrors traditional Arabic grammar pedagogy, provides complete grammatical understanding
- Example: "Function: Subject (mubtadaʾ) | Case marker: Nominative with damma (ـُ) | Reason: Subject of nominal sentence always takes nominative"

**2. Level 2 transition language**
- Explicitly frame Level 2 as bridge from recognition to mastery
- Opening messaging: "Level 1 was about RECOGNITION. Level 2 is about MASTERY."
- Rationale: Sets learner expectations for increased analytical rigor

**3. Surah selection for examples**
- L2.01: Al-Ikhlas (112) - compact, theologically precise nominal sentences
- L2.04: An-Nasr (110) - demonstrates all four nominative functions in three verses
- Rationale: Follows CURRICULUM_MAP.md designated surahs for pedagogical appropriateness

**4. Isolated morpheme vocalization**
- Citation forms like خَبَر, كَانَ, نُورُ kept at 67% diacritics
- Rationale: Per 12-03 decision, pedagogically correct to show citation forms without over-marking
- Validation accepts <70% for these isolated morpheme contexts

## Deviations from Plan

None - plan executed exactly as written. No bugs, missing functionality, or blocking issues encountered during execution.

## Issues Encountered

**Diacritics validation warnings on isolated morphemes**
- **Issue:** Validator flagged citation forms (خَبَر, كَانَ, etc.) at 67% diacritics
- **Resolution:** These are pedagogically correct citation forms per 12-03 accumulated decision
- **Verification:** State.md confirms "Isolated morpheme diacritics <70% acceptable for pedagogical clarity"
- **Impact:** No changes required; validation warnings expected and acceptable for this context

## User Setup Required

None - no external service configuration required. Lessons are static MDX content.

## Next Phase Readiness

**Ready for L2.02, L2.03 (sentence structure chain):**
- L2.01 provides nominal sentence foundation
- L2.04 provides nominative case rules for mubtadaʾ/khabar
- Three-part i'rab format established for continued use

**Ready for L2.05, L2.06 (case system chain):**
- Nominative case mastery complete
- I'rab methodology established
- Learner familiar with case-function relationship concept

**No blockers or concerns.**
- Both lessons follow established patterns from Level 1
- Validation infrastructure working correctly
- Content aligns with CURRICULUM_MAP.md learning objectives

---
*Phase: 13-level-2-core-grammar-lessons*
*Completed: 2026-02-06*
