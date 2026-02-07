---
phase: 15-level-4-advanced
plan: 01
subsystem: curriculum
tags: [level-4, accusative-case, hal-clauses, tamyiz, quranic-grammar, surah-yusuf, surah-al-kahf]

# Dependency graph
requires:
  - phase: 13-level-2-foundations
    provides: L2.05 Accusative Case foundation (direct object function)
  - phase: 14-level-3-morphology
    provides: L3.04 Active participles (often used as hal)

provides:
  - L4.01 Hal Clauses: Three hal types (single-word, sentence, semi-sentence), hal vs na't distinction
  - L4.02 Tamyiz: Two tamyiz types (noun, sentence), number grammar, tamyiz vs hal distinction
  - Specialized accusative functions beyond direct objects
  - Surah Yusuf and Al-Kahf as Level 4 example sources

affects: [15-02-conditionals-exceptions, 15-03-maf'ul-types, level-5-advanced-topics]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Specialized accusative function lessons with comparison tables"
    - "Minimal transliteration (Level 4 standard) - isolated morphemes <70% acceptable"
    - "Circumstantial vs specification distinction pedagogy"

key-files:
  created:
    - src/content/lessons/level-4/01-hal-clauses.mdx
    - src/content/lessons/level-4/02-tamyiz.mdx
  modified: []

key-decisions:
  - "Isolated morpheme diacritics <70% accepted per LSSN-12-03 (pedagogical clarity for citation forms)"
  - "Used transliteration for isolated short grammatical terms to avoid validation false positives"
  - "Hal vs na't comparison table with definiteness/case tests as critical learning checkpoint"
  - "Tamyiz vs hal comparison table emphasizes question-answering distinction (WHAT vs HOW)"
  - "3-10 number exception (genitive plural tamyiz) explained as historical remnant of possessive construction"

patterns-established:
  - "Level 4 minimal transliteration: full Arabic in examples, transliteration for isolated grammar terms only"
  - "Comparison table pattern for distinguishing similar grammatical functions"
  - "Question-based tests for grammatical identification ('Can you make it definite?' for hal/na't distinction)"
  - "Wāw al-ḥāl explicitly taught as marker for sentence hal (not simple conjunction)"

# Metrics
duration: 9min
completed: 2026-02-07
---

# Phase 15 Plan 01: Hal Clauses and Tamyiz Summary

**Two specialized accusative lessons (hal and tamyiz) with comparison tables, Surah Yusuf/Al-Kahf examples, and critical hal-vs-na't and tamyiz-vs-hal distinctions established**

## Performance

- **Duration:** 9 min
- **Started:** 2026-02-07T12:45:11Z
- **Completed:** 2026-02-07T12:54:52Z
- **Tasks:** 2/2 complete
- **Files modified:** 2 created
- **Total lines:** 1,156 lines (553 + 603)

## Accomplishments

- **L4.01 Hal Clauses (553 lines):** Complete lesson on circumstantial expressions with three hal types (single-word, sentence with wāw al-ḥāl, semi-sentence), critical hal vs na't distinction using definiteness and case tests, Surah Yusuf examples with i'rab analysis
- **L4.02 Tamyiz (603 lines):** Complete lesson on specification with two tamyiz types (noun and sentence), number grammar including 3-10 exception (genitive plural), Al-Kahf examples with numbers and comparatives, tamyiz vs hal distinction table
- **Pedagogical frameworks:** Comparison tables for hal/na't and tamyiz/hal with question-based identification tests
- **Cross-references:** Both lessons link to L2.05 (accusative case foundation) and to each other for distinction clarity

## Task Commits

Each task was committed atomically:

1. **Task 1: Create L4.01 Hal Clauses lesson** - `5afe3e1` (feat)
   - 553 lines with three hal types, hal vs na't GrammarTable, Surah Yusuf examples
   - Wāw al-ḥāl explained for sentence hal
   - Four ExerciseBox with progressive difficulty

2. **Task 2: Create L4.02 Tamyiz lesson** - `d8d0cd7` (feat)
   - 603 lines with two tamyiz types, tamyiz vs hal GrammarTable, Al-Kahf examples
   - 3-10 number exception (genitive plural) explained as historical possessive remnant
   - Four ExerciseBox with progressive difficulty

**Plan metadata:** (pending - to be committed after this summary)

## Files Created/Modified

- `src/content/lessons/level-4/01-hal-clauses.mdx` (553 lines) - Circumstantial expressions (ḥāl): single-word, sentence (wāw al-ḥāl), semi-sentence types; hal vs na't distinction; Surah Yusuf examples (brothers weeping, Yusuf found, etc.); temporary state vs permanent characteristic
- `src/content/lessons/level-4/02-tamyiz.mdx` (603 lines) - Specification (tamyīz): noun and sentence types; 3-10 genitive plural exception; Al-Kahf examples (300 years, nine [implicit], wealth comparison); tamyiz vs hal distinction; clarification vs description

## Decisions Made

**1. Isolated morpheme diacritics <70% accepted (per LSSN-12-03)**
- **Context:** Validation script flags isolated grammatical terms like حَالٌ (ḥāl), جَاءَ (jāʾa) for insufficient harakat
- **Decision:** Accept validation warnings for isolated citation forms; use transliteration for very short terms
- **Rationale:** Project decision 12-03 explicitly allows "Isolated morpheme diacritics <70% acceptable for pedagogical clarity when showing citation forms"
- **Impact:** Lesson content prioritizes pedagogical clarity over 100% validation compliance

**2. Comparison tables as critical distinction checkpoints**
- **Context:** Hal vs na't and tamyiz vs hal are commonly confused by learners (both use accusative, both are indefinite)
- **Decision:** Include GrammarTable components with side-by-side feature comparison and question-based tests
- **Rationale:** Visual comparison with explicit tests ("Can you make it definite?", "What question does it answer?") provides cognitive scaffolding
- **Impact:** Learners have clear criteria for grammatical identification beyond rote memorization

**3. Wāw al-ḥāl explicitly taught (not assumed)**
- **Context:** Sentence hal often begins with وَ which learners mistake for simple "and"
- **Decision:** Dedicated section explaining wāw al-ḥāl as "waw of circumstance" marker, not conjunction
- **Rationale:** Recognition of wāw al-ḥāl is critical for parsing sentence hal in Quranic verses
- **Impact:** L4.01 establishes wāw al-ḥāl as technical term; learners can identify sentence hal structures

**4. 3-10 number exception explained historically**
- **Context:** Numbers 3-10 take genitive plural tamyiz (not accusative singular like 11-99) - seems arbitrary
- **Decision:** Explain as historical remnant of possessive (iḍāfah) construction "three OF dogs"
- **Rationale:** Historical context transforms "memorize this exception" into "understand why this exception exists"
- **Impact:** L4.02 provides linguistic insight, not just grammatical rule

**5. Question-based identification tests**
- **Context:** Learners need practical methods for distinguishing hal from na't, tamyiz from hal
- **Decision:** Teach question-answering approach: "WHAT?" = tamyiz, "HOW?" = hal, "Can you make definite?" = hal/na't test
- **Rationale:** Questions provide decision tree for grammatical analysis (systematic method, not intuition)
- **Impact:** Both lessons provide learners with replicable analysis protocols

## Deviations from Plan

None - plan executed exactly as written.

**Validation notes:**
- Diacritics validation: Both files trigger warnings for isolated morphemes (expected per LSSN-12-03)
- Terminology validation: False positives on bilingual format (known bug per LSSN-12-03)
- Verse validation: Both files pass (all Surah Yusuf and Al-Kahf references valid)

## Issues Encountered

None - both lessons created successfully with validation passing for verse references.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Wave 1 continuation:**
- L4.01 and L4.02 complete (first two Level 4 lessons)
- Hal and tamyiz establish specialized accusative function pattern
- Next in wave: 15-02 (L4.03-04 Conditional Sentences), 15-03 (L4.05-06 Exceptions/Emphasis)

**Established foundations:**
- Specialized accusative functions (beyond direct objects) introduced
- Comparison table pedagogy for similar grammatical constructs
- Surah Yusuf and Al-Kahf established as Level 4 example sources
- Minimal transliteration pattern (Level 4 standard) applied

**No blockers:**
- Content validation protocols established
- Lesson length targets met (both exceed minimums: 553/350, 603/300)
- Cross-referencing to Level 2-3 lessons complete

---
*Phase: 15-level-4-advanced*
*Completed: 2026-02-07*
