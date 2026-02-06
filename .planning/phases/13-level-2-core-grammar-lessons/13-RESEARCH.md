# Phase 13: Level 2 Core Grammar Lessons - Research

**Researched:** 2026-02-06
**Domain:** Intermediate Arabic grammar pedagogy, i'rab analysis, MDX lesson authoring
**Confidence:** HIGH

## Summary

Phase 13 involves creating 11 Level 2 Core Grammar lessons (L2.01-L2.11) teaching the three-case system, sentence structures (nominal/verbal), possessive constructions (idafah), and special particles (inna/kaana sisters). This research examines what makes Level 2 distinct from Level 1 and what planners need to know to create these intermediate grammar lessons effectively.

The key difference between Level 1 and Level 2:
1. **Level 1 = RECOGNITION** - "Here's what case endings look like"
2. **Level 2 = MASTERY** - "Here's WHEN and WHY to use each case"

Level 2 introduces **i'rab (grammatical parsing) analysis** as a new requirement (LSSN-09). Every key example must include explicit grammatical analysis showing:
- Word function (subject, object, predicate, etc.)
- Case assigned (nominative/accusative/genitive)
- Reason for the case (follows preposition, is subject, etc.)

The infrastructure from Phase 12 (Level 1) remains unchanged. The challenge is applying the established patterns with higher grammatical complexity while maintaining pedagogical clarity.

**Primary recommendation:** Build on Phase 12 patterns with added i'rab analysis sections for each Quranic example. Use the same 5-part structure, full transliteration, and validation tooling. Focus lesson planning on WHEN/WHY rules rather than WHAT/IDENTIFY recognition.

## Standard Stack

### Core (Unchanged from Phase 12)

| Component | Version | Purpose | Why Standard |
|-----------|---------|---------|--------------|
| Astro v5 + MDX | 5.17.1+ | Static site generator with interactive components | Same infrastructure as Level 1 |
| Zod schemas | Built-in | Frontmatter validation | Already configured in content.config.ts |
| TypeScript + tsx | Runtime | Validation script execution | Proven in Phase 12 |

### Validation Tools (Unchanged from Phase 12)

| Script | Purpose | Required Threshold |
|--------|---------|-------------------|
| `validate:diacritics` | Arabic vocalization completeness | ≥70% diacritics ratio |
| `validate:terminology` | Bilingual term consistency | Match TERMINOLOGY.md entries |
| `validate:verses` | Quranic reference format | [Surah Name Chapter:Verse] |
| `quran:lookup` | Verse text retrieval helper | Build-time tool for authoring |

**Installation:** No new dependencies. All tools established in Phases 9-12.

## Architecture Patterns

### Lesson File Structure (Unchanged)

```
src/content/lessons/level-2/
├── 01-nominal-sentence.mdx          # L2.01
├── 02-subject-predicate.mdx          # L2.02
├── 03-verbal-sentence.mdx            # L2.03
├── 04-nominative-case.mdx            # L2.04
├── 05-accusative-case.mdx            # L2.05
├── 06-genitive-case.mdx              # L2.06
├── 07-prepositions-genitive.mdx      # L2.07
├── 08-possessive-idafah.mdx          # L2.08
├── 09-adjective-agreement.mdx        # L2.09
├── 10-inna-sisters.mdx               # L2.10
└── 11-kaana-sisters.mdx              # L2.11
```

**Naming convention:** `{order}-{slug}.mdx` (consistent with Level 1)

### Pattern 1: 5-Part Lesson Structure (MANDATORY - Same as Level 1)

**Structure:**
1. **Introduction** - Hook with Quranic example, 2-3 learning objectives, connection to prior lesson
2. **Understanding [Concept]** - Plain English → Analogy → Arabic terminology
3. **Examples from the Quran** - 3-5 examples with **i'rab analysis** (NEW for Level 2)
4. **The Rule** - Callout with concise rule + common mistakes
5. **Practice** - 3-4 ExerciseBox with progressive difficulty

**Source:** STYLE_GUIDE.md Section 1 (lines 19-285)

### Pattern 2: I'rab (Grammatical Parsing) Analysis - NEW REQUIREMENT

**What:** LSSN-09 requires i'rab analysis for key examples starting at Level 2

**Format for i'rab breakdown:**

```markdown
<ArabicExample
  arabic="ٱللَّهُ نُورُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ"
  transliteration="allāhu nūru s-samāwāti wa-l-arḍi"
  translation="Allah is the Light of the heavens and the earth"
  reference="An-Nur 24:35"
  highlight="ٱللَّهُ,نُورُ"
/>

**I'rab Analysis:**
- **ٱللَّهُ** (allāhu): Subject (mubtadaʾ / مُبْتَدَأ) — Nominative case (rafʿ / رَفْع), marked by damma (ـُ)
  - **Function:** The topic being described
  - **Case reason:** Subjects of nominal sentences always take nominative

- **نُورُ** (nūru): Predicate (khabar / خَبَر) — Nominative case (rafʿ / رَفْع), marked by damma (ـُ)
  - **Function:** Information about the subject
  - **Case reason:** Predicates agree with subjects in nominal sentences

- **ٱلسَّمَٰوَٰتِ** (as-samāwāti): Genitive (jarr / جَرّ), marked by kasra (ـِ)
  - **Function:** Second term in idafah (possessive construction)
  - **Case reason:** Nouns in idafah position always take genitive
```

**When to provide i'rab:**
- At least 1 detailed analysis per lesson
- For exercises testing grammatical understanding
- When introducing new grammatical patterns

**Level of detail:**
- Level 2: Word function + case + reason (as shown above)
- Level 3+: Add root, pattern, morphological notes
- Level 5: Complete parsing with all grammatical features

**Source:** LSSN-09 requirement, examples from Phase 12 case endings lesson (L1.11)

### Pattern 3: Full Transliteration (Level 1-2 Standard)

**CRITICAL CLARIFICATION:** CURRICULUM_MAP.md says "balanced transliteration" for Level 2, but STYLE_GUIDE.md Section 3 clarifies:

**"Level 1-2: Full Transliteration"**
- Rule: Transliterate ALL Arabic text
- Rationale: Learners still mastering reading; full transliteration supports pronunciation

**Example:**
```markdown
<ArabicExample
  arabic="ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ"
  transliteration="al-ḥamdu li-llāhi rabbi l-ʿālamīna"
  translation="All praise is for Allah, Lord of all worlds"
  reference="Al-Fatiha 1:2"
/>
```

**"Balanced" refers to pedagogical focus, not transliteration amount:**
- Level 1 = Recognition (full transliteration)
- Level 2 = Mastery with support (full transliteration)
- Level 3 = Independence begins (partial transliteration)

**Source:** STYLE_GUIDE.md lines 376-395

### Pattern 4: Pedagogical Progression (Level 1 → Level 2)

**Level 1 taught:**
- Case endings EXIST (three vowel patterns)
- Visual RECOGNITION (spot damma/fatha/kasra)
- Conceptual AWARENESS (endings show function)

**Level 2 teaches:**
- WHEN each case is used (complete rule sets)
- WHY the case applies (grammatical reasoning)
- HOW to analyze sentences systematically (i'rab)

**Example progression:**

**L1.11 (Case Endings) said:**
> "Level 1 goal: RECOGNITION, not mastery. You don't need to memorize all case rules yet. Right now, just recognize that endings change based on function."

**L2.04 (Nominative Case) will say:**
> "In Level 1, you learned to RECOGNIZE the nominative case (damma ـُ). Now let's learn WHEN and WHY to use it. The nominative case marks four specific grammatical functions..."

**Lesson dependencies:**
- L2.01-03 build on L1.10 (sentence types)
- L2.04-06 expand L1.11 (case recognition → case mastery)
- L2.07-08 require L2.06 (genitive case knowledge)
- L2.09 requires L2.04 + L1.08 (case + gender)
- L2.10-11 require L2.02 (sentence structure knowledge)

**Source:** CURRICULUM_MAP.md Level 1/2 learning objectives, STATE.md decision log

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Quranic verse text | Manual typing with guesswork | `npm run quran:lookup` helper script | Ensures 100% accurate Uthmanic script with complete tashkeel |
| I'rab notation system | Custom parsing markup | Standard prose explanation format (see Pattern 2) | Readable in MDX, no new syntax to learn |
| Case ending validation | Visual inspection | `npm run validate:diacritics` | Catches missing vocalization that breaks pedagogy |
| Grammar term consistency | Author discretion | TERMINOLOGY.md canonical list + `validate:terminology` | Prevents synonym confusion across 73 lessons |

**Key insight:** The validation tooling (Phase 10) was designed specifically to prevent the most common errors in Arabic grammar content authoring. Trust the validators — they catch mistakes humans miss.

## Common Pitfalls

### Pitfall 1: Inconsistent I'rab Terminology

**What goes wrong:** Using multiple terms for the same grammatical function
- Example: "subject" vs "mubtada" vs "topic" for مُبْتَدَأ
- Example: "nominative" vs "marfu'" vs "rafʿ" for رَفْع

**Why it happens:** Author tries to vary language for stylistic reasons

**How to avoid:**
- ALWAYS use first-mention bilingual format from TERMINOLOGY.md
- First mention: "Subject (mubtadaʾ / مُبْتَدَأ)"
- Subsequent: "subject (مُبْتَدَأ)" OR "subject" alone
- NEVER use English synonyms not in TERMINOLOGY.md

**Warning signs:** `validate:terminology` failures, student confusion in exercises

**Source:** TERMINOLOGY.md usage rules, Phase 12 terminology validator bugs discovered

### Pitfall 2: Over-Explaining vs. One Concept Per Lesson

**What goes wrong:** Lesson tries to cover related concepts simultaneously
- Example: L2.04 Nominative Case tries to also explain dual/plural nominative patterns in depth
- Example: L2.08 Idafah tries to teach definite/indefinite rules AND idafah structure

**Why it happens:** Author sees logical connections and wants to be comprehensive

**How to avoid:**
- Stick to the CURRICULUM_MAP.md objective list for that specific lesson
- Related concepts get a **1-sentence mention** and link to future lesson
- Use "You'll learn more about X in [Lesson Y]" liberally
- PDGY-08: One major concept per lesson — resist scope creep

**Warning signs:** Lesson exceeds 400 lines, multiple Callout rule boxes, 6+ exercises

**Source:** PDGY-08 requirement, Phase 12 lesson length patterns (300-400 lines optimal)

### Pitfall 3: I'rab Analysis Without Explicit Reasoning

**What goes wrong:** Analysis states WHAT the case is but not WHY

**Bad example:**
```markdown
- **ٱللَّهُ** (allāhu): Nominative (rafʿ)
```

**Why it's bad:** Student sees the case but doesn't learn the rule

**Good example:**
```markdown
- **ٱللَّهُ** (allāhu): Nominative (rafʿ / رَفْع), marked by damma (ـُ)
  - **Function:** Subject (mubtadaʾ) of nominal sentence
  - **Case reason:** Subjects always take nominative in Arabic
```

**How to avoid:**
- Three-part format: Function + Case marker + Reason
- State the RULE, not just the result
- Think: "A student reading this should learn a pattern they can apply elsewhere"

**Warning signs:** Student exercises show they can identify but not produce correct case usage

**Source:** PDGY-04 (example-heavy, show patterns before rules), LSSN-09 (i'rab analysis requirement)

### Pitfall 4: Assuming Level 1 Prerequisite Knowledge

**What goes wrong:** Lesson uses terms/concepts not yet taught
- Example: L2.01 references "shadda" before reminding students it was L1.04
- Example: L2.05 assumes fluency with definite article rules from L1.07

**Why it happens:** Author has expert knowledge, forgets learner journey

**How to avoid:**
- Check CURRICULUM_MAP.md prerequisite chain for your lesson
- On first use of ANY Level 1 concept, add: "In [L1.X](/path), we learned..."
- Link liberally to prior lessons
- PDGY-06: Cross-references between related lessons

**Warning signs:** Students comment "I don't remember learning this", lesson lacks prerequisite links

**Source:** CURRICULUM_MAP.md prerequisite relationships, PDGY-06 requirement

### Pitfall 5: Quranic Examples That Don't Match the Focus

**What goes wrong:** Verse chosen is too complex or doesn't clearly show the pattern
- Example: Teaching nominative case with a verse that has 3 embedded clauses
- Example: Teaching idafah with a verse containing multiple grammatical constructions

**Why it happens:** Author finds theologically beautiful verse, forces grammatical fit

**How to avoid:**
- Choose verses where target grammar is PROMINENT and ISOLATED
- Simple sentence structure preferred
- Highlight specific words showing the pattern
- Follow CURRICULUM_MAP.md "Quranic Focus" surah recommendations (pedagogically vetted)
- Use `quran:lookup` to explore verses from recommended surahs

**Warning signs:** I'rab analysis becomes 10+ lines, multiple "advanced note" callouts needed

**Source:** CURRICULUM_MAP.md Quranic Focus field (Phase 10 research), LSSN-08 (pedagogically appropriate)

## Code Examples

### Complete Level 2 Lesson Template with I'rab

```mdx
---
title: "The Nominative Case"
level: 2
order: 4
description: "Master when and why to use the nominative case (rafʿ) in Arabic grammar."
draft: false
---

import ArabicExample from '@components/mdx/ArabicExample.astro';
import GrammarTable from '@components/mdx/GrammarTable.astro';
import Callout from '@components/mdx/Callout.astro';
import ExerciseBox from '@components/mdx/ExerciseBox.astro';

## Introduction

In [L1.11](/learn/level-1/case-endings), you learned to visually recognize the nominative case marker — the damma (ـُ) or dammatain (ـٌ) appearing on nouns. But when exactly should a noun take this case? Let's look at a clear example:

<ArabicExample
  arabic="ٱللَّهُ سَمِيعٌ عَلِيمٌ"
  transliteration="allāhu samīʿun ʿalīmun"
  translation="Allah is All-Hearing, All-Knowing"
  reference="Al-Baqarah 2:127"
  highlight="ٱللَّهُ,سَمِيعٌ,عَلِيمٌ"
/>

Notice that ALL three words end with nominative markers. Why? Because they all serve nominative functions in this sentence. In this lesson, you'll learn the complete rule system.

**In this lesson, you will:**
- Identify the four grammatical functions that require nominative case
- Understand why subjects and predicates are nominative
- Apply nominative case rules to Quranic examples with confidence

**Connection:** You've learned WHAT nominative looks like (L1.11). Now let's learn WHEN and WHY to use it.

## Understanding the Nominative Case

**Plain English first:** The nominative case is like the "default" case in Arabic — it marks the most important players in a sentence: the subject (the one doing or being) and the predicate (what's being said about the subject).

**Think of it like uppercase in English:** When you start a sentence, you capitalize the first letter — it's the "marked" position showing importance. Similarly, Arabic marks subjects and predicates with nominative to show they're the core of the sentence.

In Arabic grammar, this case is called [nominative](/resources/glossary#raf) (rafʿ / رَفْع). It's marked by:
- **Damma (ـُ)** on definite nouns: ٱلْكِتَابُ (al-kitābu)
- **Dammatain (ـٌ)** on indefinite nouns: كِتَابٌ (kitābun)

## Examples from the Quran

### Example 1: Simple Nominal Sentence

<ArabicExample
  arabic="ٱللَّهُ نُورُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ"
  transliteration="allāhu nūru s-samāwāti wa-l-arḍi"
  translation="Allah is the Light of the heavens and the earth"
  reference="An-Nur 24:35"
  highlight="ٱللَّهُ,نُورُ"
/>

**I'rab Analysis:**
- **ٱللَّهُ** (allāhu): Subject (mubtadaʾ / مُبْتَدَأ) — Nominative case, marked by damma (ـُ)
  - **Function:** The topic being described
  - **Case reason:** Subjects of nominal sentences always take nominative case

- **نُورُ** (nūru): Predicate (khabar / خَبَر) — Nominative case, marked by damma (ـُ)
  - **Function:** Information about the subject
  - **Case reason:** Predicates of nominal sentences take the same case as their subjects

**Pattern:** Subject (nominative) + Predicate (nominative) = Nominal sentence structure

### Example 2: Verbal Sentence with Subject

<ArabicExample
  arabic="جَاءَ نَصْرُ ٱللَّهِ وَٱلْفَتْحُ"
  transliteration="jāʾa naṣru llāhi wa-l-fatḥu"
  translation="When the victory of Allah has come and the conquest"
  reference="An-Nasr 110:1"
  highlight="نَصْرُ,ٱلْفَتْحُ"
/>

**I'rab Analysis:**
- **جَاءَ** (jāʾa): Verb — past tense, third person masculine singular
  - **Note:** Verbs don't take case endings; only nouns do

- **نَصْرُ** (naṣru): Subject of verbal sentence (fāʿil / فَاعِل) — Nominative, damma (ـُ)
  - **Function:** The doer of the action
  - **Case reason:** Subjects of verbal sentences take nominative case

- **ٱلْفَتْحُ** (al-fatḥu): Second subject (coordinated with وَ "and") — Nominative, damma (ـُ)
  - **Function:** Second doer (parallel structure)
  - **Case reason:** Coordinated subjects share the same case

**Pattern:** Verb + Subject (nominative) + Coordinated Subject (nominative)

[... continue with 3-5 total examples ...]

## The Rule

<Callout type="rule">
**Four Functions That Take Nominative Case:**

The nominative case (rafʿ / رَفْع) is used for exactly four grammatical functions:

1. **Subject of nominal sentence** (mubtadaʾ / مُبْتَدَأ)
   - The noun you're making a statement about
   - Always comes first in standard nominal sentences

2. **Predicate of nominal sentence** (khabar / خَبَر)
   - The information you're stating about the subject
   - Agrees with subject in case

3. **Subject of verbal sentence** (fāʿil / فَاعِل)
   - The doer of the verb's action
   - Comes after the verb in standard word order

4. **Deputy of the agent** (nāʾib al-fāʿil / نَائِبُ ٱلْفَاعِل) — passive voice
   - You'll learn this in Level 3

**How to identify:** Ask "What's being talked about?" or "Who's doing the action?" That noun takes nominative.
</Callout>

<Callout type="warning">
**Common Mistakes:**

**Don't confuse subject with object.** English word order (Subject-Verb-Object) can mislead you. Arabic verbal sentences are Verb-Subject-Object. The noun AFTER the verb is the subject (nominative), not the object.

**Don't forget coordinated subjects.** When two nouns are joined by وَ (and), both take the same case. If the first is nominative, so is the second.

**Don't apply nominative everywhere.** Not all nouns are subjects! Objects, possessive constructions, and nouns after prepositions take different cases (L2.05, L2.06).
</Callout>

## Practice

<ExerciseBox title="Exercise 1: Identify Nominative Nouns" difficulty="beginner">
In this verse, identify which words are nominative and explain why:

**ٱللَّهُ لَطِيفٌۢ بِعِبَادِهِۦ** (allāhu laṭīfun bi-ʿibādihī) — "Allah is Subtle with His servants"

Which words take nominative case? What function does each serve?

<details>
<summary>Show Answer</summary>

**Nominative words:**
1. **ٱللَّهُ** (allāhu) — Subject (mubtadaʾ), nominative with damma (ـُ)
   - Function: The topic being described
   - Reason: Subjects of nominal sentences are always nominative

2. **لَطِيفٌۢ** (laṭīfun) — Predicate (khabar), nominative with dammatain (ـٌ)
   - Function: Description of the subject
   - Reason: Predicates agree with subjects in nominal sentences

**NOT nominative:**
- **عِبَادِهِۦ** (ʿibādihī) — Genitive, marked by kasra (ـِ)
  - Reason: Follows the preposition بِ (bi-), which requires genitive case

**Key insight:** In a simple nominal sentence, both subject and predicate are nominative. Only the noun after the preposition breaks the pattern.
</details>
</ExerciseBox>

[... 3-4 total exercises with progressive difficulty ...]

## Related Lessons

**Previous lessons:**
- [Introduction to Case Endings](/learn/level-1/case-endings) — Visual recognition of three cases
- [Subject & Predicate](/learn/level-2/subject-predicate) — Understanding nominal sentence components

**Next lessons:**
- [Accusative Case](/learn/level-2/accusative-case) — When and why to use nasb
- [Genitive Case](/learn/level-2/genitive-case) — Complete case system mastery

**Resources:**
- [Case Endings Chart](/resources/case-endings-chart) — Quick reference for all three cases
```

**Source:** Synthesized from STYLE_GUIDE.md template + LSSN-09 i'rab requirement + L1.11 case endings lesson

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Case taught abstractly | Case taught through Quranic examples | Phase 10 (curriculum design) | Students learn grammar in context, not isolation |
| English-only terminology | Bilingual first-mention format | Phase 10 (TERMINOLOGY.md) | Builds Arabic vocabulary while learning grammar |
| Static grammar tables | Interactive components in MDX | Phase 9 (infrastructure) | Engaging learning experience with expandable answers |
| Recognition and mastery mixed | Separate levels: L1 recognize, L2 master | Phase 10 (CURRICULUM_MAP) | Clear progression without cognitive overload |

**No deprecated approaches** — Phase 12 established patterns remain current for Phase 13.

## Open Questions

### 1. Depth of I'rab Analysis for Different Lesson Types

**What we know:** LSSN-09 requires i'rab analysis for "key examples"

**What's unclear:** How detailed should analysis be for different lesson types?
- Sentence structure lessons (L2.01-L2.03) — full analysis expected
- Case lessons (L2.04-L2.06) — obviously requires case analysis
- Inna/kaana sisters (L2.10-L2.11) — analysis of how particles change case?

**Recommendation:**
- Minimum 1 detailed i'rab per lesson (as shown in Pattern 2)
- For case-focused lessons: every example should note case and reason
- For structure lessons: analyze complete sentence, not just target feature
- Validation: "Does this analysis teach the pattern, or just state a fact?"

### 2. Handling Irregular Patterns in Level 2

**What we know:** Level 2 teaches regular/sound patterns (CURRICULUM_MAP)

**What's unclear:** When irregular patterns appear in Quranic examples, how much to explain?
- Example: Sound plurals have different case markers than singular
- Example: Dual forms use different nominative/genitive endings

**Recommendation:**
- Brief mention: "This is a dual form (covered in L1.09), which has special endings you'll master in Level 3"
- Don't digress into full explanation — keep lesson focused
- Link forward: "See [L3.02: Dual Declension](/learn/level-3/dual-declension) for complete rules"
- Trust the curriculum sequencing — Level 2 doesn't need to be exhaustive

## Sources

### Primary (HIGH confidence)

**Project Documentation (Authoritative):**
- `docs/CURRICULUM_MAP.md` — Level 2 lesson objectives, Quranic focus surahs, prerequisite chains
- `docs/STYLE_GUIDE.md` — 5-part lesson structure, transliteration rules, i'rab format examples
- `docs/TERMINOLOGY.md` — Canonical bilingual grammar term list
- `.planning/REQUIREMENTS.md` — LSSN-09 i'rab requirement, PDGY-01 through PDGY-08 pedagogy standards
- `.planning/STATE.md` — Phase 12 decisions establishing patterns for lesson authoring

**Existing Lessons (Reference Implementation):**
- `src/content/lessons/level-1/11-case-endings.mdx` — Shows Level 1 recognition approach, bridge to Level 2
- `src/content/lessons/level-1/10-simple-sentences.mdx` — Sentence type identification, prerequisite for L2.01-L2.03
- `src/content/lessons/level-1/02-short-vowels.mdx` — Example of full transliteration standard

**Infrastructure (Verified by Code Inspection):**
- `scripts/validate-diacritics.ts` — 70% threshold enforcement
- `scripts/validate-terminology.ts` — TERMINOLOGY.md matching
- `scripts/validate-verses.ts` — Reference format checking
- `src/components/mdx/ArabicExample.astro` — Component API and highlight feature
- `package.json` scripts — npm run validate:* command suite

### Secondary (MEDIUM confidence)

**Planning Documents:**
- `.planning/phases/12-level-1-foundation-lessons/12-01-PLAN.md` — Shows established planning pattern for lesson creation
- `.planning/phases/12-level-1-foundation-lessons/12-RESEARCH.md` — Phase 12 research on lesson authoring (now validated by execution)

### Tertiary (Context Only)

**Research Files:**
- `.planning/research/FEATURES.md` — Early feature brainstorming (now superseded by REQUIREMENTS.md)
- `.planning/research/PITFALLS.md` — General content authoring pitfalls (informed Common Pitfalls section)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Infrastructure proven in Phase 12 (11 lessons created successfully)
- Architecture patterns: HIGH — 5-part structure, validation suite, MDX components all validated
- I'rab analysis format: MEDIUM-HIGH — Pattern inferred from L1.11 + LSSN-09 requirement, not yet battle-tested at Level 2 depth
- Pitfalls: HIGH — Based on actual Phase 12 execution experience and STATE.md documented issues

**Research date:** 2026-02-06
**Valid until:** 60 days (stable curriculum, established infrastructure, only content changes)

**Research scope:**
- ✅ Lesson structure and templates
- ✅ I'rab analysis requirements and format
- ✅ Transliteration rules for Level 2
- ✅ Validation tooling and thresholds
- ✅ Common authoring pitfalls
- ✅ Pedagogical progression from Level 1
- ✅ Component usage patterns
- ⚠️ Optimal i'rab depth (addressed in Open Questions)
- ⚠️ Irregular pattern handling (addressed in Open Questions)
