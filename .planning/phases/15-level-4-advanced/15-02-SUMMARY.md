---
phase: 15-level-4-advanced
plan: 02
subsystem: curriculum-content
tags: [conditionals, particles, mood, jussive, level-4, advanced-grammar]

# Dependency graph
requires:
  - phase: 13-level-2-core-grammar-lessons
    provides: Verbal sentence structure (L2.03)
  - phase: 14-level-3-intermediate-lessons
    provides: Present tense and verb moods (L3.04)
provides:
  - L4.03 Conditional Sentences lesson (shart & jawab structure)
  - L4.04 Types of Conditional Particles lesson (certainty scale)
  - Conditional sentence pedagogy with mood change demonstrations
  - Certainty scale framework (law-in-idha)
affects: [15-level-4-advanced, 16-level-5-mastery, negation-particles, complex-conditionals]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Certainty scale visualization for particle pedagogy (impossible ← uncertain → expected)"
    - "Mood marker emphasis (deleted nūn, sukūn) for jussive recognition"
    - "in vs inna distinction as critical callout (most common error)"

key-files:
  created:
    - src/content/lessons/level-4/03-conditional-sentences.mdx
    - src/content/lessons/level-4/04-conditional-particles.mdx
  modified: []

key-decisions:
  - "Teach structure first (L4.03), then particle nuances (L4.04) to prevent cognitive overload"
  - "Certainty scale (law-in-idha) as primary organizing framework for particle pedagogy"
  - "Explicit in vs idha confusion alert in both lessons (most common learner error)"
  - "Accept isolated morpheme diacritics at 67% per STATE.md pedagogical clarity decision"

patterns-established:
  - "Two-part conditional pedagogy: structure → particles (prevents overwhelm)"
  - "Mood marker visibility: highlight deleted nūn and sukūn as recognition markers"
  - "Surah-specific examples: Al-Baqarah for structure, Yusuf for particle variety"

# Metrics
duration: 10min
completed: 2026-02-07
---

# Phase 15 Plan 02: Conditional Sentences & Particles Summary

**Conditional sentence structure (shart & jawab) with jussive mood markers, certainty scale pedagogy (law-in-idha), and in vs idha confusion prevention**

## Performance

- **Duration:** 10 minutes
- **Started:** 2026-02-07T12:45:45Z
- **Completed:** 2026-02-07T12:56:04Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Created L4.03 teaching three-part conditional structure (particle + condition + result) with jussive mood markers (deleted nūn, sukūn) fully explained
- Created L4.04 with certainty scale visual (law ← in → idha) and comprehensive particle comparison table showing mood requirements
- Emphasized in vs inna distinction (conditional vs emphatic) and in vs idha confusion (uncertain vs expected) as critical callouts
- Used designated surahs per CURRICULUM_MAP: Al-Baqarah for structural examples, Yusuf for particle variety in narrative context
- 4 exercises per lesson covering identification, mood analysis, Quranic parsing, and sentence construction

## Task Commits

Each task was committed atomically:

1. **Task 1: Create L4.03 Conditional Sentences (Shart & Jawab) lesson** - `f2a25cc` (feat)
   - Three-part conditional structure pedagogy
   - Jussive mood markers with deletion examples
   - Al-Baqarah examples with full morphological i'rab
   - إِنْ vs إِنَّ distinction emphasized

2. **Task 2: Create L4.04 Types of Conditional Particles lesson** - `70ead86` (feat)
   - Certainty scale visual and particle comparison table
   - Six main conditional particles (in, idha, law, lamma, man, ma)
   - Surah Yusuf narrative examples showing particle choice reveals certainty
   - Most common error alert (in vs idha) with explanation

## Files Created/Modified

- `src/content/lessons/level-4/03-conditional-sentences.mdx` - 328 lines teaching conditional sentence structure (particle + condition + result), jussive mood markers (deleted nūn for plurals, sukūn for singulars), and in vs inna distinction with Al-Baqarah examples
- `src/content/lessons/level-4/04-conditional-particles.mdx` - 435 lines teaching certainty scale (law-in-idha), six main particles with mood requirements, and Surah Yusuf examples demonstrating how particle choice signals speaker certainty

## Decisions Made

**1. Structure-first pedagogy (L4.03 before L4.04)**
- Rationale: Teaching the three-part structure before particle nuances prevents cognitive overload, per 15-RESEARCH.md recommendation
- Impact: Learners grasp conditional mechanics before tackling certainty distinctions

**2. Certainty scale as organizing framework**
- Rationale: Law-in-idha spectrum is the most intuitive way to understand particle choice (15-RESEARCH.md Pitfall 1)
- Visual: `IMPOSSIBLE ←——— UNCERTAIN ———→ EXPECTED`
- Impact: Transforms memorization into conceptual understanding

**3. In vs idha explicit confusion prevention**
- Rationale: Most common learner error (treating them as interchangeable)
- Teaching: إِذَا is fundamentally temporal "when" (expected), إِنْ is uncertain "if"
- Implementation: Multiple callouts and comparative exercises in L4.04

**4. Isolated morpheme diacritics acceptable at 67%**
- Rationale: STATE.md line 92 - pedagogical clarity for citation forms
- Applied to: Individual verb forms shown in mood comparison tables and particle examples
- Validation: 24 isolated terms at 67% in L4.03, 70 in L4.04 (acceptable per project decisions)

## Deviations from Plan

None - plan executed exactly as written.

Isolated morpheme diacritics at 67% are not deviations but rather application of established project decision (STATE.md line 92) for pedagogical clarity when showing verb citation forms and isolated particles.

## Issues Encountered

**Diacritics validation on isolated morphemes**
- Issue: Validator flagged isolated verb forms and particles at 67% (e.g., إِذَا, تَنْصُرُوا۟, وَإِن)
- Resolution: Applied STATE.md decision line 92 - isolated morphemes <70% acceptable for pedagogical clarity
- Context: These are citation forms in grammar tables and inline particle references, not running Quranic text
- Verification: Running Quranic text (ArabicExample components) maintains >70% ratio

**Terminology validator false positives**
- Issue: Validator flagged letter names (إِ, أَ) as missing bilingual format
- Resolution: These are letter name references in context (discussing hamza forms), not grammar term first mentions
- Status: Known validator limitation per STATE.md lines 164-165 (lacks context awareness)

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for next plans:**
- Conditional foundation complete for subsequent particle lessons (L4.05 Exception, L4.10 Negation)
- Mood change pedagogy established for weak verb lessons (L4.11-15)
- Level 4 lesson structure consistent with L4.01-02 (already executed)

**No blockers** - all validation passed with acceptable isolated morpheme ratios per project decisions

**Forward dependencies:**
- L4.05 Exception Particles can build on conditional particle pedagogy (similar particle-based mood changes)
- L4.10 Negation Particles will reference conditional mood changes as parallel structure
- L5.07 Complex Conditional Structures will extend this foundation to nested and multi-clause conditions

---
*Phase: 15-level-4-advanced*
*Completed: 2026-02-07*
