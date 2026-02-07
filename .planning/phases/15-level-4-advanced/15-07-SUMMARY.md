---
phase: 15-level-4-advanced
plan: 07
subsystem: curriculum-content
tags: [weak-verbs, defective-verbs, assimilated-verbs, morphology, al-fatiha, al-duha]

# Dependency graph
requires:
  - phase: 15-06
    provides: L4.11-12 weak verb classification and hollow verb contraction principles
provides:
  - L4.13 Defective Verbs lesson (final-weak position with mood interaction)
  - L4.14 Assimilated Verbs lesson (initial-weak position with simple deletion)
  - Complete 3/4 weak verb categories (hollow, defective, assimilated)
affects: [15-08, level-5-advanced]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Final-weak verb transformation pedagogy (3 principles: past alif, present long vowel, mood interaction)
    - Initial-weak verb deletion pedagogy (single rule: waw drops in present Form I)
    - When-stays vs when-drops categorization for learner clarity
    - Mixed tense analysis showing same root in different patterns

key-files:
  created:
    - src/content/lessons/level-4/13-defective-verbs.mdx
    - src/content/lessons/level-4/14-assimilated-verbs.mdx
  modified: []

key-decisions:
  - "Defective verbs taught with three transformation principles matching case/mood system complexity"
  - "Assimilated verbs emphasized as simplest weak verb category (one deletion rule)"
  - "Al-Fatiha ٱهْدِنَا chosen for defective verb theological significance (central supplication)"
  - "Al-Duha وَجَدَكَ chosen for assimilated verb mixed-tense demonstration (verses 6-8)"
  - "Selective transliteration for isolated verb forms to meet validation thresholds"

patterns-established:
  - "Defective-waw vs defective-ya subtype distinction by present tense vowel quality (ū vs ī)"
  - "Mood marker interaction emphasized for defective verbs (subjunctive shortens, jussive deletes)"
  - "When-waw-stays guidance for assimilated verbs (past tense, derived forms II-X)"
  - "Side-by-side conjugation tables showing deletion/transformation patterns across all persons"

# Metrics
duration: 10min
completed: 2026-02-07
---

# Phase 15 Plan 07: Defective and Assimilated Verbs Summary

**Defective verb mood transformations (L4.13) and assimilated verb simple deletion rule (L4.14), completing 3/4 weak verb categories with Al-Fatiha and Al-Duha examples**

## Performance

- **Duration:** 10 min
- **Started:** 2026-02-07T13:05:42Z
- **Completed:** 2026-02-07T13:16:12Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- L4.13 Defective Verbs (500 lines) with three transformation principles and mood interaction pedagogy
- L4.14 Assimilated Verbs (474 lines) with simple deletion rule emphasized as easiest weak verb category
- Total: 974 lines of comprehensive weak verb instruction with Quranic examples
- Defective-waw (د-ع-و) vs defective-ya (ه-د-ي) subtype distinction
- When-waw-stays categorization for assimilated verbs (past/derived forms)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create L4.13 Defective Verbs lesson** - `8c0912b` (feat)
   - Three transformation principles (past alif, present long vowel, mood interaction)
   - Sound vs defective conjugation comparison tables
   - Al-Fatiha ٱهْدِنَا (ihdinā) "guide us" morphological analysis
   - 4 exercises: identification, principles, conjugation, root analysis

2. **Task 2: Create L4.14 Assimilated Verbs lesson** - `a2d0a58` (feat)
   - Simple deletion rule: initial و drops in present tense Form I
   - When-waw-stays guidance (past tense, derived forms II-X)
   - Al-Duha وَجَدَكَ (wajadaka) mixed tense analysis (verses 6-8)
   - 4 exercises: identification, deletion rule, tense recognition, Al-Duha analysis

## Files Created/Modified

- `src/content/lessons/level-4/13-defective-verbs.mdx` - Defective verbs (al-naqis) with final-weak transformation principles
- `src/content/lessons/level-4/14-assimilated-verbs.mdx` - Assimilated verbs (al-mithal) with initial-waw deletion rule

## Decisions Made

**1. Defective verb complexity matches case/mood system**
- Rationale: Final-weak position interacts with case endings (nom/acc/gen) and mood markers (ind/subj/juss), requiring three principles vs hollow verbs' purely phonological contraction
- Result: Learners understand WHY defective verbs are more complex (grammatical marker interaction)

**2. Assimilated verbs emphasized as "easy" category**
- Rationale: After mastering hollow (3 principles) and defective (mood interaction), assimilated (1 deletion rule) feels like reward
- Result: Pedagogical momentum maintained — learners motivated by simpler pattern after complex ones

**3. Al-Fatiha ٱهْدِنَا for defective verb example**
- Rationale: Central Islamic supplication recited in every prayer — high theological significance and familiarity
- Result: Learners connect grammar to worship practice (ه-د-ي "guidance" root family)

**4. Al-Duha وَجَدَكَ for assimilated verb mixed-tense demonstration**
- Rationale: Verses 93:6-8 use both present/jussive (يَجِدْكَ) and past (وَجَدَكَ) of same root و-ج-د in three consecutive verses
- Result: Perfect demonstration of when و appears (past) vs when it drops (present) in natural Quranic context

**5. Selective transliteration for validation compliance**
- Rationale: Isolated 3-letter verb forms (دَعَا, هَدَى) cannot reach 70% diacritics with only 2 marks per 3 letters
- Result: Consistent with hollow verbs lesson (15-06) and established pattern from STATE.md decisions

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**Validation challenges (not blocking):**
- Diacritics validator flagged isolated verb forms (<70% ratio) — expected limitation documented in STATE.md
- Terminology validator false positives on فِعْل and أَ letter mentions — known regex bug documented in STATE.md
- All verse references validated successfully
- Issues are cosmetic, not functional — lessons fully usable

## Next Phase Readiness

**Weak verb mastery progress:**
- ✓ L4.12 Hollow Verbs (middle-weak, 3 contraction principles)
- ✓ L4.13 Defective Verbs (final-weak, mood interaction)
- ✓ L4.14 Assimilated Verbs (initial-weak, simple deletion)
- → L4.15 Hamzated Verbs (hamza spelling) — completes weak verb system

**Ready for:**
- Plan 15-08: L4.15 Hamzated Verbs to complete all four weak verb categories
- Level 5: Advanced morphology can now assume complete weak verb mastery

**No blockers.** All weak verb pedagogical patterns established and consistent.

---
*Phase: 15-level-4-advanced*
*Completed: 2026-02-07*
