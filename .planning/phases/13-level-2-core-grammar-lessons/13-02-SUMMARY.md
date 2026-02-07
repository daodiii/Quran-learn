---
phase: 13-level-2-core-grammar-lessons
plan: 02
subsystem: curriculum
tags: [arabic-grammar, level-2, sentence-structure, mubtada, khabar, fail, verbal-sentence, nominal-sentence, al-asr, al-kawthar]

# Dependency graph
requires:
  - phase: 13-01
    provides: L2.01 Nominal Sentence and L2.04 Nominative Case foundational lessons
provides:
  - L2.02 Subject and Predicate (Mubtada and Khabar) lesson with three predicate types
  - L2.03 The Verbal Sentence (Jumlah Filiyyah) lesson with VSO word order
  - I'rab analysis framework using three-part format (Function + Case marker + Reason)
  - Agreement rules for mubtada/khabar (number, gender, definiteness)
  - VSO word order explanation and contrast with English SVO
affects: [13-03, 13-04, 13-05, 13-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Three-part i'rab analysis format (Function + Case marker + Reason) for Level 2+"
    - "Predicate type classification (mufrad, jumlah, shibh jumlah)"
    - "Agreement rule documentation (number, gender, definiteness)"
    - "VSO word order pedagogical explanation"

key-files:
  created:
    - src/content/lessons/level-2/02-subject-predicate.mdx
    - src/content/lessons/level-2/03-verbal-sentence.mdx
  modified: []

key-decisions:
  - "Three predicate types taught systematically (single word, sentence, semi-sentence)"
  - "Embedded subjects emphasized in verbal sentence structure"
  - "VSO word order contrasted with English SVO for clarity"
  - "Al-Asr chosen for mubtada/khabar examples (theological precision)"
  - "Al-Kawthar chosen for verbal sentence examples (clear VSO structure)"

patterns-established:
  - "Predicate type classification method for systematic analysis"
  - "Agreement rules matrix (number × gender × definiteness)"
  - "Embedded subject recognition technique (hidden pronouns in verbs)"
  - "First-word test for sentence type identification"

# Metrics
duration: 43min
completed: 2026-02-07
---

# Phase 13 Plan 02: Subject and Predicate + Verbal Sentence Summary

**Two sentence structure lessons teaching mubtada/khabar analysis with three predicate types and VSO verbal sentence word order using Al-Asr and Al-Kawthar examples**

## Performance

- **Duration:** 43 minutes
- **Started:** 2026-02-07T00:12:49Z
- **Completed:** 2026-02-07T00:56:20Z
- **Tasks:** 2/2 completed
- **Files created:** 2 lesson files
- **Lines added:** 1,016 total (457 + 559)

## Accomplishments

- Created L2.02 Subject and Predicate lesson with deep dive into mubtada and khabar components
- Created L2.03 The Verbal Sentence lesson explaining VSO word order and contrasting with nominal sentences
- Established three predicate types classification system (single word, sentence, semi-sentence)
- Documented agreement rules comprehensively (number, gender, definiteness patterns)
- Provided 8 ExerciseBox total (4 per lesson) with progressive difficulty
- Analyzed Surah Al-Asr (103) examples for nominal sentence analysis
- Analyzed Surah Al-Kawthar (108) examples for verbal sentence VSO structure

## Task Commits

Each task was committed atomically:

1. **Task 1: Create L2.02 Subject and Predicate lesson** - `72f6670` (feat)
   - Deep dive into mubtada and khabar components
   - Three predicate types: single word, sentence, semi-sentence
   - Agreement rules: number, gender, definiteness
   - Examples from Surah Al-Asr with i'rab analysis
   - Four ExerciseBox with progressive difficulty
   - Cross-references to L2.01, L2.09, L2.10, L2.11

2. **Task 2: Create L2.03 The Verbal Sentence lesson** - `7b04f69` (feat)
   - VSO word order as default Arabic pattern
   - Three components: verb, fāʿil, mafʿūl bihi
   - Embedded subjects within verb conjugations
   - Examples from Surah Al-Kawthar with i'rab analysis
   - Four ExerciseBox contrasting nominal vs verbal
   - Cross-references to L2.01, L2.04, L2.05, L3.02-04

## Files Created/Modified

### Created
- `src/content/lessons/level-2/02-subject-predicate.mdx` (457 lines)
  - Mubtada and khabar deep dive with three predicate types
  - Agreement rules documentation
  - Al-Asr examples with three-part i'rab analysis
  - Four exercises: identification, analysis, agreement, construction

- `src/content/lessons/level-2/03-verbal-sentence.mdx` (559 lines)
  - Verbal sentence structure (jumlah fiʿliyyah)
  - VSO word order explanation and contrast with English SVO
  - Embedded subject recognition
  - Al-Kawthar examples with grammatical analysis
  - Four exercises: identification, comparison, analysis, construction

## Decisions Made

**1. Three predicate types taught systematically**
- Rationale: Learners need clear classification of khabar forms (mufrad, jumlah, shibh jumlah) to analyze complex sentences correctly. This taxonomy is classical Arabic grammar standard.

**2. Embedded subjects emphasized in verbal sentence structure**
- Rationale: Understanding hidden pronouns within verb conjugations is critical for recognizing that many verbal sentences have no visible subject. This prevents learner confusion about "missing" subjects.

**3. VSO word order contrasted explicitly with English SVO**
- Rationale: English speakers' default SVO pattern interferes with understanding Arabic verbal sentences. Explicit contrast helps learners recognize and internalize VSO as the Arabic default.

**4. Agreement rules documented in matrix format**
- Rationale: Number × gender × definiteness creates 12+ possible combinations. Matrix presentation enables systematic learning rather than memorizing isolated examples.

**5. Surah choices**
- Al-Asr (103) for L2.02: Compact surah with clear nominal sentences and inna structure
- Al-Kawthar (108) for L2.03: Short verses with perfect VSO examples and varied verb types

## Deviations from Plan

### Validation Issues (Known Limitations)

**Note:** During execution, validation scripts flagged isolated morpheme diacritics below 70% threshold and terminology first-mention false positives. These are ACCEPTED per project decisions:

**1. [Documented Limitation] Isolated morpheme diacritics <70% acceptable**
- **Context:** Project decision 12-03 (2026-02-05)
- **Issue:** Validator flagged words like ءَامَنُوا۟, كَتَبُوا۟, تَوَاصَوْا۟ for <70% diacritics
- **Rationale:** Isolated morphemes shown in pedagogical contexts (conjugation examples, citation forms) may have <70% vocalization for clarity when showing pattern structure vs. full pronunciation
- **Files affected:** Both L2.02 and L2.03 (approximately 20 instances total)
- **Verification:** Lesson content remains pedagogically sound; full Quranic verse text maintains >70%
- **Resolution:** Accepted as per established project standards

**2. [Known Bug] Terminology validator false positives**
- **Context:** Project decision 12-03 (2026-02-05)
- **Issue:** Validator lacks context awareness for bilingual format, flagging "أَ" and "إِ" as "first mentions"
- **Rationale:** These are not first mentions of grammatical terms but parts of Quranic text being analyzed
- **Files affected:** Both lessons (8 false positives total)
- **Verification:** Manual review confirms all true first mentions use correct bilingual format
- **Resolution:** Accepted known bug; future validator enhancement needed

---

**Total deviations:** 0 actual deviations (validation flags are known limitations per project standards)
**Impact on plan:** None - plan executed exactly as specified

## Issues Encountered

None - lesson content creation proceeded smoothly following established L2.01 and L2.04 patterns.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for:**
- 13-03 (Accusative Case + Genitive Case lessons) — case system completion
- 13-04 (Prepositions + Idafah lessons) — genitive-triggering structures
- 13-05 (Adjective Agreement lesson) — builds directly on agreement rules from L2.02

**Dependencies satisfied:**
- L2.02 → L2.09, L2.10, L2.11 (mubtada/khabar foundation for inna/kaana)
- L2.03 → L2.04, L2.05 (fāʿil and mafʿūl bihi case explanations)
- L2.03 → L3.02-04 (verb forms and conjugation)

**No blockers.**

**Notes:**
- Learners now have complete sentence type pair (nominal + verbal)
- Agreement rules framework established for adjective lesson
- I'rab analysis three-part format consistently applied
- VSO word order foundation ready for complex sentence structures

---
*Phase: 13-level-2-core-grammar-lessons*
*Completed: 2026-02-07*
