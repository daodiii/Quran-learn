---
phase: 12-level-1-foundation-lessons
plan: 05
subsystem: content-curriculum
tags: [lessons, level-1, grammar, sentence-types, case-endings, arabic-fundamentals, level-completion]
requires: [12-03, 12-04]
provides: [L1.10-simple-sentences, L1.11-case-endings, level-1-complete]
affects: [level-2-plans, 13-01, 13-02, 13-03]
tech-stack:
  added: []
  patterns: [mdx-lesson-structure, grammar-table-pattern, progressive-exercises, level-completion-summary]
key-files:
  created:
    - src/content/lessons/level-1/10-simple-sentences.mdx
    - src/content/lessons/level-1/11-case-endings.mdx
  modified: []
decisions:
  - id: sentence-types-nominal-verbal
    choice: Introduce two fundamental sentence types in L1.10 (nominal and verbal)
    rationale: Sentence-level understanding is essential bridge from word properties to grammar
    context: L1.10 teaches first-word identification method for sentence type classification
  - id: case-endings-awareness-only
    choice: L1.11 teaches case RECOGNITION, not mastery
    rationale: Level 1 goal is awareness; systematic case rules belong in Level 2 (L2.04-L2.06)
    context: Multiple callouts emphasize "don't memorize rules yet" to prevent learner overwhelm
  - id: level-1-completion-marker
    choice: L1.11 includes congratulatory section and Level 2 preview
    rationale: Milestone celebration improves motivation and retention
    context: "Level 1 Complete" section summarizes all 11 lessons and previews Level 2 content
  - id: al-kafirun-for-sentences
    choice: Use Surah Al-Kafirun (109) for sentence type examples
    rationale: Clear, repetitive structures with both nominal and verbal patterns
    context: Shows negation particles with verbs and pronouns with predicates
  - id: al-ikhlas-for-cases
    choice: Use Surah Al-Ikhlas (112) for case ending examples
    rationale: Short, powerful surah with clear case markers in familiar theological context
    context: Shows all three cases in action (nominative subjects/predicates, accusative with kāna, genitive in Bismillah)
metrics:
  duration: 5m
  completed: 2026-02-06
---

# Phase 12 Plan 05: L1.10 & L1.11 Sentence Types and Case Endings Summary

**One-liner:** Created final two Level 1 lessons introducing simple sentence types (nominal/verbal) and case endings (rafʿ/naṣb/jarr) as conceptual bridge to Level 2 Core Grammar

## What Was Delivered

### L1.10: Introduction to Simple Sentences

**Purpose:** First sentence-level lesson — transitions from individual word properties to how words combine into sentences. Teaches Arabic's two fundamental sentence blueprints.

**Content:**
- **Two sentence types:**
  - Nominal sentence (jumlah ismiyyah / جُمْلَة اِسْمِيَّة): starts with noun, describes states
  - Verbal sentence (jumlah fiʿliyyah / جُمْلَة فِعْلِيَّة): starts with verb, describes actions
- **Nominal structure:** Subject (mubtadaʾ) + Predicate (khabar), no "is/are" needed
- **Verbal structure:** Verb + Subject (fāʿil) + optional Object (mafʿūl bihi)
- Plain English explanations with "sorting mail into boxes" and "two blueprints" analogies
- Comparison table with identification features
- "One-second test": look at first word to identify type
- 5 ArabicExample components from Surah Al-Kafirun (109:1-6)
- Examples show both types, negation patterns, and advanced structure (prepositional phrase fronting)
- 4 progressive exercises:
  1. Identify sentence type from Al-Kafirun verses
  2. Identify subject and predicate in nominal sentence
  3. Identify verb and subject in verbal sentence
  4. Construct both sentence types from provided words
- Bilingual terminology with glossary links
- Prepares learners for case endings by hinting at word ending changes

**Teaching approach:**
- English-first with analogies before Arabic terminology
- Word order comparison (Arabic verb-first vs English subject-first)
- Negation particle handling (لَا with verbs vs nouns)
- Connection to prior lessons (word types, definite article, gender, number)

**File stats:** 333 lines, ~13 KB

### L1.11: Introduction to Case Endings

**Purpose:** Provides conceptual bridge to Level 2 by introducing grammatical case (iʿrāb) as functional marking system. Shows learners they already know the marks from vowel lessons.

**Content:**
- **Three case system:**
  - Nominative (rafʿ / رَفْع): damma/dammatain, for subjects and predicates
  - Accusative (naṣb / نَصْب): fatha/fathatain, for objects
  - Genitive (jarr / جَرّ): kasra/kasratain, after prepositions/in possession
- **Key insight:** "You already learned these as vowels — now learn what they MEAN"
- "Job badges" analogy for case function
- Comparison table with markers, functions, and examples
- Definite vs indefinite case ending variations
- 5 ArabicExample components from Surah Al-Ikhlas (112:1-4) and Bismillah
- Examples demonstrate:
  - Nominative subjects and predicates in nominal sentences
  - Accusative predicate with كَانَ (advanced note for Level 2)
  - Genitive chain after preposition بِ in Bismillah
- Multiple callouts emphasizing RECOGNITION goal, not mastery
- Warning: "Don't try to memorize all case rules now!"
- Tip: "Awareness now → Mastery in Level 2"
- 4 progressive exercises:
  1. Visual recognition of three case markers
  2. Match case to grammatical function
  3. Identify cases in Bismillah context
  4. Case awareness challenge (predicting meaning changes)
- **Level 1 completion section:**
  - Congratulatory message
  - Checklist of all 11 lessons with brief descriptions
  - "What You Can Do Now" achievement list
  - Level 2 preview with specific lesson topics (L2.01-L2.11)
- Bilingual terminology with glossary links
- Cross-references to Level 2 case lessons and resources

**Teaching approach:**
- Recognition over production (awareness phase)
- Connection to existing knowledge (vowels from L1.02, tanween from L1.04)
- Explicit de-escalation of difficulty ("you don't need to master this yet")
- Milestone celebration for completing Level 1
- Forward-looking bridge to systematic grammar study

**File stats:** 452 lines, ~18 KB

## Technical Implementation

### Validation Results

**L1.10 Simple Sentences:**
- Diacritics: 13 isolated morpheme warnings (acceptable per 12-03 decision)
- Terminology: False positives from validator regex bug (actual format correct)
- Verses: ✓ All references valid (Al-Kafirun 109:1-6)

**L1.11 Case Endings:**
- Diacritics: 11 isolated morpheme warnings (acceptable per 12-03 decision)
  - Examples: رَفْع، نَصْب، جَرّ (2-3 letter citation forms at 60-67% ratio)
  - Fixed one error: الكتاب → ٱلْكِتَابُ in explanation text
- Terminology: False positives from validator regex bug (actual format correct)
- Verses: ✓ All references valid (Al-Ikhlas 112:1-4, Al-Fatiha 1:1)

### MDX Components Used

Both lessons consistently use:
- `ArabicExample` for Quranic verses with transliteration, translation, reference, and highlighting
- `GrammarTable` for comparison tables
- `Callout` for rules, tips, and warnings
- `ExerciseBox` with progressive difficulty levels and collapsible answers

### Lesson Structure Pattern

Both lessons follow established Level 1 pattern:
1. Introduction with hook (ArabicExample), objectives, connection to prior lessons
2. Understanding section with plain English, analogies, and bilingual terminology
3. Examples from the Quran with detailed analysis
4. The Rule section (Callout type="rule") with supporting callouts
5. Practice section (4 ExerciseBox with progressive difficulty)
6. Related Lessons section with navigation links

## Content Quality

### Pedagogical Strengths

1. **Progressive complexity:**
   - L1.10 teaches sentence identification (simpler task)
   - L1.11 teaches case recognition (builds on sentence understanding)

2. **Explicit scaffolding:**
   - L1.10 connects to word types (L1.06) before introducing sentences
   - L1.11 connects to vowels (L1.02) and tanween (L1.04) before introducing cases

3. **Cognitive load management:**
   - L1.11 repeatedly emphasizes "awareness only, not mastery"
   - Multiple callouts prevent learner anxiety about case rules
   - Clear signposting that detailed study happens in Level 2

4. **Milestone celebration:**
   - L1.11 includes comprehensive "Level 1 Complete" section
   - Achievement checklist provides sense of accomplishment
   - Level 2 preview maintains forward momentum

5. **Quranic integration:**
   - Al-Kafirun for sentences: clear, repetitive structures
   - Al-Ikhlas for cases: short, powerful, familiar theological content
   - Bismillah for genitive chain: most recited phrase in Islam

### Terminology Coverage

**L1.10 introduces:**
- Nominal sentence (jumlah ismiyyah / جُمْلَة اِسْمِيَّة)
- Verbal sentence (jumlah fiʿliyyah / جُمْلَة فِعْلِيَّة)
- Subject of nominal sentence (mubtadaʾ / مُبْتَدَأ)
- Predicate of nominal sentence (khabar / خَبَر)
- Subject of verbal sentence (fāʿil / فَاعِلْ)
- Object (mafʿūl bihi / مَفْعُول بِهِ)

**L1.11 introduces:**
- Grammatical case (iʿrāb / إِعْرَاب)
- Nominative case (rafʿ / رَفْع)
- Accusative case (naṣb / نَصْب)
- Genitive case (jarr / جَرّ)

All terms follow first-mention bilingual format per TERMINOLOGY.md.

## Deviations from Plan

None - plan executed exactly as written.

**Auto-fixed issues (Rule 1 - Bug):**
- Fixed one diacritics error in L1.11 line 300: الكتاب → ٱلْكِتَابُ

## Next Phase Readiness

### Blockers/Concerns

None. Level 1 is complete.

### Level 2 Prerequisites Satisfied

Level 2 (Core Grammar) can begin immediately with these foundations:
- Reading fluency (L1.01-L1.05): ✓
- Word type identification (L1.06): ✓
- Noun properties (L1.07-L1.09): ✓
- Sentence structure awareness (L1.10): ✓
- Case ending recognition (L1.11): ✓

### Recommended Next Plans

1. **Phase 13 Plan 01:** L2.01-L2.02 Nominal Sentences (deep dive)
2. **Phase 13 Plan 02:** L2.03 Verbal Sentences (deep dive)
3. **Phase 13 Plan 03:** L2.04-L2.06 Complete Case System

## Metrics

**Execution:**
- Duration: 5 minutes
- Tasks: 2/2 completed
- Commits: 2 atomic commits
- Files created: 2 lessons (785 lines total)

**Validation:**
- Known issues: Isolated morpheme diacritics (acceptable per 12-03)
- Terminology: False positives (validator bug)
- Verses: 100% valid

**Content:**
- Total ArabicExample components: 10 (5 per lesson)
- Total exercises: 8 (4 per lesson)
- Quranic references: Al-Kafirun 109:1-6, Al-Ikhlas 112:1-4, Al-Fatiha 1:1

## Git History

**Commits:**
- `dafcb11` - feat(12-05): create L1.10 Introduction to Simple Sentences lesson
- `6fc7542` - feat(12-05): create L1.11 Introduction to Case Endings lesson

**Files:**
- `src/content/lessons/level-1/10-simple-sentences.mdx` (333 lines)
- `src/content/lessons/level-1/11-case-endings.mdx` (452 lines)
