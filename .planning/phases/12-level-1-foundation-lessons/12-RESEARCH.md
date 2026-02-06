# Phase 12: Level 1 Foundation Lessons - Research

**Researched:** 2026-02-06
**Domain:** Educational content authoring, MDX lesson design, Arabic language pedagogy
**Confidence:** HIGH

## Summary

Phase 12 involves creating 11 Foundation-level lessons (L1.01-L1.11) teaching Arabic alphabet, vowels, word types, sentence types, and case system introduction. This research examines the technical and pedagogical requirements for authoring high-quality, engaging Arabic grammar lessons using MDX.

The standard approach combines:
1. **MDX educational authoring** - Using interactive components within Markdown for engaging learning experiences
2. **Graduated pedagogy** - Plain English → analogies → Arabic terminology, with example-heavy instruction
3. **Quality validation** - Automated scripts enforcing diacritics, terminology consistency, and verse references
4. **Build-time tooling** - Verse lookup helpers and validation suite for content quality assurance

The project infrastructure is well-established with comprehensive style guides, terminology standards, validation scripts, and MDX components. The primary challenge is applying these standards consistently across 11 lessons while maintaining pedagogical effectiveness and authentic Quranic examples.

**Primary recommendation:** Follow the 5-part lesson structure (Introduction → Concept → Examples → Rule → Practice) with strict adherence to validation requirements, using the build-time verse lookup tool and validation scripts iteratively during authoring.

## Standard Stack

### Core Infrastructure (Already Implemented)

| Component | Version/Type | Purpose | Why Standard |
|-----------|-------------|---------|--------------|
| Astro v5 | 5.17.1+ | Static site generator with MDX support | Industry standard for content-focused sites, excellent MDX integration |
| MDX | 4.3.13+ (@astrojs/mdx) | Markdown with JSX components | Enables interactive educational components while maintaining author-friendly syntax |
| Zod | Built into Astro content collections | Content schema validation | Type-safe frontmatter ensures all lessons have required fields |
| TypeScript | Via tsx runtime | Script execution and validation | Ensures type safety in validation scripts |

### Supporting Tools (Already Implemented)

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `scripts/validate-content.ts` | Master validation runner | After each lesson draft completion |
| `scripts/validate-diacritics.ts` | Arabic diacritics completeness check | During Arabic text authoring (≥70% ratio required) |
| `scripts/validate-terminology.ts` | Bilingual term consistency verification | When introducing grammar terms |
| `scripts/validate-verses.ts` | Quranic reference format checking | After adding verse references |
| `scripts/fetch-quran-text.ts` | Build-time verse lookup helper | When authoring lessons with Quranic examples |

### MDX Educational Components (Already Implemented)

| Component | Purpose | Required Props |
|-----------|---------|----------------|
| `<ArabicExample>` | Display Quranic verses or Arabic examples | `arabic`, `translation`; optional: `transliteration`, `reference`, `highlight` |
| `<GrammarTable>` | Paradigm tables (cases, pronouns, declensions) | `headers`, `rows`; optional: `caption`, `rtl` |
| `<VerbConjugation>` | Verb paradigms with morphological info | `root`, `headers`, `rows`; optional: `form`, `pattern` |
| `<Callout>` | Highlighted boxes (rules, tips, warnings) | optional: `type` (note/tip/rule/warning), `title` |
| `<ExerciseBox>` | Interactive practice exercises | `question`; optional: `id` |

**Installation:** No installation needed - infrastructure already complete.

## Architecture Patterns

### Recommended Lesson File Structure

```
src/content/lessons/level-1/
├── 01-alphabet-letter-forms.mdx      # L1.01
├── 02-short-vowels.mdx                # L1.02
├── 03-long-vowels-diphthongs.mdx      # L1.03
├── 04-sukun-shadda-tanween.mdx        # L1.04
├── 05-reading-bismillah.mdx           # L1.05
├── 06-three-word-types.mdx            # L1.06
├── 07-definite-article.mdx            # L1.07
├── 08-gender-masculine-feminine.mdx   # L1.08
├── 09-singular-dual-plural.mdx        # L1.09
├── 10-simple-sentences.mdx            # L1.10
└── 11-case-endings.mdx                # L1.11
```

**Naming convention:** `{order}-{slug}.mdx` where:
- `{order}` = zero-padded lesson order (01-11)
- `{slug}` = kebab-case descriptive identifier

### Pattern 1: 5-Part Lesson Structure (MANDATORY)

**What:** Every lesson MUST follow this exact structure per STYLE_GUIDE.md

**When to use:** All 11 Level 1 lessons without exception

**Template:**
```mdx
---
title: "Lesson Title"
level: 1
order: 1
description: "Brief SEO-friendly description"
---

import ArabicExample from '@components/mdx/ArabicExample.astro';
import GrammarTable from '@components/mdx/GrammarTable.astro';
import Callout from '@components/mdx/Callout.astro';
import ExerciseBox from '@components/mdx/ExerciseBox.astro';

## Introduction

[Hook with Quranic example using <ArabicExample>]
[2-3 bullet point learning objectives]
[Connection to previous lesson]

## Understanding [Concept Name]

[Plain English explanation FIRST - no Arabic terminology]
[English analogy - "Think of X like English Y..."]
[Introduce Arabic terminology LAST with bilingual format]

## Examples from the Quran

[3-5 examples using <ArabicExample> component]
[Show pattern progression: simple → complex]
[Include word-by-word breakdowns for key examples]

## The Rule

<Callout type="rule" title="...">
[Concise rule statement in 1-3 sentences]
[Related lesson cross-references]
</Callout>

<Callout type="warning" title="Common Mistakes">
[Typical errors to avoid]
</Callout>

## Practice

<ExerciseBox question="...">
[Answer with explanation]
</ExerciseBox>

[3-4 total exercises with progressive difficulty]

## Related Lessons

[Links to prerequisite and next lessons]
```

**Source:** `/Users/daodilyas/quran-learn/docs/STYLE_GUIDE.md` lines 19-285

### Pattern 2: Graduated Transliteration by Level

**What:** Transliteration decreases as learners progress through levels

**Level 1-2 Rule:** FULL transliteration for ALL Arabic text

**Example:**
```mdx
<ArabicExample
  arabic="ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ"
  transliteration="al-ḥamdu li-llāhi rabbi l-ʿālamīna"
  translation="All praise is for Allah, Lord of all worlds"
  reference="Al-Fatiha 1:2"
/>
```

**Critical:** Level 1 requires transliteration for every verse and Arabic term. Do NOT skip this - it supports pronunciation and builds learner confidence.

**Source:** `/Users/daodilyas/quran-learn/docs/STYLE_GUIDE.md` lines 376-394

### Pattern 3: Bilingual Terminology Introduction (First-Mention Rule)

**What:** On first mention of any Arabic grammar term, use full bilingual format with glossary link

**Format:** `[English](/resources/glossary#anchor) (transliteration / عَرَبِي)`

**Example:**
```markdown
In Arabic grammar, this structure is called [nominal sentence](/resources/glossary#jumlah-ismiyyah) (jumlah ismiyyah / جُمْلَة اِسْمِيَّة).
```

**After first mention:** Can use English-only or English (Arabic) shorthand

**Source:** `/Users/daodilyas/quran-learn/docs/TERMINOLOGY.md` lines 13-28

### Pattern 4: Progressive Example Difficulty

**What:** Show 3-5 examples progressing from simple to complex before stating the rule

**Pedagogical sequence:**
1. **Example 1:** Simplest case - single concept demonstration
2. **Example 2:** Slight variation - shows pattern consistency
3. **Example 3:** Added complexity - introduces nuance
4. **Example 4-5:** Real-world Quranic usage - synthesis

**Rationale:** Example-heavy approach per PDGY-04 - learners internalize patterns before abstract rules

**Source:** `/Users/daodilyas/quran-learn/docs/STYLE_GUIDE.md` lines 102-147

### Anti-Patterns to Avoid

- **Introducing multiple major concepts per lesson:** Violates PDGY-08 (one concept per lesson) - causes cognitive overload
- **Arabic terminology before English explanation:** Violates PDGY-01 (plain English first) - learners need familiar language foundation
- **Skipping transliteration at Level 1:** Violates LSSN-11 (full transliteration L1-2) - learners still mastering reading
- **Incomplete diacritics:** Violates LSSN-07 (every letter marked) - creates ambiguity and fails validation (≥70% ratio required)
- **Exercises without explanations:** Violates pedagogical best practice - learners need "why" not just "what"

## Don't Hand-Roll

Problems with existing robust solutions in the project:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Verse reference formatting | Manual string formatting | `scripts/fetch-quran-text.ts` with `--format mdx` | Generates correct reference format, provides metadata validation |
| Arabic text validation | Manual diacritics checking | `npm run validate:diacritics` | Automated Unicode analysis for ≥70% diacritics ratio |
| Terminology consistency | Manual term searching | `npm run validate:terminology` | Enforces first-mention format and canonical term matching |
| Component imports | Copy-paste from other files | Use lesson template in STYLE_GUIDE.md | Pre-validated import statements |
| Transliteration scheme | Custom romanization | Simplified ALA-LC per STYLE_GUIDE.md Section 2 | Standardized, validated character mappings (ḥ, ṣ, ḍ, ṭ, ẓ, ā, ī, ū) |

**Key insight:** The validation suite catches authoring errors that would otherwise require manual QA. Run validations iteratively (after each lesson) rather than batch-validating all 11 at the end.

## Common Pitfalls

### Pitfall 1: Diacritics Validation Threshold Confusion

**What goes wrong:** Authors add Arabic text but validation fails with "67% diacritics ratio" even though text appears fully vocalized

**Why it happens:**
- Validation threshold is 70% (7 diacritical marks per 10 letters)
- Isolated morphemes (suffix tables) are challenging to meet threshold
- Special Unicode characters like dagger alif (U+0670) not recognized as diacritic by validator

**How to avoid:**
- For full words and verses: Ensure EVERY letter has fatha/kasra/damma/sukun/shadda
- For isolated suffixes in tables: Use transliteration instead of Arabic (validation exemption)
- Strategic sukūn marks acceptable to meet threshold without changing pronunciation
- Audit against Tanzil.net text (authoritative source with complete tashkeel)

**Warning signs:** Validation error mentioning ratio below 0.70

**Source:** `/Users/daodilyas/quran-learn/.planning/STATE.md` lines 103-104, 106

### Pitfall 2: Terminology Validator False Positives

**What goes wrong:** Validator flags terms that are correctly formatted or appear in legitimate contexts

**Why it happens:**
- Validator lacks context awareness - matches letter combinations in any word
- Special characters (parentheses, hyphens) in term.english not escaped in regex
- TERMINOLOGY.md vocalization inconsistencies cause conflicts

**How to avoid:**
- Introduce hamza forms early (ء، أ، إ) to prevent false matches later
- Verify term exactly matches TERMINOLOGY.md (case, diacritics, transliteration)
- If false positive is unavoidable, document in lesson comments for future reference
- Check TERMINOLOGY.md has ≥70% vocalization on all Arabic entries

**Warning signs:** Validator complaining about terms that appear correct

**Source:** `/Users/daodilyas/quran-learn/.planning/STATE.md` lines 102-105

### Pitfall 3: Transliteration Inconsistencies

**What goes wrong:** Different transliteration styles within or across lessons

**Why it happens:**
- Authors familiar with different romanization systems (Buckwalter, ISO 233, etc.)
- Special characters (ḥ, ʿ, ʾ) confused with regular ASCII
- Copy-paste from external sources with different conventions

**How to avoid:**
- Use ONLY simplified ALA-LC per STYLE_GUIDE.md Section 2
- Required special characters: underdot (ḥ, ṣ, ḍ, ṭ, ẓ), macron (ā, ī, ū), modifier letters (ʾ hamza, ʿ ayn)
- Do NOT use regular apostrophe (') for hamza or ayn - use proper Unicode (U+02BE, U+02BF)
- Definite article ALWAYS "al-" even before sun letters (al-shams not ash-shams)
- Use reference table in STYLE_GUIDE.md lines 293-360 as single source of truth

**Warning signs:** Inconsistent character usage across examples

### Pitfall 4: Quranic Verse Selection Without Pedagogical Alignment

**What goes wrong:** Selecting verses that are grammatically complex for the concept being taught

**Why it happens:**
- Authors select famous verses without analyzing grammatical complexity
- Curriculum map provides surah guidance but not specific verse analysis
- Desire to use beautiful/meaningful verses overrides pedagogical needs

**How to avoid:**
- Reference CURRICULUM_MAP.md "Quranic Focus" for each lesson (pre-selected surahs)
- Choose verses with ONLY the grammatical feature being taught (avoid multi-concept examples)
- Early lessons (L1.01-L1.05): Use Juz 'Amma surahs (shortest, simplest)
- Verify verse has complete tashkeel in Tanzil.net before using
- Ask: "Can I explain this verse using ONLY concepts from current and prior lessons?"

**Warning signs:** Needing to explain advanced concepts to parse a verse in a foundation lesson

### Pitfall 5: Exercise Difficulty Mismatch

**What goes wrong:** Practice exercises too easy (repetitive) or too difficult (frustrating)

**Why it happens:**
- Authors underestimate cognitive load for true beginners
- Desire to "challenge" learners leads to premature complexity
- Exercises created without referencing lesson objectives

**How to avoid:**
- Map each exercise to specific learning objective from Introduction
- Progressive difficulty: Identification → Analysis → Production
- Exercise 1: Direct application of rule with scaffolding
- Exercise 2: Same pattern, less scaffolding
- Exercise 3-4: Synthesis requiring reasoning but within lesson scope
- Include answer EXPLANATIONS not just answers (teach metacognition)

**Warning signs:** Exercises requiring concepts not yet introduced, or all exercises feeling identical

## Code Examples

Verified patterns from project infrastructure:

### Complete Lesson Frontmatter

```yaml
---
title: "Arabic Alphabet & Letter Forms"
level: 1
order: 1
description: "Learn to recognize all 28 Arabic letters in their isolated, initial, medial, and final forms."
draft: false
---
```

**Source:** `/Users/daodilyas/quran-learn/src/content.config.ts` lines 14-28

### Verse Lookup Workflow (Build-time)

```bash
# Step 1: Get verse metadata and MDX template
npx tsx scripts/fetch-quran-text.ts "Al-Fatiha 1:2" --format mdx

# Step 2: Copy template to lesson file
# Step 3: Source verse text from Tanzil.net
# Step 4: Fill in arabic, transliteration, translation
# Step 5: Validate
npm run validate:verses
npm run validate:diacritics
```

**Source:** `/Users/daodilyas/quran-learn/scripts/fetch-quran-text.ts` lines 187-235

### Complete ArabicExample with Full Vocalization

```mdx
<ArabicExample
  arabic="بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"
  transliteration="bismi llāhi r-raḥmāni r-raḥīmi"
  translation="In the name of Allah, the Most Gracious, the Most Merciful"
  reference="Al-Fatiha 1:1"
  highlight="ٱللَّهِ"
/>
```

**Notes:**
- Every consonant has diacritic (even if sukun ـْ for no vowel)
- Alif wasla (ٱ) shown correctly
- Transliteration follows al- prefix rule
- Reference format: [Surah Name Chapter:Verse]

### GrammarTable for Case Endings

```mdx
<GrammarTable
  caption="The Three Cases"
  headers={["Case", "Arabic Name", "Marker", "Example"]}
  rows={[
    ["Nominative", "رَفْع", "ـُ (damma)", "مُحَمَّدٌ"],
    ["Accusative", "نَصْب", "ـَ (fatha)", "مُحَمَّدًا"],
    ["Genitive", "جَرّ", "ـِ (kasra)", "مُحَمَّدٍ"]
  ]}
/>
```

**Note:** Isolated suffixes may use transliteration to meet validation threshold

**Source:** `/Users/daodilyas/quran-learn/docs/STYLE_GUIDE.md` lines 567-586

### ExerciseBox with Detailed Explanation

```mdx
<ExerciseBox question="What case is the word ٱللَّهُ in this phrase: ٱلْحَمْدُ لِلَّهِ">

**Answer:** Genitive (jarr / جَرّ)

**Explanation:** The word ٱللَّهُ (Allah) is preceded by the preposition لِ (li-), which always triggers the genitive case. You can see the kasrah (ـِ) ending: لِلَّهِ (li-llāhi).

The preposition لِ (li-) means "for" or "to" and is one of the genitive particles (حُرُوف الجَرّ).

**Related:** See [Lesson 2.07: Prepositions](/learn/level-2/prepositions) for the complete list of genitive particles.

</ExerciseBox>
```

**Source:** `/Users/daodilyas/quran-learn/docs/STYLE_GUIDE.md` lines 640-668

### Bilingual Terminology First-Mention

```markdown
In Arabic, words are divided into three categories. The first is [noun](/resources/glossary#ism) (ism / اِسْم), which refers to a person, place, thing, or idea. The second is [verb](/resources/glossary#fil) (fiʿl / فِعْل), which indicates an action bound to time. The third is [particle](/resources/glossary#harf) (ḥarf / حَرْف), which has meaning only in context with other words.
```

**Pattern:**
1. English explanation first
2. Glossary link on term
3. Bilingual format: `(transliteration / عَرَبِي)`
4. Subsequent mentions can drop transliteration/Arabic

## State of the Art

### Current Best Practices (2026)

| Traditional Approach | Modern Approach | Impact |
|---------------------|-----------------|--------|
| Rote memorization of grammar rules | Example-heavy pattern recognition before rules | Higher retention, reduced cognitive load |
| Arabic-first instruction | Plain English → analogies → Arabic terminology | Accessible to non-native speakers, lower entry barrier |
| Linear textbook reading | Interactive MDX components (exercises, tables) | Active engagement, immediate feedback |
| Isolated grammar study | Quranic verse examples from lesson 1 | Immediate relevance, motivation through authentic material |
| Manual content validation | Automated validation suite | Consistent quality, catches errors pre-publication |

**Modern Insight:** Interactive educational content using MDX enables immediate learner feedback and engagement impossible with static Markdown or traditional textbooks. Integration of React components within educational prose creates a "digital textbook 2.0" experience.

**Source:** Web search results:
- [Using MDX for Educational Content and Tutorials](https://www.mdxblog.io/blog/using-mdx-for-e-learning-content-and-tutorials)
- [Introduction to MDX — How To Create Interactive Documentation](https://medium.com/@techwritershub/introduction-to-mdx-how-to-create-interactive-documentation-d3fe5c5b6b23)

### Arabic Pedagogy Evolution

| Old Approach | Current Best Practice | When Changed | Impact |
|--------------|----------------------|--------------|--------|
| Grammar-translation method | Communicative approach with authentic texts | 2010s+ | Focus on Quranic understanding rather than translation exercises |
| Classical Arabic only | Dialects acknowledged, MSA primary, Quranic focus | 2020+ | Recognizes linguistic diversity while maintaining Quranic goal |
| Grammar syllabus unclear | Functional grammar aligned with real-world needs | 2020s | Practical application over theoretical completeness |

**Pedagogical Shift:** Careful sequencing from known (English grammar concepts) to unknown (Arabic grammar structures) using analogies and concrete examples before abstract terminology. Progressive disclosure of complexity aligned with CEFR-inspired proficiency levels.

**Source:** Web search results:
- [Integrating technology into the Arabic language curriculum](https://www.sciencedirect.com/science/article/pii/S2590291125007028)
- [Advancing Arabic Language Teaching and Learning](https://documents1.worldbank.org/curated/en/909741624654308046/pdf/Advancing-Arabic-Language-Teaching-and-Learning-A-Path-to-Reducing-Learning-Poverty-in-the-Middle-East-and-North-Africa.pdf)
- [The development of an Arabic curriculum framework based on CEFR](https://www.tandfonline.com/doi/full/10.1080/09571736.2021.1923781)

**Deprecated/outdated:**
- **Rote memorization without context:** Modern pedagogy emphasizes pattern recognition and application
- **Grammar-before-examples:** Now reversed - examples before rules (inductive learning)
- **Single-channel content:** Static text replaced by multimedia, interactive components

## Open Questions

### 1. Quranic Text Sourcing Strategy

**What we know:**
- Tanzil.net provides authoritative Quranic text with complete tashkeel
- Build-time helper (`fetch-quran-text.ts`) generates MDX templates
- Manual copy-paste from Tanzil.net currently required

**What's unclear:**
- Should we download Tanzil dataset for automated population?
- License compatibility for embedding Quranic text in repository?
- Which Tanzil format: Simple, Simple-Enhanced, or Uthmani?

**Recommendation:**
- Start with manual sourcing from Tanzil.net Simple Enhanced format (BLOCKER resolved when dataset downloaded per STATE.md)
- Document source URL in comments for each verse
- Consider automated download in future iteration if license permits

### 2. Expert Validation Workflow

**What we know:**
- Content requires expert validation (Arabic linguist + Muslim educator per STATE.md line 99)
- 11 lessons represent significant content volume
- Validation should happen before final publication

**What's unclear:**
- Should validation happen per-lesson or batch-after-11?
- What specific criteria do experts validate? (theological accuracy, pedagogical effectiveness, linguistic correctness?)
- How are expert feedback cycles integrated with git workflow?

**Recommendation:**
- Plan for expert review after drafting all 11 lessons (batch approach)
- Create expert feedback template with specific criteria
- Use git branches for expert revisions to maintain version control

### 3. Transliteration Tool Needs

**What we know:**
- Simplified ALA-LC requires specific Unicode characters (ḥ, ʿ, ā, etc.)
- Manual typing of these characters is slow and error-prone

**What's unclear:**
- Should we build a transliteration input helper?
- Are there existing tools that match our ALA-LC scheme?
- Can we integrate transliteration assistance into authoring workflow?

**Recommendation:**
- For Phase 12: Manual authoring using character map/keyboard shortcuts
- Document common character input methods in authoring guide
- Consider transliteration helper tool in future phase if manual input proves too slow

### 4. Lesson Interdependency Verification

**What we know:**
- CURRICULUM_MAP.md defines prerequisites for each lesson
- L1.01 is entry point (no prerequisites)
- Later lessons build on earlier ones

**What's unclear:**
- How to validate that lessons don't reference concepts from future lessons?
- Should cross-references be validated programmatically?

**Recommendation:**
- Manual verification during authoring (author responsibility)
- Peer review checklist includes "no forward references" check
- Consider building prerequisite validator in future if forward-reference errors frequent

## Sources

### Primary (HIGH confidence)

- **Project documentation:**
  - `/Users/daodilyas/quran-learn/docs/CURRICULUM_MAP.md` - 73-lesson curriculum with Level 1 objectives, prerequisites, Quranic focus
  - `/Users/daodilyas/quran-learn/docs/STYLE_GUIDE.md` - 5-part lesson structure, transliteration scheme, MDX component usage
  - `/Users/daodilyas/quran-learn/docs/TERMINOLOGY.md` - Canonical bilingual grammar terms with first-mention format
  - `/Users/daodilyas/quran-learn/.planning/STATE.md` - Current blockers, decisions, known validation issues

- **Codebase infrastructure:**
  - `/Users/daodilyas/quran-learn/src/content.config.ts` - Zod schema for lesson validation
  - `/Users/daodilyas/quran-learn/scripts/validate-*.ts` - Validation suite (diacritics, terminology, verses, content)
  - `/Users/daodilyas/quran-learn/scripts/fetch-quran-text.ts` - Build-time verse lookup helper
  - `/Users/daodilyas/quran-learn/src/components/mdx/*.astro` - Educational MDX components

### Secondary (MEDIUM confidence)

- **MDX educational authoring:**
  - [Using MDX for Educational Content and Tutorials](https://www.mdxblog.io/blog/using-mdx-for-e-learning-content-and-tutorials) - Interactive content best practices
  - [Introduction to MDX — How To Create Interactive Documentation](https://medium.com/@techwritershub/introduction-to-mdx-how-to-create-interactive-documentation-d3fe5c5b6b23) - MDX component patterns

- **Arabic pedagogy:**
  - [Integrating technology into the Arabic language curriculum](https://www.sciencedirect.com/science/article/pii/S2590291125007028) - Modern pedagogical strategies
  - [Advancing Arabic Language Teaching and Learning](https://documents1.worldbank.org/curated/en/909741624654308046/pdf/Advancing-Arabic-Language-Teaching-and-Learning-A-Path-to-Reducing-Learning-Poverty-in-the-Middle-East-and-North-Africa.pdf) - Curriculum design challenges
  - [The development of an Arabic curriculum framework based on CEFR](https://www.tandfonline.com/doi/full/10.1080/09571736.2021.1923781) - Functional grammar alignment

### Tertiary (LOW confidence - general reference)

- **Quranic Arabic teaching:**
  - [Quranic Grammar Corpus](https://corpus.quran.com/documentation/grammar.jsp) - Reference for grammatical analysis
  - [Studio Arabiya Quranic Grammar](https://studioarabiya.com/course/quranic-grammar/) - Example of structured course
  - Various online Arabic grammar courses - General pedagogy insights

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Infrastructure fully implemented and validated through Phase 11
- Architecture patterns: HIGH - Comprehensive style guide, terminology standards, and templates in place
- Validation tooling: HIGH - Complete suite tested through reference resources phase
- Pedagogical approach: MEDIUM - Guided by strong documentation but requires application across 11 lessons
- Quranic text sourcing: MEDIUM - Manual workflow clear, automated approach pending dataset
- Expert validation: LOW - Workflow needs establishment per STATE.md blocker

**Research coverage:**
- ✅ Lesson structure and template patterns
- ✅ MDX component usage and validation
- ✅ Transliteration and bilingual terminology standards
- ✅ Arabic diacritics requirements and validation
- ✅ Quranic verse selection and referencing
- ✅ Exercise design and pedagogical progression
- ⚠️ Expert validation workflow (needs establishment)
- ⚠️ Quranic text dataset integration (pending download)

**Research date:** 2026-02-06
**Valid until:** 60 days (stable infrastructure, standards unlikely to change)

**Next steps for planning:**
- Break 11 lessons into logical task grouping (by complexity or prerequisite chains)
- Define specific Quranic verses for each lesson based on CURRICULUM_MAP.md focus
- Establish validation checkpoints (after each lesson vs. after groups)
- Plan expert review integration point (after draft completion recommended)
