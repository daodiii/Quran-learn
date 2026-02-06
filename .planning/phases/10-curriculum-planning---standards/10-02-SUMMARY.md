---
phase: 10-curriculum-planning---standards
plan: 02
subsystem: documentation
tags: [curriculum, terminology, style-guide, mdx, transliteration, arabic]

# Dependency graph
requires:
  - phase: 09-content-infrastructure
    provides: MDX component implementations (ArabicExample, GrammarTable, VerbConjugation, Callout, ExerciseBox)
provides:
  - Canonical bilingual terminology standards (TERMINOLOGY.md)
  - Lesson style guide with template and formatting rules (STYLE_GUIDE.md)
  - Transliteration scheme (simplified ALA-LC)
  - Verse reference format standards
  - MDX component usage reference
affects: [12-level-1-foundation-lessons, 13-level-2-core-grammar-lessons, 14-level-3-morphology-lessons, 15-level-4-advanced-syntax-lessons, 16-level-5-rhetoric-lessons, 11-content-validation-tooling]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Graduated transliteration (full at L1-2, partial at L3, minimal at L4-5)"
    - "Bilingual terminology first-mention format: 'English (transliteration / عَرَبِي)'"
    - "5-part lesson structure (Introduction, Concept, Examples, Rule, Practice)"
    - "Simplified ALA-LC transliteration with Unicode diacritics"

key-files:
  created:
    - docs/TERMINOLOGY.md
    - docs/STYLE_GUIDE.md
  modified: []

key-decisions:
  - "Use simplified ALA-LC transliteration (reader-friendly, not linguistic precision)"
  - "Graduated transliteration rules by level (full→partial→minimal)"
  - "Every Arabic letter must have tashkeel (validation enforced)"
  - "Verse reference format: [Surah Name Chapter:Verse]"
  - "First-mention bilingual format for all grammar terms"
  - "letter-spacing: 0 for all Arabic text (prevents disconnection)"

patterns-established:
  - "Plain English explanation first, Arabic terminology last (PDGY-01, PDGY-03)"
  - "Show patterns before rules (PDGY-04)"
  - "One major concept per lesson (PDGY-08)"
  - "English analogies for grammar concepts (PDGY-02)"

# Metrics
duration: 7min
completed: 2026-02-06
---

# Phase 10 Plan 02: Bilingual Terminology & Lesson Style Guide

**112 canonical bilingual grammar terms with simplified ALA-LC transliteration, 5-part lesson template structure, and graduated transliteration rules enforcing pedagogical consistency across all 73 lessons**

## Performance

- **Duration:** 7 min
- **Started:** 2026-02-06T18:19:11Z
- **Completed:** 2026-02-06T18:25:39Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Established canonical English/Arabic/transliteration for 112 grammar terms across nahw (grammar), sarf (morphology), and diacritics categories
- Documented 5-part lesson template structure enforcing pedagogical principles (plain English first, Arabic terminology last, patterns before rules)
- Created simplified ALA-LC transliteration scheme with full consonant/vowel mappings and graduated usage rules per level
- Standardized verse reference format and MDX component usage patterns
- Defined validation-ready standards for diacritics completeness, terminology consistency, and formatting compliance

## Task Commits

Each task was committed atomically:

1. **Task 1: Create TERMINOLOGY.md with canonical bilingual terms** - `3d2a7da` (feat)
2. **Task 2: Create STYLE_GUIDE.md with lesson template and transliteration scheme** - `b7a3545` (feat)

## Files Created/Modified

- `docs/TERMINOLOGY.md` - Canonical bilingual terminology for all Arabic grammar concepts
  - 112 term entries with English, Arabic (full tashkeel), transliteration, definition, and first-used lesson reference
  - Usage rules for first-mention format and glossary linking
  - Categories: Sentence Types, Case System, Word Types, Sentence Components, Inna/Kaana Families, Definiteness, Advanced Syntax, Rhetoric, Root & Pattern System, Verb Forms, Tenses & Moods, Derived Nouns, Pronouns, Verb Classifications, Diacritics & Writing

- `docs/STYLE_GUIDE.md` - Complete lesson authoring standards
  - 5-part lesson template structure with detailed specifications for each section
  - Simplified ALA-LC transliteration scheme (28 consonants, 3 vowels, special marks)
  - Graduated transliteration rules: Level 1-2 (full), Level 3 (partial), Level 4-5 (minimal)
  - Verse reference format: `[Surah Name Chapter:Verse]`
  - Arabic text formatting standards (letter-spacing: 0, line-height: 1.8, full tashkeel requirement)
  - MDX component usage reference for all 5 components (ArabicExample, GrammarTable, VerbConjugation, Callout, ExerciseBox)
  - Cross-reference conventions and validation requirements
  - Writing tips and quality assurance guidelines

## Decisions Made

**1. Simplified ALA-LC transliteration over Buckwalter or strict ALA-LC**
- **Rationale:** Reader accessibility trumps linguistic precision. Buckwalter is ASCII-constrained (outdated). Strict ALA-LC is overly complex for learners. Simplified ALA-LC uses Unicode diacritics (ḥ, ṣ, ṭ, ẓ, ḍ) for emphatic consonants and macrons (ā, ī, ū) for long vowels — familiar to English readers, accurate enough for Quranic study.

**2. Graduated transliteration by level (full → partial → minimal)**
- **Rationale:** Supports learner progression (LSSN-11). Level 1-2 learners are building reading fluency and need full transliteration. Level 3 learners recognize familiar terms and benefit from selective transliteration. Level 4-5 learners read Arabic fluently and find transliteration distracting.

**3. Every Arabic letter must have tashkeel (diacritics)**
- **Rationale:** Quranic Arabic without full vocalization is ambiguous. Learners need accurate pronunciation models. Validation scripts will enforce diacritics completeness programmatically (LSSN-07).

**4. Bilingual first-mention format: "English (transliteration / عَرَبِي)"**
- **Rationale:** Balances accessibility (English), pronunciation (transliteration), and authenticity (Arabic). Learners build vocabulary in both languages simultaneously (PDGY-03). Glossary linking on first mention enables quick reference.

**5. Verse reference format: `[Surah Name Chapter:Verse]`**
- **Rationale:** Unambiguous identification. Including both surah name AND chapter number prevents confusion (multiple names for same surah, transliteration variants). Colon separator is standard in academic citations.

**6. letter-spacing: 0 for all Arabic text**
- **Rationale:** CRITICAL for Arabic rendering. Any positive letter-spacing breaks cursive letter connections in web browsers. Documented in STYLE_GUIDE.md as non-negotiable formatting rule.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - both documentation files created successfully with all required content.

## Next Phase Readiness

**Ready for Plan 03 (Content Validation Tooling):**
- TERMINOLOGY.md provides canonical term list for validation scripts to enforce
- STYLE_GUIDE.md documents all rules that need programmatic checking (diacritics, terminology, verse references, component usage)
- Both files structured for machine parsing (markdown tables, consistent formatting)

**Ready for Plans 12-16 (Lesson Authoring):**
- Lesson authors have complete template to follow
- All 5 MDX components documented with usage examples
- Transliteration scheme eliminates guesswork
- Terminology standardization prevents inconsistency

**Blockers/Concerns:**
- None identified
- Validation scripts (Plan 03) will need access to Quran metadata (114 surahs, verse counts) for verse reference validation
- Expert validation workflow (Arabic linguist + Muslim educator) still needs establishment for content QA

---
*Phase: 10-curriculum-planning---standards*
*Completed: 2026-02-06*
