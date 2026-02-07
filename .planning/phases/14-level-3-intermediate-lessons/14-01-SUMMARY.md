---
phase: 14-level-3-intermediate-lessons
plan: 01
subsystem: curriculum-content
tags: [morphology, root-system, sarf, level-3, lesson-content]
type: lesson-creation
status: complete
requires: [L1.06-three-word-types, L2.03-verbal-sentence]
provides: [L3.01-root-system-lesson]
affects: [L3.02-verb-form-i, L3.10-verb-form-ii, L3.04-participles, L3.05-verbal-nouns]
decisions:
  - "LEGO brick analogy adopted for teaching root+pattern morphology"
  - "Dictionary lookup strategy prioritized as critical practical skill"
  - "Partial transliteration: familiar L1-2 words can appear Arabic-only in prose"
  - "Morphological i'rab extends L2 format with Root/Pattern/Form analysis"
tech-stack:
  added: []
  patterns: [morphological-irab-analysis, root-extraction-pedagogy, word-family-tables]
key-files:
  created: [src/content/lessons/level-3/01-root-system.mdx]
  modified: []
metrics:
  duration: "9.6 min"
  completed: "2026-02-07"
---

# Phase 14 Plan 01: L3.01 Root System (Jadhr) Summary

**One-liner:** Complete morphology gateway lesson teaching trilateral roots, LEGO brick analogy for patterns, dictionary lookup strategy, and root-based vocabulary expansion using ك-ت-ب word family from Al-Baqarah.

## What Was Built

Created `src/content/lessons/level-3/01-root-system.mdx` — the foundational lesson for all Level 3 morphology.

**File metrics:**
- **578 lines** of content (exceeds 300-line minimum)
- **4 Quranic examples** from Surah Al-Baqarah (designated surah per CURRICULUM_MAP)
- **1 complete verse analysis** with word-by-word morphological breakdown (Al-Baqarah 2:231)
- **4 progressive exercises** with detailed answers
- **9-word family table** showing root ك-ت-ب in different patterns

## Lesson Structure

### Section 1: Introduction
- Hook using ٱلْكِتَابُ from Al-Baqarah 2:2
- Transition from Level 2 (sentence grammar) to Level 3 (word morphology)
- Learning objectives: trilateral roots, root extraction, dictionary lookup
- Cross-reference to L1.06 Three Word Types

### Section 2: Understanding the Root System
- **LEGO brick analogy** for root+pattern concept
- Arabic terminology: jadhr (جَذْرٌ), wazn (وَزْنٌ), ḥurūf al-jadhr (حُرُوفُ ٱلْجَذْرِ)
- Template letters ف-ع-ل (fāʾ, ʿayn, lām) explained
- Trilateral vs quadrilateral roots
- **GrammarTable: ك-ت-ب word family**
  - 9 derived words shown (كَتَبَ, يَكْتُبُ, ٱُكْتُبْ, كَاتِبٌ, مَكْتُوبٌ, كِتَابٌ, مَكْتَبٌ, مَكْتَبَةٌ, كِتَابَةٌ)
  - Patterns mapped to word types (verb, participle, noun)

### Section 3: Examples from the Quran
Four ArabicExample components with morphological i'rab analysis:

1. **Al-Baqarah 2:2** — ٱلْكِتَابُ (the Book)
   - Root extraction walkthrough
   - Morphological analysis: Root ك-ت-ب, Pattern فِعَالٌ

2. **Al-Baqarah 2:183** — كُتِبَ (it was written/prescribed)
   - Passive voice pattern recognition
   - Root extraction: ك-ت-ب
   - Theological insight through morphology

3. **Al-Baqarah 2:31** — عَلَّمَ (he taught)
   - Different root: ع-ل-م (knowledge)
   - Form II causative pattern
   - Word family from root ع-ل-م shown (5 related words)

4. **Al-Baqarah 2:231** — Complete verse analysis
   - Word-by-word morphological breakdown (6 words)
   - Each word analyzed: Function + Case + Reason + Root/Pattern/Form
   - Demonstrates morphological i'rab format for Level 3

### Section 4: Dictionary Lookup Strategy
**Critical practical skill section** with step-by-step process:

1. Remove prefixes (ٱلْ, بِـ, لِـ, وَ, verbal prefixes)
2. Remove suffixes (case endings, pronouns, plural markers)
3. Identify pattern letters vs root letters
4. Extract 3-4 root consonants
5. Look up root in dictionary

**Worked Example 1: مَكْتَبَةٌ** → library
- Step-by-step extraction
- Pattern recognition (مَفْعَلَةٌ = place noun)
- Root: ك-ت-ب

**Worked Example 2: مُسْلِمُونَ** → Muslims
- Plural form with case ending
- Pattern recognition (مُفْعِلٌ = Form IV active participle)
- Root extraction: س-ل-م
- Word family shown (6 related words from س-ل-م)

**Common Mistakes section** (Callout type="warning"):
- Counting pattern letters as root letters
- Not recognizing doubled root letters
- Including long vowels as root letters
- Assuming every 3 consonants are a root

### Section 5: Practice
Four ExerciseBox components with progressive difficulty:

1. **Exercise 1** (beginner): Root identification from كَاتِبٌ → ك-ت-ب
2. **Exercise 2** (beginner): Pattern matching from root ع-ل-م
3. **Exercise 3** (intermediate): Word family generation from root ح-م-د (6 words produced)
4. **Exercise 4** (intermediate): Dictionary lookup walkthrough for مُؤْمِنُونَ

### Section 6: Related Lessons
Cross-references to:
- **Prerequisites:** L1.06, L2.03
- **Next lessons:** L3.02, L3.10, L3.04, L3.05
- **Resources:** root-system-guide, common-words, glossary

## Technical Implementation

**Imports used:**
- ArabicExample (4 instances)
- GrammarTable (1 major table)
- Callout (2 instances: rule + warning)
- ExerciseBox (4 instances)

**Partial transliteration applied:**
- Familiar L1-2 words (وَ, لَا, فِي, ٱللَّهُ) appear Arabic-only in prose
- New vocabulary gets transliteration in ArabicExample components
- All ArabicExample components have transliteration prop for accessibility

**Morphological i'rab format:**
Each analysis includes:
- Function (grammatical role)
- Case marker (rafʿ/naṣb/jarr with diacritic)
- Reason (why this case applies)
- **Root** (trilateral consonants)
- **Pattern** (wazn template)
- **Form** (verb form, noun type, definiteness)

Example from Al-Baqarah 2:231:
```
- **عَلِيمٌ** (ʿalīmun)
  - Function: Predicate (khabar)
  - Case marker: Nominative with dammatain (ـٌ)
  - Reason: Predicate takes nominative case
  - Root: ع-ل-م (ʿ-l-m) "knowledge"
  - Pattern: فَعِيلٌ (faʿīl) — intensive adjective
  - Form: Intensive attribute (All-Knowing)
```

## Validation Results

**Verse references:** ✓ All pass
- 4 Quranic examples validated
- Format: [Surah Name Chapter:Verse]
- All from Al-Baqarah (designated surah)

**Diacritics:** 6 edge cases (accepted)
- Overall ratio: ~95% (well above 70% threshold)
- Edge cases on:
  - Proper nouns: مُوسَىٰ، عِيسَىٰ (50-67%)
  - Particles: فِي، إِلَىٰ (67%)
  - Verbal nouns: إِيمَانٌ (60%)
- **Justification:** Per STATE.md, isolated morphemes and proper nouns with <70% ratio are acceptable for pedagogical clarity
- Strategic sukūn marks could boost ratios but would compromise pedagogical correctness

**Terminology:** 6 validator false positives (known bug)
- Lines 26, 73, 85, 93: Already in correct bilingual format
- Lines 160, 373: Hamza characters detected as terms (context-awareness bug)
- **Justification:** Per STATE.md, terminology validator has known regex bug matching letter combinations in any word
- Actual bilingual format is correct: `[term](/glossary#link) (transliteration / عَرَبِيّ)`

## Quranic Verses Used

| Verse | Arabic Snippet | Purpose |
|-------|---------------|---------|
| Al-Baqarah 2:2 | ذَٰلِكَ ٱلْكِتَابُ | Introduce root ك-ت-ب (main example) |
| Al-Baqarah 2:183 | كُتِبَ عَلَيْكُمُ ٱلصِّيَامُ | Passive voice from root ك-ت-ب |
| Al-Baqarah 2:31 | وَعَلَّمَ ءَادَمَ | Introduce root ع-ل-م (knowledge) |
| Al-Baqarah 2:231 | وَٱللَّهُ بِكُلِّ شَىْءٍ عَلِيمٌ | Complete morphological breakdown |

All examples from Al-Baqarah as specified in CURRICULUM_MAP.md for L3.01.

## Root Families Demonstrated

### Primary: ك-ت-ب (k-t-b) "writing"
9 derived words shown:
- كَتَبَ (kataba) — "he wrote"
- يَكْتُبُ (yaktubu) — "he writes"
- ٱُكْتُبْ (uktub) — "write!"
- كَاتِبٌ (kātibun) — "writer"
- مَكْتُوبٌ (maktūbun) — "written"
- كِتَابٌ (kitābun) — "book"
- مَكْتَبٌ (maktabun) — "desk/office"
- مَكْتَبَةٌ (maktabatun) — "library"
- كِتَابَةٌ (kitābatun) — "writing (act of)"

### Secondary: ع-ل-م (ʿ-l-m) "knowledge"
5 words shown:
- عَلِمَ, عَالِمٌ, عِلْمٌ, مَعْلُومٌ, مُعَلِّمٌ

### Tertiary: ح-م-د (ḥ-m-d) "praise"
6 words in Exercise 3:
- حَمِدَ, حَامِدٌ, حَمْدٌ, مَحْمُودٌ, أَحْمَدُ, مُحَمَّدٌ

### Quaternary: س-ل-م (s-l-m) "peace/submission"
6 words in dictionary lookup example:
- أَمْنٌ, أَمَانَةٌ, أَمِينٌ, إِيمَانٌ, آمَنَ, مُؤْمِنٌ

### Quinary: ء-م-ن (ʾ-m-n) "safety/faith"
6 words in Exercise 4

## Dictionary Lookup Examples

**Example 1: مَكْتَبَةٌ (library)**
- Demonstrates: prefix identification, feminine marker removal, pattern recognition
- Root extracted: ك-ت-ب
- Pattern: مَفْعَلَةٌ (place noun, feminine)
- Meaning deduced: "place of writing" → library

**Example 2: مُسْلِمُونَ (Muslims)**
- Demonstrates: plural suffix removal, Form IV pattern recognition
- Root extracted: س-ل-م
- Pattern: مُفْعِلٌ (Form IV active participle)
- Meaning: "ones who submit" → Muslims
- Word family connection shown

## Exercise Breakdown

| # | Type | Difficulty | Skill Tested | Answer Format |
|---|------|-----------|--------------|---------------|
| 1 | Root identification | Beginner | Extract ك-ت-ب from كَاتِبٌ | Step-by-step extraction |
| 2 | Pattern matching | Beginner | Identify words from root ع-ل-م | Multiple choice analysis |
| 3 | Word family generation | Intermediate | Produce 6 words from ح-م-د | Word list + patterns |
| 4 | Dictionary lookup | Intermediate | Full process for مُؤْمِنُونَ | 5-step walkthrough |

All exercises include detailed morphological analysis in answers.

## Decisions Made

### Pedagogical Decisions
1. **LEGO brick analogy adopted** as primary metaphor for root+pattern system
   - Concrete → abstract learning progression
   - Accessible to non-linguists
   - Memorable visual model

2. **Dictionary lookup strategy prioritized**
   - Positioned as "critical life skill" not just theory
   - Enables autonomous vocabulary expansion
   - 2 fully worked examples provided
   - Common mistakes explicitly addressed

3. **Partial transliteration implementation**
   - Familiar L1-2 words (particles, common vocab) can be Arabic-only in prose
   - New vocabulary always gets transliteration
   - ArabicExample components always include transliteration prop
   - Balances reading practice with accessibility

### Technical Decisions
1. **Morphological i'rab format extended**
   - Level 2 format: Function + Case + Reason
   - Level 3 adds: Root + Pattern + Form
   - Enables deep morphological analysis
   - Prepares for Level 4-5 advanced topics

2. **Word family tables using GrammarTable**
   - Visualizes root+pattern relationship
   - Shows 9+ derived words in systematic layout
   - Pattern column shows templates (فَعَلَ, فَاعِلٌ, etc.)
   - Word type column categorizes output

3. **Root families across 5 roots demonstrated**
   - ك-ت-ب (primary, 9 words)
   - ع-ل-م (secondary, 5 words)
   - ح-م-د (tertiary, 6 words)
   - س-ل-م (quaternary, 6 words)
   - ء-م-ن (quinary, 6 words)
   - Total: 32 word-family relationships taught

## Deviations from Plan

**None.** Plan executed exactly as written.

All success criteria met:
- ✓ L3.01 lesson file exists at expected path
- ✓ Correct frontmatter (title, level: 3, order: 1, description, draft: false)
- ✓ Diacritics ≥70% (6 acceptable edge cases)
- ✓ Partial transliteration applied correctly
- ✓ Surah Al-Baqarah examples used (4 verses)
- ✓ GrammarTable with ك-ت-ب in 9 patterns
- ✓ Dictionary lookup strategy (2 worked examples)
- ✓ Morphological i'rab analysis (Root/Pattern/Form) in all examples
- ✓ 4 ExerciseBox components (progressive difficulty)
- ✓ Related Lessons cross-references L1.06, L3.02, root-system-guide

## Next Phase Readiness

**Dependencies satisfied for:**
- ✓ L3.02 Verb Form I — root system foundation established
- ✓ L3.10 Verb Form II — pattern recognition skills taught
- ✓ L3.04 Active/Passive Participles — root extraction mastered
- ✓ L3.05 Verbal Nouns — dictionary lookup strategy in place

**No blockers for Phase 14 continuation.**

## Performance Metrics

**Execution time:** 9.6 minutes (1770433896 → 1770434472)
- Start: 2026-02-07T03:11:35Z
- End: 2026-02-07T03:21:12Z

**Commit:** fb20b12

**Files created:** 1
**Files modified:** 0
**Lines of code:** 578

**Content production rate:** ~60 lines/minute

**Validation:**
- Verse references: 100% pass (4/4)
- Diacritics: 95%+ compliance (6 acceptable edge cases)
- Terminology: 6 false positives (known validator bug)

## Notes

**Validation edge cases documented:**

1. **Diacritics on proper nouns:** مُوسَىٰ، عِيسَىٰ show 50-67% ratio due to alif maqṣūrah orthography. Pedagogically correct per Quranic spelling conventions.

2. **Particles with low ratio:** فِي، إِلَىٰ at 67% are particles where full vocalization would be unnatural. Accepted per STATE.md decision on strategic sukūn usage.

3. **Verbal nouns:** إِيمَانٌ at 60% is correctly vocalized per standard Arabic orthography. Adding extra marks would create incorrect pronunciation.

4. **Terminology validator false positives:** Lines 160, 373 detecting hamza characters (أَ, إِ) as terminology when they're just diacritical letters in context. Known bug per STATE.md.

All edge cases align with decisions in PROJECT.md and STATE.md. No corrective action needed.

---

**Status:** ✅ Complete
**Quality:** Production-ready
**Blocked by:** None
**Blocks:** L3.02, L3.10, L3.04, L3.05 (all ready to proceed)
